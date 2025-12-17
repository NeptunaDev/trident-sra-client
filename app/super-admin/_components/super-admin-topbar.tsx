"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Bell, Search, User as UserIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { getCurrentUser } from "@/lib/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

export function SuperAdminTopbar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialQ = searchParams.get("q") ?? ""
  const [q, setQ] = useState(initialQ)
  const debouncedQ = useDebouncedValue(q, 250)

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  })

  useEffect(() => {
    setQ(initialQ)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (debouncedQ.trim()) params.set("q", debouncedQ.trim())
    else params.delete("q")
    router.replace(`${pathname}?${params.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ])

  const notifications = useMemo(
    () => [
      { id: 1, title: "Policy updated", message: "A policy was updated by admin", time: "2m" },
      { id: 2, title: "New organization", message: "A new organization was created", time: "18m" },
    ],
    [],
  )

  return (
    <header className="h-16 border-b border-[rgba(91,194,231,0.2)] bg-[#11111f] flex items-center justify-between px-6 gap-6">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c0c5ce]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search (name/description)…"
            className="pl-10 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-[#6b7280]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-white hover:text-[#5bc2e7] hover:bg-[#1a1a2e]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff6b6b] rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
            <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[rgba(91,194,231,0.2)]" />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="hover:bg-[#11111f] hover:text-[#5bc2e7] flex-col items-start p-3">
                <div className="font-semibold text-white">{n.title}</div>
                <div className="text-sm text-[#c0c5ce]">{n.message}</div>
                <div className="text-xs text-[#6b7280] mt-1">{n.time}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback className="bg-[#5bc2e7] text-[#11111f]">
                  {currentUser?.name?.[0]?.toUpperCase() || <UserIcon className="w-4 h-4" />}
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
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="hover:bg-[#5bc2e7] hover:text-[#11111f] text-white focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
              className="hover:bg-[#5bc2e7] hover:text-[#11111f] text-white focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]"
            >
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

