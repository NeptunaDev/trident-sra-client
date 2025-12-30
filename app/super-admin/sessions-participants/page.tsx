"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  deleteSessionParticipant,
  getSessionParticipants,
  SessionParticipant,
} from "@/lib/sessionParticipants";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog } from "@/components/ui/alert-dialog";
import CreateEditSessionParticipantsModal from "./components/CreateEditSessionParticipantsModal";
import { useloadingStore } from "@/store/loadingStore";
import { Badge } from "@/components/ui/badge";

export default function SessionsParticipantsCrudPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingSessionParticipant, setEditingSessionParticipant] =
    useState<SessionParticipant | null>(null);
  const [deletingSessionParticipant, setDeletingSessionParticipant] =
    useState<SessionParticipant | null>(null);
  const queryClient = useQueryClient();
  const { isLoading, setIsLoading } = useloadingStore();

  const { data: sessionParticipants } = useQuery<SessionParticipant[]>({
    queryKey: ["session-participants"],
    queryFn: getSessionParticipants,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteSessionParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["session-participants"],
      });
      setShowDeleteDialog(false);
      setDeletingSessionParticipant(null);
    },
  });

  const handleOpenDialog = () => {
    setEditingSessionParticipant(null);
    setIsOpen(true);
  };

  const confirmDelete = () => {
    mutate(deletingSessionParticipant?.id ?? "");
  };

  const handleEdit = (it: SessionParticipant) => {
    setEditingSessionParticipant(it);
    setIsOpen(true);
  };

  const handleDelete = (it: SessionParticipant) => {
    setDeletingSessionParticipant(it);
    setShowDeleteDialog(true);
  };

  // Management the state the loading
  useEffect(() => {
    if (isPending !== isLoading) {
      setIsLoading(isPending);
    }
  }, [isPending]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Sessions Participants
          </h1>
          <p className="text-sm text-[#c0c5ce]">
            View and manage session participants.
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
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Can Write
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Is Active
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Date of Join
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">Role</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Session ID
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  User ID
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sessionParticipants?.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 px-4 text-center text-[#6b7280]"
                  >
                    No results.
                  </td>
                </tr>
              ) : (
                sessionParticipants?.map((it) => (
                  <tr
                    key={it.id}
                    className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]"
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      {it.id?.split("-")[0]}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={`text-xs border-[rgba(91,194,231,0.3)] ${
                          it.can_write ? "text-[#00ff88]" : "text-[#6b7280]"
                        }`}
                      >
                        {it.can_write ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={`text-xs border-[rgba(91,194,231,0.3)] ${
                          it.is_active ? "text-[#00ff88]" : "text-[#6b7280]"
                        }`}
                      >
                        {it.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it.join_at ? formatDate(it.join_at) : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={`text-xs border-[rgba(91,194,231,0.3)] ${
                          it.role === "owner"
                            ? "text-[#5bc2e7]"
                            : it.role === "collaborator"
                            ? "text-[#9b59b6]"
                            : "text-[#95a5a6]"
                        }`}
                      >
                        {it.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {it.session_id?.split("-")[0] || "-"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it.user_id?.split("-")[0] || "-"}
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

      <CreateEditSessionParticipantsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingSessionParticipant={editingSessionParticipant}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={"Confirm delete"}
        description={`¿Estás seguro de que deseas eliminar este participant? Esta acción no se puede deshacer.`}
        confirmText={"Delete"}
        cancelText={"Cancel"}
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
