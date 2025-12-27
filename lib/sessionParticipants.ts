import { api } from "./axios";

export type SessionParticipantRole = "owner" | "collaborator" | "viewer";

export interface SessionParticipant {
  id: string;
  can_write: boolean;
  is_active: boolean;
  join_at: string;
  role: string;
  session_id: string;
  user_id: string;
}

export interface CreateSessionParticipant {
  role: SessionParticipantRole;
  can_write: boolean;
  session_id: string;
  user_id: string;
  join_at: string | null;
}

export interface UpdateSessionParticipant {
  id: string;
  role: SessionParticipantRole;
  can_write: boolean;
  is_active: boolean;
  left_at: string;
}

export const getSessionParticipants = async (): Promise<
  SessionParticipant[]
> => {
  try {
    const response = await api.get<SessionParticipant[]>(
      "/api/v1/sessions-participant/"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createSessionParticipant = async (
  sessionParticipant: CreateSessionParticipant
): Promise<SessionParticipant> => {
  try {
    const response = await api.post<SessionParticipant>(
      "/api/v1/sessions-participant/",
      sessionParticipant
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSessionParticipant = async (
  sessionParticipant: UpdateSessionParticipant
): Promise<SessionParticipant> => {
  try {
    const { id, ...rest } = sessionParticipant;
    const response = await api.put<SessionParticipant>(
      `/api/v1/sessions-participant/${id}`,
      rest
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteSessionParticipant = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/sessions-participant/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
