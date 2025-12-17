import { api } from "./axios"

export interface Organization {
  id: string,
  name: string,
  is_active: true,
  plan: string,
  slug: string,
  max_users: number,
  max_agents: number,
  max_connections: number,
  created_at: string,
  updated_at: string
}

export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await api.get<Organization[]>('/api/v1/organizations')
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}