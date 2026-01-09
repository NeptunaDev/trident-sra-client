"use client"

interface RegisterProgressIndicatorProps {
  step: number
}

export function RegisterProgressIndicator({ step }: RegisterProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-[#5bc2e7]" : "bg-[rgba(91,194,231,0.3)]"}`} />
      <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-[#5bc2e7]" : "bg-[rgba(91,194,231,0.3)]"}`} />
    </div>
  )
}
