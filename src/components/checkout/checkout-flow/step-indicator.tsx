import { IconCheck, IconPackage } from '@tabler/icons-react'

import { checkoutSteps } from '@/src/components/checkout/checkout-flow/step-definitions'
import type { StepperStepIndicatorProps } from '@/src/components/ui/stepper'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip'
import { fontHeading, fontMono } from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

export function CheckoutStepIndicator({
  step,
  currentStep,
  onStepClick,
  isNavigable,
}: StepperStepIndicatorProps) {
  const stepMeta = checkoutSteps[step - 1]
  const StepIcon = stepMeta?.Icon ?? IconPackage
  const status =
    currentStep === step
      ? 'active'
      : currentStep < step
        ? 'inactive'
        : 'complete'

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onStepClick(step)}
            aria-disabled={!isNavigable}
            aria-describedby={
              !isNavigable ? 'checkout-step-navigation-hint' : undefined
            }
            aria-label={`Etapa ${stepMeta?.code} — ${stepMeta?.label}`}
            aria-current={status === 'active' ? 'step' : undefined}
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-[10px] border transition-colors focus-visible:ring-2 focus-visible:ring-(--red)/25 focus-visible:outline-none',
              status === 'active'
                ? 'border-(--red) bg-(--red)/10 text-(--red)'
                : status === 'complete'
                  ? 'border-(--teal) bg-(--teal) text-[#fbf9f6]'
                  : isNavigable
                    ? 'border-[rgba(33,28,24,0.15)] text-(--ink-mute) hover:border-(--red)/35 hover:text-(--red)'
                    : 'cursor-not-allowed border-[rgba(33,28,24,0.1)] text-(--ink-mute)/55',
            )}
          >
            {status === 'complete' ? (
              <IconCheck className="size-4" />
            ) : (
              <StepIcon className="size-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border-[rgba(33,28,24,0.15)] bg-[#fbf9f6] text-[#211c18]"
        >
          <span
            className={cn(
              fontMono,
              'text-[0.6rem] tracking-[0.14em] text-[#c5271f] uppercase',
            )}
          >
            {stepMeta?.code}/06
          </span>
          <span
            className={cn(
              fontHeading,
              'mt-1 block text-sm font-semibold text-[#211c18]',
            )}
          >
            {stepMeta?.label}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
