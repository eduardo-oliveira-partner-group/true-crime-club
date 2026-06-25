import Image from 'next/image'

import plansDossierPlate from '@/src/assets/images/home/plans-dossier-plate.png'
import { PlanDossierCard } from '@/src/components/home/plan-dossier-card'
import { getDynamicContent, listPlans } from '@/src/lib/domain/repositories'

export default function AssinaturaPage() {
  const plans = listPlans()
  const howItWorks = getDynamicContent('assinatura.how_it_works')

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#0b0908]">
        <Image
          src={plansDossierPlate}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center brightness-[0.42] saturate-[0.78]"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_18%,rgba(216,65,50,0.14),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(215,181,109,0.12),transparent_28%),linear-gradient(180deg,rgba(11,9,8,0.88)_0%,rgba(11,9,8,0.62)_42%,rgba(11,9,8,0.9)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.032)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.032)_1px,transparent_1px)] bg-size-[56px_56px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="mb-10 max-w-2xl space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center gap-4 md:justify-start">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#d7b56d] uppercase">
                Clube de Investigação
              </p>
              <span className="hidden h-px flex-1 bg-[#d7b56d]/45 sm:block" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#fffaf0] sm:text-4xl">
              Planos de assinatura
            </h1>
            <p className="mx-auto max-w-2xl text-sm/6 text-[#d7c9b5] sm:text-base md:mx-0">
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
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#171211]">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[56px_56px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <div className="border border-[#fffaf0]/12 bg-[#0c0a09]/88 p-6 shadow-[0_20px_48px_rgba(0,0,0,0.32)] sm:p-8">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#d7b56d] uppercase">
              Regras do arquivo
            </p>
            <h2 className="mt-3 font-heading text-xl font-semibold text-[#fffaf0] sm:text-2xl">
              Como funciona
            </h2>
            {howItWorks?.type === 'html' ? (
              <div
                className="prose prose-sm prose-invert mt-4 max-w-none text-[#d7c9b5]"
                dangerouslySetInnerHTML={{ __html: howItWorks.value }}
              />
            ) : (
              <p className="mt-4 text-sm/6 text-[#d7c9b5]">
                {howItWorks?.value}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
