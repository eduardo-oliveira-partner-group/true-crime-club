import { SubscriptionPlansGrid } from '@/src/components/home/plan-dossier-card'
import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { DossierCard } from '@/src/components/public-design/dossier-card'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { fontHeading, sectionFrame } from '@/src/lib/design/classes'
import {
  getDynamicContent,
  getSeoEntry,
  listPlans,
} from '@/src/lib/domain/repositories'
import { buildMetadata } from '@/src/lib/seo'

export const metadata = buildMetadata({
  path: '/assinatura',
  entry: getSeoEntry('/assinatura'),
})

export default async function AssinaturaPage() {
  const plans = await listPlans()
  const howItWorks = getDynamicContent('assinatura.how_it_works')

  return (
    <DesignPageShell showOverlays={false}>
      <section className={`${sectionFrame} relative z-10 py-14 lg:py-20`}>
        <div className="mb-12 text-center">
          <SectionEyebrow>Clube de Investigação</SectionEyebrow>
          <h1
            className={`m-0 mx-auto max-w-[580px] text-[clamp(30px,3.8vw,48px)] leading-[1.02] font-semibold tracking-[-0.015em] text-(--ink) ${fontHeading}`}
          >
            Planos de assinatura
          </h1>
          <p className="mx-auto mt-4 max-w-[580px] text-sm/6 text-(--ink-soft) sm:text-base">
            Escolha entre mensal, anual ou box avulsa. Cobrança no mês da
            compra; envio no mês seguinte.
          </p>
        </div>

        <SubscriptionPlansGrid plans={plans} />
      </section>

      <section className={`${sectionFrame} relative z-10 py-14 lg:py-16`}>
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
