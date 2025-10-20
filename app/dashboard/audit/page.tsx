import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Play, Eye, AlertTriangle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AuditPage() {
  const sessions = [
    {
      id: 1,
      date: "Today, January 15",
      time: "14:30 - 15:15",
      connection: "prod-web-01",
      user: "john@company.com",
      commands: 67,
      duration: "45 min",
      blocked: 0,
      status: "completed",
    },
    {
      id: 2,
      date: "Today, January 15",
      time: "10:00 - 10:30",
      connection: "dev-db-02",
      user: "sarah@company.com",
      commands: 23,
      duration: "30 min",
      blocked: 2,
      status: "completed",
    },
    {
      id: 3,
      date: "Yesterday, January 14",
      time: "16:45 - 17:20",
      connection: "staging-api-01",
      user: "mike@company.com",
      commands: 89,
      duration: "35 min",
      blocked: 0,
      status: "completed",
    },
    {
      id: 4,
      date: "Yesterday, January 14",
      time: "09:15 - 10:45",
      connection: "prod-db-master",
      user: "admin@company.com",
      commands: 156,
      duration: "1h 30min",
      blocked: 1,
      status: "completed",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Session History</h1>
          <p className="text-gray-300">View and replay all session recordings</p>
        </div>
        <Button
          variant="outline"
          className="border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] bg-transparent text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)]">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search sessions..."
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

      {/* Sessions List */}
      <div className="space-y-6">
        {sessions.map((session, index) => (
          <div key={session.id}>
            {/* Date Header */}
            {(index === 0 || sessions[index - 1].date !== session.date) && (
              <h3 className="text-lg font-semibold mb-3 text-white">{session.date}</h3>
            )}

            {/* Session Card */}
            <Card className="p-6 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-[#5bc2e7]" />
                    <span className="font-semibold text-lg text-white">{session.time}</span>
                    <span className="text-gray-400">•</span>
                    <span className="font-mono text-[#5bc2e7]">{session.connection}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">User</p>
                      <p className="text-sm font-medium text-white">{session.user}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Commands</p>
                      <p className="text-sm font-medium text-white">{session.commands}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Duration</p>
                      <p className="text-sm font-medium text-white">{session.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {session.blocked > 0 && (
                          <Badge variant="outline" className="border-[#ff6b6b] text-[#ff6b6b] bg-transparent text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {session.blocked} blocked
                          </Badge>
                        )}
                        {session.blocked === 0 && (
                          <Badge variant="outline" className="border-[#00ff88] text-[#00ff88] bg-transparent text-xs">
                            Clean
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] bg-transparent text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] bg-transparent text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f]"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Replay
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
