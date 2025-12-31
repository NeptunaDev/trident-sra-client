import { z } from "zod";
import { t } from "@/lib/i18n";

// Helper function to get validation messages
const getValidationMessages = () => ({
    nameRequired: t("validation_name_required"),
    nameMax: t("validation_name_max"),
    protocolRequired: t("validation_protocol_required"),
    protocolMax: t("validation_protocol_max"),
    hostnameRequired: t("validation_hostname_required"),
    hostnameMax: t("validation_hostname_max"),
    portMin: t("validation_port_min"),
    portMax: t("validation_port_max"),
    portInvalid: t("validation_port_invalid"),
    usernameRequired: t("validation_username_required"),
    usernameMax: t("validation_username_max"),
    passwordRequired: t("validation_password_required"),
    passwordMax: t("validation_password_max"),
    descriptionMax: t("validation_description_max"),
    statusMax: t("validation_status_max"),
    organizationRequired: t("validation_organization_required"),
});

// Schema factory function for creating connection
export const getCreateConnectionSchema = () => {
    const messages = getValidationMessages();
    return z.object({
        name: z
            .string()
            .min(1, messages.nameRequired)
            .max(100, messages.nameMax),
        
        protocol: z
            .string()
            .min(1, messages.protocolRequired)
            .max(50, messages.protocolMax),
        
        hostname: z
            .string()
            .min(1, messages.hostnameRequired)
            .max(255, messages.hostnameMax),
        
        port: z
            .number({ invalid_type_error: messages.portInvalid })
            .min(1, messages.portMin)
            .max(65535, messages.portMax)
            .optional()
            .nullable(),
        
        username: z
            .string()
            .min(1, messages.usernameRequired)
            .max(255, messages.usernameMax),
        
        password: z
            .string()
            .min(1, messages.passwordRequired)
            .max(255, messages.passwordMax),
        
        organization_id: z
            .string()
            .min(1, messages.organizationRequired),
        
        description: z
            .string()
            .max(255, messages.descriptionMax)
            .optional(),
        
        status: z
            .string()
            .max(50, messages.statusMax)
            .optional(),
    });
};

// Schema factory function for updating connection (password is optional)
export const getUpdateConnectionSchema = () => {
    const messages = getValidationMessages();
    return z.object({
        name: z
            .string()
            .min(1, messages.nameRequired)
            .max(100, messages.nameMax)
            .optional(),
        
        protocol: z
            .string()
            .min(1, messages.protocolRequired)
            .max(50, messages.protocolMax)
            .optional(),
        
        hostname: z
            .string()
            .min(1, messages.hostnameRequired)
            .max(255, messages.hostnameMax)
            .optional(),
        
        port: z
            .number({ invalid_type_error: messages.portInvalid })
            .min(1, messages.portMin)
            .max(65535, messages.portMax)
            .optional()
            .nullable(),
        
        username: z
            .string()
            .min(1, messages.usernameRequired)
            .max(255, messages.usernameMax)
            .optional(),
        
        password: z
            .string()
            .min(1, messages.passwordRequired)
            .max(255, messages.passwordMax)
            .optional()
            .or(z.literal("")), 
        
        organization_id: z
            .string()
            .min(1, messages.organizationRequired)
            .optional(),
        
        description: z
            .string()
            .max(255, messages.descriptionMax)
            .optional(),
        
        status: z
            .string()
            .max(50, messages.statusMax)
            .optional(),
    });
};

// Export schemas for backward compatibility (they'll use current language)
export const createConnectionSchema = getCreateConnectionSchema();
export const updateConnectionSchema = getUpdateConnectionSchema();

// Infer types from schemas
export type CreateConnectionFormData = z.infer<ReturnType<typeof getCreateConnectionSchema>>;
export type UpdateConnectionFormData = z.infer<ReturnType<typeof getUpdateConnectionSchema>>;