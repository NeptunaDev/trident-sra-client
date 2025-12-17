export interface User {
  id: string
  name: string
  email: string
  role_id: string
  is_active: boolean
  organization_id: string
  twofa_enabled: boolean
  created_at: string
  updated_at: string
}

export interface CreateUser {
  name: string
  email: string
  password: string
  role_id: string
  organization_id: string
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

export const getUser = async (): Promise<User[]> => {
  try {
    const access_token = localStorage.getItem("access_token")
    const response = await fetch("http://localhost:8000/api/v1/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
    })
    if (!response.ok) {
      throw new Error("Failed to get users")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const createUser = async (user: CreateUser): Promise<User> => {
  try {
    const access_token = localStorage.getItem("access_token")
    const response = await fetch("http://localhost:8000/api/v1/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      },
    })
    if (!response.ok) {
      throw new Error("Failed to create user")
    }
    const data = await response.json()
    return data as User
  } catch (error) {
    console.error(error)
    throw error
  }
}