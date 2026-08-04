'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontType,
  transitionCardHover,
} from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

export type FaqAccordionItem = {
  question: string
  answer: string
  code?: string
}

export function FaqAccordion({
  items,
  className,
}: {
  items: FaqAccordionItem[]
  className?: string
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn(
        'flex w-full flex-col gap-4 overflow-visible rounded-none border-0 bg-transparent',
        className,
      )}
    >
      {items.map((item, index) => {
        const value = item.code ?? `faq-${index}`

        return (
          <AccordionItem
            key={value}
            value={value}
            className={cn(
              'overflow-hidden border-0 not-last:border-b-0 data-open:bg-transparent',
              dossierCardSurface,
              cardShadowBase,
              transitionCardHover,
              'hover:-translate-y-0.5 hover:border-(--red)/30 hover:shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3)]',
            )}
          >
            <AccordionTrigger className="items-start gap-4 p-5 hover:no-underline sm:p-6 [&>svg]:mt-0.5 [&>svg]:text-(--red)">
              <div className="flex min-w-0 flex-1 items-start gap-4 text-left">
                {item.code ? (
                  <span
                    className={cn(
                      fontType,
                      'mt-1 shrink-0 text-[11px] font-bold tracking-[0.14em] text-(--red) uppercase',
                    )}
                  >
                    {item.code}
                  </span>
                ) : null}
                <span
                  className={cn(
                    fontHeading,
                    'text-base font-semibold tracking-tight text-(--ink) sm:text-lg',
                  )}
                >
                  {item.question}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent
              className={cn(
                'px-5 pb-5 text-[16px] leading-[1.6] text-(--ink-soft) sm:px-6 sm:pb-6',
                item.code ? 'pl-[3.8rem] sm:pl-[4.8rem]' : 'pt-0',
              )}
            >
              <div className="border-t border-dashed border-[rgba(33,28,24,0.15)] pt-4">
                {item.answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
