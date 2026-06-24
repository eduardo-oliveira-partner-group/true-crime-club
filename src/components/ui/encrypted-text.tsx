"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useInView } from "motion/react"

import { cn } from "@/src/lib/utils"

type EncryptedTextProps = {
  text: string
  className?: string
  /**
   * Time in milliseconds between revealing each subsequent real character.
   * Lower is faster. Defaults to 50ms per character.
   */
  revealDelayMs?: number
  /** Optional custom character set to use for the gibberish effect. */
  charset?: string
  /**
   * Time in milliseconds between gibberish flips for unrevealed characters.
   * Lower is more jittery. Defaults to 50ms.
   */
  flipDelayMs?: number
  /** CSS class for styling the encrypted/scrambled characters */
  encryptedClassName?: string
  /** CSS class for styling the revealed characters */
  revealedClassName?: string
  /** Delay in milliseconds before this instance starts revealing */
  startDelayMs?: number
}

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?"

function generateRandomCharacter(charset: string): string {
  const index = Math.floor(Math.random() * charset.length)
  return charset.charAt(index)
}

function deterministicCharacter(
  original: string,
  index: number,
  charset: string,
): string {
  const ch = original[index]
  if (ch === " ") return " "

  let hash = 0
  const seed = `${original}:${index}`
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }

  return charset.charAt(Math.abs(hash) % charset.length)
}

function generateDeterministicGibberish(
  original: string,
  charset: string,
): string {
  if (!original) return ""
  let result = ""
  for (let i = 0; i < original.length; i += 1) {
    result += deterministicCharacter(original, i, charset)
  }
  return result
}

function generateRandomGibberish(
  original: string,
  charset: string,
): string {
  if (!original) return ""
  let result = ""
  for (let i = 0; i < original.length; i += 1) {
    const ch = original[i]
    result += ch === " " ? " " : generateRandomCharacter(charset)
  }
  return result
}

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  className,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
  startDelayMs = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  const [revealCount, setRevealCount] = useState<number>(0)
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const lastFlipTimeRef = useRef<number>(0)
  const [scrambleChars, setScrambleChars] = useState<string[]>(() =>
    text ? generateDeterministicGibberish(text, charset).split("") : [],
  )

  useEffect(() => {
    if (!isInView) return

    startTimeRef.current = performance.now()
    lastFlipTimeRef.current = startTimeRef.current

    let isCancelled = false
    let initialized = false

    const update = (now: number) => {
      if (isCancelled) return

      if (!initialized) {
        initialized = true
        const initial = text ? generateRandomGibberish(text, charset) : ""
        setScrambleChars(initial.split(""))
        setRevealCount(0)
      }

      const elapsedMs = now - startTimeRef.current
      const totalLength = text.length
      const revealElapsedMs = Math.max(0, elapsedMs - startDelayMs)
      const currentRevealCount = Math.min(
        totalLength,
        Math.floor(revealElapsedMs / Math.max(1, revealDelayMs)),
      )

      setRevealCount(currentRevealCount)

      if (currentRevealCount >= totalLength) {
        return
      }

      const timeSinceLastFlip = now - lastFlipTimeRef.current
      if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
        setScrambleChars((prev) => {
          const next = [...prev]
          for (let index = 0; index < totalLength; index += 1) {
            if (index >= currentRevealCount) {
              next[index] =
                text[index] !== " "
                  ? generateRandomCharacter(charset)
                  : " "
            }
          }
          return next
        })
        lastFlipTimeRef.current = now
      }

      animationFrameRef.current = requestAnimationFrame(update)
    }

    animationFrameRef.current = requestAnimationFrame(update)

    return () => {
      isCancelled = true
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isInView, text, revealDelayMs, charset, flipDelayMs, startDelayMs])

  if (!text) return null

  return (
    <motion.span
      ref={ref}
      className={cn(className)}
      aria-label={text}
      role="text"
    >
      {text.split("").map((char, index) => {
        const isRevealed = index < revealCount
        const displayChar = isRevealed
          ? char
          : char === " "
            ? " "
            : (scrambleChars[index] ??
              deterministicCharacter(text, index, charset))

        return (
          <span
            key={index}
            className={cn(isRevealed ? revealedClassName : encryptedClassName)}
          >
            {displayChar}
          </span>
        )
      })}
    </motion.span>
  )
}
