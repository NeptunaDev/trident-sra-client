"use client"

import { UseFormRegisterReturn, UseFormWatch, FieldErrors, UseFormTrigger } from "react-hook-form"
import { RegisterFormData } from "@/lib/auth/register.schema"
import { Button } from "@/components/ui/button"
import { RegisterFormField } from "./register-form-field"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { translations, getLanguage, type Language } from "@/lib/i18n"
import { Check, Info } from "lucide-react"
import { useState, useEffect } from "react"

interface RegisterStep1Props {
  register: {
    name: UseFormRegisterReturn
    email: UseFormRegisterReturn
    organization_name: UseFormRegisterReturn
    password: UseFormRegisterReturn
  }
  errors: FieldErrors<RegisterFormData>
  watch: UseFormWatch<RegisterFormData>
  onContinue: () => Promise<void>
}

export function RegisterStep1({ register, errors, watch, onContinue }: RegisterStep1Props) {
  const [lang, setLang] = useState<Language>("en")
  const t = translations[lang]

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RegisterFormField
          id="name"
          label={t.full_name}
          tooltip={t.tooltip_full_name}
          placeholder="John Doe"
          register={register.name}
          error={errors.name}
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor="email" className="text-sm font-medium text-white">
              {t.work_email}
            </label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-[#5bc2e7] hover:text-[#4ba8d1] transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t.tooltip_work_email}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <RegisterFormField
            id="email"
            label=""
            tooltip=""
            type="email"
            placeholder="you@company.com"
            register={register.email}
            error={errors.email}
            className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] font-mono text-white placeholder:text-gray-500"
          >
            {!errors.email && watch("email") && (
              <p className="text-xs text-[#00ff88] flex items-center gap-1">
                <Check className="w-3 h-3" />
                Valid email format
              </p>
            )}
          </RegisterFormField>
        </div>
      </div>

      <RegisterFormField
        id="organization_name"
        label={t.organization_name}
        tooltip={t.tooltip_organization_name}
        placeholder="Acme Corporation"
        register={register.organization_name}
        error={errors.organization_name}
      />

      <RegisterFormField
        id="password"
        label={t.password}
        tooltip={t.tooltip_password}
        type="password"
        placeholder="••••••••"
        register={register.password}
        error={errors.password}
      >
        {!errors.password && watch("password") && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-[#00ff88]" />
            </div>
            <span className="text-xs text-[#00ff88]">Good</span>
          </div>
        )}
      </RegisterFormField>

      <Button
        type="button"
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold"
      >
        {t.continue}
      </Button>
    </>
  )
}
