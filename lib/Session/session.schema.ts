import { z } from "zod";
import { t } from "@/lib/i18n";
import { SessionStatus } from "./session";

// Helper function to get validation messages
const getValidationMessages = () => ({
  publicSessionIdRequired: t("validation_public_session_id_required"),
  publicSessionIdMax: t("validation_public_session_id_max"),
  statusRequired: t("validation_status_required"),
  statusMax: t("validation_status_max"),
  connectionIdRequired: t("validation_connection_id_required"),
  commandsMin: t("validation_commands_min"),
  totalCommandsMax: t("validation_total_commands_max"),
  blockedCommandsMax: t("validation_blocked_commands_max"),
  durationInvalid: t("validation_duration_invalid"),
  durationMax: t("validation_duration_max"),
});

// Schema factory function for creating session
export const getCreateSessionSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    public_session_id: z
      .string()
      .min(1, messages.publicSessionIdRequired)
      .max(100, messages.publicSessionIdMax),

    status: z
      .nativeEnum(SessionStatus, {
        required_error: messages.statusRequired,
        invalid_type_error: messages.statusRequired,
      })
      .optional(),

    recording_enabled: z.boolean().optional(),

    connection_id: z.string().min(1, messages.connectionIdRequired),

    total_commands: z
      .number({ invalid_type_error: messages.commandsMin })
      .min(0, messages.commandsMin)
      .max(2147483647, messages.totalCommandsMax)
      .optional(),

    blocked_commands: z
      .number({ invalid_type_error: messages.commandsMin })
      .min(0, messages.commandsMin)
      .max(2147483647, messages.blockedCommandsMax)
      .optional(),

    duration_seconds: z
      .number({ invalid_type_error: messages.durationInvalid })
      .max(2147483647, messages.durationMax)
      .min(0, messages.commandsMin)
      .optional(),

    recording_url: z.string().optional(),
  });
};

// Schema factory function for updating session
export const getUpdateSessionSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    status: z
      .nativeEnum(SessionStatus, {
        required_error: messages.statusRequired,
        invalid_type_error: messages.statusRequired,
      })
      .optional(),

    ended_at: z.string().optional(),

    duration_seconds: z
      .number({ invalid_type_error: messages.durationInvalid })
      .max(2147483647, messages.durationMax)
      .min(0, messages.commandsMin)
      .optional()
      .nullable(),

    recording_enabled: z.boolean().optional(),

    recording_url: z.string().optional(),

    total_commands: z
      .number({ invalid_type_error: messages.commandsMin })
      .min(0, messages.commandsMin)
      .max(2147483647, messages.totalCommandsMax)
      .optional()
      .nullable(),

    blocked_commands: z
      .number({ invalid_type_error: messages.commandsMin })
      .min(0, messages.commandsMin)
      .max(2147483647, messages.blockedCommandsMax)
      .optional()
      .nullable(),
  });
};

// Export schemas for backward compatibility (they'll use current language)
export const createSessionSchema = getCreateSessionSchema();
export const updateSessionSchema = getUpdateSessionSchema();

// Infer types from schemas
export type CreateSessionFormData = z.infer<
  ReturnType<typeof getCreateSessionSchema>
>;
export type UpdateSessionFormData = z.infer<
  ReturnType<typeof getUpdateSessionSchema>
>;
