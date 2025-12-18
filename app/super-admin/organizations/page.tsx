"use client";

import { Suspense, useEffect, useState } from "react";
import { CrudPage } from "../_components/crud-page";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteOrganization,
  getOrganizations,
  Organization,
} from "@/lib/organization";
import { useloadingStore } from "@/store/loadingStore";
import { formatDate } from "@/lib/utils";
import CreateEditOrganizationsModal from "./components/CreateEditOrganizationsModal";

export default function OrganizationsCrudPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const [deletingOrganization, setDeletingOrganization] =
    useState<Organization | null>(null);
  const queryClient = useQueryClient();
  const { isLoading, setIsLoading } = useloadingStore();

  const { data: organization } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
      setShowDeleteDialog(false);
      setDeletingOrganization(null);
    },
  });

  const handleOpenDialog = () => {
    setEditingOrganization(null);
    setIsOpen(true);
  };

  const confirmDelete = () => {
    mutate(deletingOrganization?.id ?? "");
  };

  const handleEdit = (it: Organization) => {
    setEditingOrganization(it);
    setIsOpen(true);
  };

  const handleDelete = (it: Organization) => {
    setDeletingOrganization(it);
    setShowDeleteDialog(true);
  };

  // Managment the state the loading
  useEffect(() => {
    if (isPending !== isLoading) {
      setIsLoading(isPending);
    }
  }, [isPending]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Organizations</h1>
          <p className="text-sm text-[#c0c5ce]">
            Create, update and delete organizations.
          </p>
        </div>
        <Button
          onClick={handleOpenDialog}
          className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          New
        </Button>
      </div>

      <Card className="bg-[#11111f] border-[rgba(91,194,231,0.2)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#0f0f1c] border-b border-[rgba(91,194,231,0.2)]">
              <tr className="text-left">
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">ID</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Name</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Active
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Plan</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Slug</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Max Users
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Max Agents
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Max Connections
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Fecha de creación
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Fecha de actualización
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {organization?.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-10 px-4 text-center text-[#6b7280]"
                  >
                    No results.
                  </td>
                </tr>
              ) : (
                organization?.map((it) => (
                  <tr
                    key={it.id}
                    className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]"
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      {it.id.split("-")[0]}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {it.name}
                    </td>
                    <td className="py-3 px-4">
                      {it.is_active ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.plan}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.slug}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.max_users}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it.max_agents}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it.max_connections}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {formatDate(it.created_at)}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {formatDate(it.updated_at)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(it)}
                          className="text-white hover:text-[#5bc2e7] hover:bg-[#0f0f1c]"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(it)}
                          className="text-white hover:text-white hover:bg-[#ff6b6b]"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateEditOrganizationsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingOrganizations={editingOrganization}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={"Confirm delete"}
        description={`¿Estás seguro de que deseas eliminar la organización "${deletingOrganization?.name}"? Esta acción no se puede deshacer.`}
        confirmText={"Delete"}
        cancelText={"Cancel"}
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
