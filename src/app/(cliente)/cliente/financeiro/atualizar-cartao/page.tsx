import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { updateCard } from '@/src/lib/domain/repositories'

export default function AtualizarCartaoPage() {
  return (
    <div>
      <Button
        asChild
        variant="ghost"
        className="mb-6 h-auto gap-1 p-0 text-[#c8bdad] hover:bg-transparent hover:text-[#d7b56d]"
      >
        <Link href="/cliente/financeiro">
          <IconArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>

      <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
        Arquivo do assinante
      </p>
      <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
        Atualizar cartão
      </h1>
      <p className="mt-2 text-sm/6 text-[#d7c9b5]">
        Formulário mockado — dados não são enviados a nenhum gateway.
      </p>

      <form
        className="mt-6 max-w-md space-y-5"
        action={async (formData) => {
          'use server'
          updateCard({
            holderName: String(formData.get('holder') ?? ''),
            lastFour: String(formData.get('lastFour') ?? '0000').slice(-4),
            brand: String(formData.get('brand') ?? 'Visa'),
          })
        }}
      >
        <div>
          <label
            className="text-xs font-semibold tracking-[0.2em] text-[#c8bdad] uppercase"
            htmlFor="holder"
          >
            Nome no cartão
          </label>
          <input
            id="holder"
            name="holder"
            className="mt-2 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-4 py-3 text-sm text-[#fffaf0] transition outline-none placeholder:text-[#bfb4a3]/60 focus:border-[#d7b56d]/70 focus:bg-[#0b0908]"
          />
        </div>
        <div>
          <label
            className="text-xs font-semibold tracking-[0.2em] text-[#c8bdad] uppercase"
            htmlFor="lastFour"
          >
            Final do cartão
          </label>
          <input
            id="lastFour"
            name="lastFour"
            maxLength={4}
            className="mt-2 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-4 py-3 text-sm text-[#fffaf0] transition outline-none placeholder:text-[#bfb4a3]/60 focus:border-[#d7b56d]/70 focus:bg-[#0b0908]"
          />
        </div>
        <input type="hidden" name="brand" value="Visa" />
        <Button
          type="submit"
          className="bg-[#d84132] text-white shadow-[0_0_26px_rgba(216,65,50,0.35)] hover:bg-[#b93227]"
        >
          Salvar cartão (mock)
        </Button>
      </form>
    </div>
  )
}
