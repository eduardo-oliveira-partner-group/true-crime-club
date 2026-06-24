import Link from "next/link"

import { Button } from "@/src/components/ui/button"
import { listProducts } from "@/src/lib/domain/repositories"
import { formatAvailability, formatCurrency } from "@/src/lib/formatters"

export default function LojaPage() {
  const products = listProducts()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-2">
        <p className="text-sm text-muted-foreground">Catálogo</p>
        <h1 className="font-heading text-3xl font-semibold">Loja</h1>
        <p className="text-muted-foreground">
          Boxes temáticas, edições avulsas e produtos complementares.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhum produto disponível no momento.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase text-muted-foreground">
                  {product.type === "box" ? "Box" : "Produto"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatAvailability(product.availability)}
                </span>
              </div>
              <h2 className="mt-2 font-heading text-lg font-semibold">{product.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {product.shortDescription}
              </p>
              <p className="mt-4 font-medium">{formatCurrency(product.price)}</p>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href={`/loja/${product.slug}`}>Ver detalhes</Link>
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
