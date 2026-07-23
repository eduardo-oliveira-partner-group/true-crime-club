import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { NotFoundEmptyState } from '@/src/components/ui/not-found-empty-state'

export default function NotFound() {
  return (
    <NotFoundEmptyState
      code="Item 404"
      title="Produto não encontrado"
      description="Esta edição ou item não está mais no arquivo da loja."
      className="px-4 py-16 sm:px-6"
      actions={
        <>
          <Button
            asChild
            className="rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
          >
            <Link href="/loja">Ver loja completa</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-[9px]">
            <Link href="/">Voltar à home</Link>
          </Button>
        </>
      }
    />
  )
}
