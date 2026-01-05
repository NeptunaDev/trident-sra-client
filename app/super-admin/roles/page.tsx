"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteRole, getRoles, Role } from "@/lib/role/role";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import CreateEditRolesModal from "./components/CreateEditRolesModal";
import { useloadingStore } from "@/store/loadingStore";

export default function RolesCrudPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const queryClient = useQueryClient();
  const { isLoading, setIsLoading } = useloadingStore();

  const { data: roles } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
      setShowDeleteDialog(false);
      setDeletingRole(null);
    },
  });

  const handleOpenDialog = () => {
    setEditingRole(null);
    setIsOpen(true);
  };

  const confirmDelete = () => {
    mutate(deletingRole?.id ?? "");
  };

  const handleEdit = (it: Role) => {
    setEditingRole(it);
    setIsOpen(true);
  };

  const handleDelete = (it: Role) => {
    setDeletingRole(it);
    setShowDeleteDialog(true);
  };

  // Management the state the loading
  useEffect(() => {
    if (isPending !== isLoading) {
      setIsLoading(isPending);
    }
  }, [isPending, isLoading, setIsLoading]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Roles</h1>
          <p className="text-sm text-[#c0c5ce]">
            Create, update and delete roles.
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
                  Permissions
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Color
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  System
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Date of Creation
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Date of Update
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles?.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 px-4 text-center text-[#6b7280]"
                  >
                    No results.
                  </td>
                </tr>
              ) : (
                roles?.map((it) => (
                  <tr
                    key={it.id}
                    className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]"
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      {it.id.split("-")[0]}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {it.display_name}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-2">
                        {it.permissions?.sessions?.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-medium text-[#c0c5ce]">
                              Sessions:
                            </span>
                            {it.permissions?.sessions?.map((perm, idx) => (
                              <Badge
                                key={`sessions-${idx}`}
                                variant="outline"
                                className="text-xs border-[rgba(91,194,231,0.3)] text-[#5bc2e7]"
                              >
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {it.permissions?.users?.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-medium text-[#c0c5ce]">
                              Users:
                            </span>
                            {it.permissions?.users?.map((perm, idx) => (
                              <Badge
                                key={`users-${idx}`}
                                variant="outline"
                                className="text-xs border-[rgba(91,194,231,0.3)] text-[#5bc2e7]"
                              >
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {it.permissions?.sessions?.length === 0 &&
                          it.permissions?.users?.length === 0 && (
                            <span className="text-xs text-[#6b7280]">
                              No permissions
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-[rgba(91,194,231,0.3)]"
                          style={{ backgroundColor: it.color || "#ffffff" }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white  font-medium">
                      {it.is_system ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it.created_at ? formatDate(it.created_at) : "-"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it.updated_at ? formatDate(it.updated_at) : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(it)}
                          disabled={it.is_system}
                          className="text-white hover:text-[#5bc2e7] hover:bg-[#0f0f1c]"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(it)}
                          disabled={it.is_system}
                          className="text-white hover:text-white hover:bg-[#ff6b6b] disabled:opacity-50 disabled:cursor-not-allowed"
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

      <CreateEditRolesModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingRole={editingRole}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={"Confirm delete"}
        description={`¿Estás seguro de que deseas eliminar el rol "${deletingRole?.display_name}"? Esta acción no se puede deshacer.`}
        confirmText={"Delete"}
        cancelText={"Cancel"}
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
