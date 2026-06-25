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
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'

const heroOpeningVideoSrc = '/videos/hero-opening-scrub.mp4'
const VIDEO_FRAME_DURATION = 1 / 24
const DESKTOP_HERO_MEDIA_QUERY = '(min-width: 1024px)'

function useDesktopHero() {
  const [isDesktopHero, setIsDesktopHero] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(DESKTOP_HERO_MEDIA_QUERY).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_HERO_MEDIA_QUERY)
    const update = () => setIsDesktopHero(mediaQuery.matches)

    update()
    mediaQuery.addEventListener('change', update)

    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return isDesktopHero
}

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
  const isDesktopHero = useDesktopHero()
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
    if (!isDesktopHero || prefersReducedMotion || !isVideoReady) return
    scheduleVideoSeek(progress)
  })

  const handleVideoReady = useCallback(async () => {
    const video = videoRef.current
    if (
      !isDesktopHero ||
      !video ||
      isPrimingVideoRef.current ||
      hasInitializedVideoRef.current
    ) {
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
  }, [
    isDesktopHero,
    prefersReducedMotion,
    scrollYProgress,
    seekVideoToProgress,
  ])

  useEffect(() => {
    if (isDesktopHero) return

    hasInitializedVideoRef.current = false
    setIsVideoReady(false)
  }, [isDesktopHero])

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
      className="relative isolate overflow-clip border-b border-[#2d201b]/15 bg-[#090807] text-[#fffaf0] motion-reduce:min-h-screen max-lg:min-h-0 lg:min-h-[250vh]"
    >
      <div className="max-lg:relative lg:sticky lg:top-0 lg:min-h-screen lg:overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 lg:hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(216,65,50,0.16),transparent_28%),radial-gradient(circle_at_80%_12%,rgba(215,181,109,0.1),transparent_30%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[56px_56px]" />
        </div>

        {isDesktopHero ? (
          <motion.div
            className="absolute inset-0 z-0 overflow-hidden"
            style={{ scale: boxScale }}
          >
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
              className="absolute inset-0 h-full w-full [transform:translateZ(0)] object-cover object-[68%_center]"
            />
          </motion.div>
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-[linear-gradient(90deg,#090807_0%,rgba(9,8,7,0.96)_24%,rgba(9,8,7,0.62)_52%,rgba(9,8,7,0.18)_100%)] lg:block" />
        <div className="pointer-events-none absolute inset-0 z-[1] hidden bg-[radial-gradient(circle_at_18%_20%,rgba(216,65,50,0.22),transparent_24%),linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[auto,42px_42px,42px_42px] lg:block" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-[30vh] bg-[linear-gradient(0deg,#090807_0%,rgba(9,8,7,0.92)_34%,rgba(9,8,7,0)_100%)] lg:block"
          style={{ opacity: finalGateOpacity, y: finalGateY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 left-0 z-[2] hidden h-px bg-linear-to-r from-transparent via-[#d7b56d]/70 to-transparent lg:block"
          style={{ opacity: finalGateOpacity }}
        />

        <div className="relative z-10 mx-auto flex max-w-7xl items-start px-4 py-16 sm:px-6 lg:min-h-screen lg:items-center lg:px-10 lg:py-20">
          <div className="relative z-10 w-full max-w-[42rem] space-y-7 lg:max-w-[40rem] xl:max-w-[43rem]">
            <ScrollReveal immediate delay={0.05}>
              <div className="inline-grid max-w-full grid-cols-[4.75rem_minmax(0,1fr)] border border-[#b8945f]/55 bg-[#080604]/72 text-[#c9a66a] shadow-[0_0_0_1px_rgba(255,250,240,0.04)_inset,0_18px_54px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                <span className="grid min-h-16 place-items-center border-r border-[#b8945f]/35 bg-[#d7c7a5]/14">
                  <IconFingerprint className="size-9 text-[#e8d39b] drop-shadow-[0_0_14px_rgba(215,181,109,0.48)]" />
                </span>
                <span className="flex items-center px-6 py-3 font-heading text-sm leading-7 font-semibold tracking-[0.24em] uppercase">
                  {badge}
                </span>
              </div>
            </ScrollReveal>

            <div className="space-y-7 sm:space-y-8">
              <ScrollReveal immediate delay={0.15} y={20}>
                <h1
                  className="max-w-3xl font-heading text-[clamp(2.55rem,12vw,3.35rem)] leading-[0.88] font-black tracking-normal text-[#efe7d8] uppercase drop-shadow-[0_2px_0_rgba(0,0,0,0.88)] sm:text-[clamp(4.45rem,8vw,6.25rem)] lg:text-[clamp(4.7rem,5.35vw,6.35rem)]"
                  aria-label={title}
                >
                  <span className="block">
                    Investigue<span className="text-[#c8382b]">.</span>
                  </span>
                  <span className="block">
                    Colete<span className="text-[#c8382b]">.</span>
                  </span>
                  <span className="block">
                    Desvende<span className="text-[#c8382b]">.</span>
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal immediate delay={0.32}>
                <p className="max-w-md border-l-2 border-[#c8382b] py-1 pl-5 text-base leading-7 text-[#d8d0c4] sm:text-lg">
                  Uma experiência mensal que transforma você em parte da
                  investigação. Pistas, conteúdos exclusivos e itens
                  colecionáveis entregues na sua casa.
                </p>
              </ScrollReveal>

              <ScrollReveal immediate delay={0.45}>
                <div className="flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="relative h-14 rounded-none border border-[#e25b45]/75 bg-[#bf3a2b] px-7 font-heading text-sm font-semibold tracking-[0.2em] text-[#fff5e6] uppercase shadow-[0_0_32px_rgba(216,65,50,0.28)] hover:bg-[#d44937] sm:min-w-56"
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
                    className="h-14 rounded-none border-[#a98453]/70 bg-[#080604]/48 px-7 font-heading text-sm font-semibold tracking-[0.2em] text-[#d7b56d] uppercase backdrop-blur-sm hover:bg-[#d7b56d]/10 hover:text-[#f3dfb0] sm:min-w-52"
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
                <div className="grid max-w-3xl border border-[#a98453]/42 bg-[#080604]/48 backdrop-blur-sm sm:grid-cols-3">
                  {heroBenefits.map((benefit) => {
                    const BenefitIcon = benefit.icon

                    return (
                      <ScrollRevealItem key={benefit.title}>
                        <div className="flex h-full gap-4 border-[#a98453]/26 p-5 sm:border-r sm:last:border-r-0">
                          <BenefitIcon className="mt-1 size-9 shrink-0 text-[#d7b56d]" />
                          <div>
                            <p className="font-heading text-xs font-semibold tracking-[0.18em] text-[#d7b56d] uppercase">
                              {benefit.title}
                            </p>
                            <p className="mt-2 text-sm leading-5 text-[#bfb4a3]">
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
    </section>
  )
}
