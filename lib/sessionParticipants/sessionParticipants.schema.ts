import { z } from "zod";
import { t } from "@/lib/i18n";

// Mensajes de validación centralizados
const getValidationMessages = () => ({
  fileUrlRequired: t("validation_file_url_required"),
  fileUrlInvalid: t("validation_file_url_invalid"),
  sessionIdRequired: t("validation_session_id_required"),
  sessionIdInvalid: t("validation_session_id_invalid"),
  fileSizeBytesMin: t("validation_file_size_min"),
  durationMin: t("validation_duration_min"),
});

// Esquema base para los campos comunes
const sessionRecordingBase = (
  messages: ReturnType<typeof getValidationMessages>
) => ({
  file_url: z
    .string()
    .url(messages.fileUrlInvalid)
    .min(1, messages.fileUrlRequired),
  file_name: z.string().nullable().optional(),
  file_size_bytes: z
    .number()
    .int()
    .min(0, messages.fileSizeBytesMin)
    .nullable()
    .optional(),
  duration_seconds: z
    .number()
    .int()
    .min(0, messages.durationMin)
    .nullable()
    .optional(),
  status: z.string().nullable().optional(),
  session_id: z.string().uuid(messages.sessionIdInvalid),
});

// Factory para creación (Todos los campos requeridos según tu especificación)
export const getCreateSessionRecordingSchema = () => {
  const messages = getValidationMessages();
  return z.object(sessionRecordingBase(messages));
};

// Factory para actualización (Campos opcionales)
export const getUpdateSessionRecordingSchema = () => {
  const messages = getValidationMessages();
  const base = sessionRecordingBase(messages);

  return z.object({
    file_url: base.file_url.optional(),
    file_name: base.file_name,
    file_size_bytes: base.file_size_bytes,
    duration_seconds: base.duration_seconds,
    status: base.status,
    session_id: base.session_id.optional(),
  });
};

// Exportación de esquemas estáticos
export const createSessionRecordingSchema = getCreateSessionRecordingSchema();
export const updateSessionRecordingSchema = getUpdateSessionRecordingSchema();

// Inferencia de tipos
export type CreateSessionRecordingData = z.infer<
  ReturnType<typeof getCreateSessionRecordingSchema>
>;
export type UpdateSessionRecordingData = z.infer<
  ReturnType<typeof getUpdateSessionRecordingSchema>
>;
