'use client'

import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react'

import archiveBox01 from '@/src/assets/images/design-sugerido/box-01.png'
import archiveBox02 from '@/src/assets/images/design-sugerido/box-02.png'
import archiveBox03 from '@/src/assets/images/design-sugerido/box-03.png'
import archiveBox04 from '@/src/assets/images/design-sugerido/box-04.png'
import standaloneEdition from '@/src/assets/images/design-sugerido/edicao-copa.png'
import heroImage from '@/src/assets/images/design-sugerido/hero.jpg'
import logo from '@/src/assets/images/design-sugerido/logo.png'

import styles from './page.module.css'

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

const boxItems = [
  {
    code: 'ITEM A',
    title: 'Colecionáveis exclusivos',
    description:
      'Objetos temáticos produzidos só pra edição do mês. Não se compra em loja nenhuma.',
    color: '#C5271F',
    icon: GiftIcon,
  },
  {
    code: 'ITEM B',
    title: 'Pistas e documentos',
    description:
      'Depoimentos, recortes, mapas e fotos pra você analisar como um verdadeiro investigador.',
    color: '#E0A50A',
    icon: DocumentIcon,
  },
  {
    code: 'ITEM C',
    title: 'Um caso que evolui',
    description:
      'Um único mistério se desdobra ao longo de 12 caixas. Cada uma revela uma nova camada da verdade.',
    color: '#1AA587',
    icon: LayersIcon,
  },
  {
    code: 'ITEM D',
    title: 'Comunidade pra teorizar',
    description:
      'Grupo exclusivo de membros pra trocar teorias, palpites e descobrir junto.',
    color: '#5E5EA2',
    icon: CommunityIcon,
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
    likes: '♥ 1.243',
    color: '#C5271F',
  },
  {
    text: 'O que me pegou não foi o ‘crime’ — foi entender a cabeça dos personagens. A escrita é absurda de boa.',
    user: '@pedro.hqs',
    likes: '♥ 982',
    color: '#E0A50A',
  },
  {
    text: 'A qualidade dos itens é surreal. Parece que veio de um arquivo de polícia de verdade. 😱',
    user: '@carol.investiga',
    likes: '♥ 760',
    color: '#1AA587',
  },
  {
    text: 'Virou ritual lá em casa. Todo mês a galera vem teorizar junto. Vira um programa.',
    user: '@thiagoreis',
    likes: '♥ 1.510',
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

export function SuggestedLanding({ fontClassName }: SuggestedLandingProps) {
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

    let heroOut = false
    let ctaIn = false
    const updateFab = () => setShowFab(heroOut && !ctaIn)

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroOut = !entry.isIntersecting
        updateFab()
      },
      { threshold: 0 },
    )

    const ctaObserver = new IntersectionObserver(
      ([entry]) => {
        ctaIn = entry.isIntersecting
        updateFab()
      },
      { threshold: 0 },
    )

    heroObserver.observe(hero)
    ctaObserver.observe(cta)

    return () => {
      heroObserver.disconnect()
      ctaObserver.disconnect()
    }
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div
      className={`${styles.page} ${fontClassName} ${
        jsReady ? styles.jsReady : ''
      }`}
    >
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.corkGrid} aria-hidden="true" />
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
  )
}

