'use client'

import {
  IconArrowRight,
  IconBoxSeam,
  IconFingerprint,
  IconUsers,
} from '@tabler/icons-react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import heroBannerLight from '@/src/assets/images/home/hero-banner-light.png'
import { Button } from '@/src/components/ui/button'
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'

const heroOpeningVideoSrc = '/videos/hero-opening-scrub.mp4'
const VIDEO_FRAME_DURATION = 1 / 24

async function primeVideoForScrubbing(video: HTMLVideoElement) {
  video.muted = true
  video.playsInline = true

  await new Promise<void>((resolve) => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve()
      return
    }

    video.addEventListener('loadeddata', () => resolve(), { once: true })
  })

  try {
    await video.play()
    video.pause()
  } catch {
    // Autoplay policies may block play(); seeks can still work after decode.
  }

  await new Promise<void>((resolve) => {
    if (Math.abs(video.currentTime) > 0.0005) {
      resolve()
      return
    }

    video.addEventListener('seeked', () => resolve(), { once: true })
    video.currentTime = 0.001
  })
}

function scrollProgressToVideoTime(progress: number, duration: number) {
  const normalizedProgress = Math.min(1, progress / 0.92)
  return Math.min(duration, Math.max(0, normalizedProgress * duration))
}

const heroBenefits = [
  {
    icon: IconBoxSeam,
    title: 'Box mensal',
    description: 'Surpresas exclusivas todo mês.',
  },
  {
    icon: IconFingerprint,
    title: 'Pistas colecionáveis',
    description: 'Um novo vestígio a cada entrega.',
  },
  {
    icon: IconUsers,
    title: 'Comunidade',
    description: 'Eventos ao vivo e revelações finais.',
  },
]

export type HeroCaseRevealProps = {
  badge: string
  title: string
  subtitle: string
  ctaLabel: string
  activeCaseTitle: string
  cycleLabel: string
}

