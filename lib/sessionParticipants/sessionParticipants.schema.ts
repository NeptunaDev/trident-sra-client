import { z } from "zod";
import { t } from "@/lib/i18n";

const getValidationMessages = () => ({
  sessionIdRequired: t("validation_session_id_required"),
  userIdRequired: t("validation_user_id_required"),
  roleRequired: t("validation_role_required"),
});

const sessionParticipantsBase = (
  messages: ReturnType<typeof getValidationMessages>
) => ({
  session_id: z.string().uuid(messages.sessionIdRequired).min(1),
  user_id: z.string().uuid(messages.userIdRequired).min(1),
  role: z.enum(["owner", "collaborator", "observer"]),
  can_write: z.boolean().default(false),
  join_at: z.string().nullable().optional(),
});

export const getCreateSessionParticipantsSchema = () => {
  const messages = getValidationMessages();
  return z.object(sessionParticipantsBase(messages));
};

export const getUpdateSessionParticipantsSchema = () => {
  const messages = getValidationMessages();
  const base = sessionParticipantsBase(messages);
  return z.object({
    role: base.role.optional(),
    can_write: base.can_write.optional(),
    is_active: z.boolean().optional(),
  });
};

export type CreateSessionParticipantsData = z.infer<
  ReturnType<typeof getCreateSessionParticipantsSchema>
>;
export type UpdateSessionParticipantsData = z.infer<
  ReturnType<typeof getUpdateSessionParticipantsSchema>
>;
