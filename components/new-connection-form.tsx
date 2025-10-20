"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Terminal, Monitor, Eye, Wifi } from "lucide-react"
import { Card } from "./ui/card"

interface NewConnectionFormProps {
  onClose: () => void
}

export function NewConnectionForm({ onClose }: NewConnectionFormProps) {
  const [connectionType, setConnectionType] = useState("ssh")
  const [authMethod, setAuthMethod] = useState("key")

  const connectionTypes = [
    { value: "ssh", label: "SSH", icon: Terminal },
    { value: "rdp", label: "RDP", icon: Monitor },
    { value: "vnc", label: "VNC", icon: Eye },
    { value: "telnet", label: "Telnet", icon: Wifi },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Close the dialog after submission
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Connection Type */}
      <div className="space-y-3">
        <Label className="text-white">Connection Type:</Label>
        <div className="grid grid-cols-4 gap-3">
          {connectionTypes.map((type) => (
            <Card
              key={type.value}
              className={`p-4 cursor-pointer transition-colors ${
                connectionType === type.value
                  ? "bg-[#11111f] border-[#5bc2e7]"
                  : "bg-[#11111f] border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7]"
              }`}
              onClick={() => setConnectionType(type.value)}
            >
              <div className="flex flex-col items-center gap-2">
                <type.icon className={`w-6 h-6 ${connectionType === type.value ? "text-[#5bc2e7]" : "text-white"}`} />
                <span className="text-sm font-medium text-white">{type.label}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Basic Information:</h3>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Name
          </Label>
          <Input
            id="name"
            placeholder="prod-web-server"
            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hostname" className="text-white">
              Hostname/IP
            </Label>
            <Input
              id="hostname"
              placeholder="192.168.1.100"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] font-mono text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="port" className="text-white">
              Port
            </Label>
            <Input
              id="port"
              placeholder="22"
              defaultValue="22"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] font-mono text-white placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Authentication:</h3>

        <RadioGroup value={authMethod} onValueChange={setAuthMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="password" id="password" />
            <Label htmlFor="password" className="cursor-pointer text-white">
              Password
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="key" id="key" />
            <Label htmlFor="key" className="cursor-pointer text-white">
              SSH Key
            </Label>
          </div>
        </RadioGroup>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-white">
            Username
          </Label>
          <Input
            id="username"
            placeholder="admin"
            className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] font-mono text-white placeholder:text-gray-500"
          />
        </div>

        {authMethod === "password" ? (
          <div className="space-y-2">
            <Label htmlFor="password-input" className="text-white">
              Password
            </Label>
            <Input
              id="password-input"
              type="password"
              placeholder="••••••••"
              className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="ssh-key" className="text-white">
              SSH Key
            </Label>
            <Select>
              <SelectTrigger className="bg-[#11111f] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white">
                <SelectValue placeholder="Select SSH Key" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
                <SelectItem value="key1">my-key-1</SelectItem>
                <SelectItem value="key2">production-key</SelectItem>
                <SelectItem value="key3">dev-key</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] bg-transparent text-white"
        >
          Test Connection
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f]"
        >
          Save
        </Button>
      </div>
    </form>
  )
}
