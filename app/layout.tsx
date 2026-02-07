import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { AuthProvider } from './context/AuthContext'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#0f0f1e',
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'PixelMind AI Studio - Professional AI Image Editing',
  description: 'Transform your images with AI. Generate, edit, enhance, and upscale images using advanced AI tools. Subscribe for unlimited creative possibilities.',
  keywords: ['AI image editor', 'image generation', 'background removal', 'upscaling', 'AI tools'],
  openGraph: {
    title: 'PixelMind AI Studio - Professional AI Image Editing',
    description: 'Transform your images with AI-powered tools',
    images: [{ url: '/og-image.jpg' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased dark">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
