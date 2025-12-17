import { getAccessToken } from "./auth"

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
    const access_token = getAccessToken()
    if (!access_token) {
      throw new Error("No access token available")
    }
    const response = await fetch("http://localhost:8000/api/v1/roles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
    })
    if (!response.ok) {
      throw new Error("Failed to get roles")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}