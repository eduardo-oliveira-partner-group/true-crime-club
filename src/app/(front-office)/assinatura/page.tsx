import { Archivo, Hanken_Grotesk, Space_Mono } from 'next/font/google'
import type { CSSProperties, ReactNode } from 'react'

import { PlanDossierCard } from '@/src/components/home/plan-dossier-card'
import {
  getDynamicContent,
  getSeoEntry,
  listPlans,
} from '@/src/lib/domain/repositories'
import { buildMetadata } from '@/src/lib/seo'

// Font config
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

export const metadata = buildMetadata({
  path: '/assinatura',
  entry: getSeoEntry('/assinatura'),
})

const tokens = {
  '--paper': '#ede4dd',
  '--paper-soft': '#f5eee4',
  '--card': '#fbf9f6',
  '--ink': '#211c18',
  '--ink-soft': '#3d362f',
  '--ink-mute': '#6e645a',
  '--red': '#c5271f',
  '--red-deep': '#a91d16',
  '--yellow': '#efbc18',
  '--amber': '#e0a50a',
  '--teal': '#1aa587',
  '--teal-deep': '#15735d',
  '--purple': '#5e5ea2',
  '--purple-deep': '#4a4580',
  '--night': '#0e1014',
  '--night-soft': '#16110e',
  '--cream': '#f4ecdc',
} as CSSProperties

const fontHeading =
  '[font-family:var(--design-font-heading),system-ui,sans-serif]'
const fontMono = '[font-family:var(--design-font-mono),monospace]'

const grainNoiseUrl =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function SectionEyebrow({
  children,
  variant = 'red',
  className,
}: {
  children: ReactNode
  variant?: 'red' | 'yellow'
  className?: string
}) {
  return (
    <div
      className={`mb-4 inline-flex items-center gap-2 text-[13px] leading-none font-bold tracking-[0.12em] uppercase before:inline-block before:h-px before:w-[22px] before:shrink-0 before:bg-current before:content-[''] ${fontMono} ${
        variant === 'yellow' ? 'text-(--yellow)' : 'text-(--red)'
      } ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

export default function AssinaturaPage() {
  const plans = listPlans()
  const howItWorks = getDynamicContent('assinatura.how_it_works')

  const fontClassName = `${hankenGrotesk.variable} ${spaceMono.variable} ${archivo.variable}`

  return (
    <div
      className={`relative z-0 min-h-svh overflow-x-clip bg-(--paper) bg-[radial-gradient(rgba(33,28,24,0.06)_0.7px,transparent_0.7px),radial-gradient(rgba(33,28,24,0.035)_0.7px,transparent_0.7px)] bg-size-[5px_5px,5px_5px] bg-position-[0_0,2px_2px] [font-family:var(--design-font-body),system-ui,sans-serif] text-(--ink) antialiased ${fontClassName}`}
      style={tokens}
    >
      {/* Noise overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-3 bg-size-[160px_160px] opacity-[0.07] mix-blend-multiply"
        style={{ backgroundImage: grainNoiseUrl }}
      />
      {/* Grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-3 bg-[linear-gradient(rgba(94,72,48,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(94,72,48,0.05)_1px,transparent_1px),radial-gradient(rgba(94,72,48,0.07)_0.6px,transparent_0.6px)] bg-size-[34px_34px,34px_34px,6px_6px] bg-position-[-1px_-1px,-1px_-1px,0_0] opacity-55 mix-blend-multiply"
      />

      <section className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="mb-10 max-w-2xl space-y-4 text-center md:text-left">
          <SectionEyebrow>Clube de Investigação</SectionEyebrow>
          <h1
            className={`text-3xl font-bold tracking-tight text-(--ink) sm:text-4xl ${fontHeading}`}
          >
            Planos de assinatura
          </h1>
          <p className="mx-auto max-w-2xl text-sm/6 text-(--ink-soft) sm:text-base md:mx-0">
            Escolha entre mensal, anual ou box avulsa. Cobrança no mês da
            compra; envio no mês seguinte.
          </p>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory scrollbar-none gap-5 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 lg:overflow-x-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="w-[85vw] max-w-[360px] shrink-0 snap-center lg:w-auto lg:max-w-none lg:shrink"
            >
              <PlanDossierCard plan={plan} />
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="relative overflow-hidden rounded-[14px_14px_16px_16px] border border-[rgba(33,28,24,0.18)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_120px)] p-6 shadow-[0_18px_40px_-18px_rgba(33,28,24,0.22),inset_0_0_0_1px_rgba(255,255,255,0.5)] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(var(--paper-soft)_0,var(--paper-soft)_31px,rgba(33,28,24,0.05)_31px,rgba(33,28,24,0.05)_32px)] before:opacity-40 before:content-[''] sm:p-8">
          <div
            className={`absolute -top-px left-8 inline-flex -translate-y-full items-center gap-[10px] rounded-t-[10px] border border-b-0 border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-[18px] py-[9px] pb-[11px] text-[11px] tracking-[0.14em] text-(--ink) uppercase ${fontMono}`}
          >
            <span className="font-bold text-(--red)">REGRAS</span>DO ARQUIVO
          </div>
          <span
            className="absolute top-[22px] right-8 size-[14px] rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.45),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0%,var(--pin,var(--red))_55%,rgba(0,0,0,0.4)_100%)]"
            style={{ '--pin': '#efbc18' } as CSSProperties}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <SectionEyebrow>Regras do arquivo</SectionEyebrow>
            <h2
              className={`mt-3 text-xl font-semibold text-(--ink) sm:text-2xl ${fontHeading}`}
            >
              Como funciona
            </h2>
            {howItWorks?.type === 'html' ? (
              <div
                className="prose prose-sm prose-headings:text-(--ink) prose-strong:text-(--ink) prose-a:text-(--red) mt-4 max-w-none text-(--ink-soft)"
                dangerouslySetInnerHTML={{ __html: howItWorks.value }}
              />
            ) : (
              <p className="mt-4 text-sm/6 text-(--ink-soft)">
                {howItWorks?.value}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
