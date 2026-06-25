import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { getDynamicContent, listPlans } from '@/src/lib/domain/repositories'
import { formatCurrency } from '@/src/lib/formatters'

export default function AssinaturaPage() {
  const plans = listPlans()
  const howItWorks = getDynamicContent('assinatura.how_it_works')

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-10 space-y-2">
        <h1 className="font-heading text-3xl font-semibold">
          Planos de assinatura
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Escolha entre mensal, anual ou box avulsa. Cobrança no mês da compra;
          envio no mês seguinte.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className="rounded-2xl border border-border bg-card p-6"
          >
            {plan.isRecommended ? (
              <span className="rounded-full bg-brand-accent px-2 py-0.5 text-xs text-brand-accent-foreground">
                Recomendado
              </span>
            ) : null}
            <h2 className="mt-3 font-heading text-xl font-semibold">
              {plan.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.description}
            </p>
            <p className="mt-4 text-2xl font-semibold">
              {plan.pricePerMonth
                ? `${formatCurrency(plan.pricePerMonth)}/mês`
                : formatCurrency(plan.price)}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full">
              <Link href={`/checkout?plano=${plan.slug}`}>Escolher plano</Link>
            </Button>
          </article>
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
