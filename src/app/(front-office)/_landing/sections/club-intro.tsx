import { IconRefresh, IconSparkles } from '@tabler/icons-react'

import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import {
  fontHeading,
  fontType,
  sectionFrame,
  transitionChip,
} from '@/src/lib/design/classes'

export function ClubIntro() {
  return (
    <section id="oque" className={`${sectionFrame} pt-24 pb-6`}>
      <div className="relative overflow-hidden rounded-[14px_14px_18px_18px] border border-[rgba(33,28,24,0.18)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_120px)] px-12 pt-[60px] pb-[52px] shadow-[0_18px_40px_-18px_rgba(33,28,24,0.22),inset_0_0_0_1px_rgba(255,255,255,0.5)] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(var(--paper-soft)_0,var(--paper-soft)_31px,rgba(33,28,24,0.05)_31px,rgba(33,28,24,0.05)_32px)] before:opacity-40 before:content-[''] max-[860px]:px-7 max-[860px]:pt-[52px] max-[860px]:pb-[44px]">
        <div
          className={`absolute -top-px left-11 inline-flex -translate-y-full items-center gap-[10px] rounded-t-[10px] border border-b-0 border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-[18px] py-[9px] pb-[11px] text-[11px] tracking-[0.14em] text-(--ink) uppercase ${fontType}`}
        >
          <span className="font-bold text-(--red)">DOSSIÊ</span>O CLUBE
        </div>
        <div
          aria-hidden="true"
          className="absolute top-[18px] right-10 size-4 rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.4),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,#f47878_0%,var(--red)_55%,var(--red-deep)_100%)]"
        />
        <div className="relative z-1 grid grid-cols-[0.85fr_1.15fr] items-start gap-12 max-[860px]:grid-cols-1">
          <div>
            <SectionEyebrow>01 — O que é o Club</SectionEyebrow>
            <h2
              className={`m-0 text-[clamp(30px,3.6vw,46px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
            >
              Não é sobre o crime. É sobre as pessoas por trás dele.
            </h2>
          </div>
          <div>
            <p className="m-0 mb-5 text-[18.5px] leading-[1.6] text-(--ink-soft) first-letter:float-left first-letter:mt-[6px] first-letter:pr-3 first-letter:[font-family:var(--design-font-heading),system-ui,sans-serif] first-letter:text-[3.6em] first-letter:leading-[0.78] first-letter:font-bold first-letter:text-(--red)">
              O TrueCrime Club é um clube de assinatura que transforma o melhor
              do gênero numa experiência física. Cada caso é uma história longa,
              contada ao longo de 12 caixas mensais — depoimentos, mapas,
              fotografias e pistas de um mistério fictício, cuidadosamente
              construído pra te fazer pensar.
            </p>
            <p className="m-0 text-[18.5px] leading-[1.6] text-(--ink-soft)">
              A cada caixa, a história avança. Você conecta os pontos no seu
              tempo, debate as teorias com outros membros e, no fim, desvenda: o
              que realmente aconteceu? Curiosidade sobre o comportamento humano
              — essa é a verdadeira investigação.
            </p>
            <div className="mt-[30px] flex flex-wrap gap-[10px]">
              {[
                'SEM SPOILER, SEM CLICHÊ',
                'HISTÓRIA CONTÍNUA',
                'FEITO PRA COLECIONAR',
              ].map((label, i) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-[7px] rounded-[2px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-[14px] py-2 text-[11.5px] tracking-[0.06em] uppercase ${transitionChip} hover:border-(--red) hover:bg-(--red) hover:text-[#fbf9f6] ${fontType}`}
                >
                  {i === 1 ? (
                    <IconRefresh size={14} stroke={1.75} aria-hidden />
                  ) : null}
                  {i === 2 ? (
                    <IconSparkles size={14} stroke={1.75} aria-hidden />
                  ) : null}
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-10 bottom-7 flex size-[116px] rotate-[-14deg] items-center justify-center rounded-full border-2 border-[rgba(26,165,135,0.7)] text-center text-[11px] font-bold tracking-[0.14em] text-[rgba(26,165,135,0.85)] uppercase opacity-60 shadow-[inset_0_0_0_1px_rgba(26,165,135,0.4)] max-[860px]:hidden ${fontType}`}
        >
          ARQUIVO PRIVADO
        </div>
      </div>
    </section>
  )
}
