import { api } from "./axios";

export interface Session {
  id: string;
  public_session_id: string;
  connection_id: string;
  initiated_by_user_id: string;
  status: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  recording_enabled: boolean;
  recording_url: string;
  total_commands: number;
  blocked_commands: number;
  created_at: string;
}

export interface CreateSession {
  public_session_id: string;
  connection_id: string;
  initiated_by_user_id: string;
  recording_enabled: boolean;
  status: string;
  duration_seconds: number;
  recording_url: string;
  total_commands: number;
  blocked_commands: number;
}

export interface UpdateSession extends Partial<CreateSession> {
  id: string;
}

export const getSession = async (): Promise<Session[]> => {
  try {
    const response = await api.get<Session[]>("/api/v1/sessions");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createSession = async (
  session: CreateSession
): Promise<Session> => {
  try {
    const response = await api.post<Session>("/api/v1/sessions", session);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSession = async (
  session: UpdateSession
): Promise<Session> => {
  try {
    const { id, ...rest } = session;
    const response = await api.put<Session>(`/api/v1/sessions/${id}`, rest);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteSession = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/sessions/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
