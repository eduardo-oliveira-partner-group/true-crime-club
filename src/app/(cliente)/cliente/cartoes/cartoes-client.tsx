'use client'

import {
  IconAlertCircle,
  IconCreditCard,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'

import { CardForm } from '@/src/components/customer/card-form'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/ui/empty'
import { CustomerListSkeleton } from '@/src/components/ui/page-loading-skeletons'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  transitionBgColor,
} from '@/src/lib/design/classes'
import { deleteCard, listCards } from '@/src/lib/domain/repositories'
import type { PaymentMethod } from '@/src/lib/domain/types'

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export default function CartoesClient() {
  const [cards, setCards] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const reloadCards = async () => {
    const nextCards = await listCards()
    setCards(nextCards)
  }

  useEffect(() => {
    reloadCards()
      .catch(() => setCards([]))
      .finally(() => setIsLoading(false))
  }, [])

  const handleDeleteCard = async (id: string) => {
    setSubmitting(true)
    setError(null)
    try {
      await deleteCard(id)
      await reloadCards()
    } catch (e: unknown) {
      console.error(e)
      setError(getErrorMessage(e, 'Erro ao remover cartão.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Arquivo do assinante
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        Meus cartões
      </h1>
      <p className="mt-2 text-sm/6 text-(--ink-mute)">
        Gerencie as formas de pagamento vinculadas à sua assinatura e compras
        futuras no clube.
      </p>

      {error && !showAddForm ? (
        <Alert variant="destructive" className="mt-4">
          <IconAlertCircle />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="mt-8">
          <CustomerListSkeleton rows={2} />
        </div>
      ) : showAddForm ? (
        <CardForm
          className="mt-8"
          idPrefix="account-card"
          title="Adicionar cartão de crédito"
          onCancel={() => setShowAddForm(false)}
          onSaved={async () => {
            setShowAddForm(false)
            setError(null)
            await reloadCards()
          }}
        />
      ) : cards.length === 0 ? (
        <Empty className="mt-10 border border-dashed border-(--ink)/15 bg-(--paper-soft) p-7 sm:p-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconCreditCard />
            </EmptyMedia>
            <EmptyTitle className="text-xl">
              Sua lista de cartões está vazia
            </EmptyTitle>
            <EmptyDescription>
              Nenhuma credencial de faturamento ativa cadastrada.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              onClick={() => setShowAddForm(true)}
              className={`group inline-flex items-center gap-2 rounded-[9px] bg-(--red) px-4 py-3 text-xs font-bold tracking-[0.04em] text-[#fbf9f6] uppercase shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] [transition:background-color_0.2s_ease,translate_0.24s_cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-(--red-deep) motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${fontMono}`}
            >
              <IconPlus className="size-4" />
              Adicionar cartão de crédito
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <section className="mt-8" aria-label="Lista de cartões">
          <Button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
          >
            <IconPlus className="size-4" /> Adicionar Cartão de Crédito
          </Button>
          <div className="mt-6 flex flex-col gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`flex items-center justify-between ${dossierCardSurface} ${cardShadowBase} p-5`}
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-10 items-center justify-center rounded-[10px] bg-(--red)/10 text-(--red)">
                    <IconCreditCard className="size-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-semibold tracking-wide text-(--ink) ${fontHeading}`}
                      >
                        {card.brand} terminando em {card.lastFour}
                      </p>
                      {card.isDefault && (
                        <span className="rounded-[2px] border border-(--teal)/30 bg-(--teal)/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-(--teal) uppercase">
                          Principal
                        </span>
                      )}
                    </div>
                    <p
                      className={`mt-0.5 text-xs tracking-wider text-(--ink-mute) ${fontMono}`}
                    >
                      ID: {card.id.toUpperCase()}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={submitting}
                  onClick={() => handleDeleteCard(card.id)}
                  className={`cursor-pointer rounded-[9px] p-1.5 text-(--red) ${transitionBgColor} hover:bg-(--red)/10 hover:text-(--red-deep) disabled:opacity-50`}
                  aria-label="Excluir cartão"
                >
                  <IconTrash className="size-4.5" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
