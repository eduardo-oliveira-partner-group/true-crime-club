import Link from 'next/link'

import { CheckoutSection } from '@/src/components/checkout/checkout-flow/checkout-section'
import { Button } from '@/src/components/ui/button'
import { fontHeading } from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

export function AccountStep({
  customer,
}: {
  customer: { name: string; email: string } | null
}) {
  return (
    <CheckoutSection
      title="Identificação do assinante"
      eyebrow="Conta"
      code="STEP-01"
    >
      {customer ? (
        <div className="rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-4">
          <p className={cn(fontHeading, 'text-sm font-semibold text-(--ink)')}>
            {customer.name}
          </p>
          <p className="mt-1 text-sm text-(--ink-soft)">{customer.email}</p>
        </div>
      ) : (
        <div className="rounded-[10px] border border-dashed border-(--red)/40 bg-(--red)/8 p-4">
          <p className="text-sm text-(--ink-soft)">
            Faça login para continuar o checkout.
          </p>
        </div>
      )}
      <Button
        asChild
        variant="link"
        className="mt-3 h-auto rounded-[9px] p-0 text-(--red) hover:text-(--red-deep)"
      >
        <Link href="/login">Alterar conta</Link>
      </Button>
    </CheckoutSection>
  )
}
