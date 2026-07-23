'use client'

import { useEffect, useRef } from 'react'

import {
  getCheckoutWebSocketUrl,
  parseCheckoutPaymentMessage,
} from '@/src/lib/api/core/checkout-ws'

type UseCheckoutPaymentWsOptions = {
  enabled: boolean
  onPaymentConfirmed: () => void
  onTimeout?: () => void
}

export function useCheckoutPaymentWs(
  checkoutId: string | undefined,
  { enabled, onPaymentConfirmed, onTimeout }: UseCheckoutPaymentWsOptions,
) {
  const onPaymentConfirmedRef = useRef(onPaymentConfirmed)
  const onTimeoutRef = useRef(onTimeout)

  useEffect(() => {
    onPaymentConfirmedRef.current = onPaymentConfirmed
  }, [onPaymentConfirmed])

  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  useEffect(() => {
    if (!checkoutId || !enabled) return

    const ws = new WebSocket(getCheckoutWebSocketUrl(checkoutId))

    ws.onmessage = (event) => {
      const { confirmed, timedOut } = parseCheckoutPaymentMessage(
        String(event.data ?? ''),
      )
      if (confirmed) {
        onPaymentConfirmedRef.current()
        ws.close()
        return
      }
      if (timedOut) {
        onTimeoutRef.current?.()
        ws.close()
      }
    }

    ws.onerror = () => {
      ws.close()
    }

    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close()
      }
    }
  }, [checkoutId, enabled])
}
