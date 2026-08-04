import type { Dispatch, SetStateAction } from 'react'

import { CheckoutSection } from '@/src/components/checkout/checkout-flow/checkout-section'
import type { SubscriberPreferencesValue } from '@/src/components/checkout/checkout-flow/types'
import { Field, FieldGroup, FieldLabel } from '@/src/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { Textarea } from '@/src/components/ui/textarea'
import {
  fontMono,
  formInputClass,
  formSelectTriggerClass,
} from '@/src/lib/design/classes'
import { SHIRT_SIZES, SHOE_SIZES } from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

export function PreferencesStep({
  planName,
  preferences,
  onPreferencesChange,
}: {
  planName?: string
  preferences: SubscriberPreferencesValue
  onPreferencesChange: Dispatch<SetStateAction<SubscriberPreferencesValue>>
}) {
  return (
    <CheckoutSection
      title="Preferências da caixa"
      eyebrow="Curadoria"
      code="STEP-05"
    >
      <p className="text-sm text-(--ink-soft)">
        {planName
          ? `Para o ${planName}, usamos suas preferências na curadoria dos itens surpresa da sua caixa.`
          : 'Usamos suas preferências na curadoria dos itens surpresa da sua caixa.'}
      </p>
      <FieldGroup className="mt-5 gap-4 sm:grid sm:grid-cols-2">
        <Field>
          <FieldLabel
            className={cn(
              fontMono,
              'text-[0.65rem] font-semibold tracking-[0.14em] text-(--ink) uppercase',
            )}
          >
            Tamanho de camiseta
          </FieldLabel>
          <Select
            value={preferences.shirtSize || '__none__'}
            onValueChange={(value) =>
              onPreferencesChange((current) => ({
                ...current,
                shirtSize: value === '__none__' ? '' : value,
              }))
            }
          >
            <SelectTrigger className={formSelectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="__none__">Prefiro não informar</SelectItem>
                {SHIRT_SIZES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel
            className={cn(
              fontMono,
              'text-[0.65rem] font-semibold tracking-[0.14em] text-(--ink) uppercase',
            )}
          >
            Tamanho de calçado
          </FieldLabel>
          <Select
            value={preferences.shoeSize || '__none__'}
            onValueChange={(value) =>
              onPreferencesChange((current) => ({
                ...current,
                shoeSize: value === '__none__' ? '' : value,
              }))
            }
          >
            <SelectTrigger className={formSelectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="__none__">Prefiro não informar</SelectItem>
                {SHOE_SIZES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
      <Field className="mt-4">
        <FieldLabel
          className={cn(
            fontMono,
            'text-[0.65rem] font-semibold tracking-[0.14em] text-(--ink) uppercase',
          )}
        >
          Notas para curadoria
        </FieldLabel>
        <Textarea
          value={preferences.notes}
          onChange={(event) =>
            onPreferencesChange((current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          rows={3}
          placeholder="Preferências de cores, estilo, alergias, etc."
          className={cn(
            formInputClass,
            'field-sizing-fixed min-h-24 resize-none',
          )}
        />
      </Field>
    </CheckoutSection>
  )
}
