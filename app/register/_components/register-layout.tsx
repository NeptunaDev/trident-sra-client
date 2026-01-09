"use client"

import { WaveBackground } from "@/components/wave-background"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Home } from "lucide-react"
import Link from "next/link"
import { translations, getLanguage, type Language } from "@/lib/i18n"
import { useState, useEffect } from "react"

interface RegisterLayoutProps {
  children: React.ReactNode
}

export function RegisterLayout({ children }: RegisterLayoutProps) {
  const [lang, setLang] = useState<Language>("en")
  const t = translations[lang]

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative flex items-center justify-center p-4">
      <WaveBackground />

      <Link
        href="/"
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-white hover:text-[#5bc2e7] transition-colors"
      >
        <Home className="w-5 h-5" />
        <span className="text-sm font-medium">{t.back_to_home}</span>
      </Link>

      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="glass rounded-lg p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}
