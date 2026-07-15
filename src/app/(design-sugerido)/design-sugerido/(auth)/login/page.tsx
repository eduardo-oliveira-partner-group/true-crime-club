'use client'

import {
  IconArrowRight,
  IconFingerprint,
  IconLock,
  IconUser,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { apiClient } from '@/src/lib/api-client'

export default function LoginPage() {
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
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
    const email = e.currentTarget.email.value
    const password = e.currentTarget.password.value
    try {
      await apiClient.auth.login({ email, password })
      localStorage.setItem('isLoggedIn', 'true')
      router.replace('/design-sugerido/cliente/pedidos')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="relative border border-[#b98542]/45 bg-[#171211] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.03)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.03)_1px,transparent_1px)] bg-size-[42px_42px]" />

      <div className="flex items-center gap-4">
        <span className="flex size-10 items-center justify-center bg-[#d84132]/20 text-[#ffb0a5]">
          <IconFingerprint className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
            Acesso restrito
          </p>
          <h1 className="font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
            Entrar no arquivo
          </h1>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 border-y border-[#fffaf0]/12 py-3 font-mono text-[10px] tracking-[0.18em] text-[#bfb4a3] uppercase">
        <span>CLUB · LOGIN</span>
        <span className="h-px flex-1 bg-[#fffaf0]/12" />
        <span>Sessão segura</span>
      </div>

      <p className="mt-4 text-sm/6 text-[#d7c9b5]">
        Use seu e-mail e senha para acessar o seu dossiê pessoal.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setEmailValue('carlos.souza@email.com')
            setPasswordValue('senha-falsa-123')
          }}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-2 text-xs font-semibold text-[#d7b56d] transition hover:bg-[#fffaf0]/10 focus:border-[#d7b56d]/70 focus:bg-[#0b0908]"
        >
          <IconUser className="size-3.5" />
          Usuário 1
        </button>
        <button
          type="button"
          onClick={() => {
            setEmailValue('mariana.silva@email.com')
            setPasswordValue('senha-falsa-123')
          }}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 border border-[#fffaf0]/14 bg-[#0c0a09] px-3 py-2 text-xs font-semibold text-[#d7b56d] transition hover:bg-[#fffaf0]/10 focus:border-[#d7b56d]/70 focus:bg-[#0b0908]"
        >
          <IconUser className="size-3.5" />
          Usuário 2
        </button>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleLogin}>
        <div>
          <label
            className="text-xs font-semibold tracking-[0.2em] text-[#c8bdad] uppercase"
            htmlFor="email"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            className="mt-2 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-4 py-3 text-sm text-[#fffaf0] transition outline-none placeholder:text-[#bfb4a3]/60 focus:border-[#d7b56d]/70 focus:bg-[#0b0908]"
          />
        </div>
        <div>
          <label
            className="text-xs font-semibold tracking-[0.2em] text-[#c8bdad] uppercase"
            htmlFor="password"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            className="mt-2 w-full border border-[#fffaf0]/14 bg-[#0c0a09] px-4 py-3 text-sm text-[#fffaf0] transition outline-none placeholder:text-[#bfb4a3]/60 focus:border-[#d7b56d]/70 focus:bg-[#0b0908]"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full bg-[#d84132] text-white shadow-[0_0_26px_rgba(216,65,50,0.35)] hover:bg-[#b93227]"
        >
          <IconLock className="size-4" />
          Entrar no clube
          <IconArrowRight className="size-4" />
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between border-t border-[#fffaf0]/12 pt-4 text-sm">
        <Link
          href="/design-sugerido/recuperar-senha"
          className="font-medium tracking-wide text-[#d7b56d] hover:text-[#fffaf0]"
        >
          Esqueci a senha
        </Link>
        <Link
          href="/design-sugerido/cadastro"
          className="font-medium tracking-wide text-[#d7b56d] hover:text-[#fffaf0]"
        >
          Criar conta
          <IconArrowRight className="ml-1 inline size-3.5" />
        </Link>
      </div>
    </div>
  )
}
