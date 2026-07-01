'use client'

import { type ReactNode, useEffect, useState } from 'react'

import { JsReadyContext } from './reveal'

export function LandingClientChrome({ children }: { children: ReactNode }) {
  const [jsReady, setJsReady] = useState(false)

  useEffect(() => {
    setJsReady(true)
  }, [])

  return (
    <JsReadyContext.Provider value={jsReady}>
      {children}
    </JsReadyContext.Provider>
  )
}
