"use client";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRole,
  CreateRole,
  updateRole,
  UpdateRole,
  Role,
  PermissionUser,
  PermissionSessions,
  Permissions,
} from "@/lib/role";

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

interface CreateEditRolesModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingRole: Role | null;
}

type FormData = {
  name: string;
  display_name: string;
  color: string;
  sessions: PermissionSessions[];
  users: PermissionUser[];
};

const INITIAL_FORM: FormData = {
  name: "",
  display_name: "",
  color: "#5bc2e7",
  sessions: [],
  users: [],
};

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
  const [disabled, setDisabled] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const { isLoading, setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      setForm(INITIAL_FORM);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      setForm(INITIAL_FORM);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["roles"],
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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      color: e.target.value,
    }));
  };

  const handleSessionsChange = (values: string[]) => {
    setForm((prev) => ({
      ...prev,
      sessions: values as PermissionSessions[],
    }));
  };

  const handleUsersChange = (values: string[]) => {
    setForm((prev) => ({
      ...prev,
      users: values as PermissionUser[],
    }));
  };

  const handleSave = () => {
    const permissions: Permissions = {
      sessions: form.sessions,
      users: form.users,
    };

    if (isEditing) {
      const updateData: UpdateRole = {
        id: editingRole?.id ?? "",
        name: form.name || editingRole?.name || "",
        display_name: form.display_name || editingRole?.display_name || "",
        color: form.color || editingRole?.color || "#5bc2e7",
        permissions: permissions,
      };
      updateMutate(updateData);
      return;
    }

    const createData: CreateRole = {
      name: form.name,
      display_name: form.display_name,
      color: form.color,
      permissions: permissions,
    };
    mutate(createData);
  };

  // Management the state the disabled
  useEffect(() => {
    const hasEmptyString =
      form.name.trim() === "" ||
      form.display_name.trim() === "" ||
      form.color.trim() === "";
    setDisabled(hasEmptyString);
  }, [form]);

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

    if (isEditing && editingRole) {
      setForm({
        name: editingRole.name ?? "",
        display_name: editingRole.display_name ?? "",
        color: editingRole.color ?? "#5bc2e7",
        sessions: editingRole.permissions?.sessions ?? [],
        users: editingRole.permissions?.users ?? [],
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [isOpen, editingRole, isEditing]);

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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="admin"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Display Name</Label>
            <Input
              name="display_name"
              value={form.display_name}
              onChange={handleChange}
              placeholder="Administrator"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Color</Label>
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={form.color}
                onChange={handleColorChange}
                className="h-8 w-8 rounded-mb border border-[rgba(91,194,231,0.2)] bg-[#11111f] cursor-pointer"
              />
              <Input
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="#5bc2e7"
                className="flex-1 bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Sessions Permissions</Label>
            <div className="flex flex-wrap gap-2">
              {SESSION_PERMISSIONS.map((perm) => (
                <button
                  key={perm}
                  type="button"
                  onClick={() => {
                    const newSessions = form.sessions.includes(perm)
                      ? form.sessions.filter((p) => p !== perm)
                      : [...form.sessions, perm];
                    handleSessionsChange(newSessions);
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    form.sessions.includes(perm)
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
                  onClick={() => {
                    const newUsers = form.users.includes(perm)
                      ? form.users.filter((p) => p !== perm)
                      : [...form.users, perm];
                    handleUsersChange(newUsers);
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    form.users.includes(perm)
                      ? "bg-[#5bc2e7] text-[#11111f] border border-[#5bc2e7]"
                      : "bg-[#11111f] text-[#c0c5ce] border border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7]"
                  }`}
                >
                  {perm}
                </button>
              ))}
            </div>
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
