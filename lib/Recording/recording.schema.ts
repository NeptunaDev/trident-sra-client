import { z } from "zod";
import { t } from "@/lib/i18n";
import { RecordingStatus } from "./session_recording";

// Helper function to get validation messages
const getValidationMessages = () => ({
    fileUrlRequired: t("validation_file_url_required"),
    fileNameMax: t("validation_file_name_max"),
    fileSizeMin: t("validation_file_size_min"),
    fileSizeInvalid: t("validation_file_size_invalid"),
    fileSizeMax: t("validation_file_size_max"),
    durationInvalid: t("validation_duration_invalid"),
    durationMax: t("validation_duration_max"),
    durationMin: t("validation_duration_min"),
    statusRequired: t("validation_status_required"),
    sessionIdRequired: t("validation_session_id_required"),
});

// Schema factory function for creating session recording
export const getCreateSessionRecordingSchema = () => {
    const messages = getValidationMessages();
    return z.object({
        file_url: z
            .string()
            .min(1, messages.fileUrlRequired),
        
        file_name: z
            .string()
            .max(255, messages.fileNameMax)
            .optional(),
        
        file_size_bytes: z
            .number({ invalid_type_error: messages.fileSizeInvalid })
            .min(0, messages.fileSizeMin)
            .max(Number.MAX_SAFE_INTEGER, messages.fileSizeMax)
            .optional(),

        duration_seconds: z
            .number({ invalid_type_error: messages.durationInvalid })
            .min(0, messages.durationMin)
            .max(Number.MAX_SAFE_INTEGER, messages.durationMax)
            .optional(),
        
        status: z.nativeEnum(RecordingStatus, {
            required_error: messages.statusRequired,
            invalid_type_error: messages.statusRequired,
        }).optional(),
        
        session_id: z
            .string()
            .min(1, messages.sessionIdRequired),
    });
};

// Schema factory function for updating session recording
export const getUpdateSessionRecordingSchema = () => {
    const messages = getValidationMessages();
    return z.object({
        session_id: z
            .string()
            .min(1, messages.sessionIdRequired)
            .optional(),
        
        file_url: z
            .string()
            .min(1, messages.fileUrlRequired)
            .optional(),
        
        file_name: z
            .string()
            .max(255, messages.fileNameMax)
            .optional(),
        
        file_size_bytes: z
            .number({ invalid_type_error: messages.fileSizeInvalid })
            .min(0, messages.fileSizeMin)
            .max(Number.MAX_SAFE_INTEGER, messages.fileSizeMax)
            .optional(),

        duration_seconds: z
            .number({ invalid_type_error: messages.durationInvalid })
            .min(0, messages.durationMin)
            .max(Number.MAX_SAFE_INTEGER, messages.durationMax)
            .optional(),
        
        status: z.nativeEnum(RecordingStatus, {
            required_error: messages.statusRequired,
            invalid_type_error: messages.statusRequired,
        }).optional(),
    });
};

// Export schemas for backward compatibility (they'll use current language)
export const createSessionRecordingSchema = getCreateSessionRecordingSchema();
export const updateSessionRecordingSchema = getUpdateSessionRecordingSchema();

// Infer types from schemas
export type CreateSessionRecordingFormData = z.infer<ReturnType<typeof getCreateSessionRecordingSchema>>;
export type UpdateSessionRecordingFormData = z.infer<ReturnType<typeof getUpdateSessionRecordingSchema>>;
