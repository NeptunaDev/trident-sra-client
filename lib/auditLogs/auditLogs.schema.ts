import { z } from "zod";
import { t } from "@/lib/i18n";
import { AuditLogStatus } from "./auditLogs";

// Helper function to get validation messages
const getValidationMessages = () => ({
  eventTypeRequired: t("validation_event_type_required"),
  eventTypeMin: t("validation_event_type_min"),
  eventTypeMax: t("validation_event_type_max"),
  actionRequired: t("validation_action_required"),
  actionMin: t("validation_action_min"),
  actionMax: t("validation_action_max"),
  statusRequired: t("validation_status_required"),
  statusMin: t("validation_status_min"),
  statusMax: t("validation_status_max"),
});

// Schema factory function for creating audit log
export const getCreateAuditLogSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    event_type: z
      .string()
      .min(10, messages.eventTypeMin)
      .max(100, messages.eventTypeMax),

    action: z.string().min(5, messages.actionMin).max(255, messages.actionMax),

    description: z
      .union([z.string(), z.null()])
      .transform((val) => (val === "" ? null : val))
      .optional(),

    status: z
      .nativeEnum(AuditLogStatus, {
        required_error: messages.statusRequired,
        invalid_type_error: messages.statusRequired,
      })
      .nullable()
      .optional(),

    details: z.record(z.any()).nullable().optional(),

    organization_id: z
      .union([z.string(), z.null()])
      .transform((val) => (val === "" ? null : val))
      .optional(),

    user_id: z
      .union([z.string(), z.null()])
      .transform((val) => (val === "" ? null : val))
      .optional(),
  });
};

// Schema factory function for updating audit log
export const getUpdateAuditLogSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    event_type: z
      .string()
      .min(10, messages.eventTypeMin)
      .max(100, messages.eventTypeMax)
      .optional(),

    action: z
      .string()
      .min(5, messages.actionMin)
      .max(255, messages.actionMax)
      .optional(),

    description: z
      .union([z.string(), z.null()])
      .transform((val) => (val === "" ? null : val))
      .optional(),

    status: z
      .nativeEnum(AuditLogStatus, {
        required_error: messages.statusRequired,
        invalid_type_error: messages.statusRequired,
      })
      .nullable()
      .optional(),

    details: z.record(z.any()).nullable().optional(),

    organization_id: z
      .union([z.string(), z.null()])
      .transform((val) => (val === "" ? null : val))
      .optional(),

    user_id: z
      .union([z.string(), z.null()])
      .transform((val) => (val === "" ? null : val))
      .optional(),
  });
};

// Export schemas for backward compatibility (they'll use current language)
export const createAuditLogSchema = getCreateAuditLogSchema();
export const updateAuditLogSchema = getUpdateAuditLogSchema();

// Infer types from schemas
export type CreateAuditLogFormData = z.infer<
  ReturnType<typeof getCreateAuditLogSchema>
>;
export type UpdateAuditLogFormData = z.infer<
  ReturnType<typeof getUpdateAuditLogSchema>
>;
