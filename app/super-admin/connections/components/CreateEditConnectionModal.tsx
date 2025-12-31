"use client"

import { useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { createConnection, updateConnection, CreateConnection, Connection } from "@/lib/Connection/connections"
import { Organization } from "@/lib/organization"
import { getCurrentUser } from "@/lib/user/user"
import { CreateConnectionFormData, UpdateConnectionFormData, getCreateConnectionSchema, getUpdateConnectionSchema } from "@/lib/Connection/connections.schema"

import { useloadingStore } from "@/store/loadingStore"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectSearch } from "@/components/ui/select-search"
import { FormError } from "@/components/ui/form-error"

interface CreateEditConnectionModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  organizations: Organization[]
  editingConnection: Connection | null
}

const PROTOCOL_OPTIONS = [
  { label: "SSH", value: "ssh" },
  { label: "RDP", value: "rdp" },
  { label: "VNC", value: "vnc" },
  { label: "Telnet", value: "telnet" },
]

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

export default function CreateEditConnectionModal({ 
  isOpen, 
  setIsOpen, 
  organizations, 
  editingConnection 
}: CreateEditConnectionModalProps) {
  const isEditing = !!editingConnection
  const { isLoading, setIsLoading } = useloadingStore()
  const queryClient = useQueryClient()

  // Use the correct schema based on whether we're editing or creating
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<CreateConnectionFormData | UpdateConnectionFormData>({
    resolver: zodResolver(isEditing ? getUpdateConnectionSchema() : getCreateConnectionSchema()),
    mode: "onBlur", // Validates when field loses focus
    defaultValues: {
      name: "",
      protocol: "ssh",
      hostname: "",
      port: 22,
      username: "",
      password: "",
      organization_id: "",
      description: "",
      status: "active",
    },
  })
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateConnectionFormData) => {
      const user = await getCurrentUser()
      return createConnection({
        name: data.name,
        protocol: data.protocol,
        hostname: data.hostname,
        port: data.port ?? 22, //default port
        username: data.username,
        password: data.password,
        organization_id: data.organization_id,
        create_by_user_id: user.id,
        total_sessions: 0,
        ...(data.description ? { description: data.description } : {}),
        ...(data.status ? { status: data.status } : {}),
      })
    },
    onSuccess: () => {
      setIsOpen(false)
      reset()
      queryClient.invalidateQueries({
        queryKey: ["connections"]
      })
    },
  })
  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateConnection,
    onSuccess: () => {
      setIsOpen(false)
      reset()
      queryClient.invalidateQueries({
        queryKey: ["connections"]
      })
    },
  })

  const onSubmit = (data: CreateConnectionFormData | UpdateConnectionFormData) => {
    if (!isEditing) {
      mutate(data as CreateConnectionFormData)
      return
    }
    updateMutate({
      id: editingConnection?.id ?? "",
      ...(data.password?.trim() !== "" ? { password: data.password } : {}),
      ...(data.name !== editingConnection?.name ? { name: data.name } : {}),
      ...(data.protocol !== editingConnection?.protocol ? { protocol: data.protocol } : {}),
      ...(data.hostname !== editingConnection?.hostname ? { hostname: data.hostname } : {}),
      ...(data.port !== editingConnection?.port ? { port: data.port ?? 22 } : {}),
      ...(data.username !== editingConnection?.username ? { username: data.username } : {}),
      ...(data.organization_id !== editingConnection?.organization_id ? { organization_id: data.organization_id } : {}),
      ...(data.description !== editingConnection?.description ? { description: data.description } : {}),
      ...(data.status !== editingConnection?.status ? { status: data.status } : {}),
    })
  }

  // Watch select values
  const protocol = watch("protocol")
  const organizationId = watch("organization_id")
  const status = watch("status")

  // Manage loading state
  useEffect(() => {
    setIsLoading(isPending || isUpdatePending)
  }, [isPending, isUpdatePending, setIsLoading])

  // Manage form state when editing connection
  // Reset form when edit mode changes
  useEffect(() => {
    if (!isOpen) return
    if (!isEditing || !editingConnection) {
      reset({
        name: "",
        protocol: "ssh",
        hostname: "",
        port: 22,
        username: "",
        password: "",
        organization_id: "",
        description: "",
        status: "active",
      })
      return
    }
    reset({
      name: editingConnection.name,
      protocol: editingConnection.protocol,
      hostname: editingConnection.hostname,
      port: editingConnection.port,
      username: editingConnection.username,
      password: "",
      organization_id: editingConnection.organization_id,
      description: editingConnection.description ?? "",
      status: editingConnection.status,
    })
  }, [isOpen, isEditing, editingConnection, reset])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{isEditing ? "Edit" : "Create"} Connection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Name</Label>
            <Input
              {...register("name")}
              error={!!errors.name}
              placeholder="My Server Connection"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Protocol</Label>
            <SelectSearch
              items={PROTOCOL_OPTIONS}
              value={protocol}
              onValueChange={(value) => setValue("protocol", value, { shouldValidate: true })}
              error={!!errors.protocol}
            />
            <FormError message={errors.protocol?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Hostname</Label>
            <Input
              {...register("hostname")}
              error={!!errors.hostname}
              placeholder="192.168.1.100 or server.example.com"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.hostname?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Port</Label>
            <Input
              {...register("port", { valueAsNumber: true })}
              error={!!errors.port}
              type="number"
              placeholder="22"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.port?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Username</Label>
            <Input
              {...register("username")}
              error={!!errors.username}
              placeholder="admin"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.username?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Password</Label>
            <Input
              {...register("password")}
              error={!!errors.password}
              type="password"
              placeholder="••••••••"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.password?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Organization</Label>
            <SelectSearch
              items={organizations?.map((organization) => ({ label: organization.name, value: organization.id })) ?? []}
              onValueChange={(value) => setValue("organization_id", value, { shouldValidate: true })}
              value={organizationId}
              error={!!errors.organization_id}
            />
            <FormError message={errors.organization_id?.message} />
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
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Description (optional)</Label>
            <Input
              {...register("description")}
              error={!!errors.description}
              placeholder="Optional description"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.description?.message} />
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
