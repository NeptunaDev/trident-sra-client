"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/status-badge"
import { Plus, Search, Filter, MoreVertical, Play, Settings, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NewConnectionForm } from "@/components/new-connection-form"

export default function ConnectionsPage() {
  const router = useRouter()
  const [isNewConnectionOpen, setIsNewConnectionOpen] = useState(false)

  const connections = [
    {
      id: 1,
      name: "prod-web-01",
      type: "SSH",
      ip: "192.168.1.10",
      port: 22,
      status: "online" as const,
      lastAccess: "2 min ago",
      user: "John Doe",
    },
    {
      id: 2,
      name: "dev-db-02",
      type: "SSH",
      ip: "10.0.0.5",
      port: 22,
      status: "online" as const,
      lastAccess: "15 min ago",
      user: "Sarah Smith",
    },
    {
      id: 3,
      name: "test-app-01",
      type: "RDP",
      ip: "172.16.0.20",
      port: 3389,
      status: "offline" as const,
      lastAccess: "1 hour ago",
      user: "Mike Johnson",
    },
    {
      id: 4,
      name: "staging-api-01",
      type: "SSH",
      ip: "10.0.1.15",
      port: 22,
      status: "idle" as const,
      lastAccess: "3 hours ago",
      user: "John Doe",
    },
    {
      id: 5,
      name: "prod-db-master",
      type: "SSH",
      ip: "192.168.1.50",
      port: 22,
      status: "online" as const,
      lastAccess: "5 min ago",
      user: "Admin",
    },
    {
      id: 6,
      name: "dev-win-01",
      type: "RDP",
      ip: "10.0.2.100",
      port: 3389,
      status: "connecting" as const,
      lastAccess: "Just now",
      user: "Sarah Smith",
    },
  ]

  const handleConnect = (id: number, type: string) => {
    router.push(`/dashboard/connections/${type.toLowerCase()}/${id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Connections</h1>
          <p className="text-gray-300">Manage all your remote connections</p>
        </div>
        <Dialog open={isNewConnectionOpen} onOpenChange={setIsNewConnectionOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              New Connection
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Connection</DialogTitle>
            </DialogHeader>
            <NewConnectionForm onClose={() => setIsNewConnectionOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search connections..."
              className="pl-10 bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
            />
          </div>
          <Button
            variant="outline"
            className="border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] bg-transparent text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((conn) => (
          <Card
            key={conn.id}
            className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#11111f] flex items-center justify-center border border-[rgba(91,194,231,0.2)]">
                  <span className="font-mono text-sm text-[#5bc2e7]">{conn.type}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">{conn.name}</h3>
                  <StatusBadge status={conn.status} />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#11111f] border-[rgba(91,194,231,0.2)]">
                  <DropdownMenuItem className="hover:bg-[#1a1a2e] hover:text-[#5bc2e7]">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#1a1a2e] hover:text-[#ff6b6b]">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">IP Address</span>
                <span className="font-mono text-white">{conn.ip}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Port</span>
                <span className="font-mono text-white">{conn.port}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last Access</span>
                <span className="text-white">{conn.lastAccess}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">User</span>
                <span className="text-white">{conn.user}</span>
              </div>
            </div>

            <Button
              onClick={() => handleConnect(conn.id, conn.type)}
              className="w-full bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f]"
              disabled={conn.status === "offline"}
            >
              <Play className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {connections.length === 0 && (
        <Card className="p-12 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#11111f] flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-[#5bc2e7]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">No connections yet</h3>
            <p className="text-gray-300 mb-6">Get started by adding your first remote host</p>
            <Button className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f]">
              <Plus className="w-4 h-4 mr-2" />
              Add First Host
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
