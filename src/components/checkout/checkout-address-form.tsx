'use client'

import { useRef, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { CepLookupError, lookupCep } from '@/src/lib/cep'
import {
  fontMono,
  formInputClass,
  formLabelClass,
} from '@/src/lib/design/classes'
import { addCustomerAddress } from '@/src/lib/domain/repositories'
import type { Address } from '@/src/lib/domain/types'
import {
  ADDRESS_NUMBER_MAX_LENGTH,
  BRAZILIAN_UFS,
  formatCep,
  formatUf,
  isValidAddressNumber,
  isValidCep,
  isValidUf,
  normalizeDigits,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

type CheckoutAddressFormProps = {
  onCancel?: () => void
  onSaved: (addresses: Address[]) => void
  className?: string
}

export function CheckoutAddressForm({
  onCancel,
  onSaved,
  className,
}: CheckoutAddressFormProps) {
  const [label, setLabel] = useState('')
  const [zip, setZip] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [complement, setComplement] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [isDefault, setIsDefault] = useState(true)
  const [lookingUpCep, setLookingUpCep] = useState(false)
  const [cepLookupError, setCepLookupError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lastLookedUpCepRef = useRef('')
  const cepLookupAbortRef = useRef<AbortController | null>(null)
  const numberInputRef = useRef<HTMLInputElement>(null)

  const fillAddressFromCep = async (digits: string) => {
    if (digits === lastLookedUpCepRef.current) return

    cepLookupAbortRef.current?.abort()
    const controller = new AbortController()
    cepLookupAbortRef.current = controller

    setLookingUpCep(true)
    setCepLookupError(null)

    try {
      const address = await lookupCep(digits, controller.signal)
      if (controller.signal.aborted) return

      lastLookedUpCepRef.current = digits
      if (address.street) setStreet(address.street)
      if (address.neighborhood) setNeighborhood(address.neighborhood)
      if (address.city) setCity(address.city)
      if (address.state) setState(formatUf(address.state))
      numberInputRef.current?.focus()
    } catch (err) {
      if (controller.signal.aborted) return
      lastLookedUpCepRef.current = ''
      setCepLookupError(
        err instanceof CepLookupError
          ? err.message
          : 'Não foi possível consultar o CEP.',
      )
    } finally {
      if (cepLookupAbortRef.current === controller) {
        cepLookupAbortRef.current = null
        setLookingUpCep(false)
      }
    }
  }

  const handleZipChange = (value: string) => {
    const formatted = formatCep(value)
    const digits = normalizeDigits(formatted)
    setZip(formatted)
    setCepLookupError(null)

    if (digits.length !== 8) {
      lastLookedUpCepRef.current = ''
      cepLookupAbortRef.current?.abort()
      cepLookupAbortRef.current = null
      setLookingUpCep(false)
      return
    }

    void fillAddressFromCep(digits)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label || !street || !number || !zip || !neighborhood || !city) return

    if (!isValidCep(zip)) {
      setError('CEP deve ter 8 dígitos.')
      return
    }
    if (!isValidUf(state)) {
      setError('Selecione uma UF válida.')
      return
    }
    if (!isValidAddressNumber(number)) {
      setError(
        `Número deve ter no máximo ${ADDRESS_NUMBER_MAX_LENGTH} caracteres.`,
      )
      return
    }

    try {
      setSaving(true)
      setError(null)
      const addresses = await addCustomerAddress({
        label,
        street,
        number: number.trim(),
        complement: complement || undefined,
        neighborhood,
        city,
        state: formatUf(state),
        zipCode: normalizeDigits(zip),
        isDefault,
      })
      onSaved(addresses)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar o endereço.',
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
      aria-label="Novo endereço de entrega"
    >
      <p
        className={cn(
          fontMono,
          'text-xs font-semibold tracking-wide text-(--red) uppercase',
        )}
      >
        Novo endereço de entrega
      </p>
      <FieldGroup className="mt-4 gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field className="sm:col-span-2">
            <FieldLabel className={formLabelClass}>
              Identificação (ex: Casa, Trabalho)
            </FieldLabel>
            <Input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={formInputClass}
            />
          </Field>
          <Field data-invalid={cepLookupError ? true : undefined}>
            <FieldLabel className={formLabelClass} htmlFor="checkout-addr-cep">
              CEP
            </FieldLabel>
            <Input
              id="checkout-addr-cep"
              type="text"
              required
              value={zip}
              onChange={(e) => handleZipChange(e.target.value)}
              onBlur={() => {
                if (isValidCep(zip)) {
                  void fillAddressFromCep(normalizeDigits(zip))
                }
              }}
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={9}
              aria-busy={lookingUpCep}
              aria-invalid={cepLookupError ? true : undefined}
              className={formInputClass}
            />
            {lookingUpCep ? (
              <FieldDescription>Buscando endereço...</FieldDescription>
            ) : null}
            {cepLookupError ? <FieldError>{cepLookupError}</FieldError> : null}
          </Field>
          <Field
            className="sm:col-span-2"
            data-disabled={lookingUpCep ? true : undefined}
          >
            <FieldLabel className={formLabelClass}>Logradouro / Rua</FieldLabel>
            <Input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              disabled={lookingUpCep}
              className={formInputClass}
            />
          </Field>
          <Field>
            <FieldLabel className={formLabelClass}>Número</FieldLabel>
            <Input
              ref={numberInputRef}
              type="text"
              required
              value={number}
              onChange={(e) =>
                setNumber(e.target.value.slice(0, ADDRESS_NUMBER_MAX_LENGTH))
              }
              maxLength={ADDRESS_NUMBER_MAX_LENGTH}
              className={formInputClass}
            />
          </Field>
          <Field>
            <FieldLabel className={formLabelClass}>Complemento</FieldLabel>
            <Input
              type="text"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              className={formInputClass}
            />
          </Field>
          <Field data-disabled={lookingUpCep ? true : undefined}>
            <FieldLabel className={formLabelClass}>Bairro</FieldLabel>
            <Input
              type="text"
              required
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              disabled={lookingUpCep}
              className={formInputClass}
            />
          </Field>
          <Field data-disabled={lookingUpCep ? true : undefined}>
            <FieldLabel className={formLabelClass}>Cidade</FieldLabel>
            <Input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={lookingUpCep}
              className={formInputClass}
            />
          </Field>
          <Field data-disabled={lookingUpCep ? true : undefined}>
            <FieldLabel className={formLabelClass}>Estado (UF)</FieldLabel>
            <Select
              value={state || undefined}
              onValueChange={setState}
              disabled={lookingUpCep}
            >
              <SelectTrigger className={cn(formInputClass, 'w-full')}>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {BRAZILIAN_UFS.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field
            orientation="horizontal"
            className="items-center sm:col-span-3"
          >
            <Checkbox
              id="checkout-addr-default"
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked === true)}
              className="size-4 shrink-0 rounded border border-[rgba(33,28,24,0.15)] bg-transparent data-checked:border-(--red) data-checked:bg-(--red) data-checked:text-[#fbf9f6]"
            />
            <FieldLabel
              htmlFor="checkout-addr-default"
              className="cursor-pointer text-sm leading-none font-normal text-(--ink-soft)"
            >
              Definir como endereço principal
            </FieldLabel>
          </Field>
        </div>
      </FieldGroup>
      {error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Não foi possível salvar</AlertTitle>
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
          disabled={saving || lookingUpCep}
        >
          {saving ? 'Salvando...' : 'Salvar endereço'}
        </Button>
      </div>
    </form>
  )
}
