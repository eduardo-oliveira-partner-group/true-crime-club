import type { Metadata } from 'next'
import {
  Archivo,
  Fraunces,
  Hanken_Grotesk,
  Space_Mono,
  Special_Elite,
} from 'next/font/google'

import { buildMetadata } from '@/src/lib/seo'

import { SuggestedLanding } from './suggested-landing'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--design-font-heading',
  display: 'swap',
})

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--design-font-body',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--design-font-mono',
  display: 'swap',
})

const specialElite = Special_Elite({
  subsets: ['latin'],
  weight: '400',
  variable: '--design-font-type',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--design-font-display',
  display: 'swap',
})

export const metadata: Metadata = buildMetadata({
  path: '/design-sugerido',
  title: 'Design sugerido',
  noindex: true,
})

export default function DesignSugeridoPage() {
  return (
    <SuggestedLanding
      fontClassName={`${fraunces.variable} ${hankenGrotesk.variable} ${spaceMono.variable} ${specialElite.variable} ${archivo.variable}`}
    />
  )
}
