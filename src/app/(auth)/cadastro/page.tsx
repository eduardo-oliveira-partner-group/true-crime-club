import Link from "next/link"

import { Button } from "@/src/components/ui/button"

export default function CadastroPage() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h1 className="font-heading text-2xl font-semibold">Criar conta</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cadastro simulado para validação da jornada.
      </p>

      <form className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            Nome completo
          </label>
          <input
            id="name"
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <Button asChild className="w-full">
          <Link href="/cliente/pedidos">Criar conta (mock)</Link>
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
