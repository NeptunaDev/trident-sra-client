"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createPolicy, updatePolicy, CreatePolicy, Policy } from "@/lib/policy"
import { Organization } from "@/lib/organization"
import { getCurrentUser } from "@/lib/user"

import { useloadingStore } from "@/store/loadingStore"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectSearch } from "@/components/ui/select-search"


interface CreateEditRecordingModalProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    organizations: Organization[]
    editingPolicies : Policy | null 
}

const INITIAL_FORM: CreatePolicy = {
    organization_id: "",
    name: "",
    description: "",
    blocked_patterns: ["fulanito"],
    applies_to_roles: ["admin"],
    is_active: true,
    create_by_user_id: "",
}

export default function CreateEditRecordingModal({ isOpen, setIsOpen, organizations, editingPolicies }: CreateEditRecordingModalProps) {
    const isEditing = !!editingPolicies
    const [disabled, setDisabled] = useState(false)
    const [form, setForm] = useState<CreatePolicy>(INITIAL_FORM)

    const { isLoading, setIsLoading } = useloadingStore()
    const queryClient = useQueryClient()

    const { data: currentUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser
    })

    const { mutate, isPending } = useMutation({
        mutationFn: createPolicy,
        onSuccess: () => {
            setIsOpen(false)
            setForm(INITIAL_FORM)
            queryClient.invalidateQueries({
                queryKey: ["policies"]
            })
        }, 
        onError: (error: any) => {
            const message = error.message || 'Failed to create policy'
            alert(message)
            setIsLoading(false)
        }
    })

    const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
        mutationFn: updatePolicy,
        onSuccess: () => {
            setIsOpen(false)
            setForm(INITIAL_FORM)
            queryClient.invalidateQueries({
                queryKey: ["policies"]
            })
        },
        onError: (error: any) => {
            const message = error.message || 'Failed to update policy'
            alert(message)
            setIsLoading(false)
        }
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleSave = async () => {
        if (!currentUser) return
        
        if(isEditing) {
            updateMutate({
                id: editingPolicies?.id ?? "",
                ...(form.organization_id !== editingPolicies.organization_id ? { organization_id: form.organization_id } : {}),
                ...(form.name !== editingPolicies.name ? { name: form.name } : {}),
                ...(form.description !== editingPolicies.description ? { description: form.description } : {}),
                ...(form.blocked_patterns !== editingPolicies.blocked_patterns ? { blocked_patterns: form.blocked_patterns } : {}),
                ...(form.applies_to_roles !== editingPolicies.applies_to_roles ? { applies_to_roles: form.applies_to_roles } : {}),
                ...(form.is_active !== editingPolicies.is_active ? { is_active: form.is_active } : {}),
            })
            return
        } 
        mutate({
            ...form,
            create_by_user_id: currentUser.id
        })
    }
    useEffect(() => {
        Object.values(form).forEach((value) => {
            if (value.toString().trim() === "") {
                setDisabled(true)
                return
            }
        })
        setDisabled(false)
    }, [form])

    useEffect(() => {
        if (isPending !== isLoading || isUpdatePending !== isLoading ){
            setIsLoading(isPending || isUpdatePending)
        }
    }, [isPending, isUpdatePending])

    useEffect(() => {
        if (!isEditing) {
            setForm(INITIAL_FORM)
            return
        }
        setForm({
            organization_id: editingPolicies.organization_id,
            name: editingPolicies.name,
            description: editingPolicies.description,
            blocked_patterns: editingPolicies.blocked_patterns,
            applies_to_roles: editingPolicies.applies_to_roles,
            is_active: editingPolicies.is_active,
            create_by_user_id: editingPolicies.created_by_user_id,
        })
    }, [editingPolicies, isEditing])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">{isEditing ? "Edit" : "Create"} Policy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Organization</Label>
                        <SelectSearch
                            items={organizations?.map((organization) => ({ label: organization.name, value: organization.id })) ?? []}
                            value={form.organization_id}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, organization_id: value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Name</Label>
                        <Input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Policy Name"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Description</Label>
                        <Input
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Policy description"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Blocked Patterns (comma separated)</Label>
                        <Input
                            name="blocked_patterns"
                            value={form.blocked_patterns.join(", ")}
                            onChange={(e) => {
                                const patterns = e.target.value.split(",").map(p => p.trim()).filter(p => p !== "")
                                setForm((prev) => ({ ...prev, blocked_patterns: patterns }))
                            }}
                            placeholder="rm, sudo, reboot"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Applies to Roles (comma separated)</Label>
                        <Input
                            name="applies_to_roles"
                            value={form.applies_to_roles.join(", ")}
                            onChange={(e) => {
                                const roles = e.target.value.split(",").map(r => r.trim()).filter(r => r !== "")
                                setForm((prev) => ({ ...prev, applies_to_roles: roles }))
                            }}
                            placeholder="admin, user, guest"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={form.is_active}
                            onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                            className="w-4 h-4"
                        />
                        <Label htmlFor="is_active" className="text-[#c0c5ce] cursor-pointer">
                            Is Active
                        </Label>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-white hover:bg-[#11111f]">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={disabled}
                        className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold disabled:opacity-50"
                    >
                        {isEditing ? "Update" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}



    
