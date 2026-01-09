"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  getOrganizations,
  Organization,
} from "@/lib/organization/organization";
import { formatDate } from "@/lib/utils";
import { deleteAgent, getAgents, type Agent } from "@/lib/agents/agents";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertDialog } from "@/components/ui/alert-dialog";
import CreateEditAgentsModal from "./components/CreateEditAgentsModal";
import { useloadingStore } from "@/store/loadingStore";

export default function AgentsCrudPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [deletingAgent, setDeletingAgent] = useState<Agent | null>(null);
  const queryClient = useQueryClient();
  const { isLoading, setIsLoading } = useloadingStore();

  const { data: agents } = useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: getAgents,
  });
  const { data: organizations } = useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
      setShowDeleteDialog(false);
      setDeletingAgent(null);
    },
  });

  const handleOpenDialog = () => {
    setEditingAgent(null);
    setIsOpen(true);
  };

  const confirmDelete = () => {
    mutate(deletingAgent?.id ?? "");
  };

  const handleEdit = (it: Agent) => {
    setEditingAgent(it);
    setIsOpen(true);
  };

  const handleDelete = (it: Agent) => {
    setDeletingAgent(it);
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
          <h1 className="text-2xl font-semibold text-white">Agents</h1>
          <p className="text-sm text-[#c0c5ce]">
            Create, update and delete agents.
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
                  Agent Name
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Hostname
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  OS Type
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Tunnel Type
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Status
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Organization
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold">
                  Date of creation
                </th>
                <th className="py-3 px-4 text-[#c0c5ce] font-semibold w-[160px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {agents?.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-10 px-4 text-center text-[#6b7280]"
                  >
                    No results.
                  </td>
                </tr>
              ) : (
                agents?.map((it) => (
                  <tr
                    key={it?.id ?? ""}
                    className="border-b border-[rgba(91,194,231,0.08)] hover:bg-[#1a1a2e]"
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      {it?.id?.split("-")[0] ?? ""}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {it?.agent_name ?? ""}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it?.hostname ?? ""}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it?.os_type ?? ""}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {it?.tunnel_type ?? ""}
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          it?.status === "Online"
                            ? "bg-green-500/20 text-green-400"
                            : it?.status === "Offline"
                            ? "bg-gray-500/20 text-gray-400"
                            : it?.status === "Maintenance"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {it?.status ?? ""}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#c0c5ce]">
                      {organizations?.find(
                        (organization) =>
                          organization.id === it?.organization_id
                      )?.name || "-"}
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

      <CreateEditAgentsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        organizations={organizations ?? []}
        editingAgent={editingAgent ?? null}
      />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={"Confirm delete"}
        description={`¿Estás seguro de que deseas eliminar el agente "${
          deletingAgent?.agent_name ?? ""
        }"? Esta acción no se puede deshacer.`}
        confirmText={"Delete"}
        cancelText={"Cancel"}
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
