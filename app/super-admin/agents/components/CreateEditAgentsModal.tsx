"use client";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAgent,
  CreateAgent,
  updateAgent,
  UpdateAgent,
  Agent,
} from "@/lib/agents/agents";
import { Organization } from "@/lib/organization/organization";
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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/ui/form-error";
import {
  CreateAgentFormData,
  getCreateAgentSchema,
  getUpdateAgentSchema,
  UpdateAgentFormData,
} from "@/lib/agents/agents.schema";

interface CreateEditAgentsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  organizations: Organization[];
  editingAgent: Agent | null;
}

export default function CreateEditAgentsModal({
  isOpen,
  setIsOpen,
  organizations,
  editingAgent,
}: CreateEditAgentsModalProps) {
  const isEditing = !!editingAgent;
  const { isLoading, setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    control,
  } = useForm<CreateAgentFormData | UpdateAgentFormData>({
    resolver: zodResolver(
      isEditing ? getUpdateAgentSchema() : getCreateAgentSchema()
    ),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      agent_name: "",
      hostname: "",
      os_type: undefined,
      os_version: null,
      tunnel_type: undefined,
      public_ws_url: null,
      local_ws_port: null,
      tunnel_config: null,
      guacd_host: null,
      guacd_port: null,
      docker_api_url: null,
      version: null,
      max_concurrent_sessions: null,
      agent_token: "",
      organization_id: null,
      ...(isEditing ? { status: undefined } : {}),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: updateAgent,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["agents"],
      });
    },
  });

  const onSubmit = (data: CreateAgentFormData | UpdateAgentFormData) => {
    const toPositiveOrNull = (val: number | null | undefined) =>
      typeof val === "number" && val > 0 ? val : null;

    if (!isEditing) {
      const createData: CreateAgent = {
        agent_name: (data as CreateAgentFormData).agent_name,
        hostname: (data as CreateAgentFormData).hostname,
        os_type: (data as CreateAgentFormData).os_type,
        os_version: (data as CreateAgentFormData).os_version ?? null,
        tunnel_type: (data as CreateAgentFormData).tunnel_type,
        public_ws_url: (data as CreateAgentFormData).public_ws_url ?? null,
        local_ws_port: toPositiveOrNull(
          (data as CreateAgentFormData).local_ws_port
        ),
        tunnel_config: (data as CreateAgentFormData).tunnel_config ?? null,
        guacd_host: (data as CreateAgentFormData).guacd_host ?? null,
        guacd_port: toPositiveOrNull((data as CreateAgentFormData).guacd_port),
        docker_api_url: (data as CreateAgentFormData).docker_api_url ?? null,
        version: (data as CreateAgentFormData).version ?? null,
        max_concurrent_sessions: toPositiveOrNull(
          (data as CreateAgentFormData).max_concurrent_sessions
        ),
        agent_token: (data as CreateAgentFormData).agent_token,
        organization_id: (data as CreateAgentFormData).organization_id ?? null,
      };
      mutate(createData);
      return;
    }

    // For update, only send changed fields
    const updateData: UpdateAgent = {
      id: editingAgent?.id ?? "",
      ...(data.agent_name !== editingAgent?.agent_name
        ? { agent_name: data.agent_name }
        : {}),
      ...(data.hostname !== editingAgent?.hostname
        ? { hostname: data.hostname }
        : {}),
      ...(data.os_type !== editingAgent?.os_type
        ? { os_type: data.os_type }
        : {}),
      ...(data.os_version !== editingAgent?.os_version
        ? { os_version: data.os_version ?? null }
        : {}),
      ...(data.tunnel_type !== editingAgent?.tunnel_type
        ? { tunnel_type: data.tunnel_type }
        : {}),
      ...("status" in data &&
      data.status !== undefined &&
      data.status !== editingAgent?.status
        ? { status: data.status }
        : {}),
      ...(data.public_ws_url !== editingAgent?.public_ws_url
        ? { public_ws_url: data.public_ws_url ?? null }
        : {}),
      ...(data.local_ws_port !== editingAgent?.local_ws_port
        ? { local_ws_port: toPositiveOrNull(data.local_ws_port) ?? undefined }
        : {}),
      ...(data.guacd_host !== editingAgent?.guacd_host
        ? { guacd_host: data.guacd_host ?? null }
        : {}),
      ...(data.guacd_port !== editingAgent?.guacd_port
        ? { guacd_port: toPositiveOrNull(data.guacd_port) ?? undefined }
        : {}),
      ...(data.docker_api_url !== editingAgent?.docker_api_url
        ? { docker_api_url: data.docker_api_url ?? null }
        : {}),
      ...(data.version !== editingAgent?.version
        ? { version: data.version ?? null }
        : {}),
      ...(data.max_concurrent_sessions !== editingAgent?.max_concurrent_sessions
        ? {
            max_concurrent_sessions:
              toPositiveOrNull(data.max_concurrent_sessions) ?? undefined,
          }
        : {}),
      ...(data.agent_token &&
      data.agent_token.trim() !== "" &&
      data.agent_token !== editingAgent?.agent_token
        ? { agent_token: data.agent_token }
        : {}),
      ...(data.organization_id !== editingAgent?.organization_id
        ? { organization_id: data.organization_id ?? null }
        : {}),
    };
    updateMutate(updateData);
  };

  // Register numeric fields
  const localWsPortRegister = register("local_ws_port");
  const guacdPortRegister = register("guacd_port");
  const maxConcurrentSessionsRegister = register("max_concurrent_sessions");

  // Watch select values
  const osType = watch("os_type");
  const tunnelType = watch("tunnel_type");
  const organizationId = watch("organization_id");
  const status = watch("status");

  // Manage loading state
  useEffect(() => {
    setIsLoading(isPending || isUpdatePending);
  }, [isPending, isUpdatePending, setIsLoading]);

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (!isOpen) {
      reset();
      return;
    }

    if (isEditing && editingAgent) {
      reset({
        agent_name: editingAgent.agent_name ?? "",
        hostname: editingAgent.hostname ?? "",
        os_type: editingAgent.os_type,
        os_version: editingAgent.os_version ?? null,
        tunnel_type: editingAgent.tunnel_type,
        status: editingAgent.status,
        public_ws_url: editingAgent.public_ws_url ?? null,
        local_ws_port: editingAgent.local_ws_port ?? null,
        tunnel_config: editingAgent.tunnel_config ?? null,
        guacd_host: editingAgent.guacd_host ?? null,
        guacd_port: editingAgent.guacd_port ?? null,
        docker_api_url: editingAgent.docker_api_url ?? null,
        version: editingAgent.version ?? null,
        max_concurrent_sessions: editingAgent.max_concurrent_sessions ?? null,
        agent_token: "",
        organization_id: editingAgent.organization_id ?? null,
      });
    } else {
      reset({
        agent_name: "",
        hostname: "",
        os_type: undefined,
        os_version: null,
        tunnel_type: undefined,
        public_ws_url: null,
        local_ws_port: null,
        tunnel_config: null,
        guacd_host: null,
        guacd_port: null,
        docker_api_url: null,
        version: null,
        max_concurrent_sessions: null,
        agent_token: "",
        organization_id: null,
      });
    }
  }, [isOpen, editingAgent, isEditing, reset]);

  const osTypeOptions = [
    { value: "windows", label: "Windows" },
    { value: "linux", label: "Linux" },
    { value: "freebsd", label: "FreeBSD" },
    { value: "macos", label: "macOS" },
  ];

  const tunnelTypeOptions = [
    { value: "cloudflare", label: "Cloudflare" },
    { value: "ssh_reverse", label: "SSH Reverse" },
    { value: "vpn", label: "VPN" },
    { value: "ngrok", label: "Ngrok" },
    { value: "direct", label: "Direct" },
  ];

  const statusOptions = [
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
    { value: "maintenance", label: "Maintenance" },
    { value: "error", label: "Error" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEditing ? "Edit" : "Create"} Agent
          </DialogTitle>
          <DialogDescription className="text-[#c0c5ce]">
            {isEditing
              ? "Update the agent information below."
              : "Fill in the information to create a new agent."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Agent Name *</Label>
            <Input
              {...register("agent_name")}
              error={!!errors.agent_name}
              placeholder="Production Server 1"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.agent_name?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Hostname *</Label>
            <Input
              {...register("hostname")}
              error={!!errors.hostname}
              placeholder="prod-server-01.example.com"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.hostname?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">OS Type *</Label>
            <Controller
              name="os_type"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  items={osTypeOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={!!errors.os_type}
                  placeholder="Select OS type"
                />
              )}
            />
            <FormError message={errors.os_type?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">OS Version</Label>
            <Input
              {...register("os_version")}
              error={!!errors.os_version}
              placeholder="Ubuntu 22.04 LTS"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.os_version?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Tunnel Type *</Label>
            <Controller
              name="tunnel_type"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  items={tunnelTypeOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={!!errors.tunnel_type}
                  placeholder="Select tunnel type"
                />
              )}
            />
            <FormError message={errors.tunnel_type?.message} />
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label className="text-[#c0c5ce]">Status</Label>
              <Controller<UpdateAgentFormData>
                name="status"
                control={control as any}
                render={({ field }) => (
                  <SelectSearch
                    items={statusOptions}
                    value={field.value ?? ""}
                    onValueChange={(value) =>
                      field.onChange(value || undefined)
                    }
                    error={!!(errors as any).status}
                    placeholder="Select status"
                  />
                )}
              />
              <FormError message={(errors as any).status?.message} />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Public WS URL</Label>
            <Input
              {...register("public_ws_url")}
              error={!!errors.public_ws_url}
              placeholder="wss://example.com/ws"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.public_ws_url?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Local WS Port</Label>
            <Input
              type="number"
              {...localWsPortRegister}
              error={!!errors.local_ws_port}
              placeholder="8080"
              min="1"
              max="65535"
              step="1"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:opacity-0 [&::-webkit-outer-spin-button]:opacity-0 [-moz-appearance:textfield]"
            />
            <FormError message={errors.local_ws_port?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Guacd Host</Label>
            <Input
              {...register("guacd_host")}
              error={!!errors.guacd_host}
              placeholder="localhost"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.guacd_host?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Guacd Port</Label>
            <Input
              type="number"
              {...guacdPortRegister}
              error={!!errors.guacd_port}
              placeholder="4822"
              min="1"
              max="65535"
              step="1"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:opacity-0 [&::-webkit-outer-spin-button]:opacity-0 [-moz-appearance:textfield]"
            />
            <FormError message={errors.guacd_port?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Docker API URL</Label>
            <Input
              {...register("docker_api_url")}
              error={!!errors.docker_api_url}
              placeholder="unix:///var/run/docker.sock"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.docker_api_url?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Version</Label>
            <Input
              {...register("version")}
              error={!!errors.version}
              placeholder="1.0.0"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.version?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Max Concurrent Sessions</Label>
            <Input
              type="number"
              {...maxConcurrentSessionsRegister}
              error={!!errors.max_concurrent_sessions}
              placeholder="10"
              min="1"
              step="1"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:opacity-0 [&::-webkit-outer-spin-button]:opacity-0 [-moz-appearance:textfield]"
            />
            <FormError message={errors.max_concurrent_sessions?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">
              Agent Token {!isEditing ? "*" : ""}
            </Label>
            <Input
              {...register("agent_token")}
              error={!!errors.agent_token}
              placeholder={
                isEditing
                  ? "Leave empty to keep current token"
                  : "Enter token (min 32 characters)"
              }
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
            />
            <FormError message={errors.agent_token?.message} />
          </div>

          <div className="space-y-2">
            <Label className="text-[#c0c5ce]">Organization</Label>
            <Controller
              name="organization_id"
              control={control}
              render={({ field }) => (
                <SelectSearch
                  items={
                    organizations?.map((org) => ({
                      label: org.name,
                      value: org.id,
                    })) ?? []
                  }
                  value={field.value ?? ""}
                  onValueChange={(value) =>
                    field.onChange(value === "" ? null : value)
                  }
                  error={!!errors.organization_id}
                  placeholder="Select organization"
                  emptyText="No organizations available"
                />
              )}
            />
            <FormError message={errors.organization_id?.message} />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-[#11111f]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isUpdatePending || !isValid}
              className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold disabled:opacity-50"
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
