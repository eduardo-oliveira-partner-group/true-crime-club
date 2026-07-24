'use client'

import { IconShoppingBag } from '@tabler/icons-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { addCartItemRequiringAuth } from '@/src/lib/add-to-cart'
import { fontMono } from '@/src/lib/design/classes'

interface ProductDetailActionsProps {
  productId: string
  inStock: boolean
}

export function ProductDetailActions({
  productId,
  inStock,
}: ProductDetailActionsProps) {
  const [isAdding, setIsAdding] = useState(false)

  const onAddToCart = async () => {
    if (!inStock || isAdding) return

    setIsAdding(true)
    try {
      await addCartItemRequiringAuth(productId)
    } catch (error) {
      console.error(error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        type="button"
        disabled={!inStock || isAdding}
        onClick={onAddToCart}
        className={`h-12 flex-1 rounded-[10px] bg-[#d84132] px-6 text-base text-white shadow-[0_12px_32px_rgba(216,65,50,0.28)] hover:bg-[#b83227] disabled:opacity-50 ${fontMono}`}
      >
        <IconShoppingBag data-icon="inline-start" />
        {isAdding
          ? 'Adicionando...'
          : inStock
            ? 'Adicionar ao carrinho'
            : 'Indisponível'}
      </Button>
      <Button
        asChild
        variant="outline"
        className={`h-12 rounded-[10px] border-[#211c18]/18 bg-(--paper-soft) text-(--ink) hover:bg-(--ink) ${fontMono}`}
      >
        <Link href="/loja">Voltar à loja</Link>
      </Button>
    </div>
  )
}
