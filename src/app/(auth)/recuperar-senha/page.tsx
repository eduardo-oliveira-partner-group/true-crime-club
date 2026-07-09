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

export default function RecuperarSenhaPage() {
  const [emailValue, setEmailValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleRecover = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSuccess(false)

    if (!emailValue) {
      setError('E-mail é obrigatório.')
      return
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError('E-mail inválido.')
      return
    }

    setIsLoading(true)

    try {
      await apiClient.auth.recoverPassword({ email: emailValue })
      setIsSuccess(true)
      setEmailValue('')
    } catch (err) {
      console.error(err)
      setError('Falha ao enviar e-mail. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthFormCard
      tabCode="REC"
      tabLabel="Recuperação"
      showPin={true}
      pinColor="var(--yellow)"
      className="rotate-[-0.6deg]"
    >
      <AuthFormHeader eyebrow="Acesso restrito" title="Recuperar senha" />

      <AuthFormMeta left="CLUB · RECUPERAÇÃO" right="Sessão segura" />

      <p className="mt-4 text-sm/6 text-(--ink-soft)">
        Informe seu e-mail registrado para simular o envio de instruções de
        recuperação.
      </p>

      {isSuccess ? (
        <div className="animate-fade-in mt-4 rounded-lg border border-(--teal)/20 bg-(--teal)/10 p-3 [font-family:var(--design-font-body)] text-xs font-medium text-(--teal)">
          Dossiê localizado! As instruções de recuperação foram enviadas para o
          seu e-mail.
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleRecover} noValidate>
        <AuthFormField
          id="email"
          label="E-mail"
          type="email"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          autoComplete="email"
          error={error}
          required
          disabled={isLoading}
        />
        <DesignFormButton disabled={isLoading}>
          {isLoading ? 'Localizando registro...' : 'Enviar link'}
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
