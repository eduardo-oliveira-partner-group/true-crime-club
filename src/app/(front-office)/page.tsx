import {
  IconArrowRight,
  IconBook,
  IconBoxSeam,
  IconClipboardText,
  IconFingerprint,
  IconHome,
  IconNotebook,
  IconShirt,
  IconSparkles,
  IconUsers,
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import boxContentsBg from '@/src/assets/images/home/box-contents-bg.png'
import clubOverviewBg from '@/src/assets/images/home/club-overview-bg.png'
import finalCtaDossierPlate from '@/src/assets/images/home/final-cta-dossier-plate.png'
import investigationContinuousBg from '@/src/assets/images/home/investigation-continuous-bg.png'
import plansDossierPlate from '@/src/assets/images/home/plans-dossier-plate.png'
import previousBoxesBanner from '@/src/assets/images/home/previous-boxes-banner.png'
import { CorkboardTimeline } from '@/src/components/home/corkboard-timeline'
import { EvidenceInventoryGrid } from '@/src/components/home/evidence-inventory-grid'
import { HeroCaseReveal } from '@/src/components/home/hero-case-reveal'
import { PlanDossierCard } from '@/src/components/home/plan-dossier-card'
import { PreviousBoxesShowcase } from '@/src/components/home/previous-boxes-showcase'
import { Button } from '@/src/components/ui/button'
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import { TextGenerateEffect } from '@/src/components/ui/text-generate-effect'
import {
  getActiveCase,
  getDynamicContent,
  getSeoEntry,
  getSubscriberProgress,
  listPlans,
  listProducts,
} from '@/src/lib/domain/repositories'
import { formatDate } from '@/src/lib/formatters'
import { buildMetadata } from '@/src/lib/seo'
import { cn } from '@/src/lib/utils'

export const metadata = buildMetadata({
  path: '/',
  entry: getSeoEntry('/'),
})

const clubHighlights = [
  {
    icon: IconBoxSeam,
    title: 'Box temática mensal',
    description:
      'Todo mês, sua caixa chega como um presente exclusivo — surpresas pensadas por quem vive true crime e cuida de cada detalhe.',
    tabLabel: 'Entrega mensal',
    caseRef: 'CLUB-01',
    highlightLabel: 'Experiência',
  },
  {
    icon: IconFingerprint,
    title: 'Pistas colecionáveis',
    description:
      'A cada edição, uma nova pista do caso fictício do ano: dicas, evidências e documentos que se acumulam até a revelação final.',
    tabLabel: 'Narrativa coletiva',
    caseRef: 'CLUB-02',
    highlightLabel: 'Investigação',
  },
  {
    icon: IconClipboardText,
    title: 'Conteúdos exclusivos',
    description:
      'Trechos de livros raros, vídeos especiais e materiais digitais reservados a quem está dentro do clube.',
    tabLabel: 'Conteúdo reservado',
    caseRef: 'CLUB-03',
    highlightLabel: 'Exclusividade',
  },
  {
    icon: IconSparkles,
    title: 'Edições limitadas',
    description:
      'Boxes avulsas, extras e lançamentos especiais para completar a coleção ou presentear quem também ama mistério.',
    tabLabel: 'Coleção especial',
    caseRef: 'CLUB-04',
    highlightLabel: 'Coleção',
  },
]

const boxCategories = [
  {
    icon: IconSparkles,
    title: 'Itens colecionáveis',
    description:
      'Peças exclusivas inspiradas nas séries, filmes e casos que você mais ama — objetos de tirar o fôlego.',
  },
  {
    icon: IconNotebook,
    title: 'Papelaria premium',
    description:
      'Blocos estilosos, cadernos de alta qualidade e planners temáticos para suas anotações investigativas.',
  },
  {
    icon: IconHome,
    title: 'Decoração e utilidades',
    description:
      'Pôsteres impactantes, quadros colecionáveis e itens de cozinha e organização com aquele toque misterioso.',
  },
  {
    icon: IconShirt,
    title: 'Moda true crime',
    description:
      'Camisetas, blusas confortáveis, chinelos e acessórios para exibir sua paixão pelo gênero.',
  },
  {
    icon: IconBook,
    title: 'Conteúdo exclusivo',
    description:
      'Trechos de livros raros, vídeos especiais e materiais digitais que só assinantes recebem.',
  },
]

const howItWorks = [
  {
    title: 'Assine',
    description:
      'Escolha o plano mensal ou anual e confirme seus dados de entrega.',
  },
  {
    title: 'Receba em casa',
    description:
      'A cobrança acontece no mês da compra e o envio da box é preparado para o ciclo seguinte.',
  },
  {
    title: 'Investigue',
    description:
      'Abra a caixa, acompanhe os conteúdos exclusivos e registre suas teorias até a revelação final.',
  },
]

function YellowAlertMarquee() {
  const items = [
    'O CASO VICTÓRIA MONTEIRO — CAIXA 03 DE 12',
    'ASSINE ATÉ DIA 28 PRA ENTRAR NESTE CASO',
    'MAIS DE 1000 INVESTIGADORES NO CLUBE',
  ]
  const repeatedItems = [...items, ...items, ...items]

  return (
    <div className="w-full overflow-hidden border-b border-[#211C18]/15 bg-[#BF3A2B] py-[9px] whitespace-nowrap text-[#FBF9F6]">
      <div className="animate-marquee inline-flex [--marquee-duration:80s]">
        {/* Copy 1 */}
        <div className="flex shrink-0 items-center font-mono text-[13px] tracking-[0.06em] uppercase">
          {repeatedItems.map((item, idx) => (
            <span key={`c1-${idx}`} className="flex items-center">
              <span className="pr-[42px]">{item}</span>
              <span className="pr-[42px]">●</span>
            </span>
          ))}
        </div>
        {/* Copy 2 */}
        <div
          className="flex shrink-0 items-center font-mono text-[13px] tracking-[0.06em] uppercase"
          aria-hidden="true"
        >
          {repeatedItems.map((item, idx) => (
            <span key={`c2-${idx}`} className="flex items-center">
              <span className="pr-[42px]">{item}</span>
              <span className="pr-[42px]">●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function DarkDividerMarquee() {
  const items = [
    { text: 'PISTAS REAIS', starColor: '#EFBC18' },
    { text: 'ITENS COLECIONÁVEIS', starColor: '#C5271F' },
    { text: '12 CAIXAS, UMA VERDADE', starColor: '#1AA587' },
    { text: 'COMUNIDADE QUE TEORIZA', starColor: '#5E5EA2' },
  ]
  const repeatedItems = [...items, ...items, ...items]

  return (
    <div className="mt-0 w-full overflow-hidden border-y border-[#211C18]/15 bg-[#211C18] py-[14px] whitespace-nowrap text-[#EDE4DD]">
      <div className="animate-marquee inline-flex [--marquee-duration:120s]">
        {/* Copy 1 */}
        <div className="flex shrink-0 items-center font-heading text-lg font-bold tracking-[0.01em] uppercase sm:text-[22px]">
          {repeatedItems.map((item, idx) => (
            <span key={`d1-${idx}`} className="flex items-center">
              <span className="px-[28px]">{item.text}</span>
              <span className="px-[28px]" style={{ color: item.starColor }}>
                ✶
              </span>
            </span>
          ))}
        </div>
        {/* Copy 2 */}
        <div
          className="flex shrink-0 items-center font-heading text-lg font-bold tracking-[0.01em] uppercase sm:text-[22px]"
          aria-hidden="true"
        >
          {repeatedItems.map((item, idx) => (
            <span key={`d2-${idx}`} className="flex items-center">
              <span className="px-[28px]">{item.text}</span>
              <span className="px-[28px]" style={{ color: item.starColor }}>
                ✶
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const heroTitle = getDynamicContent('home.hero.title')
  const heroBadge = getDynamicContent('home.hero.badge')
  const heroSubtitle = getDynamicContent('home.hero.subtitle')
  const heroCta = getDynamicContent('home.hero.cta')
  const finalCtaSubtitle = getDynamicContent('home.final_cta.subtitle')
  // const trustSupport = getDynamicContent('home.trust.support')
  const featuredProducts = listProducts({ featured: true })
  const boxProducts = listProducts().filter((product) => product.type === 'box')
  const plans = listPlans()
  const activeCase = getActiveCase()
  const progress = activeCase ? getSubscriberProgress(activeCase.id) : null
  const featuredBox = featuredProducts.find((product) => product.type === 'box')
  const liveEventDate = progress?.liveEventDate ?? activeCase?.liveEventDate
  const liveEventTitle =
    progress?.liveEventTitle ?? activeCase?.liveEventTitle ?? 'Grande Revelação'

  return (
    <div className="bg-[#090807] text-[#fffaf0]">
      <YellowAlertMarquee />
      <HeroCaseReveal
        badge={heroBadge?.value ?? 'Primeiro Clube de True Crime do Brasil'}
        title={heroTitle?.value ?? 'Investigue. Colete. Desvende.'}
        subtitle={
          heroSubtitle?.value ??
          'Eleve seu nível de conteúdo com uma caixa temática mensal, recheada de surpresas exclusivas — da abertura ao design impecável de cada item colecionável.'
        }
        ctaLabel={heroCta?.value ?? 'Garantir minha vaga'}
        activeCaseTitle={activeCase?.title ?? 'Operação Meia-Noite'}
        cycleLabel={
          featuredBox?.cycleNumber
            ? `Box #${featuredBox.cycleNumber}`
            : 'Nova box mensal'
        }
      />

      <DarkDividerMarquee />

      <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#0b0908]">
        <Image
          src={clubOverviewBg}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center brightness-[0.52] saturate-[0.85]"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(216,65,50,0.16),transparent_28%),radial-gradient(circle_at_80%_12%,rgba(215,181,109,0.1),transparent_30%),linear-gradient(180deg,rgba(11,9,8,0.82)_0%,rgba(11,9,8,0.58)_42%,rgba(11,9,8,0.86)_100%),linear-gradient(135deg,rgba(11,9,8,0.72)_0%,rgba(19,13,11,0.55)_46%,rgba(9,8,7,0.78)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
            {/* Left Column - Intro & Curadoria Box (Sticky on Desktop) */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
              <div className="space-y-4">
                <ScrollReveal>
                  <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
                    O que é o Club?
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.08}>
                  <h2 className="font-heading text-3xl leading-[1.15] font-black tracking-wide text-[#fffaf0] uppercase sm:text-4xl">
                    Muito além de uma caixa.
                    <br />
                    <span className="text-[#d7b56d]">
                      Uma imersão mensal
                      <br />
                      em true crime.
                    </span>
                  </h2>
                </ScrollReveal>
                <TextGenerateEffect
                  words="Unimos qualidade e conteúdo para quem busca profundidade e exclusividade no universo true crime. Cada entrega é uma experiência completa — da abertura da caixa ao design impecável de cada item colecionável."
                  textClassName="text-base leading-7 text-[#d7c9b5]"
                  staggerDelay={0.05}
                />
              </div>

              <ScrollReveal delay={0.12}>
                <div className="group relative flex items-start gap-4 overflow-hidden border border-[#fffaf0]/12 bg-[#171211]/72 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:p-6">
                  {/* Decorative forensic stamp overlay */}
                  <div className="pointer-events-none absolute top-4 right-4 rotate-[-8deg] border border-dashed border-[#d84132]/25 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-[#d84132]/35 uppercase transition-colors duration-300 select-none group-hover:border-[#d84132]/45 group-hover:text-[#d84132]/60">
                    CURADORIA HOMOLOGADA
                  </div>

                  <div className="flex size-10 shrink-0 items-center justify-center border border-[#d84132]/30 bg-[#d84132]/20 text-[#ffb0a5]">
                    <IconUsers className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
                      Curadoria com paixão
                    </p>
                    <p className="mt-2 text-sm/6 text-[#d7c9b5]">
                      Todo mês, sua caixa chega cheia de surpresas pensadas por
                      designers que vivem true crime e colocam o coração em cada
                      detalhe — do conceito ao acabamento final.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="max-w-xs pt-2">
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 w-full justify-between border-[#fffaf0]/18 bg-[#fffaf0]/6 px-5 text-[#fffaf0] hover:bg-[#fffaf0]/12 hover:text-[#fffaf0]"
                  >
                    <Link href="/assinatura">
                      Conhecer planos
                      <IconArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column - Timeline / Vertical Folders Archive */}
            <div className="relative space-y-6 pl-0 sm:pl-8 lg:col-span-7">
              {/* Connector vertical line on desktop/tablet */}
              <div
                className="pointer-events-none absolute inset-y-8 left-[31px] z-0 hidden w-[2px] bg-linear-to-b from-[#d84132]/50 via-[#d7b56d]/30 to-transparent sm:block"
                aria-hidden="true"
              />

              <ScrollRevealGroup className="space-y-5" staggerChildren={0.08}>
                {clubHighlights.map((feature, index) => {
                  const HighlightIcon = feature.icon
                  const isGold = index === clubHighlights.length - 1

                  return (
                    <ScrollRevealItem key={feature.title}>
                      <div className="group relative z-10 flex gap-4">
                        {/* Bullet number tab on the line */}
                        <div
                          className={cn(
                            'relative hidden size-16 shrink-0 items-center justify-center border font-heading text-lg font-black tracking-tight transition-all duration-300 sm:flex',
                            isGold
                              ? 'border-[#d7b56d]/30 bg-[#171211] text-[#d7b56d] group-hover:border-[#d7b56d] group-hover:bg-[#d7b56d]/10'
                              : 'border-[#fffaf0]/12 bg-[#171211] text-[#d7c9b5]/85 group-hover:border-[#d84132] group-hover:bg-[#d84132]/5 group-hover:text-[#ffb0a5]',
                          )}
                        >
                          0{index + 1}
                        </div>

                        {/* Folder Tab Card */}
                        <div
                          className={cn(
                            'flex-1 border bg-[#0c0a09]/80 p-5 shadow-[0_12px_28px_rgba(0,0,0,0.38)] backdrop-blur-sm transition-all duration-300 hover:translate-x-2',
                            isGold
                              ? 'border-[#d7b56d]/30 hover:border-[#d7b56d]/70 hover:bg-[#1a1412]'
                              : 'border-[#fffaf0]/8 hover:border-[#d84132]/40 hover:bg-[#171211]/90',
                          )}
                        >
                          <div className="mb-3.5 flex items-center justify-between gap-3 border-b border-[#fffaf0]/8 pb-2.5">
                            <span
                              className={cn(
                                'font-mono text-[10px] font-semibold tracking-wider uppercase',
                                isGold ? 'text-[#d7b56d]' : 'text-[#d7c9b5]/80',
                              )}
                            >
                              {feature.tabLabel}
                            </span>
                            <span className="font-mono text-[9px] text-[#fffaf0]/30 select-none">
                              {feature.caseRef}
                            </span>
                          </div>

                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                'flex size-9 shrink-0 items-center justify-center border transition-colors duration-300',
                                isGold
                                  ? 'border-[#d7b56d]/25 bg-[#d7b56d]/10 text-[#d7b56d] group-hover:bg-[#d7b56d]/20 group-hover:text-white'
                                  : 'border-[#d84132]/18 bg-[#d84132]/10 text-[#ffb0a5] group-hover:bg-[#d84132]/20 group-hover:text-white',
                              )}
                            >
                              <HighlightIcon className="size-4.5" />
                            </div>
                            <div>
                              <h3 className="font-heading text-base font-bold text-[#fffaf0] transition-colors duration-300 group-hover:text-[#d7b56d]">
                                {feature.title}
                              </h3>
                              <p className="mt-2 text-sm/6 text-[#d7c9b5]/90">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollRevealItem>
                  )
                })}
              </ScrollRevealGroup>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#090807]">
        <Image
          src={boxContentsBg}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center brightness-[0.38] saturate-[0.75]"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_42%,rgba(9,8,7,0.55)_0%,rgba(9,8,7,0.92)_68%),linear-gradient(180deg,rgba(9,8,7,0.88)_0%,rgba(9,8,7,0.72)_38%,rgba(9,8,7,0.94)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.028)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.028)_1px,transparent_1px)] bg-size-[56px_56px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto mb-10 max-w-3xl space-y-4 text-center">
            <ScrollReveal>
              <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
                O que vem na caixa
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                O que você vai encontrar dentro da sua box?
              </h2>
            </ScrollReveal>
            <TextGenerateEffect
              words="Cada edição traz uma curadoria surpresa com itens das categorias abaixo — selecionados e combinados para manter exclusividade e fator surpresa a cada entrega."
              textClassName="mx-auto max-w-2xl text-sm leading-6 text-[#d7c9b5]"
              staggerDelay={0.04}
            />
          </div>

          <EvidenceInventoryGrid categories={boxCategories} />

          <ScrollReveal delay={0.15}>
            <div className="mx-auto mt-8 max-w-3xl border border-[#d7b56d]/25 bg-[#171211]/88 p-5 backdrop-blur-sm sm:p-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
                Nota do arquivo
              </p>
              <p className="mt-3 text-sm/6 text-[#d7c9b5]">
                Para garantir exclusividade e fator surpresa, cada edição conta
                com uma{' '}
                <strong className="font-medium text-[#e5d8c4]">
                  seleção de alguns itens
                </strong>{' '}
                das categorias acima, variando a cada mês. Você não receberá
                todos os tipos de itens em uma única entrega — e sim uma
                curadoria especial e inédita a cada ciclo.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-[#fffaf0]/10 bg-[#050403]">
        <Image
          src={investigationContinuousBg}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,4,3,0.72)_0%,rgba(5,4,3,0.55)_45%,rgba(5,4,3,0.82)_100%),linear-gradient(90deg,rgba(5,4,3,0.88)_0%,rgba(5,4,3,0.35)_42%,rgba(5,4,3,0.2)_100%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="flex flex-col items-center space-y-6">
              <ScrollReveal>
                <div className="flex items-center justify-center gap-4">
                  <span className="h-px w-8 bg-[#d7b56d]/55" />
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d7b56d] uppercase">
                    Investigação contínua
                  </p>
                  <span className="h-px w-8 bg-[#d7b56d]/55" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <h2 className="mx-auto max-w-2xl font-heading text-3xl/tight font-black text-[#f0e8dd] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                  Uma pista por mês.
                  <br />
                  Um caso inteiro para desvendar.
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.12}>
                <p className="mx-auto max-w-2xl text-base/7 text-[#c8bdad] sm:text-lg/8">
                  Receba dicas, evidências, documentos e revelações que se
                  acumulam ao longo do ano — até desvendar o crime juntos, em
                  tempo real, com toda a comunidade do clube.
                </p>
              </ScrollReveal>

              {liveEventDate ? (
                <ScrollReveal delay={0.16}>
                  <div className="mx-auto max-w-md border border-[#b98542]/40 bg-[#070604]/75 p-5 backdrop-blur-sm">
                    <p className="text-xs font-semibold tracking-[0.22em] text-[#d7b56d] uppercase">
                      Evento ao vivo
                    </p>
                    <p className="mt-2 font-heading text-lg font-semibold text-[#f0e8dd]">
                      {liveEventTitle}
                    </p>
                    <p className="mt-1 text-sm/6 text-[#c8bdad]">
                      {formatDate(liveEventDate)} — revelação final com a
                      comunidade
                    </p>
                  </div>
                </ScrollReveal>
              ) : null}
            </div>

            <ScrollReveal delay={0.2}>
              <Button
                asChild
                size="lg"
                className="bg-[#d84132] px-8 py-6 text-base text-white shadow-[0_0_26px_rgba(216,65,50,0.35)] hover:bg-[#b93227]"
              >
                <Link href="/assinatura">
                  Garantir minha vaga no clube
                  <IconArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#171211]">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[56px_56px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <ScrollReveal>
              <div className="flex items-center gap-4">
                <p className="text-xs font-semibold tracking-[0.22em] text-[#d7b56d] uppercase">
                  Como funciona?
                </p>
                <span className="hidden h-px flex-1 bg-[#d7b56d]/45 sm:block" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-[#fffaf0] sm:text-4xl">
                Da assinatura ao dossiê final em três passos.
              </h2>
            </ScrollReveal>
          </div>

          <CorkboardTimeline steps={howItWorks} />
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#0b0908]">
        <Image
          src={plansDossierPlate}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center brightness-[0.42] saturate-[0.78]"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_18%,rgba(216,65,50,0.14),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(215,181,109,0.12),transparent_28%),linear-gradient(180deg,rgba(11,9,8,0.88)_0%,rgba(11,9,8,0.62)_42%,rgba(11,9,8,0.9)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.032)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.032)_1px,transparent_1px)] bg-size-[56px_56px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="mb-10 max-w-2xl space-y-4">
            <ScrollReveal>
              <div className="flex items-center gap-4">
                <p className="text-xs font-semibold tracking-[0.22em] text-[#d7b56d] uppercase">
                  Escolha seu plano
                </p>
                <span className="hidden h-px flex-1 bg-[#d7b56d]/45 sm:block" />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-[#fffaf0] sm:text-4xl">
                Entre no caso pelo ritmo que combina com você.
              </h2>
            </ScrollReveal>
            <TextGenerateEffect
              words="Cada opção abre um dossiê diferente: acompanhamento mensal, arquivo completo anual ou uma edição avulsa para experimentar sem compromisso."
              textClassName="max-w-2xl text-sm leading-6 text-[#d7c9b5]"
              staggerDelay={0.04}
            />
          </div>

          <ScrollRevealGroup
            className="grid items-stretch gap-5 lg:grid-cols-3 lg:gap-6"
            staggerChildren={0.12}
          >
            {plans.map((plan) => (
              <ScrollRevealItem key={plan.id} className="h-full">
                <PlanDossierCard plan={plan} />
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#171211] text-[#fffaf0]">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[56px_56px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <ScrollReveal>
            <div className="relative isolate mb-8 min-h-[360px] overflow-hidden border border-[#fffaf0]/14 bg-[#090807] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.3)] sm:p-8 lg:min-h-[420px]">
              <Image
                src={previousBoxesBanner}
                alt=""
                fill
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, 1152px"
                className="absolute inset-0 -z-20 object-cover object-[68%_center]"
              />
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,8,7,0.96)_0%,rgba(9,8,7,0.86)_38%,rgba(9,8,7,0.38)_68%,rgba(9,8,7,0.18)_100%)]" />
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.04)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.04)_1px,transparent_1px)] bg-size-[42px_42px,42px_42px]" />

              <div className="flex min-h-[300px] max-w-xl flex-col justify-center space-y-4 lg:min-h-[356px]">
                <p className="text-xs font-semibold tracking-[0.22em] text-[#d7b56d] uppercase">
                  Loja e edições avulsas
                </p>
                <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl">
                  Perdeu uma edição? <br />O arquivo ainda pode estar aberto.
                </h2>
                <TextGenerateEffect
                  words="Boxes anteriores e produtos extras continuam disponíveis enquanto houver estoque. Assinantes veem preços especiais em itens selecionados."
                  textClassName="max-w-md text-sm leading-6 text-[#d7c9b5]"
                  staggerDelay={0.04}
                />
                <Button
                  asChild
                  variant="outline"
                  className="w-fit border-[#fffaf0]/25 bg-transparent text-[#fffaf0] hover:bg-[#fffaf0]/12 hover:text-[#fffaf0]"
                >
                  <Link href="/loja">
                    Ver loja completa
                    <IconArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <PreviousBoxesShowcase products={boxProducts} />
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#d84132] text-white">
        <Image
          src={finalCtaDossierPlate}
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover object-center brightness-[0.42] saturate-[0.9]"
        />
        <div className="absolute inset-0 -z-20 bg-[rgba(216,65,50,0.42)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_45%,rgba(255,244,220,0.24),transparent_28%),linear-gradient(90deg,rgba(23,18,17,0.38),transparent_58%,rgba(23,18,17,0.2))]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.2em] text-white/78 uppercase">
                Pronto para abrir o arquivo?
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold text-balance sm:text-4xl">
                Garanta sua vaga antes que a próxima edição esgote.
              </h2>
              <TextGenerateEffect
                words={
                  finalCtaSubtitle?.value ??
                  'Garanta sua vaga no clube antes que a próxima edição esgote. A próxima pista já está sendo preparada.'
                }
                textClassName="mt-3 max-w-xl text-sm leading-6 text-white/82"
                staggerDelay={0.06}
                filter={false}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <Button
              asChild
              size="lg"
              className="w-fit bg-white text-[#171211] shadow-[0_18px_44px_rgba(23,18,17,0.28)] hover:bg-[#fff1dd]"
            >
              <Link href="/assinatura">
                Garantir minha vaga
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
