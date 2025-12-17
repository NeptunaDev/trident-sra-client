import { api } from './axios'

export interface Login {
  email: string
  password: string
}

export interface TokenPayload {
  role_name: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

/**
 * Helper to get access token from auth store (localStorage)
 * This reads directly from localStorage to avoid needing hooks in async functions
 */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem("auth-storage")
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return parsed?.state?.accessToken ?? null
  } catch {
    return null
  }
}

export const login = async (loginData: Login): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/api/v1/auth/login', loginData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}