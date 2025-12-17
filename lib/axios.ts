import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'

const getBaseURL = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  if (envUrl) {
    let cleanUrl = envUrl.trim()
    
    if (cleanUrl.includes('htthttp://')) {
      cleanUrl = cleanUrl.replace(/htthttp:\/\//g, 'http://')
    }
    if (cleanUrl.includes('httphttps://')) {
      cleanUrl = cleanUrl.replace(/httphttps:\/\//g, 'https://')
    }
    
    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1)
    }
    
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      console.warn('NEXT_PUBLIC_API_URL no tiene un protocolo válido, usando http:// por defecto')
      cleanUrl = `http://${cleanUrl}`
    }
    
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('API Base URL:', cleanUrl)
    }
    
    return cleanUrl
  }
  return 'http://localhost:8000/api/v1'
}

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (originalRequest.headers && token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return api(originalRequest)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = useAuthStore.getState().refreshToken
      
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const baseURL = getBaseURL()
      const response = await axios.post(
        `${baseURL}/auth/refresh`,
        { refresh_token: refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data

      useAuthStore.getState().setTokens(newAccessToken, newRefreshToken)

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      }

      processQueue(null, newAccessToken)
      isRefreshing = false

      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null)
      isRefreshing = false
      useAuthStore.getState().logout()
      
      return Promise.reject(refreshError)
    }
  }
)

export default api
