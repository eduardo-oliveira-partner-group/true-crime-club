import { IconFileAlert } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center text-(--ink) sm:px-6">
      <span className="mx-auto flex size-12 items-center justify-center rounded-[10px] border border-(--amber)/25 bg-(--card) text-(--amber)">
        <IconFileAlert className="size-6" />
      </span>
      <p className="mt-5 [font-family:var(--design-font-mono),monospace] text-xs font-bold tracking-[0.24em] text-(--amber) uppercase">
        Pedido 404
      </p>
      <h1 className="mt-3 [font-family:var(--design-font-heading),system-ui,sans-serif] text-3xl font-black tracking-tight text-(--ink) sm:text-4xl">
        Pedido não encontrado
      </h1>
      <p className="mt-3 text-sm/6 text-(--ink-mute)">
        Não localizamos este pedido no seu histórico.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
        >
          <Link href="/cliente/pedidos">Ver meus pedidos</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-[9px]">
          <Link href="/">Voltar à home</Link>
        </Button>
      </div>
    </div>
  )
}
