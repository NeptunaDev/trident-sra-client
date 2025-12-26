"use client"

import { useEffect, useState } from "react"
import { WaveBackground } from "@/components/wave-background"
import { TridentLogo } from "@/components/trident-logo"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Shield, Terminal, Users, Eye, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { translations, getLanguage, type Language } from "@/lib/i18n"

export default function LandingPage() {
  const [lang, setLang] = useState<Language>("en")

  useEffect(() => {
    setLang(getLanguage())
  }, [])

  const t = translations[lang]

  const features = [
    {
      icon: Shield,
      title: lang === "en" ? "Secure Access" : "Acceso Seguro",
      description:
        lang === "en"
          ? "Zero-trust architecture with encrypted credentials vault"
          : "Arquitectura zero-trust con bóveda de credenciales encriptadas",
    },
    {
      icon: Terminal,
      title: lang === "en" ? "Command Control" : "Control de Comandos",
      description:
        lang === "en" ? "Real-time command filtering and blocking" : "Filtrado y bloqueo de comandos en tiempo real",
    },
    {
      icon: Users,
      title: lang === "en" ? "Collaborative Sessions" : "Sesiones Colaborativas",
      description:
        lang === "en"
          ? "Multiple users in the same session with role-based access"
          : "Múltiples usuarios en la misma sesión con acceso basado en roles",
    },
    {
      icon: Eye,
      title: lang === "en" ? "Complete Audit" : "Auditoría Completa",
      description:
        lang === "en"
          ? "Session recording and searchable command logs"
          : "Grabación de sesiones y registros de comandos buscables",
    },
  ]

  const benefits = [
    lang === "en" ? "No more shared passwords" : "No más contraseñas compartidas",
    lang === "en" ? "Real-time supervision" : "Supervisión en tiempo real",
    lang === "en" ? "ISO 27001 compliance" : "Cumplimiento ISO 27001",
    lang === "en" ? "Easy deployment" : "Despliegue fácil",
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <WaveBackground />

      {/* Header */}
      <header className="relative z-10 border-b border-[rgba(91,194,231,0.2)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <TridentLogo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-[#5bc2e7] hover:bg-[#1a1a2e]">
                {t.sign_in}
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold">
                {t.get_started}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">{t.hero_title}</h1>
        <p className="text-xl text-[#c0c5ce] mb-8 max-w-2xl mx-auto">{t.hero_subtitle}</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold"
            >
              {t.get_started}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="border-[#5bc2e7] text-[#5bc2e7] hover:bg-[#5bc2e7] hover:text-[#11111f] bg-transparent"
            >
              {t.learn_more}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="glass rounded-lg p-6 hover:border-[#5bc2e7] transition-all">
              <feature.icon className="w-12 h-12 text-[#5bc2e7] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-[#c0c5ce]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="glass rounded-lg p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">
            {lang === "en" ? "Why TRIDENT?" : "¿Por qué TRIDENT?"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#00ff88]" />
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">
          {lang === "en" ? "Ready to get started?" : "¿Listo para comenzar?"}
        </h2>
        <p className="text-xl text-[#c0c5ce] mb-8">
          {lang === "en"
            ? "Join hundreds of teams securing their infrastructure"
            : "Únete a cientos de equipos asegurando su infraestructura"}
        </p>
        <Link href="/register">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold"
          >
            {t.get_started}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(91,194,231,0.2)] py-8">
        <div className="container mx-auto px-4 text-center text-[#c0c5ce]">
          <p>© 2025 TRIDENT by NEPTUNA. {lang === "en" ? "All rights reserved." : "Todos los derechos reservados."}</p>
        </div>
      </footer>
    </div>
  )
}
