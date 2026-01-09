"use client"

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCommand,
  updateCommand,
  Command,
} from "@/lib/commands/commands";
import { getCurrentUser } from "@/lib/user/user";
import { getSession } from "@/lib/Session/session";

import {
  getCreateCommandSchema,
  CreateCommandFormData,
  getUpdateCommandSchema,
} from "@/lib/commands/commands.schema";

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
import { FormError } from "@/components/ui/form-error";
import { Switch } from "@/components/ui/switch";
import { SelectSearch } from "@/components/ui/select-search";

interface CreateEditCommandsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingCommand: Command | null;
}

const STATUS_OPTIONS = [
  { label: "Executed", value: "executed" },
  { label: "Blocked", value: "blocked" },
  { label: "Error", value: "error" },
];

const RISK_LEVEL_OPTIONS = [
  { label: "Safe", value: "safe" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

export default function CreateEditCommandsModal({
  isOpen,
  setIsOpen,
  editingCommand,
}: CreateEditCommandsModalProps) {
  const isEditing = !!editingCommand;
  const { isLoading, setIsLoading } = useloadingStore();
  const queryClient = useQueryClient();


  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<CreateCommandFormData>({
    resolver: zodResolver(isEditing ? getUpdateCommandSchema() : getCreateCommandSchema()) as any,
    mode: "onBlur",
    defaultValues: {
      session_id: "",
      command: "",
      status: "executed",
      risk_level: "safe",
      output: "",
      exit_code: null,
      was_blocked: false,
      blocked_reason: "",
    },
  });
    const { data: sessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSession
  })

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser
  })

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: CreateCommandFormData) => {
            if (!currentUser) throw new Error("User not logged in")
            return createCommand({
                ...data,
                user_id: currentUser.id,
            })
        },
        onSuccess: () => {
            setIsOpen(false)
            reset()
            queryClient.invalidateQueries({
                queryKey: ["commands"]
            })
        }
    }) 

    const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
        mutationFn: updateCommand,
        onSuccess: () => {
            setIsOpen(false)
            reset()
            queryClient.invalidateQueries({
                queryKey: ["commands"]
            })
        }
    })

    const onSubmit = (data: CreateCommandFormData) => {
        if (!isEditing) {
            mutate(data)
            return
        }
        updateMutate({
            id: editingCommand?.id ?? "",
            ...(data.session_id !== editingCommand?.session_id ? { session_id: data.session_id } : {}),
            ...(data.command !== editingCommand?.command ? { command: data.command } : {}),
            ...(data.status !== editingCommand?.status ? { status: data.status } : {}),
            ...(data.risk_level !== editingCommand?.risk_level ? { risk_level: data.risk_level || undefined } : {}),
            ...(data.output !== editingCommand?.output ? { output: data.output || undefined } : {}),
            ...(data.exit_code !== editingCommand?.exit_code ? { exit_code: data.exit_code ?? undefined } : {}),
            ...(data.was_blocked !== editingCommand?.was_blocked ? { was_blocked: data.was_blocked } : {}),
            ...(data.blocked_reason !== editingCommand?.blocked_reason ? { blocked_reason: data.blocked_reason || undefined } : {}),
        })
    }

    // Watch select values
    const sessionId = watch("session_id")
    const status = watch("status")
    const riskLevel = watch("risk_level")
    const wasBlocked = watch("was_blocked")

    // Manage loading state
    useEffect(() => {
        setIsLoading(isPending || isUpdatePending)
    }, [isPending, isUpdatePending, setIsLoading])

    // Manage form state when editing session
    // Reset form when edit mode changes
    useEffect(() => {
        if (!isOpen) return
        if (!isEditing || !editingCommand) {
            reset({
                session_id: "",
                command: "",
                status: "executed",
                risk_level: "safe",
                output: "",
                exit_code: null,
                was_blocked: false,
                blocked_reason: "",
            })
            return
        }
        reset({
            session_id: editingCommand.session_id,
            command: editingCommand.command,
            status: editingCommand.status,
            risk_level: editingCommand.risk_level ?? "safe",
            output: editingCommand.output ?? "",
            exit_code: editingCommand.exit_code ?? null,
            was_blocked: editingCommand.was_blocked,
            blocked_reason: editingCommand.blocked_reason ?? "",
        })
    }, [isOpen, isEditing, editingCommand, reset])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">{isEditing ? "Edit" : "Create"} Command</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Session</Label>
                        <SelectSearch
                            items={
                                sessions?.map((session) => ({
                                    label: `${session.public_session_id} - ${session.status}`,
                                    value: session.id,
                                })) ?? []
                            }
                            onValueChange={(value) =>
                                setValue("session_id", value, { shouldValidate: true })
                            }
                            value={sessionId}
                            error={!!errors.session_id}
                        />
                        <FormError message={errors.session_id?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Command</Label>
                        <Input
                            {...register("command")}
                            error={!!errors.command}
                            placeholder="ls -la"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                        <FormError message={errors.command?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Status</Label>
                        <SelectSearch
                            items={STATUS_OPTIONS}
                            value={status}
                            onValueChange={(value) => setValue("status", value, { shouldValidate: true })}
                            error={!!errors.status}
                        />
                        <FormError message={errors.status?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Risk Level</Label>
                        <SelectSearch
                            items={RISK_LEVEL_OPTIONS}
                            value={riskLevel || undefined}
                            onValueChange={(value) => setValue("risk_level", value, { shouldValidate: true })}
                            error={!!errors.risk_level}
                        />
                        <FormError message={errors.risk_level?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Output</Label>
                        <textarea
                            {...register("output")}
                            placeholder="Command output (optional)"
                            rows={4}
                            className="w-full bg-[#11111f] border border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white rounded-md px-3 py-2 text-sm placeholder:text-[#6b7280]"
                        />
                        <FormError message={errors.output?.message} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#c0c5ce]">Exit Code</Label>
                        <Input
                            {...register("exit_code", {
                                setValueAs: (v) => (v === "" || v === null ? null : parseInt(v)),
                            })}
                            type="number"
                            error={!!errors.exit_code}
                            placeholder="0"
                            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                        />
                        <FormError message={errors.exit_code?.message} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="was_blocked"
                            checked={wasBlocked}
                            onCheckedChange={(checked) => setValue("was_blocked", checked, { shouldValidate: true })}
                            disabled={isPending || isUpdatePending}
                        />
                        <Label htmlFor="was_blocked" className="text-[#c0c5ce]">Was Blocked</Label>
                    </div>
                    {wasBlocked && (
                        <div className="space-y-2">
                            <Label className="text-[#c0c5ce]">Blocked Reason</Label>
                            <textarea
                                {...register("blocked_reason")}
                                placeholder="Reason why the command was blocked"
                                rows={3}
                                className="w-full bg-[#11111f] border border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white rounded-md px-3 py-2 text-sm placeholder:text-[#6b7280]"
                            />
                            <FormError message={errors.blocked_reason?.message} />
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button 
                            type="button"
                            variant="ghost" 
                            onClick={() => setIsOpen(false)}
                            disabled={isPending || isUpdatePending}
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
