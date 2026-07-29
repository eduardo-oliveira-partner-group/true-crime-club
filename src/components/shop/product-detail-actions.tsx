'use client'

import { IconCheck, IconShoppingBag } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!justAdded) return
    const timer = window.setTimeout(() => setJustAdded(false), 2000)
    return () => window.clearTimeout(timer)
  }, [justAdded])

  const onAddToCart = async () => {
    if (!inStock || isAdding) return

    setIsAdding(true)
    try {
      const result = await addCartItemRequiringAuth(productId)
      if (result === 'added') {
        setJustAdded(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      <Button
        type="button"
        disabled={!inStock || isAdding}
        onClick={onAddToCart}
        className={`h-auto min-h-11 w-full flex-none rounded-[10px] bg-(--red) px-5 py-[14px] text-[14px] leading-none font-bold tracking-[0.04em] text-white uppercase shadow-[0_12px_32px_rgba(197,39,31,0.28)] hover:bg-(--red-deep) disabled:opacity-50 sm:min-h-12 sm:flex-1 ${fontMono}`}
      >
        {justAdded ? (
          <IconCheck data-icon="inline-start" />
        ) : (
          <IconShoppingBag data-icon="inline-start" />
        )}
        {isAdding
          ? 'Adicionando...'
          : justAdded
            ? 'Adicionado!'
            : inStock
              ? 'Adicionar ao carrinho'
              : 'Indisponível'}
      </Button>
      <Button
        asChild
        variant="outline"
        className={`h-auto min-h-11 w-full flex-none rounded-[10px] border-[#211c18]/18 bg-(--paper-soft) px-5 py-[14px] text-[14px] leading-none font-bold tracking-[0.04em] text-(--ink) uppercase hover:border-(--red)/45 hover:bg-(--red)/10 hover:text-(--red) sm:min-h-12 sm:w-auto ${fontMono}`}
      >
        <Link href="/loja">Voltar à loja</Link>
      </Button>
    </div>
  )
}
