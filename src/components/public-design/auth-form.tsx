import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { DossierCard } from '@/src/components/public-design/dossier-card'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import {
  fontHeading,
  fontType,
  formInputClass,
  formLabelClass,
} from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

type AuthFormCardProps = {
  children: ReactNode
  tabCode: string
  tabLabel: string
  className?: string
  showPin?: boolean
  pinColor?: string
}

export function AuthFormCard({
  children,
  tabCode,
  tabLabel,
  className,
  showPin = true,
  pinColor = 'var(--red)',
}: AuthFormCardProps) {
  return (
    <DossierCard
      tabCode={tabCode}
      tabLabel={tabLabel}
      showPin={showPin}
      pinColor={pinColor}
      className={cn('p-6 sm:p-8', className)}
    >
      {children}
    </DossierCard>
  )
}

type AuthFormHeaderProps = {
  eyebrow: string
  title: string
  icon?: ReactNode
}

export function AuthFormHeader({ eyebrow, title, icon }: AuthFormHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      {icon ? (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) text-(--teal)">
          {icon}
        </span>
      ) : null}
      <div>
        <SectionEyebrow className="mb-3">{eyebrow}</SectionEyebrow>
        <h1
          className={`text-2xl font-semibold tracking-tight text-(--ink) ${fontHeading}`}
        >
          {title}
        </h1>
      </div>
    </div>
  )
}

type AuthFormMetaProps = {
  left: string
  right: string
}

export function AuthFormMeta({ left, right }: AuthFormMetaProps) {
  return (
    <div
      className={`mt-5 flex items-center gap-3 border-y border-dashed border-[rgba(33,28,24,0.15)] py-3 text-[11px] tracking-[0.12em] text-(--ink-mute) uppercase ${fontType}`}
    >
      <span>{left}</span>
      <span className="h-px flex-1 bg-[rgba(33,28,24,0.12)]" />
      <span>{right}</span>
    </div>
  )
}

type AuthFormFieldProps = {
  label: string
  id: string
  error?: string
} & ComponentPropsWithoutRef<'input'>

export function AuthFormField({
  label,
  id,
  className,
  error,
  ...props
}: AuthFormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className={formLabelClass} htmlFor={id}>
          {label}
          {props.required && <span className="ml-0.5 text-(--red)">*</span>}
        </label>
        {error ? (
          <span className="[font-family:var(--design-font-body)] text-[11px] font-medium text-(--red)">
            {error}
          </span>
        ) : null}
      </div>
      <input
        id={id}
        className={cn(
          formInputClass,
          'mt-0',
          error && 'border-(--red)',
          className,
        )}
        {...props}
      />
    </div>
  )
}

type AuthFormFooterProps = {
  children: ReactNode
  className?: string
}

export function AuthFormFooter({ children, className }: AuthFormFooterProps) {
  return (
    <div
      className={cn(
        'mt-6 border-t border-dashed border-[rgba(33,28,24,0.15)] pt-4 text-sm text-(--ink-soft)',
        className,
      )}
    >
      {children}
    </div>
  )
}
