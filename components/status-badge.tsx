import { Circle } from "lucide-react"

type Status = "online" | "offline" | "connecting" | "idle"

interface StatusBadgeProps {
  status: Status
  showLabel?: boolean
  className?: string
}

export function StatusBadge({ status, showLabel = true, className = "" }: StatusBadgeProps) {
  const statusConfig = {
    online: { color: "status-online", label: "Online" },
    offline: { color: "status-offline", label: "Offline" },
    connecting: { color: "status-connecting", label: "Connecting" },
    idle: { color: "status-idle", label: "Idle" },
  }

  const config = statusConfig[status]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Circle className={`w-2 h-2 fill-current ${config.color}`} />
      {showLabel && <span className="text-sm">{config.label}</span>}
    </div>
  )
}
