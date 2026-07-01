import { IconArrowRight, IconLock } from '@tabler/icons-react'
import Link from 'next/link'

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
  liberado: 'text-[#d7b56d] border-[#d7b56d]/40 bg-[#d7b56d]/10',
  bloqueado: 'text-[#ffb0a5] border-[#d84132]/40 bg-[#d84132]/12',
  em_breve: 'text-[#c8bdad] border-[#fffaf0]/18 bg-[#fffaf0]/5',
}

export default function ConteudosPage() {
  const activeCase = getActiveCase()
  const clues = listClues(activeCase?.id)
  const progress = activeCase ? getSubscriberProgress(activeCase.id) : null

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
        Arquivo do assinante
      </p>
      <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
        Conteúdos exclusivos
      </h1>
      {activeCase ? (
        <p className="mt-2 text-sm/6 text-[#d7c9b5]">
          {activeCase.description}
        </p>
      ) : null}

      {progress ? (
        <div className="mt-6 border border-[#b98542]/45 bg-[#171211] p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
              Progresso do caso
            </span>
            <span className="font-heading font-semibold text-[#fffaf0]">
              {progress.collectedClues}/{progress.totalClues} pistas ·{' '}
              {formatPercent(progress.percentComplete)}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden bg-[#0c0a09]">
            <div
              className="h-full bg-linear-to-r from-[#d84132] to-[#d7b56d]"
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
          <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-[#bfb4a3] uppercase">
            {progress.liveEventTitle} — {formatDate(progress.liveEventDate)}
          </p>
        </div>
      ) : null}

      <div className="mt-8 space-y-3">
        {clues.map((clue) => {
          const blocked = clue.status === 'bloqueado'
          const tone =
            statusTone[clue.status] ??
            'text-[#c8bdad] border-[#fffaf0]/18 bg-[#fffaf0]/5'
          return (
            <Link
              key={clue.id}
              href={`/design-sugerido/cliente/conteudos/${clue.slug}`}
              className="group flex items-center justify-between gap-3 border border-[#fffaf0]/12 bg-[#171211] p-5 transition-all hover:-translate-y-0.5 hover:border-[#b98542]/55 hover:shadow-[0_20px_48px_rgba(0,0,0,0.38)]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-[#bfb4a3] uppercase">
                    CICLO {clue.cycleNumber}
                  </span>
                  <span
                    className={cn(
                      'border px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase',
                      tone,
                    )}
                  >
                    {formatContentStatus(clue.status)}
                  </span>
                </div>
                <p className="mt-2 font-heading text-base font-semibold text-[#fffaf0]">
                  {clue.title}
                </p>
              </div>
              {blocked ? (
                <IconLock className="size-5 shrink-0 text-[#ffb0a5]" />
              ) : (
                <IconArrowRight className="size-4 shrink-0 text-[#bfb4a3] transition-colors group-hover:text-[#d7b56d]" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
