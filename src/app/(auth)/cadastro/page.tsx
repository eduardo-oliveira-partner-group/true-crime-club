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
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
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
    }
    if (!passwordValue) {
      currentErrors.password = 'Senha é obrigatória.'
      hasErrors = true
    } else if (passwordValue.length < 6) {
      currentErrors.password = 'A senha deve ter no mínimo 6 caracteres.'
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(currentErrors)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API registration latency
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Auto login
      await apiClient.auth.login({ email: emailValue })
      localStorage.setItem('isLoggedIn', 'true')

      setIsSuccess(true)

      setTimeout(() => {
        router.push('/cliente/pedidos')
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
        Cadastro simulado para validação da jornada e criação de dossiê pessoal.
      </p>

      {isSuccess ? (
        <div className="mt-4 rounded-lg border border-(--teal)/20 bg-(--teal)/10 p-3 [font-family:var(--design-font-body)] text-xs font-medium text-(--teal)">
          Conta criada com sucesso! Redirecionando para o painel...
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
              : 'Abrir meu dossiê (mock)'}
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
