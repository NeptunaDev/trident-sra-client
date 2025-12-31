"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormError } from "@/components/ui/form-error"
import { CreateSessionRecordingFormData, UpdateSessionRecordingFormData, getCreateSessionRecordingSchema, getUpdateSessionRecordingSchema } from "@/lib/Recording/recording.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { createSessionRecording, updateSessionRecording, SessionRecording } from "@/lib/Recording/session_recording"
import { getSession } from "@/lib/Session/session"
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

export default function CreateEditRecordingModal({ isOpen, setIsOpen, editingRecording }: CreateEditRecordingModalProps) {
    const isEditing = !!editingRecording
    const { setIsLoading } = useloadingStore()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
        watch,
    } = useForm<CreateSessionRecordingFormData>({
        resolver: zodResolver(isEditing ? getUpdateSessionRecordingSchema() : getCreateSessionRecordingSchema()) as any,
        mode: "onBlur",
        defaultValues: {
            session_id: "",
            file_url: "",
            file_name: "",
            file_size_bytes: 0,
            duration_seconds: 0,
            status: "pending",
        }
    })

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
            reset()
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
            reset()
            queryClient.invalidateQueries({
                queryKey: ["session_recordings"]
            })
        },
        onError: (error: any) => {
            console.error('Update error:', error)
            alert(error.response?.data?.detail || error.message || 'Failed to update recording')
        }
    }) 

    const onSubmit = (data: CreateSessionRecordingFormData) => {
        if (!isEditing) {
            mutate(data)
            return
        }
        updateMutate({
            id: editingRecording?.id ?? "",
            ...(data.session_id !== editingRecording?.session_id ? { session_id: data.session_id } : {}),
            ...(data.file_url !== editingRecording?.file_url ? { file_url: data.file_url } : {}),
            ...(data.file_name !== editingRecording?.file_name ? { file_name: data.file_name } : {}),
            ...(Number(data.file_size_bytes) !== Number(editingRecording?.file_size_bytes) ? { file_size_bytes: Number(data.file_size_bytes) } : {}),
            ...(Number(data.duration_seconds) !== Number(editingRecording?.duration_seconds) ? { duration_seconds: Number(data.duration_seconds) } : {}),
            ...(data.status !== editingRecording?.status ? { status: data.status } : {}),
        })
    }

    // Watch select values
    const sessionId = watch("session_id")
    const status = watch("status")

    // Manage loading state
    useEffect(() => {
        setIsLoading(isPending || isUpdatePending)
    }, [isPending, isUpdatePending, setIsLoading])

    // Reset form when edit mode changes
    useEffect(() => {
        if (!isOpen) return
        if (!isEditing || !editingRecording) {
            reset({
                session_id: "",
                file_url: "",
                file_name: "",
                file_size_bytes: 0,
                duration_seconds: 0,
                status: "pending",
            })
            return
        }
        reset({
            session_id: editingRecording.session_id ?? "",
            file_url: editingRecording.file_url ?? "",
            file_name: editingRecording.file_name ?? "",
            file_size_bytes: Number(editingRecording.file_size_bytes) ?? 0,
            duration_seconds: Number(editingRecording.duration_seconds) ?? 0,
            status: editingRecording.status ?? "pending",
        })
    }, [isOpen, isEditing, editingRecording, reset])
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">{isEditing ? "Edit" : "Create"} Recording</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Session</Label>
                        <SelectSearch
                            items={sessions?.map((session) => ({ label: session.public_session_id, value: session.id })) ?? []}
                            value={sessionId}
                            onValueChange={(value) => setValue("session_id", value, { shouldValidate: true })}
                            error={!!errors.session_id}
                        />
                        <FormError message={errors.session_id?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">File URL</Label>
                        <Input
                            {...register("file_url")}
                            error={!!errors.file_url}
                            placeholder="https://example.com/recordings/file.mp4"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                        <FormError message={errors.file_url?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">File Name</Label>
                        <Input
                            {...register("file_name")}
                            error={!!errors.file_name}
                            placeholder="recording_2025-12-22.mp4"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                        <FormError message={errors.file_name?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">File Size (bytes)</Label>
                        <Input
                            {...register("file_size_bytes", { valueAsNumber: true })}
                            error={!!errors.file_size_bytes}
                            type="number"
                            placeholder="1024000"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                        <FormError message={errors.file_size_bytes?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Duration (seconds)</Label>
                        <Input
                            {...register("duration_seconds", { valueAsNumber: true })}
                            error={!!errors.duration_seconds}
                            type="number"
                            placeholder="300"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                        <FormError message={errors.duration_seconds?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Status</Label>
                        <SelectSearch
                            items={STATUS_OPTIONS}
                            value={status}
                            onValueChange={(value) => setValue("status", value, { shouldValidate: true })}
                            error={!!errors.status}
                        />
                        <FormError message={errors.status?.message} />
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
