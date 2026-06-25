import { PlanDossierCard } from '@/src/components/home/plan-dossier-card'
import { getDynamicContent, listPlans } from '@/src/lib/domain/repositories'

export default function AssinaturaPage() {
  const plans = listPlans()
  const howItWorks = getDynamicContent('assinatura.how_it_works')

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10 space-y-3 text-center md:text-left">
        <span className="text-xs font-semibold tracking-[0.22em] text-brand-accent uppercase">
          Clube de Investigação
        </span>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Planos de assinatura
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base md:mx-0">
          Escolha entre mensal, anual ou box avulsa. Cobrança no mês da compra;
          envio no mês seguinte.
        </p>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto px-4 pb-6 [-ms-overflow-style:none] sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 lg:overflow-x-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="w-[85vw] max-w-[360px] shrink-0 snap-center lg:w-auto lg:max-w-none lg:shrink"
          >
            <PlanDossierCard plan={plan} />
          </div>
        ))}
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-surface-elevated p-6">
        <h2 className="font-heading text-xl font-semibold">Como funciona</h2>
        {howItWorks?.type === 'html' ? (
          <div
            className="prose prose-sm mt-4 max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: howItWorks.value }}
          />
        ) : (
          <p className="mt-4 text-muted-foreground">{howItWorks?.value}</p>
        )}
      </section>
    </div>
  )
}
