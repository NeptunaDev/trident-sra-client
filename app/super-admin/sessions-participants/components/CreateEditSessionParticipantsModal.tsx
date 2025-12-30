"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  CreateSessionParticipant,
  createSessionParticipant,
  updateSessionParticipant,
  UpdateSessionParticipant,
  SessionParticipant,
  SessionParticipantRole,
} from "@/lib/sessionParticipants";
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

const ROLES: SessionParticipantRole[] = ["owner", "collaborator", "viewer"];

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
  role: "viewer",
  can_write: false,
  join_at: new Date().toISOString(),
};

export default function CreateEditSessionParticipantsModal({
  isOpen,
  setIsOpen,
  editingSessionParticipant,
}: CreateEditSessionParticipantsModalProps) {
  const isEditing = !!editingSessionParticipant;
  const [disabled, setDisabled] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const { isLoading, setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  // Obtener usuarios y sesiones
  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUser,
  });

  const { data: sessions, error: sessionsError } = useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: getSession,
  });

  useEffect(() => {
    if (sessions) {
      console.log("Sessions loaded:", sessions);
      console.log("Sessions count:", sessions.length);
    }
    if (sessionsError) {
      console.error("Sessions error:", sessionsError);
      if ((sessionsError as any).response) {
        console.error("Error response:", (sessionsError as any).response);
        console.error(
          "Error response data:",
          (sessionsError as any).response?.data
        );
      }
    }
  }, [sessions, sessionsError]);

  const { mutate, isPending } = useMutation({
    mutationFn: createSessionParticipant,
    onSuccess: () => {
      setForm(INITIAL_FORM);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["session-participants"],
      });
    },
    onError: (error: any) => {
      console.error("Error creating session participant:", error);
      console.error("Error response:", error.response);
      console.error("Error response status:", error.response?.status);
      console.error("Error response data:", error.response?.data);

      if (error.response?.status === 422) {
        const errorData = error.response?.data;
        console.error("Full error data:", JSON.stringify(errorData, null, 2));

        if (errorData?.error) {
          const backendError = errorData.error;
          console.error(
            "Backend error object:",
            JSON.stringify(backendError, null, 2)
          );

          // Si el error es un string
          if (typeof backendError === "string") {
            console.error("Error message:", backendError);
          }
          // Si el error es un objeto con message
          else if (backendError?.message) {
            console.error("Error message:", backendError.message);
            if (backendError?.details) {
              console.error("Error details:", backendError.details);
            }
          }
          // Si el error tiene otros campos
          else {
            console.error("Error keys:", Object.keys(backendError));
            for (const key in backendError) {
              console.error(`Error.${key}:`, backendError[key]);
            }
          }
        } else if (errorData?.detail) {
          // Formato FastAPI/Pydantic
          const validationErrors = errorData.detail;
          console.error("Validation errors:", validationErrors);
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach((err: any) => {
              const fieldPath = err.loc?.join(".") || "unknown";
              console.error(
                `❌ Field: ${fieldPath}, Message: ${err.msg}, Type: ${err.type}`
              );
              // Mostrar el valor que causó el error si está disponible
              if (err.ctx) {
                console.error(`   Context:`, err.ctx);
              }
            });
          }
        } else {
          console.error(
            "422 error but no error details. Full response data:",
            JSON.stringify(errorData, null, 2)
          );
        }
      }
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateSessionParticipant,
    onSuccess: () => {
      setForm(INITIAL_FORM);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["session-participants"],
      });
    },
    onError: (error: any) => {
      console.error("Error updating session participant:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (value: SessionParticipantRole) => {
    setForm((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSave = () => {
    if (isEditing) {
      const updateData: UpdateSessionParticipant = {
        id: editingSessionParticipant?.id ?? "",
        role:
          form.role ||
          (editingSessionParticipant?.role as SessionParticipantRole) ||
          "viewer",
        can_write: form.can_write,
        is_active: editingSessionParticipant?.is_active ?? true,
        left_at: new Date().toISOString(),
      };
      console.log("Updating session participant with data:", updateData);
      updateMutate(updateData);
      return;
    }

    if (!form.session_id.trim() || !form.user_id.trim()) {
      console.error("Missing required fields: session_id or user_id");
      return;
    }

    let joinAtDate: string | null = null;
    if (form.join_at && form.join_at.trim() !== "") {
      try {
        const dateObj = new Date(form.join_at);
        if (!isNaN(dateObj.getTime())) {
          joinAtDate = dateObj.toISOString();
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }

    const createData: CreateSessionParticipant = {
      role: form.role,
      can_write: form.can_write,
      session_id: form.session_id.trim(),
      user_id: form.user_id.trim(),
      join_at: joinAtDate,
    };

    console.log(
      "Creating session participant with data:",
      JSON.stringify(createData, null, 2)
    );
    console.log("Data types:", {
      role: typeof createData.role,
      can_write: typeof createData.can_write,
      session_id: typeof createData.session_id,
      user_id: typeof createData.user_id,
      join_at: typeof createData.join_at,
      join_at_value: createData.join_at,
    });
    mutate(createData);
  };

  useEffect(() => {
    if (isEditing) {
      const hasChanges =
        form.role !==
          (editingSessionParticipant?.role as SessionParticipantRole) ||
        form.can_write !== editingSessionParticipant?.can_write;
      setDisabled(!hasChanges);
    } else {
      const hasEmptyString =
        form.session_id.trim() === "" ||
        form.user_id.trim() === "" ||
        form.join_at.trim() === "";
      setDisabled(hasEmptyString);
    }
  }, [form, isEditing, editingSessionParticipant]);

  useEffect(() => {
    setIsLoading(isPending || isUpdatePending);
  }, [isPending, isUpdatePending, setIsLoading]);

  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
      return;
    }

    if (isEditing && editingSessionParticipant) {
      setForm({
        session_id: editingSessionParticipant.session_id ?? "",
        user_id: editingSessionParticipant.user_id ?? "",
        role:
          (editingSessionParticipant.role as SessionParticipantRole) ??
          "viewer",
        can_write: editingSessionParticipant.can_write ?? false,
        join_at: editingSessionParticipant.join_at ?? new Date().toISOString(),
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [isOpen, editingSessionParticipant, isEditing]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Edit" : "Create"} Session Participant
          </DialogTitle>
          <DialogDescription className="text-[#c0c5ce]">
            {isEditing
              ? "Update the session participant information below."
              : "Fill in the information to create a new session participant."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Session</Label>
            {sessionsError ? (
              <div className="text-sm text-red-400">
                Error loading sessions. Check console for details.
              </div>
            ) : sessions && sessions.length === 0 ? (
              <div className="text-sm text-yellow-400">
                No sessions available. Make sure sessions exist in the system.
              </div>
            ) : (
              <SelectSearch
                items={
                  sessions?.map((session) => ({
                    label: `${session.public_session_id || session.id} (${
                      session.status
                    })`,
                    value: session.id,
                  })) ?? []
                }
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, session_id: value }))
                }
                value={form.session_id}
              />
            )}
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
            <Label className="text-[#c0c5ce]">Role</Label>
            <Select value={form.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-[#11111f] border-[rgba(91,194,231,0.2)] text-white">
                {ROLES.map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    className="hover:bg-[#1a1a2e] focus:bg-[#1a1a2e]"
                  >
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Can Write</Label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="can_write"
                id="can_write"
                checked={form.can_write}
                onChange={handleChange}
                className="w-4 h-4 rounded border-[rgba(91,194,231,0.2)] bg-[#11111f] text-[#5bc2e7] focus:ring-[#5bc2e7]"
              />
              <Label
                htmlFor="can_write"
                className="text-[#c0c5ce] cursor-pointer"
              >
                Allow writing commands
              </Label>
            </div>
          </div>
          {!isEditing && (
            <div className="space-y-2">
              <Label className="text-[#c0c5ce]">Join At</Label>
              <Input
                type="datetime-local"
                name="join_at"
                value={
                  form.join_at
                    ? new Date(form.join_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  const dateValue = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    join_at: dateValue
                      ? new Date(dateValue).toISOString()
                      : new Date().toISOString(),
                  }));
                }}
                className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
              />
            </div>
          )}
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
