"use  client";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, CreateUser, updateUser, User } from "@/lib/user/user";
import { Role } from "@/lib/role";
import { Organization } from "@/lib/organization/organization";
import { useloadingStore } from "@/store/loadingStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectSearch } from "@/components/ui/select-search";
import { useForm } from "react-hook-form";
import {
  CreateUserFormData,
  getCreateUserSchema,
  getUpdateUserSchema,
  UpdateUserFormData,
} from "@/lib/user/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/ui/form-error";

interface CreateEditUserModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  roles: Role[];
  organizations: Organization[];
  editingUser: User | null;
}

const INITIAL_FORM: CreateUser = {
  name: "",
  email: "",
  password: "",
  role_id: "",
  organization_id: "",
};

export default function CreateEditUserModal({
  isOpen,
  setIsOpen,
  roles,
  organizations,
  editingUser,
}: CreateEditUserModalProps) {
  const isEditing = !!editingUser;
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
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(
      isEditing ? getUpdateUserSchema() : getCreateUserSchema()
    ),
    mode: "onBlur", // Validates when field loses focus
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role_id: "",
      organization_id: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const onSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    if (!isEditing) {
      mutate(data as CreateUserFormData);
      return;
    }
    updateMutate({
      id: editingUser?.id ?? "",
      ...(data.password?.trim() !== "" ? { password: data.password } : {}),
      ...(data.name !== editingUser?.name ? { name: data.name } : {}),
      ...(data.email !== editingUser?.email ? { email: data.email } : {}),
      ...(data.organization_id !== editingUser?.organization_id
        ? { organization_id: data.organization_id }
        : {}),
      ...(data.role_id !== editingUser?.role_id
        ? { role_id: data.role_id }
        : {}),
    });
  };

  // Watch select values
  const roleId = watch("role_id");
  const organizationId = watch("organization_id");

  // Manage loading state
  useEffect(() => {
    setIsLoading(isPending || isUpdatePending);
  }, [isPending, isUpdatePending, setIsLoading]);

  // Manage form state when editing user
  // Reset form when edit mode changes
  useEffect(() => {
    if (!isOpen) return;
    if (!isEditing || !editingUser) {
      reset({
        name: "",
        email: "",
        password: "",
        role_id: "",
        organization_id: "",
      });
      return;
    }
    reset({
      name: editingUser.name,
      email: editingUser.email,
      password: "",
      role_id: editingUser.role_id,
      organization_id: editingUser.organization_id,
    });
  }, [isOpen, isEditing, editingUser, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Edit" : "Create"} User
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Name</Label>
            <Input
              {...register("name")}
              error={!!errors.name}
              placeholder="John Doe"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Email</Label>
            <Input
              {...register("email")}
              error={!!errors.email}
              type="email"
              placeholder="john@example.com"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.email?.message} />
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
            <Label className="text-[#c0c5ce]">Role</Label>
            <SelectSearch
              items={
                roles?.map((role) => ({
                  label: role.display_name,
                  value: role.id,
                })) ?? []
              }
              onValueChange={(value) =>
                setValue("role_id", value, { shouldValidate: true })
              }
              value={roleId}
              error={!!errors.role_id}
            />
            <FormError message={errors.role_id?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Organization</Label>
            <SelectSearch
              items={
                organizations?.map((organization) => ({
                  label: organization.name,
                  value: organization.id,
                })) ?? []
              }
              onValueChange={(value) =>
                setValue("organization_id", value, { shouldValidate: true })
              }
              value={organizationId}
              error={!!errors.organization_id}
            />
            <FormError message={errors.organization_id?.message} />
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
  );
}
