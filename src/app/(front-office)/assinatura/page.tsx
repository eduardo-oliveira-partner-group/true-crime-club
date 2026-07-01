import { Archivo, Hanken_Grotesk, Space_Mono } from 'next/font/google'

import { PlanDossierCard } from '@/src/components/home/plan-dossier-card'
import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { DossierCard } from '@/src/components/public-design/dossier-card'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { fontHeading } from '@/src/lib/design/classes'
import {
  getDynamicContent,
  getSeoEntry,
  listPlans,
} from '@/src/lib/domain/repositories'
import { buildMetadata } from '@/src/lib/seo'

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

export default function AssinaturaPage() {
  const plans = listPlans()
  const howItWorks = getDynamicContent('assinatura.how_it_works')
  const fontClassName = `${hankenGrotesk.variable} ${spaceMono.variable} ${archivo.variable}`

  return (
    <DesignPageShell fontClassName={fontClassName} showOverlays={false}>
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
        <DossierCard
          tabCode="REGRAS"
          tabLabel="DO ARQUIVO"
          showPin
          pinColor="#efbc18"
          className="p-6 sm:p-8"
        >
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
        </DossierCard>
      </section>
    </DesignPageShell>
  )
}
