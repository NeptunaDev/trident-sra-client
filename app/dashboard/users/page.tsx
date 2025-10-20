"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreVertical, Mail, Shield, Trash2, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersPage() {
  const [isNewUserOpen, setIsNewUserOpen] = useState(false)

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@company.com",
      role: "Admin",
      status: "active",
      lastActive: "2 min ago",
      sessions: 45,
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@company.com",
      role: "Technician",
      status: "active",
      lastActive: "15 min ago",
      sessions: 32,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@company.com",
      role: "Observer",
      status: "inactive",
      lastActive: "2 hours ago",
      sessions: 18,
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@company.com",
      role: "Technician",
      status: "active",
      lastActive: "5 min ago",
      sessions: 67,
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@company.com",
      role: "Admin",
      status: "active",
      lastActive: "1 hour ago",
      sessions: 89,
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "border-[#5bc2e7] text-[#5bc2e7]"
      case "Technician":
        return "border-[#00ff88] text-[#00ff88]"
      case "Observer":
        return "border-[#9b59b6] text-[#9b59b6]"
      default:
        return "border-gray-400 text-gray-400"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Users</h1>
          <p className="text-gray-300">Manage team members and their permissions</p>
        </div>
        <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
            <DialogHeader>
              <DialogTitle className="text-white">Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="user-name"
                  placeholder="John Doe"
                  className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email" className="text-white">
                  Email
                </Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="john@company.com"
                  className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role" className="text-white">
                  Role
                </Label>
                <Select defaultValue="technician">
                  <SelectTrigger className="bg-[#11111f] border-[rgba(91,194,231,0.2)] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#11111f] border-[rgba(91,194,231,0.2)]">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="observer">Observer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewUserOpen(false)}
                className="border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] bg-transparent text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setIsNewUserOpen(false)}
                className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f]"
              >
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users..."
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
          <p className="text-sm text-gray-400 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </Card>
        <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
          <p className="text-sm text-gray-400 mb-1">Active Now</p>
          <p className="text-2xl font-bold text-[#00ff88]">{users.filter((u) => u.status === "active").length}</p>
        </Card>
        <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
          <p className="text-sm text-gray-400 mb-1">Admins</p>
          <p className="text-2xl font-bold text-[#5bc2e7]">{users.filter((u) => u.role === "Admin").length}</p>
        </Card>
        <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
          <p className="text-sm text-gray-400 mb-1">Technicians</p>
          <p className="text-2xl font-bold text-white">{users.filter((u) => u.role === "Technician").length}</p>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[rgba(91,194,231,0.2)]">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">User</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Role</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Last Active</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Sessions</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[rgba(91,194,231,0.1)] hover:bg-[#11111f] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-[#5bc2e7] text-[#11111f] font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={`${getRoleColor(user.role)} bg-transparent`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-[#00ff88]" : "bg-gray-500"}`}
                      />
                      <span className="text-sm text-white capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-300">{user.lastActive}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-mono text-white">{user.sessions}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#2a2a3e] border-[#5bc2e7]">
                          <DropdownMenuItem className="hover:bg-[#1a1a2e] hover:text-[#5bc2e7] text-white focus:text-[#5bc2e7] focus:bg-[#1a1a2e]">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-[#1a1a2e] hover:text-[#ff6b6b] text-white focus:text-[#ff6b6b] focus:bg-[#1a1a2e]">
                            <Trash2 className="w-4 h-4 mr-2" />
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
