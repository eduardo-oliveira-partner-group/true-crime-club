'use client'

import { IconArrowLeft, IconArrowRight, IconPackage } from '@tabler/icons-react'

import { AccountStep } from '@/src/components/checkout/checkout-flow/account-step'
import { AddressStep } from '@/src/components/checkout/checkout-flow/address-step'
import { CheckoutOrderSummary } from '@/src/components/checkout/checkout-flow/order-summary'
import { PaymentStep } from '@/src/components/checkout/checkout-flow/payment-step'
import { PreferencesStep } from '@/src/components/checkout/checkout-flow/preferences-step'
import { CheckoutProcessingDialog } from '@/src/components/checkout/checkout-flow/processing-dialog'
import { ReviewStep } from '@/src/components/checkout/checkout-flow/review-step'
import { ShippingStep } from '@/src/components/checkout/checkout-flow/shipping-step'
import { checkoutSteps } from '@/src/components/checkout/checkout-flow/step-definitions'
import { CheckoutStepIndicator } from '@/src/components/checkout/checkout-flow/step-indicator'
import type { CheckoutStepperProps } from '@/src/components/checkout/checkout-flow/types'
import { useCheckoutFlow } from '@/src/components/checkout/checkout-flow/use-checkout-flow'
import { Step, Stepper } from '@/src/components/ui/stepper'
import {
  dossierCardSurface,
  fontHeading,
  fontMono,
  warmShadowClass,
} from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

export type {
  CheckoutPaymentOption,
  CheckoutShippingOption,
  SubscriberPreferencesValue,
} from '@/src/components/checkout/checkout-flow/types'

