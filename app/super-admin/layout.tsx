import type { ReactNode } from "react"
import { Suspense } from "react"

import { SuperAdminSidebar } from "./_components/super-admin-sidebar"
import { SuperAdminTopbar } from "./_components/super-admin-topbar"

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen bg-[#0b0b14] text-white flex overflow-hidden">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Suspense
          fallback={<div className="h-16 border-b border-[rgba(91,194,231,0.2)] bg-[#11111f]" />}
        >
          <SuperAdminTopbar />
        </Suspense>
        <main className="flex-1 min-w-0 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
