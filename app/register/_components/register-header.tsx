"use client"

import { TridentLogo } from "@/components/trident-logo"
import { translations, getLanguage, type Language } from "@/lib/i18n"
import { useState, useEffect } from "react"

interface RegisterHeaderProps {
  step: number
}

export function RegisterHeader({ step }: RegisterHeaderProps) {
  const [lang, setLang] = useState<Language>("en")
  const t = translations[lang]

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  return (
    <div className="flex flex-col items-center mb-8">
      <TridentLogo className="mb-4" />
      <h1 className="text-2xl font-semibold mb-2 text-white">{t.create_trident_account}</h1>
      <p className="text-sm text-gray-300">
        {t.step_of.replace("{step}", step.toString()).replace("{total}", "2")}: {step === 1 ? t.account_info : t.organization_setup}
      </p>
    </div>
  )
}
