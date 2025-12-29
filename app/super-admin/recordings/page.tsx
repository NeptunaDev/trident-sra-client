"use client" 

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { SessionRecording, getSessionRecordings, deleteSessionRecording } from "@/lib/session_recording"
import { formatDate } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertDialog } from "@/components/ui/alert-dialog"
import CreateEditRecordingModal from "./components/CreateEditRecordingModal"
import { useloadingStore } from "@/store/loadingStore"

export default function RecordingsCrudPage() {
    const [isOpen, setIsOpen] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [editingRecording, setEditingRecording] = useState<SessionRecording | null>(null)
    const [deletingRecording, setDeletingRecording] = useState<SessionRecording | null>(null)
    const queryClient = useQueryClient()
    const { isLoading, setIsLoading } = useloadingStore()

    const { data: sessionRecordings } = useQuery({
        queryKey: ["session_recordings"],
        queryFn: getSessionRecordings
    })  
    const { mutate, isPending } = useMutation({
        mutationFn: deleteSessionRecording,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["session_recordings"]
            })
            setShowDeleteDialog(false)
            setDeletingRecording(null)
        },
        onError: (error: any) => {
            const message = error.message || 'Failed to delete recording'
            alert(message)
            setShowDeleteDialog(false)
        }
    })
    const handleOpenDialog = () => {
        setEditingRecording(null)
        setIsOpen(true)
    }
    const confirmDelete = () => {
        mutate(deletingRecording?.id ?? "")
    }
    const handleEdit = (it: SessionRecording) => {
        setEditingRecording(it)
        setIsOpen(true)
    }

    const handleDelete = (it: SessionRecording) => {
        setDeletingRecording(it)
        setShowDeleteDialog(true)
    }

    useEffect(() => {
        if (isPending !== isLoading) {
            setIsLoading(isPending)
        }
    }, [isPending, isLoading, setIsLoading])

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Recordings</h1>
                    <p className="text-sm text-[#c0c5ce]">Create, update and delete recordings.</p>
                </div>
                <Button
                    onClick={handleOpenDialog}
                    className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New
                </Button>
            </div>

            <Card className="bg-[#11111f] border-[rgba(91,194,231,0.2)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#0f0f1c] border-b border-[rgba(91,194,231,0.2)]">
                            <tr className="text-left">
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">ID</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Session ID</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">File Name</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Size (MB)</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Duration (sec)</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Status</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Created</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessionRecordings?.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-10 px-4 text-center text-[#6b7280]">
                                        No results.
                                    </td>
                                </tr>
                            ) : (
                                sessionRecordings?.map((it) => (
                                    <tr key={it.id} className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]">
                                        <td className="py-3 px-4 text-white font-medium">{it.id.split("-")[0]}</td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">{it.session_id.split("-")[0]}</td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">{it.file_name}</td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">
                                            {(Number(it.file_size_bytes) / (1024 * 1024)).toFixed(4)}
                                        </td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">
                                            {it.duration_seconds}
                                        </td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">
                                            <span className="capitalize">{it.status}</span>
                                        </td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">{formatDate(it.created_at)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(it)}
                                                    className="text-white hover:text-[#5bc2e7] hover:bg-[#0f0f1c]"
                                                >
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(it)}
                                                    className="text-white hover:text-white hover:bg-[#ff6b6b]"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <CreateEditRecordingModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                editingRecording={editingRecording}
            />

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Confirm delete"
                description={`Are you sure you want to delete the recording "${deletingRecording?.file_name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={confirmDelete}
            />
        </div>
    )
}
