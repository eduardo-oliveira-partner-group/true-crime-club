import { Archivo, Hanken_Grotesk, Space_Mono } from 'next/font/google'

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

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--design-font-heading',
  display: 'swap',
})

/** Apply on the Front Office shell so header, footer, and pages share DESIGN.md fonts. */
export const designFontClassName = `${hankenGrotesk.variable} ${spaceMono.variable} ${archivo.variable}`
