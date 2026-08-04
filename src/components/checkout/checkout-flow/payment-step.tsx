import { IconCreditCard, IconPlus } from '@tabler/icons-react'

import { CheckoutSection } from '@/src/components/checkout/checkout-flow/checkout-section'
import type { CheckoutPaymentOption } from '@/src/components/checkout/checkout-flow/types'
import { CardForm } from '@/src/components/customer/card-form'
import { Button } from '@/src/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/ui/empty'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/src/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select'
import { fontMono, formSelectTriggerClass } from '@/src/lib/design/classes'
import type { PaymentMethod } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

interface PaymentStepProps {
  options: CheckoutPaymentOption[]
  selectedPayment: CheckoutPaymentOption | undefined
  selectedPaymentId: string
  showCardForm: boolean
  installments: number
  maxInstallments: number
  totalAmount: number
  onSelectPayment: (optionId: string) => void
  onCardSaved: (card: PaymentMethod) => void
  onShowCardFormChange: (show: boolean) => void
  onInstallmentsChange: (installments: number) => void
}

export function PaymentStep({
  options,
  selectedPayment,
  selectedPaymentId,
  showCardForm,
  installments,
  maxInstallments,
  totalAmount,
  onSelectPayment,
  onCardSaved,
  onShowCardFormChange,
  onInstallmentsChange,
}: PaymentStepProps) {
  return (
    <CheckoutSection title="Pagamento" eyebrow="Cobrança" code="STEP-04">
      <div className="space-y-3">
        {options.length === 0 && !showCardForm ? (
          <Empty className="border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconCreditCard />
              </EmptyMedia>
              <EmptyTitle>Nenhuma forma de pagamento</EmptyTitle>
              <EmptyDescription>
                Cadastre um cartão de crédito para finalizar o pedido.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                type="button"
                onClick={() => onShowCardFormChange(true)}
                className="inline-flex items-center gap-2 rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
              >
                <IconPlus className="size-4" />
                Cadastrar cartão
              </Button>
            </EmptyContent>
          </Empty>
        ) : null}

        {options.length > 0 ? (
          <RadioGroup
            value={selectedPaymentId}
            onValueChange={onSelectPayment}
            className="gap-3"
          >
            {options.map((option) => {
              const optionId = `payment-${option.id}`

              return (
                <FieldLabel
                  key={option.id}
                  htmlFor={optionId}
                  className={cn(
                    'w-full rounded-[10px] border transition-colors has-data-checked:bg-(--teal)/8',
                    selectedPaymentId === option.id
                      ? 'border-(--teal) bg-(--teal)/8'
                      : 'border-[rgba(33,28,24,0.15)] bg-(--paper-soft) hover:border-(--red)/35',
                  )}
                >
                  <Field
                    orientation="horizontal"
                    className="items-start gap-3 p-4"
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={optionId}
                      className="mt-1"
                    />
                    <FieldContent className="min-w-0 flex-1 gap-2">
                      <FieldTitle className="font-medium text-(--ink)">
                        {option.label}
                      </FieldTitle>
                      <FieldDescription className="text-pretty text-(--ink-soft)">
                        {option.type === 'pix'
                          ? 'Pagamento via Pix'
                          : 'Cartão de crédito'}
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              )
            })}
          </RadioGroup>
        ) : null}

        {showCardForm ? (
          <CardForm
            idPrefix="checkout-card"
            onSaved={onCardSaved}
            onCancel={
              options.length > 0 ? () => onShowCardFormChange(false) : undefined
            }
          />
        ) : options.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onShowCardFormChange(true)}
            className="inline-flex items-center gap-2 rounded-[9px]"
          >
            <IconPlus className="size-3.5" />
            Adicionar cartão
          </Button>
        ) : null}
      </div>

      {selectedPayment?.type === 'credit_card' && maxInstallments > 1 ? (
        <Field className="mt-4">
          <FieldLabel
            className={cn(
              fontMono,
              'text-[0.65rem] font-semibold tracking-[0.14em] text-(--ink) uppercase',
            )}
          >
            Quantidade de parcelas
          </FieldLabel>
          <Select
            value={String(installments)}
            onValueChange={(value) => onInstallmentsChange(Number(value))}
          >
            <SelectTrigger className={formSelectTriggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {Array.from(
                  { length: maxInstallments },
                  (_, index) => index + 1,
                ).map((count) => (
                  <SelectItem key={count} value={String(count)}>
                    {count}x de{' '}
                    {formatCurrency(Math.round(totalAmount / count))}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      ) : null}
      <p className="mt-4 text-[0.7rem]/5 text-(--ink-mute)">
        O cartão é tokenizado no gateway ativo antes de ser salvo.
      </p>
    </CheckoutSection>
  )
}
