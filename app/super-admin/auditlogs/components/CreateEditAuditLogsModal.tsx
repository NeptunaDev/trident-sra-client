"use client";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createAuditLogs,
  updateAuditLogs,
  AuditLogs,
  Status,
} from "@/lib/auditLogs/auditLogs";

import {
  CreateAuditLogFormData,
  getCreateAuditLogSchema,
  getUpdateAuditLogSchema,
  UpdateAuditLogFormData,
} from "@/lib/auditLogs/auditLogs.schema";

import { getUser, User } from "@/lib/user/user";
import {
  getOrganizations,
  Organization,
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
import { SelectSearch } from "@/components/ui/select-search";
import { FormError } from "@/components/ui/form-error";

interface CreateEditAuditLogsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingAuditLog: AuditLogs | null;
}

export default function CreateEditAuditLogsModal({
  isOpen,
  setIsOpen,
  editingAuditLog,
}: CreateEditAuditLogsModalProps) {
  const isEditing = !!editingAuditLog;
  const { isLoading, setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUser,
  });

  const { data: organizations } = useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  // Use the correct schema based on whether we're editing or creating
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    control,
  } = useForm<CreateAuditLogFormData | UpdateAuditLogFormData>({
    resolver: zodResolver(
      isEditing ? getUpdateAuditLogSchema() : getCreateAuditLogSchema()
    ),
    mode: "onBlur", // Validates when field loses focus
    defaultValues: {
      event_type: "",
      action: "",
      description: "",
      status: "",
      user_id: "",
      organization_id: "",
      details: null,
    },
  });

  // Watch select values
  const userId = watch("user_id");
  const organizationId = watch("organization_id");

  const { mutate, isPending } = useMutation({
    mutationFn: createAuditLogs,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["audit-logs"],
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateAuditLogs,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["audit-logs"],
      });
    },
  });

  const onSubmit = (data: CreateAuditLogFormData | UpdateAuditLogFormData) => {
    if (!isEditing) {
      const createData = {
        event_type: data.event_type as string,
        action: data.action as string,
        description: data.description || null,
        status: data.status as Status,
        details: data.details || null,
        organization_id: data.organization_id || null,
        user_id: data.user_id || null,
      };
      mutate(createData);
      return;
    }

    const updateData: {
      id: string;
      event_type?: string;
      action?: string;
      description?: string | null;
      status?: Status;
      details?: Record<string, any> | null;
      organization_id?: string | null;
      user_id?: string | null;
    } = {
      id: editingAuditLog?.id ?? "",
    };

    if (data.event_type && data.event_type !== editingAuditLog?.event_type) {
      updateData.event_type = data.event_type as string;
    }
    if (data.action && data.action !== editingAuditLog?.action) {
      updateData.action = data.action as string;
    }
    if (
      data.description !== undefined &&
      data.description !== editingAuditLog?.description
    ) {
      updateData.description = data.description || null;
    }
    if (data.status && data.status !== editingAuditLog?.status) {
      updateData.status = data.status as Status;
    }
    if (
      data.organization_id !== undefined &&
      data.organization_id !== editingAuditLog?.organization_id
    ) {
      updateData.organization_id = data.organization_id || null;
    }
    if (
      data.user_id !== undefined &&
      data.user_id !== editingAuditLog?.user_id
    ) {
      updateData.user_id = data.user_id || null;
    }

    updateMutate(updateData);
  };

  // Manage loading state
  useEffect(() => {
    setIsLoading(isPending || isUpdatePending);
  }, [isPending, isUpdatePending, setIsLoading]);

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (!isOpen) {
      reset({
        event_type: "",
        action: "",
        description: "",
        status: "",
        user_id: "",
        organization_id: "",
        details: null,
      });
      return;
    }

    if (isEditing && editingAuditLog) {
      reset({
        event_type: editingAuditLog.event_type ?? "",
        action: editingAuditLog.action ?? "",
        description: editingAuditLog.description ?? "",
        status: editingAuditLog.status ?? "",
        organization_id: editingAuditLog.organization_id ?? "",
        user_id: editingAuditLog.user_id ?? "",
        details: editingAuditLog.details ?? null,
      });
    } else {
      reset({
        event_type: "",
        action: "",
        description: "",
        status: "",
        user_id: "",
        organization_id: "",
        details: null,
      });
    }
  }, [isOpen, editingAuditLog, isEditing, reset]);

  const StatusOption = [
    { value: "Success", label: "Success" },
    { value: "Failure", label: "Failure" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Edit" : "Create"} Audit Log
          </DialogTitle>
          <DialogDescription className="text-[#c0c5ce]">
            {isEditing
              ? "Update the audit log information below."
              : "Fill in the information to create a new audit log."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Event Type</Label>
            <Input
              {...register("event_type")}
              error={!!errors.event_type}
              placeholder="user.login"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.event_type?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Action</Label>
            <Input
              {...register("action")}
              error={!!errors.action}
              placeholder="login"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.action?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Description</Label>
            <Input
              {...register("description")}
              error={!!errors.description}
              placeholder="User logged in successfully"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.description?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Status</Label>
            {/* <Input
              {...register("status")}
              error={!!errors.status}
              placeholder="success"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            /> */}
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  items={StatusOption}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={!!errors.status}
                  placeholder="Select a plan"
                />
              )}
            />
            <FormError message={errors.status?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">User</Label>
            <SelectSearch
              items={
                users?.map((user) => ({
                  label: `${user.name} (${user.email})`,
                  value: user.id,
                })) ?? []
              }
              onValueChange={(value) =>
                setValue("user_id", value || null, { shouldValidate: true })
              }
              value={userId || ""}
              error={!!errors.user_id}
            />
            <FormError message={errors.user_id?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Organization</Label>
            <SelectSearch
              items={
                organizations?.map((org) => ({
                  label: org.name,
                  value: org.id,
                })) ?? []
              }
              onValueChange={(value) =>
                setValue("organization_id", value || null, {
                  shouldValidate: true,
                })
              }
              value={organizationId || ""}
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
