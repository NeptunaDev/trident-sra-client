"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { translations, getLanguage, type Language } from "@/lib/i18n"

interface PrivacyPolicyModalProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function PrivacyPolicyModal({ isOpen, setIsOpen }: PrivacyPolicyModalProps) {
  const [lang, setLang] = useState<Language>("en")
  const t = translations[lang]

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">{t.privacy_policy_title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-[#c0c5ce]">
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">{t.privacy_section_1_title}</h3>
            <p className="text-sm leading-relaxed">
              {t.privacy_section_1_content}
            </p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">{t.privacy_section_2_title}</h3>
            <p className="text-sm leading-relaxed">
              {t.privacy_section_2_content}
            </p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">{t.privacy_section_3_title}</h3>
            <p className="text-sm leading-relaxed">
              {t.privacy_section_3_content}
            </p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">{t.privacy_section_4_title}</h3>
            <p className="text-sm leading-relaxed">
              {t.privacy_section_4_content}
            </p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">{t.privacy_section_5_title}</h3>
            <p className="text-sm leading-relaxed">
              {t.privacy_section_5_content}
            </p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">{t.privacy_section_6_title}</h3>
            <p className="text-sm leading-relaxed">
              {t.privacy_section_6_content}
            </p>
          </section>
          <p className="text-xs text-gray-500 mt-6">
            {t.last_updated} {new Date().toLocaleDateString()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
