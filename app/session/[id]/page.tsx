"use client"

import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Circle, Share2, StopCircle, Users, TerminalIcon, Monitor, Eye, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const [isRecording, setIsRecording] = useState(true)
  
  // Unwrap the params Promise
  const { id } = use(params)

  // Detect connection type and extract connection ID from the URL parameter
  const getConnectionInfo = (id: string) => {
    if (id.startsWith('ssh-')) {
      const connectionId = id.replace('ssh-', '')
      return {
        name: `ssh-connection-${connectionId}`,
        type: "SSH",
        icon: TerminalIcon,
        backUrl: "/dashboard/connections/ssh",
        terminalOutput: [
          { type: "command", text: `admin@ssh-connection-${connectionId}:~$ ls -la` },
          { type: "output", text: "drwxr-xr-x 2 admin admin 4096 Jan 15 14:30 ." },
          { type: "output", text: "drwxr-xr-x 5 admin admin 4096 Jan 15 14:25 .." },
          { type: "output", text: "-rw-r--r-- 1 admin admin  220 Jan 15 14:25 .bash_logout" },
          { type: "output", text: "-rw-r--r-- 1 admin admin 3526 Jan 15 14:25 .bashrc" },
          { type: "command", text: `admin@ssh-connection-${connectionId}:~$ cd /var/www` },
          { type: "command", text: `admin@ssh-connection-${connectionId}:/var/www$ pwd` },
          { type: "output", text: "/var/www" },
          { type: "command", text: `admin@ssh-connection-${connectionId}:/var/www$ ` },
        ],
        blockedCommand: "'rm -rf /'"
      }
    } else if (id.startsWith('rdp-')) {
      const connectionId = id.replace('rdp-', '')
      return {
        name: `rdp-connection-${connectionId}`,
        type: "RDP",
        icon: Monitor,
        backUrl: "/dashboard/connections/rdp",
        terminalOutput: [
          { type: "command", text: "C:\\Users\\Administrator>dir" },
          { type: "output", text: " Volume in drive C has no label." },
          { type: "output", text: " Volume Serial Number is 1234-5678" },
          { type: "output", text: "" },
          { type: "output", text: " Directory of C:\\Users\\Administrator" },
          { type: "output", text: "" },
          { type: "output", text: "01/15/2024  02:30 PM    <DIR>          ." },
          { type: "output", text: "01/15/2024  02:30 PM    <DIR>          .." },
          { type: "output", text: "01/15/2024  02:30 PM    <DIR>          Desktop" },
          { type: "command", text: "C:\\Users\\Administrator>cd Desktop" },
          { type: "command", text: "C:\\Users\\Administrator\\Desktop> " },
        ],
        blockedCommand: "'del C:\\*.*'"
      }
    } else if (id.startsWith('vnc-')) {
      const connectionId = id.replace('vnc-', '')
      return {
        name: `vnc-connection-${connectionId}`,
        type: "VNC",
        icon: Eye,
        backUrl: "/dashboard/connections/vnc",
        terminalOutput: [
          { type: "command", text: `ubuntu@vnc-connection-${connectionId}:~$ sudo apt update` },
          { type: "output", text: "Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease" },
          { type: "output", text: "Hit:2 http://archive.ubuntu.com/ubuntu jammy-updates InRelease" },
          { type: "output", text: "Hit:3 http://archive.ubuntu.com/ubuntu jammy-security InRelease" },
          { type: "output", text: "Reading package lists... Done" },
          { type: "output", text: "Building dependency tree... Done" },
          { type: "output", text: "Reading state information... Done" },
          { type: "command", text: `ubuntu@vnc-connection-${connectionId}:~$ ls -la` },
          { type: "output", text: "total 24" },
          { type: "output", text: "drwxr-xr-x 3 ubuntu ubuntu 4096 Jan 15 14:30 ." },
          { type: "command", text: `ubuntu@vnc-connection-${connectionId}:~$ ` },
        ],
        blockedCommand: "'sudo rm -rf /'"
      }
    } else {
      // Default fallback for other IDs (like the original prod-web-01)
      return {
        name: id,
        type: "SSH",
        icon: TerminalIcon,
        backUrl: "/dashboard/connections",
        terminalOutput: [
          { type: "command", text: `admin@${id}:~$ ls -la` },
          { type: "output", text: "drwxr-xr-x 2 admin admin 4096 Jan 15 14:30 ." },
          { type: "output", text: "drwxr-xr-x 5 admin admin 4096 Jan 15 14:25 .." },
          { type: "output", text: "-rw-r--r-- 1 admin admin  220 Jan 15 14:25 .bash_logout" },
          { type: "output", text: "-rw-r--r-- 1 admin admin 3526 Jan 15 14:25 .bashrc" },
          { type: "command", text: `admin@${id}:~$ cd /var/www` },
          { type: "command", text: `admin@${id}:/var/www$ pwd` },
          { type: "output", text: "/var/www" },
          { type: "command", text: `admin@${id}:/var/www$ ` },
        ],
        blockedCommand: "'rm -rf /'"
      }
    }
  }

  const connectionInfo = getConnectionInfo(id)
  const IconComponent = connectionInfo.icon

  const sessionInfo = {
    name: connectionInfo.name,
    type: connectionInfo.type,
    duration: "5:23",
    commands: {
      total: 45,
      safe: 44,
      blocked: 1,
    },
    viewers: [
      { name: "John", isYou: true },
      { name: "Sarah", isYou: false },
    ],
  }

  const terminalOutput = connectionInfo.terminalOutput

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-[#5bc2e7] bg-[#1a1a2e] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href={connectionInfo.backUrl}>
            <Button variant="ghost" size="icon" className="text-white hover:text-[#5bc2e7] hover:bg-[#2a2a3e]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <IconComponent className="w-5 h-5 text-[#5bc2e7]" />
            <div>
              <h1 className="font-semibold text-white">{sessionInfo.name}</h1>
              <p className="text-xs text-[#5bc2e7]">{sessionInfo.type}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className={`border-[rgba(91,194,231,0.2)] ${
              isRecording ? "bg-[#ff6b6b] border-[#ff6b6b] text-white hover:bg-[#ff5555]" : "bg-transparent"
            }`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <Circle className={`w-3 h-3 mr-2 ${isRecording ? "fill-white" : ""}`} />
            {isRecording ? "Recording" : "Record"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#5bc2e7] hover:border-[#4ba8d1] bg-transparent text-[#5bc2e7] hover:bg-[#5bc2e7] hover:text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white bg-transparent"
          >
            <StopCircle className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Terminal Area */}
        <div className="flex-1 flex flex-col p-6">
          {/* Blocked Command Alert */}
          <Alert className="mb-4 bg-[#2a2a3e] border-[#ff6b6b]">
            <AlertTriangle className="w-4 h-4 text-[#ff6b6b]" />
            <AlertDescription className="text-sm text-white">
              Command <span className="font-mono text-[#ff6b6b]">{connectionInfo.blockedCommand}</span> blocked by policy
            </AlertDescription>
          </Alert>

          {/* Terminal */}
          <Card className="flex-1 bg-black border-[#5bc2e7] overflow-hidden flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm leading-relaxed">
              {terminalOutput.map((line, index) => (
                <div key={index} className={line.type === "command" ? "text-[#00ff88]" : "text-white"}>
                  {line.text}
                  {index === terminalOutput.length - 1 && (
                    <span className="inline-block w-2 h-4 bg-[#5bc2e7] ml-1 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Session Info Sidebar */}
        <aside className="w-80 border-l border-[#5bc2e7] bg-[#1a1a2e] p-6 space-y-6">
          {/* Session Info */}
          <Card className="p-4 bg-[#2a2a3e] border-[#5bc2e7]">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
              <IconComponent className="w-4 h-4 text-[#5bc2e7]" />
              Session Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af]">Time</span>
                <span className="font-mono text-white">{sessionInfo.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9ca3af]">Status</span>
                <div className="flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-[#00ff88] text-[#00ff88]" />
                  <span className="text-white">Active</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Viewers */}
          <Card className="p-4 bg-[#2a2a3e] border-[#5bc2e7]">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
              <Users className="w-4 h-4 text-[#9b59b6]" />
              Viewers
            </h3>
            <div className="space-y-2">
              {sessionInfo.viewers.map((viewer, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#5bc2e7] flex items-center justify-center text-[#11111f] text-sm font-semibold">
                    {viewer.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {viewer.name}
                      {viewer.isYou && <span className="text-xs text-[#9ca3af] ml-2">(You)</span>}
                    </p>
                  </div>
                  {!viewer.isYou && <Circle className="w-2 h-2 fill-[#00ff88] text-[#00ff88]" />}
                </div>
              ))}
            </div>
          </Card>

          {/* Commands Stats */}
          <Card className="p-4 bg-[#2a2a3e] border-[#5bc2e7]">
            <h3 className="font-semibold mb-4 text-white">Commands</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#9ca3af]">Total</span>
                <span className="font-semibold text-lg text-white">{sessionInfo.commands.total}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#9ca3af]">Safe</span>
                <span className="text-[#00ff88] font-semibold">{sessionInfo.commands.safe}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#9ca3af]">Blocked</span>
                <span className="text-[#ff6b6b] font-semibold">{sessionInfo.commands.blocked}</span>
              </div>
            </div>
          </Card>

          {/* End Session Button */}
          <Button className="w-full bg-[#ff6b6b] hover:bg-[#ff5555] text-white">
            <StopCircle className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </aside>
      </div>
    </div>
  )
}
