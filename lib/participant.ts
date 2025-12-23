import { api } from "./axios"

export interface Participant {
    id: string,
    session_id: string,
    user_id: string,
    role: string,
    can_write: boolean,
    join_at: string,
    left_at: string | null,
    is_active: boolean,
} 
export interface CreateParticipant {
    session_id: string,
    user_id: string,
    role: string,
    can_write: boolean,
    is_active?: boolean,
} 
export interface UpdateParticipant extends Partial<CreateParticipant> {
    id: string
    is_active?: boolean
}

export const getParticipants= async (): Promise<Participant[]> => {
    try {
      const response = await api.get<Participant[]>('/api/v1/sessions-participant')
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createParticipant = async (participant: CreateParticipant): Promise<Participant> => {
    try {
        const response = await api.post<Participant>('/api/v1/sessions-participant/', participant)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updateParticipant = async (participant: UpdateParticipant): Promise<Participant> => {
    try {
        const { id, ...rest } = participant
        const response = await api.put<Participant>(`/api/v1/sessions-participant/${id}`, rest)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deleteParticipant = async (id: string): Promise<void> => {
    try {
        await api.delete(`/api/v1/sessions-participant/${id}`)
    }
    catch (error) {
        console.error(error)
        throw error
    }
}


