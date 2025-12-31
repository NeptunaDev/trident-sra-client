"use client"

import { useEffect, useState } from "react"
import { useMutation,useQuery, useQueryClient } from "@tanstack/react-query"
import {  Pencil, Plus, Trash2 } from "lucide-react"

import { getConnections } from "@/lib/Connection/connections"
import { getSession, deleteSession, Session } from "@/lib/Session/session"
import { formatDate } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertDialog } from "@/components/ui/alert-dialog"
import CreateEditSessionModal from "./components/CreateEditModal"
import { useloadingStore } from "@/store/loadingStore"

export default function SessionsCrudPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [deletingSession, setDeletingSession] = useState<Session | null>(null)
  const queryClient = useQueryClient()
  const { isLoading, setIsLoading } = useloadingStore()

  const { data: sessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSession
  })  

  const {data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections
  }) 
  const { mutate, isPending } = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"]
      })
      setShowDeleteDialog(false)
      setDeletingSession(null)
    }
  })

  const handleOpenDialog = () => {
    setEditingSession(null)
    setIsOpen(true)
  }
  const confirmDelete = () => {
    mutate(deletingSession?.id ?? "")
  }
  const handleEdit = (it: Session) => {
    setEditingSession(it)
    setIsOpen(true)
  }
  const handleDelete = (it: Session) => {
    setDeletingSession(it)
    setShowDeleteDialog(true)
  }

  useEffect(() => {
    if(isPending !== isLoading) {
      setIsLoading(isPending)
    }
  }, [isPending, isLoading, setIsLoading])

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Sessions</h1>
          <p className="text-sm text-[#c0c5ce]">Create, update and delete sessions.</p>
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
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Public Session ID</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Connection</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Status</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Recording</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Duration</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Total Commands</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Blocked Commands</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Started</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions?.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 px-4 text-center text-[#6b7280]">
                    No results.
                  </td>
                </tr>
              ) : (
                sessions?.map((it) => (
                  <tr key={it?.id ?? ""} className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]">
                    <td className="py-3 px-4 text-white font-medium">{it?.id?.split("-")[0] ?? ""}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it?.public_session_id ?? "-"}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {connections?.find((conn) => conn.id === it?.connection_id)?.name || "-"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      <span className="capitalize">{it?.status ?? "-"}</span>
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it?.recording_enabled ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it?.duration_seconds !== null && it?.duration_seconds !== undefined ? `${it?.duration_seconds}s` : "0s"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it?.total_commands ?? 0}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it?.blocked_commands ?? 0}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{formatDate(it?.started_at ?? "")}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(it ?? null)}
                          className="text-white hover:text-[#5bc2e7] hover:bg-[#0f0f1c]"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(it ?? null)}
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

      <CreateEditSessionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingSession={editingSession}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Confirm delete"
        description={`¿Estás seguro de que deseas eliminar la sesión "${deletingSession?.public_session_id}"? Esta acción no se puede deshacer.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
