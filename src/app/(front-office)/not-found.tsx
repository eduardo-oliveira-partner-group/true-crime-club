import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { NotFoundEmptyState } from '@/src/components/ui/not-found-empty-state'

export default function NotFound() {
  return (
    <NotFoundEmptyState
      code="Arquivo 404"
      title="A página que você procura não foi encontrada"
      description="O endereço que você buscou não existe ou foi removido do arquivo."
      className="px-[22px] py-[clamp(48px,8vw,96px)]"
      mediaClassName="max-w-[540px]"
      imageSizes="(max-width: 640px) calc(100vw - 44px), 540px"
      actions={
        <>
          <Button
            asChild
            className="rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
          >
            <Link href="/">Voltar à home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-[9px]">
            <Link href="/loja">Explorar a loja</Link>
          </Button>
        </>
      }
    />
  )
}
