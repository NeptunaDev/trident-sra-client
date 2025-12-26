"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Bell, User as UserIcon, LogOut, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { LanguageSwitcher } from "./language-switcher"
import { translations, getLanguage, type Language } from "@/lib/i18n"
import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@/lib/user"
import { useAuthStore } from "@/store/authStore"

export function DashboardHeader() {
  const router = useRouter()
  const [showNewConnection, setShowNewConnection] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [lang, setLang] = useState<Language>("en")
  const logout = useAuthStore((state) => state.logout)

  // TODO: Usar is loading
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser
  })

  const t = translations[lang]

  const handleLogout = () => {
    logout()
  }

  const handleProfileClick = () => {
    router.push("/dashboard/profile")
  }

  const handleSettingsClick = () => {
    router.push("/dashboard/settings")
  }

  const notifications = [
    {
      id: 1,
      title: lang === "en" ? "New session started" : "Nueva sesión iniciada",
      message: lang === "en" ? "Sarah connected to prod-web-01" : "Sarah se conectó a prod-web-01",
      time: "2 min ago",
    },
    {
      id: 2,
      title: lang === "en" ? "Command blocked" : "Comando bloqueado",
      message: lang === "en" ? "Dangerous command prevented on dev-db-02" : "Comando peligroso prevenido en dev-db-02",
      time: "15 min ago",
    },
    {
      id: 3,
      title: lang === "en" ? "Session ended" : "Sesión terminada",
      message: lang === "en" ? "Mike disconnected from test-app-01" : "Mike se desconectó de test-app-01",
      time: "1 hour ago",
    },
  ]

  return (
    <header className="h-16 border-b border-[rgba(91,194,231,0.2)] bg-[#11111f] flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c0c5ce]" />
          <Input
            placeholder={lang === "en" ? "Search connections..." : "Buscar conexiones..."}
            className="pl-10 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-[#6b7280]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        <Button
          onClick={() => setShowNewConnection(true)}
          className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.new_connection}
        </Button>

        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-white hover:text-[#5bc2e7] hover:bg-[#1a1a2e]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff6b6b] rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
            <DropdownMenuLabel className="text-white">{t.notifications}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[rgba(91,194,231,0.2)]" />
            {notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className="hover:bg-[#11111f] hover:text-[#5bc2e7] flex-col items-start p-3"
              >
                <div className="font-semibold text-white">{notif.title}</div>
                <div className="text-sm text-[#c0c5ce]">{notif.message}</div>
                <div className="text-xs text-[#6b7280] mt-1">{notif.time}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback className="bg-[#5bc2e7] text-[#11111f]">
                  {currentUser?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#2a2a3e] border-[#5bc2e7]">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold text-white">{currentUser?.name || "User"}</span>
                <span className="text-xs text-[#c0c5ce]">{currentUser?.email || "user@example.com"}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[rgba(91,194,231,0.2)]" />
            <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-[#5bc2e7] hover:text-[#11111f] text-white focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">
              <UserIcon className="w-4 h-4 mr-2" />
              {lang === "en" ? "Profile" : "Perfil"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick} className="hover:bg-[#5bc2e7] hover:text-[#11111f] text-white focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">
              <Settings className="w-4 h-4 mr-2" />
              {t.settings}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[rgba(91,194,231,0.2)]" />
            <DropdownMenuItem onClick={handleLogout} className="hover:bg-[#ff6b6b] hover:text-white text-white focus:bg-[#ff6b6b] focus:text-white data-[highlighted]:bg-[#ff6b6b] data-[highlighted]:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              {t.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showNewConnection} onOpenChange={setShowNewConnection}>
        <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t.new_connection}</DialogTitle>
          </DialogHeader>
          <div className="text-[#c0c5ce]">
            {lang === "en"
              ? "New connection form will be implemented here"
              : "El formulario de nueva conexión se implementará aquí"}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
