import Link from "next/link"

import { Button } from "@/src/components/ui/button"

export default function RecuperarSenhaPage() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h1 className="font-heading text-2xl font-semibold">Recuperar senha</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Informe seu e-mail para simular o envio de instruções de recuperação.
      </p>

      <form className="mt-6 space-y-4">
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
        <Button className="w-full" type="button">
          Enviar link (mock)
        </Button>
      </form>

      <p className="mt-4 text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Voltar ao login
        </Link>
      </p>
    </div>
  )
}
