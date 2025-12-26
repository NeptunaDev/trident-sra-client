export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user" | "viewer"
  avatar?: string
}

export function login(email: string, password: string): User | null {
  // Accept any email/password for demo purposes
  if (email && password) {
    const user: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      role: "admin",
    }
    localStorage.setItem("trident_user", JSON.stringify(user))
    return user
  }
  return null
}

export function logout(): void {
  localStorage.removeItem("trident_user")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("trident_user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
