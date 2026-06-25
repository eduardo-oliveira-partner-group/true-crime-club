import {
  IconArrowRight,
  IconBook,
  IconBoxSeam,
  IconCalendarEvent,
  IconChecklist,
  IconClipboardText,
  IconCreditCard,
  IconFingerprint,
  IconHome,
  IconNotebook,
  IconPackage,
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
import { FeatureDossierCard } from '@/src/components/home/feature-dossier-card'
import { HeroCaseReveal } from '@/src/components/home/hero-case-reveal'
import { HowItWorksStepCard } from '@/src/components/home/how-it-works-step-card'
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
  getSubscriberProgress,
  listPlans,
  listProducts,
} from '@/src/lib/domain/repositories'
import { formatDate } from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

const clubHighlights = [
  {
    icon: IconBoxSeam,
    title: 'Box temática mensal',
    description:
      'Todo mês, sua caixa chega como um presente exclusivo — surpresas pensadas por quem vive true crime e cuida de cada detalhe.',
  },
  {
    icon: IconFingerprint,
    title: 'Pistas colecionáveis',
    description:
      'A cada edição, uma nova pista do caso fictício do ano: dicas, evidências e documentos que se acumulam até a revelação final.',
  },
  {
    icon: IconClipboardText,
    title: 'Conteúdos exclusivos',
    description:
      'Trechos de livros raros, vídeos especiais e materiais digitais reservados a quem está dentro do clube.',
  },
  {
    icon: IconSparkles,
    title: 'Edições limitadas',
    description:
      'Boxes avulsas, extras e lançamentos especiais para completar a coleção ou presentear quem também ama mistério.',
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
    icon: IconCreditCard,
    title: 'Assine',
    description:
      'Escolha o plano mensal ou anual e confirme seus dados de entrega.',
  },
  {
    icon: IconPackage,
    title: 'Receba em casa',
    description:
      'A cobrança acontece no mês da compra e o envio da box é preparado para o ciclo seguinte.',
  },
  {
    icon: IconChecklist,
    title: 'Investigue',
    description:
      'Abra a caixa, acompanhe os conteúdos exclusivos e registre suas teorias até a revelação final.',
  },
]

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

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-4xl space-y-4 text-center">
            <ScrollReveal>
              <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
                O que é o Club?
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="mx-auto max-w-2xl font-heading text-3xl leading-[1.15] font-black tracking-wide text-[#fffaf0] uppercase sm:text-4xl">
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
              textClassName="mx-auto max-w-3xl text-base leading-7 text-[#d7c9b5]"
              staggerDelay={0.05}
            />
            <ScrollReveal delay={0.12}>
              <div className="mx-auto flex max-w-2xl items-start gap-4 border border-[#fffaf0]/12 bg-[#171211]/72 p-5 text-left backdrop-blur-sm sm:p-6">
                <div className="flex size-10 shrink-0 items-center justify-center bg-[#d84132]/20 text-[#ffb0a5]">
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
          </div>

          <div className="space-y-6">
            <ScrollRevealGroup
              className="grid items-stretch gap-5 sm:grid-cols-2"
              staggerChildren={0.08}
            >
              {clubHighlights.map((feature, index) => (
                <ScrollRevealItem key={feature.title} className="h-full">
                  <FeatureDossierCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    index={index}
                    variant="club"
                    total={clubHighlights.length}
                  />
                </ScrollRevealItem>
              ))}
            </ScrollRevealGroup>

            <ScrollReveal delay={0.15}>
              <div className="mx-auto max-w-md">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 w-full justify-between border-[#fffaf0]/18 bg-[#fffaf0]/6 px-5 text-[#fffaf0] hover:bg-[#fffaf0]/12 hover:text-[#fffaf0]"
                >
                  <Link href="/assinatura">
                    Conhecer planos
                    <IconArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
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

          <ScrollRevealGroup
            className="grid items-stretch gap-5 sm:grid-cols-6"
            staggerChildren={0.07}
          >
            {boxCategories.map((category, index) => (
              <ScrollRevealItem
                key={category.title}
                className={cn(
                  'h-full',
                  index < 2 ? 'sm:col-span-3' : 'sm:col-span-2',
                )}
              >
                <FeatureDossierCard
                  icon={category.icon}
                  title={category.title}
                  description={category.description}
                  index={index}
                  variant="box"
                  total={boxCategories.length}
                />
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>

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

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-16">
            <div className="space-y-6 lg:max-w-xl">
              <div className="flex items-center gap-4">
                <p className="text-xs font-semibold tracking-[0.3em] text-[#d7b56d] uppercase">
                  Investigação contínua
                </p>
                <span className="hidden h-px flex-1 bg-[#d7b56d]/55 sm:block" />
              </div>

              <h2 className="font-heading text-3xl/tight font-black text-[#f0e8dd] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08] xl:text-5xl">
                Uma pista por mês. Um caso inteiro para desvendar.
              </h2>

              <p className="max-w-lg text-base/7 text-[#c8bdad] sm:text-lg/8">
                Receba dicas, evidências, documentos e revelações que se
                acumulam ao longo do ano — até desvendar o crime juntos, em
                tempo real, com toda a comunidade do clube.
              </p>

              {liveEventDate ? (
                <div className="max-w-lg border border-[#b98542]/40 bg-[#070604]/75 p-4 backdrop-blur-sm sm:p-5">
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
              ) : null}
            </div>

            <div className="border border-[#b98542]/55 bg-[#070604]/82 p-6 text-[#f0e8dd] shadow-[0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-8 lg:mx-auto lg:w-full lg:max-w-md xl:max-w-lg">
              <div className="relative">
                <IconCalendarEvent className="absolute top-0 right-0 size-10 text-[#e24132] sm:size-11" />
                <div className="pr-14">
                  <p className="text-xs font-semibold tracking-[0.27em] text-[#d7b56d] uppercase sm:text-sm">
                    Progresso do caso
                  </p>
                  <h3 className="mt-4 font-heading text-3xl/tight font-black text-[#f0e8dd] sm:text-4xl">
                    {progress
                      ? `${progress.percentComplete}% investigado`
                      : 'Caso aberto'}
                  </h3>
                </div>

                <div className="mt-8 h-px bg-[#a78a5a]/35" />

                <div className="grid grid-cols-3 border-b border-[#a78a5a]/35 py-6 text-center sm:py-8">
                  <div className="border-r border-[#a78a5a]/35 px-2 sm:px-3">
                    <p className="font-heading text-3xl leading-none font-black sm:text-4xl">
                      {progress?.currentCycle ?? 1}
                    </p>
                    <p className="mt-2 text-sm text-[#c8bdad] sm:text-base">
                      ciclo
                    </p>
                  </div>
                  <div className="border-r border-[#a78a5a]/35 px-2 sm:px-3">
                    <p className="font-heading text-3xl leading-none font-black sm:text-4xl">
                      {progress?.collectedClues ?? 0}
                    </p>
                    <p className="mt-2 text-sm text-[#c8bdad] sm:text-base">
                      pistas
                    </p>
                  </div>
                  <div className="px-2 sm:px-3">
                    <p className="font-heading text-3xl leading-none font-black sm:text-4xl">
                      {activeCase?.totalClues ?? progress?.totalClues ?? 12}
                    </p>
                    <p className="mt-2 text-sm text-[#c8bdad] sm:text-base">
                      no ano
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="mt-6 w-full bg-[#d84132] text-white shadow-[0_0_26px_rgba(216,65,50,0.35)] hover:bg-[#b93227] sm:mt-8"
                >
                  <Link href="/assinatura">
                    Garantir minha vaga no clube
                    <IconArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
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

          <ScrollRevealGroup
            className="grid items-stretch gap-5 md:grid-cols-3 lg:gap-6"
            staggerChildren={0.12}
          >
            {howItWorks.map((step, index) => (
              <ScrollRevealItem key={step.title} className="h-full">
                <HowItWorksStepCard
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  stepIndex={index}
                />
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
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
