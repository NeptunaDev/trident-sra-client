"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  CreateAuditLogs,
  createAuditLogs,
  updateAuditLogs,
  UpdateAuditLogs,
  AuditLogs,
} from "@/lib/auditLogs";
import { getUser, User } from "@/lib/user";
import { getOrganizations, Organization } from "@/lib/organization";
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

interface CreateEditAuditLogsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingAuditLog: AuditLogs | null;
}

type FormData = {
  event_type: string;
  action: string;
  description: string;
  status: string;
  organization_id: string;
  user_id: string;
};

const INITIAL_FORM: FormData = {
  event_type: "",
  action: "",
  description: "",
  status: "",
  organization_id: "",
  user_id: "",
};

export default function CreateEditAuditLogsModal({
  isOpen,
  setIsOpen,
  editingAuditLog,
}: CreateEditAuditLogsModalProps) {
  const isEditing = !!editingAuditLog;
  const [disabled, setDisabled] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const { isLoading, setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  // Obtener usuarios y organizaciones
  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUser,
  });

  const { data: organizations } = useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createAuditLogs,
    onSuccess: () => {
      setForm(INITIAL_FORM);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["audit-logs"],
      });
    },
    onError: (error: any) => {
      console.error("Error creating audit log:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);

      // Mostrar errores de validación del backend
      if (error.response?.status === 422 && error.response?.data?.detail) {
        const validationErrors = error.response.data.detail;
        console.error("Validation errors:", validationErrors);
        // Aquí podrías mostrar estos errores al usuario con un toast o alert
        validationErrors.forEach((err: any) => {
          console.error(
            `Field: ${err.loc?.join(".")}, Message: ${err.msg}, Type: ${
              err.type
            }`
          );
        });
      }
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateAuditLogs,
    onSuccess: () => {
      setForm(INITIAL_FORM);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["audit-logs"],
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (isEditing) {
      const updateData: UpdateAuditLogs = {
        id: editingAuditLog?.id ?? "",
        event_type: form.event_type || editingAuditLog?.event_type || "",
        action: form.action || editingAuditLog?.action || "",
        description: form.description || editingAuditLog?.description || "",
        status: form.status || editingAuditLog?.status || "",
        organization_id:
          form.organization_id || editingAuditLog?.organization_id || "",
        user_id: form.user_id || editingAuditLog?.user_id || "",
      };
      console.log("Updating audit log with data:", updateData);
      updateMutate(updateData);
      return;
    }

    const createData: CreateAuditLogs = {
      event_type: form.event_type.trim(),
      action: form.action.trim(),
      description: form.description.trim(),
      status: form.status.trim(),
      details: {},
      organization_id: form.organization_id.trim(),
      user_id: form.user_id.trim(),
    };
    console.log(
      "Creating audit log with data:",
      JSON.stringify(createData, null, 2)
    );
    mutate(createData);
  };

  // Management the state the disabled
  useEffect(() => {
    if (isEditing) {
      // In edit mode, allow saving if at least one field has changed
      const hasChanges =
        form.event_type !== editingAuditLog?.event_type ||
        form.action !== editingAuditLog?.action ||
        form.description !== editingAuditLog?.description ||
        form.status !== editingAuditLog?.status ||
        form.organization_id !== editingAuditLog?.organization_id ||
        form.user_id !== editingAuditLog?.user_id;
      setDisabled(!hasChanges);
    } else {
      // In create mode, all fields are required
      const hasEmptyString =
        form.event_type.trim() === "" ||
        form.action.trim() === "" ||
        form.description.trim() === "" ||
        form.status.trim() === "" ||
        form.organization_id.trim() === "" ||
        form.user_id.trim() === "";
      setDisabled(hasEmptyString);
    }
  }, [form, isEditing, editingAuditLog]);

  // Management the state the loading
  useEffect(() => {
    setIsLoading(isPending || isUpdatePending);
  }, [isPending, isUpdatePending, setIsLoading]);

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
      return;
    }

    if (isEditing && editingAuditLog) {
      setForm({
        event_type: editingAuditLog.event_type ?? "",
        action: editingAuditLog.action ?? "",
        description: editingAuditLog.description ?? "",
        status: editingAuditLog.status ?? "",
        organization_id: editingAuditLog.organization_id ?? "",
        user_id: editingAuditLog.user_id ?? "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [isOpen, editingAuditLog, isEditing]);

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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Event Type</Label>
            <Input
              name="event_type"
              value={form.event_type}
              onChange={handleChange}
              placeholder="user.login"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Action</Label>
            <Input
              name="action"
              value={form.action}
              onChange={handleChange}
              placeholder="login"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Description</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="User logged in successfully"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Status</Label>
            <Input
              name="status"
              value={form.status}
              onChange={handleChange}
              placeholder="success"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
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
                setForm((prev) => ({ ...prev, user_id: value }))
              }
              value={form.user_id}
            />
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
                setForm((prev) => ({ ...prev, organization_id: value }))
              }
              value={form.organization_id}
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-[#11111f]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={disabled}
            className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold disabled:opacity-50"
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
