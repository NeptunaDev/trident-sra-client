export interface User {
  created_at: string
  email: string
  id: string
  is_active: boolean
  name: string
  organization_id: string
  role_id: string
  twofa_enabled: boolean
  updated_at: string
}

export const getCurrentUser = async (): Promise<User> => {
  try {
    const access_token = localStorage.getItem("access_token")
    const response = await fetch("http://localhost:8000/api/v1/users/me/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
    })
    if (!response.ok) {
      throw new Error("Failed to get current user")
    }
    const data = await response.json()
    return data as User
  } catch (error) {
    console.error(error)
    throw error
  }
}