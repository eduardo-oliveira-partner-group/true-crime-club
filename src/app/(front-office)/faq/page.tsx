import { IconArrowRight, IconChevronDown } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import previousBoxesBanner from '@/src/assets/images/home/previous-boxes-banner.png'
import { Button } from '@/src/components/ui/button'
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import { getDynamicContent } from '@/src/lib/domain/repositories'

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

  return (
    <div className="bg-[#090807] text-[#fffaf0]">
      <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#090807]">
        <Image
          src={previousBoxesBanner}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-[68%_center] brightness-[0.4] saturate-[0.8]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,8,7,0.98)_0%,rgba(9,8,7,0.86)_42%,rgba(9,8,7,0.5)_72%,rgba(9,8,7,0.42)_100%),linear-gradient(180deg,rgba(9,8,7,0.58)_0%,rgba(9,8,7,0.94)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.04)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.04)_1px,transparent_1px)] bg-size-[42px_42px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <ScrollReveal>
            <div className="flex items-center gap-4">
              <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
                Dossiê de dúvidas
              </p>
              <span className="h-px flex-1 bg-[#d7b56d]/45" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <h1 className="mt-4 max-w-3xl font-heading text-3xl leading-[1.08] font-black tracking-tight text-[#fffaf0] uppercase sm:text-5xl">
              Perguntas frequentes
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
            <p className="mt-4 max-w-2xl text-base/7 text-[#d7c9b5] sm:text-lg/8">
              {intro?.value ??
                'Respostas para as dúvidas mais comuns sobre o clube.'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#0b0908]">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.03)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.03)_1px,transparent_1px)] bg-size-[56px_56px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
          <ScrollRevealGroup className="space-y-3" staggerChildren={0.07}>
            {faqItems.map((item) => (
              <ScrollRevealItem key={item.code}>
                <details className="group border border-[#fffaf0]/12 bg-[#171211] p-5 transition-colors hover:border-[#b98542]/45 sm:p-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="mt-1 font-mono text-[10px] tracking-[0.16em] text-[#bfb4a3] uppercase">
                        {item.code}
                      </span>
                      <span className="font-heading text-base font-semibold tracking-wide text-[#fffaf0] sm:text-lg">
                        {item.question}
                      </span>
                    </div>
                    <IconChevronDown className="mt-0.5 size-5 shrink-0 text-[#d7b56d] transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="mt-4 border-t border-[#fffaf0]/10 pt-4 pl-[4.6rem] text-sm/6 text-[#d7c9b5]">
                    {item.answer}
                  </div>
                </details>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#171211] text-[#fffaf0]">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_40%,rgba(216,65,50,0.12),transparent_34%)]" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
          <ScrollReveal>
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#d7b56d] uppercase">
                Ainda em dúvida?
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Entre no caso. O arquivo está aberto.
              </h2>
              <p className="max-w-xl text-sm/6 text-[#d7c9b5]">
                Garanta sua vaga no clube e comece a receber pistas, evidências e
                edições exclusivas todo mês.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <Button
              asChild
              size="lg"
              className="bg-[#d84132] text-white shadow-[0_0_26px_rgba(216,65,50,0.35)] hover:bg-[#b93227]"
            >
              <Link href="/assinatura">
                Garantir minha vaga
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
