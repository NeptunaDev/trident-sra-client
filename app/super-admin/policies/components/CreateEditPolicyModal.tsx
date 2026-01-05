"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod" 
import { FormError } from "@/components/ui/form-error"
import { CreatePolicyFormData, getCreatePolicySchema, getUpdatePolicySchema } from "@/lib/Policy/policy.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createPolicy, updatePolicy, Policy } from "@/lib/Policy/policy"
import { Organization } from "@/lib/organization/organization"
import { getCurrentUser } from "@/lib/user/user"

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

export default function CreateEditRecordingModal({ 
    isOpen, 
    setIsOpen, 
    organizations, 
    editingPolicies 
}: CreateEditRecordingModalProps) {
    const isEditing = !!editingPolicies
    const { setIsLoading } = useloadingStore()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
        watch,
    } = useForm<CreatePolicyFormData>({
        resolver: zodResolver(isEditing ? getUpdatePolicySchema() : getCreatePolicySchema()) as any,
        mode: "onBlur",
        defaultValues: {
            organization_id: "",
            name: "",
            description: "",
            blocked_patterns: [],
            applies_to_roles: [],
            is_active: true,
        }
    })
    
    const { data: currentUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreatePolicyFormData) => {
            if (!currentUser) throw new Error("User not logged in")
            return createPolicy({
                ...data,
                create_by_user_id: currentUser.id,
            })
        },
        onSuccess: () => {
            setIsOpen(false)
            reset()
            queryClient.invalidateQueries({
                queryKey: ["policies"]
            })
        }
    })

    const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
        mutationFn: updatePolicy,
        onSuccess: () => {
            setIsOpen(false)
            reset()
            queryClient.invalidateQueries({
                queryKey: ["policies"]
            })
        }
    })

    const onSubmit = (data: CreatePolicyFormData) => {
        if (!isEditing) {
            mutate(data)
            return
        }
        updateMutate({
            id: editingPolicies?.id ?? "",
            ...(data.organization_id !== editingPolicies?.organization_id ? { organization_id: data.organization_id } : {}),
            ...(data.name !== editingPolicies?.name ? { name: data.name } : {}),
            ...(data.description !== editingPolicies?.description ? { description: data.description } : {}),
            ...(JSON.stringify(data.blocked_patterns) !== JSON.stringify(editingPolicies?.blocked_patterns) ? { blocked_patterns: data.blocked_patterns } : {}),
            ...(JSON.stringify(data.applies_to_roles) !== JSON.stringify(editingPolicies?.applies_to_roles) ? { applies_to_roles: data.applies_to_roles } : {}),
            ...(data.is_active !== editingPolicies?.is_active ? { is_active: data.is_active } : {}),
        })
    }

    // Watch select values
    const organizationId = watch("organization_id")
    const blockedPatterns = watch("blocked_patterns")
    const appliesToRoles = watch("applies_to_roles")
    const isActive = watch("is_active")

    // Manage loading state
    useEffect(() => {
        setIsLoading(isPending || isUpdatePending)
    }, [isPending, isUpdatePending, setIsLoading])

    // Manage form state when editing policy
    // Reset form when edit mode changes
    useEffect(() => {
        if (!isOpen) return
        if (!isEditing || !editingPolicies) {
            reset({
                organization_id: "",
                name: "",
                description: "",
                blocked_patterns: [],
                applies_to_roles: [],
                is_active: true,
            })
            return
        }
        reset({
            organization_id: editingPolicies.organization_id ?? "",
            name: editingPolicies.name,
            description: editingPolicies.description ?? "",
            blocked_patterns: editingPolicies.blocked_patterns ?? [],
            applies_to_roles: editingPolicies.applies_to_roles ?? [],
            is_active: editingPolicies.is_active ?? true,
        })
    }, [isOpen, isEditing, editingPolicies, reset])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">{isEditing ? "Edit" : "Create"} Policy</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Organization</Label>
                        <SelectSearch
                            items={organizations?.map((organization) => ({ label: organization.name, value: organization.id })) ?? []}
                            value={organizationId}
                            onValueChange={(value) => setValue("organization_id", value, { shouldValidate: true })}
                            error={!!errors.organization_id}
                        />
                        <FormError message={errors.organization_id?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Name</Label>
                        <Input
                            {...register("name")}
                            error={!!errors.name}
                            placeholder="Policy Name"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                        <FormError message={errors.name?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Description</Label>
                        <Input
                            {...register("description")}
                            error={!!errors.description}
                            placeholder="Policy description"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                        <FormError message={errors.description?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Blocked Patterns (comma separated)</Label>
                        <Input
                            value={blockedPatterns?.join(", ") ?? ""}
                            onChange={(e) => {
                                const patterns = e.target.value.split(",").map(p => p.trim()).filter(p => p !== "")
                                setValue("blocked_patterns", patterns, { shouldValidate: true })
                            }}
                            placeholder="rm, sudo, reboot"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Applies to Roles (comma separated)</Label>
                        <Input
                            value={appliesToRoles?.join(", ") ?? ""}
                            onChange={(e) => {
                                const roles = e.target.value.split(",").map(r => r.trim()).filter(r => r !== "")
                                setValue("applies_to_roles", roles, { shouldValidate: true })
                            }}
                            placeholder="admin, user, guest"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={isActive}
                            onChange={(e) => setValue("is_active", e.target.checked, { shouldValidate: true })}
                            className="w-4 h-4"
                        />
                        <Label htmlFor="is_active" className="text-[#c0c5ce] cursor-pointer">
                            Is Active
                        </Label>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button 
                            type="button"
                            variant="ghost" 
                            onClick={() => setIsOpen(false)} 
                            className="text-white hover:bg-[#11111f]"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || isUpdatePending || !isValid}
                            className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold disabled:opacity-50"
                        >
                            {isEditing ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}



    
