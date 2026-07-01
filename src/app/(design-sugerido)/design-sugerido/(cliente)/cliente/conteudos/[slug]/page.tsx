import { IconArrowLeft, IconDownload, IconLock } from '@tabler/icons-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/src/components/ui/button'
import { getClueBySlug } from '@/src/lib/domain/repositories'
import { formatContentStatus } from '@/src/lib/formatters'

interface ConteudoDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ConteudoDetailPage({
  params,
}: ConteudoDetailPageProps) {
  const { slug } = await params
  const clue = getClueBySlug(slug)

  if (!clue) {
    notFound()
  }

  const isBlocked = clue.status === 'bloqueado'

  return (
    <div>
      <Button
        asChild
        variant="ghost"
        className="mb-6 h-auto gap-1 p-0 text-[#c8bdad] hover:bg-transparent hover:text-[#d7b56d]"
      >
        <Link href="/design-sugerido/cliente/conteudos">
          <IconArrowLeft className="size-4" />
          Voltar aos conteúdos
        </Link>
      </Button>

      <p className="font-mono text-[11px] tracking-[0.16em] text-[#bfb4a3] uppercase">
        Ciclo {clue.cycleNumber} — {formatContentStatus(clue.status)}
      </p>
      <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
        {clue.title}
      </h1>
      <p className="mt-4 text-sm/6 text-[#d7c9b5]">{clue.description}</p>

      {isBlocked ? (
        <div className="mt-6 flex flex-col items-center gap-3 border border-dashed border-[#d84132]/45 bg-[#d84132]/10 p-8 text-center">
          <IconLock className="size-7 text-[#ffb0a5]" />
          <p className="font-heading text-lg font-semibold text-[#f0e8dd]">
            Conteúdo bloqueado
          </p>
          <p className="max-w-sm text-sm/6 text-[#c8bdad]">
            {clue.blockedReason ?? 'Libera no próximo ciclo'}
          </p>
        </div>
      ) : (
        <div className="mt-6 border border-[#fffaf0]/12 bg-[#171211] p-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
            Arquivos disponíveis
          </p>
          <div className="mt-4 space-y-2">
            {clue.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between border border-[#fffaf0]/10 bg-[#0c0a09] p-3 text-sm"
              >
                <span className="text-[#f0e8dd]">{file.name}</span>
                <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-[#bfb4a3] uppercase">
                  {file.sizeLabel}
                  <IconDownload className="size-4 text-[#d7b56d]" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
