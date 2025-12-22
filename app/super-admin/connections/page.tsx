"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { getOrganizations } from "@/lib/organization"
import { formatDate } from "@/lib/utils"
import { deleteConnection, getConnections, Connection } from "@/lib/connections"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertDialog } from "@/components/ui/alert-dialog"
import CreateEditConnectionModal from "./components/CreateEditConnectionModal"
import { useloadingStore } from "@/store/loadingStore"

export default function ConnectionsCrudPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null)
  const [deletingConnection, setDeletingConnection] = useState<Connection | null>(null)
  const queryClient = useQueryClient()
  const { isLoading, setIsLoading } = useloadingStore()

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections
  })

  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations
  })

  const { mutate, isPending } = useMutation({
    mutationFn: deleteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connections"]
      })
      setShowDeleteDialog(false)
      setDeletingConnection(null)
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to delete connection'
      alert(message)
      setShowDeleteDialog(false)
    }
  })

  const handleOpenDialog = () => {
    setEditingConnection(null)
    setIsOpen(true)
  }

  const confirmDelete = () => {
    mutate(deletingConnection?.id ?? "")
  }

  const handleEdit = (it: Connection) => {
    setEditingConnection(it)
    setIsOpen(true)
  }
  
  const handleDelete = (it: Connection) => {
    setDeletingConnection(it)
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
          <h1 className="text-2xl font-semibold text-white">Connections</h1>
          <p className="text-sm text-[#c0c5ce]">Create, update and delete connections.</p>
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
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Name</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Type</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Hostname</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Port</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Username</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Organization</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Status</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Created</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {connections?.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 px-4 text-center text-[#6b7280]">
                    No results.
                  </td>
                </tr>
              ) : (
                connections?.map((it) => (
                  <tr key={it.id} className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]">
                    <td className="py-3 px-4 text-white font-medium">{it.id.split("-")[0]}</td>
                    <td className="py-3 px-4 text-white font-medium">{it.name}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      <span className="uppercase">{it.protocol}</span>
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.hostname}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.port}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.username}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {organizations?.find((org) => org.id === it.organization_id)?.name || "-"}
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

      <CreateEditConnectionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        organizations={organizations ?? []}
        editingConnection={editingConnection}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Confirm delete"
        description={`Are you sure you want to delete "${deletingConnection?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
