'use client'

import { IconCreditCard, IconPlus, IconTrash } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { CustomerListSkeleton } from '@/src/components/ui/page-loading-skeletons'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  formInputClass,
  formLabelClass,
  transitionBgColor,
} from '@/src/lib/design/classes'
import { addCard, deleteCard, listCards } from '@/src/lib/domain/repositories'
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
  const [cardNumber, setCardNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('01')
  const [expiryYear, setExpiryYear] = useState('2026')
  const [cvc, setCvc] = useState('')

  const reloadCards = async () => {
    const nextCards = await listCards()
    setCards(nextCards)
  }

  useEffect(() => {
    reloadCards()
      .catch(() => setCards([]))
      .finally(() => setIsLoading(false))
  }, [])

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardNumber || !holderName || !cvc) return

    const lastFour = cardNumber.replace(/\s+/g, '').slice(-4)
    const brand = cardNumber.startsWith('5') ? 'Mastercard' : 'Visa'
    const token = `tok_mock_${Date.now()}`

    setSubmitting(true)
    setError(null)
    try {
      await addCard({ token, holderName, lastFour, brand })
      setShowAddForm(false)
      setCardNumber('')
      setHolderName('')
      setExpiryMonth('01')
      setExpiryYear('2026')
      setCvc('')
      await reloadCards()
    } catch (e: unknown) {
      console.error(e)
      setError(getErrorMessage(e, 'Erro ao adicionar cartão.'))
    } finally {
      setSubmitting(false)
    }
  }

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

      {showAddForm ? (
        <form
          onSubmit={handleAddCard}
          className={`mt-6 max-w-xl ${dossierCardSurface} ${cardShadowBase} p-5`}
        >
          <div className="border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Adicionar Cartão de Crédito
            </h3>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <Label className={formLabelClass} htmlFor="cardNumber">
                Número do Cartão
              </Label>
              <Input
                id="cardNumber"
                type="text"
                required
                placeholder="4000 1234 5678 9010"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className={formInputClass}
              />
            </div>
            <div>
              <Label className={formLabelClass} htmlFor="holderName">
                Nome do Titular (idêntico ao cartão)
              </Label>
              <Input
                id="holderName"
                type="text"
                required
                placeholder="MARIANA SILVA"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className={formInputClass}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={formLabelClass}>Mês de Exp.</label>
                <select
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  className={formInputClass}
                >
                  {Array.from({ length: 12 }, (_, i) =>
                    String(i + 1).padStart(2, '0'),
                  ).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={formLabelClass}>Ano de Exp.</label>
                <select
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  className={formInputClass}
                >
                  {Array.from({ length: 10 }, (_, i) => String(2026 + i)).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <Label className={formLabelClass} htmlFor="cvc">
                  CVC
                </Label>
                <Input
                  id="cvc"
                  type="text"
                  required
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className={formInputClass}
                />
              </div>
            </div>
          </div>
          {error && (
            <p className="mt-2 text-xs font-semibold text-(--red)">{error}</p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={submitting}
              className="rounded-[9px]"
              onClick={() => setShowAddForm(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
            >
              {submitting ? 'Salvando...' : 'Cadastrar Cartão'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-6">
          <Button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
          >
            <IconPlus className="size-4" /> Adicionar Cartão de Crédito
          </Button>
        </div>
      )}

      <div className="mt-8 max-w-xl space-y-4">
        {isLoading ? <CustomerListSkeleton rows={2} /> : null}
        {!isLoading && cards.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8 text-center">
            <p
              className={`text-lg font-semibold text-(--ink-soft) ${fontHeading}`}
            >
              Sua lista de cartões está vazia
            </p>
            <p className="mt-2 text-sm text-(--ink-mute)">
              Nenhuma credencial de faturamento ativa cadastrada.
            </p>
          </div>
        ) : (
          cards.map((card) => (
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
                      <span className="rounded-[2px] border border-(--teal)/30 bg-(--teal)/10 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-(--teal) uppercase">
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
          ))
        )}
      </div>
    </div>
  )
}
