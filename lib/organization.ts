import { getAccessToken } from "./auth"
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
    const access_token = getAccessToken()
    if (!access_token) {
      throw new Error("No access token available")
    }
    const response = await fetch("http://localhost:8000/api/v1/organizations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
    })
    if (!response.ok) {
      throw new Error("Failed to get organizations")
    }
    const data = await response.json()
    return data as Organization[]
  } catch (error) {
    console.error(error)
    throw error
  }
}