import { api } from "./axios";

export interface AuditLogs {
  id: string;
  event_type: string;
  action: string;
  description: string;
  status: string;
  details: {};
  user_id: string;
  organization_id: string;
  timestamp: string;
  created_at: string;
}

export interface CreateAuditLogs {
  event_type: string;
  action: string;
  description: string;
  status: string;
  details: {};
  organization_id: string;
  user_id: string;
}

export interface UpdateAuditLogs extends Partial<CreateAuditLogs> {
  id: string;
}

export const getAuditLogs = async (): Promise<AuditLogs[]> => {
  try {
    const response = await api.get<AuditLogs[]>("/api/v1/audit-logs");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createAuditLogs = async (
  auditLogs: CreateAuditLogs
): Promise<AuditLogs> => {
  try {
    const response = await api.post<AuditLogs>("/api/v1/audit-logs", auditLogs);
    return response.data;
  } catch (error) {
    console.error(error);
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
