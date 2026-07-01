'use client'

import {
  IconArrowRight,
  IconBoxSeam,
  IconCheck,
  IconClipboardText,
  IconGift,
  IconHeart,
  IconMenu2,
  IconQuote,
  IconRefresh,
  IconShoppingBag,
  IconSparkles,
  IconStack2,
  IconStarFilled,
  IconUser,
  IconUsers,
  type TablerIcon,
} from '@tabler/icons-react'
import { motion } from 'motion/react'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import {
  createContext,
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import archiveBox01 from '@/src/assets/images/design-sugerido/box-01.png'
import archiveBox02 from '@/src/assets/images/design-sugerido/box-02.png'
import archiveBox03 from '@/src/assets/images/design-sugerido/box-03.png'
import archiveBox04 from '@/src/assets/images/design-sugerido/box-04.png'
import standaloneEdition from '@/src/assets/images/design-sugerido/edicao-copa.png'
import featuredSilhuetas from '@/src/assets/images/design-sugerido/featured-silhuetas.png'
import heroImage from '@/src/assets/images/design-sugerido/hero.jpg'
import logo from '@/src/assets/images/design-sugerido/logo.png'
import logoBetoRibeiro from '@/src/assets/images/design-sugerido/logo-beto-ribeiro.png'
import logoCorreioBraziliense from '@/src/assets/images/design-sugerido/logo-correio-braziliense.png'
import logoIstoE from '@/src/assets/images/design-sugerido/logo-istoe.png'
import logoJanelaPublicitaria from '@/src/assets/images/design-sugerido/logo-janela-publicitaria.png'
import logoPoltronaNerd from '@/src/assets/images/design-sugerido/logo-poltrona-nerd.png'
import logoVejaSp from '@/src/assets/images/design-sugerido/logo-veja-sp.png'

/* ------------------------------------------------------------------ */
/* design tokens — TRUECRIME.CLUB v3 "DOSSIÊ DE INVESTIGAÇÃO"          */
/* ------------------------------------------------------------------ */

const tokens = {
  '--paper': '#ede4dd',
  '--paper-soft': '#f5eee4',
  '--card': '#fbf9f6',
  '--ink': '#211c18',
  '--ink-soft': '#3d362f',
  '--ink-mute': '#6e645a',
  '--red': '#c5271f',
  '--red-deep': '#a91d16',
  '--yellow': '#efbc18',
  '--amber': '#e0a50a',
  '--teal': '#1aa587',
  '--teal-deep': '#15735d',
  '--purple': '#5e5ea2',
  '--purple-deep': '#4a4580',
  '--night': '#0e1014',
  '--night-soft': '#16110e',
  '--cream': '#f4ecdc',
} as CSSProperties

const JsReadyContext = createContext(false)

/** Mono font stack reused across labels, badges and tags. */
const fontMono = '[font-family:var(--design-font-mono),monospace]'
const fontType = fontMono
/** Heading font stack reused across titles. */
const fontHeading =
  '[font-family:var(--design-font-heading),system-ui,sans-serif]'

const navLinks = [
  { href: '#oque', label: 'O Clube' },
  { href: '#funciona', label: 'Como funciona' },
  { href: '#planos', label: 'Planos' },
  { href: '#avulsas', label: 'Avulsas' },
  { href: '#arquivos', label: 'Arquivos' },
]

const promoItems = [
  'O CASO VICTÓRIA MONTEIRO — CAIXA 03 DE 12',
  'ASSINE ATÉ DIA 28 PRA ENTRAR NESTE CASO',
  'MAIS DE 1000 INVESTIGADORES NO CLUBE',
]

const ribbonItems = [
  { label: 'PISTAS REAIS', color: '#EFBC18' },
  { label: 'ITENS COLECIONÁVEIS', color: '#C5271F' },
  { label: '12 CAIXAS, UMA VERDADE', color: '#1AA587' },
  { label: 'COMUNIDADE QUE TEORIZA', color: '#5E5EA2' },
]

const boxItems: Array<{
  code: string
  title: string
  description: string
  color: string
  icon: TablerIcon
}> = [
  {
    code: 'ITEM A',
    title: 'Colecionáveis exclusivos',
    description:
      'Objetos temáticos produzidos só pra edição do mês. Não se compra em loja nenhuma.',
    color: '#C5271F',
    icon: IconGift,
  },
  {
    code: 'ITEM B',
    title: 'Pistas e documentos',
    description:
      'Depoimentos, recortes, mapas e fotos pra você analisar como um verdadeiro investigador.',
    color: '#E0A50A',
    icon: IconClipboardText,
  },
  {
    code: 'ITEM C',
    title: 'Um caso que evolui',
    description:
      'Um único mistério se desdobra ao longo de 12 caixas. Cada uma revela uma nova camada da verdade.',
    color: '#1AA587',
    icon: IconStack2,
  },
  {
    code: 'ITEM D',
    title: 'Comunidade pra teorizar',
    description:
      'Grupo exclusivo de membros pra trocar teorias, palpites e descobrir junto.',
    color: '#5E5EA2',
    icon: IconUsers,
  },
]

const steps = [
  {
    number: '01',
    title: 'Assine',
    description:
      'Escolha o plano mensal ou anual. Sem fidelidade complicada — cancela quando quiser.',
    color: '#C5271F',
  },
  {
    number: '02',
    title: 'Receba em casa',
    description:
      'Sua caixa chega lacrada todo mês, com novas pistas e itens do caso em andamento.',
    color: '#EFBC18',
  },
  {
    number: '03',
    title: 'Investigue',
    description:
      'Mergulhe nas pistas, debata com a comunidade e monte sua própria teoria.',
    color: '#1AA587',
  },
]

const testimonials = [
  {
    text: 'Eu literalmente espalhei as pistas na mesa da cozinha e passei o domingo investigando. Melhor assinatura que já fiz. 🔍',
    user: '@marianacosta',
    likes: '1.243',
    color: '#C5271F',
  },
  {
    text: 'O que me pegou não foi o ‘crime’ — foi entender a cabeça dos personagens. A escrita é absurda de boa.',
    user: '@pedro.hqs',
    likes: '982',
    color: '#E0A50A',
  },
  {
    text: 'A qualidade dos itens é surreal. Parece que veio de um arquivo de polícia de verdade. 😱',
    user: '@carol.investiga',
    likes: '760',
    color: '#1AA587',
  },
  {
    text: 'Virou ritual lá em casa. Todo mês a galera vem teorizar junto. Vira um programa.',
    user: '@thiagoreis',
    likes: '1.510',
    color: '#5E5EA2',
  },
]

const archiveBoxes = [
  {
    box: 'BOX 01',
    title: 'Primeira Página',
    price: 'R$ 149,90',
    href: '/loja/tcc-caixa-01-avulsa',
    image: archiveBox01,
    alt: 'Box 01 — Primeira Página',
    objectPosition: '42% 38%',
  },
  {
    box: 'BOX 02',
    title: 'Tudo ao Meu Alcance',
    price: 'R$ 149,90',
    href: '/loja/tcc-caixa-02-avulsa',
    image: archiveBox02,
    alt: 'Box 02 — Tudo ao Meu Alcance',
    objectPosition: 'center',
  },
  {
    box: 'BOX 03',
    title: 'Pena',
    price: 'R$ 149,90',
    href: '/loja/tcc-caixa-03-avulsa',
    image: archiveBox03,
    alt: 'Box 03 — Pena',
    objectPosition: 'center',
  },
  {
    box: 'BOX 04',
    title: 'Estão de Olho em Você',
    price: 'R$ 149,90',
    href: '/loja/tcc-caixa-04-avulsa',
    image: archiveBox04,
    alt: 'Box 04 — Estão de Olho em Você',
    objectPosition: 'center',
  },
]

type SuggestedLandingProps = {
  fontClassName: string
}

/** Noise overlay used as a subtle film-grain texture over the whole page. */
const grainNoiseUrl =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/* Reusable composite-transition values (kept as constants since they're
   shared verbatim across several elements from the original stylesheet). */
const transitionColors =
  '[transition:translate_0.24s_cubic-bezier(0.22,1,0.36,1),rotate_0.24s_cubic-bezier(0.22,1,0.36,1),scale_0.24s_cubic-bezier(0.22,1,0.36,1),transform_0.24s_cubic-bezier(0.22,1,0.36,1),background-color_0.2s_ease,border-color_0.2s_ease,color_0.2s_ease,box-shadow_0.24s_cubic-bezier(0.22,1,0.36,1)]'
const transitionBgColor =
  '[transition:background-color_0.2s_ease,border-color_0.2s_ease,color_0.2s_ease]'
const transitionChip =
  '[transition:background-color_0.2s_ease,color_0.2s_ease,border-color_0.2s_ease]'
const transitionLift =
  '[transition:translate_0.24s_cubic-bezier(0.22,1,0.36,1),scale_0.24s_cubic-bezier(0.22,1,0.36,1),transform_0.24s_cubic-bezier(0.22,1,0.36,1),box-shadow_0.24s_cubic-bezier(0.22,1,0.36,1)]'
const transitionCardHover =
  '[transition:translate_0.32s_cubic-bezier(0.22,1,0.36,1),transform_0.32s_cubic-bezier(0.22,1,0.36,1),box-shadow_0.32s_cubic-bezier(0.22,1,0.36,1)]'
const transitionPolaroid =
  '[transition:translate_0.3s_cubic-bezier(0.22,1,0.36,1),rotate_0.3s_cubic-bezier(0.22,1,0.36,1),transform_0.3s_cubic-bezier(0.22,1,0.36,1),box-shadow_0.3s_ease]'
const transitionFab =
  '[transition:opacity_0.35s_ease,translate_0.35s_cubic-bezier(0.22,1,0.36,1),scale_0.35s_cubic-bezier(0.22,1,0.36,1),transform_0.35s_cubic-bezier(0.22,1,0.36,1)]'
const arrowTransition =
  '[transition:translate_0.25s_cubic-bezier(0.22,1,0.36,1),transform_0.25s_cubic-bezier(0.22,1,0.36,1)]'

/** Shared frame for the page's main content sections (matches `max-width: 1180px` + responsive gutters). */
const sectionFrame = 'mx-auto max-w-[1180px] px-8 max-[860px]:px-[22px]'

/** One-shot entrance animation for hero copy lines. */
const heroRevealBase = 'animate-hero-in'

/** Shared look for the two hero/final CTA buttons (filled + outline variants). */
const ctaButtonBase = `inline-flex items-center justify-center rounded-[9px] px-5 py-[14px] text-[14px] leading-none font-bold tracking-[0.04em] whitespace-nowrap uppercase no-underline ${transitionColors} ${fontMono}`

/** Arrow glyph that nudges right on hover — pair with a `group` ancestor. */
const arrowIconClass = `inline-flex items-center leading-none ${arrowTransition} group-hover:translate-x-1`

const featuredByLogos = [
  { src: logoBetoRibeiro, alt: 'Beto Ribeiro' },
  { src: logoVejaSp, alt: 'Veja São Paulo' },
  { src: logoIstoE, alt: 'ISTOÉ' },
  { src: logoCorreioBraziliense, alt: 'Correio Braziliense' },
  { src: logoJanelaPublicitaria, alt: 'Janela Publicitária' },
  { src: logoPoltronaNerd, alt: 'Poltrona Nerd' },
]

export function Landing({ fontClassName }: SuggestedLandingProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showFab, setShowFab] = useState(false)
  const [jsReady, setJsReady] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setJsReady(true)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const handleClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isMenuOpen])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    const hero = document.getElementById('topo')
    const cta = document.getElementById('cta-final')
    if (!hero || !cta) return

    let frame = 0
    const updateFab = () => {
      frame = 0
      const heroOut = hero.getBoundingClientRect().bottom <= 0
      const beforeFinalCta =
        cta.getBoundingClientRect().top > window.innerHeight
      setShowFab(heroOut && beforeFinalCta)
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateFab)
    }

    updateFab()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <JsReadyContext.Provider value={jsReady}>
      <div
        className={`relative z-0 min-h-svh overflow-x-clip bg-(--paper) bg-[radial-gradient(rgba(33,28,24,0.06)_0.7px,transparent_0.7px),radial-gradient(rgba(33,28,24,0.035)_0.7px,transparent_0.7px)] bg-size-[5px_5px,5px_5px] bg-position-[0_0,2px_2px] [font-family:var(--design-font-body),system-ui,sans-serif] text-(--ink) antialiased ${fontClassName}`}
        style={tokens}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-3 bg-size-[160px_160px] opacity-[0.07] mix-blend-multiply"
          style={{ backgroundImage: grainNoiseUrl }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-3 bg-[linear-gradient(rgba(94,72,48,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(94,72,48,0.05)_1px,transparent_1px),radial-gradient(rgba(94,72,48,0.07)_0.6px,transparent_0.6px)] bg-size-[34px_34px,34px_34px,6px_6px] bg-position-[-1px_-1px,-1px_-1px,0_0] opacity-55 mix-blend-multiply"
        />
        <PromoMarquee />
        <SuggestedHeader
          headerRef={headerRef}
          isMenuOpen={isMenuOpen}
          onCloseMenu={closeMenu}
          onToggleMenu={() => setIsMenuOpen((current) => !current)}
        />
        <main>
          <Hero />
          <RibbonMarquee />
          <Reveal>
            <ClubIntro />
          </Reveal>
          <Reveal>
            <FeaturedBy />
          </Reveal>
          <Reveal>
            <BoxContents />
          </Reveal>
          <Reveal>
            <HowItWorks />
          </Reveal>
          <Reveal>
            <Testimonials />
          </Reveal>
          <Reveal>
            <PlanCards />
          </Reveal>
          <Reveal>
            <StandaloneEdition />
          </Reveal>
          <ArchiveBand />
          <Reveal>
            <FinalCta />
          </Reveal>
        </main>
        <SuggestedFooter />
        <SuggestedFab isVisible={showFab} />
      </div>
    </JsReadyContext.Provider>
  )
}

