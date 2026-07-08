import { IconArrowRight, IconLock } from '@tabler/icons-react'
import Link from 'next/link'

import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  transitionBgColor,
  transitionCardHover,
} from '@/src/lib/design/classes'
import {
  getActiveCase,
  getSubscriberProgress,
  listClues,
} from '@/src/lib/domain/repositories'
import {
  formatContentStatus,
  formatDate,
  formatPercent,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

const statusTone: Record<string, string> = {
  liberado: 'text-(--teal) border-(--teal)/30 bg-(--teal)/8',
  bloqueado: 'text-(--red) border-(--red)/25 bg-(--red)/6',
  em_breve: 'text-(--ink-mute) border-(--ink)/15 bg-(--ink)/5',
}

export default async function ConteudosPage() {
  const activeCase = await getActiveCase()
  const clues = await listClues(activeCase?.id)
  const progress = activeCase ? await getSubscriberProgress(activeCase.id) : null

  return (
    <div>
      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Arquivo do assinante
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        Conteúdos exclusivos
      </h1>
      {activeCase ? (
        <p className="mt-2 text-sm/6 text-(--ink-mute)">
          {activeCase.description}
        </p>
      ) : null}

      {progress ? (
        <div
          className={`mt-6 ${dossierCardSurface} ${cardShadowBase} border-2 border-(--purple)/25 p-5`}
        >
          <div className="flex items-center justify-between border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Progresso do caso
            </h3>
            <span
              className={`font-semibold text-(--ink) ${fontHeading} text-sm`}
            >
              {progress.collectedClues}/{progress.totalClues} pistas ·{' '}
              {formatPercent(progress.percentComplete)}
            </span>
          </div>
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-(--paper-soft)">
              <div
                className="h-full rounded-full bg-linear-to-r from-(--red) to-(--amber)"
                style={{ width: `${progress.percentComplete}%` }}
              />
            </div>
            <p
              className={`mt-3 text-[11px] tracking-[0.12em] text-(--ink-mute) uppercase ${fontMono}`}
            >
              {progress.liveEventTitle} — {formatDate(progress.liveEventDate)}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-8 space-y-3">
        {clues.map((clue) => {
          const blocked = clue.status === 'bloqueado'
          const tone =
            statusTone[clue.status] ??
            'text-(--ink-mute) border-(--ink)/15 bg-(--ink)/5'
          return (
            <Link
              key={clue.id}
              href={`/cliente/conteudos/${clue.slug}`}
              className={`group flex items-center justify-between gap-3 ${dossierCardSurface} ${cardShadowBase} p-5 ${transitionCardHover} hover:-translate-y-0.5 hover:shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3),inset_0_0_0_1px_rgba(255,255,255,0.6)]`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] tracking-[0.16em] text-(--ink-mute) uppercase ${fontMono}`}
                  >
                    CICLO {clue.cycleNumber}
                  </span>
                  <span
                    className={cn(
                      'rounded-[2px] border px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase',
                      tone,
                    )}
                  >
                    {formatContentStatus(clue.status)}
                  </span>
                </div>
                <p
                  className={`mt-2 text-base font-semibold text-(--ink) ${fontHeading}`}
                >
                  {clue.title}
                </p>
              </div>
              {blocked ? (
                <IconLock className="size-5 shrink-0 text-(--red)" />
              ) : (
                <IconArrowRight
                  className={`size-4 shrink-0 text-(--ink-mute) ${transitionBgColor} group-hover:text-(--red)`}
                />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
