import { IconFileAlert } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center text-[#fffaf0] sm:px-6">
      <span className="mx-auto flex size-12 items-center justify-center border border-[#d7b56d]/30 bg-[#171211] text-[#d7b56d]">
        <IconFileAlert className="size-6" />
      </span>
      <p className="mt-5 font-mono text-xs tracking-[0.24em] text-[#d7b56d] uppercase">
        Dossiê 404
      </p>
      <h1 className="mt-3 font-heading text-3xl font-black tracking-tight sm:text-4xl">
        Conteúdo não encontrado
      </h1>
      <p className="mt-3 text-sm/6 text-[#d7c9b5]">
        O item que você procura não está disponível na sua área do clube.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild className="bg-[#d84132] text-white hover:bg-[#b93227]">
          <Link href="/cliente/conteudos">Ver conteúdos</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Voltar à home</Link>
        </Button>
      </div>
    </div>
  )
}