function PromoMarquee() {
  const items = [...promoItems, ...promoItems]

  return (
    <div
      className={`marquee-group relative overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--red) whitespace-nowrap text-[#fbf9f6] before:absolute before:inset-y-0 before:left-0 before:w-2 before:bg-[radial-gradient(circle_at_4px_6px,transparent_3px,rgba(33,28,24,0.18)_3.2px,transparent_4px)] before:bg-size-[8px_12px] before:content-[''] after:absolute after:inset-y-0 after:right-0 after:w-2 after:-scale-x-100 after:bg-[radial-gradient(circle_at_4px_6px,transparent_3px,rgba(33,28,24,0.18)_3.2px,transparent_4px)] after:bg-size-[8px_12px] after:content-['']`}
    >
      <div
        className={`animate-marquee py-[9px] text-[13px] tracking-[0.06em] ${fontType} motion-reduce:animate-none`}
        style={{ '--marquee-duration': '32s' } as CSSProperties}
      >
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex">
            <span className="pr-[42px]">{item}</span>
            <span className="pr-[42px] text-white/55" aria-hidden="true">
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

type SuggestedHeaderProps = {
  isMenuOpen: boolean
  onToggleMenu: () => void
  onCloseMenu: () => void
  headerRef: RefObject<HTMLElement | null>
}

function SuggestedHeader({
  headerRef,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
}: SuggestedHeaderProps) {
  return (
    <header
      ref={headerRef}
      className={`z-50 border-b ${
        isMenuOpen
          ? 'fixed inset-x-0 top-0 border-[rgba(33,28,24,0.12)] bg-(--paper)'
          : 'sticky top-0 border-dashed border-[rgba(33,28,24,0.22)] bg-[rgba(237,228,221,0.92)] backdrop-blur-sm'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-6 ${sectionFrame} py-[14px]`}
      >
        <a
          href="#topo"
          className="flex min-w-0 items-center no-underline"
          onClick={onCloseMenu}
        >
          <Image
            src={logo}
            alt="TrueCrime.Club"
            className="block h-8 w-auto"
            priority
          />
        </a>

        <nav
          className={`flex items-center gap-[22px] text-[13px] tracking-[0.03em] whitespace-nowrap uppercase max-[860px]:hidden ${fontType}`}
          aria-label="Navegação principal"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative pb-[3px] text-(--ink) no-underline ${transitionColors} after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-current after:content-[''] after:[transition:scale_0.28s_cubic-bezier(0.22,1,0.36,1),transform_0.28s_cubic-bezier(0.22,1,0.36,1)] hover:text-(--red) hover:after:scale-x-100`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className={`inline-flex items-end gap-[7px] text-[13px] leading-none tracking-[0.04em] text-(--ink) uppercase no-underline ${transitionColors} hover:text-(--red) max-[860px]:hidden ${fontType}`}
          >
            <IconUser size={16} stroke={2} className="shrink-0" aria-hidden />
            <span className="leading-none">Entrar</span>
          </Link>
          <Link
            href="/carrinho"
            aria-label="Caixas no carrinho — finalizar compra"
            className={`relative inline-flex size-[42px] items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--card) text-(--ink) no-underline ${transitionColors} hover:bg-(--ink) hover:text-[#fbf9f6]`}
          >
            <IconShoppingBag size={20} stroke={1.75} aria-hidden />
            <span
              className={`absolute top-[-7px] right-[-7px] flex h-[19px] min-w-[19px] items-center justify-center rounded-[10px] border-[1.5px] border-(--paper) bg-(--red) px-[5px] text-[11px] font-bold text-[#fbf9f6] ${fontMono}`}
            >
              2
            </span>
          </Link>
          <Link
            href="/assinatura"
            className={`inline-flex items-center rounded-lg border border-[rgba(33,28,24,0.15)] bg-(--ink) px-[18px] py-[11px] text-[13px] leading-none font-bold tracking-[0.04em] text-[#fbf9f6] uppercase no-underline shadow-[0_6px_16px_-6px_rgba(33,28,24,0.18)] ${transitionColors} hover:-translate-y-0.5 hover:shadow-[0_11px_24px_-8px_rgba(33,28,24,0.22)] max-[860px]:hidden ${fontMono}`}
          >
            Assinar
          </Link>
          <button
            type="button"
            className="hidden size-[42px] items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--ink) p-0 text-[#fbf9f6] max-[860px]:inline-flex"
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
          >
            <IconMenu2 size={19} stroke={2.2} aria-hidden />
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          className={`flex flex-col gap-0.5 border-t border-[rgba(33,28,24,0.12)] px-[22px] pt-2 pb-[18px] text-[14px] tracking-[0.03em] uppercase ${fontType}`}
          aria-label="Navegação mobile"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onCloseMenu}
              className="border-b border-[rgba(33,28,24,0.08)] px-1 py-[13px] text-(--ink) no-underline"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-[14px] flex gap-[10px]">
            <Link
              href="/login"
              onClick={onCloseMenu}
              className={`inline-flex flex-1 items-center justify-center gap-[7px] rounded-[9px] border border-[rgba(33,28,24,0.2)] p-[13px] leading-none font-bold tracking-[0.04em] text-(--ink) no-underline ${transitionColors} hover:border-(--red) hover:text-(--red)`}
            >
              <IconUser size={16} stroke={2} className="shrink-0" aria-hidden />
              <span className="leading-none">Entrar</span>
            </Link>
            <Link
              href="/assinatura"
              onClick={onCloseMenu}
              className={`inline-flex flex-1 items-center justify-center rounded-[9px] border border-[rgba(33,28,24,0.15)] bg-(--red) p-[13px] font-bold tracking-[0.04em] text-[#fbf9f6] no-underline ${transitionColors} hover:bg-(--red-deep)`}
            >
              Assinar
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  )
}

function Hero() {
  return (
    <section
      id="topo"
      className="relative min-h-[620px] overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--night) bg-cover bg-position-[72%_center] bg-no-repeat max-[540px]:flex max-[540px]:min-h-[620px] max-[540px]:flex-col max-[540px]:justify-end"
      style={{ backgroundImage: `url(${heroImage.src})` }}
    >
      <div className="absolute inset-0 [background:linear-gradient(90deg,rgba(15,11,9,0.96)_0%,rgba(15,11,9,0.86)_32%,rgba(15,11,9,0.46)_55%,rgba(15,11,9,0.06)_76%,rgba(15,11,9,0)_100%)] max-[540px]:[background:linear-gradient(180deg,rgba(15,11,9,0.3)_0%,rgba(15,11,9,0.1)_30%,rgba(15,11,9,0.6)_64%,rgba(15,11,9,0.95)_100%)]" />
      <div className="absolute inset-0 [background:linear-gradient(0deg,rgba(15,11,9,0.6)_0%,rgba(15,11,9,0)_34%)]" />
      <div
        className={`relative z-4 mx-auto max-w-[1180px] px-8 pt-24 pb-[108px] max-[860px]:px-[22px] max-[540px]:flex max-[540px]:flex-col max-[540px]:pt-[30px] max-[540px]:pb-[34px]`}
      >
        <div className="max-w-[580px]">
          <div
            className={`mb-[22px] inline-flex items-center gap-[9px] rounded-[2px] border border-white/28 bg-white/8 px-[14px] py-2 text-[12px] leading-none font-bold tracking-[0.12em] text-[#f4ecdc] uppercase backdrop-blur-xs ${fontMono} ${heroRevealBase}`}
            style={{ animationDelay: '0.05s' }}
          >
            <span className="size-2 shrink-0 rounded-full bg-[#ff6e50] shadow-[0_0_8px_rgba(255,110,80,0.8)]" />
            O primeiro Clube de True Crime do Brasil
          </div>
          <h1
            className={`m-0 mb-[22px] text-[clamp(42px,5.8vw,74px)] leading-[0.98] font-semibold tracking-[-0.02em] text-[#fdf8ef] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] ${fontHeading}`}
          >
            <span
              className={`block ${heroRevealBase}`}
              style={{ animationDelay: '0.12s' }}
            >
              Um único caso.
            </span>
            <span
              className={`block ${heroRevealBase}`}
              style={{ animationDelay: '0.2s' }}
            >
              Doze caixas.
            </span>
            <span
              className={`block text-[#ff6e50] ${heroRevealBase}`}
              style={{ animationDelay: '0.28s' }}
            >
              Um ano de investigação.
            </span>
          </h1>
          <p
            className={`mb-[14px] max-w-[440px] text-[19px] leading-normal text-[#eae2d6] [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] ${heroRevealBase}`}
            style={{ animationDelay: '0.36s' }}
          >
            A cada mês, uma caixa traz mais um capítulo do mesmo mistério: itens
            exclusivos, colecionáveis e novas pistas. Ao longo de 12 caixas você
            junta tudo e decide quem foi.
          </p>
          <div
            className={`flex flex-wrap items-center gap-[14px] ${heroRevealBase} max-[540px]:flex-col max-[540px]:items-stretch`}
            style={{ animationDelay: '0.52s' }}
          >
            <Link
              href="/assinatura"
              className={`group ${ctaButtonBase} gap-2 border border-[rgba(33,28,24,0.15)] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:-translate-y-0.5 hover:bg-(--red-deep) hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)] max-[540px]:w-full`}
            >
              Quero assinar{' '}
              <IconArrowRight
                size={16}
                stroke={2}
                className={arrowIconClass}
                aria-hidden
              />
            </Link>
            <a
              href="#funciona"
              className={`${ctaButtonBase} border border-white/40 bg-transparent text-[#f4ecdc] hover:bg-[#fbf9f6] hover:text-(--ink) max-[540px]:w-full`}
            >
              Como funciona
            </a>
          </div>
          <div
            className={`mt-[30px] flex items-center gap-[18px] text-[12.5px] tracking-[0.02em] text-[#c9bfb0] ${fontType} ${heroRevealBase}`}
            style={{ animationDelay: '0.6s' }}
          >
            <div className="flex" aria-hidden="true">
              <span className="size-7 rounded-full border border-white/40 bg-(--yellow)" />
              <span className="ml-[-9px] size-7 rounded-full border border-white/40 bg-(--purple)" />
              <span className="ml-[-9px] size-7 rounded-full border border-white/40 bg-(--teal)" />
              <span className="ml-[-9px] size-7 rounded-full border border-white/40 bg-(--red)" />
            </div>
            Mais de 1000 investigadores ativos no clube
          </div>
        </div>

        <div
          className={`absolute right-8 bottom-[26px] z-4 flex items-center gap-3 border border-l-[3px] border-white/18 border-l-(--yellow) bg-[rgba(15,11,9,0.55)] px-[14px] py-[10px] backdrop-blur-[6px] ${heroRevealBase} max-[860px]:right-[22px] max-[540px]:static max-[540px]:right-auto max-[540px]:bottom-auto max-[540px]:mt-[22px] max-[540px]:flex-wrap max-[540px]:justify-center`}
          style={{ animationDelay: '0.68s' }}
        >
          <span
            className={`text-[10.5px] tracking-[0.08em] text-(--yellow) ${fontType}`}
          >
            CASO EM CURSO · CAIXA 03/12
          </span>
          <i
            aria-hidden="true"
            className="inline-block h-[13px] w-px bg-white/30"
          />
          <strong
            className={`text-[14px] font-semibold text-[#fbf9f6] ${fontHeading}`}
          >
            O Caso Victória Monteiro
          </strong>
        </div>
      </div>
    </section>
  )
}

function RibbonMarquee() {
  const items = [...ribbonItems, ...ribbonItems]

  return (
    <div className="marquee-group relative overflow-hidden border-y border-[rgba(33,28,24,0.15)] bg-(--ink) whitespace-nowrap text-(--paper)">
      <div
        className={`animate-marquee py-[15px] text-[23px] font-semibold tracking-[0.01em] motion-reduce:animate-none ${fontHeading}`}
        style={{ '--marquee-duration': '40s' } as CSSProperties}
      >
        {items.map((item, index) => (
          <span
            key={`${item.label}-${index}`}
            className="inline-flex items-center"
          >
            <span className="px-7">{item.label}</span>
            <span
              className="px-7 align-middle text-[14px]"
              style={{ color: item.color }}
              aria-hidden="true"
            >
              ✶
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

function ClubIntro() {
  return (
    <section id="oque" className={`${sectionFrame} pt-24 pb-6`}>
      <div className="relative overflow-hidden rounded-[14px_14px_18px_18px] border border-[rgba(33,28,24,0.18)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_120px)] px-12 pt-[60px] pb-[52px] shadow-[0_18px_40px_-18px_rgba(33,28,24,0.22),inset_0_0_0_1px_rgba(255,255,255,0.5)] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(var(--paper-soft)_0,var(--paper-soft)_31px,rgba(33,28,24,0.05)_31px,rgba(33,28,24,0.05)_32px)] before:opacity-40 before:content-[''] max-[860px]:px-7 max-[860px]:pt-[52px] max-[860px]:pb-[44px]">
        <div
          className={`absolute -top-px left-11 inline-flex -translate-y-full items-center gap-[10px] rounded-t-[10px] border border-b-0 border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-[18px] py-[9px] pb-[11px] text-[11px] tracking-[0.14em] text-(--ink) uppercase ${fontType}`}
        >
          <span className="font-bold text-(--red)">DOSSIÊ</span>O CLUBE
        </div>
        <div
          aria-hidden="true"
          className="absolute top-[18px] right-10 size-4 rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.4),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,#f47878_0%,var(--red)_55%,var(--red-deep)_100%)]"
        />
        <div className="relative z-1 grid grid-cols-[0.85fr_1.15fr] items-start gap-12 max-[860px]:grid-cols-1">
          <div>
            <SectionEyebrow>01 — O que é o Club</SectionEyebrow>
            <h2
              className={`m-0 text-[clamp(30px,3.6vw,46px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
            >
              Não é sobre o crime. É sobre as pessoas por trás dele.
            </h2>
          </div>
          <div>
            <p className="m-0 mb-5 text-[18.5px] leading-[1.6] text-(--ink-soft) first-letter:float-left first-letter:mt-[6px] first-letter:pr-3 first-letter:[font-family:var(--design-font-heading),system-ui,sans-serif] first-letter:text-[3.6em] first-letter:leading-[0.78] first-letter:font-bold first-letter:text-(--red)">
              O TrueCrime Club é um clube de assinatura que transforma o melhor
              do gênero numa experiência física. Cada caso é uma história longa,
              contada ao longo de 12 caixas mensais — depoimentos, mapas,
              fotografias e pistas de um mistério fictício, cuidadosamente
              construído pra te fazer pensar.
            </p>
            <p className="m-0 text-[18.5px] leading-[1.6] text-(--ink-soft)">
              A cada caixa, a história avança. Você conecta os pontos no seu
              tempo, debate as teorias com outros membros e, no fim, desvenda: o
              que realmente aconteceu? Curiosidade sobre o comportamento humano
              — essa é a verdadeira investigação.
            </p>
            <div className="mt-[30px] flex flex-wrap gap-[10px]">
              <span
                className={`inline-flex items-center gap-[7px] rounded-[2px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-[14px] py-2 text-[11.5px] tracking-[0.06em] uppercase ${transitionChip} hover:border-(--red) hover:bg-(--red) hover:text-[#fbf9f6] ${fontType}`}
              >
                SEM SPOILER, SEM CLICHÊ
              </span>
              <span
                className={`inline-flex items-center gap-[7px] rounded-[2px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-[14px] py-2 text-[11.5px] tracking-[0.06em] uppercase ${transitionChip} hover:border-(--red) hover:bg-(--red) hover:text-[#fbf9f6] ${fontType}`}
              >
                <IconRefresh size={14} stroke={1.75} aria-hidden />
                HISTÓRIA CONTÍNUA
              </span>
              <span
                className={`inline-flex items-center gap-[7px] rounded-[2px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-[14px] py-2 text-[11.5px] tracking-[0.06em] uppercase ${transitionChip} hover:border-(--red) hover:bg-(--red) hover:text-[#fbf9f6] ${fontType}`}
              >
                <IconSparkles size={14} stroke={1.75} aria-hidden />
                FEITO PRA COLECIONAR
              </span>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-10 bottom-7 flex size-[116px] rotate-[-14deg] items-center justify-center rounded-full border-2 border-[rgba(26,165,135,0.7)] text-center text-[11px] font-bold tracking-[0.14em] text-[rgba(26,165,135,0.85)] uppercase opacity-60 shadow-[inset_0_0_0_1px_rgba(26,165,135,0.4)] max-[860px]:hidden ${fontType}`}
        >
          ARQUIVO PRIVADO
        </div>
      </div>
    </section>
  )
}

function FeaturedBy() {
  return (
    <section
      className="relative overflow-hidden pt-[84px] pb-6"
      aria-label="Veiculado na imprensa"
    >
      <div className="relative h-auto leading-none">
        <div className="mx-auto flex h-auto max-w-[1180px] items-end justify-start px-8 max-[860px]:px-[22px] max-[540px]:justify-center">
          <Image
            src={featuredSilhuetas}
            alt="Dois investigadores em conversa"
            className="relative z-1 size-auto max-h-[clamp(140px,16vw,200px)] max-w-[240px] object-contain object-bottom-left filter-[contrast(1.06)_saturate(0.9)] max-[860px]:max-h-[clamp(120px,28vw,170px)] max-[860px]:max-w-[70%] max-[860px]:object-bottom max-[540px]:max-h-[clamp(110px,32vw,150px)] max-[540px]:max-w-[78%]"
            sizes="(max-width: 860px) 70vw, 240px"
            priority={false}
          />
        </div>
      </div>
      <div className="relative bg-black px-0 py-7 pb-8">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center gap-[18px] px-8 max-[860px]:px-[22px]">
          <span className="[font-family:var(--design-font-body),system-ui,sans-serif] text-[14px] font-bold tracking-[0.32em] text-white opacity-85">
            DIVULGADO EM
          </span>
          <div className="grid w-full grid-cols-6 items-center justify-items-center gap-x-[clamp(16px,3vw,40px)] gap-y-6 max-[860px]:grid-cols-3 max-[860px]:gap-x-5 max-[860px]:gap-y-7 max-[540px]:grid-cols-2 max-[540px]:gap-x-4 max-[540px]:gap-y-6">
            {featuredByLogos.map((item) => (
              <Image
                key={item.alt}
                src={item.src}
                alt={item.alt}
                className="h-auto max-h-[58px] w-full object-contain opacity-[0.92] transition-opacity duration-200 ease-linear hover:opacity-100 max-[860px]:max-h-[50px] max-[540px]:max-h-[44px]"
                sizes="(max-width: 540px) 45vw, 180px"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const boardPinOffsets = [
  'calc(12.5% - 7.5px)',
  'calc(37.5% - 2.5px)',
  'calc(62.5% + 2.5px)',
  'calc(87.5% + 7.5px)',
]

function BoxContents() {
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState<number | null>(null)

  return (
    <section className={`${sectionFrame} pt-[84px] pb-6`}>
      <SectionEyebrow>02 — Dentro da caixa</SectionEyebrow>
      <h2
        className={`m-0 mb-11 max-w-[640px] text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
      >
        Cada caixa é uma cena montada pra você desvendar.
      </h2>
      <div className="relative">
        <div className="relative grid grid-cols-4 gap-5 max-[860px]:grid-cols-2 max-[540px]:grid-cols-1">
          {/* SVG connecting line, hidden on mobile */}
          <svg
            width="100%"
            className="pointer-events-none absolute inset-x-0 top-0 z-2 hidden h-16 overflow-visible opacity-60 md:block"
            aria-hidden="true"
          >
            <motion.line
              animate={{
                x1: 'calc(12.5% - 7.5px)',
                y1: hoveredBoxIndex === 0 ? '19px' : '29px',
                x2: 'calc(37.5% - 2.5px)',
                y2: hoveredBoxIndex === 1 ? '19px' : '29px',
              }}
              transition={SPRING_TRANSITION}
              stroke="var(--red)"
              strokeWidth="2"
              strokeDasharray="7 4"
            />
            <motion.line
              animate={{
                x1: 'calc(37.5% - 2.5px)',
                y1: hoveredBoxIndex === 1 ? '19px' : '29px',
                x2: 'calc(62.5% + 2.5px)',
                y2: hoveredBoxIndex === 2 ? '19px' : '29px',
              }}
              transition={SPRING_TRANSITION}
              stroke="var(--red)"
              strokeWidth="2"
              strokeDasharray="7 4"
            />
            <motion.line
              animate={{
                x1: 'calc(62.5% + 2.5px)',
                y1: hoveredBoxIndex === 2 ? '19px' : '29px',
                x2: 'calc(87.5% + 7.5px)',
                y2: hoveredBoxIndex === 3 ? '19px' : '29px',
              }}
              transition={SPRING_TRANSITION}
              stroke="var(--red)"
              strokeWidth="2"
              strokeDasharray="7 4"
            />
          </svg>

          {boxItems.map((item, index) => (
            <FeatureCardItem
              key={item.code}
              item={item}
              index={index}
              hoveredBoxIndex={hoveredBoxIndex}
              onMouseEnter={() => setHoveredBoxIndex(index)}
              onMouseLeave={() => setHoveredBoxIndex(null)}
            />
          ))}
          {boxItems.map((item, index) => (
            <motion.span
              key={`${item.code}-board-pin`}
              className="pointer-events-none absolute top-[22px] z-4 size-[14px] -translate-x-1/2 rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.45),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0%,var(--pin,var(--red))_55%,rgba(0,0,0,0.4)_100%)] max-[860px]:hidden"
              animate={{
                y: hoveredBoxIndex === index ? -10 : 0,
              }}
              transition={SPRING_TRANSITION}
              style={
                {
                  '--pin': item.color,
                  left: boardPinOffsets[index],
                } as CSSProperties
              }
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCardItem({
  item,
  index,
  hoveredBoxIndex,
  onMouseEnter,
  onMouseLeave,
}: {
  item: (typeof boxItems)[number]
  index: number
  hoveredBoxIndex: number | null
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const Icon = item.icon
  const {
    ref: revealRef,
    revealClassName,
    style: revealStyle,
  } = useReveal(index * 80)
  const isHovered = hoveredBoxIndex === index

  return (
    <div
      ref={revealRef}
      className={`relative ${revealClassName}`}
      style={revealStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.article
        animate={{
          y: isHovered ? -10 : 0,
          rotate: isHovered ? 0 : index % 2 ? 1.4 : -1.4,
        }}
        transition={SPRING_TRANSITION}
        className="relative z-1 flex flex-col rounded-[4px_4px_10px_10px] border border-[rgba(33,28,24,0.15)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_80px)] px-6 pt-[30px] pb-[26px] shadow-[0_14px_30px_-14px_rgba(33,28,24,0.22),inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-shadow duration-300 hover:shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3),inset_0_0_0_1px_rgba(255,255,255,0.6)]"
      >
        <div className="mt-2 mb-[18px] flex items-center justify-between gap-3">
          <Icon color={item.color} size={40} stroke={1.5} aria-hidden />
          <span
            className={`flex-none rounded-[2px] border border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-3 py-1 pb-[5px] text-[10.5px] tracking-widest whitespace-nowrap text-(--ink-mute) uppercase ${fontType}`}
          >
            {item.code}
          </span>
        </div>
        <h3
          className={`m-0 mb-2 text-[20px] leading-[1.1] font-semibold ${fontHeading}`}
        >
          {item.title}
        </h3>
        <p className="m-0 text-[14.5px] leading-normal text-[#4a423a]">
          {item.description}
        </p>
      </motion.article>
      <span
        className="absolute top-[22px] left-1/2 z-3 size-[14px] -translate-x-1/2 rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.45),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0%,var(--pin,var(--red))_55%,rgba(0,0,0,0.4)_100%)] md:hidden"
        style={{ '--pin': item.color } as CSSProperties}
        aria-hidden="true"
      />
    </div>
  )
}

const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 85,
  damping: 13,
  mass: 0.7,
} as const

function HowItWorks() {
  return (
    <section id="funciona" className={`${sectionFrame} pt-[84px] pb-6`}>
      <SectionEyebrow>03 — Como funciona</SectionEyebrow>
      <h2
        className={`m-0 mb-[30px] max-w-[580px] text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
      >
        Três passos entre você e o próximo caso.
      </h2>
      <div className="relative grid grid-cols-3 overflow-hidden rounded-2xl border border-[rgba(33,28,24,0.15)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_120px)] shadow-[0_16px_34px_-12px_rgba(33,28,24,0.2),inset_0_0_0_1px_rgba(255,255,255,0.5)] max-[860px]:grid-cols-1">
        <div
          aria-hidden="true"
          className="absolute inset-x-[16%] top-[30px] z-0 h-0.5 bg-[repeating-linear-gradient(90deg,var(--red)_0,var(--red)_7px,transparent_7px,transparent_11px)] opacity-45 max-[860px]:hidden"
        />
        {steps.map((step, index) => (
          <StepItem
            key={step.number}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

function StepItem({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[number]
  index: number
  isLast: boolean
}) {
  const {
    ref: revealRef,
    revealClassName,
    style: revealStyle,
  } = useReveal(index * 90)
  return (
    <article
      ref={revealRef}
      className={`relative z-1 px-[26px] pt-[26px] pb-6 ${
        isLast
          ? ''
          : 'border-r border-dashed border-[rgba(33,28,24,0.18)] max-[860px]:border-r-0 max-[860px]:border-b'
      } ${revealClassName}`}
      style={revealStyle}
    >
      <span
        className="absolute top-[22px] left-1/2 size-[14px] -translate-x-1/2 rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.45),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0%,var(--pin,var(--red))_55%,rgba(0,0,0,0.4)_100%)]"
        style={{ '--pin': step.color } as CSSProperties}
        aria-hidden="true"
      />
      <div
        className={`mt-[26px] mb-[14px] text-center text-[44px] leading-none font-bold ${fontHeading}`}
        style={{ color: step.color }}
      >
        {step.number}
      </div>
      <h3
        className={`m-0 mb-[9px] text-center text-[22px] font-semibold ${fontHeading}`}
      >
        {step.title}
      </h3>
      <p className="m-0 text-center text-[15px] leading-[1.55]">
        {step.description}
      </p>
    </article>
  )
}

function Testimonials() {
  return (
    <section className={`${sectionFrame} pt-[84px] pb-6`}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Depoimentos · @oficialtruecrime.club</SectionEyebrow>
          <h2
            className={`m-0 max-w-[620px] text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
          >
            O que os investigadores andam falando.
          </h2>
        </div>
        <div
          className={`rounded-[2px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-[14px] py-2 text-[11.5px] tracking-[0.06em] text-(--ink-mute) uppercase ${fontType}`}
        >
          comentários reais do Instagram
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[22px] max-[860px]:grid-cols-2 max-[540px]:flex max-[540px]:[scroll-snap-type:x_mandatory] max-[540px]:grid-cols-none max-[540px]:gap-[14px] max-[540px]:overflow-x-auto max-[540px]:mask-[linear-gradient(90deg,#000_80%,transparent_100%)] max-[540px]:pb-1.5 max-[540px]:[-webkit-overflow-scrolling:touch]">
        {testimonials.map((testimonial, index) => (
          <TestimonialCardItem
            key={testimonial.user}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

function TestimonialCardItem({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number]
  index: number
}) {
  const {
    ref: revealRef,
    revealClassName,
    style: revealStyle,
  } = useReveal(index * 80)
  const tilt = index % 2 ? 'rotate-[1.8deg]' : 'rotate-[-1.8deg]'
  return (
    <article
      ref={revealRef}
      className={`relative flex flex-col rounded-[3px] border border-[rgba(33,28,24,0.14)] bg-(--card) px-[22px] pt-[26px] pb-[18px] shadow-[0_12px_26px_-12px_rgba(33,28,24,0.28),inset_0_0_0_1px_rgba(255,255,255,0.6)] ${transitionPolaroid} ${tilt} hover:shadow-[0_22px_40px_-16px_rgba(33,28,24,0.34),inset_0_0_0_1px_rgba(255,255,255,0.7)] max-[540px]:flex-[0_0_80%] max-[540px]:snap-start ${revealClassName}`}
      style={revealStyle}
    >
      <span
        aria-hidden="true"
        className="absolute top-[-10px] left-1/2 h-[22px] w-[64px] -translate-x-1/2 -rotate-2 border-x border-dashed border-[rgba(33,28,24,0.18)] bg-[rgba(239,188,24,0.55)] shadow-[0_2px_4px_rgba(33,28,24,0.15)]"
      />
      <IconQuote
        color={testimonial.color}
        size={26}
        stroke={1.5}
        className="mb-3 opacity-90"
        aria-hidden
      />
      <p className="m-0 mb-[18px] line-clamp-5 flex-1 overflow-hidden text-[15px] leading-[1.55] text-(--ink) italic">
        {testimonial.text}
      </p>
      <div
        className={`flex items-center gap-2 border-t border-dashed border-[rgba(33,28,24,0.2)] pt-3 text-[11.5px] tracking-[0.02em] text-(--ink-mute) ${fontType}`}
      >
        <span
          className="size-2 flex-none rounded-full"
          style={{ background: testimonial.color }}
        />
        <strong className="font-bold text-(--ink)">{testimonial.user}</strong>
        <em className="ml-auto inline-flex items-center gap-1 not-italic">
          <IconHeart size={12} stroke={2} aria-hidden />
          {testimonial.likes}
        </em>
      </div>
    </article>
  )
}

function PlanCards() {
  return (
    <section id="planos" className={`${sectionFrame} pt-24 pb-6`}>
      <div className="mb-12 text-center">
        <SectionEyebrow>04 — Escolha seu plano</SectionEyebrow>
        <h2
          className={`m-0 mx-auto max-w-[580px] text-[clamp(30px,3.8vw,48px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
        >
          Entre pro clube. O próximo caso já está te esperando.
        </h2>
      </div>
      <div className="mx-auto grid max-w-[840px] grid-cols-2 items-start gap-6 max-[860px]:grid-cols-1">
        <article className="relative mt-[26px] rounded-[14px_14px_16px_16px] border border-[rgba(33,28,24,0.15)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_100px)] px-[30px] pt-[34px] pb-[30px] shadow-[0_16px_34px_-12px_rgba(33,28,24,0.2),inset_0_0_0_1px_rgba(255,255,255,0.5)]">
          <div
            className={`absolute -top-px left-[26px] -translate-y-full rounded-t-[9px] border border-b-0 border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-4 py-[7px] pb-[9px] text-[10.5px] tracking-[0.14em] text-(--ink-mute) uppercase ${fontType}`}
          >
            MENSAL
          </div>
          <div
            className={`mb-[18px] text-[12.5px] tracking-[0.08em] text-(--ink-mute) uppercase ${fontType}`}
          >
            Plano Mensal
          </div>
          <div className="mb-1.5 flex items-end gap-1.5">
            <strong
              className={`text-[48px] leading-[0.9] font-semibold ${fontHeading}`}
            >
              R$ 149,90
            </strong>
            <span
              className={`pb-1.5 text-[13px] text-(--ink-mute) ${fontType}`}
            >
              /mês
            </span>
          </div>
          <p className="m-0 mb-[22px] text-[14px] text-(--ink-mute)">
            Flexível. Cancele quando quiser.
          </p>
          <div className="mb-[22px] h-[1.5px] [background:repeating-linear-gradient(90deg,rgba(33,28,24,0.18)_0,rgba(33,28,24,0.18)_5px,transparent_5px,transparent_9px)]" />
          <FeatureList
            color="#1AA587"
            items={[
              '1 caixa por mês, avançando o caso do ano',
              'Acesso à comunidade de membros',
              'Itens e dossiês exclusivos',
              'Sem fidelidade',
            ]}
          />
          <Link
            href="/assinatura"
            className={`flex w-full items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-transparent px-4 py-[15px] text-[14px] leading-none font-bold tracking-[0.04em] text-(--ink) uppercase no-underline ${transitionBgColor} hover:bg-(--ink) hover:text-[#fbf9f6] ${fontMono}`}
          >
            Assinar mensal
          </Link>
        </article>

        <article className="relative mt-[26px] self-start">
          <div className="absolute inset-0 z-0 translate-y-[-3px] rotate-[-2.5deg] rounded-2xl bg-(--purple-deep) shadow-[0_16px_30px_-16px_rgba(33,28,24,0.4)]" />
          <div
            className={`absolute top-[-29px] left-[30px] z-0 inline-flex origin-bottom-left rotate-[-2.5deg] items-center gap-[7px] rounded-t-[10px] bg-(--purple-deep) px-5 pt-[7px] pb-[26px] text-[11.5px] font-bold tracking-[0.06em] text-[#fbf4e3] uppercase shadow-[0_6px_14px_-8px_rgba(33,28,24,0.4)] ${fontType}`}
          >
            <IconStarFilled size={14} aria-hidden />
            <span>MAIS VANTAJOSO</span>
          </div>
          <div className="relative z-1 rounded-[14px_14px_16px_16px] bg-(--purple) px-[30px] pt-[34px] pb-[30px] text-[#f4efe6] shadow-[0_20px_40px_-14px_rgba(74,69,128,0.55)]">
            <div
              className={`mb-[18px] text-[12.5px] tracking-[0.08em] text-[#f4cf5a] uppercase ${fontType}`}
            >
              Plano Anual
            </div>
            <div className="mb-1.5 flex items-end gap-1.5">
              <strong
                className={`text-[48px] leading-[0.9] font-semibold ${fontHeading}`}
              >
                R$ 129,90
              </strong>
              <span className={`pb-1.5 text-[13px] text-[#d8d6ea] ${fontType}`}>
                /mês
              </span>
            </div>
            <p className="m-0 mb-[22px] text-[14px] text-[#d8d6ea]">
              Cobrado anualmente · economize R$ 240 no ano.
            </p>
            <div className="mb-[22px] h-[1.5px] [background:repeating-linear-gradient(90deg,rgba(255,255,255,0.28)_0,rgba(255,255,255,0.28)_5px,transparent_5px,transparent_9px)]" />
            <FeatureList
              color="#F4CF5A"
              items={[
                'Tudo do plano mensal',
                '2 meses grátis no ano',
                'Brinde de boas-vindas exclusivo',
                'Acesso antecipado às edições especiais',
              ]}
            />
            <Link
              href="/assinatura"
              className={`group flex w-full items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--yellow) px-4 py-[15px] text-[14px] leading-none font-bold tracking-[0.04em] text-(--ink) uppercase no-underline ${transitionBgColor} hover:bg-[#fbf4e3] hover:text-(--purple) ${fontMono}`}
            >
              Assinar anual{' '}
              <IconArrowRight
                size={16}
                stroke={2}
                className={arrowIconClass}
                aria-hidden
              />
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

function FeatureList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="m-0 mb-[26px] flex list-none flex-col gap-[13px] p-0">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-[11px] text-[15px] leading-[1.4]"
        >
          <IconCheck
            size={16}
            stroke={2.5}
            className="mt-0.5 flex-none"
            style={{ color }}
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

function StandaloneEdition() {
  return (
    <section id="avulsas" className={`${sectionFrame} pt-[84px] pb-6`}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>05 — Edições especiais · avulsas</SectionEyebrow>
          <h2
            className={`m-0 mb-[14px] max-w-[620px] text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
          >
            Casos curtos que fecham numa única caixa.
          </h2>
          <p className="m-0 max-w-[540px] text-[16px] leading-normal">
            Lançamos uma edição especial por vez — um tema à parte do caso
            principal, que você compra avulsa, sem assinar. As anteriores ficam
            nos arquivos.
          </p>
        </div>
      </div>

      <article className="relative grid grid-cols-[1.05fr_0.95fr] overflow-hidden rounded-2xl border border-[rgba(33,28,24,0.15)] bg-(--card) shadow-[0_18px_38px_-14px_rgba(33,28,24,0.18),inset_0_0_0_1px_rgba(255,255,255,0.5)] max-[860px]:grid-cols-1">
        <div className="relative min-h-[360px] overflow-hidden border-r border-[rgba(33,28,24,0.15)] max-[860px]:border-r-0 max-[860px]:border-b">
          <Image
            src={standaloneEdition}
            alt="Caixa avulsa — Edição Copa do Mundo: O Hexa Nunca Visto"
            fill
            sizes="(max-width: 860px) 100vw, 620px"
            className="block object-cover object-center"
          />
          <div
            className={`absolute top-[22px] right-[22px] z-1 flex rotate-[8deg] flex-col gap-[3px] border-2 border-(--red) bg-[rgba(251,249,246,0.7)] px-[14px] py-[10px] pb-[11px] text-center text-[13px] font-bold tracking-[0.14em] text-(--red) uppercase shadow-[inset_0_0_0_1px_rgba(197,39,31,0.4)] backdrop-blur-[2px] ${fontType}`}
          >
            <span>EM CARTAZ</span>
            <span className="text-[9.5px] tracking-widest opacity-80">
              EDIÇÃO LIMITADA
            </span>
          </div>
          <div
            className={`absolute bottom-[18px] left-[18px] z-1 flex items-center gap-2 border border-white/50 bg-[rgba(15,11,9,0.55)] px-[11px] py-[7px] text-[10px] tracking-widest text-[#f4ecdc] uppercase backdrop-blur-xs ${fontType}`}
          >
            <span>FILE Nº</span>
            <i className="font-bold text-(--yellow) not-italic">2026-COPA</i>
          </div>
        </div>
        <div className="flex flex-col justify-center px-10 py-11">
          <div
            className={`mb-[14px] text-[12px] tracking-widest text-(--red) uppercase ${fontType}`}
          >
            Edição especial em cartaz
          </div>
          <h3
            className={`m-0 mb-3 text-[32px] leading-[1.05] font-semibold ${fontHeading}`}
          >
            Edição Copa do Mundo
          </h3>
          <p className="m-0 mb-[26px] max-w-[440px] text-[15.5px] leading-[1.55]">
            Um mistério nos bastidores do maior evento do futebol — itens
            temáticos e um caso completo que você resolve numa única caixa.
            Edição limitada, sem assinatura.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <strong className={`text-[32px] font-semibold ${fontHeading}`}>
              R$ 169,90
            </strong>
            {/* TODO: trocar pelo slug real da edição Copa do Mundo quando o produto existir na loja. */}
            <a
              href="#"
              className={`inline-flex items-center gap-2 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--red) px-[22px] py-[14px] text-[13px] leading-none font-bold tracking-[0.04em] text-[#fbf9f6] uppercase no-underline shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] ${transitionLift} hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)] ${fontMono} group`}
            >
              Comprar agora{' '}
              <IconArrowRight
                size={16}
                stroke={2}
                className={arrowIconClass}
                aria-hidden
              />
            </a>
          </div>
        </div>
      </article>
      <div
        className={`mt-[18px] flex items-center gap-2 text-[12.5px] tracking-[0.02em] text-(--ink-mute) ${fontType}`}
      >
        <span className="size-1.5 rounded-full bg-(--teal) shadow-[0_0_8px_rgba(26,165,135,0.6)]" />
        <a
          href="#arquivos"
          className="group font-bold text-(--red) no-underline"
        >
          ver edições anteriores nos arquivos{' '}
          <IconArrowRight
            size={14}
            stroke={2}
            className={arrowIconClass}
            aria-hidden
          />
        </a>
      </div>
    </section>
  )
}

function ArchiveBand() {
  return (
    <section
      id="arquivos"
      className="relative mt-[88px] border-y border-[rgba(33,28,24,0.15)] text-(--paper) [background:radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_82%_88%,rgba(255,255,255,0.06)_0%,transparent_45%),var(--purple)] before:pointer-events-none before:absolute before:inset-0 before:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.04)_2px,transparent_2px,transparent_22px)] before:content-['']"
    >
      <div className="relative mx-auto max-w-[1180px] px-8 py-[68px] max-[860px]:px-[22px]">
        <div className="mb-11">
          <SectionEyebrow variant="yellow">
            06 — Arquivos do clube
          </SectionEyebrow>
          <h2
            className={`m-0 text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] text-(--paper) ${fontHeading}`}
          >
            Caixas que já passaram — leve avulsas quando quiser.
          </h2>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-[30px] max-[860px]:grid-cols-2 max-[540px]:grid-cols-1">
          {archiveBoxes.map((box, index) => (
            <ArchiveCard key={box.box} box={box} index={index} />
          ))}
        </div>
        <div className="mt-[46px] text-center">
          <Link
            href="/loja"
            className={`group inline-flex items-center justify-center rounded-[9px] border border-white/35 bg-transparent px-[22px] py-[13px] text-[13px] leading-none font-bold tracking-[0.04em] text-(--paper) uppercase no-underline ${transitionBgColor} hover:border-white/60 hover:bg-white/10 ${fontMono}`}
          >
            Acessar todos os arquivos{' '}
            <IconArrowRight
              size={16}
              stroke={2}
              className={arrowIconClass}
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ArchiveCard({
  box,
  index,
}: {
  box: {
    box: string
    title: string
    price: string
    href: string
    image: StaticImageData
    alt: string
    objectPosition: string
  }
  index: number
}) {
  const {
    ref: revealRef,
    revealClassName,
    style: revealStyle,
  } = useReveal(index * 80)
  return (
    <article
      ref={revealRef}
      className={`group relative ${revealClassName}`}
      style={revealStyle}
    >
      <div className="absolute inset-0 z-0 translate-y-[-3px] rotate-[2.5deg] rounded-[10px] bg-(--yellow) shadow-[0_14px_26px_-14px_rgba(0,0,0,0.4)]" />
      <div
        className={`absolute top-[-25px] right-4 z-0 inline-flex origin-bottom-right rotate-[2.5deg] items-center gap-2 rounded-t-[8px] bg-(--yellow) px-[15px] pt-1.5 pb-6 text-[9.5px] tracking-wider text-(--ink) uppercase shadow-[0_6px_14px_-8px_rgba(0,0,0,0.4)] ${fontType}`}
      >
        <span className="font-bold text-(--red)">{box.box}</span>Caso Victória
        Monteiro
      </div>
      <div
        className={`relative z-1 flex flex-col overflow-hidden rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--card) text-(--ink) shadow-[0_9px_22px_-8px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.5)] ${transitionCardHover} group-hover:translate-y-[-5px] group-hover:shadow-[0_20px_36px_-14px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.6)]`}
      >
        <div
          aria-hidden="true"
          className={`absolute top-[10px] right-[10px] z-2 rotate-[-9deg] border-2 border-[rgba(94,94,162,0.85)] bg-[rgba(251,249,246,0.65)] px-[9px] py-[5px] pb-1.5 text-[9.5px] font-bold tracking-[0.14em] text-[rgba(94,94,162,0.95)] uppercase shadow-[inset_0_0_0_1px_rgba(94,94,162,0.4)] backdrop-blur-[2px] ${fontType}`}
        >
          ARQUIVADO
        </div>
        <div className="relative aspect-square overflow-hidden border-b border-[rgba(33,28,24,0.15)]">
          <Image
            src={box.image}
            alt={box.alt}
            fill
            sizes="(max-width: 540px) 100vw, (max-width: 860px) 50vw, 25vw"
            style={{ objectPosition: box.objectPosition }}
            className="block object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col px-4 pt-4 pb-[18px]">
          <div
            className={`mb-[5px] text-[10.5px] tracking-[0.06em] text-(--ink-mute) ${fontType}`}
          >
            {box.box}
          </div>
          <h3
            className={`m-0 mb-4 text-[16.5px] leading-[1.12] font-semibold ${fontHeading}`}
          >
            {box.title}
          </h3>
          <div className="mt-auto flex items-center justify-between gap-[10px]">
            <strong className={`text-[17px] font-semibold ${fontHeading}`}>
              {box.price}
            </strong>
            <Link
              href={box.href}
              className={`inline-flex items-center justify-center rounded-lg bg-(--ink) px-[13px] py-[9px] text-[11px] leading-none font-bold tracking-[0.04em] text-[#fbf9f6] uppercase no-underline ${transitionBgColor} hover:bg-(--red) ${fontMono}`}
            >
              Comprar
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function FinalCta() {
  return (
    <section
      id="cta-final"
      className={`${sectionFrame} relative py-[104px] text-center`}
    >
      <div
        aria-hidden="true"
        className={`relative mx-auto mb-[26px] inline-flex -rotate-3 flex-col gap-0.5 border-[3px] border-(--red) px-[26px] pt-[14px] pb-4 text-[18px] font-bold tracking-[0.16em] text-(--red) uppercase opacity-90 shadow-[inset_0_0_0_1px_rgba(197,39,31,0.4)] ${fontType}`}
      >
        <span>ABERTO PRA</span>
        <span className="text-[15px]">INVESTIGAÇÃO</span>
      </div>
      <SectionEyebrow className="mb-[18px] justify-center">
        A caixa deste mês fecha dia 28
      </SectionEyebrow>
      <h2
        className={`m-0 mx-auto mb-7 max-w-[780px] text-[clamp(34px,5vw,64px)] leading-none font-semibold tracking-[-0.015em] ${fontHeading}`}
      >
        Pronto pra descobrir do que as pessoas são capazes?
      </h2>
      <Link
        href="/assinatura"
        className={`group ${ctaButtonBase} gap-2 border border-[rgba(33,28,24,0.15)] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:-translate-y-0.5 hover:bg-(--red-deep) hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)]`}
      >
        Entrar no clube{' '}
        <IconArrowRight
          size={16}
          stroke={2}
          className={arrowIconClass}
          aria-hidden
        />
      </Link>
      <p
        className={`m-0 mt-[22px] text-[12px] tracking-[0.14em] text-(--ink-mute) uppercase ${fontType}`}
      >
        PRAZO FINAL · 28/JUN · 23H59
      </p>
    </section>
  )
}

function SuggestedFooter() {
  return (
    <footer className="relative border-t border-[rgba(33,28,24,0.15)] bg-(--ink) text-[#c9bfb0]">
      <div className="mx-auto max-w-[1180px] px-8 pt-[58px] pb-[30px] max-[860px]:px-[22px]">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 max-[860px]:grid-cols-2">
          <div>
            <div className="mb-4">
              <Image
                src={logo}
                alt="TrueCrime.Club"
                className="block h-[38px] w-auto"
              />
            </div>
            <p className="m-0 max-w-[280px] text-[14px] leading-[1.55] text-[#c9bfb0]">
              O clube de assinatura true crime pra quem é fascinado pelo
              comportamento humano. Um novo caso, todo mês.
            </p>
            <div
              aria-hidden="true"
              className={`mt-[22px] inline-flex rotate-[-4deg] items-center justify-center border-2 border-[rgba(239,188,24,0.6)] px-[14px] py-1.5 pb-[7px] text-[11px] font-bold tracking-[0.18em] text-[rgba(239,188,24,0.85)] uppercase ${fontType}`}
            >
              CASE FILE
            </div>
          </div>
          <FooterColumn
            title="O Clube"
            links={[
              { href: '#oque', label: 'O que é' },
              { href: '#funciona', label: 'Como funciona' },
              { href: '#planos', label: 'Planos' },
              { href: '#arquivos', label: 'Arquivos' },
              { href: '/design-sugerido', label: 'Design Sugerido' },
              { href: '/api-docs', label: 'Dossiê de API' },
            ]}
          />
          <FooterColumn
            title="Ajuda"
            links={[
              { href: '/faq', label: 'Perguntas frequentes' },
              { href: '/faq', label: 'Entregas e prazos' },
              {
                href: 'mailto:contato@truecrime.club',
                label: 'Fale com a gente',
              },
              { href: '/faq', label: 'Política de cancelamento' },
            ]}
          />
          <FooterColumn
            title="Siga"
            links={[
              {
                href: 'https://instagram.com/oficialtruecrime.club',
                label: 'Instagram',
              },
              { href: '#', label: 'TikTok' },
              { href: '#', label: 'YouTube' },
              { href: '#', label: 'Newsletter' },
            ]}
          />
        </div>
        <div className="mt-9 mb-5 h-[1.5px] [background:repeating-linear-gradient(90deg,rgba(255,255,255,0.16)_0,rgba(255,255,255,0.16)_5px,transparent_5px,transparent_9px)]" />
        <div
          className={`flex flex-wrap justify-between gap-3 text-[11px] tracking-[0.06em] text-[#7a7066] ${fontType}`}
        >
          <span>© 2026 TRUECRIME.CLUB · TODOS OS CASOS RESERVADOS</span>
          <span>CNPJ 00.000.000/0001-00 · FEITO NO BRASIL</span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <h3
        className={`m-0 mb-[14px] text-[11.5px] tracking-[0.08em] text-[#7a7066] uppercase ${fontType}`}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-[10px] text-[14px]">
        {links.map((link) =>
          link.href.startsWith('/') ? (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={`${transitionBgColor} text-[#c9bfb0] no-underline hover:text-(--paper)`}
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={`${transitionBgColor} text-[#c9bfb0] no-underline hover:text-(--paper)`}
            >
              {link.label}
            </a>
          ),
        )}
      </div>
    </div>
  )
}

function SuggestedFab({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={`fixed right-5 bottom-5 z-60 ${transitionFab} motion-reduce:transition-none max-[540px]:inset-x-[14px] max-[540px]:bottom-[14px] ${
        isVisible
          ? ''
          : 'pointer-events-none translate-y-6 scale-[0.96] opacity-0'
      }`}
    >
      <Link
        href="/assinatura"
        className={`flex items-center gap-[11px] rounded-[13px] border border-[rgba(33,28,24,0.25)] bg-(--red) px-6 py-4 text-[14px] leading-none font-bold tracking-[0.04em] text-[#fbf9f6] uppercase no-underline shadow-[0_16px_38px_-10px_rgba(33,28,24,0.55)] ${transitionColors} hover:bg-(--red-deep) max-[540px]:w-full max-[540px]:justify-center ${fontMono}`}
      >
        <IconBoxSeam size={20} stroke={1.75} aria-hidden />
        Entrar no clube
        <IconArrowRight
          size={16}
          stroke={2}
          className="inline-flex items-center leading-none"
          aria-hidden
        />
      </Link>
    </div>
  )
}

/* Mirrors the original `[data-reveal]` CSS: before hydration (`jsReady`
   false) items render in their final state to avoid a flash of hidden
   content; once ready, items fade/slide in as they enter the viewport. */
function useRevealClasses(shown: boolean) {
  const jsReady = useContext(JsReadyContext)
  const visible = shown || !jsReady
  return `[transition:opacity_0.6s_ease,translate_0.6s_cubic-bezier(0.22,1,0.36,1),transform_0.6s_cubic-bezier(0.22,1,0.36,1)] [will-change:opacity,translate,transform] motion-reduce:[transition:none] motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
    visible ? 'opacity-100 translate-y-0' : 'translate-y-4 opacity-0'
  }`
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${useRevealClasses(shown)} ${className ?? ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function useReveal<T extends HTMLElement = HTMLDivElement>(delayMs: number) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return {
    ref,
    revealClassName: useRevealClasses(shown),
    style: { transitionDelay: `${delayMs}ms` },
  }
}

function SectionEyebrow({
  children,
  variant = 'red',
  className,
}: {
  children: ReactNode
  variant?: 'red' | 'yellow'
  className?: string
}) {
  return (
    <div
      className={`mb-4 inline-flex items-center gap-2 text-[13px] leading-none font-bold tracking-[0.12em] uppercase before:inline-block before:h-px before:w-[22px] before:shrink-0 before:bg-current before:content-[''] ${fontType} ${
        variant === 'yellow' ? 'text-(--yellow)' : 'text-(--red)'
      } ${className ?? ''}`}
    >
      {children}
    </div>
  )
}
