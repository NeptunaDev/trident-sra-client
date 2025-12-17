"use client"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/lib/user"
import CreateEditUserModal from "./components/CreateEditUserModal"

export default function UsersCrudPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getUser
  })

  const confirmDelete = () => {
    console.log("confirm delete")
  }

  const openEdit = (it: any) => {
    console.log("open edit", it)
  }

  const requestDelete = (id: string) => {
    console.log("request delete", id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="text-sm text-[#c0c5ce]">Create, update and delete users.</p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
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
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Correo</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Orgaanization</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Role</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Fecha de creación</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 px-4 text-center text-[#6b7280]">
                    No results.
                  </td>
                </tr>
              ) : (
                users?.map((it) => (
                  <tr key={it.id} className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]">
                    <td className="py-3 px-4 text-white font-medium">{it.id}</td>
                    <td className="py-3 px-4 text-white font-medium">{it.name}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.email}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.organization_id || "Super Admin"}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.role_id}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.created_at}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(it)}
                          className="text-white hover:text-[#5bc2e7] hover:bg-[#0f0f1c]"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => requestDelete(it.id)}
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

      <CreateEditUserModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <Dialog open={!!deleteId} onOpenChange={(open) => (!open ? setDeleteId(null) : null)}>
        <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm delete</DialogTitle>
          </DialogHeader>
          <div className="text-[#c0c5ce]">This action cannot be undone.</div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="text-white hover:bg-[#11111f]">
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

