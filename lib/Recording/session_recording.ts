import { api } from '../axios'

export interface SessionRecording {
    id: string,
    session_id: string,
    file_url : string,
    file_name : string,
    file_size_bytes : number, 
    duration_seconds : number,
    status : string,
    created_at : string
} 
export interface CreateSessionRecording {
    session_id: string,
    file_url : string,
    file_name? : string,
    file_size_bytes? : number, 
    duration_seconds? : number,
    status? : string,
} 

export interface UpdateSessionRecording extends Partial<CreateSessionRecording> {
    id: string
}

export const getSessionRecordings= async (): Promise<SessionRecording[]> => {
    try {
      const response = await api.get<SessionRecording[]>('/api/v1/recordings')
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}
export const createSessionRecording = async (sessionRecording: CreateSessionRecording): Promise<SessionRecording> => {
    try {
        const response = await api.post<SessionRecording>('/api/v1/recordings', sessionRecording)
        return response.data
    } catch (error: any) {
        console.error(error)
        if (error.response?.status === 409) {
            throw new Error('A recording already exists for this session. Please select a different session or delete the existing recording first.')
        }
        throw error
    }
}

export const updateSessionRecording = async (sessionRecording: UpdateSessionRecording): Promise<SessionRecording> => {
    try {
        const { id, ...rest } = sessionRecording
        const response = await api.put<SessionRecording>(`/api/v1/recordings/${id}`, rest)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deleteSessionRecording = async (id: string): Promise<void> => {
    try {
        await api.delete(`/api/v1/recordings/${id}`)
    } catch (error) {
        console.error(error)
        throw error
    }
}
