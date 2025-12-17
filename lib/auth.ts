export interface Login {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export const login = async (login: Login): Promise<LoginResponse> => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(login),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      throw new Error("Failed to login")
    }
    const data = await response.json()
    return data as LoginResponse
  } catch (error) {
    console.error(error)
    throw error
  }
}