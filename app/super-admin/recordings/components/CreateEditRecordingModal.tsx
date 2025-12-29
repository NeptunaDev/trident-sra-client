"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createSessionRecording, updateSessionRecording, CreateSessionRecording, SessionRecording } from "@/lib/session_recording"
import { getSession } from "@/lib/session"
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
  editingRecording: SessionRecording | null
} 

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
] 

const INITIAL_FORM: CreateSessionRecording = {
  session_id: "",
  file_url: "",
  file_name: "",
  file_size_bytes: 0,
  duration_seconds: 0,
  status: "pending",
}

export default function CreateEditRecordingModal({ isOpen, setIsOpen, editingRecording }: CreateEditRecordingModalProps) {
    const isEditing = !!editingRecording
    const [disabled, setDisabled] = useState(false)
    const [form, setForm] = useState<CreateSessionRecording>(INITIAL_FORM)

    const { isLoading, setIsLoading } = useloadingStore()
    const queryClient = useQueryClient()

    const { data: currentUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser
    })

    const { data: sessions } = useQuery({
        queryKey: ["sessions"],
        queryFn: getSession
    })

    const { mutate, isPending } = useMutation({
        mutationFn: createSessionRecording,
        onSuccess: () => {
            setIsOpen(false)
            setForm(INITIAL_FORM)
            queryClient.invalidateQueries({
                queryKey: ["session_recordings"]
            })
        },
        onError: (error: any) => {
            console.error('Create error:', error)
            alert(error.response?.data?.detail || error.message || 'Failed to create recording')
        }
    })

    const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
        mutationFn: updateSessionRecording,
        onSuccess: () => {
            setIsOpen(false)
            setForm(INITIAL_FORM)
            queryClient.invalidateQueries({
                queryKey: ["session_recordings"]
            })
        },
        onError: (error: any) => {
            console.error('Update error:', error)
            alert(error.response?.data?.detail || error.message || 'Failed to update recording')
        }
    }) 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleSave = () => {
        if (!currentUser) return
        
        if (isEditing) {
            updateMutate({
                id: editingRecording?.id ?? "",
                ...(form.session_id !== editingRecording.session_id ? { session_id: form.session_id } : {}),
                ...(form.file_url !== editingRecording.file_url ? { file_url: form.file_url } : {}),
                ...(form.file_name !== editingRecording.file_name ? { file_name: form.file_name } : {}),
                ...(Number(form.file_size_bytes) !== Number(editingRecording.file_size_bytes) ? { file_size_bytes: Number(form.file_size_bytes) } : {}),
                ...(Number(form.duration_seconds) !== Number(editingRecording.duration_seconds) ? { duration_seconds: Number(form.duration_seconds) } : {}),
                ...(form.status !== editingRecording.status ? { status: form.status } : {}),
            })
            return
        }
        mutate(form)
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
            session_id: editingRecording!.session_id,
            file_url: editingRecording!.file_url,
            file_name: editingRecording!.file_name,
            file_size_bytes: Number(editingRecording!.file_size_bytes) ,
            duration_seconds: Number(editingRecording!.duration_seconds),
            status: editingRecording!.status,
        })
    }, [editingRecording, isEditing])
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">{isEditing ? "Edit" : "Create"} Recording</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Session</Label>
                        <SelectSearch
                            items={sessions?.map((session) => ({ label: session.public_session_id, value: session.id })) ?? []}
                            value={form.session_id}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, session_id: value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">File URL</Label>
                        <Input
                            name="file_url"
                            value={form.file_url}
                            onChange={handleChange}
                            placeholder="https://example.com/recordings/file.mp4"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">File Name</Label>
                        <Input
                            name="file_name"
                            value={form.file_name}
                            onChange={handleChange}
                            placeholder="recording_2025-12-22.mp4"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">File Size (MB)</Label>
                        <Input
                            name="file_size_mb"
                            type="text"
                            value={(form.file_size_bytes / (1024 * 1024)).toFixed(4)}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9.]/g, '')
                                const mb = parseFloat(value) || 0
                                const bytes = Math.round(mb * 1024 * 1024)
                                setForm((prev) => ({ ...prev, file_size_bytes: bytes }))
                            }}
                            placeholder="5.50"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Duration (seconds)</Label>
                        <Input
                            name="duration_seconds"
                            type="text"
                            value={form.duration_seconds.toString()}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                setForm((prev) => ({ ...prev, duration_seconds: value ? parseInt(value) : 0 }))
                            }}
                            placeholder="300"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Status</Label>
                        <SelectSearch
                            items={STATUS_OPTIONS}
                            value={form.status}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                        />
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
