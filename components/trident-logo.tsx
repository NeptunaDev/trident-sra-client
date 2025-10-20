export function TridentLogo({ className = "", variant = "full" }: { className?: string; variant?: "full" | "icon" }) {
  if (variant === "icon") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tridentGradient" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5BC2E7" />
              <stop offset="100%" stopColor="#11111F" />
            </linearGradient>
          </defs>
          <path d="M16 4 L10 14 L16 12 L22 14 Z" fill="url(#tridentGradient)" />
          <rect x="15" y="12" width="2" height="14" fill="url(#tridentGradient)" />
          <circle cx="16" cy="14" r="2" fill="#5BC2E7" />
        </svg>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tridentGradient" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5BC2E7" />
            <stop offset="100%" stopColor="#11111F" />
          </linearGradient>
        </defs>
        <path d="M16 4 L10 14 L16 12 L22 14 Z" fill="url(#tridentGradient)" />
        <rect x="15" y="12" width="2" height="14" fill="url(#tridentGradient)" />
        <circle cx="16" cy="14" r="2" fill="#5BC2E7" />
      </svg>
      <div className="flex flex-col">
        <span className="font-mono font-bold text-xl tracking-tight text-white">TRIDENT</span>
        <span className="text-xs text-gray-300">by Neptuna</span>
      </div>
    </div>
  )
}
