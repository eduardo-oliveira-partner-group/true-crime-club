import { IconEdit, IconMapPin, IconPlus } from '@tabler/icons-react'

import { CheckoutSection } from '@/src/components/checkout/checkout-flow/checkout-section'
import { AddressForm } from '@/src/components/customer/address-form'
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
import { transitionBgColor } from '@/src/lib/design/classes'
import type { Address } from '@/src/lib/domain/types'
import { formatCep } from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

interface AddressStepProps {
  addresses: Address[]
  selectedAddressId: string
  showAddressForm: boolean
  editingAddressId: string | null
  prefillZipCode?: string | null
  onAddressSaved: (addresses: Address[]) => void
  onCancelAddressForm: () => void
  onOpenAddressForm: () => void
  onEditAddress: (addressId: string) => void
  onSelectAddress: (addressId: string) => void
}

export function AddressStep({
  addresses,
  selectedAddressId,
  showAddressForm,
  editingAddressId,
  prefillZipCode,
  onAddressSaved,
  onCancelAddressForm,
  onOpenAddressForm,
  onEditAddress,
  onSelectAddress,
}: AddressStepProps) {
  return (
    <CheckoutSection
      title="Endereço de entrega"
      eyebrow="Endereço"
      code="STEP-02"
    >
      <div className="space-y-3">
        {addresses.length === 0 && !showAddressForm ? (
          <Empty className="border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconMapPin />
              </EmptyMedia>
              <EmptyTitle>Nenhum endereço cadastrado</EmptyTitle>
              <EmptyDescription>
                Cadastre um endereço de entrega para continuar o checkout.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                type="button"
                onClick={onOpenAddressForm}
                className="inline-flex items-center gap-2 rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
              >
                <IconPlus className="size-4" />
                Cadastrar endereço
              </Button>
            </EmptyContent>
          </Empty>
        ) : null}

        {showAddressForm && !editingAddressId ? (
          <AddressForm
            idPrefix="checkout-addr-new"
            initialZipCode={prefillZipCode ?? undefined}
            onSaved={onAddressSaved}
            onCancel={addresses.length > 0 ? onCancelAddressForm : undefined}
          />
        ) : null}

        {addresses.length > 0 ? (
          <RadioGroup
            value={selectedAddressId}
            onValueChange={onSelectAddress}
            className="gap-3"
          >
            {addresses.map((address) =>
              editingAddressId === address.id ? (
                <AddressForm
                  key={address.id}
                  formId={`checkout-address-edit-${address.id}`}
                  idPrefix={`checkout-addr-edit-${address.id}`}
                  address={address}
                  onSaved={onAddressSaved}
                  onCancel={onCancelAddressForm}
                />
              ) : (
                <FieldLabel
                  key={address.id}
                  htmlFor={`address-${address.id}`}
                  className={cn(
                    'w-full rounded-[10px] border transition-colors has-data-checked:bg-(--teal)/8',
                    selectedAddressId === address.id
                      ? 'border-(--teal) bg-(--teal)/8'
                      : 'border-[rgba(33,28,24,0.15)] bg-(--paper-soft) hover:border-(--red)/35',
                  )}
                >
                  <Field
                    orientation="horizontal"
                    className="items-start gap-3 p-4"
                  >
                    <RadioGroupItem
                      value={address.id}
                      id={`address-${address.id}`}
                      className="mt-1"
                    />
                    <FieldContent className="min-w-0 flex-1 gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <FieldTitle className="min-w-0 font-medium text-(--ink)">
                          {address.label}
                        </FieldTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={
                            Boolean(editingAddressId) || showAddressForm
                          }
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            onEditAddress(address.id)
                          }}
                          className={cn(
                            'size-7 shrink-0 rounded-[9px] p-1 text-(--red)',
                            transitionBgColor,
                            'hover:bg-(--red)/10 hover:text-(--red-deep)',
                          )}
                          aria-label={`Editar endereço ${address.label}`}
                        >
                          <IconEdit className="size-3.5" />
                        </Button>
                      </div>
                      <FieldDescription className="text-pretty text-(--ink-soft)">
                        {address.street}, {address.number}
                        {address.complement
                          ? ` (${address.complement})`
                          : ''} — {address.neighborhood} · {address.city}/
                        {address.state} · CEP {formatCep(address.zipCode)}
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ),
            )}
          </RadioGroup>
        ) : null}

        {!showAddressForm && !editingAddressId && addresses.length > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenAddressForm}
            className="inline-flex items-center gap-2 rounded-[9px]"
          >
            <IconPlus className="size-3.5" />
            Adicionar outro endereço
          </Button>
        ) : null}
      </div>
    </CheckoutSection>
  )
}
