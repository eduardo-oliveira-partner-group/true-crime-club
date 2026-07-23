import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { NotFoundEmptyState } from '@/src/components/ui/not-found-empty-state'

export default function NotFound() {
  return (
    <NotFoundEmptyState
      code="Pista 404"
      title="Conteúdo exclusivo não encontrado"
      description="Esta pista ou arquivo não está disponível para o seu ciclo atual."
      className="px-4 py-16 sm:px-6"
      actions={
        <>
          <Button
            asChild
            className="rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
          >
            <Link href="/cliente/conteudos">Ver todos os conteúdos</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-[9px]">
            <Link href="/cliente">Painel do cliente</Link>
          </Button>
        </>
      }
    />
  )
}
