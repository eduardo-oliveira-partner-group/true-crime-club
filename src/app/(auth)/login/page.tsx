import Link from "next/link"

import { Button } from "@/src/components/ui/button"
import { getCurrentCustomer } from "@/src/lib/domain/repositories"

export default function LoginPage() {
  const customer = getCurrentCustomer()

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h1 className="font-heading text-2xl font-semibold">Entrar</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Autenticação mockada — use qualquer combinação para simular o login.
      </p>

      <form className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            defaultValue={customer?.email}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <Button asChild className="w-full">
          <Link href="/cliente/pedidos">Entrar (mock)</Link>
        </Button>
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <Link href="/recuperar-senha" className="text-primary hover:underline">
          Esqueci a senha
        </Link>
        <Link href="/cadastro" className="text-primary hover:underline">
          Criar conta
        </Link>
      </div>
    </div>
  )
}
