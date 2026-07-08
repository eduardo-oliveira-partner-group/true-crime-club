'use client'

import { IconArrowRight, IconLock } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

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

export default function LoginPage() {
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    general?: string
  }>({})
  const router = useRouter()

  useEffect(() => {
    apiClient.auth
      .me()
      .then((customer) => {
        if (customer && customer.email) {
          setEmailValue(customer.email)
        }
      })
      .catch(() => {})
  }, [])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    let hasErrors = false
    const currentErrors: typeof errors = {}

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
    }

    if (hasErrors) {
      setErrors(currentErrors)
      return
    }

    setIsLoading(true)

    try {
      // Simulate slight network latency to let user feel the interaction
      await new Promise((resolve) => setTimeout(resolve, 800))
      await apiClient.auth.login({ email: emailValue, password: passwordValue })
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/cliente/pedidos')
    } catch (err) {
      console.error(err)
      const message =
        err instanceof Error
          ? err.message
          : 'Falha ao autenticar. Tente novamente.'
      setErrors({ general: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthFormCard
      tabCode="LOGIN"
      tabLabel="Acesso"
      showPin={true}
      pinColor="var(--red)"
      className="rotate-[-0.6deg]"
    >
      <AuthFormHeader eyebrow="Acesso restrito" title="Entrar no arquivo" />

      <AuthFormMeta left="CLUB · LOGIN" right="Sessão segura" />

      <p className="mt-4 text-sm/6 text-(--ink-soft)">
        Autenticação mockada — use qualquer e-mail e senha para simular o acesso
        ao seu dossiê pessoal.
      </p>

      {errors.general ? (
        <div className="mt-4 rounded-lg border border-(--red)/20 bg-(--red)/10 p-3 [font-family:var(--design-font-body)] text-xs font-medium text-(--red)">
          {errors.general}
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleLogin} noValidate>
        <AuthFormField
          id="email"
          label="E-mail"
          type="email"
          name="email"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          autoComplete="email"
          error={errors.email}
          required
          disabled={isLoading}
        />
        <AuthFormField
          id="password"
          label="Senha"
          type="password"
          name="password"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          autoComplete="current-password"
          error={errors.password}
          required
          disabled={isLoading}
        />
        <DesignFormButton disabled={isLoading}>
          <IconLock className="size-4" stroke={1.75} />
          {isLoading ? 'Acessando arquivo...' : 'Entrar no clube (mock)'}
          {!isLoading ? (
            <span className={arrowIconClass} aria-hidden>
              →
            </span>
          ) : null}
        </DesignFormButton>
      </form>

      <AuthFormFooter className="flex items-center justify-between">
        <Link href="/recuperar-senha" className={formLinkClass}>
          Esqueci a senha
        </Link>
        <Link href="/cadastro" className={formLinkClass}>
          Criar conta
          <IconArrowRight className="ml-1 inline size-3.5" stroke={1.75} />
        </Link>
      </AuthFormFooter>
    </AuthFormCard>
  )
}
