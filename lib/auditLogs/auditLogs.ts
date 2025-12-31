import { api } from "../axios";

export interface AuditLogs {
  id: string;
  event_type: string;
  action: string;
  description: string | null;
  status: string | null;
  details: Record<string, any> | null;
  user_id: string;
  organization_id: string;
  timestamp: string;
  created_at: string;
}

export interface CreateAuditLogs {
  event_type: string;
  action: string;
  description: string | null;
  status: string | null;
  details: Record<string, any> | null;
  organization_id: string | null;
  user_id: string | null;
}

export interface UpdateAuditLogs extends Partial<CreateAuditLogs> {
  id: string;
}

export const getAuditLogs = async (): Promise<AuditLogs[]> => {
  try {
    const response = await api.get<AuditLogs[]>("/api/v1/audit-logs/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los logs de auditoría:", error);
    throw error;
  }
};

export const createAuditLogs = async (
  data: CreateAuditLogs
): Promise<AuditLogs> => {
  try {
    const response = await api.post<AuditLogs>("/api/v1/audit-logs/", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear el log:", error);
    throw error;
  }
};

export const updateAuditLogs = async (
  auditLogs: UpdateAuditLogs
): Promise<AuditLogs> => {
  try {
    const { id, ...rest } = auditLogs;
    const response = await api.put<AuditLogs>(`/api/v1/audit-logs/${id}`, rest);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAuditLogs = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/audit-logs/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
