'use client'

import { IconCheck, IconShoppingBagPlus } from '@tabler/icons-react'
import { type MouseEvent, useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { Spinner } from '@/src/components/ui/spinner'
import { addCartItemRequiringAuth } from '@/src/lib/add-to-cart'
import { cn } from '@/src/lib/utils'

const ADDED_FEEDBACK_MS = 2000

interface AddToCartIconButtonProps {
  productId: string
  productName: string
  inStock: boolean
  className?: string
}

export function AddToCartIconButton({
  productId,
  productName,
  inStock,
  className,
}: AddToCartIconButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!justAdded) return
    const timer = window.setTimeout(
      () => setJustAdded(false),
      ADDED_FEEDBACK_MS,
    )
    return () => window.clearTimeout(timer)
  }, [justAdded])

  const onAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
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
    <Button
      type="button"
      size="icon"
      disabled={!inStock || isAdding}
      onClick={onAddToCart}
      aria-label={
        isAdding
          ? `Adicionando ${productName} ao carrinho`
          : justAdded
            ? `${productName} adicionado ao carrinho`
            : inStock
              ? `Adicionar ${productName} ao carrinho`
              : `${productName} indisponível`
      }
      className={cn(
        'size-10 rounded-[10px] border border-(--red)/25 bg-(--red) text-[#fbf9f6] shadow-[0_8px_18px_-10px_rgba(197,39,31,0.45)] hover:bg-(--red-deep) hover:text-[#fbf9f6] disabled:opacity-45',
        justAdded && 'border-(--teal)/30 bg-(--teal) hover:bg-(--teal-deep)',
        className,
      )}
    >
      {isAdding ? (
        <Spinner className="size-4" />
      ) : justAdded ? (
        <IconCheck />
      ) : (
        <IconShoppingBagPlus stroke={1.75} />
      )}
    </Button>
  )
}
