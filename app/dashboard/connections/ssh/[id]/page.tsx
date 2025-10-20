"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Terminal, Users, Activity, AlertTriangle } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function SSHSessionPage() {
  const params = useParams()
  const router = useRouter()
  const terminalRef = useRef<HTMLDivElement>(null)
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState<string[]>([
    "Welcome to TRIDENT SSH Terminal",
    "Connected to prod-web-01 (192.168.1.10)",
    "Type 'help' for available commands",
    "",
  ])

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!command.trim()) return

    const newOutput = [...output, `$ ${command}`]

    // Simulate command responses
    if (command === "help") {
      newOutput.push("Available commands: ls, pwd, whoami, date, clear, exit")
    } else if (command === "ls") {
      newOutput.push("app  config  data  logs  scripts")
    } else if (command === "pwd") {
      newOutput.push("/home/user")
    } else if (command === "whoami") {
      newOutput.push("admin")
    } else if (command === "date") {
      newOutput.push(new Date().toString())
    } else if (command === "clear") {
      setOutput([""])
      setCommand("")
      return
    } else if (command === "exit") {
      router.push("/dashboard/connections")
      return
    } else {
      newOutput.push(`Command '${command}' executed successfully`)
    }

    newOutput.push("")
    setOutput(newOutput)
    setCommand("")
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  return (
    <div className="space-y-6">
      {/* Header */}
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
            <h1 className="text-2xl font-bold text-white">SSH Session #{params.id}</h1>
            <p className="text-gray-300">prod-web-01 • 192.168.1.10:22</p>
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
        {/* Terminal */}
        <div className="lg:col-span-3">
          <Card className="bg-black border-[rgba(91,194,231,0.2)] overflow-hidden">
            <div className="bg-[#1a1a2e] px-4 py-2 flex items-center justify-between border-b border-[rgba(91,194,231,0.2)]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00ff88]" />
                <span className="text-sm font-mono text-white">Terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
                <span className="text-xs text-gray-300">Connected</span>
              </div>
            </div>
            <div ref={terminalRef} className="p-4 h-[500px] overflow-y-auto font-mono text-sm text-[#00ff88] bg-black">
              {output.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              <form onSubmit={handleCommand} className="flex items-center gap-2">
                <span className="text-[#5bc2e7]">$</span>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#00ff88]"
                  autoFocus
                />
              </form>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Session Info */}
          <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#5bc2e7]" />
              Session Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="font-mono text-white">00:15:32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Commands</span>
                <span className="font-mono text-white">{output.filter((l) => l.startsWith("$")).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User</span>
                <span className="text-white">admin</span>
              </div>
            </div>
          </Card>

          {/* Viewers */}
          <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5bc2e7]" />
              Viewers (2)
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#5bc2e7] flex items-center justify-center text-xs font-semibold text-[#11111f]">
                  JD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">Admin</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#9b59b6] flex items-center justify-center text-xs font-semibold text-white">
                  SS
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Sarah Smith</p>
                  <p className="text-xs text-gray-400">Observer</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Alerts */}
          <Card className="p-4 bg-[#1a1a2e] border-[rgba(255,107,107,0.2)]">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#ff6b6b]" />
              Alerts
            </h3>
            <p className="text-sm text-gray-300">No security alerts</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
