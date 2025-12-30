"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { getUser } from "@/lib/user/user"
import { getParticipants, deleteParticipant, updateParticipant, Participant } from "@/lib/participant"
import { formatDate } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertDialog } from "@/components/ui/alert-dialog"
import CreateEditParticipantModal from "./components/CreateEditParticipantModal"
import { useloadingStore } from "@/store/loadingStore"

export default function ParticipantsCrudPage() {
    const [isOpen, setIsOpen] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
    const [deletingParticipant, setDeletingParticipant] = useState<Participant | null>(null)
    const queryClient = useQueryClient()
    const { isLoading, setIsLoading } = useloadingStore()

    const { data: participants } = useQuery({
        queryKey: ["participants"],
        queryFn: getParticipants
    }) 

    const {data: users } = useQuery({
        queryKey: ["users"],
        queryFn: getUser
    })
    const { mutate, isPending } = useMutation({
        mutationFn: deleteParticipant,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["participants"]
            })
            setShowDeleteDialog(false)
            setDeletingParticipant(null)
        }
    })

    const handleOpenDialog = () => {
        setEditingParticipant(null)
        setIsOpen(true)
    }
    const confirmDelete = () => {
        mutate(deletingParticipant?.id ?? "")
    }
    const handleEdit = (it: Participant) => {
        setEditingParticipant(it)
        setIsOpen(true)
    }
    const handleDelete = (it: Participant) => {
        setDeletingParticipant(it)
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
                    <h1 className="text-2xl font-semibold text-white">Participants</h1>
                    <p className="text-sm text-[#c0c5ce]">Create, update and delete session participants.</p>
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
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">User</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Role</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Can Write</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Joined At</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Left At</th>
                                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants?.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-10 px-4 text-center text-[#6b7280]">
                                        No results.
                                    </td>
                                </tr>
                            ) : (
                                participants?.map((it) => (
                                    <tr key={it.id} className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]">
                                        <td className="py-3 px-4 text-white font-medium">{it.id.split("-")[0]}</td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">{it.session_id.split("-")[0]}</td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">
                                            {users?.find((user) => user.id === it.user_id)?.name || "-"}
                                        </td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">
                                            <span className="capitalize">{it.role}</span>
                                        </td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">
                                            {it.can_write ? "Yes" : "No"}
                                        </td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">
                                            {it.join_at ? formatDate(it.join_at) : "-"}
                                        </td>
                                        <td className="py-3 px-4 text-[#c0c5ce]">
                                            {it.left_at ? formatDate(it.left_at) : "-"}
                                        </td>
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

            <CreateEditParticipantModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                editingParticipant={editingParticipant}
            />

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Confirm delete"
                description={`¿Estás seguro de que deseas eliminar este participante? Esta acción no se puede deshacer.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={confirmDelete}
            />
        </div>
    )
}