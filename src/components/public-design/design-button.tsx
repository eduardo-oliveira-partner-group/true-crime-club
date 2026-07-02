import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import {
  arrowIconClass,
  ctaButtonBase,
  fontMono,
  transitionBgColor,
  transitionColors,
  transitionLift,
} from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

type DesignButtonVariant = 'primary' | 'secondary' | 'hero-outline' | 'ink'

type DesignButtonProps = {
  variant?: DesignButtonVariant
  showArrow?: boolean
  children: ReactNode
  className?: string
} & ComponentPropsWithoutRef<'a'>

const variantClasses: Record<DesignButtonVariant, string> = {
  primary: `gap-2 border border-[rgba(33,28,24,0.15)] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:-translate-y-0.5 hover:bg-(--red-deep) hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)]`,
  secondary: `rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-transparent px-4 py-[15px] text-(--ink) ${transitionBgColor} hover:bg-(--ink) hover:text-[#fbf9f6]`,
  'hero-outline': `border border-white/40 bg-transparent text-[#f4ecdc] hover:bg-[#fbf9f6] hover:text-(--ink)`,
  ink: `rounded-lg border border-[rgba(33,28,24,0.15)] bg-(--ink) px-[18px] py-[11px] text-[13px] text-[#fbf9f6] shadow-[0_6px_16px_-6px_rgba(33,28,24,0.18)] hover:-translate-y-0.5 hover:shadow-[0_11px_24px_-8px_rgba(33,28,24,0.22)]`,
}

/** Design-system CTA button (renders as anchor). */
export function DesignButton({
  variant = 'primary',
  showArrow = false,
  children,
  className,
  ...props
}: DesignButtonProps) {
  const base =
    variant === 'secondary' || variant === 'ink'
      ? `${fontMono} inline-flex items-center justify-center text-[14px] leading-none font-bold tracking-[0.04em] uppercase no-underline ${variant === 'ink' ? transitionColors : transitionBgColor}`
      : `${ctaButtonBase} group`

  return (
    <a className={cn(base, variantClasses[variant], className)} {...props}>
      {children}
      {showArrow ? (
        <span className={arrowIconClass} aria-hidden>
          →
        </span>
      ) : null}
    </a>
  )
}

type DesignFormButtonProps = {
  children: ReactNode
  className?: string
} & ComponentPropsWithoutRef<'button'>

/** Primary submit button for forms (renders as button). */
export function DesignFormButton({
  children,
  className,
  type = 'submit',
  ...props
}: DesignFormButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        `${ctaButtonBase} group w-full gap-2 border border-[rgba(33,28,24,0.15)] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:-translate-y-0.5 hover:bg-(--red-deep) hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0`,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/** Compact action button with lift shadow. */
export function DesignActionButton({
  children,
  className,
  ...props
}: Omit<DesignButtonProps, 'variant' | 'showArrow'>) {
  return (
    <a
      className={cn(
        `inline-flex items-center gap-2 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--red) px-[22px] py-[14px] text-[13px] leading-none font-bold tracking-[0.04em] text-[#fbf9f6] uppercase no-underline ${transitionLift} hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)] ${fontMono} group`,
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
