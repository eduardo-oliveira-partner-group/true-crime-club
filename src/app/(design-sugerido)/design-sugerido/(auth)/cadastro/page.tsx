import { IconArrowRight, IconUserPlus } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'

export default function CadastroPage() {
  return (
    <div className="relative border border-[#b98542]/45 bg-[#171211] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.03)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.03)_1px,transparent_1px)] bg-size-[42px_42px]" />

      <div className="flex items-center gap-4">
        <span className="flex size-10 items-center justify-center bg-[#d84132]/20 text-[#ffb0a5]">
          <IconUserPlus className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
            Ingresso no clube
          </p>
          <h1 className="font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
            Criar conta
          </h1>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 border-y border-[#fffaf0]/12 py-3 font-mono text-[10px] tracking-[0.18em] text-[#bfb4a3] uppercase">
        <span>CLUB · CADASTRO</span>
        <span className="h-px flex-1 bg-[#fffaf0]/12" />
        <span>Novo dossiê</span>
      </div>

      <p className="mt-4 text-sm/6 text-[#d7c9b5]">
        Cadastro simulado para validação da jornada.
      </p>

      <form className="mt-6 space-y-5">
        <div>
          <label
            className="text-xs font-semibold tracking-[0.2em] text-[#c8bdad] uppercase"
            htmlFor="name"
          >
            Nome completo
          </label>
          <input
            id="name"
            className="mt-2 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-4 py-3 text-sm text-[#fffaf0] transition outline-none placeholder:text-[#bfb4a3]/60 focus:border-[#d7b56d]/70 focus:bg-[#0b0908]"
          />
        </div>
        <div>
          <label
            className="text-xs font-semibold tracking-[0.2em] text-[#c8bdad] uppercase"
            htmlFor="email"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className="mt-2 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-4 py-3 text-sm text-[#fffaf0] transition outline-none placeholder:text-[#bfb4a3]/60 focus:border-[#d7b56d]/70 focus:bg-[#0b0908]"
          />
        </div>
        <Button
          asChild
          size="lg"
          className="w-full bg-[#d84132] text-white shadow-[0_0_26px_rgba(216,65,50,0.35)] hover:bg-[#b93227]"
        >
          <Link href="/design-sugerido/cliente/pedidos">
            Abrir meu dossiê (mock)
            <IconArrowRight className="size-4" />
          </Link>
        </Button>
      </form>

      <p className="mt-6 border-t border-[#fffaf0]/12 pt-4 text-center text-sm text-[#c8bdad]">
        Já tem conta?{' '}
        <Link
          href="/design-sugerido/login"
          className="font-medium tracking-wide text-[#d7b56d] hover:text-[#fffaf0]"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
