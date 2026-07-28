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
  /** Polling de backup enquanto o WS nao entrega (ex.: Redis/pubsub). */
  onPoll?: () => void | Promise<void>
  pollIntervalMs?: number
}

export function useCheckoutPaymentWs(
  checkoutId: string | undefined,
  {
    enabled,
    onPaymentConfirmed,
    onTimeout,
    onPoll,
    pollIntervalMs = 4000,
  }: UseCheckoutPaymentWsOptions,
) {
  const onPaymentConfirmedRef = useRef(onPaymentConfirmed)
  const onTimeoutRef = useRef(onTimeout)
  const onPollRef = useRef(onPoll)

  useEffect(() => {
    onPaymentConfirmedRef.current = onPaymentConfirmed
  }, [onPaymentConfirmed])

  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  useEffect(() => {
    onPollRef.current = onPoll
  }, [onPoll])

  useEffect(() => {
    if (!checkoutId || !enabled) return

    let closed = false
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
      // Mantem a conexao para o onclose; polling cobre a falha.
    }

    const pollId = window.setInterval(() => {
      if (closed) return
      void onPollRef.current?.()
    }, pollIntervalMs)

    return () => {
      closed = true
      window.clearInterval(pollId)
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close()
      }
    }
  }, [checkoutId, enabled, pollIntervalMs])
}
