"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { getRoles, Role } from "@/lib/role";
import { getOrganizations, Organization } from "@/lib/organization";
import { formatDate } from "@/lib/utils";
import { deleteUser, getUser, User } from "@/lib/user/user";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog } from "@/components/ui/alert-dialog";
import CreateEditUserModal from "./components/CreateEditUserModal";
import { useloadingStore } from "@/store/loadingStore";

export default function UsersCrudPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const { isLoading, setIsLoading } = useloadingStore();

  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUser,
  });
  const { data: roles } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
  const { data: organizations } = useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      setShowDeleteDialog(false);
      setDeletingUser(null);
    },
  });

  const handleOpenDialog = () => {
    setEditingUser(null);
    setIsOpen(true);
  };

  const confirmDelete = () => {
    mutate(deletingUser?.id ?? "");
  };

  const handleEdit = (it: User) => {
    setEditingUser(it);
    setIsOpen(true);
  };

  const handleDelete = (it: User) => {
    setDeletingUser(it);
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
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="text-sm text-[#c0c5ce]">
            Create, update and delete users.
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
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Mail</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Organization
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Role</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Date of creation
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-10 px-4 text-center text-[#6b7280]"
                  >
                    No results.
                  </td>
                </tr>
              ) : (
                users?.map((it) => (
                  <tr
                    key={it?.id ?? ""}
                    className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]"
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      {it?.id?.split("-")[0] ?? ""}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {it?.name ?? ""}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it?.email ?? ""}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {organizations?.find(
                        (organization) => organization.id === it?.organization_id
                      )?.name || "-"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {
                        roles?.find((role) => role.id === it?.role_id)
                          ?.display_name
                      }
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {formatDate(it?.created_at ?? "")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(it ?? null)}
                          className="text-white hover:text-[#5bc2e7] hover:bg-[#0f0f1c]"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(it ?? null)}
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

      <CreateEditUserModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        roles={roles ?? []}
        organizations={organizations ?? []}
        editingUser={editingUser ?? null}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={"Confirm delete"}
        description={`¿Estás seguro de que deseas eliminar el usuario "${deletingUser?.name ?? ""}"? Esta acción no se puede deshacer.`}
        confirmText={"Delete"}
        cancelText={"Cancel"}
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
