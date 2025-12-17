import { api } from "./axios"

type Permission = "create" | "read" | "update" | "delete"

interface Permissions {
  sessions: Permission[],
  users: Permission[],
}

export interface Role {
  name: string,
  display_name: string,
  permissions: Permissions
  color: string,
  id: string,
  is_system: true,
  created_at: string,
  updated_at: string
}

export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await api.get<Role[]>('/api/v1/roles')
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}