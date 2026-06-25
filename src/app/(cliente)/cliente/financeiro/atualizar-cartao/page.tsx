import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { updateCard } from '@/src/lib/domain/repositories'

export default function AtualizarCartaoPage() {
  return (
    <div>
      <Button asChild variant="ghost" className="mb-4 h-auto p-0">
        <Link href="/cliente/financeiro">← Voltar</Link>
      </Button>

      <h1 className="font-heading text-2xl font-semibold">Atualizar cartão</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Formulário mockado — dados não são enviados a nenhum gateway.
      </p>

      <form
        className="mt-6 max-w-md space-y-4"
        action={async (formData) => {
          'use server'
          updateCard({
            holderName: String(formData.get('holder') ?? ''),
            lastFour: String(formData.get('lastFour') ?? '0000').slice(-4),
            brand: String(formData.get('brand') ?? 'Visa'),
          })
        }}
      >
        <div>
          <label className="text-sm font-medium" htmlFor="holder">
            Nome no cartão
          </label>
          <input
            id="holder"
            name="holder"
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="lastFour">
            Final do cartão
          </label>
          <input
            id="lastFour"
            name="lastFour"
            maxLength={4}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <input type="hidden" name="brand" value="Visa" />
        <Button type="submit">Salvar cartão (mock)</Button>
      </form>
    </div>
  )
}
