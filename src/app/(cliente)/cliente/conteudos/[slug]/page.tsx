import { IconArrowLeft, IconDownload, IconLock } from '@tabler/icons-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/src/components/ui/button'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
} from '@/src/lib/design/classes'
import { getClueBySlug } from '@/src/lib/domain/repositories'
import { formatContentStatus } from '@/src/lib/formatters'

interface ConteudoDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ConteudoDetailPage({
  params,
}: ConteudoDetailPageProps) {
  const { slug } = await params
  const clue = await getClueBySlug(slug)

  if (!clue) {
    notFound()
  }

  const isBlocked = clue.status === 'bloqueado'

  return (
    <div>
      <Button
        asChild
        variant="ghost"
        className="mb-6 h-auto gap-1 rounded-[9px] p-0 text-(--ink-mute) hover:bg-transparent hover:text-(--red)"
      >
        <Link href="/cliente/conteudos">
          <IconArrowLeft className="size-4" />
          Voltar aos conteúdos
        </Link>
      </Button>

      <p
        className={`text-[11px] tracking-[0.16em] text-(--ink-mute) uppercase ${fontMono}`}
      >
        Ciclo {clue.cycleNumber} — {formatContentStatus(clue.status)}
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        {clue.title}
      </h1>
      <p className="mt-4 text-sm/6 text-(--ink-mute)">{clue.description}</p>

      {isBlocked ? (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-(--red)/30 bg-(--red)/6 p-8 text-center">
          <IconLock className="size-7 text-(--red)" />
          <p
            className={`text-lg font-semibold text-(--ink-soft) ${fontHeading}`}
          >
            Conteúdo bloqueado
          </p>
          <p className="max-w-sm text-sm/6 text-(--ink-mute)">
            {clue.blockedReason ?? 'Libera no próximo ciclo'}
          </p>
        </div>
      ) : (
        <div className={`mt-6 ${dossierCardSurface} ${cardShadowBase} p-5`}>
          <div className="border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Arquivos disponíveis
            </h3>
          </div>
          <div className="mt-4 space-y-2">
            {clue.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-[10px] border border-(--ink)/10 bg-(--paper-soft) p-3 text-sm"
              >
                <span className="text-(--ink-soft)">{file.name}</span>
                <span
                  className={`flex items-center gap-3 text-[11px] tracking-[0.12em] text-(--ink-mute) uppercase ${fontMono}`}
                >
                  {file.sizeLabel}
                  <IconDownload className="size-4 text-(--teal)" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
