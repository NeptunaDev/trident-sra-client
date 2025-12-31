import { api } from "../axios"

export interface Connection {
  id: string,
  organization_id:string,
  create_by_user_id: string,
  name: string,
  protocol: string,
  hostname: string,
  port: number,
  username: string,
  password: string,
  description: string,
  status: string,
  last_used_at: string,
  total_sessions: number,
  created_at: string,
  updated_at: string
}
export interface CreateConnection {
  organization_id: string,
  create_by_user_id: string,
  name: string,
  protocol: string,
  hostname: string,
  port: number,
  username: string,
  password: string,
  description?: string,
  status?: string,
  total_sessions: number,
}

export interface UpdateConnection extends Partial<CreateConnection> {
  id: string
}

export const getConnections= async (): Promise<Connection[]> => {
  try {
    const response = await api.get<Connection[]>('/api/v1/connections')
    return response.data
    } catch (error) {
    console.error(error)
    throw error
    }
}

export const createConnection = async (connection: CreateConnection): Promise<Connection> => {
  try {
    const response = await api.post<Connection>('/api/v1/connections', connection)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  } 
}

export const updateConnection = async (connection: UpdateConnection): Promise<Connection> => {
    try {
        const { id, ...rest } = connection
        const response = await api.put<Connection>(`/api/v1/connections/${id}`, rest)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
} 

export const deleteConnection = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/connections/${id}`)
  } catch (error: any) {
    console.error(error)
    // Se deben terminar las sesiones activas y se deben remover participantes asociados antes de eliminar
    if (error.response?.status === 409) {
      throw new Error(
        error.response?.data?.detail || 
        'Cannot delete connection: it has active sessions, participants or dependencies. Please remove them first.'
      )
    }
    throw error
  }
}
