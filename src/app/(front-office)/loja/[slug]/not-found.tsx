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
          <Button
            asChild
            variant="outline"
            className="rounded-[9px] border-[rgba(33,28,24,0.18)] bg-(--paper-soft) text-(--ink) hover:border-(--red)/45 hover:bg-(--red)/10 hover:text-(--red)"
          >
            <Link href="/">Voltar à home</Link>
          </Button>
        </>
      }
    />
  )
}