function PromoMarquee() {
  const items = [...promoItems, ...promoItems]

  return (
    <div className={styles.promoBar}>
      <div className={styles.promoTrack}>
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className={styles.marqueeItem}>
            <span>{item}</span>
            <span aria-hidden="true">●</span>
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
    <header ref={headerRef} className={styles.header}>
      <div className={styles.headerInner}>
        <a href="#topo" className={styles.logoLink} onClick={onCloseMenu}>
          <Image
            src={logo}
            alt="TrueCrime.Club"
            className={styles.headerLogo}
            priority
          />
        </a>

        <nav className={styles.desktopNav} aria-label="Navegação principal">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <Link href="/login" className={styles.loginLink}>
            <UserIcon />
            Entrar
          </Link>
          <Link
            href="/carrinho"
            aria-label="Caixas no carrinho — finalizar compra"
            className={styles.cartButton}
          >
            <BoxIcon />
            <span className={styles.cartBadge}>2</span>
          </Link>
          <Link href="/assinatura" className={styles.headerCta}>
            Assinar
          </Link>
          <button
            type="button"
            className={styles.mobileBurger}
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className={styles.mobileMenu} aria-label="Navegação mobile">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={onCloseMenu}>
              {link.label}
            </a>
          ))}
          <div className={styles.mobileMenuActions}>
            <Link
              href="/login"
              className={styles.mobileLogin}
              onClick={onCloseMenu}
            >
              <UserIcon />
              Entrar
            </Link>
            <Link
              href="/assinatura"
              className={styles.mobileSubscribe}
              onClick={onCloseMenu}
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
      className={styles.hero}
      style={{ backgroundImage: `url(${heroImage.src})` }}
    >
      <div className={styles.heroOverlay} />
      <div className={styles.heroShade} />
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <div
            className={`${styles.heroBadge} ${styles.heroReveal}`}
            style={{ '--hero-delay': '0.05s' } as CSSProperties}
          >
            <span />O primeiro Clube de True Crime do Brasil
          </div>
          <h1>
            <span
              className={`${styles.heroLine} ${styles.heroReveal}`}
              style={{ '--hero-delay': '0.12s' } as CSSProperties}
            >
              Um único caso.
            </span>
            <span
              className={`${styles.heroLine} ${styles.heroReveal}`}
              style={{ '--hero-delay': '0.2s' } as CSSProperties}
            >
              Doze caixas.
            </span>
            <span
              className={`${styles.heroLine} ${styles.heroAccent} ${styles.heroReveal}`}
              style={{ '--hero-delay': '0.28s' } as CSSProperties}
            >
              Um ano de investigação.
            </span>
          </h1>
          <p
            className={`${styles.heroLead} ${styles.heroReveal}`}
            style={{ '--hero-delay': '0.36s' } as CSSProperties}
          >
            A cada mês, uma caixa traz mais um capítulo do mesmo mistério: itens
            exclusivos, colecionáveis e novas pistas. Ao longo de 12 caixas você
            junta tudo e decide quem foi.
          </p>
          {/* <p
            className={`${styles.heroSubcopy} ${styles.heroReveal}`}
            style={{ '--hero-delay': '0.44s' } as CSSProperties}
          >
            Menos sangue, mais gente. Aqui a investigação é sobre o que move as
            pessoas.
          </p> */}
          <div
            className={`${styles.heroCtas} ${styles.heroReveal}`}
            style={{ '--hero-delay': '0.52s' } as CSSProperties}
          >
            <Link href="/assinatura" className={styles.primaryButton}>
              Quero assinar <span className={styles.arrow}>→</span>
            </Link>
            <a href="#funciona" className={styles.secondaryButton}>
              Como funciona
            </a>
          </div>
          <div
            className={`${styles.heroSocial} ${styles.heroReveal}`}
            style={{ '--hero-delay': '0.6s' } as CSSProperties}
          >
            <div className={styles.colorStack} aria-hidden="true">
              <span className={styles.dotYellow} />
              <span className={styles.dotPurple} />
              <span className={styles.dotGreen} />
              <span className={styles.dotRed} />
            </div>
            Mais de 1000 investigadores ativos no clube
          </div>
        </div>

        <div
          className={`${styles.heroCaption} ${styles.heroReveal}`}
          style={{ '--hero-delay': '0.68s' } as CSSProperties}
        >
          <span>CASO EM CURSO · CAIXA 03/12</span>
          <i aria-hidden="true" />
          <strong>O Caso Victória Monteiro</strong>
        </div>
      </div>
    </section>
  )
}

