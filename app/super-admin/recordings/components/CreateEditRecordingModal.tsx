"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/ui/form-error";
import {
  CreateSessionRecordingFormData,
  UpdateSessionRecordingFormData,
  getCreateSessionRecordingSchema,
  getUpdateSessionRecordingSchema,
} from "@/lib/Recording/recording.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSessionRecording,
  updateSessionRecording,
  SessionRecording,
  RecordingStatus,
  UpdateSessionRecording,
} from "@/lib/Recording/session_recording";
import { getSession } from "@/lib/Session/session";

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

interface CreateEditRecordingModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingRecording: SessionRecording | null;
}

const STATUS_OPTIONS = [
  { label: "Processing", value: RecordingStatus.PROCESSING },
  { label: "Ready", value: RecordingStatus.READY },
  { label: "Error", value: RecordingStatus.ERROR },
];

export default function CreateEditRecordingModal({
  isOpen,
  setIsOpen,
  editingRecording,
}: CreateEditRecordingModalProps) {
  const isEditing = !!editingRecording;
  const { setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<CreateSessionRecordingFormData | UpdateSessionRecordingFormData>({
    resolver: zodResolver(
      isEditing
        ? getUpdateSessionRecordingSchema()
        : getCreateSessionRecordingSchema()
    ),
    mode: "onBlur",
    defaultValues: {
      session_id: "",
      file_url: "",
      file_name: "",
      file_size_bytes: 0,
      duration_seconds: 0,
      status: RecordingStatus.PROCESSING,
    },
  });

  const { data: sessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSession,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateSessionRecordingFormData) => {
      return createSessionRecording({
        session_id: data.session_id,
        file_url: data.file_url,
        ...(data.file_name ? { file_name: data.file_name } : {}),
        ...(data.file_size_bytes !== undefined
          ? { file_size_bytes: data.file_size_bytes }
          : {}),
        ...(data.duration_seconds !== undefined
          ? { duration_seconds: data.duration_seconds }
          : {}),
        ...(data.status ? { status: data.status as RecordingStatus } : {}),
      });
    },
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["session_recordings"],
      });
    },
    onError: (error: any) => {
      console.error("Create error:", error);
      alert(
        error.response?.data?.detail ||
          error.message ||
          "Failed to create recording"
      );
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateSessionRecording,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["session_recordings"],
      });
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      alert(
        error.response?.data?.detail ||
          error.message ||
          "Failed to update recording"
      );
    },
  });

  const onSubmit = (
    data: CreateSessionRecordingFormData | UpdateSessionRecordingFormData
  ) => {
    if (!isEditing) {
      mutate(data as CreateSessionRecordingFormData);
      return;
    }
    if (!editingRecording?.id) return;

    const updateData: UpdateSessionRecording = {
      id: editingRecording.id,
    };

    if (
      "session_id" in data &&
      data.session_id !== undefined &&
      data.session_id !== editingRecording.session_id
    ) {
      updateData.session_id = data.session_id;
    }
    if (
      data.file_url !== undefined &&
      data.file_url !== editingRecording.file_url
    ) {
      updateData.file_url = data.file_url;
    }
    if (
      data.file_name !== undefined &&
      data.file_name !== editingRecording.file_name
    ) {
      updateData.file_name = data.file_name;
    }
    if (
      data.file_size_bytes !== undefined &&
      Number(data.file_size_bytes) !== Number(editingRecording.file_size_bytes)
    ) {
      updateData.file_size_bytes = Number(data.file_size_bytes);
    }
    if (
      data.duration_seconds !== undefined &&
      Number(data.duration_seconds) !==
        Number(editingRecording.duration_seconds)
    ) {
      updateData.duration_seconds = Number(data.duration_seconds);
    }
    if (data.status !== undefined && data.status !== editingRecording.status) {
      updateData.status = data.status as RecordingStatus;
    }

    updateMutate(updateData);
  };

  // Watch select values
  const sessionId = watch("session_id") as string | undefined;
  const status = watch("status") as RecordingStatus | undefined;

  // Manage loading state
  useEffect(() => {
    setIsLoading(isPending || isUpdatePending);
  }, [isPending, isUpdatePending, setIsLoading]);

  // Reset form when edit mode changes
  useEffect(() => {
    if (!isOpen) return;
    if (!isEditing || !editingRecording) {
      reset({
        session_id: "",
        file_url: "",
        file_name: "",
        file_size_bytes: 0,
        duration_seconds: 0,
        status: RecordingStatus.PROCESSING,
      });
      return;
    }
    reset({
      session_id: editingRecording.session_id ?? "",
      file_url: editingRecording.file_url ?? "",
      file_name: editingRecording.file_name ?? "",
      file_size_bytes: Number(editingRecording.file_size_bytes) ?? 0,
      duration_seconds: Number(editingRecording.duration_seconds) ?? 0,
      status: editingRecording.status ?? RecordingStatus.PROCESSING,
    });
  }, [isOpen, isEditing, editingRecording, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Edit" : "Create"} Recording
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Session</Label>
            <SelectSearch
              items={
                sessions?.map((session) => ({
                  label: session.public_session_id,
                  value: session.id,
                })) ?? []
              }
              value={sessionId || ""}
              onValueChange={(value) =>
                setValue("session_id", value as string, {
                  shouldValidate: true,
                })
              }
              error={!!(errors && "session_id" in errors && errors.session_id)}
            />
            <FormError
              message={
                errors && "session_id" in errors && errors.session_id
                  ? (errors.session_id as { message?: string })?.message
                  : undefined
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">File URL</Label>
            <Input
              {...register("file_url")}
              error={!!errors.file_url}
              placeholder="https://example.com/recordings/file.mp4"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.file_url?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">File Name</Label>
            <Input
              {...register("file_name")}
              error={!!errors.file_name}
              placeholder="recording_2025-12-22.mp4"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.file_name?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">File Size (bytes)</Label>
            <Input
              {...register("file_size_bytes", { valueAsNumber: true })}
              error={!!errors.file_size_bytes}
              type="number"
              placeholder="1024000"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.file_size_bytes?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Duration (seconds)</Label>
            <Input
              {...register("duration_seconds", { valueAsNumber: true })}
              error={!!errors.duration_seconds}
              type="number"
              placeholder="300"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.duration_seconds?.message} />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Status</Label>
            <SelectSearch
              items={STATUS_OPTIONS}
              value={status}
              onValueChange={(value) =>
                setValue("status", value as RecordingStatus, {
                  shouldValidate: true,
                })
              }
              error={!!errors.status}
            />
            <FormError message={errors.status?.message} />
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
