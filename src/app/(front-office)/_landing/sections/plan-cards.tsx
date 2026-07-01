import { IconArrowRight, IconCheck, IconStarFilled } from '@tabler/icons-react'
import Link from 'next/link'

import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import {
  arrowIconClass,
  fontHeading,
  fontMono,
  fontType,
  sectionFrame,
  transitionBgColor,
} from '@/src/lib/design/classes'

export function PlanCards() {
  return (
    <section id="planos" className={`${sectionFrame} pt-24 pb-6`}>
      <div className="mb-12 text-center">
        <SectionEyebrow>04 — Escolha seu plano</SectionEyebrow>
        <h2
          className={`m-0 mx-auto max-w-[580px] text-[clamp(30px,3.8vw,48px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
        >
          Entre pro clube. O próximo caso já está te esperando.
        </h2>
      </div>
      <div className="mx-auto grid max-w-[840px] grid-cols-2 items-start gap-6 max-[860px]:grid-cols-1">
        <article className="relative mt-[26px] rounded-[14px_14px_16px_16px] border border-[rgba(33,28,24,0.15)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_100px)] px-[30px] pt-[34px] pb-[30px] shadow-[0_16px_34px_-12px_rgba(33,28,24,0.2),inset_0_0_0_1px_rgba(255,255,255,0.5)]">
          <div
            className={`absolute -top-px left-[26px] -translate-y-full rounded-t-[9px] border border-b-0 border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-4 py-[7px] pb-[9px] text-[10.5px] tracking-[0.14em] text-(--ink-mute) uppercase ${fontType}`}
          >
            MENSAL
          </div>
          <div
            className={`mb-[18px] text-[12.5px] tracking-[0.08em] text-(--ink-mute) uppercase ${fontType}`}
          >
            Plano Mensal
          </div>
          <div className="mb-1.5 flex items-end gap-1.5">
            <strong
              className={`text-[48px] leading-[0.9] font-semibold ${fontHeading}`}
            >
              R$ 149,90
            </strong>
            <span
              className={`pb-1.5 text-[13px] text-(--ink-mute) ${fontType}`}
            >
              /mês
            </span>
          </div>
          <p className="m-0 mb-[22px] text-[14px] text-(--ink-mute)">
            Flexível. Cancele quando quiser.
          </p>
          <div className="mb-[22px] h-[1.5px] [background:repeating-linear-gradient(90deg,rgba(33,28,24,0.18)_0,rgba(33,28,24,0.18)_5px,transparent_5px,transparent_9px)]" />
          <FeatureList
            color="#1AA587"
            items={[
              '1 caixa por mês, avançando o caso do ano',
              'Acesso à comunidade de membros',
              'Itens e dossiês exclusivos',
              'Sem fidelidade',
            ]}
          />
          <Link
            href="/assinatura"
            className={`flex w-full items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-transparent px-4 py-[15px] text-[14px] leading-none font-bold tracking-[0.04em] text-(--ink) uppercase no-underline ${transitionBgColor} hover:bg-(--ink) hover:text-[#fbf9f6] ${fontMono}`}
          >
            Assinar mensal
          </Link>
        </article>
        <article className="relative mt-[26px] self-start">
          <div className="absolute inset-0 z-0 translate-y-[-3px] rotate-[-2.5deg] rounded-2xl bg-(--purple-deep) shadow-[0_16px_30px_-16px_rgba(33,28,24,0.4)]" />
          <div
            className={`absolute top-[-29px] left-[30px] z-0 inline-flex origin-bottom-left rotate-[-2.5deg] items-center gap-[7px] rounded-t-[10px] bg-(--purple-deep) px-5 pt-[7px] pb-[26px] text-[11.5px] font-bold tracking-[0.06em] text-[#fbf4e3] uppercase shadow-[0_6px_14px_-8px_rgba(33,28,24,0.4)] ${fontType}`}
          >
            <IconStarFilled size={14} aria-hidden />
            <span>MAIS VANTAJOSO</span>
          </div>
          <div className="relative z-1 rounded-[14px_14px_16px_16px] bg-(--purple) px-[30px] pt-[34px] pb-[30px] text-[#f4efe6] shadow-[0_20px_40px_-14px_rgba(74,69,128,0.55)]">
            <div
              className={`mb-[18px] text-[12.5px] tracking-[0.08em] text-[#f4cf5a] uppercase ${fontType}`}
            >
              Plano Anual
            </div>
            <div className="mb-1.5 flex items-end gap-1.5">
              <strong
                className={`text-[48px] leading-[0.9] font-semibold ${fontHeading}`}
              >
                R$ 129,90
              </strong>
              <span className={`pb-1.5 text-[13px] text-[#d8d6ea] ${fontType}`}>
                /mês
              </span>
            </div>
            <p className="m-0 mb-[22px] text-[14px] text-[#d8d6ea]">
              Cobrado anualmente · economize R$ 240 no ano.
            </p>
            <div className="mb-[22px] h-[1.5px] [background:repeating-linear-gradient(90deg,rgba(255,255,255,0.28)_0,rgba(255,255,255,0.28)_5px,transparent_5px,transparent_9px)]" />
            <FeatureList
              color="#F4CF5A"
              items={[
                'Tudo do plano mensal',
                '2 meses grátis no ano',
                'Brinde de boas-vindas exclusivo',
                'Acesso antecipado às edições especiais',
              ]}
            />
            <Link
              href="/assinatura"
              className={`group flex w-full items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--yellow) px-4 py-[15px] text-[14px] leading-none font-bold tracking-[0.04em] text-(--ink) uppercase no-underline ${transitionBgColor} hover:bg-[#fbf4e3] hover:text-(--purple) ${fontMono}`}
            >
              Assinar anual{' '}
              <IconArrowRight
                size={16}
                stroke={2}
                className={arrowIconClass}
                aria-hidden
              />
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

function FeatureList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="m-0 mb-[26px] flex list-none flex-col gap-[13px] p-0">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-[11px] text-[15px] leading-[1.4]"
        >
          <IconCheck
            size={16}
            stroke={2.5}
            className="mt-0.5 flex-none"
            style={{ color }}
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  )
}