export function CheckoutStepper({
  customer,
  addresses,
  paymentOptions,
  shippingOptions,
  isSubscriptionFlow,
  planId,
  planName,
  planPrice,
  cartItems,
  subtotalAmount,
  discountAmount,
  shippingPrice,
  totalAmount,
  initialPreferences,
  onSavePreferences,
  onCreateOrder,
}: CheckoutStepperProps) {
  const flow = useCheckoutFlow({
    addresses,
    paymentOptions,
    shippingOptions,
    shippingPrice,
    totalAmount,
    isSubscriptionFlow,
    planId,
    planName,
    initialPreferences,
    onSavePreferences,
    onCreateOrder,
    hasCustomer: Boolean(customer),
  })
  const activeStep = checkoutSteps[flow.currentStep - 1]
  const ActiveStepIcon = activeStep?.Icon ?? IconPackage
  const installmentCount =
    flow.selectedPayment?.type === 'credit_card' ? flow.installments : 1

  return (
    <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
      <CheckoutProcessingDialog
        open={flow.submitting}
        message={flow.processingMessage}
      />

      <div className="order-2 space-y-7 lg:order-1">
        <div className={cn(dossierCardSurface, warmShadowClass)}>
          <div className="flex items-center justify-between gap-4 border-b border-[rgba(33,28,24,0.12)] px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) text-(--red)">
                <ActiveStepIcon className="size-5" />
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    fontHeading,
                    'truncate text-base font-semibold text-(--ink) sm:text-lg',
                  )}
                >
                  {activeStep?.label}
                </p>
                <p
                  className={cn(
                    fontMono,
                    'mt-1 text-[0.58rem] tracking-[0.14em] text-(--red) uppercase sm:hidden',
                  )}
                >
                  Etapa {activeStep?.code} de 06
                </p>
              </div>
            </div>
            <p
              className={cn(
                fontMono,
                'shrink-0 text-[0.6rem] tracking-[0.14em] text-(--ink-mute) uppercase max-sm:hidden',
              )}
            >
              {activeStep?.code}/06
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <Stepper
              key={flow.stepperKey}
              initialStep={flow.currentStep}
              onStepChange={flow.handleStepChange}
              onFinalStepCompleted={flow.handleFinalStepCompleted}
              canNavigateToStep={flow.canNavigateToStep}
              onInvalidStepNavigation={flow.handleInvalidStepNavigation}
              stepCircleContainerClassName="space-y-6"
              stepContainerClassName="pb-5"
              contentClassName="pb-3"
              footerClassName="border-t border-[rgba(33,28,24,0.12)] pt-5"
              backButtonText={
                <>
                  <IconArrowLeft className="size-4" />
                  Voltar
                </>
              }
              nextButtonText={
                <>
                  Avançar
                  <IconArrowRight className="size-4" />
                </>
              }
              completeButtonText={
                flow.submitting ? (
                  'Finalizando…'
                ) : (
                  <>
                    Finalizar pedido
                    <IconArrowRight className="size-4" />
                  </>
                )
              }
              backButtonProps={{ disabled: flow.submitting }}
              nextButtonProps={{
                disabled: flow.submitting || !flow.canAdvance,
                className: flow.isLastStep ? 'is-complete' : undefined,
              }}
              renderStepIndicator={(props) => (
                <CheckoutStepIndicator {...props} />
              )}
            >
              <Step>
                <AccountStep customer={customer} />
              </Step>
              <Step>
                <AddressStep
                  addresses={flow.addresses}
                  selectedAddressId={flow.selectedAddressId}
                  showAddressForm={flow.showAddressForm}
                  editingAddressId={flow.editingAddressId}
                  prefillZipCode={flow.prefillZipCode}
                  onAddressSaved={flow.handleAddressSaved}
                  onCancelAddressForm={flow.resetAddressForm}
                  onOpenAddressForm={flow.openNewAddressForm}
                  onEditAddress={flow.startEditingAddress}
                  onSelectAddress={flow.handleSelectAddress}
                />
              </Step>
              <Step>
                <ShippingStep
                  options={flow.shippingOptions}
                  selectedShippingId={flow.selectedShippingId}
                  selectedZipCode={flow.selectedZipCode}
                  loading={flow.shippingLoading}
                  error={flow.shippingError}
                  cheapestPrice={flow.cheapestShippingPrice}
                  fastestDays={flow.fastestShippingDays}
                  onSelectShipping={flow.handleSelectShipping}
                  onRetry={(zipCode) => {
                    void flow.refreshShipping(zipCode)
                  }}
                />
              </Step>
              <Step>
                <PaymentStep
                  options={flow.paymentOptions}
                  selectedPayment={flow.selectedPayment}
                  selectedPaymentId={flow.selectedPaymentId}
                  showCardForm={flow.showCardForm}
                  installments={flow.installments}
                  maxInstallments={flow.maxInstallments}
                  totalAmount={flow.totalAmount}
                  onSelectPayment={flow.setSelectedPaymentId}
                  onCardSaved={flow.handleCardSaved}
                  onShowCardFormChange={flow.setShowCardForm}
                  onInstallmentsChange={flow.setInstallments}
                />
              </Step>
              <Step>
                <PreferencesStep
                  planName={planName}
                  preferences={flow.preferences}
                  onPreferencesChange={flow.setPreferences}
                />
              </Step>
              <Step>
                <ReviewStep
                  address={flow.selectedAddress}
                  shipping={flow.selectedShipping}
                  payment={flow.selectedPayment}
                  preferences={flow.preferences}
                  installments={flow.installments}
                  totalAmount={flow.totalAmount}
                  error={flow.error}
                />
              </Step>
            </Stepper>

            {flow.navigationHint ? (
              <p
                id="checkout-step-navigation-hint"
                role="status"
                className="mt-3 text-sm text-(--ink-soft)"
              >
                {flow.navigationHint}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <aside className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-24">
          <CheckoutOrderSummary
            isSubscriptionFlow={isSubscriptionFlow}
            isAnnualSubscription={flow.isAnnualPlan}
            planName={planName}
            planPrice={planPrice}
            items={cartItems}
            subtotalAmount={subtotalAmount}
            discountAmount={discountAmount}
            shippingPrice={flow.shippingPrice}
            shippingLoading={flow.shippingLoading}
            shippingQuoted={flow.hasSelectedShipping}
            totalAmount={flow.totalAmount}
            installmentsCount={installmentCount}
            installmentValue={Math.round(flow.totalAmount / installmentCount)}
          />
        </div>
      </aside>
    </div>
  )
}
