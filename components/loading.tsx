"use client"

import { useloadingStore } from '@/store/loadingStore'
import { Loader2 } from 'lucide-react'
import React from 'react'

export default function Loading() {
  const { isLoading } = useloadingStore()
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] bg-[#0b0b14]/40 backdrop-blur-md">
      <div className="w-10 h-10 bg-white rounded-full animate-spin">
        <Loader2 className="w-10 h-10 text-black" />
      </div>
    </div>
  )
}
