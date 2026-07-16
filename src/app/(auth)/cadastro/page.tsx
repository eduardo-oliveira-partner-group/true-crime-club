'use client'

import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

export default function CadastroPage() {
  const [nameValue, setNameValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [documentValue, setDocumentValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    document?: string
    phone?: string
    general?: string
  }>({})
  const router = useRouter()

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
      passwordValue.length < 12 ||
      !/[a-z]/.test(passwordValue) ||
      !/[A-Z]/.test(passwordValue) ||
      !/\d/.test(passwordValue)
    ) {
      currentErrors.password =
        'Use 12 caracteres, com maiúscula, minúscula e número.'
      hasErrors = true
    }
    const cpfDigits = documentValue.replace(/\D/g, '')
    const cpfHasValidLength = cpfDigits.length === 11
    const cpfHasRepeatedDigits = /^(\d)\1{10}$/.test(cpfDigits)
    const firstDigit = cpfHasValidLength
      ? ((cpfDigits
          .slice(0, 9)
          .split('')
          .reduce(
            (total, digit, index) => total + Number(digit) * (10 - index),
            0,
          ) *
          10) %
          11) %
        10
      : -1
    const secondDigit = cpfHasValidLength
      ? ((cpfDigits
          .slice(0, 10)
          .split('')
          .reduce(
            (total, digit, index) => total + Number(digit) * (11 - index),
            0,
          ) *
          10) %
          11) %
        10
      : -1
    const cpfIsValid =
      cpfHasValidLength &&
      !cpfHasRepeatedDigits &&
      cpfDigits.endsWith(`${firstDigit}${secondDigit}`)

    if (!cpfIsValid) {
      currentErrors.document = cpfHasValidLength
        ? 'CPF inválido.'
        : 'CPF deve ter 11 dígitos.'
      hasErrors = true
    }
    const phoneDigits = phoneValue.replace(/\D/g, '')
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
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
        document: documentValue,
        phone: phoneValue,
      })

      setIsSuccess(true)

      setTimeout(() => {
        router.replace('/login')
      }, 800)
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
        Informe seus dados para criar seu cadastro. Você entrará após confirmar
        o login.
      </p>

      {isSuccess ? (
        <div className="mt-4 rounded-lg border border-(--teal)/20 bg-(--teal)/10 p-3 [font-family:var(--design-font-body)] text-xs font-medium text-(--teal)">
          Conta criada com sucesso! Redirecionando para o login...
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
          onChange={(e) => setDocumentValue(e.target.value)}
          autoComplete="off"
          error={errors.document}
          required
          disabled={isLoading || isSuccess}
        />
        <AuthFormField
          id="phone"
          label="Telefone"
          type="tel"
          value={phoneValue}
          onChange={(e) => setPhoneValue(e.target.value)}
          autoComplete="tel"
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
        <DesignFormButton disabled={isLoading || isSuccess}>
          {isLoading
            ? 'Registrando informações...'
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
        <Link href="/login" className={formLinkClass}>
          Entrar
          <IconArrowRight className="ml-1 inline size-3.5" stroke={1.75} />
        </Link>
      </AuthFormFooter>
    </AuthFormCard>
  )
}
