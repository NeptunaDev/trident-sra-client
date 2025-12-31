"use client";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CreateOrganization,
  Organization,
  updateOrganization,
} from "@/lib/organization/organization";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/ui/form-error";
import {
  CreateOrganizationFormData,
  getCreateOrganizationSchema,
  getUpdateOrganizationSchema,
  UpdateOrganizationFormData,
} from "@/lib/organization/organization.schema";

interface CreateEditOrganizationsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingOrganizations: Organization | null;
}

export default function CreateEditOrganizationsModal({
  isOpen,
  setIsOpen,
  editingOrganizations,
}: CreateEditOrganizationsModalProps) {
  const isEditing = !!editingOrganizations;
  const { isLoading, setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<CreateOrganizationFormData | UpdateOrganizationFormData>({
    resolver: zodResolver(
      isEditing ? getUpdateOrganizationSchema() : getCreateOrganizationSchema()
    ),
    mode: "onChange", // Validate on every change
    reValidateMode: "onChange", // Re-validate on every change
    defaultValues: {
      name: "",
      slug: "",
      plan: "",
      max_users: null,
      max_connections: null,
      max_agents: null,
      ...(isEditing ? { is_active: true } : {}),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateOrganization,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
  });

  const onSubmit = (
    data: CreateOrganizationFormData | UpdateOrganizationFormData
  ) => {
    const toPositiveOrNull = (val: number | null | undefined) =>
      typeof val === "number" && val > 0 ? val : null;

    if (!isEditing) {
      const createData: CreateOrganization = {
        name: (data as CreateOrganizationFormData).name,
        slug: (data as CreateOrganizationFormData).slug,
        plan: (data as CreateOrganizationFormData).plan,
        max_users: toPositiveOrNull(
          (data as CreateOrganizationFormData).max_users
        ),
        max_agents: toPositiveOrNull(
          (data as CreateOrganizationFormData).max_agents
        ),
        max_connections: toPositiveOrNull(
          (data as CreateOrganizationFormData).max_connections
        ),
      };
      mutate(createData);
      return;
    }

    // For update, only send changed fields
    const updateData: updateOrganization = {
      id: editingOrganizations?.id ?? "",
      is_active: editingOrganizations?.is_active ?? true,
      ...(data.name !== editingOrganizations?.name ? { name: data.name } : {}),
      ...(data.slug !== editingOrganizations?.slug ? { slug: data.slug } : {}),
      ...(data.plan !== editingOrganizations?.plan ? { plan: data.plan } : {}),
      ...(data.max_users !== editingOrganizations?.max_users
        ? { max_users: toPositiveOrNull(data.max_users) ?? undefined }
        : {}),
      ...(data.max_agents !== editingOrganizations?.max_agents
        ? { max_agents: toPositiveOrNull(data.max_agents) ?? undefined }
        : {}),
      ...(data.max_connections !== editingOrganizations?.max_connections
        ? {
            max_connections:
              toPositiveOrNull(data.max_connections) ?? undefined,
          }
        : {}),
      ...("is_active" in data &&
      data.is_active !== undefined &&
      data.is_active !== editingOrganizations?.is_active
        ? { is_active: data.is_active }
        : {}),
    };
    updateMutate(updateData);
  };

  // Register numeric fields - use simple register, let z.preprocess handle conversion
  const maxUsersRegister = register("max_users");
  const maxAgentsRegister = register("max_agents");
  const maxConnectionsRegister = register("max_connections");

  // Debug: log errors to see what's happening
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
      console.log("Errors max_users:", errors.max_users);
      console.log("Errors max_agents:", errors.max_agents);
      console.log("Errors max_connections:", errors.max_connections);
    }
  }, [errors]);

  // Manage loading state
  useEffect(() => {
    setIsLoading(isPending || isUpdatePending);
  }, [isPending, isUpdatePending, setIsLoading]);

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (!isOpen) {
      reset();
      return;
    }

    if (isEditing && editingOrganizations) {
      reset({
        name: editingOrganizations.name ?? "",
        slug: editingOrganizations.slug ?? "",
        plan: editingOrganizations.plan ?? "",
        max_users: editingOrganizations.max_users ?? null,
        max_agents: editingOrganizations.max_agents ?? null,
        max_connections: editingOrganizations.max_connections ?? null,
        is_active: editingOrganizations.is_active ?? true,
      });
    } else {
      reset({
        name: "",
        slug: "",
        plan: "",
        max_users: null,
        max_connections: null,
        max_agents: null,
      });
    }
  }, [isOpen, editingOrganizations, isEditing, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Edit" : "Create"} Organization
          </DialogTitle>
          <DialogDescription className="text-[#c0c5ce]">
            {isEditing
              ? "Update the organization information below."
              : "Fill in the information to create a new organization."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Name</Label>
            <Input
              {...register("name")}
              error={!!errors.name}
              placeholder="Trident Demo"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.name?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Slug</Label>
            <Input
              {...register("slug")}
              error={!!errors.slug}
              placeholder="trident-demo"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.slug?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Plan</Label>
            <Input
              {...register("plan")}
              error={!!errors.plan}
              placeholder="enterprise"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.plan?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Max Users</Label>
            <Input
              type="number"
              {...maxUsersRegister}
              error={!!errors.max_users}
              placeholder="100"
              min="0"
              step="1"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:opacity-0 [&::-webkit-outer-spin-button]:opacity-0 [-moz-appearance:textfield]"
            />
            <FormError message={errors.max_users?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Max Agents</Label>
            <Input
              type="number"
              {...maxAgentsRegister}
              error={!!errors.max_agents}
              placeholder="50"
              min="0"
              step="1"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:opacity-0 [&::-webkit-outer-spin-button]:opacity-0 [-moz-appearance:textfield]"
            />
            <FormError message={errors.max_agents?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Max Connections</Label>
            <Input
              type="number"
              {...maxConnectionsRegister}
              error={!!errors.max_connections}
              placeholder="500"
              min="0"
              step="1"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:opacity-0 [&::-webkit-outer-spin-button]:opacity-0 [-moz-appearance:textfield]"
            />
            <FormError message={errors.max_connections?.message} />
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
