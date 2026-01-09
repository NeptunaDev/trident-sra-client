"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { RouteGuard } from "@/components/route-guard"
import { PrivacyPolicyModal } from "@/components/privacy-policy-modal"
import { TermsOfServiceModal } from "@/components/terms-of-service-modal"
import { TooltipProvider } from "@/components/ui/tooltip"
import { register, Register, TokenPayload } from "@/lib/auth"
import { getRegisterSchema, RegisterFormData } from "@/lib/auth/register.schema"
import { generateSlug } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { translations, getLanguage, type Language } from "@/lib/i18n"
import { jwtDecode } from "jwt-decode"
import Link from "next/link"
import { RegisterLayout } from "./_components/register-layout"
import { RegisterHeader } from "./_components/register-header"
import { RegisterProgressIndicator } from "./_components/register-progress-indicator"
import { RegisterStep1 } from "./_components/register-step1"
import { RegisterStep2 } from "./_components/register-step2"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [lang, setLang] = useState<Language>("en")
  const { setSession } = useAuthStore()
  const t = translations[lang]

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(getRegisterSchema()),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      name: "",
      organization_name: "",
      organization_slug: "",
    },
  })

  const organizationName = watch("organization_name")

  // Auto-generate slug when organization name changes (only if not manually edited)
  useEffect(() => {
    if (organizationName && step === 2 && !slugManuallyEdited) {
      const suggestedSlug = generateSlug(organizationName)
      setValue("organization_slug", suggestedSlug, { shouldValidate: false })
    }
  }, [organizationName, step, slugManuallyEdited, setValue])

  // Track if user manually edits the slug
  const slugRegister = registerField("organization_slug")

  const { mutate, isPending } = useMutation<{ access_token: string; refresh_token: string; token_type: string }, Error, Register>({
    mutationFn: register,
    onSuccess: (data) => {
      try {
        const accessTokenDecode = jwtDecode<TokenPayload>(data.access_token)
        const roleName = accessTokenDecode.role_name
        
        setSession({
          roleName,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: { email: watch("email"), name: watch("name") },
        })
        router.push("/dashboard")
      } catch (error) {
        console.error("Error decoding token:", error)
        setSession({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: { email: watch("email"), name: watch("name") },
        })
        router.push("/dashboard")
      }
    },
    onError: (error) => {
      console.error("Registration error:", error)
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    if (step < 2) {
      setStep(step + 1)
      return
    }

    if (!acceptedTerms) {
      return
    }

    const registerData: Register = {
      email: data.email,
      password: data.password,
      name: data.name,
      organization_name: data.organization_name,
      organization_slug: data.organization_slug,
    }

    mutate(registerData)
  }

  const handleStep1Continue = async () => {
    const isValidStep1 = await trigger(["email", "password", "name", "organization_name"])
    if (isValidStep1) {
      setSlugManuallyEdited(false)
      setStep(2)
    }
  }

  return (
    <RouteGuard requireGuest>
      <TooltipProvider>
        <RegisterLayout>
          <RegisterHeader step={step} />
          <RegisterProgressIndicator step={step} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <RegisterStep1
                register={{
                  name: registerField("name"),
                  email: registerField("email"),
                  organization_name: registerField("organization_name"),
                  password: registerField("password"),
                }}
                errors={errors}
                watch={watch}
                onContinue={handleStep1Continue}
              />
            )}

            {step === 2 && (
              <RegisterStep2
                register={{
                  organization_slug: slugRegister,
                }}
                errors={errors}
                acceptedTerms={acceptedTerms}
                onAcceptedTermsChange={setAcceptedTerms}
                onTermsClick={() => setTermsModalOpen(true)}
                onPrivacyClick={() => setPrivacyModalOpen(true)}
                isPending={isPending}
                onSlugChange={() => setSlugManuallyEdited(true)}
              />
            )}

            <p className="text-center text-sm text-gray-300">
              {t.have_account}{" "}
              <Link href="/login" className="text-[#5bc2e7] hover:underline font-medium">
                {t.sign_in}
              </Link>
            </p>
          </form>
        </RegisterLayout>

        <PrivacyPolicyModal isOpen={privacyModalOpen} setIsOpen={setPrivacyModalOpen} />
        <TermsOfServiceModal isOpen={termsModalOpen} setIsOpen={setTermsModalOpen} />
      </TooltipProvider>
    </RouteGuard>
  )
}
