import { z } from "zod";
import { t } from "@/lib/i18n";

// Helper function to get validation messages
const getValidationMessages = () => ({
  nameRequired: t("validation_name_required"),
  nameMin: t("validation_name_min"),
  nameMax: t("validation_name_max"),
  slugRequired: t("validation_slug_required"),
  slugMin: t("validation_slug_min"),
  slugMax: t("validation_slug_max"),
  slugInvalid: t("validation_slug_invalid"),
  planRequired: t("validation_plan_required"),
  maxUsersInvalid: t("validation_max_users_invalid"),
  maxConnectionsInvalid: t("validation_max_connections_invalid"),
  maxAgentsInvalid: t("validation_max_agents_invalid"),
});

// Schema factory function for creating organization
export const getCreateOrganizationSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    name: z
      .string()
      .min(1, messages.nameRequired)
      .max(255, messages.nameMax)
      .trim(),

    slug: z
      .string()
      .min(1, messages.slugRequired)
      .max(100, messages.slugMax)
      .regex(/^[a-z0-9-]+$/, messages.slugInvalid)
      .trim(),

    plan: z.enum(["Free", "Pro", "Enterprise"], {
      errorMap: () => ({ message: messages.planRequired }),
    }),

    max_users: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? val : num; // Return original if NaN to trigger error
    }, z.union([z.number().int().positive({ message: messages.maxUsersInvalid }), z.null()])),

    max_connections: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.union([z.number().int().positive({ message: messages.maxConnectionsInvalid }), z.null()])),

    max_agents: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.union([z.number().int().positive({ message: messages.maxAgentsInvalid }), z.null()])),
  });
};

// Schema factory function for updating organization (all fields optional except id and is_active)
export const getUpdateOrganizationSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    name: z
      .string()
      .min(1, messages.nameRequired)
      .max(255, messages.nameMax)
      .trim()
      .optional(),

    slug: z
      .string()
      .min(1, messages.slugRequired)
      .max(100, messages.slugMax)
      .regex(/^[a-z0-9-]+$/, messages.slugInvalid)
      .trim()
      .optional(),

    plan: z.string().min(1, messages.planRequired).trim().optional(),

    max_users: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.union([z.number().int().positive({ message: messages.maxUsersInvalid }), z.null()]).optional()),

    max_connections: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.union([z.number().int().positive({ message: messages.maxConnectionsInvalid }), z.null()]).optional()),

    max_agents: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.union([z.number().int().positive({ message: messages.maxAgentsInvalid }), z.null()]).optional()),

    is_active: z.boolean(),
  });
};

// Export schemas for backward compatibility (they'll use current language)
export const createOrganizationSchema = getCreateOrganizationSchema();
export const updateOrganizationSchema = getUpdateOrganizationSchema();

// Infer types from schemas
export type CreateOrganizationFormData = z.infer<
  ReturnType<typeof getCreateOrganizationSchema>
>;
export type UpdateOrganizationFormData = z.infer<
  ReturnType<typeof getUpdateOrganizationSchema>
>;
