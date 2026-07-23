'use client'

import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select'
import {
  fontHeading,
  fontMono,
  formInputClass,
  formLabelClass,
} from '@/src/lib/design/classes'
import { addCard } from '@/src/lib/domain/repositories'
import type { PaymentMethod } from '@/src/lib/domain/types'
import {
  detectCardBrand,
  formatCardHolderName,
  formatCardNumber,
  formatCpf,
  formatCvc,
  isValidCpf,
  normalizeDigits,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

const EXPIRY_MONTHS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, '0'),
)
const EXPIRY_YEAR_START = new Date().getFullYear()
const EXPIRY_YEARS = Array.from({ length: 10 }, (_, i) =>
  String(EXPIRY_YEAR_START + i),
)

export type CardFormProps = {
  onCancel?: () => void
  onSaved: (card: PaymentMethod) => void
  className?: string
  idPrefix?: string
  title?: string
}

export function CardForm({
  onCancel,
  onSaved,
  className,
  idPrefix = 'card',
  title = 'Novo cartão de crédito',
}: CardFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [holderName, setHolderName] = useState('')
  const [holderDocument, setHolderDocument] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('01')
  const [expiryYear, setExpiryYear] = useState(String(EXPIRY_YEAR_START))
  const [cvc, setCvc] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardNumber || !holderName || !holderDocument || !cvc) return

    const digits = normalizeDigits(cardNumber)
    if (digits.length !== 16) {
      setError('Informe um número de cartão válido com 16 dígitos.')
      return
    }
    if (!isValidCpf(holderDocument)) {
      setError('Informe um CPF válido do titular.')
      return
    }
    if (cvc.length < 3) {
      setError('Informe um CVC válido.')
      return
    }

    try {
      setSaving(true)
      setError(null)
      // Metadados exigidos no POST; a UI usa bandeira/rótulo do GET após salvar.
      const card = await addCard({
        holderName: holderName.trim(),
        lastFour: digits.slice(-4),
        brand: detectCardBrand(digits),
        holderDocument,
        expiryMonth,
        expiryYear,
        cardNumber: digits,
        cvc,
      })
      onSaved(card)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível cadastrar o cartão.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'rounded-[14px] border border-(--ink)/10 bg-(--paper-soft) p-4',
        className,
      )}
      aria-label="Novo cartão de crédito"
    >
      <p
        className={cn(
          fontMono,
          'text-xs font-semibold tracking-wide text-(--red) uppercase',
        )}
      >
        {title}
      </p>
      <FieldGroup className="mt-4 gap-4">
        <Field>
          <FieldLabel className={formLabelClass} htmlFor={`${idPrefix}-number`}>
            Número do cartão
          </FieldLabel>
          <Input
            id={`${idPrefix}-number`}
            type="text"
            required
            placeholder="4000 1234 5678 9010"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            inputMode="numeric"
            autoComplete="cc-number"
            maxLength={19}
            className={formInputClass}
          />
        </Field>
        <Field>
          <FieldLabel className={formLabelClass} htmlFor={`${idPrefix}-holder`}>
            Nome do titular (idêntico ao cartão)
          </FieldLabel>
          <Input
            id={`${idPrefix}-holder`}
            type="text"
            required
            placeholder="MARIANA SILVA"
            value={holderName}
            onChange={(e) =>
              setHolderName(formatCardHolderName(e.target.value))
            }
            autoComplete="cc-name"
            maxLength={40}
            className={formInputClass}
          />
        </Field>
        <Field>
          <FieldLabel
            className={formLabelClass}
            htmlFor={`${idPrefix}-document`}
          >
            CPF do titular
          </FieldLabel>
          <Input
            id={`${idPrefix}-document`}
            type="text"
            required
            placeholder="000.000.000-00"
            value={holderDocument}
            onChange={(e) => setHolderDocument(formatCpf(e.target.value))}
            inputMode="numeric"
            autoComplete="off"
            maxLength={14}
            className={formInputClass}
          />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field>
            <FieldLabel className={formLabelClass}>Mês</FieldLabel>
            <NativeSelect
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              className={formInputClass}
            >
              {EXPIRY_MONTHS.map((month) => (
                <NativeSelectOption key={month} value={month}>
                  {month}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel className={formLabelClass}>Ano</FieldLabel>
            <NativeSelect
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              className={formInputClass}
            >
              {EXPIRY_YEARS.map((year) => (
                <NativeSelectOption key={year} value={year}>
                  {year}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </Field>
          <Field>
            <FieldLabel className={formLabelClass} htmlFor={`${idPrefix}-cvc`}>
              CVC
            </FieldLabel>
            <Input
              id={`${idPrefix}-cvc`}
              type="text"
              required
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(formatCvc(e.target.value))}
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              className={formInputClass}
            />
          </Field>
        </div>
      </FieldGroup>
      {error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle className={fontHeading}>Erro ao cadastrar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="flex justify-end gap-2 pt-4">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-[9px]"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </Button>
        ) : null}
        <Button
          type="submit"
          size="sm"
          className="rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Cadastrar cartão'}
        </Button>
      </div>
    </form>
  )
}
