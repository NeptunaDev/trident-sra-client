import { z } from "zod";
import { t } from "@/lib/i18n";

// Helper function to get validation messages
const getValidationMessages = () => ({
  nameRequired: t("validation_name_required"),
  nameMin: t("validation_name_min"),
  nameMax: t("validation_name_max"),
  emailRequired: t("validation_email_required"),
  emailInvalid: t("validation_email_invalid"),
  passwordRequired: t("validation_password_required"),
  passwordMin: t("validation_password_min"),
  passwordUppercase: t("validation_password_uppercase"),
  passwordLowercase: t("validation_password_lowercase"),
  passwordNumber: t("validation_password_number"),
  roleRequired: t("validation_role_required"),
  organizationRequired: t("validation_organization_required"),
});

// Schema factory function for creating user
export const getCreateUserSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    name: z
      .string()
      .min(1, messages.nameRequired)
      .min(3, messages.nameMin)
      .max(100, messages.nameMax),

    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),

    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(8, messages.passwordMin)
      .regex(/[A-Z]/, messages.passwordUppercase)
      .regex(/[a-z]/, messages.passwordLowercase)
      .regex(/[0-9]/, messages.passwordNumber),

    role_id: z.string().min(1, messages.roleRequired),

    organization_id: z.string().min(1, messages.organizationRequired),
  });
};

// Schema factory function for updating user (password is optional)
export const getUpdateUserSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    name: z
      .string()
      .min(1, messages.nameRequired)
      .min(3, messages.nameMin)
      .max(100, messages.nameMax),

    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),

    password: z
      .string()
      .min(8, messages.passwordMin)
      .regex(/[A-Z]/, messages.passwordUppercase)
      .regex(/[a-z]/, messages.passwordLowercase)
      .regex(/[0-9]/, messages.passwordNumber)
      .optional()
      .or(z.literal("")), // Allows empty string

    role_id: z.string().min(1, messages.roleRequired),

    organization_id: z.string().min(1, messages.organizationRequired),
  });
};

// Export schemas for backward compatibility (they'll use current language)
export const createUserSchema = getCreateUserSchema();
export const updateUserSchema = getUpdateUserSchema();

// Infer types from schemas
export type CreateUserFormData = z.infer<
  ReturnType<typeof getCreateUserSchema>
>;
export type UpdateUserFormData = z.infer<
  ReturnType<typeof getUpdateUserSchema>
>;
