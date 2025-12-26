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
import { login } from "@/lib/auth"
import { translations, getLanguage, type Language } from "@/lib/i18n"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [lang, setLang] = useState<Language>("en")

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  const t = translations[lang]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = login(email, password)
    if (user) {
      router.push("/dashboard")
    } else {
      setError(lang === "en" ? "Invalid credentials" : "Credenciales inválidas")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative flex items-center justify-center p-4">
      <WaveBackground />

      {/* Language Switcher - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-lg p-8 shadow-2xl">
          {/* Logo and Tagline */}
          <div className="flex flex-col items-center mb-8">
            <TridentLogo className="mb-4" />
            <p className="text-sm text-[#c0c5ce] text-center">
              {lang === "en" ? "Control Every Command" : "Controla Cada Comando"}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-[#ff6b6b]/10 border border-[#ff6b6b] text-[#ff6b6b] text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white">
                {t.email}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] font-mono text-white"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white">
                {t.password}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
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

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold"
            >
              {t.sign_in}
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-[#c0c5ce]">
              {t.no_account}{" "}
              <Link href="/register" className="text-[#5bc2e7] hover:underline font-medium">
                {t.sign_up}
              </Link>
            </p>
          </form>

          {/* Status Indicator */}
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
