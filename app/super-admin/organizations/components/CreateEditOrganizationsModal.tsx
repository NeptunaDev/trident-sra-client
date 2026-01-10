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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/ui/form-error";
import {
  CreateOrganizationFormData,
  getCreateOrganizationSchema,
  getUpdateOrganizationSchema,
  UpdateOrganizationFormData,
} from "@/lib/organization/organization.schema";
import { SelectSearch } from "@/components/ui/select-search";
import { cn } from "@/lib/utils";

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
    control,
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
      tunnel_type: undefined,
      tunnel_config: null,
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
        plan: (data as CreateOrganizationFormData).plan.toLowerCase(),
        tunnel_type: (data as CreateOrganizationFormData).tunnel_type,
        tunnel_config:
          (data as CreateOrganizationFormData).tunnel_config ??
          ({} as Record<string, any>),
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
      ...(data.tunnel_type !== editingOrganizations?.tunnel_type
        ? { tunnel_type: data.tunnel_type }
        : {}),
      ...(data.tunnel_config !== editingOrganizations?.tunnel_config
        ? { tunnel_config: data.tunnel_config ?? null }
        : {}),
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
      // Convert plan to proper case (first letter uppercase, rest lowercase)
      const planValue = editingOrganizations.plan
        ? ((editingOrganizations.plan.charAt(0).toUpperCase() +
            editingOrganizations.plan.slice(1).toLowerCase()) as
            | "Free"
            | "Pro"
            | "Enterprise")
        : "";

      reset({
        name: editingOrganizations.name ?? "",
        slug: editingOrganizations.slug ?? "",
        plan: planValue,
        tunnel_type: editingOrganizations.tunnel_type,
        tunnel_config: editingOrganizations.tunnel_config ?? null,
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
        tunnel_type: undefined,
        tunnel_config: null,
        max_users: null,
        max_connections: null,
        max_agents: null,
      });
    }
  }, [isOpen, editingOrganizations, isEditing, reset]);

  const planOptions = [
    { value: "Free", label: "Free" },
    { value: "Pro", label: "Pro" },
    { value: "Enterprise", label: "Enterprise" },
  ];

  const tunnelTypeOptions = [
    { value: "cloudflare", label: "Cloudflare" },
    { value: "ssh_reverse", label: "SSH Reverse" },
    { value: "vpn", label: "VPN" },
    { value: "ngrok", label: "Ngrok" },
    { value: "direct", label: "Direct" },
  ];

  // Watch select values
  const tunnelType = watch("tunnel_type");

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
            {/* <Input
              {...register("plan")}
              error={!!errors.plan}
              placeholder="enterprise"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            /> */}
            <Controller
              name="plan"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  items={planOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={!!errors.plan}
                  placeholder="Select a plan"
                />
              )}
            />
            <FormError message={errors.plan?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Tunnel Type *</Label>
            <Controller
              name="tunnel_type"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  items={tunnelTypeOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={!!errors.tunnel_type}
                  placeholder="Select tunnel type"
                />
              )}
            />
            <FormError message={errors.tunnel_type?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Tunnel Config</Label>
            <Controller
              name="tunnel_config"
              control={control}
              render={({ field }) => (
                <textarea
                  value={
                    field.value
                      ? typeof field.value === "string"
                        ? field.value
                        : JSON.stringify(field.value, null, 2)
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    if (value === "") {
                      field.onChange(null);
                      return;
                    }
                    try {
                      const parsed = JSON.parse(value);
                      field.onChange(parsed);
                    } catch {
                      // If invalid JSON, just keep as string for now
                      field.onChange(value);
                    }
                  }}
                  onBlur={field.onBlur}
                  placeholder='{"key": "value"}'
                  className={cn(
                    "w-full h-24 px-3 py-2 bg-[#11111f] border rounded-md text-white placeholder:text-gray-500 resize-none font-mono text-sm",
                    "border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] focus:outline-none",
                    errors.tunnel_config
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  )}
                />
              )}
            />
            <FormError
              message={
                typeof errors.tunnel_config?.message === "string"
                  ? errors.tunnel_config.message
                  : undefined
              }
            />
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
