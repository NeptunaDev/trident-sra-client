"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormError } from "@/components/ui/form-error"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { UseFormRegisterReturn, FieldError } from "react-hook-form"
import { RegisterFormData } from "@/lib/auth/register.schema"
import { translations, getLanguage, type Language } from "@/lib/i18n"
import { useState, useEffect } from "react"

interface RegisterFormFieldProps {
  id: string
  label: string
  tooltip: string
  type?: string
  placeholder?: string
  register: UseFormRegisterReturn
  error?: FieldError
  className?: string
  showValidation?: boolean
  validationMessage?: React.ReactNode
  children?: React.ReactNode
}

export function RegisterFormField({
  id,
  label,
  tooltip,
  type = "text",
  placeholder,
  register,
  error,
  className,
  showValidation,
  validationMessage,
  children,
}: RegisterFormFieldProps) {
  const [lang, setLang] = useState<Language>("en")
  const t = translations[lang]

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center gap-2">
          <Label htmlFor={id} className="text-sm font-medium text-white">
            {label}
          </Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="text-[#5bc2e7] hover:text-[#4ba8d1] transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        error={!!error}
        className={className || "bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"}
      />
      {showValidation && validationMessage && !error && (
        <div className="text-xs text-[#00ff88]">
          {validationMessage}
        </div>
      )}
      {children}
      <FormError message={error?.message} />
    </div>
  )
}
