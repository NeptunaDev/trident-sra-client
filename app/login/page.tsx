"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WaveBackground } from "@/components/wave-background"
import { TridentLogo } from "@/components/trident-logo"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Circle } from "lucide-react"
import Link from "next/link"
import { Login, login, LoginResponse, TokenPayload } from "@/lib/auth"
import { translations, getLanguage, type Language } from "@/lib/i18n"
import { useMutation } from "@tanstack/react-query"
import { jwtDecode } from "jwt-decode"
import { useloadingStore } from "@/store/loadingStore"
import { useAuthStore } from "@/store/authStore"

export default function LoginPage() {
  const [lang, setLang] = useState<Language>("en")
  const t = translations[lang]
  const { isLoading, setIsLoading } = useloadingStore()
  const setSession = useAuthStore((s) => s.setSession)
  const { isAuthenticated, roleName } = useAuthStore()

  const router = useRouter()
  const [form, setForm] = useState<Login>({
    email: "",
    password: "",
  })

  const { mutate, isPending } = useMutation<LoginResponse, Error, Login>({
    mutationFn: login,
    onSuccess: (data: LoginResponse) => {
      const { access_token, refresh_token } = data
      const accessTokenDecode = jwtDecode<TokenPayload>(access_token)
      const roleName = accessTokenDecode.role_name
      
      setSession({
        roleName,
        accessToken: access_token,
        refreshToken: refresh_token,
        user: { email: form.email },
      })
      
      const authData = {
        state: {
          user: { email: form.email },
          roleName,
          accessToken: access_token,
          refreshToken: refresh_token,
        },
        version: 0,
      }
      localStorage.setItem('auth-storage', JSON.stringify(authData))
      
      setTimeout(() => {
        if (roleName === "super_admin") {
          window.location.href = "/super-admin/dashboard"
        } else {
          window.location.href = "/dashboard"
        }
      }, 50)
    },
    onError: (error: Error) => {
      console.error("Login error:", error)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    mutate(form)
  }

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      if (roleName === "super_admin") {
        router.replace("/super-admin/dashboard")
      } else {
        router.replace("/dashboard")
      }
    }
  }, [isAuthenticated, roleName, router])

  useEffect(() => {
    if (isPending !== isLoading) {
      setIsLoading(isPending)
    }
  }, [isPending])

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative flex items-center justify-center p-4">
      <WaveBackground />

      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-lg p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <TridentLogo className="mb-4" />
            <p className="text-sm text-[#c0c5ce] text-center">
              {lang === "en" ? "Control Every Command" : "Controla Cada Comando"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white">
                {t.email}
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] font-mono text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white">
                {t.password}
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-[#c0c5ce] cursor-pointer">
                  {t.remember_me}
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-[#5bc2e7] hover:underline">
                {t.forgot_password}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold"
            >
              {t.sign_in}
            </Button>

            <p className="text-center text-sm text-[#c0c5ce]">
              {t.no_account}{" "}
              <Link href="/register" className="text-[#5bc2e7] hover:underline font-medium">
                {t.sign_up}
              </Link>
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgba(91,194,231,0.2)]">
            <div className="flex items-center justify-center gap-2 text-xs text-[#c0c5ce]">
              <Circle className="w-2 h-2 fill-[#00ff88] text-[#00ff88]" />
              <span>{lang === "en" ? "All systems operational" : "Todos los sistemas operativos"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