export function HeroCaseReveal({ badge, title }: HeroCaseRevealProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const pendingProgressRef = useRef(0)
  const seekFrameRef = useRef<number | null>(null)
  const isPrimingVideoRef = useRef(false)
  const hasInitializedVideoRef = useRef(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const boxScale = useTransform(
    scrollYProgress,
    [0, 0.32, 0.62, 1],
    prefersReducedMotion ? [1.04, 1.04, 1.04, 1.04] : [1, 1.03, 1.1, 1.16],
  )
  const finalGateOpacity = useTransform(
    scrollYProgress,
    [0.88, 1],
    prefersReducedMotion ? [1, 1] : [0, 1],
  )
  const finalGateY = useTransform(
    scrollYProgress,
    [0.88, 1],
    prefersReducedMotion ? [0, 0] : [80, 0],
  )

  const seekVideoToProgress = useCallback((progress: number) => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration)) return

    const targetTime = scrollProgressToVideoTime(progress, video.duration)

    if (Math.abs(video.currentTime - targetTime) > VIDEO_FRAME_DURATION / 2) {
      video.currentTime = targetTime
    }
  }, [])

  const scheduleVideoSeek = useCallback(
    (progress: number) => {
      pendingProgressRef.current = progress

      if (seekFrameRef.current !== null) return

      seekFrameRef.current = requestAnimationFrame(() => {
        seekFrameRef.current = null
        seekVideoToProgress(pendingProgressRef.current)
      })
    },
    [seekVideoToProgress],
  )

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (prefersReducedMotion || !isVideoReady) return
    scheduleVideoSeek(progress)
  })

  const handleVideoReady = useCallback(async () => {
    const video = videoRef.current
    if (!video || isPrimingVideoRef.current || hasInitializedVideoRef.current) {
      return
    }

    isPrimingVideoRef.current = true
    video.removeAttribute('poster')

    try {
      await primeVideoForScrubbing(video)
    } finally {
      isPrimingVideoRef.current = false
    }

    hasInitializedVideoRef.current = true
    setIsVideoReady(true)

    if (prefersReducedMotion) {
      video.currentTime = video.duration * 0.88
      return
    }

    seekVideoToProgress(scrollYProgress.get())
  }, [prefersReducedMotion, scrollYProgress, seekVideoToProgress])

  useEffect(() => {
    return () => {
      if (seekFrameRef.current !== null) {
        cancelAnimationFrame(seekFrameRef.current)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[200vh] overflow-clip border-b border-[#211c18]/12 bg-[#f4f1ec] text-[#211c18] motion-reduce:min-h-screen lg:min-h-[250vh] dark:border-[#2d201b]/15 dark:bg-[#090807] dark:text-[#fffaf0]"
    >
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <motion.div
          className="absolute inset-x-0 top-0 z-0 h-[34vh] overflow-hidden sm:h-[38vh] lg:inset-0 lg:h-auto"
          style={{ scale: boxScale }}
        >
          <Image
            src={heroBannerLight}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="absolute inset-0 size-full object-cover object-[68%_center] dark:hidden"
          />
          <video
            ref={videoRef}
            src={heroOpeningVideoSrc}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden
            tabIndex={-1}
            onLoadedData={handleVideoReady}
            className="absolute inset-0 hidden size-full transform-[translateZ(0)] object-cover object-[68%_center] dark:block"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-[34vh] bg-[linear-gradient(90deg,rgba(244,241,236,0.88)_0%,rgba(244,241,236,0.78)_24%,rgba(244,241,236,0.5)_52%,rgba(244,241,236,0.18)_100%)] sm:h-[38vh] lg:inset-0 lg:h-auto dark:bg-[linear-gradient(90deg,#090807_0%,rgba(9,8,7,0.96)_24%,rgba(9,8,7,0.62)_52%,rgba(9,8,7,0.18)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-[34vh] bg-[radial-gradient(circle_at_18%_20%,rgba(181,51,42,0.055),transparent_26%),linear-gradient(90deg,rgba(33,28,24,0.018)_1px,transparent_1px),linear-gradient(rgba(33,28,24,0.018)_1px,transparent_1px)] bg-size-[auto,42px_42px,42px_42px] sm:h-[38vh] lg:inset-0 lg:h-auto dark:bg-[radial-gradient(circle_at_18%_20%,rgba(216,65,50,0.22),transparent_24%),linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)]" />
        <div className="pointer-events-none absolute inset-x-0 top-[34vh] z-1 h-14 -translate-y-full bg-[linear-gradient(0deg,rgba(244,241,236,0.78)_0%,rgba(244,241,236,0)_100%)] sm:top-[38vh] lg:hidden dark:bg-[linear-gradient(0deg,#090807_0%,rgba(9,8,7,0)_100%)]" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-2 hidden h-[30vh] bg-[linear-gradient(0deg,rgba(244,241,236,0.82)_0%,rgba(244,241,236,0.62)_34%,rgba(244,241,236,0)_100%)] lg:block dark:bg-[linear-gradient(0deg,#090807_0%,rgba(9,8,7,0.92)_34%,rgba(9,8,7,0)_100%)]"
          style={{ opacity: finalGateOpacity, y: finalGateY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-2 hidden h-px bg-linear-to-r from-transparent via-[#8f6126]/55 to-transparent lg:block dark:via-[#d7b56d]/70"
          style={{ opacity: finalGateOpacity }}
        />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:items-center lg:justify-center lg:px-10 lg:py-20">
          <div
            aria-hidden
            className="h-[34vh] shrink-0 sm:h-[38vh] lg:hidden"
          />
          <div className="mt-auto flex w-full flex-1 flex-col justify-end pb-4 sm:pb-6 lg:mt-0 lg:flex-none lg:justify-center">
            <div className="relative z-10 w-full max-w-2xl space-y-7 lg:max-w-160 xl:max-w-172">
              <ScrollReveal immediate delay={0.05}>
                <div className="inline-grid max-w-full grid-cols-[3.5rem_minmax(0,1fr)] border border-[#9a662a]/45 bg-[#fffaf2]/80 text-[#7c5323] shadow-[0_0_0_1px_rgba(33,28,24,0.035)_inset,0_8px_16px_rgba(63,46,34,0.07)] backdrop-blur-sm sm:grid-cols-[4.75rem_minmax(0,1fr)] dark:border-[#b8945f]/55 dark:bg-[#080604]/72 dark:text-[#c9a66a] dark:shadow-[0_0_0_1px_rgba(255,250,240,0.04)_inset,0_18px_54px_rgba(0,0,0,0.4)]">
                  <span className="grid min-h-12 place-items-center border-r border-[#9a662a]/28 bg-[#9a662a]/10 sm:min-h-16 dark:border-[#b8945f]/35 dark:bg-[#d7c7a5]/14">
                    <IconFingerprint className="size-6 text-[#8f6126] drop-shadow-none sm:size-9 dark:text-[#e8d39b] dark:drop-shadow-[0_0_14px_rgba(215,181,109,0.48)]" />
                  </span>
                  <span className="flex items-center px-4 py-2 font-heading text-[10px]/4 font-semibold tracking-[0.16em] uppercase sm:px-6 sm:py-3 sm:text-sm/7 sm:tracking-[0.24em]">
                    {badge}
                  </span>
                </div>
              </ScrollReveal>

              <div className="space-y-7 sm:space-y-8">
                <ScrollReveal immediate delay={0.15} y={20}>
                  <h1
                    className="max-w-3xl font-heading text-[clamp(2.55rem,12vw,3.35rem)] leading-[0.88] font-black tracking-normal text-[#211c18] uppercase drop-shadow-[0_2px_0_rgba(255,250,242,0.86)] sm:text-[clamp(4.45rem,8vw,6.25rem)] lg:text-[clamp(4.7rem,5.35vw,6.35rem)] dark:text-[#efe7d8] dark:drop-shadow-[0_2px_0_rgba(0,0,0,0.88)]"
                    aria-label={title}
                  >
                    <span className="block">
                      Investigue
                      <span className="text-[#b5332a] dark:text-[#c8382b]">
                        .
                      </span>
                    </span>
                    <span className="block">
                      Colete
                      <span className="text-[#b5332a] dark:text-[#c8382b]">
                        .
                      </span>
                    </span>
                    <span className="block">
                      Desvende
                      <span className="text-[#b5332a] dark:text-[#c8382b]">
                        .
                      </span>
                    </span>
                  </h1>
                </ScrollReveal>

                <ScrollReveal immediate delay={0.32}>
                  <p className="max-w-md border-l-2 border-[#b5332a] py-1 pl-5 text-base/7 text-[#4f433b] sm:text-lg dark:border-[#c8382b] dark:text-[#d8d0c4]">
                    Uma experiência mensal que transforma você em parte da
                    investigação. Pistas, conteúdos exclusivos e itens
                    colecionáveis entregues na sua casa.
                  </p>
                </ScrollReveal>

                <ScrollReveal immediate delay={0.45}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                    <Button
                      asChild
                      size="lg"
                      className="relative h-14 w-full rounded-none border border-[#b5332a]/75 bg-[#b5332a] px-7 font-heading text-sm font-semibold tracking-[0.2em] text-[#fff5e6] uppercase shadow-[0_14px_30px_rgba(181,51,42,0.24)] hover:bg-[#982820] sm:w-auto sm:min-w-56 dark:border-[#e25b45]/75 dark:bg-[#bf3a2b] dark:shadow-[0_0_32px_rgba(216,65,50,0.28)] dark:hover:bg-[#d44937]"
                    >
                      <Link href="/assinatura">
                        <IconFingerprint className="size-5" />
                        Quero minha box
                        <span className="pointer-events-none absolute top-2 right-2 size-2 border-t border-r border-[#f4d8b0]/80" />
                        <span className="pointer-events-none absolute right-2 bottom-2 size-2 border-r border-b border-[#f4d8b0]/80" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="h-14 w-full rounded-none border-[#9a662a]/55 bg-[#fffaf2]/58 px-7 font-heading text-sm font-semibold tracking-[0.2em] text-[#7c5323] uppercase backdrop-blur-sm hover:bg-[#9a662a]/10 hover:text-[#211c18] sm:w-auto sm:min-w-52 dark:border-[#a98453]/70 dark:bg-[#080604]/48 dark:text-[#d7b56d] dark:hover:bg-[#d7b56d]/10 dark:hover:text-[#f3dfb0]"
                    >
                      <Link href="/loja">
                        Saiba mais
                        <IconArrowRight className="size-6" />
                      </Link>
                    </Button>
                  </div>
                </ScrollReveal>

                <ScrollRevealGroup
                  immediate
                  delayChildren={0.55}
                  staggerChildren={0.1}
                >
                  <div className="grid max-w-3xl border border-[#9a662a]/30 bg-[#fffaf2]/64 backdrop-blur-sm sm:grid-cols-3 dark:border-[#a98453]/42 dark:bg-[#080604]/48">
                    {heroBenefits.map((benefit) => {
                      const BenefitIcon = benefit.icon

                      return (
                        <ScrollRevealItem key={benefit.title}>
                          <div className="flex h-full gap-4 border-[#9a662a]/22 p-5 sm:border-r sm:last:border-r-0 dark:border-[#a98453]/26">
                            <BenefitIcon className="mt-1 size-9 shrink-0 text-[#8f6126] dark:text-[#d7b56d]" />
                            <div>
                              <p className="font-heading text-xs font-semibold tracking-[0.18em] text-[#8f6126] uppercase dark:text-[#d7b56d]">
                                {benefit.title}
                              </p>
                              <p className="mt-2 text-sm/5 text-[#5f5147] dark:text-[#bfb4a3]">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        </ScrollRevealItem>
                      )
                    })}
                  </div>
                </ScrollRevealGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
