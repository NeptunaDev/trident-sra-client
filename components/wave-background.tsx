"use client"

import { useEffect, useRef } from "react"

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId: number
    let offset = 0

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "rgba(91, 194, 231, 0.1)"
      ctx.lineWidth = 2

      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        for (let x = 0; x < canvas.width; x++) {
          const y = Math.sin((x + offset + i * 100) * 0.01) * 30 + canvas.height / 2 + i * 50
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      offset += 0.5
      animationFrameId = requestAnimationFrame(drawWave)
    }

    drawWave()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}
