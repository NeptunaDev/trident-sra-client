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

  setSession: (payload: {
    user?: AuthUser | null
    roleName?: string | null
    accessToken: string
    refreshToken: string
  }) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      roleName: null,
      accessToken: null,
      refreshToken: null,

      setSession: ({ user, roleName, accessToken, refreshToken }) =>
        set({
          user: user ?? null,
          roleName: roleName ?? null,
          accessToken,
          refreshToken,
        }),

      clearSession: () =>
        set({
          user: null,
          roleName: null,
          accessToken: null,
          refreshToken: null,
        }),
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

