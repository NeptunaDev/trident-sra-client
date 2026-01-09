import { api } from './axios'
import { useAuthStore } from '@/store/authStore'

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

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null
  return useAuthStore.getState().accessToken
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

export interface Register {
  email: string
  password: string
  name: string
  organization_name: string
  organization_slug: string
}

export interface RegisterResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export const register = async (registerData: Register): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>('/api/v1/auth/register', registerData)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}