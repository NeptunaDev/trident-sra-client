"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { getLanguage, setLanguage, type Language } from "@/lib/i18n"

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>("en")

  useEffect(() => {
    setCurrentLang(getLanguage())
  }, [])

  const toggleLanguage = () => {
    const newLang: Language = currentLang === "en" ? "es" : "en"
    setLanguage(newLang)
    setCurrentLang(newLang)
    window.location.reload()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 text-white hover:text-[#5bc2e7] hover:bg-[#1a1a2e]"
    >
      <Globe className="w-4 h-4" />
      <span className="font-mono text-xs uppercase">{currentLang}</span>
    </Button>
  )
}
