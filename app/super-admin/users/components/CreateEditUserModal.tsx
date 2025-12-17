'use  client'
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser, CreateUser } from "@/lib/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getRoles } from "@/lib/role"
import { SelectSearch } from "@/components/ui/select-search"
import { getOrganizations } from "@/lib/organization"
import { useloadingStore } from "@/store/loadingStore"

interface CreateEditUserModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const INITIAL_FORM: CreateUser = {
  name: "",
  email: "",
  password: "",
  role_id: "",
  organization_id: "",
}

export default function CreateEditUserModal({ isOpen, setIsOpen }: CreateEditUserModalProps) {
  const [disabled, setDisabled] = useState(false)
  const [form, setForm] = useState<CreateUser>(INITIAL_FORM)

  const { isLoading, setIsLoading } = useloadingStore()
  const queryClient = useQueryClient()

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles
  })
  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations
  })
  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setForm(INITIAL_FORM)
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

  useEffect(() => {
    if (isPending !== isLoading) {
      setIsLoading(isPending)
    }
  }, [isPending])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{"Create"} User</DialogTitle>
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
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
