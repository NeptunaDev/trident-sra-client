"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Upload, Save, User, Mail, Shield, Calendar } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

export default function ProfilePage() {
  const user = getCurrentUser()

  const userData = {
    name: user?.name || "John Doe",
    email: user?.email || "john@company.com",
    role: "Administrator",
    memberSince: "January 1, 2024",
    avatar: "JD",
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">User Profile</h1>
        <p className="text-gray-300">Manage your personal information and account details</p>
      </div>

      {/* Profile Information */}
      <Card className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-[#5bc2e7]" />
          <h2 className="text-xl font-semibold text-white">Personal Information</h2>
        </div>

        <div className="flex items-start gap-6 mb-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-[#5bc2e7] text-[#11111f] text-2xl">
                {userData.avatar}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] bg-transparent text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  defaultValue={userData.name}
                  className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  defaultValue={userData.email}
                  className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] font-mono text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              <textarea
                id="bio"
                placeholder="Tell us about yourself..."
                className="w-full h-24 px-3 py-2 bg-[#11111f] border border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] rounded-md text-white placeholder:text-gray-500 resize-none"
              />
            </div>
          </div>
        </div>

        <Button className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f]">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </Card>

      {/* Account Information */}
      <Card className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-[#5bc2e7]" />
          <h2 className="text-xl font-semibold text-white">Account Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Role
              </Label>
              <Input
                id="role"
                defaultValue={userData.role}
                disabled
                className="bg-[#11111f] border-[rgba(91,194,231,0.2)] opacity-50 text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-since" className="text-white">
                Member Since
              </Label>
              <Input
                id="member-since"
                defaultValue={userData.memberSince}
                disabled
                className="bg-[#11111f] border-[rgba(91,194,231,0.2)] opacity-50 text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="last-login" className="text-white">
                Last Login
              </Label>
              <Input
                id="last-login"
                defaultValue="Today, 9:30 AM"
                disabled
                className="bg-[#11111f] border-[rgba(91,194,231,0.2)] opacity-50 text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-white">
                Timezone
              </Label>
              <Input
                id="timezone"
                defaultValue="UTC-5 (Eastern Time)"
                className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Summary */}
      <Card className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-[#5bc2e7]" />
          <h2 className="text-xl font-semibold text-white">Activity Summary</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#5bc2e7] mb-2">142</div>
            <div className="text-sm text-gray-400">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#00ff88] mb-2">89</div>
            <div className="text-sm text-gray-400">Hours Connected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#9b59b6] mb-2">15</div>
            <div className="text-sm text-gray-400">Days Active</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
