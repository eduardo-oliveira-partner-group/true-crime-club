'use client'

import {
  IconAlertCircle,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { CardForm } from '@/src/components/customer/card-form'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog'
import { CardsListSkeleton } from '@/src/components/ui/page-loading-skeletons'
import {
  fontHeading,
  fontMono,
  transitionBgColor,
} from '@/src/lib/design/classes'
import {
  deleteCard,
  listCards,
  updateCard,
} from '@/src/lib/domain/repositories'
import type { PaymentMethod } from '@/src/lib/domain/types'
import {
  formatCardExpiry,
  formatCpf,
  formatMaskedCardNumber,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

function cardFaceTone(brand?: string): string {
  const key = (brand ?? '').toLowerCase()
  if (key.includes('master')) {
    return 'from-[#4a2420] via-[#2c1614] to-[#1a0f0e]'
  }
  if (key.includes('elo')) {
    return 'from-[#1a3d34] via-[#122822] to-[#0e1614]'
  }
  if (key.includes('amex') || key.includes('american')) {
    return 'from-[#24344c] via-[#182232] to-[#101820]'
  }
  if (key.includes('visa')) {
    return 'from-[#2a3038] via-[#1c2028] to-[#12161c]'
  }
  return 'from-[#2a2622] via-[#1a1614] to-(--night-soft)'
}

function PaymentCardItem({
  card,
  submitting,
  onSetDefault,
  onDelete,
}: {
  card: PaymentMethod
  submitting: boolean
  onSetDefault: (id: string) => void
  onDelete: (id: string) => void
}) {
  const brand = card.brand?.trim() || 'Cartão'
  const expiry = formatCardExpiry(card.expiryMonth, card.expiryYear)
  const holderName = card.holderName?.trim() || 'Titular não informado'
  const holderDocument = card.holderDocument
    ? formatCpf(card.holderDocument)
    : null

  return (
    <article className="overflow-hidden rounded-[16px] border border-(--ink)/10 bg-(--card) shadow-[0_16px_32px_-18px_rgba(33,28,24,0.35)]">
      <div
        className={cn(
          'relative aspect-85/54 overflow-hidden bg-linear-to-br p-5 text-white sm:p-6',
          cardFaceTone(card.brand),
        )}
        aria-label={`Cartão ${brand} terminando em ${card.lastFour ?? 'desconhecido'}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 -right-2 size-40 rounded-full border border-white/8"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-8 right-8 size-24 rounded-full border border-white/6"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(255,255,255,0.14),transparent_50%)]"
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <span
              className={`text-[10px] font-semibold tracking-[0.16em] text-white/80 uppercase ${fontMono}`}
            >
              Crédito
            </span>
            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`text-sm font-black tracking-[0.08em] text-white uppercase ${fontHeading}`}
              >
                {brand}
              </span>
              {card.isDefault ? (
                <span className="rounded-full border border-(--teal)/45 bg-(--teal)/25 px-2.5 py-0.5 text-[9px] font-bold tracking-[0.12em] text-[#b8f0e0] uppercase">
                  Principal
                </span>
              ) : null}
            </div>
          </div>

          <p
            className={`mt-auto text-[clamp(1.15rem,3vw,1.45rem)] font-bold tracking-[0.2em] text-white tabular-nums ${fontMono}`}
          >
            {formatMaskedCardNumber(card.lastFour)}
          </p>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p
                className={`text-[10px] font-semibold tracking-[0.18em] text-white/75 uppercase ${fontMono}`}
              >
                Titular
              </p>
              <p
                className={`mt-1 truncate text-sm font-bold tracking-wide text-white uppercase ${fontHeading}`}
              >
                {holderName}
              </p>
              {holderDocument ? (
                <p
                  className={`mt-1 text-xs font-medium tracking-wide text-white/85 ${fontMono}`}
                >
                  CPF {holderDocument}
                </p>
              ) : null}
            </div>
            {expiry ? (
              <div className="shrink-0 text-right">
                <p
                  className={`text-[10px] font-semibold tracking-[0.18em] text-white/75 uppercase ${fontMono}`}
                >
                  Validade
                </p>
                <p
                  className={`mt-1 text-sm font-bold tracking-wide text-white ${fontMono}`}
                >
                  {expiry}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-(--ink)/8 bg-(--card) px-3.5 py-2.5">
        {card.isDefault ? (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold text-(--teal) ${fontMono}`}
          >
            <IconStarFilled className="size-3.5" />
            Cartão principal
          </span>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={submitting}
            onClick={() => onSetDefault(card.id)}
            className={`inline-flex items-center gap-1.5 rounded-[9px] border-(--ink)/15 bg-(--card) text-(--ink-soft) ${transitionBgColor} hover:bg-(--paper-soft) hover:text-(--ink)`}
          >
            <IconStar className="size-3.5" />
            Definir como principal
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={submitting}
          onClick={() => onDelete(card.id)}
          className={`rounded-[9px] text-(--ink-mute) ${transitionBgColor} hover:bg-(--red)/10 hover:text-(--red) disabled:opacity-50`}
          aria-label={`Excluir cartão ${brand} terminando em ${card.lastFour ?? ''}`}
        >
          <IconTrash className="size-4.5" />
        </Button>
      </div>
    </article>
  )
}

function AddCardTemplate({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex size-full min-h-56 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-[16px] border border-dashed border-(--ink)/25 bg-(--paper-soft)/60 p-6 text-center transition-[border-color,background-color,box-shadow,translate] duration-200 outline-none',
        'hover:-translate-y-0.5 hover:border-(--red)/40 hover:bg-(--card) hover:shadow-[0_14px_28px_-16px_rgba(33,28,24,0.22)]',
        'focus-visible:border-(--red) focus-visible:shadow-[0_0_0_2px_rgba(197,39,31,0.18)]',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
      aria-label="Adicionar novo cartão de crédito"
    >
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-full border-2 border-(--red)/35 text-(--red) transition-colors group-hover:border-(--red)/50 group-hover:bg-(--red)/8"
      >
        <IconPlus className="size-7" />
      </span>
      <span className="px-4">
        <span
          className={`block text-sm font-bold tracking-wide text-(--ink) uppercase ${fontHeading}`}
        >
          Adicionar cartão
        </span>
        <span className="mt-1.5 block text-xs text-(--ink-mute)">
          Clique para cadastrar um novo método de pagamento
        </span>
      </span>
    </button>
  )
}

export default function CartoesClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addFormRef = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardToDelete, setCardToDelete] = useState<PaymentMethod | null>(null)
  const [deletingCard, setDeletingCard] = useState(false)
  const [showAddForm, setShowAddForm] = useState(
    () => searchParams.get('acao') === 'adicionar',
  )

  const reloadCards = async () => {
    const nextCards = await listCards()
    setCards(nextCards)
  }

  useEffect(() => {
    reloadCards()
      .catch(() => setCards([]))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!showAddForm) return
    addFormRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [showAddForm])

  const closeAddForm = () => {
    setShowAddForm(false)
    if (searchParams.get('acao') === 'adicionar') {
      router.replace('/cliente/cartoes')
    }
  }

  const openAddForm = () => {
    setError(null)
    setShowAddForm(true)
  }

  const handleSetDefaultCard = async (id: string) => {
    setSubmitting(true)
    setError(null)
    try {
      await updateCard({ id, padrao: true })
      await reloadCards()
    } catch (e: unknown) {
      console.error(e)
      setError(getErrorMessage(e, 'Erro ao definir cartão principal.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDeleteCard = async () => {
    if (!cardToDelete) return
    setDeletingCard(true)
    setError(null)
    try {
      await deleteCard(cardToDelete.id)
      await reloadCards()
      setCardToDelete(null)
    } catch (e: unknown) {
      console.error(e)
      setError(getErrorMessage(e, 'Erro ao remover cartão.'))
      setCardToDelete(null)
    } finally {
      setDeletingCard(false)
    }
  }

  return (
    <div>
      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Formas de pagamento
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
        <CardsListSkeleton cards={2} />
      ) : (
        <section className="mt-8" aria-label="Lista de cartões">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {cards.map((card) => (
              <PaymentCardItem
                key={card.id}
                card={card}
                submitting={submitting}
                onSetDefault={handleSetDefaultCard}
                onDelete={(id) => {
                  const card = cards.find((item) => item.id === id) ?? null
                  setCardToDelete(card)
                }}
              />
            ))}
            {showAddForm ? (
              <div
                ref={addFormRef}
                className="md:col-span-2"
                aria-live="polite"
              >
                <CardForm
                  idPrefix="account-card"
                  title="Adicionar cartão de crédito"
                  onCancel={closeAddForm}
                  onSaved={async () => {
                    closeAddForm()
                    setError(null)
                    await reloadCards()
                  }}
                />
              </div>
            ) : (
              <AddCardTemplate onClick={openAddForm} />
            )}
          </div>
        </section>
      )}

      <ConfirmDialog
        open={Boolean(cardToDelete)}
        onOpenChange={(open) => {
          if (!open) setCardToDelete(null)
        }}
        title="Excluir cartão?"
        description={
          cardToDelete ? (
            <>
              O cartão{' '}
              <span className="font-semibold text-(--ink)">
                {cardToDelete.brand?.trim() || 'Cartão'}{' '}
                {formatMaskedCardNumber(cardToDelete.lastFour)}
              </span>{' '}
              será removido das suas formas de pagamento. Essa ação não pode ser
              desfeita.
            </>
          ) : null
        }
        confirmLabel="Excluir cartão"
        confirmingLabel="Excluindo…"
        confirming={deletingCard}
        onConfirm={handleConfirmDeleteCard}
      />
    </div>
  )
}
