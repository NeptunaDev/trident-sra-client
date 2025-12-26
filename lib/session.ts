import { api } from "./axios";

export interface Session {
  id: string;
  public_session_id: string;
  connection_id: string;
  initiated_by_user_id: string;
  status: string;
  started_at: string;
  created_at: string;
  recording_enabled: boolean;
  total_commands: number;
  blocked_commands: number;
}

export const getSessions = async (): Promise<Session[]> => {
  try {
    const response = await api.get<Session[]>("/api/v1/sessions");
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};
