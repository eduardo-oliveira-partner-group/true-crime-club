import Link from "next/link"

import {
  getActiveCase,
  getSubscriberProgress,
  listClues,
} from "@/src/lib/domain/repositories"
import { formatContentStatus, formatDate, formatPercent } from "@/src/lib/formatters"

export default function ConteudosPage() {
  const activeCase = getActiveCase()
  const clues = listClues(activeCase?.id)
  const progress = activeCase ? getSubscriberProgress(activeCase.id) : null

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Conteúdos exclusivos</h1>
      {activeCase ? (
        <p className="mt-2 text-sm text-muted-foreground">{activeCase.description}</p>
      ) : null}

      {progress ? (
        <div className="mt-6 rounded-xl border border-border bg-brand-muted/30 p-4">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span>
              {progress.collectedClues}/{progress.totalClues} pistas (
              {formatPercent(progress.percentComplete)})
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-brand-accent"
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {progress.liveEventTitle} — {formatDate(progress.liveEventDate)}
          </p>
        </div>
      ) : null}

      <div className="mt-8 space-y-3">
        {clues.map((clue) => (
          <Link
            key={clue.id}
            href={`/cliente/conteudos/${clue.slug}`}
            className="block rounded-xl border border-border p-4 hover:bg-muted/40"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{clue.title}</p>
              <span className="text-xs text-muted-foreground">
                {formatContentStatus(clue.status)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Ciclo {clue.cycleNumber}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
