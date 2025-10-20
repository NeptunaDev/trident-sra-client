"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Monitor, Users, Activity } from "lucide-react"

export default function RDPSessionPage() {
  const params = useParams()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/connections")}
            className="text-white hover:text-[#5bc2e7]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">RDP Session #{params.id}</h1>
            <p className="text-gray-300">test-app-01 • 172.16.0.20:3389</p>
          </div>
        </div>
        <Button
          onClick={() => router.push("/dashboard/connections")}
          variant="outline"
          className="border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white"
        >
          Disconnect
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] overflow-hidden">
            <div className="bg-[#11111f] px-4 py-2 flex items-center justify-between border-b border-[rgba(91,194,231,0.2)]">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#5bc2e7]" />
                <span className="text-sm font-mono text-white">Remote Desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
                <span className="text-xs text-gray-300">Connected</span>
              </div>
            </div>
            <div className="aspect-video bg-[#2c2c3e] flex items-center justify-center">
              <div className="text-center">
                <Monitor className="w-16 h-16 text-[#5bc2e7] mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">RDP Session Active</p>
                <p className="text-gray-400 text-sm">Remote desktop connection established</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#5bc2e7]" />
              Session Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="font-mono text-white">00:08:15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Resolution</span>
                <span className="font-mono text-white">1920x1080</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User</span>
                <span className="text-white">administrator</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5bc2e7]" />
              Viewers (1)
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#5bc2e7] flex items-center justify-center text-xs font-semibold text-[#11111f]">
                MJ
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Mike Johnson</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
