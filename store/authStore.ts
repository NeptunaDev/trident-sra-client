"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type AuthUser = {
  name?: string
  email?: string
}

export type AuthState = {
  user: AuthUser | null
  roleName: string | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  setSession: (payload: {
    user?: AuthUser | null
    roleName?: string | null
    accessToken: string
    refreshToken: string
  }) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearSession: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      roleName: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setSession: ({ user, roleName, accessToken, refreshToken }) =>
        set({
          user: user ?? null,
          roleName: roleName ?? null,
          accessToken,
          refreshToken,
          isAuthenticated: !!accessToken,
        }),

      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: !!accessToken,
        }),

      clearSession: () =>
        set({
          user: null,
          roleName: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
        }
        
        set({
          user: null,
          roleName: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
        
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        roleName: state.roleName,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
)