function RibbonMarquee() {
  const items = [...ribbonItems, ...ribbonItems]

  return (
    <div className={styles.ribbon}>
      <div className={styles.ribbonTrack}>
        {items.map((item, index) => (
          <span key={`${item.label}-${index}`} className={styles.ribbonItem}>
            <span>{item.label}</span>
            <span style={{ color: item.color }} aria-hidden="true">
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
    <section id="oque" className={styles.introSection}>
      <div className={styles.introFolder}>
        <div className={styles.introTab}>
          <span>DOSSIÊ</span>O CLUBE
        </div>
        <div className={styles.introPin} aria-hidden="true" />
        <div className={styles.introString} aria-hidden="true" />
        <div className={styles.introGrid}>
          <div>
            <SectionEyebrow>01 — O que é o Club</SectionEyebrow>
            <h2>Não é sobre o crime. É sobre as pessoas por trás dele.</h2>
          </div>
          <div>
            <p>
              O TrueCrime Club é um clube de assinatura que transforma o melhor
              do gênero numa experiência física. Cada caso é uma história longa,
              contada ao longo de 12 caixas mensais — depoimentos, mapas,
              fotografias e pistas de um mistério fictício, cuidadosamente
              construído pra te fazer pensar.
            </p>
            <p>
              A cada caixa, a história avança. Você conecta os pontos no seu
              tempo, debate as teorias com outros membros e, no fim, decide: o
              que realmente aconteceu? Curiosidade sobre o comportamento humano
              — essa é a verdadeira investigação.
            </p>
            <div className={styles.chips}>
              <span>SEM SPOILER, SEM CLICHÊ</span>
              <span>↻ HISTÓRIA CONTÍNUA</span>
              <span>✶ FEITO PRA COLECIONAR</span>
            </div>
          </div>
        </div>
        <div className={styles.introStamp} aria-hidden="true">
          ARQUIVO PRIVADO
        </div>
      </div>
    </section>
  )
}

function BoxContents() {
  return (
    <section className={styles.section}>
      <SectionEyebrow>02 — Dentro da caixa</SectionEyebrow>
      <h2 className={styles.sectionTitle}>
        Cada caixa é uma cena montada pra você desvendar.
      </h2>
      <div className={styles.boxBoard}>
        <div className={styles.boxGrid}>
          <div className={styles.boardString} aria-hidden="true" />
          {boxItems.map((item, index) => (
            <FeatureCardItem key={item.code} item={item} index={index} />
          ))}
          {boxItems.map((item) => (
            <span
              key={`${item.code}-board-pin`}
              className={styles.boardPin}
              style={
                {
                  '--pin': item.color,
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
}: {
  item: (typeof boxItems)[number]
  index: number
}) {
  const Icon = item.icon
  const reveal = useReveal(index * 80)
  return (
    <div className={styles.featureCardSlot} {...reveal}>
      <article
        className={`${styles.featureCard} ${index % 2 ? styles.tiltRight : styles.tiltLeft}`}
      >
        <div className={styles.featureTop}>
          <Icon color={item.color} />
          <span className={styles.featureTab}>{item.code}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </article>
      <span
        className={styles.cardPin}
        style={{ '--pin': item.color } as CSSProperties}
        aria-hidden="true"
      />
    </div>
  )
}

function HowItWorks() {
  return (
    <section id="funciona" className={styles.section}>
      <SectionEyebrow>03 — Como funciona</SectionEyebrow>
      <h2 className={styles.howTitle}>
        Três passos entre você e o próximo caso.
      </h2>
      <div className={styles.stepsCard}>
        <div className={styles.timelineString} aria-hidden="true" />
        {steps.map((step, index) => (
          <StepItem key={step.number} step={step} index={index} />
        ))}
      </div>
    </section>
  )
}

function StepItem({
  step,
  index,
}: {
  step: (typeof steps)[number]
  index: number
}) {
  const reveal = useReveal(index * 90)
  return (
    <article className={styles.stepItem} {...reveal}>
      <span
        className={styles.stepPin}
        style={{ '--pin': step.color } as CSSProperties}
        aria-hidden="true"
      />
      <div className={styles.stepNumber} style={{ color: step.color }}>
        {step.number}
      </div>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
    </article>
  )
}

function Testimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.testimonialsHeader}>
        <div>
          <SectionEyebrow>Depoimentos · @oficialtruecrime.club</SectionEyebrow>
          <h2>O que os investigadores andam falando.</h2>
        </div>
        <div className={styles.testimonialPill}>
          comentários reais do Instagram
        </div>
      </div>
      <div className={styles.testimonialGrid}>
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
  const reveal = useReveal(index * 80)
  const tilt = index % 2 ? styles.polaroidRight : styles.polaroidLeft
  return (
    <article className={`${styles.testimonialCard} ${tilt}`} {...reveal}>
      <span className={styles.polaroidTape} aria-hidden="true" />
      <QuoteIcon color={testimonial.color} />
      <p>{testimonial.text}</p>
      <div className={styles.testimonialMeta}>
        <span style={{ background: testimonial.color }} />
        <strong>{testimonial.user}</strong>
        <em>{testimonial.likes}</em>
      </div>
    </article>
  )
}

function PlanCards() {
  return (
    <section id="planos" className={styles.planSection}>
      <div className={styles.centeredHeader}>
        <SectionEyebrow>04 — Escolha seu plano</SectionEyebrow>
        <h2>Entre pro clube. O próximo caso já está te esperando.</h2>
      </div>
      <div className={styles.planGrid}>
        <article className={styles.monthlyPlan}>
          <div className={styles.planTab}>MENSAL</div>
          <div className={styles.planLabel}>Plano Mensal</div>
          <div className={styles.priceLine}>
            <strong>R$ 149,90</strong>
            <span>/mês</span>
          </div>
          <p>Flexível. Cancele quando quiser.</p>
          <div className={styles.planDivider} />
          <FeatureList
            color="#1AA587"
            items={[
              '1 caixa por mês, avançando o caso do ano',
              'Acesso à comunidade de membros',
              'Itens e dossiês exclusivos',
              'Sem fidelidade',
            ]}
          />
          <Link href="/assinatura" className={styles.planOutlineButton}>
            Assinar mensal
          </Link>
        </article>

        <article className={styles.annualPlanWrap}>
          <div className={styles.annualBack} />
          <div className={styles.annualBadge}>★ MAIS VANTAJOSO</div>
          <div className={styles.annualPlan}>
            <div className={styles.planTabAnnual}>ANUAL</div>
            <div className={styles.annualLabel}>Plano Anual</div>
            <div className={styles.priceLine}>
              <strong>R$ 129,90</strong>
              <span>/mês</span>
            </div>
            <p>Cobrado anualmente · economize R$ 240 no ano.</p>
            <div className={styles.annualDivider} />
            <FeatureList
              color="#F4CF5A"
              items={[
                'Tudo do plano mensal',
                '2 meses grátis no ano',
                'Brinde de boas-vindas exclusivo',
                'Acesso antecipado às edições especiais',
              ]}
            />
            <Link href="/assinatura" className={styles.annualButton}>
              Assinar anual <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

function FeatureList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className={styles.featureList}>
      {items.map((item) => (
        <li key={item}>
          <span style={{ color }}>✓</span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function StandaloneEdition() {
  return (
    <section id="avulsas" className={styles.section}>
      <div className={styles.editionHeader}>
        <div>
          <SectionEyebrow>05 — Edições especiais · avulsas</SectionEyebrow>
          <h2>Casos curtos que fecham numa única caixa.</h2>
          <p>
            Lançamos uma edição especial por vez — um tema à parte do caso
            principal, que você compra avulsa, sem assinar. As anteriores ficam
            nos arquivos.
          </p>
        </div>
      </div>

      <article className={styles.editionCard}>
        <div className={styles.editionImageWrap}>
          <Image
            src={standaloneEdition}
            alt="Caixa avulsa — Edição Copa do Mundo: O Hexa Nunca Visto"
            fill
            sizes="(max-width: 860px) 100vw, 620px"
            className={styles.coverImage}
          />
          <div className={styles.editionStamp}>
            <span>EM CARTAZ</span>
            <span>EDIÇÃO LIMITADA</span>
          </div>
          <div className={styles.editionFile}>
            <span>FILE Nº</span>
            <i>2026-COPA</i>
          </div>
        </div>
        <div className={styles.editionCopy}>
          <div>Edição especial em cartaz</div>
          <h3>Edição Copa do Mundo</h3>
          <p>
            Um mistério nos bastidores do maior evento do futebol — itens
            temáticos e um caso completo que você resolve numa única caixa.
            Edição limitada, sem assinatura.
          </p>
          <div className={styles.editionPurchase}>
            <strong>R$ 169,90</strong>
            {/* TODO: trocar pelo slug real da edição Copa do Mundo quando o produto existir na loja. */}
            <a href="#">
              Comprar agora <span className={styles.arrow}>→</span>
            </a>
          </div>
        </div>
      </article>
      <div className={styles.archiveHint}>
        <span />
        <a href="#arquivos">
          ver edições anteriores nos arquivos{' '}
          <span className={styles.arrow}>→</span>
        </a>
      </div>
    </section>
  )
}

function ArchiveBand() {
  return (
    <section id="arquivos" className={styles.archiveBand}>
      <div className={styles.archiveInner}>
        <div className={styles.archiveHeader}>
          <SectionEyebrow variant="yellow">
            06 — Arquivos do clube
          </SectionEyebrow>
          <h2>Caixas que já passaram — leve avulsas quando quiser.</h2>
        </div>
        <div className={styles.archiveGrid}>
          {archiveBoxes.map((box, index) => (
            <ArchiveCard key={box.box} box={box} index={index} />
          ))}
        </div>
        <div className={styles.archiveButtonWrap}>
          <Link href="/loja" className={styles.archiveButton}>
            Acessar todos os arquivos <span className={styles.arrow}>→</span>
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
  const reveal = useReveal(index * 80)
  return (
    <article className={styles.archiveCardWrap} {...reveal}>
      <div className={styles.archiveCardBack} />
      <div className={styles.archiveTab}>
        <span>{box.box}</span>Caso Victória Monteiro
      </div>
      <div className={styles.archiveCard}>
        <div className={styles.archiveStamp} aria-hidden="true">
          ARQUIVADO
        </div>
        <div className={styles.archiveImage}>
          <Image
            src={box.image}
            alt={box.alt}
            fill
            sizes="(max-width: 540px) 100vw, (max-width: 860px) 50vw, 25vw"
            style={{ objectPosition: box.objectPosition }}
            className={styles.coverImage}
          />
        </div>
        <div className={styles.archiveCardBody}>
          <div>{box.box}</div>
          <h3>{box.title}</h3>
          <div className={styles.archiveCardFooter}>
            <strong>{box.price}</strong>
            <Link href={box.href}>Comprar</Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function FinalCta() {
  return (
    <section id="cta-final" className={styles.finalCta}>
      <div className={styles.finalStamp} aria-hidden="true">
        <span>ABERTO PRA</span>
        <span>INVESTIGAÇÃO</span>
      </div>
      <SectionEyebrow>A caixa deste mês fecha dia 28</SectionEyebrow>
      <h2>Pronto pra descobrir do que as pessoas são capazes?</h2>
      <Link href="/assinatura" className={styles.primaryButton}>
        Entrar no clube <span className={styles.arrow}>→</span>
      </Link>
      <p className={styles.finalDeadline}>PRAZO FINAL · 28/JUN · 23H59</p>
    </section>
  )
}

function SuggestedFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerLogoWrap}>
              <Image
                src={logo}
                alt="TrueCrime.Club"
                className={styles.footerLogo}
              />
            </div>
            <p>
              O clube de assinatura true crime pra quem é fascinado pelo
              comportamento humano. Um novo caso, todo mês.
            </p>
            <div className={styles.footerStamp} aria-hidden="true">
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
        <div className={styles.footerDivider} />
        <div className={styles.footerBottom}>
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
      <h3>{title}</h3>
      <div className={styles.footerLinks}>
        {links.map((link) =>
          link.href.startsWith('/') ? (
            <Link key={`${link.href}-${link.label}`} href={link.href}>
              {link.label}
            </Link>
          ) : (
            <a key={`${link.href}-${link.label}`} href={link.href}>
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
    <div className={`${styles.fab} ${isVisible ? '' : styles.fabHidden}`}>
      <Link href="/assinatura">
        <BoxIcon />
        Entrar no clube
        <span className={styles.arrow}>→</span>
      </Link>
    </div>
  )
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
      data-reveal={shown ? 'shown' : 'pending'}
      className={className}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
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
    'data-reveal': shown ? 'shown' : 'pending',
    style: { '--reveal-delay': `${delayMs}ms` } as CSSProperties,
  }
}

function SectionEyebrow({
  children,
  variant = 'red',
}: {
  children: ReactNode
  variant?: 'red' | 'yellow'
}) {
  return (
    <div
      className={`${styles.eyebrow} ${
        variant === 'yellow' ? styles.eyebrowYellow : ''
      }`}
    >
      {children}
    </div>
  )
}

function UserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.1-5.5 7-5.5s7 2 7 5.5" />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2.2"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function GiftIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={color}>
      <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2Zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1ZM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1Zm3 15H4v-2h8v2Zm0-5H4v-2h8v2Zm8 5h-6v-2h6v2Zm0-5h-6v-2h6v2Z" />
    </svg>
  )
}

function DocumentIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={color}>
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6Zm2 16H8v-2h8v2Zm0-4H8v-2h8v2Zm-3-5V3.5L18.5 9H13Z" />
    </svg>
  )
}

function LayersIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={color}>
      <path d="m11.99 18.54-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74ZM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16Z" />
    </svg>
  )
}

function CommunityIcon({ color }: { color: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={color}>
      <path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91ZM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29ZM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57ZM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3Z" />
    </svg>
  )
}

function QuoteIcon({ color }: { color: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill={color}
      className={styles.quoteIcon}
      aria-hidden="true"
    >
      <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5a1.67 1.67 0 0 1 1.67-1.67V6Zm9.66 0A5.17 5.17 0 0 0 11.66 11.17V18h6.84v-6.83h-3.34a1.67 1.67 0 0 1 1.67-1.67V6Z" />
    </svg>
  )
}
