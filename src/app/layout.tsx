import './globals.css'

import type { Metadata } from 'next'
import { Geist_Mono, Handjet, Inter, Libre_Baskerville } from 'next/font/google'

import { SmoothScrollProvider } from '@/src/components/smooth-scroll-provider'
import { ThemeProvider } from '@/src/components/theme-provider'
import { cn } from '@/src/lib/utils'

const libreBaskervilleHeading = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-heading',
})

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const handjet = Handjet({
  subsets: ['latin'],
  variable: '--font-handjet',
})

export const metadata: Metadata = {
  title: {
    default: 'True Crime Club',
    template: '%s | True Crime Club',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        inter.variable,
        libreBaskervilleHeading.variable,
        handjet.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
