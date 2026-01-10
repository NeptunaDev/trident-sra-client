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
  organizationNameRequired: t("validation_name_required"),
  organizationNameMin: t("validation_name_min"),
  organizationNameMax: t("validation_name_max"),
  slugRequired: t("validation_slug_required"),
  slugMin: t("validation_slug_min"),
  slugMax: t("validation_slug_max"),
  slugInvalid: t("validation_slug_invalid"),
});

// Schema factory function for registration
export const getRegisterSchema = () => {
  const messages = getValidationMessages();
  return z.object({
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

    name: z
      .string()
      .min(1, messages.nameRequired)
      .min(3, messages.nameMin)
      .max(100, messages.nameMax)
      .trim(),

    organization_name: z
      .string()
      .min(1, messages.organizationNameRequired)
      .min(3, messages.organizationNameMin)
      .max(255, messages.organizationNameMax)
      .trim(),

    organization_slug: z
      .string()
      .min(1, messages.slugRequired)
      .max(100, messages.slugMax)
      .regex(/^[a-z0-9-]+$/, messages.slugInvalid)
      .trim(),
  });
};

// Export schema for backward compatibility
export const registerSchema = getRegisterSchema();

// Infer type from schema
export type RegisterFormData = z.infer<ReturnType<typeof getRegisterSchema>>;
