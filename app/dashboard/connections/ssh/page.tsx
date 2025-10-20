"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreVertical, Terminal, Clock, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NewConnectionForm } from "@/components/new-connection-form"

export default function SSHConnectionsPage() {
  const router = useRouter()
  const [isNewConnectionOpen, setIsNewConnectionOpen] = useState(false)

  const handleConnect = (connectionId: number) => {
    router.push(`/session/ssh-${connectionId}`)
  }

  const sshConnections = [
    {
      id: 1,
      name: "prod-web-01",
      hostname: "192.168.1.100",
      port: 22,
      username: "admin",
      status: "connected",
      lastConnected: "2 min ago",
      sessions: 45,
    },
    {
      id: 2,
      name: "dev-server-02",
      hostname: "192.168.1.101",
      port: 22,
      username: "developer",
      status: "disconnected",
      lastConnected: "1 hour ago",
      sessions: 12,
    },
    {
      id: 3,
      name: "backup-server",
      hostname: "192.168.1.102",
      port: 22,
      username: "backup",
      status: "connected",
      lastConnected: "5 min ago",
      sessions: 8,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-[#00ff88] text-[#11111f]"
      case "disconnected":
        return "bg-[#ff6b6b] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split("-")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">SSH Connections</h1>
          <p className="text-gray-300">Manage your SSH server connections</p>
        </div>
        <Dialog open={isNewConnectionOpen} onOpenChange={setIsNewConnectionOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add SSH Connection
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Add New SSH Connection</DialogTitle>
            </DialogHeader>
            <NewConnectionForm onClose={() => setIsNewConnectionOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
          <p className="text-sm text-gray-400 mb-1">Total SSH</p>
          <p className="text-2xl font-bold text-white">{sshConnections.length}</p>
        </Card>
        <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
          <p className="text-sm text-gray-400 mb-1">Connected</p>
          <p className="text-2xl font-bold text-[#00ff88]">
            {sshConnections.filter((c) => c.status === "connected").length}
          </p>
        </Card>
        <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
          <p className="text-sm text-gray-400 mb-1">Total Sessions</p>
          <p className="text-2xl font-bold text-[#5bc2e7]">
            {sshConnections.reduce((sum, c) => sum + c.sessions, 0)}
          </p>
        </Card>
        <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
          <p className="text-sm text-gray-400 mb-1">Active Now</p>
          <p className="text-2xl font-bold text-[#9b59b6]">
            {sshConnections.filter((c) => c.status === "connected").length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search SSH connections..."
              className="pl-10 bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-32 bg-[#11111f] border-[rgba(91,194,231,0.2)] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a3e] border-[#5bc2e7]">
              <SelectItem value="all" className="text-white hover:bg-[#5bc2e7] hover:text-[#11111f] focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">All</SelectItem>
              <SelectItem value="connected" className="text-white hover:bg-[#5bc2e7] hover:text-[#11111f] focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">Connected</SelectItem>
              <SelectItem value="disconnected" className="text-white hover:bg-[#5bc2e7] hover:text-[#11111f] focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">Disconnected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Connections Table */}
      <Card className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[rgba(91,194,231,0.2)]">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Connection</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Last Connected</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Sessions</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sshConnections.map((connection) => (
                <tr
                  key={connection.id}
                  className="border-b border-[rgba(91,194,231,0.1)] hover:bg-[#11111f] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#5bc2e7] text-[#11111f] font-semibold">
                          {getInitials(connection.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{connection.name}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Terminal className="w-3 h-3" />
                          {connection.username}@{connection.hostname}:{connection.port}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={`${getStatusColor(connection.status)} border-0`}>
                      {connection.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {connection.lastConnected}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-mono text-white flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {connection.sessions}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleConnect(connection.id)}
                        className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f]"
                      >
                        Connect
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#2a2a3e] border-[#5bc2e7]">
                          <DropdownMenuItem className="hover:bg-[#5bc2e7] hover:text-[#11111f] text-white focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-[#ff6b6b] hover:text-white text-white focus:bg-[#ff6b6b] focus:text-white data-[highlighted]:bg-[#ff6b6b] data-[highlighted]:text-white">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
