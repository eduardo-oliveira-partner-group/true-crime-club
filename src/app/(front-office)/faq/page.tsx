import { IconArrowRight, IconChevronDown } from '@tabler/icons-react'
import Link from 'next/link'

import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { JsonLd } from '@/src/components/seo/json-ld'
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import {
  arrowIconClass,
  cardShadowBase,
  ctaButtonBase,
  dossierCardSurface,
  fontHeading,
  fontType,
  sectionFrame,
  transitionCardHover,
} from '@/src/lib/design/classes'
import { getDynamicContent, getSeoEntry } from '@/src/lib/domain/repositories'
import { buildMetadata } from '@/src/lib/seo'
import { cn } from '@/src/lib/utils'

export const metadata = buildMetadata({
  path: '/faq',
  entry: getSeoEntry('/faq'),
})

const faqItems = [
  {
    code: 'FAQ-01',
    question: 'O que é o True Crime Club?',
    answer:
      'Um clube de assinatura que envia mensalmente uma box temática de true crime com curadoria exclusiva e conteúdo gamificado.',
  },
  {
    code: 'FAQ-02',
    question: 'O que vem na box?',
    answer:
      'Uma seleção surpresa entre itens colecionáveis, papelaria, decoração, moda e conteúdo exclusivo — sem prometer todos os tipos em uma única edição.',
  },
  {
    code: 'FAQ-03',
    question: 'Qual a diferença entre cobrança e envio?',
    answer:
      'A cobrança ocorre no mês da compra. O envio acontece no mês seguinte (ex.: compra em março, despacho em abril).',
  },
  {
    code: 'FAQ-04',
    question: 'Posso cancelar a assinatura?',
    answer:
      'No plano mensal, sim, a qualquer momento. O plano anual possui permanência de 12 meses.',
  },
  {
    code: 'FAQ-05',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Cartão de crédito e Pix (mockados nesta versão de validação).',
  },
]

export default function FaqPage() {
  const intro = getDynamicContent('faq.intro')

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <DesignPageShell showOverlays={false}>
      <JsonLd data={faqJsonLd} />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--paper) py-16 lg:py-24">
        <div className={`${sectionFrame} relative z-10 max-w-3xl`}>
          <ScrollReveal>
            <SectionEyebrow>Dossiê de dúvidas</SectionEyebrow>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <h1
              className={`text-wrap-balance mt-4 text-[clamp(42px,5.8vw,74px)] leading-[0.98] font-bold tracking-[-0.02em] text-(--ink) ${fontHeading}`}
            >
              Perguntas frequentes.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
            <p className="mt-6 text-[18px] leading-[1.65] text-(--ink-soft) sm:text-[19px]">
              {intro?.value ??
                'Respostas para as dúvidas mais comuns sobre o clube de assinatura.'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Accordion / Questions Section */}
      <section className="relative isolate overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--paper-soft) py-16 lg:py-24">
        <div className={`${sectionFrame} max-w-4xl`}>
          <ScrollRevealGroup className="space-y-4" staggerChildren={0.07}>
            {faqItems.map((item) => (
              <ScrollRevealItem key={item.code}>
                <details
                  className={cn(
                    'group relative p-5 transition-all duration-300 sm:p-6',
                    dossierCardSurface,
                    cardShadowBase,
                    transitionCardHover,
                    'hover:-translate-y-0.5 hover:border-(--red)/30 hover:shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3)]',
                  )}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 outline-none [&::-webkit-details-marker]:hidden">
                    <div className="flex items-start gap-4">
                      <span
                        className={`mt-1 text-[11px] font-bold tracking-[0.14em] text-(--red) uppercase ${fontType}`}
                      >
                        {item.code}
                      </span>
                      <span
                        className={`text-base font-semibold tracking-tight text-(--ink) sm:text-lg ${fontHeading}`}
                      >
                        {item.question}
                      </span>
                    </div>
                    <IconChevronDown className="mt-0.5 size-5 shrink-0 text-(--red) transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="mt-4 border-t border-dashed border-[rgba(33,28,24,0.15)] pt-4 pl-[3.8rem] text-[16px] leading-[1.6] text-(--ink-soft) sm:pl-[4.8rem]">
                    {item.answer}
                  </div>
                </details>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-(--card) py-16 text-(--ink) lg:py-24">
        <div className={`${sectionFrame} relative z-10 max-w-3xl text-center`}>
          <ScrollReveal>
            <SectionEyebrow className="justify-center">
              Ainda em dúvida?
            </SectionEyebrow>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <h2
              className={`text-wrap-balance mt-4 text-[clamp(32px,4.5vw,56px)] leading-[1.02] font-semibold tracking-[-0.015em] text-(--ink) ${fontHeading}`}
            >
              Entre no caso. O arquivo está aberto.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-[60ch] text-[17px] leading-[1.6] text-(--ink-soft)">
              Garanta sua vaga no clube e comece a receber pistas, evidências e
              edições exclusivas todo mês.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="mt-8 flex justify-center">
              <Link
                href="/assinatura"
                className={`group ${ctaButtonBase} gap-2 border border-[rgba(33,28,24,0.15)] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:-translate-y-0.5 hover:bg-(--red-deep) hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)]`}
              >
                Garantir minha vaga
                <IconArrowRight
                  size={16}
                  stroke={2}
                  className={arrowIconClass}
                  aria-hidden
                />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </DesignPageShell>
  )
}
