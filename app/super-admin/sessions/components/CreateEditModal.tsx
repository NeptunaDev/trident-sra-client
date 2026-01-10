"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createSession,
  updateSession,
  Session,
  SessionStatus,
} from "@/lib/Session/session";
import { getCurrentUser } from "@/lib/user/user";
import { getConnections } from "@/lib/Connection/connections";
import {
  CreateSessionFormData,
  UpdateSessionFormData,
  getCreateSessionSchema,
  getUpdateSessionSchema,
} from "@/lib/Session/session.schema";

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
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/ui/form-error";

interface CreateEditModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingSession: Session | null;
}

const STATUS_OPTIONS = [
  { label: "preparing", value: SessionStatus.PREPARING },
  { label: "active", value: SessionStatus.ACTIVE },
  { label: "ended", value: SessionStatus.ENDED },
  { label: "error", value: SessionStatus.ERROR },
];

export default function CreateEditSessionModal({
  isOpen,
  setIsOpen,
  editingSession,
}: CreateEditModalProps) {
  const isEditing = !!editingSession;
  const { setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  // Use the correct schema based on whether we're editing or creating
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<CreateSessionFormData | UpdateSessionFormData>({
    resolver: zodResolver(
      isEditing ? getUpdateSessionSchema() : getCreateSessionSchema()
    ),
    mode: "onBlur",
    defaultValues: {
      public_session_id: "",
      connection_id: "",
      status: SessionStatus.ACTIVE,
      recording_enabled: false,
      total_commands: 0,
      blocked_commands: 0,
      duration_seconds: 0,
      recording_url: "",
    },
  });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateSessionFormData) => {
      if (!currentUser) throw new Error("User not logged in");
      return createSession({
        ...data,
        initiated_by_user_id: currentUser.id,
      });
    },
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateSession,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });

  const onSubmit = (data: CreateSessionFormData | UpdateSessionFormData) => {
    if (!isEditing) {
      mutate(data as CreateSessionFormData);
      return;
    }
    if (!editingSession?.id) return;

    const updateData: { id: string; [key: string]: any } = {
      id: editingSession.id,
    };

    if (
      data.recording_enabled !== undefined &&
      data.recording_enabled !== editingSession.recording_enabled
    ) {
      updateData.recording_enabled = data.recording_enabled;
    }
    if (data.status !== undefined && data.status !== editingSession.status) {
      updateData.status = data.status as SessionStatus;
    }
    if (
      data.duration_seconds !== undefined &&
      data.duration_seconds !== editingSession.duration_seconds
    ) {
      updateData.duration_seconds = data.duration_seconds;
    }
    if (
      data.recording_url !== undefined &&
      data.recording_url !== editingSession.recording_url
    ) {
      updateData.recording_url = data.recording_url;
    }
    if (
      data.total_commands !== undefined &&
      data.total_commands !== editingSession.total_commands
    ) {
      updateData.total_commands = data.total_commands;
    }
    if (
      data.blocked_commands !== undefined &&
      data.blocked_commands !== editingSession.blocked_commands
    ) {
      updateData.blocked_commands = data.blocked_commands;
    }

    updateMutate(updateData);
  };

  // Watch select values
  const connectionId = watch("connection_id");
  const status = watch("status") as SessionStatus | undefined;
  const recordingEnabled = watch("recording_enabled");

  // Manage loading state
  useEffect(() => {
    setIsLoading(isPending || isUpdatePending);
  }, [isPending, isUpdatePending, setIsLoading]);

  // Manage form state when editing session
  // Reset form when edit mode changes
  useEffect(() => {
    if (!isOpen) return;
    if (!isEditing || !editingSession) {
      reset({
        public_session_id: "",
        connection_id: "",
        status: SessionStatus.ACTIVE,
        recording_enabled: false,
        total_commands: 0,
        blocked_commands: 0,
        duration_seconds: 0,
        recording_url: "",
      });
      return;
    }
    reset({
      public_session_id: editingSession.public_session_id,
      connection_id: editingSession.connection_id,
      recording_enabled: editingSession.recording_enabled ?? false,
      status: editingSession.status ?? SessionStatus.ACTIVE,
      duration_seconds: editingSession.duration_seconds ?? 0,
      recording_url: editingSession.recording_url ?? "",
      total_commands: editingSession.total_commands ?? 0,
      blocked_commands: editingSession.blocked_commands ?? 0,
    });
  }, [isOpen, isEditing, editingSession, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Edit" : "Create"} Session
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Public Session ID</Label>
            <Input
              {...register("public_session_id")}
              error={
                !!(
                  errors &&
                  "public_session_id" in errors &&
                  errors.public_session_id
                )
              }
              disabled={isEditing || isPending || isUpdatePending}
              placeholder="Enter public session ID"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError
              message={
                errors && "public_session_id" in errors
                  ? errors.public_session_id?.message
                  : undefined
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Connection</Label>
            <SelectSearch
              items={
                connections?.map((conn) => ({
                  label: conn.name,
                  value: conn.id,
                })) ?? []
              }
              value={connectionId}
              onValueChange={(value) =>
                setValue("connection_id", value, { shouldValidate: true })
              }
              error={
                !!(errors && "connection_id" in errors && errors.connection_id)
              }
            />
            <FormError
              message={
                errors && "connection_id" in errors
                  ? errors.connection_id?.message
                  : undefined
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Status (optional)</Label>
            <SelectSearch
              items={STATUS_OPTIONS}
              value={status || ""}
              onValueChange={(value) =>
                setValue("status", value as SessionStatus, {
                  shouldValidate: true,
                })
              }
              error={!!errors.status}
            />
            <FormError message={errors.status?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">
              Duration in seconds (optional)
            </Label>
            <Input
              {...register("duration_seconds", { valueAsNumber: true })}
              error={!!errors.duration_seconds}
              type="number"
              disabled={isPending || isUpdatePending}
              placeholder="0"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.duration_seconds?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Recording URL (optional)</Label>
            <Input
              {...register("recording_url")}
              error={!!errors.recording_url}
              disabled={isPending || isUpdatePending}
              placeholder="https://..."
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.recording_url?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Total Commands (optional)</Label>
            <Input
              {...register("total_commands", { valueAsNumber: true })}
              error={!!errors.total_commands}
              type="number"
              disabled={isPending || isUpdatePending}
              placeholder="0"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.total_commands?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">
              Blocked Commands (optional)
            </Label>
            <Input
              {...register("blocked_commands", { valueAsNumber: true })}
              error={!!errors.blocked_commands}
              type="number"
              disabled={isPending || isUpdatePending}
              placeholder="0"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.blocked_commands?.message} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="recording_enabled"
              checked={recordingEnabled}
              onCheckedChange={(checked) =>
                setValue("recording_enabled", checked, { shouldValidate: true })
              }
              disabled={isPending || isUpdatePending}
            />
            <Label htmlFor="recording_enabled" className="text-[#c0c5ce]">
              Recording Enabled
            </Label>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isPending || isUpdatePending}
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
