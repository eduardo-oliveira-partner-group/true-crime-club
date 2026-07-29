'use client'

import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'

import {
  AuthFormCard,
  AuthFormField,
  AuthFormFooter,
  AuthFormHeader,
  AuthFormMeta,
} from '@/src/components/public-design/auth-form'
import { DesignFormButton } from '@/src/components/public-design/design-button'
import { apiClient } from '@/src/lib/api-client'
import { arrowIconClass, formLinkClass } from '@/src/lib/design/classes'

const SUCCESS_MESSAGE =
  'Se o e-mail estiver cadastrado, enviaremos as instruções.'

export default function RecuperarSenhaPage() {
  const [emailValue, setEmailValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [generalError, setGeneralError] = useState('')

  const handleRequestReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEmailError('')
    setGeneralError('')
    setIsSuccess(false)

    const email = emailValue.trim()

    if (!email) {
      setEmailError('E-mail é obrigatório.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('E-mail inválido.')
      return
    }

    setIsLoading(true)

    try {
      await apiClient.auth.requestPasswordReset({ email })
      setIsSuccess(true)
      setEmailValue('')
    } catch (error) {
      setGeneralError(
        error instanceof Error && error.message
          ? error.message
          : 'Não foi possível enviar o link. Tente novamente.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthFormCard
      tabCode="ESQ"
      tabLabel="Recuperação"
      showPin={true}
      pinColor="var(--yellow)"
      className="rotate-[-0.6deg]"
    >
      <AuthFormHeader eyebrow="Acesso ao clube" title="Esqueci minha senha" />

      <AuthFormMeta left="CLUB · RECUPERAÇÃO" right="Link seguro" />

      <p className="mt-4 text-sm/6 text-(--ink-soft)">
        Informe o e-mail da sua conta. Se ele estiver cadastrado, enviaremos as
        instruções para criar uma nova senha.
      </p>

      {isSuccess ? (
        <div
          className="mt-4 rounded-lg border border-(--teal)/20 bg-(--teal)/10 p-3 [font-family:var(--design-font-body)] text-xs font-medium text-(--teal-deep)"
          role="status"
          aria-live="polite"
        >
          {SUCCESS_MESSAGE}
        </div>
      ) : null}

      {generalError ? (
        <div
          className="mt-4 rounded-lg border border-(--red)/20 bg-(--red)/10 p-3 [font-family:var(--design-font-body)] text-xs font-medium text-(--red-deep)"
          role="alert"
        >
          {generalError}
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleRequestReset} noValidate>
        <AuthFormField
          id="email"
          label="E-mail"
          type="email"
          name="email"
          value={emailValue}
          onChange={(event) => {
            setEmailValue(event.target.value)
            setEmailError('')
            setGeneralError('')
            setIsSuccess(false)
          }}
          autoComplete="email"
          error={emailError}
          required
          disabled={isLoading}
        />
        <DesignFormButton disabled={isLoading}>
          {isLoading ? 'Enviando instruções...' : 'Enviar link'}
          {!isLoading ? (
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
    </AuthFormCard>
  )
}
