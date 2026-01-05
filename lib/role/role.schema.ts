import { z } from "zod";
import { t } from "@/lib/i18n";
import { PermissionSessions, PermissionUser } from "./role";

// Helper function to get validation messages
const getValidationMessages = () => ({
  nameRequired: t("validation_name_required"),
  nameMin: t("validation_role_name_min"),
  nameMax: t("validation_role_name_max"),
  displayNameRequired: t("validation_name_required"),
  displayNameMin: t("validation_role_display_name_min"),
  displayNameMax: t("validation_role_display_name_max"),
  colorRequired: t("validation_role_color_required"),
  colorInvalid: t("validation_role_color_invalid"),
  permissionsRequired: t("validation_role_permissions_required"),
});

// Schema for permissions object
const permissionsSchema = z.object({
  sessions: z.array(
    z.enum(["create", "read"] as [PermissionSessions, ...PermissionSessions[]])
  ),
  users: z.array(
    z.enum(["create", "read", "update", "delete"] as [
      PermissionUser,
      ...PermissionUser[]
    ])
  ),
});

// Schema factory function for creating role
export const getCreateRoleSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    name: z.string().min(1, messages.nameMin).max(50, messages.nameMax),

    display_name: z
      .string()
      .min(1, messages.displayNameMin)
      .max(100, messages.displayNameMax),

    color: z
      .string()
      .min(1, messages.colorRequired)
      .regex(/^#[0-9a-fA-F]{6}$/, messages.colorInvalid),

    permissions: permissionsSchema,

    is_system: z.boolean().nullable().optional(),
  });
};

// Schema factory function for updating role
export const getUpdateRoleSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    name: z
      .string()
      .min(1, messages.nameMin)
      .max(50, messages.nameMax)
      .optional(),

    display_name: z
      .string()
      .min(1, messages.displayNameMin)
      .max(100, messages.displayNameMax)
      .optional(),

    color: z
      .string()
      .min(1, messages.colorRequired)
      .regex(/^#[0-9a-fA-F]{6}$/, messages.colorInvalid)
      .optional(),

    permissions: permissionsSchema.optional(),

    is_system: z.boolean().nullable().optional(),
  });
};

// Export schemas for backward compatibility (they'll use current language)
export const createRoleSchema = getCreateRoleSchema();
export const updateRoleSchema = getUpdateRoleSchema();

// Infer types from schemas
export type CreateRoleFormData = z.infer<
  ReturnType<typeof getCreateRoleSchema>
>;
export type UpdateRoleFormData = z.infer<
  ReturnType<typeof getUpdateRoleSchema>
>;
