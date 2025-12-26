"use  client";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CreateOrganization,
  getOrganizations,
  Organization,
  updateOrganization,
} from "@/lib/organization";
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

interface CreateEditOrganizationsModal {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingOrganizations: Organization | null;
}

type FormData = {
  name: string;
  slug: string;
  plan: string;
  max_users: string;
  max_connections: string;
  max_agents: string;
};

const INITIAL_FORM: FormData = {
  name: "",
  slug: "",
  plan: "",
  max_users: "",
  max_connections: "",
  max_agents: "",
};

export default function CreateEditOrganizationsModal({
  isOpen,
  setIsOpen,
  editingOrganizations,
}: CreateEditOrganizationsModal) {
  const isEditng = !!editingOrganizations;
  const [disabled, setDisabled] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const { isLoading, setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: CreateOrganization,
    onSuccess: () => {
      setForm(INITIAL_FORM);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
  });
  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateOrganization,
    onSuccess: () => {
      setForm(INITIAL_FORM);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (
      name === "max_users" ||
      name === "max_agents" ||
      name === "max_connections"
    ) {
      // Permitir valores vacíos
      if (value === "" || value === "-") {
        setForm((prev) => ({
          ...prev,
          [name]: "",
        }));
        return;
      }

      // Prevenir números negativos
      if (value.includes("-")) {
        return;
      }

      // Solo permitir números enteros
      if (/^\d+$/.test(value)) {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Validacion del formulario
    if (isEditng) {
      const updateData: updateOrganization = {
        id: editingOrganizations?.id ?? "",
        name: form.name || editingOrganizations?.name || "",
        slug: form.slug || editingOrganizations?.slug || "",
        plan: form.plan || editingOrganizations?.plan || "",
        max_users:
          form.max_users !== ""
            ? Number(form.max_users)
            : editingOrganizations?.max_users ?? 0,
        max_agents:
          form.max_agents !== ""
            ? Number(form.max_agents)
            : editingOrganizations?.max_agents ?? 0,
        max_connections:
          form.max_connections !== ""
            ? Number(form.max_connections)
            : editingOrganizations?.max_connections ?? 0,
        is_active: editingOrganizations?.is_active ?? true,
      };
      updateMutate(updateData);
      return;
    }

    // Convertir el form a CreateOrganization
    const createData: CreateOrganization = {
      name: form.name,
      slug: form.slug,
      plan: form.plan,
      max_users: form.max_users === "" ? 0 : Number(form.max_users),
      max_agents: form.max_agents === "" ? 0 : Number(form.max_agents),
      max_connections:
        form.max_connections === "" ? 0 : Number(form.max_connections),
    };
    mutate(createData);
  };

  // Managment the state the disabled
  useEffect(() => {
    const hasEmptyString = Object.entries(form).some(([key, value]) => {
      if (typeof value === "string") {
        return value.trim() === "";
      }
      return false;
    });
    setDisabled(hasEmptyString);
  }, [form]);

  // Managment the state the loading
  useEffect(() => {
    if (isPending !== isLoading || isUpdatePending !== isLoading) {
      setIsLoading(isPending || isUpdatePending);
    }
  }, [isPending, isUpdatePending, isLoading, setIsLoading]);

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
      return;
    }

    if (isEditng && editingOrganizations) {
      setForm({
        name: editingOrganizations.name ?? "",
        slug: editingOrganizations.slug ?? "",
        plan: editingOrganizations.plan ?? "",
        max_users:
          editingOrganizations.max_users !== undefined
            ? String(editingOrganizations.max_users)
            : "",
        max_agents:
          editingOrganizations.max_agents !== undefined
            ? String(editingOrganizations.max_agents)
            : "",
        max_connections:
          editingOrganizations.max_connections !== undefined
            ? String(editingOrganizations.max_connections)
            : "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [isOpen, editingOrganizations, isEditng]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditng ? "Edit" : "Create"} Organization
          </DialogTitle>
          <DialogDescription className="text-[#c0c5ce]">
            {isEditng
              ? "Update the organization information below."
              : "Fill in the information to create a new organization."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Trident Demo"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Slug</Label>
            <Input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="trident-demo"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Plan</Label>
            <Input
              name="plan"
              value={form.plan}
              onChange={handleChange}
              placeholder="enterprise"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Max Users</Label>
            <Input
              type="number"
              name="max_users"
              value={form.max_users}
              onChange={handleChange}
              placeholder="100"
              min="0"
              step="1"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:opacity-0 [&::-webkit-outer-spin-button]:opacity-0 [-moz-appearance:textfield]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Max Agents</Label>
            <Input
              type="number"
              name="max_agents"
              value={form.max_agents}
              onChange={handleChange}
              placeholder="50"
              min="0"
              step="1"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:opacity-0 [&::-webkit-outer-spin-button]:opacity-0 [-moz-appearance:textfield]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Max Connections</Label>
            <Input
              type="number"
              name="max_connections"
              value={form.max_connections}
              onChange={handleChange}
              placeholder="500"
              min="0"
              step="1"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:opacity-0 [&::-webkit-outer-spin-button]:opacity-0 [-moz-appearance:textfield]"
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
            {isEditng ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
