"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { CreateParticipant, updateParticipant, createParticipant, Participant } from "@/lib/participant"
import { getSession } from "@/lib/session"
import { getUser } from "@/lib/user"

import { useloadingStore } from "@/store/loadingStore"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectSearch } from "@/components/ui/select-search"
import { Switch } from "@/components/ui/switch"

interface CreateEditParticipantModalProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    editingParticipant: Participant | null
}
    
const INITIAL_FORM: CreateParticipant = {
    session_id: "",
    user_id: "",
    role: "",
    can_write: false,
}
export default function CreateEditParticipantModal({ isOpen, setIsOpen, editingParticipant }: CreateEditParticipantModalProps) {
    const isEditing = !!editingParticipant
    const [disabled, setDisabled] = useState(false)
    const [form, setForm] = useState<CreateParticipant>(INITIAL_FORM)

    const { setIsLoading } = useloadingStore()
    const queryClient = useQueryClient()

    const { data: sessions } = useQuery({
        queryKey: ["sessions"],
        queryFn: getSession
    })  

    const { data: users } = useQuery({
        queryKey: ["users"],
        queryFn: getUser
    }) 
    const { mutate, isPending } = useMutation({
        mutationFn: createParticipant,
        onSuccess: () => {
            setIsOpen(false)
            setForm(INITIAL_FORM)
            queryClient.invalidateQueries({
                queryKey: ["participants"]
            })
        }
    })
    
    const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
        mutationFn: updateParticipant,
        onSuccess: () => {
            setIsOpen(false)
            setForm(INITIAL_FORM)
            queryClient.invalidateQueries({
                queryKey: ["participants"]
            })
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setForm((prev: CreateParticipant) => ({
            ...prev,
            [name]: value
        }))
    }
    
    const handleSave = () => {
        if (isEditing) {
            updateMutate({
                id: editingParticipant?.id ?? "",
                ...(form.session_id !== editingParticipant.session_id ? { session_id: form.session_id } : {}),
                ...(form.user_id !== editingParticipant.user_id ? { user_id: form.user_id } : {}),
                ...(form.role !== editingParticipant.role ? { role: form.role } : {}),
                ...(form.can_write !== editingParticipant.can_write ? { can_write: form.can_write } : {}),
                ...(form.is_active !== editingParticipant.is_active ? { is_active: form.is_active } : {}),
            })
            return
        }
        
        mutate(form)
    }

    // Management the state the disabled
    useEffect(() => {
        if (!form.session_id || !form.user_id || !form.role) {
            setDisabled(true)
            return
        }
        setDisabled(false)
    }, [form])

    // Management the state the loading
    useEffect(() => {
        setIsLoading(isPending || isUpdatePending)
    }, [isPending, isUpdatePending, setIsLoading])

    // Management the state the editing participant
    useEffect(() => {
        if (!isEditing) {
            setForm(INITIAL_FORM)
            return
        }
        setForm({
            session_id: editingParticipant?.session_id ?? "",
            user_id: editingParticipant?.user_id ?? "",
            role: editingParticipant?.role ?? "",
            can_write: editingParticipant?.can_write ?? false,
            is_active: editingParticipant?.is_active ?? true,
        })
    }, [editingParticipant, isEditing])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">{isEditing ? "Edit" : "Create"} Participant</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Session</Label>
                        <SelectSearch
                            items={sessions?.map((session) => ({ 
                                label: `${session.public_session_id} - ${session.status}`, 
                                value: session.id 
                            })) ?? []}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, session_id: value }))}
                            value={form.session_id}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">User</Label>
                        <SelectSearch
                            items={users?.map((user) => ({ 
                                label: `${user.name} (${user.email})`, 
                                value: user.id 
                            })) ?? []}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, user_id: value }))}
                            value={form.user_id}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Role</Label>
                        <Input
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            placeholder="viewer, editor, admin, etc."
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label className="text-[#c0c5ce]">Can Write</Label>
                        <Switch
                            checked={form.can_write}
                            onCheckedChange={(checked) => setForm((prev) => ({ ...prev, can_write: checked }))}
                        />
                    </div>
                    {isEditing && (
                        <div className="flex items-center justify-between space-x-2">
                            <Label className="text-[#c0c5ce]">Is Active</Label>
                            <Switch
                                checked={form.is_active ?? true}
                                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
                            />
                        </div>
                    )}
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