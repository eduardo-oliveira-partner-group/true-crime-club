import { IconFileAlert } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center text-(--ink) sm:px-6">
      <span className="mx-auto flex size-12 items-center justify-center rounded-[2px] border border-[#d7b56d]/30 bg-(--card) text-(--red) shadow-[0_3px_5px_rgba(33,28,24,0.15)]">
        <IconFileAlert className="size-6" />
      </span>
      <p className="mt-5 font-mono text-xs tracking-[0.24em] text-(--red) uppercase">
        Item 404
      </p>
      <h1 className="mt-3 font-heading text-3xl font-black tracking-tight sm:text-4xl">
        Produto não encontrado
      </h1>
      <p className="mt-3 text-sm/6 text-(--ink-soft)">
        Esta edição ou item não está mais no arquivo da loja.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="rounded-[9px] bg-(--red) font-bold text-[#fbf9f6] hover:bg-(--red-deep)"
        >
          <Link href="/loja">Ver loja completa</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-[10px]">
          <Link href="/">Voltar à home</Link>
        </Button>
      </div>
    </div>
  )
}
