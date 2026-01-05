"use client";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createRole,
  updateRole,
  Role,
  PermissionUser,
  PermissionSessions,
  Permissions,
} from "@/lib/role/role";

import {
  CreateRoleFormData,
  getCreateRoleSchema,
  getUpdateRoleSchema,
  UpdateRoleFormData,
} from "@/lib/role/role.schema";

import { useloadingStore } from "@/store/loadingStore";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";

interface CreateEditRolesModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingRole: Role | null;
}

const SESSION_PERMISSIONS: PermissionSessions[] = ["create", "read"];
const USER_PERMISSIONS: PermissionUser[] = [
  "create",
  "read",
  "update",
  "delete",
];

export default function CreateEditRolesModal({
  isOpen,
  setIsOpen,
  editingRole,
}: CreateEditRolesModalProps) {
  const isEditing = !!editingRole;
  const { isLoading, setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  // Use the correct schema based on whether we're editing or creating
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<CreateRoleFormData | UpdateRoleFormData>({
    resolver: zodResolver(
      isEditing ? getUpdateRoleSchema() : getCreateRoleSchema()
    ),
    mode: "onBlur", // Validates when field loses focus
    defaultValues: {
      name: "",
      display_name: "",
      color: "#5bc2e7",
      permissions: {
        sessions: [],
        users: [],
      },
    },
  });

  // Watch form values
  const color = watch("color");
  const permissions = watch("permissions");

  const { mutate, isPending } = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });

  const onSubmit = (data: CreateRoleFormData | UpdateRoleFormData) => {
    if (!isEditing) {
      const createData = {
        name: data.name as string,
        display_name: data.display_name as string,
        color: data.color as string,
        permissions: data.permissions as Permissions,
      };
      mutate(createData);
      return;
    }

    const updateData: {
      id: string;
      name?: string;
      display_name?: string;
      color?: string;
      permissions?: Permissions;
    } = {
      id: editingRole?.id ?? "",
    };

    if (data.name && data.name !== editingRole?.name) {
      updateData.name = data.name as string;
    }
    if (data.display_name && data.display_name !== editingRole?.display_name) {
      updateData.display_name = data.display_name as string;
    }
    if (data.color && data.color !== editingRole?.color) {
      updateData.color = data.color as string;
    }
    if (
      data.permissions &&
      JSON.stringify(data.permissions) !==
        JSON.stringify(editingRole?.permissions)
    ) {
      updateData.permissions = data.permissions as Permissions;
    }

    updateMutate(updateData);
  };

  const handleSessionsChange = (perm: PermissionSessions) => {
    const currentSessions = permissions?.sessions || [];
    const newSessions = currentSessions.includes(perm)
      ? currentSessions.filter((p: PermissionSessions) => p !== perm)
      : [...currentSessions, perm];
    setValue("permissions.sessions", newSessions, { shouldValidate: true });
  };

  const handleUsersChange = (perm: PermissionUser) => {
    const currentUsers = permissions?.users || [];
    const newUsers = currentUsers.includes(perm)
      ? currentUsers.filter((p: PermissionUser) => p !== perm)
      : [...currentUsers, perm];
    setValue("permissions.users", newUsers, { shouldValidate: true });
  };

  // Manage loading state
  useEffect(() => {
    setIsLoading(isPending || isUpdatePending);
  }, [isPending, isUpdatePending, setIsLoading]);

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (!isOpen) {
      reset({
        name: "",
        display_name: "",
        color: "#5bc2e7",
        permissions: {
          sessions: [],
          users: [],
        },
      });
      return;
    }

    if (isEditing && editingRole) {
      reset({
        name: editingRole.name ?? "",
        display_name: editingRole.display_name ?? "",
        color: editingRole.color ?? "#5bc2e7",
        permissions: {
          sessions: editingRole.permissions?.sessions ?? [],
          users: editingRole.permissions?.users ?? [],
        },
      });
    } else {
      reset({
        name: "",
        display_name: "",
        color: "#5bc2e7",
        permissions: {
          sessions: [],
          users: [],
        },
      });
    }
  }, [isOpen, editingRole, isEditing, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Edit" : "Create"} Role
          </DialogTitle>
          <DialogDescription className="text-[#c0c5ce]">
            {isEditing
              ? "Update the role information below."
              : "Fill in the information to create a new role."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Name</Label>
            <Input
              {...register("name")}
              error={!!errors.name}
              placeholder="admin"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Display Name</Label>
            <Input
              {...register("display_name")}
              error={!!errors.display_name}
              placeholder="Administrator"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.display_name?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Color</Label>
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={color || "#5bc2e7"}
                onChange={(e) => {
                  setValue("color", e.target.value, { shouldValidate: true });
                }}
                className="h-8 w-8 rounded-mb border border-[rgba(91,194,231,0.2)] bg-[#11111f] cursor-pointer"
              />
              <Input
                {...register("color")}
                error={!!errors.color}
                placeholder="#5bc2e7"
                className="flex-1 bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
              />
            </div>
            <FormError message={errors.color?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Sessions Permissions</Label>
            <div className="flex flex-wrap gap-2">
              {SESSION_PERMISSIONS.map((perm) => (
                <button
                  key={perm}
                  type="button"
                  onClick={() => handleSessionsChange(perm)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    permissions?.sessions?.includes(perm)
                      ? "bg-[#5bc2e7] text-[#11111f] border border-[#5bc2e7]"
                      : "bg-[#11111f] text-[#c0c5ce] border border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7]"
                  }`}
                >
                  {perm}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Users Permissions</Label>
            <div className="flex flex-wrap gap-2">
              {USER_PERMISSIONS.map((perm) => (
                <button
                  key={perm}
                  type="button"
                  onClick={() => handleUsersChange(perm)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    permissions?.users?.includes(perm)
                      ? "bg-[#5bc2e7] text-[#11111f] border border-[#5bc2e7]"
                      : "bg-[#11111f] text-[#c0c5ce] border border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7]"
                  }`}
                >
                  {perm}
                </button>
              ))}
            </div>
          </div>
          <FormError message={errors.permissions?.message} />
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
  );
}
