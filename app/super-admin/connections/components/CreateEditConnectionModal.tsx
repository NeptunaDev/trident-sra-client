"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createConnection,
  updateConnection,
  CreateConnection,
  Connection,
} from "@/lib/connections";
import { Organization } from "@/lib/organization/organization";
import { getCurrentUser } from "@/lib/user/user";

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

interface CreateEditConnectionModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  organizations: Organization[];
  editingConnection: Connection | null;
}

const PROTOCOL_OPTIONS = [
  { label: "SSH", value: "ssh" },
  { label: "RDP", value: "rdp" },
  { label: "VNC", value: "vnc" },
  { label: "Telnet", value: "telnet" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const INITIAL_FORM: CreateConnection = {
  organization_id: "",
  create_by_user_id: "",
  name: "",
  protocol: "ssh",
  hostname: "",
  port: 22,
  username: "",
  password: "",
  description: "",
  status: "active",
  total_sessions: 0,
};

export default function CreateEditConnectionModal({
  isOpen,
  setIsOpen,
  organizations,
  editingConnection,
}: CreateEditConnectionModalProps) {
  const isEditing = !!editingConnection;
  const [disabled, setDisabled] = useState(false);
  const [form, setForm] = useState<CreateConnection>(INITIAL_FORM);

  const { isLoading, setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createConnection,
    onSuccess: () => {
      setIsOpen(false);
      setForm(INITIAL_FORM);
      queryClient.invalidateQueries({
        queryKey: ["connections"],
      });
    },
    onError: (error: any) => {
      console.error("Create error:", error);
      alert(
        error.response?.data?.detail ||
          error.message ||
          "Failed to create connection"
      );
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateConnection,
    onSuccess: () => {
      setIsOpen(false);
      setForm(INITIAL_FORM);
      queryClient.invalidateQueries({
        queryKey: ["connections"],
      });
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      alert(
        error.response?.data?.detail ||
          error.message ||
          "Failed to update connection"
      );
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
      updateMutate({
        id: editingConnection?.id ?? "",
        ...(form.password.trim() !== "" ? { password: form.password } : {}),
        ...(form.name !== editingConnection.name ? { name: form.name } : {}),
        ...(form.protocol !== editingConnection.protocol
          ? { protocol: form.protocol }
          : {}),
        ...(form.hostname !== editingConnection.hostname
          ? { hostname: form.hostname }
          : {}),
        ...(form.port !== editingConnection.port ? { port: form.port } : {}),
        ...(form.username !== editingConnection.username
          ? { username: form.username }
          : {}),
        ...(form.organization_id !== editingConnection.organization_id
          ? { organization_id: form.organization_id }
          : {}),
        ...(form.description !== editingConnection.description
          ? { description: form.description }
          : {}),
        ...(form.status !== editingConnection.status
          ? { status: form.status }
          : {}),
      });
      return;
    }
    mutate(form);
  };

  // Management the state the disabled
  useEffect(() => {
    Object.values(form).forEach((value) => {
      if (value.toString().trim() === "") {
        setDisabled(true);
        return;
      }
    });
    setDisabled(false);
  }, [form]);

  // Management the state the loading
  useEffect(() => {
    if (isPending !== isLoading || isUpdatePending !== isLoading) {
      setIsLoading(isPending || isUpdatePending);
    }
  }, [isPending, isUpdatePending]);

  // Management the state the editing connection
  useEffect(() => {
    if (!isEditing) {
      setForm(INITIAL_FORM);
      // fill create_by_user_id when creating new connection
      getCurrentUser()
        .then((user) => {
          setForm((prev) => ({ ...prev, create_by_user_id: user.id }));
        })
        .catch(console.error);
      return;
    }
    setForm({
      organization_id: editingConnection?.organization_id ?? "",
      create_by_user_id: editingConnection?.create_by_user_id ?? "",
      name: editingConnection?.name ?? "",
      protocol: editingConnection?.protocol ?? "ssh",
      hostname: editingConnection?.hostname ?? "",
      port: editingConnection?.port ?? 22,
      username: editingConnection?.username ?? "",
      password: "",
      description: editingConnection?.description ?? "",
      status: editingConnection?.status ?? "active",
      total_sessions: editingConnection?.total_sessions ?? 0,
    });
  }, [editingConnection, isEditing]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Edit" : "Create"} Connection
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="My Server Connection"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Protocol</Label>
            <SelectSearch
              items={PROTOCOL_OPTIONS}
              value={form.protocol}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, protocol: value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Hostname</Label>
            <Input
              name="hostname"
              value={form.hostname}
              onChange={handleChange}
              placeholder="192.168.1.100 or server.example.com"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Port</Label>
            <Input
              name="port"
              type="text"
              value={form.port.toString()}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setForm((prev) => ({
                  ...prev,
                  port: value ? parseInt(value) : 0,
                }));
              }}
              placeholder="22"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Username</Label>
            <Input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="admin user"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Password</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
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
                setForm((prev) => ({ ...prev, organization_id: value }))
              }
              value={form.organization_id}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Status</Label>
            <SelectSearch
              items={STATUS_OPTIONS}
              value={form.status}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, status: value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Description (optional)</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
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
