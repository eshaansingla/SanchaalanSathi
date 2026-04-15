import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '../components/ui/ToastProvider'
import { AuthProvider } from '../lib/auth'

const font = Outfit({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#115E54',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Sanchaalan Saathi',
  description: 'Emergency intelligence and volunteer coordination platform',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-[#F5F6F1] text-gray-900`}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
