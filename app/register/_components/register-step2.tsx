"use client"

import { UseFormRegisterReturn, FieldErrors, UseFormWatch } from "react-hook-form"
import { RegisterFormData } from "@/lib/auth/register.schema"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RegisterFormField } from "./register-form-field"
import { FormError } from "@/components/ui/form-error"
import { translations, getLanguage, type Language } from "@/lib/i18n"
import { useState, useEffect } from "react"

interface RegisterStep2Props {
  register: {
    organization_slug: UseFormRegisterReturn
  }
  errors: FieldErrors<RegisterFormData>
  acceptedTerms: boolean
  onAcceptedTermsChange: (accepted: boolean) => void
  onTermsClick: () => void
  onPrivacyClick: () => void
  isPending: boolean
  onSlugChange?: () => void
}

export function RegisterStep2({
  register,
  errors,
  acceptedTerms,
  onAcceptedTermsChange,
  onTermsClick,
  onPrivacyClick,
  isPending,
  onSlugChange,
}: RegisterStep2Props) {
  const [lang, setLang] = useState<Language>("en")
  const t = translations[lang]

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">{t.organization_setup}</h2>
        <p className="text-gray-300 mb-6">Configure your organization slug</p>
        
        <RegisterFormField
          id="organization_slug"
          label={t.organization_slug}
          tooltip={t.tooltip_organization_slug}
          placeholder="acme-corp"
          register={{
            ...register.organization_slug,
            onChange: (e) => {
              if (onSlugChange) {
                onSlugChange()
              }
              register.organization_slug.onChange(e)
            },
          }}
          error={errors.organization_slug}
          className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500 font-mono"
        />
        <p className="text-xs text-gray-400">
          This will be used in your organization URL. Only lowercase letters, numbers, and hyphens are allowed.
        </p>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox 
          id="terms" 
          className="mt-1"
          checked={acceptedTerms}
          onCheckedChange={(checked) => onAcceptedTermsChange(checked === true)}
        />
        <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
          {t.terms_agreement}{" "}
          <button
            type="button"
            onClick={onTermsClick}
            className="text-[#5bc2e7] hover:underline"
          >
            {t.terms_of_service}
          </button>{" "}
          {t.terms_agreement_and}{" "}
          <button
            type="button"
            onClick={onPrivacyClick}
            className="text-[#5bc2e7] hover:underline"
          >
            {t.privacy_policy}
          </button>
        </label>
      </div>
      {!acceptedTerms && (
        <FormError message={t.must_accept_terms} />
      )}

      <Button
        type="submit"
        disabled={isPending || !acceptedTerms}
        className="w-full bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? t.creating_account : t.create_account}
      </Button>
    </>
  )
}
