import { IconTruck } from '@tabler/icons-react'

import { CheckoutSection } from '@/src/components/checkout/checkout-flow/checkout-section'
import type { CheckoutShippingOption } from '@/src/components/checkout/checkout-flow/types'
import { Badge } from '@/src/components/ui/badge'
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
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/src/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group'
import { Skeleton } from '@/src/components/ui/skeleton'
import { Spinner } from '@/src/components/ui/spinner'
import { fontHeading } from '@/src/lib/design/classes'
import {
  formatBusinessDays,
  formatCep,
  formatCurrency,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

interface ShippingStepProps {
  options: CheckoutShippingOption[]
  selectedShippingId: string
  selectedZipCode?: string
  loading: boolean
  error: string | null
  cheapestPrice: number | null
  fastestDays: number | null
  onSelectShipping: (optionId: string) => void
  onRetry: (zipCode: string) => void
}

export function ShippingStep({
  options,
  selectedShippingId,
  selectedZipCode,
  loading,
  error,
  cheapestPrice,
  fastestDays,
  onSelectShipping,
  onRetry,
}: ShippingStepProps) {
  return (
    <CheckoutSection title="Frete" eyebrow="Envio" code="STEP-03">
      {loading ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner />
            Consultando opções de frete para o CEP informado…
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : error ? (
        <Empty className="border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconTruck />
            </EmptyMedia>
            <EmptyTitle>Frete indisponível</EmptyTitle>
            <EmptyDescription>{error}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!selectedZipCode}
              onClick={() => {
                if (selectedZipCode) onRetry(selectedZipCode)
              }}
              className="rounded-[9px]"
            >
              Tentar novamente
            </Button>
          </EmptyContent>
        </Empty>
      ) : options.length === 0 ? (
        <Empty className="border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconTruck />
            </EmptyMedia>
            <EmptyTitle>Nenhuma opção de frete</EmptyTitle>
            <EmptyDescription>
              Selecione um endereço com CEP válido para cotar o envio.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <FieldSet className="gap-4">
          <FieldLegend variant="label">Escolha a forma de envio</FieldLegend>
          <FieldDescription>
            Preços e prazos calculados para o CEP{' '}
            {selectedZipCode ? formatCep(selectedZipCode) : '—'}.
          </FieldDescription>
          <RadioGroup
            value={selectedShippingId}
            onValueChange={onSelectShipping}
            className="gap-3"
          >
            {options.map((option) => {
              const optionId = `shipping-${option.id}`
              const isCheapest =
                cheapestPrice != null && option.price === cheapestPrice
              const isFastest =
                fastestDays != null && option.estimatedDays === fastestDays

              return (
                <FieldLabel
                  key={option.id}
                  htmlFor={optionId}
                  className={cn(
                    'w-full rounded-[10px] border transition-colors has-data-checked:bg-(--teal)/8',
                    selectedShippingId === option.id
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
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                          <FieldTitle className="min-w-0 font-medium text-(--ink)">
                            {option.label}
                          </FieldTitle>
                          {option.carrier ? (
                            <Badge variant="secondary">{option.carrier}</Badge>
                          ) : null}
                          {isFastest ? (
                            <Badge className="border-transparent bg-(--teal)/15 text-(--teal-deep)">
                              Mais rápida
                            </Badge>
                          ) : null}
                          {isCheapest ? (
                            <Badge className="border-transparent bg-(--amber)/20 text-(--ink-soft)">
                              Mais econômica
                            </Badge>
                          ) : null}
                        </div>
                        <span
                          className={cn(
                            fontHeading,
                            'shrink-0 text-sm font-bold text-(--ink)',
                          )}
                        >
                          {option.price === 0
                            ? 'Grátis'
                            : formatCurrency(option.price)}
                        </span>
                      </div>
                      <FieldDescription className="text-pretty text-(--ink-soft)">
                        Prazo estimado:{' '}
                        {formatBusinessDays(option.estimatedDays)}
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              )
            })}
          </RadioGroup>
        </FieldSet>
      )}
    </CheckoutSection>
  )
}
