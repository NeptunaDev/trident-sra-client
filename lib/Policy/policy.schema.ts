import { z } from "zod";
import { t } from "@/lib/i18n";

// Helper function to get validation messages
const getValidationMessages = () => ({
    nameRequired: t("validation_name_required"),
    nameMax: t("validation_name_max"),
    descriptionMax: t("validation_description_max"),
    organizationRequired: t("validation_organization_required"),
});

// Schema factory function for creating policy
export const getCreatePolicySchema = () => {
    const messages = getValidationMessages();
    return z.object({
        name: z
            .string()
            .min(1, messages.nameRequired)
            .max(100, messages.nameMax),
        
        description: z
            .string()
            .max(255, messages.descriptionMax)
            .optional(),
        
        blocked_patterns: z
            .array(z.string())
            .optional(),
        
        applies_to_roles: z
            .array(z.string())
            .optional(),
        
        organization_id: z
            .string()
            .min(1, messages.organizationRequired)
            .optional(),
        
        is_active: z
            .boolean()
            .optional(),
    });
};

// Schema factory function for updating policy
export const getUpdatePolicySchema = () => {
    const messages = getValidationMessages();
    return z.object({
        name: z
            .string()
            .min(1, messages.nameRequired)
            .max(100, messages.nameMax)
            .optional(),
        
        description: z
            .string()
            .max(255, messages.descriptionMax)
            .optional(),
        
        is_active: z
            .boolean()
            .optional(),
        
        blocked_patterns: z
            .array(z.string())
            .optional(),
        
        applies_to_roles: z
            .array(z.string())
            .optional(),
    });
};

// Export schemas for backward compatibility (they'll use current language)
export const createPolicySchema = getCreatePolicySchema();
export const updatePolicySchema = getUpdatePolicySchema();

// Infer types from schemas
export type CreatePolicyFormData = z.infer<ReturnType<typeof getCreatePolicySchema>>;
export type UpdatePolicyFormData = z.infer<ReturnType<typeof getUpdatePolicySchema>>;