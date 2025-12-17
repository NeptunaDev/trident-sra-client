'use  client'
import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createUser, CreateUser, updateUser, User } from "@/lib/user"
import { Role } from "@/lib/role"
import { Organization } from "@/lib/organization"

import { useloadingStore } from "@/store/loadingStore"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectSearch } from "@/components/ui/select-search"

interface CreateEditUserModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  roles: Role[]
  organizations: Organization[]
  editingUser: User | null
}

const INITIAL_FORM: CreateUser = {
  name: "",
  email: "",
  password: "",
  role_id: "",
  organization_id: "",
}

export default function CreateEditUserModal({ isOpen, setIsOpen, roles, organizations, editingUser }: CreateEditUserModalProps) {
  const isEditng = !!editingUser
  const [disabled, setDisabled] = useState(false)
  const [form, setForm] = useState<CreateUser>(INITIAL_FORM)

  const { isLoading, setIsLoading } = useloadingStore()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setIsOpen(false)
      queryClient.invalidateQueries({
        queryKey: ["users"]
      })
    }
  })
  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      setIsOpen(false)
      queryClient.invalidateQueries({
        queryKey: ["users"]
      })
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // TODO: Validacion del formulario
    if (isEditng) {
      updateMutate({
        id: editingUser?.id ?? "",
        ...(form.password.trim() !== "" ? { password: form.password } : {}),
        ...(form.name !== editingUser.name ? { name: form.name } : {}),
        ...(form.email !== editingUser.email ? { email: form.email } : {}),
        ...(form.organization_id !== editingUser.organization_id ? { organization_id: form.organization_id } : {}),
        ...(form.role_id !== editingUser.role_id ? { role_id: form.role_id } : {}),
      })
      return
    }
    mutate(form)
  }

  // Managment the state the disabled
  useEffect(() => {
    Object.values(form).forEach((value) => {
      if (value.trim() === "") {
        setDisabled(true)
        return
      }
    })
    setDisabled(false)
  }, [form])

  // Managment the state the loading
  useEffect(() => {
    if (isPending !== isLoading || isUpdatePending !== isLoading) {
      setIsLoading(isPending || isUpdatePending)
    }
  }, [isPending, isUpdatePending])

  // Managment the state the editing user
  useEffect(() => {
    if (!isEditng) {
      setForm(INITIAL_FORM)
      return
    }
    setForm({
      name: editingUser?.name ?? "",
      email: editingUser?.email ?? "",
      password: "",
      role_id: editingUser?.role_id ?? "",
      organization_id: editingUser?.organization_id ?? "",
    })
  }, [editingUser, isEditng])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{isEditng ? "Edit" : "Create"} User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Email</Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Password</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Role</Label>
            <SelectSearch
              items={roles?.map((role) => ({ label: role.display_name, value: role.id })) ?? []}
              onValueChange={(value) => setForm((prev) => ({ ...prev, role_id: value }))}
              value={form.role_id}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Organization</Label>
            <SelectSearch
              items={organizations?.map((organization) => ({ label: organization.name, value: organization.id })) ?? []}
              onValueChange={(value) => setForm((prev) => ({ ...prev, organization_id: value }))}
              value={form.organization_id}
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
            {isEditng ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
