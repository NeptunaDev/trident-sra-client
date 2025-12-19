"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createSession, updateSession, CreateSession, Session } from "@/lib/session"
import { getCurrentUser } from "@/lib/user"
import { getConnections } from "@/lib/connections"

import { useloadingStore } from "@/store/loadingStore"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectSearch } from "@/components/ui/select-search"
import { Switch } from "@/components/ui/switch"

interface CreateEditModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  editingSession: Session | null
} 

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Ended", value: "ended" },
  { label: "Error", value: "error" },
]

const INITIAL_FORM: CreateSession = {
    public_session_id: "",
    connection_id: "",
    initiated_by_user_id: "",
    recording_enabled: false,
    status: "active",
    duration_seconds: 0,
    recording_url: "",
    total_commands: 0,
    blocked_commands: 0,
}

export default function CreateEditSessionModal({ isOpen, setIsOpen, editingSession }: CreateEditModalProps) {
  const isEditing = !!editingSession
  const [disabled, setDisabled] = useState(false)
  const [form, setForm] = useState<CreateSession>(INITIAL_FORM)

  const { isLoading, setIsLoading } = useloadingStore()
  const queryClient = useQueryClient()

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser
  })

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections
  })

    const { mutate, isPending } = useMutation({
        mutationFn: createSession,
        onSuccess: () => {
            setIsOpen(false)
            setForm(INITIAL_FORM)
            queryClient.invalidateQueries({
                queryKey: ["sessions"]
            })
        }
    }) 

    const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
        mutationFn: updateSession,
        onSuccess: () => {
            setIsOpen(false)
            setForm(INITIAL_FORM)
            queryClient.invalidateQueries({
                queryKey: ["sessions"]
            })
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev: CreateSession) => ({
            ...prev,
            [name]: value
        }))
    } 

    const handleSave = () => {
        if (!currentUser) return
        
        if (isEditing) {
            updateMutate({
                id: editingSession?.id ?? "",
                ...(form.recording_enabled !== editingSession.recording_enabled ? { recording_enabled: form.recording_enabled } : {}),
                ...(form.status !== editingSession.status ? { status: form.status } : {}),
                ...(form.duration_seconds !== editingSession.duration_seconds ? { duration_seconds: Number(form.duration_seconds) } : {}),
                ...(form.recording_url !== editingSession.recording_url ? { recording_url: form.recording_url } : {}),
                ...(form.total_commands !== editingSession.total_commands ? { total_commands: Number(form.total_commands) } : {}),
                ...(form.blocked_commands !== editingSession.blocked_commands ? { blocked_commands: Number(form.blocked_commands) } : {}),
            })
            return
        }
        
        // Al crear, agregar automáticamente el ID del usuario actual
        mutate({
            ...form,
            duration_seconds: Number(form.duration_seconds),
            total_commands: Number(form.total_commands),
            blocked_commands: Number(form.blocked_commands),
            initiated_by_user_id: currentUser.id
        })
    }

    // Management the state the disabled
   useEffect(() => {
    Object.values(form).forEach((value) => {
      if (value.toString().trim() === "") {
        setDisabled(true)
        return
      }
    })
    setDisabled(false)
  }, [form])

    // Management the state the loading
    useEffect(() => {
        setIsLoading(isPending || isUpdatePending)
    }, [isPending, isUpdatePending, setIsLoading])

    // Management the state the editing session
    useEffect(() => {
        if (!isEditing) {
            setForm(INITIAL_FORM)
            return
        }
        setForm({
            public_session_id: editingSession?.public_session_id ?? "",
            connection_id: editingSession?.connection_id ?? "",
            initiated_by_user_id: editingSession?.initiated_by_user_id ?? "",
            recording_enabled: editingSession?.recording_enabled ?? false,
            status: editingSession?.status ?? "active",
            duration_seconds: editingSession?.duration_seconds ?? 0,
            recording_url: editingSession?.recording_url ?? "",
            total_commands: editingSession?.total_commands ?? 0,
            blocked_commands: editingSession?.blocked_commands ?? 0,
        })
    }, [editingSession, isEditing])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">{isEditing ? "Edit" : "Create"} Session</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Public Session ID</Label>
                        <Input
                            id="public_session_id"
                            name="public_session_id"
                            value={form.public_session_id}
                            onChange={handleChange}
                            disabled={isEditing || isPending || isUpdatePending}
                            placeholder="Enter public session ID"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Connection</Label>
                        <SelectSearch
                            items={connections?.map((conn) => ({ label: conn.name, value: conn.id })) ?? []}
                            value={form.connection_id}
                            onValueChange={(value) => setForm((prev: CreateSession) => ({ ...prev, connection_id: value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Status (optional)</Label>
                        <SelectSearch
                            items={STATUS_OPTIONS}
                            value={form.status}
                            onValueChange={(value) => setForm((prev: CreateSession) => ({ ...prev, status: value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Duration in seconds (optional)</Label>
                        <Input
                            id="duration_seconds"
                            name="duration_seconds"
                            type="text"
                            value={form.duration_seconds.toString()}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                setForm((prev: CreateSession) => ({ ...prev, duration_seconds: value ? parseInt(value) : 0 }))
                            }}
                            disabled={isPending || isUpdatePending}
                            placeholder="0"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Recording URL (optional)</Label>
                        <Input
                            id="recording_url"
                            name="recording_url"
                            value={form.recording_url}
                            onChange={handleChange}
                            disabled={isPending || isUpdatePending}
                            placeholder="https://..."
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Total Commands (optional)</Label>
                        <Input
                            id="total_commands"
                            name="total_commands"
                            type="text"
                            value={form.total_commands.toString()}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                setForm((prev: CreateSession) => ({ ...prev, total_commands: value ? parseInt(value) : 0 }))
                            }}
                            disabled={isPending || isUpdatePending}
                            placeholder="0"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Blocked Commands (optional)</Label>
                        <Input
                            id="blocked_commands"
                            name="blocked_commands"
                            type="text"
                            value={form.blocked_commands.toString()}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                setForm((prev: CreateSession) => ({ ...prev, blocked_commands: value ? parseInt(value) : 0 }))
                            }}
                            disabled={isPending || isUpdatePending}
                            placeholder="0"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="recording_enabled"
                            checked={form.recording_enabled}
                            onCheckedChange={(checked) => setForm((prev: CreateSession) => ({ ...prev, recording_enabled: checked }))}
                            disabled={isPending || isUpdatePending}
                        />
                        <Label htmlFor="recording_enabled" className="text-[#c0c5ce]">Recording Enabled</Label>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => setIsOpen(false)}
                        disabled={isPending || isUpdatePending}
                        className="text-white hover:bg-[#11111f]"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={disabled || isPending || isUpdatePending}
                        className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold disabled:opacity-50"
                    >
                        {isEditing ? "Update" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}