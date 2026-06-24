import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/src/components/ui/button"
import { getClueBySlug } from "@/src/lib/domain/repositories"
import { formatContentStatus } from "@/src/lib/formatters"

interface ConteudoDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ConteudoDetailPage({ params }: ConteudoDetailPageProps) {
  const { slug } = await params
  const clue = getClueBySlug(slug)

  if (!clue) {
    notFound()
  }

  const isBlocked = clue.status === "bloqueado"

  return (
    <div>
      <Button asChild variant="ghost" className="mb-4 h-auto p-0">
        <Link href="/cliente/conteudos">← Voltar aos conteúdos</Link>
      </Button>

      <p className="text-sm text-muted-foreground">
        Ciclo {clue.cycleNumber} — {formatContentStatus(clue.status)}
      </p>
      <h1 className="mt-2 font-heading text-2xl font-semibold">{clue.title}</h1>
      <p className="mt-4 text-muted-foreground">{clue.description}</p>

      {isBlocked ? (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
          <p className="font-medium">Conteúdo bloqueado</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {clue.blockedReason ?? "Libera no próximo ciclo"}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium">Arquivos disponíveis</p>
          {clue.files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
            >
              <span>{file.name}</span>
              <span className="text-muted-foreground">{file.sizeLabel}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
