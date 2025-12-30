"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteAuditLogs, getAuditLogs, AuditLogs } from "@/lib/auditLogs";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog } from "@/components/ui/alert-dialog";
import CreateEditAuditLogsModal from "./components/CreateEditAuditLogsModal";
import { useloadingStore } from "@/store/loadingStore";

export default function AuditLogsCrudPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingAuditLog, setEditingAuditLog] = useState<AuditLogs | null>(
    null
  );
  const [deletingAuditLog, setDeletingAuditLog] = useState<AuditLogs | null>(
    null
  );
  const queryClient = useQueryClient();
  const { isLoading, setIsLoading } = useloadingStore();

  const { data: auditLogs } = useQuery<AuditLogs[]>({
    queryKey: ["audit-logs"],
    queryFn: getAuditLogs,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAuditLogs,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["audit-logs"],
      });
      setShowDeleteDialog(false);
      setDeletingAuditLog(null);
    },
  });

  const handleOpenDialog = () => {
    setEditingAuditLog(null);
    setIsOpen(true);
  };

  const confirmDelete = () => {
    mutate(deletingAuditLog?.id ?? "");
  };

  const handleEdit = (it: AuditLogs) => {
    setEditingAuditLog(it);
    setIsOpen(true);
  };

  const handleDelete = (it: AuditLogs) => {
    setDeletingAuditLog(it);
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
          <h1 className="text-2xl font-semibold text-white">Audit Logs</h1>
          <p className="text-sm text-[#c0c5ce]">View and manage audit logs.</p>
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
                  Event Type
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Action
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Description
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Status
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">User</th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Organization
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Timestamp
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Date of create
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {auditLogs?.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 px-4 text-center text-[#6b7280]"
                  >
                    No results.
                  </td>
                </tr>
              ) : (
                auditLogs?.map((it) => (
                  <tr
                    key={it.id}
                    className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]"
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      {it.id?.split("-")[0]}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {it.event_type}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.action}</td>
                    <td className="py-3 px-4 text-[#c0c5ce] max-w-xs truncate">
                      {it.description}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">{it.status}</td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it.user_id?.split("-")[0] || "-"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it.organization_id?.split("-")[0] || "-"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it.timestamp ? formatDate(it.timestamp) : "-"}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it.created_at ? formatDate(it.created_at) : "-"}
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

      <CreateEditAuditLogsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingAuditLog={editingAuditLog}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={"Confirm delete"}
        description={`¿Estás seguro de que deseas eliminar el audit log "${deletingAuditLog?.event_type}"? Esta acción no se puede deshacer.`}
        confirmText={"Delete"}
        cancelText={"Cancel"}
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
