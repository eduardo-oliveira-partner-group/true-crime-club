'use client'

import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useState } from 'react'

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
import {
  formatCpf,
  formatPhone,
  isValidCpf,
  isValidPhone,
  normalizeDigits,
} from '@/src/lib/formatters'

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) {
    return '/cliente/perfil'
  }

  const pathname = raw.split(/[?#]/, 1)[0] ?? raw
  if (
    pathname === '/login' ||
    pathname === '/cadastro' ||
    pathname === '/recuperar-senha'
  ) {
    return '/cliente/perfil'
  }

  return raw
}

function CadastroForm() {
  const [nameValue, setNameValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('')
  const [documentValue, setDocumentValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    document?: string
    phone?: string
    general?: string
  }>({})
  const searchParams = useSearchParams()
  const nextPath = safeNextPath(searchParams.get('next'))
  const loginHref =
    nextPath === '/cliente/perfil'
      ? '/login'
      : `/login?next=${encodeURIComponent(nextPath)}`

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    let hasErrors = false
    const currentErrors: typeof errors = {}

    if (!nameValue) {
      currentErrors.name = 'Nome completo é obrigatório.'
      hasErrors = true
    }
    if (!emailValue) {
      currentErrors.email = 'E-mail é obrigatório.'
      hasErrors = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      currentErrors.email = 'E-mail inválido.'
      hasErrors = true
    }
    if (!passwordValue) {
      currentErrors.password = 'Senha é obrigatória.'
      hasErrors = true
    } else if (
      passwordValue.length < 8 ||
      !/[a-z]/.test(passwordValue) ||
      !/[A-Z]/.test(passwordValue) ||
      !/\d/.test(passwordValue)
    ) {
      currentErrors.password =
        'Use 8 caracteres, com maiúscula, minúscula e número.'
      hasErrors = true
    }
    if (confirmPasswordValue !== passwordValue) {
      currentErrors.confirmPassword = 'As senhas precisam ser iguais.'
      hasErrors = true
    }
    const cpfDigits = normalizeDigits(documentValue)
    if (!isValidCpf(documentValue)) {
      currentErrors.document =
        cpfDigits.length === 11 ? 'CPF inválido.' : 'CPF deve ter 11 dígitos.'
      hasErrors = true
    }
    if (!isValidPhone(phoneValue)) {
      currentErrors.phone = 'Telefone deve ter 10 ou 11 dígitos.'
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(currentErrors)
      return
    }

    setIsLoading(true)

    try {
      await apiClient.auth.register({
        name: nameValue,
        email: emailValue,
        password: passwordValue,
        document: cpfDigits,
        phone: normalizeDigits(phoneValue),
      })

      await apiClient.auth.login({
        email: emailValue,
        password: passwordValue,
      })
      await apiClient.auth.me()

      setIsSuccess(true)
      window.location.assign(nextPath)
    } catch (err) {
      console.error(err)
      const message =
        err instanceof Error
          ? err.message
          : 'Falha ao criar conta. Tente novamente.'
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthFormCard
      tabCode="CAD"
      tabLabel="Ingresso"
      showPin={true}
      pinColor="var(--purple)"
      className="rotate-[0.6deg]"
    >
      <AuthFormHeader eyebrow="Ingresso no clube" title="Criar conta" />

      <AuthFormMeta left="CLUB · CADASTRO" right="Novo dossiê" />

      <p className="mt-4 text-sm/6 text-(--ink-soft)">
        Informe seus dados para criar seu cadastro. Ao concluir, você já entra
        no seu dossiê.
      </p>

      {isSuccess ? (
        <div className="mt-4 rounded-lg border border-(--teal)/20 bg-(--teal)/10 p-3 [font-family:var(--design-font-body)] text-xs font-medium text-(--teal)">
          Conta criada com sucesso! Entrando no arquivo...
        </div>
      ) : null}

      {errors.general ? (
        <div className="mt-4 rounded-lg border border-(--red)/20 bg-(--red)/10 p-3 [font-family:var(--design-font-body)] text-xs font-medium text-(--red)">
          {errors.general}
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleRegister} noValidate>
        <AuthFormField
          id="name"
          label="Nome completo"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          autoComplete="name"
          error={errors.name}
          required
          disabled={isLoading || isSuccess}
        />
        <AuthFormField
          id="document"
          label="CPF"
          value={documentValue}
          onChange={(e) => setDocumentValue(formatCpf(e.target.value))}
          autoComplete="off"
          inputMode="numeric"
          maxLength={14}
          error={errors.document}
          required
          disabled={isLoading || isSuccess}
        />
        <AuthFormField
          id="phone"
          label="Telefone"
          type="tel"
          value={phoneValue}
          onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
          autoComplete="tel"
          inputMode="numeric"
          maxLength={15}
          error={errors.phone}
          required
          disabled={isLoading || isSuccess}
        />
        <AuthFormField
          id="email"
          label="E-mail"
          type="email"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          autoComplete="email"
          error={errors.email}
          required
          disabled={isLoading || isSuccess}
        />
        <AuthFormField
          id="password"
          label="Senha"
          type="password"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          autoComplete="new-password"
          error={errors.password}
          required
          disabled={isLoading || isSuccess}
        />
        <AuthFormField
          id="confirm-password"
          label="Confirmar senha"
          type="password"
          value={confirmPasswordValue}
          onChange={(e) => setConfirmPasswordValue(e.target.value)}
          autoComplete="new-password"
          error={errors.confirmPassword}
          required
          disabled={isLoading || isSuccess}
        />
        <DesignFormButton disabled={isLoading || isSuccess}>
          {isLoading
            ? 'Abrindo seu dossiê...'
            : isSuccess
              ? 'Acesso liberado!'
              : 'Abrir meu dossiê'}
          {!isLoading && !isSuccess ? (
            <span className={arrowIconClass} aria-hidden>
              →
            </span>
          ) : null}
        </DesignFormButton>
      </form>

      <AuthFormFooter className="text-center">
        Já tem conta?{' '}
        <Link href={loginHref} className={formLinkClass}>
          Entrar
          <IconArrowRight className="ml-1 inline size-3.5" stroke={1.75} />
        </Link>
      </AuthFormFooter>
    </AuthFormCard>
  )
}

export default function CadastroPage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-(--ink-mute)">Carregando cadastro…</div>
      }
    >
      <CadastroForm />
    </Suspense>
  )
}
