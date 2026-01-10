import { z } from "zod";
import { t } from "@/lib/i18n";

// Helper function to get validation messages
const getValidationMessages = () => ({
  agentNameRequired: t("validation_agent_name_required"),
  agentNameMin: t("validation_agent_name_min"),
  agentNameMax: t("validation_agent_name_max"),
  hostnameRequired: t("validation_hostname_required"),
  hostnameMin: t("validation_hostname_min"),
  hostnameMax: t("validation_hostname_max"),
  osTypeRequired: t("validation_os_type_required"),
  tunnelTypeRequired: t("validation_tunnel_type_required"),
  agentTokenRequired: t("validation_agent_token_required"),
  agentTokenMin: t("validation_agent_token_min"),
  portInvalid: t("validation_port_invalid"),
  urlInvalid: t("validation_url_invalid"),
  maxConcurrentSessionsInvalid: t("validation_max_concurrent_sessions_invalid"),
});

// Schema factory function for creating agent
export const getCreateAgentSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    agent_name: z
      .string()
      .min(1, messages.agentNameRequired)
      .max(100, messages.agentNameMax)
      .trim(),

    hostname: z
      .string()
      .min(1, messages.hostnameRequired)
      .max(255, messages.hostnameMax)
      .trim(),

    os_type: z.enum(["windows", "linux", "freebsd", "macos"], {
      errorMap: () => ({ message: messages.osTypeRequired }),
    }),

    os_version: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z.string().nullable().optional()
    ),

    tunnel_type: z.enum(
      ["cloudflare", "ssh_reverse", "vpn", "ngrok", "direct"],
      {
        errorMap: () => ({ message: messages.tunnelTypeRequired }),
      }
    ),

    public_ws_url: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z
        .union([z.string().url(messages.urlInvalid), z.null()])
        .optional()
        .nullable()
    ),

    local_ws_port: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.union([z.number().int().min(1, messages.portInvalid).max(65535, messages.portInvalid), z.null()]).optional()),

    tunnel_config: z.preprocess(
      (val) => (val === "" || val === undefined || val === null ? null : val),
      z.record(z.any()).nullable().optional()
    ),

    guacd_host: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z.string().nullable().optional()
    ),

    guacd_port: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.union([z.number().int().min(1, messages.portInvalid).max(65535, messages.portInvalid), z.null()]).optional()),

    docker_api_url: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z
        .union([z.string().url(messages.urlInvalid), z.null()])
        .optional()
        .nullable()
    ),

    version: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z.string().nullable().optional()
    ),

    max_concurrent_sessions: z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return null;
        const num = Number(val);
        return isNaN(num) ? val : num;
      },
      z
        .union([
          z.number().int().positive({
            message: messages.maxConcurrentSessionsInvalid,
          }),
          z.null(),
        ])
        .optional()
    ),

    agent_token: z
      .string()
      .min(1, messages.agentTokenRequired)
      .min(32, messages.agentTokenMin)
      .trim(),

    organization_id: z.string().nullable().optional(),
  });
};

// Schema factory function for updating agent (all fields optional)
export const getUpdateAgentSchema = () => {
  const messages = getValidationMessages();
  return z.object({
    agent_name: z
      .string()
      .min(1, messages.agentNameRequired)
      .max(100, messages.agentNameMax)
      .trim()
      .optional(),

    hostname: z
      .string()
      .min(1, messages.hostnameRequired)
      .max(255, messages.hostnameMax)
      .trim()
      .optional(),

    os_type: z
      .enum(["windows", "linux", "freebsd", "macos"], {
        errorMap: () => ({ message: messages.osTypeRequired }),
      })
      .optional(),

    os_version: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z.string().nullable().optional()
    ),

    tunnel_type: z
      .enum(["cloudflare", "ssh_reverse", "vpn", "ngrok", "direct"], {
        errorMap: () => ({ message: messages.tunnelTypeRequired }),
      })
      .optional(),

    status: z.enum(["online", "offline", "maintenance", "error"]).optional(),

    public_ws_url: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z
        .union([z.string().url(messages.urlInvalid), z.null()])
        .optional()
        .nullable()
    ),

    local_ws_port: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.union([z.number().int().min(1, messages.portInvalid).max(65535, messages.portInvalid), z.null()]).optional()),

    tunnel_config: z.preprocess(
      (val) => (val === "" || val === undefined || val === null ? null : val),
      z.record(z.any()).nullable().optional()
    ),

    guacd_host: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z.string().nullable().optional()
    ),

    guacd_port: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.union([z.number().int().min(1, messages.portInvalid).max(65535, messages.portInvalid), z.null()]).optional()),

    docker_api_url: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z
        .union([z.string().url(messages.urlInvalid), z.null()])
        .optional()
        .nullable()
    ),

    version: z.preprocess(
      (val) => (val === "" || val === undefined ? null : val),
      z.string().nullable().optional()
    ),

    max_concurrent_sessions: z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return null;
        const num = Number(val);
        return isNaN(num) ? val : num;
      },
      z
        .union([
          z.number().int().positive({
            message: messages.maxConcurrentSessionsInvalid,
          }),
          z.null(),
        ])
        .optional()
    ),

    current_active_sessions: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number().int().min(0).optional()),

    cpu_usage_percent: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number().min(0).max(100).optional()),

    memory_usage_percent: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number().min(0).max(100).optional()),

    disk_usage_percent: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? val : num;
    }, z.number().min(0).max(100).optional()),

    agent_token: z.string().min(32, messages.agentTokenMin).trim().optional(),

    organization_id: z.string().nullable().optional(),
  });
};

// Export schemas for backward compatibility (they'll use current language)
export const createAgentSchema = getCreateAgentSchema();
export const updateAgentSchema = getUpdateAgentSchema();

// Infer types from schemas
export type CreateAgentFormData = z.infer<
  ReturnType<typeof getCreateAgentSchema>
>;
export type UpdateAgentFormData = z.infer<
  ReturnType<typeof getUpdateAgentSchema>
>;
