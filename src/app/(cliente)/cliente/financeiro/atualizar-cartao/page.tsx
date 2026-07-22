'use client'

import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
  fontHeading,
  fontMono,
  formInputClass,
  formLabelClass,
} from '@/src/lib/design/classes'
import { listCards, updateCard } from '@/src/lib/domain/repositories'

export default function AtualizarCartaoPage() {
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const submit = async (formData: FormData) => {
    const lastFour = String(formData.get('lastFour') ?? '').slice(-4)
    if (!/^\d{4}$/.test(lastFour)) {
      setMessage('Informe os quatro últimos dígitos do cartão.')
      return
    }
    setSubmitting(true)
    setMessage(null)
    try {
      const cards = await listCards()
      const defaultCard =
        cards.find((card) => card.isDefault) ?? cards[0] ?? null
      if (!defaultCard) {
        setMessage('Nenhum cartão cadastrado para atualizar.')
        return
      }
      await updateCard({
        id: defaultCard.id,
        padrao: true,
      })
      setMessage('Cartão definido como padrão.')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar o cartão.',
      )
    } finally {
      setSubmitting(false)
    }
  }

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
        Atualize os dados de cobrança do cartão de crédito padrão para sua
        assinatura.
      </p>

      <form className="mt-6 max-w-md space-y-5" action={submit}>
        <div>
          <Label className={formLabelClass} htmlFor="holder">
            Nome no cartão
          </Label>
          <Input id="holder" name="holder" className={formInputClass} />
        </div>
        <div>
          <Label className={formLabelClass} htmlFor="lastFour">
            Final do cartão
          </Label>
          <Input
            id="lastFour"
            name="lastFour"
            maxLength={4}
            className={formInputClass}
          />
        </div>
        <input type="hidden" name="brand" value="Visa" />
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-[9px] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:bg-(--red-deep)"
        >
          {submitting ? 'Salvando…' : 'Salvar cartão'}
        </Button>
        {message ? (
          <p className="text-sm text-(--ink-mute)">{message}</p>
        ) : null}
      </form>
    </div>
  )
}
