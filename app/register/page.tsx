"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { WaveBackground } from "@/components/wave-background"
import { TridentLogo } from "@/components/trident-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"
import { RouteGuard } from "@/components/route-guard"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <RouteGuard requireGuest>
      <div className="min-h-screen bg-[#0a0a0f] relative flex items-center justify-center p-4">
      <WaveBackground />

      <div className="w-full max-w-2xl relative z-10">
        <div className="glass rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <TridentLogo className="mb-4" />
            <h1 className="text-2xl font-semibold mb-2 text-white">Create your TRIDENT account</h1>
            <p className="text-sm text-gray-300">
              Step {step} of 3: {step === 1 ? "Account Info" : step === 2 ? "Team Setup" : "Confirmation"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-[#5bc2e7]" : "bg-[rgba(91,194,231,0.3)]"}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-[#5bc2e7]" : "bg-[rgba(91,194,231,0.3)]"}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 3 ? "bg-[#5bc2e7]" : "bg-[rgba(91,194,231,0.3)]"}`} />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullname" className="text-sm font-medium text-white">
                      Full Name
                    </Label>
                    <Input
                      id="fullname"
                      type="text"
                      placeholder="John Doe"
                      className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
                    />
                  </div>

                  {/* Work Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-white">
                      Work Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] font-mono text-white placeholder:text-gray-500"
                    />
                    <p className="text-xs text-[#00ff88] flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Valid email format
                    </p>
                  </div>
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-white">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Acme Inc."
                    className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-[#00ff88]" />
                    </div>
                    <span className="text-xs text-[#00ff88]">Good</span>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-white">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
                  />
                </div>

                {/* Plan Selection */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-white">Plan Selection:</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] cursor-pointer transition-colors">
                      <div className="text-center">
                        <h3 className="font-semibold mb-1 text-white">FREE</h3>
                        <p className="text-2xl font-bold text-[#5bc2e7] mb-1">3</p>
                        <p className="text-xs text-gray-400">users</p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-[#1a1a2e] border-[#5bc2e7] cursor-pointer">
                      <div className="text-center">
                        <h3 className="font-semibold mb-1 text-white">PRO</h3>
                        <p className="text-2xl font-bold text-[#5bc2e7] mb-1">10</p>
                        <p className="text-xs text-gray-400">users</p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] hover:border-[#5bc2e7] cursor-pointer transition-colors">
                      <div className="text-center">
                        <h3 className="font-semibold mb-1 text-white">TEAM</h3>
                        <p className="text-2xl font-bold text-[#5bc2e7] mb-1">50</p>
                        <p className="text-xs text-gray-400">users</p>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#5bc2e7] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#5bc2e7] hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Team Setup</h2>
                <p className="text-gray-300 mb-6">Configure your team settings</p>
                <div className="space-y-2">
                  <Label htmlFor="team-name" className="text-sm font-medium text-white">
                    Team Name
                  </Label>
                  <Input
                    id="team-name"
                    type="text"
                    placeholder="Engineering Team"
                    className="bg-[#1a1a2e] border-[rgba(91,194,231,0.2)] focus:border-[#5bc2e7] text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#00ff88] mx-auto flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-[#11111f]" />
                </div>
                <h2 className="text-xl font-semibold text-white">All Set!</h2>
                <p className="text-gray-300">Your account is ready to use</p>
              </div>
            )}

            {/* Create Account Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#5bc2e7] to-[#4ba8d1] hover:from-[#4ba8d1] hover:to-[#5bc2e7] text-[#11111f] font-semibold"
            >
              {step < 3 ? "Continue" : "Go to Dashboard"}
            </Button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="text-[#5bc2e7] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
      </div>
    </RouteGuard>
  )
}
