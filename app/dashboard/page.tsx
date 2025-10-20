"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Server, Activity, Terminal, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { translations, getLanguage, type Language } from "@/lib/i18n"

export default function DashboardPage() {
  const router = useRouter()
  const [lang, setLang] = useState<Language>("en")
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }
    setUserName(user.name)
    setLang(getLanguage())
  }, [router])

  const t = translations[lang]

  const stats = [
    { label: t.hosts, value: "12", icon: Server, color: "text-[#5bc2e7]" },
    { label: t.active, value: "3", icon: Activity, color: "text-[#00ff88]" },
    { label: t.today, value: "45", icon: Terminal, color: "text-[#9b59b6]" },
    { label: t.time, value: "2.3h", icon: Clock, color: "text-[#c0c5ce]" },
  ]

  const recentConnections = [
    {
      name: "prod-web-01",
      type: "SSH",
      ip: "192.168.1.10",
      status: "online" as const,
      lastAccess: "2 min ago",
    },
    {
      name: "dev-db-02",
      type: "SSH",
      ip: "10.0.0.5",
      status: "online" as const,
      lastAccess: "15 min ago",
    },
    {
      name: "test-app-01",
      type: "RDP",
      ip: "172.16.0.20",
      status: "offline" as const,
      lastAccess: "1 hour ago",
    },
  ]

  const teamActivity = [
    {
      user: "Sarah",
      action: lang === "en" ? "is in" : "está en",
      connection: "prod-web-01",
      time: lang === "en" ? "Started 5 min ago" : "Iniciado hace 5 min",
      canJoin: true,
    },
    {
      user: "Mike",
      action: lang === "en" ? "finished" : "terminó",
      connection: "dev-db-02",
      time: lang === "en" ? "Duration: 45 min" : "Duración: 45 min",
      canJoin: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">
          {t.welcome_back}, {userName}!
        </h1>
        <p className="text-[#c0c5ce]">{t.whats_happening}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#c0c5ce] mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Connections */}
      <Card className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">{t.recent_connections}</h2>
          <Link href="/dashboard/connections">
            <Button variant="ghost" size="sm" className="text-[#5bc2e7] hover:text-[#5bc2e7] hover:bg-[#11111f]">
              {t.view_all}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {recentConnections.map((conn) => (
            <div
              key={conn.name}
              className="flex items-center justify-between p-4 rounded-lg bg-[#11111f] border border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] transition-colors"
            >
              <div className="flex items-center gap-4">
                <StatusBadge status={conn.status} showLabel={false} />
                <div>
                  <h3 className="font-semibold text-white">{conn.name}</h3>
                  <p className="text-sm text-[#c0c5ce]">
                    {conn.type} • {conn.ip}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#c0c5ce]">{conn.lastAccess}</span>
                <Link href={`/session/${conn.name}`}>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f]"
                    disabled={conn.status === "offline"}
                  >
                    {t.connect}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Activity Feed */}
      <Card className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <h2 className="text-xl font-semibold mb-4 text-white">{t.team_activity}</h2>
        <div className="space-y-3">
          {teamActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-[#11111f] border border-[rgba(91,194,231,0.2)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5bc2e7] flex items-center justify-center text-[#11111f] font-semibold">
                  {activity.user[0]}
                </div>
                <div>
                  <p className="text-sm text-white">
                    <span className="font-semibold">{activity.user}</span> {activity.action}:{" "}
                    <span className="text-[#5bc2e7]">{activity.connection}</span>
                  </p>
                  <p className="text-xs text-[#c0c5ce]">{activity.time}</p>
                </div>
              </div>
              {activity.canJoin ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#9b59b6] text-[#9b59b6] hover:bg-[#9b59b6] hover:text-white bg-transparent"
                >
                  {t.join_session}
                </Button>
              ) : (
                <Button size="sm" variant="ghost" className="text-[#c0c5ce] hover:text-white hover:bg-[#1a1a2e]">
                  {t.view_log}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
