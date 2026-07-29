'use client'

import {
  IconAlertTriangle,
  IconArrowLeft,
  IconRefresh,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useEffect, useState } from 'react'

import {
  AuthFormCard,
  AuthFormField,
  AuthFormFooter,
  AuthFormHeader,
  AuthFormMeta,
} from '@/src/components/public-design/auth-form'
import {
  DesignButton,
  DesignFormButton,
} from '@/src/components/public-design/design-button'
import { apiClient, ApiClientError } from '@/src/lib/api-client'
import { arrowIconClass, formLinkClass } from '@/src/lib/design/classes'

type ValidationState = 'validating' | 'valid' | 'invalid' | 'error'

function hasApiCode(error: unknown, code: string): boolean {
  return error instanceof ApiClientError && error.code === code
}

function PasswordResetCard({ children }: { children: React.ReactNode }) {
  return (
    <AuthFormCard
      tabCode="RDF"
      tabLabel="Nova senha"
      showPin={true}
      pinColor="var(--teal)"
      className="rotate-[0.6deg]"
    >
      <AuthFormHeader eyebrow="Link de recuperação" title="Redefinir senha" />
      <AuthFormMeta left="CLUB · NOVA SENHA" right="Token protegido" />
      {children}
    </AuthFormCard>
  )
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''
  const [validationState, setValidationState] =
    useState<ValidationState>('validating')
  const [validationError, setValidationError] = useState('')
  const [validationAttempt, setValidationAttempt] = useState(0)
  const [passwordValue, setPasswordValue] = useState('')
  const [confirmationValue, setConfirmationValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    password?: string
    confirmation?: string
    general?: string
  }>({})

  useEffect(() => {
    let isCurrent = true

    if (!token) {
      setValidationState('invalid')
      setValidationError('O link de recuperação não contém um token válido.')
      return () => {
        isCurrent = false
      }
    }

    setValidationState('validating')
    setValidationError('')

    apiClient.auth
      .validatePasswordResetToken({ token })
      .then(({ valid }) => {
        if (!isCurrent) return
        setValidationState(valid ? 'valid' : 'invalid')
        if (!valid) {
          setValidationError('O link de recuperação é inválido ou expirou.')
        }
      })
      .catch((error: unknown) => {
        if (!isCurrent) return

        if (hasApiCode(error, 'TOKEN_INVALIDO')) {
          setValidationState('invalid')
          setValidationError(
            error instanceof Error && error.message
              ? error.message
              : 'O link de recuperação é inválido ou expirou.',
          )
          return
        }

        setValidationState('error')
        setValidationError(
          error instanceof Error && error.message
            ? error.message
            : 'Não foi possível validar o link. Tente novamente.',
        )
      })

    return () => {
      isCurrent = false
    }
  }, [token, validationAttempt])

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})

    const currentErrors: typeof errors = {}

    if (!passwordValue) {
      currentErrors.password = 'Nova senha é obrigatória.'
    } else if (
      passwordValue.length < 8 ||
      !/[a-z]/.test(passwordValue) ||
      !/[A-Z]/.test(passwordValue) ||
      !/\d/.test(passwordValue)
    ) {
      currentErrors.password =
        'Use 8 caracteres, com maiúscula, minúscula e número.'
    }

    if (!confirmationValue) {
      currentErrors.confirmation = 'Confirmação da senha é obrigatória.'
    } else if (confirmationValue !== passwordValue) {
      currentErrors.confirmation =
        'A confirmação da senha não corresponde à nova senha.'
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await apiClient.auth.resetPassword({
        token,
        newPassword: passwordValue,
        passwordConfirmation: confirmationValue,
      })
      router.replace('/login?senha_redefinida=1')
    } catch (error) {
      if (hasApiCode(error, 'TOKEN_INVALIDO')) {
        setPasswordValue('')
        setConfirmationValue('')
        setValidationState('invalid')
        setValidationError(
          error instanceof Error && error.message
            ? error.message
            : 'O link de recuperação é inválido ou expirou.',
        )
      } else if (hasApiCode(error, 'SENHAS_DIVERGENTES')) {
        setErrors({
          confirmation:
            error instanceof Error && error.message
              ? error.message
              : 'A confirmação da senha não corresponde à nova senha.',
        })
      } else {
        setErrors({
          general:
            error instanceof Error && error.message
              ? error.message
              : 'Não foi possível redefinir a senha. Tente novamente.',
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (validationState === 'validating') {
    return (
      <PasswordResetCard>
        <div
          className="mt-6 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-4 text-sm text-(--ink-soft)"
          role="status"
          aria-live="polite"
        >
          Validando a segurança do seu link…
        </div>
      </PasswordResetCard>
    )
  }

  if (validationState === 'invalid') {
    return (
      <PasswordResetCard>
        <div
          className="mt-6 rounded-[10px] border border-(--red)/20 bg-(--red)/10 p-4 text-sm/6 text-(--red-deep)"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <IconAlertTriangle
              className="mt-0.5 size-5 shrink-0"
              stroke={1.75}
              aria-hidden
            />
            <p>{validationError}</p>
          </div>
        </div>
        <div className="mt-5">
          <DesignButton href="/recuperar-senha" showArrow className="w-full">
            Solicitar novo link
          </DesignButton>
        </div>
        <AuthFormFooter>
          <Link
            href="/login"
            className={`inline-flex items-center gap-1 ${formLinkClass}`}
          >
            <IconArrowLeft className="size-4" stroke={1.75} />
            Voltar ao login
          </Link>
        </AuthFormFooter>
      </PasswordResetCard>
    )
  }

  if (validationState === 'error') {
    return (
      <PasswordResetCard>
        <div
          className="mt-6 rounded-[10px] border border-(--yellow)/40 bg-(--yellow)/10 p-4 text-sm/6 text-(--ink-soft)"
          role="alert"
        >
          {validationError}
        </div>
        <div className="mt-5 space-y-3">
          <DesignFormButton
            type="button"
            onClick={() => setValidationAttempt((attempt) => attempt + 1)}
          >
            <IconRefresh className="size-4" stroke={1.75} aria-hidden />
            Tentar validar novamente
          </DesignFormButton>
          <DesignButton
            href="/recuperar-senha"
            variant="secondary"
            className="w-full"
          >
            Solicitar novo link
          </DesignButton>
        </div>
      </PasswordResetCard>
    )
  }

  return (
    <PasswordResetCard>
      <p className="mt-4 text-sm/6 text-(--ink-soft)">
        Link validado. Crie uma nova senha para recuperar o acesso ao seu
        dossiê.
      </p>

      {errors.general ? (
        <div
          className="mt-4 rounded-lg border border-(--red)/20 bg-(--red)/10 p-3 [font-family:var(--design-font-body)] text-xs font-medium text-(--red-deep)"
          role="alert"
        >
          {errors.general}
        </div>
      ) : null}

      <form
        className="mt-6 space-y-5"
        onSubmit={handleResetPassword}
        noValidate
      >
        <AuthFormField
          id="new-password"
          label="Nova senha"
          type="password"
          name="new-password"
          value={passwordValue}
          onChange={(event) => {
            setPasswordValue(event.target.value)
            setErrors((current) => ({
              ...current,
              password: undefined,
              general: undefined,
            }))
          }}
          autoComplete="new-password"
          error={errors.password}
          required
          disabled={isSubmitting}
        />
        <AuthFormField
          id="confirm-password"
          label="Confirmar nova senha"
          type="password"
          name="confirm-password"
          value={confirmationValue}
          onChange={(event) => {
            setConfirmationValue(event.target.value)
            setErrors((current) => ({
              ...current,
              confirmation: undefined,
              general: undefined,
            }))
          }}
          autoComplete="new-password"
          error={errors.confirmation}
          required
          disabled={isSubmitting}
        />
        <p className="text-xs/5 text-(--ink-mute)">
          Use pelo menos 8 caracteres, incluindo letra maiúscula, letra
          minúscula e número.
        </p>
        <DesignFormButton disabled={isSubmitting}>
          {isSubmitting ? 'Redefinindo senha...' : 'Redefinir senha'}
          {!isSubmitting ? (
            <span className={arrowIconClass} aria-hidden>
              →
            </span>
          ) : null}
        </DesignFormButton>
      </form>

      <AuthFormFooter>
        <Link
          href="/login"
          className={`inline-flex items-center gap-1 ${formLinkClass}`}
        >
          <IconArrowLeft className="size-4" stroke={1.75} />
          Voltar ao login
        </Link>
      </AuthFormFooter>
    </PasswordResetCard>
  )
}

function ResetPasswordFallback() {
  return (
    <PasswordResetCard>
      <div
        className="mt-6 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-4 text-sm text-(--ink-soft)"
        role="status"
      >
        Preparando a validação do link…
      </div>
    </PasswordResetCard>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
