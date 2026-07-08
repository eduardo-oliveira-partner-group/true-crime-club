import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import {
  fontHeading,
  fontMono,
  formInputClass,
  formLabelClass,
} from '@/src/lib/design/classes'
import { updateCard } from '@/src/lib/domain/repositories'

export default function AtualizarCartaoPage() {
  return (
    <div>
      <Button
        asChild
        variant="ghost"
        className="mb-6 h-auto gap-1 rounded-[9px] p-0 text-(--ink-mute) hover:bg-transparent hover:text-(--red)"
      >
        <Link href="/cliente/financeiro">
          <IconArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>

      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Arquivo do assinante
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        Atualizar cartão
      </h1>
      <p className="mt-2 text-sm/6 text-(--ink-mute)">
        Formulário mockado — dados não são enviados a nenhum gateway.
      </p>

      <form
        className="mt-6 max-w-md space-y-5"
        action={async (formData) => {
          'use server'
          await updateCard({
            holderName: String(formData.get('holder') ?? ''),
            lastFour: String(formData.get('lastFour') ?? '0000').slice(-4),
            brand: String(formData.get('brand') ?? 'Visa'),
          })
        }}
      >
        <div>
          <label className={formLabelClass} htmlFor="holder">
            Nome no cartão
          </label>
          <input id="holder" name="holder" className={formInputClass} />
        </div>
        <div>
          <label className={formLabelClass} htmlFor="lastFour">
            Final do cartão
          </label>
          <input
            id="lastFour"
            name="lastFour"
            maxLength={4}
            className={formInputClass}
          />
        </div>
        <input type="hidden" name="brand" value="Visa" />
        <Button
          type="submit"
          className="rounded-[9px] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:bg-(--red-deep)"
        >
          Salvar cartão (mock)
        </Button>
      </form>
    </div>
  )
}
