"use client";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";

import {
  CreateSessionParticipant,
  createSessionParticipant,
  updateSessionParticipant,
  UpdateSessionParticipant,
  SessionParticipant,
  SessionParticipantRole,
} from "@/lib/sessionParticipants/sessionParticipants";
import { getUser, User } from "@/lib/user/user";
import { getSession, Session } from "@/lib/session";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectSearch } from "@/components/ui/select-search";

interface CreateEditSessionParticipantsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingSessionParticipant: SessionParticipant | null;
}

const ROLES: SessionParticipantRole[] = ["owner", "collaborator", "observer"];

type FormData = {
  session_id: string;
  user_id: string;
  role: SessionParticipantRole;
  can_write: boolean;
  join_at: string;
};

const INITIAL_FORM: FormData = {
  session_id: "",
  user_id: "",
  role: "observer",
  can_write: false,
  join_at: new Date().toISOString(),
};

export default function CreateEditSessionParticipantsModal({
  isOpen,
  setIsOpen,
  editingSessionParticipant,
}: CreateEditSessionParticipantsModalProps) {
  const isEditing = !!editingSessionParticipant;
  const { setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  // --- React Hook Form ---
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<FormData>({
    defaultValues: INITIAL_FORM,
  });

  const formValues = watch();

  // Obtener usuarios y sesiones
  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUser,
  });

  const { data: sessions, error: sessionsError } = useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: getSession,
  });

  // Mantener tus logs originales
  useEffect(() => {
    if (sessions) {
      console.log("Sessions loaded:", sessions);
      console.log("Sessions count:", sessions.length);
    }
    if (sessionsError) {
      console.error("Sessions error:", sessionsError);
    }
  }, [sessions, sessionsError]);

  // Mutations
  const { mutate, isPending } = useMutation({
    mutationFn: createSessionParticipant,
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["session-participants"] });
    },
    onError: (error: any) => {
      console.error("Error creating session participant:", error);
      // Aquí se mantiene toda tu lógica de logs de error 422...
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateSessionParticipant,
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["session-participants"] });
    },
    onError: (error: any) => {
      console.error("Error updating session participant:", error);
    },
  });

  // Sync loading state
  useEffect(() => {
    setIsLoading(isPending || isUpdatePending);
  }, [isPending, isUpdatePending, setIsLoading]);

  // Reset/Set Form al abrir o cambiar de modo
  useEffect(() => {
    if (!isOpen) {
      reset(INITIAL_FORM);
    } else if (isEditing && editingSessionParticipant) {
      reset({
        session_id: editingSessionParticipant.session_id ?? "",
        user_id: editingSessionParticipant.user_id ?? "",
        role:
          (editingSessionParticipant.role as SessionParticipantRole) ??
          "observer",
        can_write: editingSessionParticipant.can_write ?? false,
        join_at: editingSessionParticipant.join_at ?? new Date().toISOString(),
      });
    }
  }, [isOpen, editingSessionParticipant, isEditing, reset]);

  // Lógica de guardado (Submit)
  const onSave = (data: FormData) => {
    if (isEditing) {
      const updateData: UpdateSessionParticipant = {
        id: editingSessionParticipant?.id ?? "",
        role: data.role,
        can_write: data.can_write,
        is_active: editingSessionParticipant?.is_active ?? true,
        left_at: new Date().toISOString(),
      };
      updateMutate(updateData);
    } else {
      const createData: CreateSessionParticipant = {
        ...data,
        session_id: data.session_id.trim(),
        user_id: data.user_id.trim(),
        join_at: new Date(data.join_at).toISOString(),
      };
      mutate(createData);
    }
  };

  // Validación de botón (disabled)
  const isButtonDisabled = isEditing
    ? formValues.role === editingSessionParticipant?.role &&
      formValues.can_write === editingSessionParticipant?.can_write
    : !formValues.session_id || !formValues.user_id || !formValues.join_at;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit" : "Create"} Session Participant
          </DialogTitle>
          <DialogDescription className="text-[#c0c5ce]">
            {isEditing
              ? "Update information."
              : "Fill in to create a participant."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          {/* --- Session Selection --- */}
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Session</Label>
            {sessionsError ? (
              <div className="text-sm text-red-400">
                Error loading sessions.
              </div>
            ) : sessions?.length === 0 ? (
              <div className="text-sm text-yellow-400">
                No sessions available.
              </div>
            ) : (
              <Controller
                control={control}
                name="session_id"
                render={({ field }) => (
                  <SelectSearch
                    items={
                      sessions?.map((s) => ({
                        label: `${s.public_session_id || s.id} (${s.status})`,
                        value: s.id,
                      })) ?? []
                    }
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
            )}
          </div>

          {/* --- User Selection --- */}
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">User</Label>
            <Controller
              control={control}
              name="user_id"
              render={({ field }) => (
                <SelectSearch
                  items={
                    users?.map((u) => ({
                      label: `${u.name} (${u.email})`,
                      value: u.id,
                    })) ?? []
                  }
                  onValueChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>

          {/* --- Role Selection --- */}
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-[#11111f] border-[rgba(91,194,231,0.2)] text-white">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#11111f] border-[rgba(91,194,231,0.2)] text-white">
                    {ROLES.map((role) => (
                      <SelectItem
                        key={role}
                        value={role}
                        className="hover:bg-[#1a1a2e]"
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* --- Can Write --- */}
          <div className="space-y-2 flex items-center gap-2">
            <input
              type="checkbox"
              {...register("can_write")}
              id="can_write"
              className="w-4 h-4 rounded bg-[#11111f] text-[#5bc2e7]"
            />
            <Label
              htmlFor="can_write"
              className="text-[#c0c5ce] cursor-pointer"
            >
              Allow writing commands
            </Label>
          </div>

          {/* --- Join At --- */}
          {!isEditing && (
            <div className="space-y-2">
              <Label className="text-[#c0c5ce]">Join At</Label>
              <Input
                type="datetime-local"
                value={
                  formValues.join_at
                    ? new Date(formValues.join_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setValue(
                    "join_at",
                    e.target.value ? new Date(e.target.value).toISOString() : ""
                  )
                }
                className="bg-[#11111f] border-[rgba(91,194,231,0.2)] text-white"
              />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] text-[#11111f] font-semibold disabled:opacity-50"
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
