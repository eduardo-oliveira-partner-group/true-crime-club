'use client'

import { IconCreditCard, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useEffect } from 'react'

import { Button } from '@/src/components/ui/button'
import { apiClient } from '@/src/lib/api-client'
import type { PaymentMethod } from '@/src/lib/domain/types'

export default function CartoesPage() {
  const [cards, setCards] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.customer
      .getProfile()
      .then((data) => {
        if (data.paymentMethods) {
          setCards(
            (data.paymentMethods as PaymentMethod[]).filter(
              (pm) => pm.type === 'credit_card',
            ),
          )
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const [showAddForm, setShowAddForm] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('01')
  const [expiryYear, setExpiryYear] = useState('2026')
  const [cvc, setCvc] = useState('')

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardNumber || !holderName || !cvc) return

    const lastFour = cardNumber.replace(/\s+/g, '').slice(-4)
    // Detect brand based on first digit (simplistic mock)
    const brand = cardNumber.startsWith('5') ? 'Mastercard' : 'Visa'

    const newCard: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: 'credit_card',
      label: `${brand} terminando em ${lastFour}`,
      lastFour,
      brand,
      isDefault: cards.length === 0,
    }

    setCards([...cards, newCard])
    setShowAddForm(false)

    // Reset form fields
    setCardNumber('')
    setHolderName('')
    setExpiryMonth('01')
    setExpiryYear('2026')
    setCvc('')
  }

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id))
  }

  if (loading) {
    return (
      <div className="flex h-48 animate-pulse items-center justify-center font-mono text-sm tracking-widest text-[#bfb4a3] uppercase">
        Carregando formas de pagamento...
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
        Arquivo do assinante
      </p>
      <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
        Meus cartões
      </h1>
      <p className="mt-2 text-sm/6 text-[#d7c9b5]">
        Gerencie as formas de pagamento vinculadas à sua assinatura e compras
        futuras no clube.
      </p>

      {/* Form para Adicionar Cartão */}
      {showAddForm ? (
        <form
          onSubmit={handleAddCard}
          className="mt-6 max-w-xl space-y-4 border border-[#fffaf0]/12 bg-[#171211] p-5"
        >
          <p className="text-xs font-semibold tracking-wide text-[#d7b56d] uppercase">
            Adicionar Cartão de Crédito
          </p>

          <div className="space-y-4">
            <div>
              <label
                className="block text-[10px] text-[#bfb4a3] uppercase"
                htmlFor="cardNumber"
              >
                Número do Cartão
              </label>
              <input
                id="cardNumber"
                type="text"
                required
                placeholder="4000 1234 5678 9010"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
              />
            </div>

            <div>
              <label
                className="block text-[10px] text-[#bfb4a3] uppercase"
                htmlFor="holderName"
              >
                Nome do Titular (idêntico ao cartão)
              </label>
              <input
                id="holderName"
                type="text"
                required
                placeholder="MARIANA SILVA"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] text-[#bfb4a3] uppercase">
                  Mês de Exp.
                </label>
                <select
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
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
                <label className="block text-[10px] text-[#bfb4a3] uppercase">
                  Ano de Exp.
                </label>
                <select
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
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
                <label
                  className="block text-[10px] text-[#bfb4a3] uppercase"
                  htmlFor="cvc"
                >
                  CVC
                </label>
                <input
                  id="cvc"
                  type="text"
                  required
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="mt-1 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-1.5 text-sm text-[#fffaf0] outline-none focus:border-[#d7b56d]/70"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[#fffaf0]/20 text-[#fffaf0] hover:bg-[#fffaf0]/10"
              onClick={() => setShowAddForm(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#d7b56d] text-[#171211] hover:bg-[#c69f54]"
            >
              Cadastrar Cartão
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-6">
          <Button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-[#d7b56d] text-[#171211] hover:bg-[#c69f54]"
          >
            <IconPlus className="size-4" /> Adicionar Cartão de Crédito
          </Button>
        </div>
      )}

      {/* Listagem de Cartões */}
      <div className="mt-8 max-w-xl space-y-4">
        {cards.length === 0 ? (
          <div className="border border-dashed border-[#fffaf0]/18 bg-[#171211]/60 p-8 text-center">
            <p className="font-heading text-lg font-semibold text-[#f0e8dd]">
              Sua lista de cartões está vazia
            </p>
            <p className="mt-2 text-sm text-[#c8bdad]">
              Nenhuma credencial de faturamento ativa cadastrada.
            </p>
          </div>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between border border-[#fffaf0]/10 bg-[#171211] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-10 items-center justify-center bg-[#b98542]/20 text-[#d7b56d]">
                  <IconCreditCard className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-sm font-semibold tracking-wide text-[#fffaf0]">
                      {card.brand} terminando em {card.lastFour}
                    </p>
                    {card.isDefault && (
                      <span className="border border-[#d7b56d]/30 bg-[#d7b56d]/10 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-[#d7b56d] uppercase">
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-mono text-xs tracking-wider text-[#bfb4a3]">
                    ID: {card.id.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteCard(card.id)}
                className="cursor-pointer p-1.5 text-[#ffb0a5] transition-colors hover:text-[#d84132]"
              >
                <IconTrash className="size-4.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
