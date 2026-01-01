'use client'

import { useEffect, useRef } from 'react'

interface QRCodeComponentProps {
    value: string
    size?: number
}

export default function QRCodeComponent({
    value,
    size = 200,
}: QRCodeComponentProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        // Simple QR code generator using QR code API
        const generateQR = async () => {
            try {
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
                    value,
                )}`
                const img = new Image()
                img.crossOrigin = 'anonymous'
                img.onload = () => {
                    const canvas = canvasRef.current
                    if (canvas) {
                        const ctx = canvas.getContext('2d')
                        if (ctx) {
                            canvas.width = size
                            canvas.height = size
                            ctx.fillStyle = 'white'
                            ctx.fillRect(0, 0, size, size)
                            ctx.drawImage(img, 0, 0, size, size)
                        }
                    }
                }
                img.src = qrCodeUrl
            } catch (error) {
                console.error('Error generating QR code:', error)
            }
        }

        generateQR()
    }, [value, size])

    return (
        <div className="bg-white p-4 rounded-lg border-2 border-slate-200">
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                className="bg-white"
            />
        </div>
    )
}
