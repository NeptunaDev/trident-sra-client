"use client"

import { useEffect, useState } from "react"
import { useMutation,useQuery, useQueryClient } from "@tanstack/react-query"
import {  Pencil, Plus, Trash2 } from "lucide-react"

import { getCommands, deleteCommand, Command } from "@/lib/commands/commands"
import { getSession } from "@/lib/Session/session"
import { formatDate } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertDialog } from "@/components/ui/alert-dialog"
import CreateEditCommandsModal from "./components/CreateEditCommandsModal"
import { useloadingStore } from "@/store/loadingStore"

export default function CommandsCrudPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingCommand, setEditingCommand] = useState<Command | null>(null)
  const [deletingCommand, setDeletingCommand] = useState<Command | null>(null)
  const queryClient = useQueryClient()
  const { isLoading, setIsLoading } = useloadingStore()

  const { data: commands } = useQuery({
    queryKey: ["commands"],
    queryFn: getCommands
  })  

  const {data: sessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSession
  }) 
  const { mutate, isPending } = useMutation({
    mutationFn: deleteCommand,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["commands"]
      })
      setShowDeleteDialog(false)
      setDeletingCommand(null)
    }
  })

  const handleOpenDialog = () => {
    setEditingCommand(null)
    setIsOpen(true)
  }
  const confirmDelete = () => {
    mutate(deletingCommand?.id ?? "")
  }
  const handleEdit = (it: Command) => {
    setEditingCommand(it)
    setIsOpen(true)
  }
  const handleDelete = (it: Command) => {
    setDeletingCommand(it)
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
          <h1 className="text-2xl font-semibold text-white">Commands</h1>
          <p className="text-sm text-[#c0c5ce]">Create, update and delete commands.</p>
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
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Session</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Command</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Status</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Risk Level</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Exit Code</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Output</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Blocked</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Blocked Reason</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Executed At</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Created At</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commands?.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-10 px-4 text-center text-[#6b7280]">
                    No results.
                  </td>
                </tr>
              ) : (
                commands?.map((it) => (
                  <tr key={it?.id ?? ""} className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]">
                    <td className="py-3 px-4 text-white font-medium">{it?.id?.split("-")[0] ?? ""}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {sessions?.find((session) => session.id === it?.session_id)?.public_session_id || "-"}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {it?.command ?? ""}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      <span className="capitalize">{it?.status ?? "-"}</span>
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      <span className="capitalize">{it?.risk_level ?? "-"}</span>
                    </td>
                    <td className="py-3 px-4 text-white  font-medium">
                      {it?.exit_code ?? "-"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it?.output ?? "-"}
                    </td>
                    <td className="py-3 px-4 text-white  font-medium">
                      {it?.was_blocked ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it?.blocked_reason ?? "-"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{formatDate(it?.executed_at ?? "")}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{formatDate(it?.created_at ?? "")}</td>
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

      <CreateEditCommandsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingCommand={editingCommand}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Confirm delete"
        description={`¿Estás seguro de que deseas eliminar el comando "${deletingCommand?.command}"? Esta acción no se puede deshacer.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
