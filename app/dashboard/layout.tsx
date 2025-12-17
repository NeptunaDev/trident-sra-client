"use client"

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { RouteGuard } from "@/components/route-guard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requireAuth>
      <div className="flex h-screen bg-[#0a0a0f]">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </RouteGuard>
  )
}
