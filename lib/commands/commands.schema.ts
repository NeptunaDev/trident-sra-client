import { z } from 'zod';
import { t } from '@/lib/i18n';

// Helper function to get validation messages
const getValidationMessages = () => ({ 
SessionIdRequired: t("validation_session_id_required"),
commandRequired: t("validation_command_min"),
commandMax: t("validation_command_max"),
statusRequired: t("validation_status_required"),
statusMax: t("validation_status_max"),
riskLevelRequired: "Risk level is required",
outputMax: t("validation_output_max"),
}); 

export const getCreateCommandSchema = () => {
    const messages = getValidationMessages();
    return z.object({
        session_id: z
            .string()
            .min(1, messages.SessionIdRequired),
        command: z
            .string()
            .min(1, messages.commandRequired)
            .max(2000, messages.commandMax),
        status: z
            .string()
            .min(1, messages.statusRequired)
            .max(50, messages.statusMax),
        risk_level: z
            .string()
            .optional()
            .nullable(),
        output: z
            .string()
            .max(10000, messages.outputMax)
            .optional()
            .nullable(),
        exit_code: z
            .number()
            .optional()
            .nullable(),
        was_blocked: z
            .boolean(),
        blocked_reason: z
            .string()
            .optional()
            .nullable(),
    });
};

export const getUpdateCommandSchema = () => {
    const messages = getValidationMessages();
    return z.object({
        session_id: z
            .string()
            .min(1, messages.SessionIdRequired)
            .optional(),
        command: z
            .string()
            .min(1, messages.commandRequired)
            .max(2000, messages.commandMax)
            .optional(),
        status: z
            .string()
            .min(1, messages.statusRequired)
            .max(50, messages.statusMax)
            .optional(),
        risk_level: z
            .string()
            .optional()
            .nullable(),
        output: z
            .string()
            .max(10000, messages.outputMax)
            .optional()
            .nullable(),
        exit_code: z
            .number()
            .optional()
            .nullable(),
        was_blocked: z
            .boolean()
            .optional(),
        blocked_reason: z
            .string()
            .optional()
            .nullable(),
    });
};

export type CreateCommandFormData = z.infer<ReturnType<typeof getCreateCommandSchema>>;
export type UpdateCommandFormData = z.infer<ReturnType<typeof getUpdateCommandSchema>>;
