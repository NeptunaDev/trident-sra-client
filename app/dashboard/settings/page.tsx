import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Upload, Copy, Trash2, Plus, Shield, Key } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const sshKeys = [
    { id: 1, name: "my-key-1", fingerprint: "SHA256:abc123..." },
    { id: 2, name: "production-key", fingerprint: "SHA256:def456..." },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">User Profile</h1>
        <p className="text-gray-300">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <Card className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <h2 className="text-xl font-semibold mb-6 text-white">Profile Information</h2>

        <div className="flex items-start gap-6 mb-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="bg-[#5bc2e7] text-[#11111f] text-2xl">JD</AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] bg-transparent text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
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
                  defaultValue="John Doe"
                  className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  defaultValue="john@company.com"
                  className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] font-mono text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Role
              </Label>
              <Input
                id="role"
                defaultValue="Administrator"
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
                defaultValue="January 1, 2024"
                disabled
                className="bg-[#11111f] border-[rgba(91,194,231,0.2)] opacity-50 text-gray-400"
              />
            </div>
          </div>
        </div>

        <Button className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f]">
          Save Changes
        </Button>
      </Card>

      {/* SSH Keys */}
      <Card className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#5bc2e7]" />
            <h2 className="text-xl font-semibold text-white">SSH Keys</h2>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] bg-transparent text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add SSH Key
          </Button>
        </div>

        <div className="space-y-3">
          {sshKeys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-4 rounded-lg bg-[#11111f] border border-[rgba(91,194,231,0.2)]"
            >
              <div>
                <p className="font-semibold mb-1 text-white">{key.name}</p>
                <p className="text-sm text-gray-400 font-mono">{key.fingerprint}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="hover:bg-[#1a1a2e] hover:text-[#5bc2e7] text-white">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="hover:bg-[#1a1a2e] hover:text-[#ff6b6b] text-white">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-[#5bc2e7]" />
          <h2 className="text-xl font-semibold text-white">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#11111f] border border-[rgba(91,194,231,0.2)]">
            <div>
              <p className="font-semibold mb-1 text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f]"
            >
              Enable 2FA
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-[#11111f] border border-[rgba(91,194,231,0.2)]">
            <div>
              <p className="font-semibold mb-1 text-white">Change Password</p>
              <p className="text-sm text-gray-400">Update your password regularly</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] bg-transparent text-white"
            >
              Change
            </Button>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <h2 className="text-xl font-semibold mb-6 text-white">Preferences</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme" className="text-base font-semibold text-white">
                Theme
              </Label>
              <p className="text-sm text-gray-400">Choose your interface theme</p>
            </div>
            <Select defaultValue="dark">
              <SelectTrigger className="w-32 bg-[#11111f] border-[#5bc2e7] text-white focus:border-[#4ba8d1]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a3e] border-[#5bc2e7]">
                <SelectItem value="dark" className="text-white hover:bg-[#5bc2e7] hover:text-[#11111f] focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">Dark</SelectItem>
                <SelectItem value="light" className="text-white hover:bg-[#5bc2e7] hover:text-[#11111f] focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">Light</SelectItem>
                <SelectItem value="auto" className="text-white hover:bg-[#5bc2e7] hover:text-[#11111f] focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="font-size" className="text-base font-semibold text-white">
                Terminal Font Size
              </Label>
              <p className="text-sm text-gray-400">Adjust terminal text size</p>
            </div>
            <Select defaultValue="14">
              <SelectTrigger className="w-32 bg-[#11111f] border-[#5bc2e7] text-white focus:border-[#4ba8d1]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a3e] border-[#5bc2e7]">
                <SelectItem value="12" className="text-white hover:bg-[#5bc2e7] hover:text-[#11111f] focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">12px</SelectItem>
                <SelectItem value="14" className="text-white hover:bg-[#5bc2e7] hover:text-[#11111f] focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">14px</SelectItem>
                <SelectItem value="16" className="text-white hover:bg-[#5bc2e7] hover:text-[#11111f] focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">16px</SelectItem>
                <SelectItem value="18" className="text-white hover:bg-[#5bc2e7] hover:text-[#11111f] focus:bg-[#5bc2e7] focus:text-[#11111f] data-[highlighted]:bg-[#5bc2e7] data-[highlighted]:text-[#11111f]">18px</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="recording" className="text-base font-semibold text-white">
                Session Recording
              </Label>
              <p className="text-sm text-gray-400">Automatically record all sessions</p>
            </div>
            <Switch id="recording" defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  )
}
