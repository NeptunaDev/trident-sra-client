"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireSuperAdmin?: boolean
  requireGuest?: boolean
}

const getAuthFromStorage = () => {
  if (typeof window === "undefined") return { isAuthenticated: false, roleName: null, accessToken: null }
  
  const state = useAuthStore.getState()
  const accessToken = state.accessToken
  const roleName = state.roleName
  
  return {
    isAuthenticated: !!accessToken,
    roleName: roleName || null,
    accessToken: accessToken || null,
  }
}

export function RouteGuard({
  children,
  requireAuth = false,
  requireSuperAdmin = false,
  requireGuest = false,
}: RouteGuardProps) {
  const router = useRouter()
  const storeAccessToken = useAuthStore((state) => state.accessToken)
  const storeRoleName = useAuthStore((state) => state.roleName)
  const [authState, setAuthState] = useState(() => getAuthFromStorage())
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const updateState = () => {
      const storageAuth = getAuthFromStorage()
      const finalAuth = storeAccessToken 
        ? { 
            accessToken: storeAccessToken, 
            roleName: storeRoleName, 
            isAuthenticated: !!storeAccessToken 
          }
        : storageAuth
      setAuthState(finalAuth)
      setIsChecking(false)
    }

    updateState()
    const interval = setInterval(updateState, 50)
    return () => clearInterval(interval)
  }, [storeAccessToken, storeRoleName])

  const { accessToken, roleName, isAuthenticated } = storeAccessToken 
    ? { 
        accessToken: storeAccessToken, 
        roleName: storeRoleName, 
        isAuthenticated: !!storeAccessToken 
      }
    : authState

  useEffect(() => {
    if (isChecking) return

    if (requireGuest && isAuthenticated && accessToken) {
      if (roleName === "super_admin") {
        router.replace("/super-admin/dashboard")
      } else {
        router.replace("/dashboard")
      }
      return
    }

    if (requireAuth && !isAuthenticated) {
      router.replace("/login")
      return
    }

    if (requireSuperAdmin) {
      if (!isAuthenticated) {
        router.replace("/login")
        return
      }
      if (roleName !== "super_admin") {
        router.replace("/dashboard")
        return
      }
    }
  }, [isAuthenticated, roleName, isChecking, requireAuth, requireSuperAdmin, requireGuest, router])

  if (isChecking) {
    return null
  }

  if (requireGuest && isAuthenticated) {
    return null
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (requireSuperAdmin && (!isAuthenticated || roleName !== "super_admin")) {
    return null
  }

  return <>{children}</>
}
