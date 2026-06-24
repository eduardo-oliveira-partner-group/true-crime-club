import Image from "next/image"
import Link from "next/link"
import {
  IconArrowRight,
  IconBook,
  IconBoxSeam,
  IconCalendarEvent,
  IconChecklist,
  IconCircleCheck,
  IconClipboardText,
  IconCreditCard,
  IconFingerprint,
  IconHome,
  IconNotebook,
  IconPackage,
  IconShieldCheck,
  IconShirt,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react"

import { Button } from "@/src/components/ui/button"
import { EncryptedText } from "@/src/components/ui/encrypted-text"
import { GlowingCard } from "@/src/components/ui/glowing-card"
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/src/components/ui/scroll-reveal"
import { TextGenerateEffect } from "@/src/components/ui/text-generate-effect"
import heroBanner from "@/src/assets/images/banner-hero-v2.png"
import investigationContinuousBg from "@/src/assets/images/investigation-continuous-bg.png"
import previousBoxesBanner from "@/src/assets/images/perdeu-as-caixas-anteriores-v2.png"
import {
  getActiveCase,
  getDynamicContent,
  getSubscriberProgress,
  listPlans,
  listProducts,
} from "@/src/lib/domain/repositories"
import { formatCurrency, formatDate } from "@/src/lib/formatters"
import { getProductImage } from "@/src/lib/product-images"

const clubHighlights = [
  {
    icon: IconBoxSeam,
    title: "Box temática mensal",
    description:
      "Todo mês, sua caixa chega como um presente exclusivo — surpresas pensadas por quem vive true crime e cuida de cada detalhe.",
  },
  {
    icon: IconFingerprint,
    title: "Pistas colecionáveis",
    description:
      "A cada edição, uma nova pista do caso fictício do ano: dicas, evidências e documentos que se acumulam até a revelação final.",
  },
  {
    icon: IconClipboardText,
    title: "Conteúdos exclusivos",
    description:
      "Trechos de livros raros, vídeos especiais e materiais digitais reservados a quem está dentro do clube.",
  },
  {
    icon: IconSparkles,
    title: "Edições limitadas",
    description:
      "Boxes avulsas, extras e lançamentos especiais para completar a coleção ou presentear quem também ama mistério.",
  },
]

const boxCategories = [
  {
    icon: IconSparkles,
    title: "Itens colecionáveis",
    description:
      "Peças exclusivas inspiradas nas séries, filmes e casos que você mais ama — objetos de tirar o fôlego.",
  },
  {
    icon: IconNotebook,
    title: "Papelaria premium",
    description:
      "Blocos estilosos, cadernos de alta qualidade e planners temáticos para suas anotações investigativas.",
  },
  {
    icon: IconHome,
    title: "Decoração e utilidades",
    description:
      "Pôsteres impactantes, quadros colecionáveis e itens de cozinha e organização com aquele toque misterioso.",
  },
  {
    icon: IconShirt,
    title: "Moda true crime",
    description:
      "Camisetas, blusas confortáveis, chinelos e acessórios para exibir sua paixão pelo gênero.",
  },
  {
    icon: IconBook,
    title: "Conteúdo exclusivo",
    description:
      "Trechos de livros raros, vídeos especiais e materiais digitais que só assinantes recebem.",
  },
]

const howItWorks = [
  {
    icon: IconCreditCard,
    title: "Assine",
    description: "Escolha o plano mensal ou anual e confirme seus dados de entrega.",
  },
  {
    icon: IconPackage,
    title: "Receba em casa",
    description:
      "A cobrança acontece no mês da compra e o envio da box é preparado para o ciclo seguinte.",
  },
  {
    icon: IconChecklist,
    title: "Investigue",
    description:
      "Abra a caixa, acompanhe os conteúdos exclusivos e registre suas teorias até a revelação final.",
  },
]

const trustItems = [
  "Primeiro clube do Brasil",
  "Pistas mensais",
  "Evento ao vivo com a comunidade",
  "Cancelamento flexível",
]

const heroWordAngles = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-0"]
const heroPaperCuts = [
  "[clip-path:polygon(1%_8%,99%_0,98%_86%,3%_100%)]",
  "[clip-path:polygon(0_7%,97%_4%,100%_92%,2%_96%)]",
  "[clip-path:polygon(2%_3%,100%_9%,98%_96%,0_91%)]",
  "[clip-path:polygon(0_10%,98%_2%,100%_90%,1%_100%)]",
]
const heroTitleRevealDelayMs = 72
const heroTitleWordOverlap = 0.8

export default function HomePage() {
  const heroTitle = getDynamicContent("home.hero.title")
  const heroBadge = getDynamicContent("home.hero.badge")
  const heroSubtitle = getDynamicContent("home.hero.subtitle")
  const heroCta = getDynamicContent("home.hero.cta")
  const finalCtaSubtitle = getDynamicContent("home.final_cta.subtitle")
  const trustSupport = getDynamicContent("home.trust.support")
  const featuredProducts = listProducts({ featured: true })
  const boxProducts = listProducts().filter((product) => product.type === "box")
  const plans = listPlans()
  const activeCase = getActiveCase()
  const progress = activeCase ? getSubscriberProgress(activeCase.id) : null
  const featuredBox = featuredProducts.find((product) => product.type === "box")
  const titleWords = (heroTitle?.value ?? "Investigue. Colete. Desvende.").split(" ")
  const liveEventDate = progress?.liveEventDate ?? activeCase?.liveEventDate
  const liveEventTitle =
    progress?.liveEventTitle ?? activeCase?.liveEventTitle ?? "Grande Revelação"

  return (
    <div className="bg-[#090807] text-[#fffaf0]">
      <section className="relative isolate overflow-hidden border-b border-[#2d201b]/15 bg-[#090807] text-[#fffaf0]">
        <Image
          src={heroBanner}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#090807_0%,rgba(9,8,7,0.96)_24%,rgba(9,8,7,0.62)_52%,rgba(9,8,7,0.18)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(216,65,50,0.22),transparent_24%),linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[auto,42px_42px,42px_42px]" />

        <div className="mx-auto flex min-h-[720px] max-w-6xl items-center px-4 py-16 sm:px-6 lg:min-h-[760px]">
          <div className="max-w-3xl space-y-7">
            <ScrollReveal immediate delay={0.05}>
              <div className="inline-flex max-w-full items-center gap-2 border border-[#d84132]/45 bg-[#2c1713]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#ffb0a5] shadow-[0_0_24px_rgba(216,65,50,0.18)]">
                <IconFingerprint className="size-4 shrink-0" />
                <span>
                  {heroBadge?.value ?? "Primeiro Clube de True Crime do Brasil"}
                </span>
              </div>
            </ScrollReveal>

            <div className="space-y-5">
              <ScrollReveal immediate delay={0.15} y={20}>
                <h1
                  className="flex max-w-3xl flex-col items-start gap-y-3 font-heading text-4xl font-black uppercase leading-[0.95] tracking-wide text-[#171211] sm:text-6xl lg:text-7xl"
                  aria-label={heroTitle?.value ?? "Investigue. Colete. Desvende."}
                >
                  {titleWords.map((word, index) => {
                    const startDelayMs = titleWords
                      .slice(0, index)
                      .reduce(
                        (total, prevWord) =>
                          total +
                          prevWord.length *
                            heroTitleRevealDelayMs *
                            heroTitleWordOverlap,
                        0,
                      )

                    return (
                      <span
                        key={`${word}-${index}`}
                        aria-hidden="true"
                        className={`${heroWordAngles[index % heroWordAngles.length]} relative isolate inline-flex w-fit max-w-full items-center overflow-visible`}
                      >
                        <span
                          className={`${heroPaperCuts[index % heroPaperCuts.length]} relative inline-flex items-center border border-[#d9ccb2]/85 bg-[radial-gradient(circle_at_18%_25%,rgba(107,77,42,0.16)_0_1px,transparent_1.4px),radial-gradient(circle_at_78%_68%,rgba(38,25,17,0.1)_0_1px,transparent_1.3px),linear-gradient(96deg,#fffdf2_0%,#f3ead7_46%,#fffbec_100%)] bg-size-[9px_9px,11px_11px,100%_100%] px-[0.22em] py-[0.12em] shadow-[0_13px_2px_-10px_rgba(0,0,0,0.78),0_2px_0_rgba(28,19,14,0.6),0_0_0_1px_rgba(255,250,229,0.42)_inset]`}
                        >
                          <span className="pointer-events-none absolute inset-x-3 bottom-1 h-px bg-[#171211]/80" />
                          <EncryptedText
                            text={word}
                            className="relative z-10 drop-shadow-[0_1px_0_rgba(255,255,255,0.2)]"
                            encryptedClassName="text-[#81746b]"
                            revealedClassName="bg-[radial-gradient(circle_at_35%_40%,rgba(23,18,17,0.88)_0_0.9px,transparent_1.25px),linear-gradient(95deg,#15100f,#332a25_52%,#16110f)] bg-size-[4px_4px,100%_100%] bg-clip-text text-transparent [-webkit-text-stroke:1.2px_rgba(23,18,17,0.84)] [paint-order:stroke_fill]"
                            revealDelayMs={heroTitleRevealDelayMs}
                            flipDelayMs={65}
                            startDelayMs={startDelayMs}
                          />
                        </span>
                      </span>
                    )
                  })}
                </h1>
              </ScrollReveal>
              <TextGenerateEffect
                immediate
                words={
                  heroSubtitle?.value ??
                  "Eleve seu nível de conteúdo com uma caixa temática mensal, recheada de surpresas exclusivas — da abertura ao design impecável de cada item colecionável."
                }
                textClassName="max-w-2xl bg-black/28 py-1 text-lg leading-8 text-[#f0e2c5] [box-decoration-break:clone] sm:text-xl"
                staggerDelay={0.04}
              />
            </div>

            <ScrollReveal immediate delay={0.45}>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#d84132] text-white shadow-[0_0_26px_rgba(216,65,50,0.35)] hover:bg-[#b93227]"
                >
                  <Link href="/assinatura">
                    {heroCta?.value ?? "Garantir minha vaga"}
                    <IconArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-[#fffaf0]/25 bg-[#090807]/45 text-[#fffaf0] backdrop-blur-sm hover:bg-[#fffaf0]/12 hover:text-[#fffaf0]"
                >
                  <Link href="/loja">Ver boxes avulsas</Link>
                </Button>
              </div>
            </ScrollReveal>

            <ScrollRevealGroup immediate delayChildren={0.55} staggerChildren={0.08}>
              <div className="grid max-w-2xl gap-2 text-sm text-[#e5d8c4] sm:grid-cols-2">
                {trustItems.map((item) => (
                  <ScrollRevealItem key={item}>
                    <div className="flex items-center gap-2">
                      <IconCircleCheck className="size-4 text-[#d84132]" />
                      <span>{item}</span>
                    </div>
                  </ScrollRevealItem>
                ))}
              </div>
            </ScrollRevealGroup>

            <ScrollRevealGroup immediate delayChildren={0.7} staggerChildren={0.1}>
              <div className="grid max-w-2xl gap-3 pt-2 text-sm sm:grid-cols-2">
                <ScrollRevealItem>
                  <div className="border border-[#fffaf0]/14 bg-[#090807]/58 p-4 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7b56d]">
                      Caso em andamento
                    </p>
                    <p className="mt-2 font-heading text-xl font-semibold">
                      {activeCase?.title ?? "Operação Meia-Noite"}
                    </p>
                  </div>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="border border-[#fffaf0]/14 bg-[#090807]/58 p-4 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7b56d]">
                      Ciclo atual
                    </p>
                    <p className="mt-2 font-heading text-xl font-semibold">
                      {featuredBox?.cycleNumber ? `Box #${featuredBox.cycleNumber}` : "Nova box mensal"}
                    </p>
                  </div>
                </ScrollRevealItem>
              </div>
            </ScrollRevealGroup>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#0b0908]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_22%,rgba(216,65,50,0.2),transparent_28%),radial-gradient(circle_at_80%_12%,rgba(215,181,109,0.12),transparent_30%),linear-gradient(135deg,#0b0908_0%,#130d0b_46%,#090807_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[56px_56px]" />
        {/* <div className="absolute left-0 top-10 -z-10 h-px w-full bg-linear-to-r from-transparent via-[#d7b56d]/35 to-transparent" /> */}

        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-4xl space-y-4 text-center">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b56d]">
                O que é o Club?
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="mx-auto max-w-2xl font-heading text-3xl font-black uppercase leading-[1.15] tracking-wide text-[#fffaf0] sm:text-4xl">
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
              <div className="mx-auto flex max-w-2xl items-start gap-4 border border-[#fffaf0]/12 bg-[#171211]/60 p-5 text-left sm:p-6">
                <div className="flex size-10 shrink-0 items-center justify-center bg-[#d84132]/20 text-[#ffb0a5]">
                  <IconUsers className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d7b56d]">
                    Curadoria com paixão
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#d7c9b5]">
                    Todo mês, sua caixa chega cheia de surpresas pensadas por designers
                    que vivem true crime e colocam o coração em cada detalhe — do
                    conceito ao acabamento final.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="space-y-6">
            <ScrollRevealGroup
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              staggerChildren={0.08}
            >
              {clubHighlights.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <ScrollRevealItem key={feature.title}>
                    <GlowingCard
                      className="min-h-[258px] transition-transform duration-300 hover:-translate-y-1"
                      innerClassName="group relative h-full overflow-hidden bg-[#171211]/84 p-5 transition-colors duration-300 hover:bg-[#1e1512]"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(216,65,50,0.12),transparent_30%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative flex h-full flex-col">
                        <span className="absolute right-0 top-0 font-heading text-4xl font-black text-[#fffaf0]/5">
                          0{index + 1}
                        </span>
                        <Icon className="size-10 text-[#d84132] drop-shadow-[0_0_26px_rgba(216,65,50,0.24)]" />
                        <h3 className="mt-5 font-heading text-lg font-semibold">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#d7c9b5]">
                          {feature.description}
                        </p>
                        <div className="mt-auto pt-5">
                          <div className="h-px w-full bg-linear-to-r from-[#d84132]/60 via-[#d7b56d]/35 to-transparent opacity-55 transition-opacity group-hover:opacity-100" />
                        </div>
                      </div>
                    </GlowingCard>
                  </ScrollRevealItem>
                )
              })}
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

      <section className="border-b border-[#fffaf0]/10 bg-[#090807]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto mb-10 max-w-3xl space-y-4 text-center">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b56d]">
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
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            staggerChildren={0.07}
          >
            {boxCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <ScrollRevealItem key={category.title}>
                  <GlowingCard
                    className="h-full"
                    innerClassName="group relative h-full bg-[#171211] p-5"
                  >
                    <span className="absolute right-3 top-3 font-heading text-2xl font-black text-[#fffaf0]/5">
                      0{index + 1}
                    </span>
                    <Icon className="size-9 text-[#d84132]" />
                    <h3 className="mt-4 font-heading text-base font-semibold leading-snug">
                      {category.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#d7c9b5]">
                      {category.description}
                    </p>
                  </GlowingCard>
                </ScrollRevealItem>
              )
            })}
          </ScrollRevealGroup>

          <ScrollReveal delay={0.15}>
            <div className="mx-auto mt-8 max-w-3xl border border-[#d7b56d]/25 bg-[#171211]/80 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d7b56d]">
                Nota do arquivo
              </p>
              <p className="mt-3 text-sm leading-6 text-[#d7c9b5]">
                Para garantir exclusividade e fator surpresa, cada edição conta com uma{" "}
                <strong className="font-medium text-[#e5d8c4]">
                  seleção de alguns itens
                </strong>{" "}
                das categorias acima, variando a cada mês. Você não receberá todos os
                tipos de itens em uma única entrega — e sim uma curadoria especial e
                inédita a cada ciclo.
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
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d7b56d]">
                  Investigação contínua
                </p>
                <span className="hidden h-px flex-1 bg-[#d7b56d]/55 sm:block" />
              </div>

              <h2 className="font-heading text-3xl font-black leading-tight text-[#f0e8dd] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08] xl:text-5xl">
                Uma pista por mês. Um caso inteiro para desvendar.
              </h2>

              <p className="max-w-lg text-base leading-7 text-[#c8bdad] sm:text-lg sm:leading-8">
                Receba dicas, evidências, documentos e revelações que se acumulam ao
                longo do ano — até desvendar o crime juntos, em tempo real, com toda a
                comunidade do clube.
              </p>

              {liveEventDate ? (
                <div className="max-w-lg border border-[#b98542]/40 bg-[#070604]/75 p-4 backdrop-blur-sm sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
                    Evento ao vivo
                  </p>
                  <p className="mt-2 font-heading text-lg font-semibold text-[#f0e8dd]">
                    {liveEventTitle}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#c8bdad]">
                    {formatDate(liveEventDate)} — revelação final com a comunidade
                  </p>
                </div>
              ) : null}
            </div>

            <div className="border border-[#b98542]/55 bg-[#070604]/82 p-6 text-[#f0e8dd] shadow-[0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-8 lg:mx-auto lg:w-full lg:max-w-md xl:max-w-lg">
              <div className="relative">
                <IconCalendarEvent className="absolute right-0 top-0 size-10 text-[#e24132] sm:size-11" />
                <div className="pr-14">
                  <p className="text-xs font-semibold uppercase tracking-[0.27em] text-[#d7b56d] sm:text-sm">
                    Progresso do caso
                  </p>
                  <h3 className="mt-4 font-heading text-3xl font-black leading-tight text-[#f0e8dd] sm:text-4xl">
                    {progress ? `${progress.percentComplete}% investigado` : "Caso aberto"}
                  </h3>
                </div>

                <div className="mt-8 h-px bg-[#a78a5a]/35" />

                <div className="grid grid-cols-3 border-b border-[#a78a5a]/35 py-6 text-center sm:py-8">
                  <div className="border-r border-[#a78a5a]/35 px-2 sm:px-3">
                    <p className="font-heading text-3xl font-black leading-none sm:text-4xl">
                      {progress?.currentCycle ?? 1}
                    </p>
                    <p className="mt-2 text-sm text-[#c8bdad] sm:text-base">ciclo</p>
                  </div>
                  <div className="border-r border-[#a78a5a]/35 px-2 sm:px-3">
                    <p className="font-heading text-3xl font-black leading-none sm:text-4xl">
                      {progress?.collectedClues ?? 0}
                    </p>
                    <p className="mt-2 text-sm text-[#c8bdad] sm:text-base">pistas</p>
                  </div>
                  <div className="px-2 sm:px-3">
                    <p className="font-heading text-3xl font-black leading-none sm:text-4xl">
                      {activeCase?.totalClues ?? progress?.totalClues ?? 12}
                    </p>
                    <p className="mt-2 text-sm text-[#c8bdad] sm:text-base">no ano</p>
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

      <section className="border-b border-[#fffaf0]/10 bg-[#171211]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8 max-w-2xl">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
                Como funciona?
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Da assinatura ao dossiê final em três passos.
              </h2>
            </ScrollReveal>
          </div>

          <ScrollRevealGroup className="grid gap-4 md:grid-cols-3" staggerChildren={0.12}>
            {howItWorks.map((step, index) => {
              const Icon = step.icon
              return (
                <ScrollRevealItem key={step.title}>
                  <GlowingCard innerClassName="bg-[#090807] p-6">
                    <div className="flex items-center justify-between">
                      <Icon className="size-10 text-[#d84132]" />
                      <span className="font-heading text-4xl font-semibold text-[#fffaf0]/10">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-6 font-heading text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#d7c9b5]">{step.description}</p>
                  </GlowingCard>
                </ScrollRevealItem>
              )
            })}
          </ScrollRevealGroup>
        </div>
      </section>

      <section className="border-b border-[#fffaf0]/10 bg-[#090807]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8 max-w-2xl space-y-4">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
                Escolha seu plano
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Comece pelo ritmo que combina com você.
              </h2>
            </ScrollReveal>
            <TextGenerateEffect
              words="Planos recorrentes para acompanhar todos os ciclos ou compra avulsa para experimentar uma edição específica."
              textClassName="max-w-2xl text-sm leading-6 text-[#d7c9b5]"
              staggerDelay={0.04}
            />
          </div>

          <ScrollRevealGroup className="grid gap-4 lg:grid-cols-3" staggerChildren={0.12}>
            {plans.map((plan) => (
              <ScrollRevealItem key={plan.id}>
                <GlowingCard className="relative h-full" innerClassName="p-6">
                  {plan.isRecommended ? (
                    <span className="absolute right-4 top-4 z-10 bg-[#d84132] px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                      Melhor escolha
                    </span>
                  ) : null}
                  <h3 className="pr-28 font-heading text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-[#d7c9b5]">
                    {plan.description}
                  </p>
                  <p className="mt-5 font-heading text-3xl font-semibold">
                    {plan.pricePerMonth
                      ? `${formatCurrency(plan.pricePerMonth)}/mês`
                      : formatCurrency(plan.price)}
                  </p>
                  <ul className="mt-5 space-y-3 text-sm text-[#e5d8c4]">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <IconShieldCheck className="mt-0.5 size-4 shrink-0 text-[#d84132]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-6 w-full bg-[#d84132] text-white hover:bg-[#b93227]"
                  >
                    <Link href={`/checkout?plano=${plan.slug}`}>
                      Escolher
                      <IconArrowRight className="size-4" />
                    </Link>
                  </Button>
                </GlowingCard>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      <section className="bg-[#171211] text-[#fffaf0]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
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
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
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

          <ScrollRevealGroup
            className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4"
            staggerChildren={0.1}
          >
            {boxProducts.map((product) => {
              const productImage = getProductImage(product.images[0] ?? "")

              return (
                <ScrollRevealItem key={product.id} className="h-full">
                  <GlowingCard
                    className="h-full shadow-xl shadow-black/20"
                    innerClassName="flex h-full flex-col overflow-hidden bg-[#090807] p-0"
                  >
                    {productImage ? (
                      <div className="relative aspect-4/3 shrink-0 overflow-hidden border-b border-[#fffaf0]/14 bg-[#171211]">
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          placeholder="blur"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffb0a5]">
                          {product.type === "box" ? "Box temática" : "Produto"}
                        </p>
                        <span className="shrink-0 border border-[#fffaf0]/14 bg-[#171211] px-2 py-1 text-xs text-[#d7c9b5]">
                          {product.availability === "limited" ? "Limitado" : "Disponível"}
                        </span>
                      </div>

                      <h3 className="mt-4 line-clamp-2 h-[2lh] overflow-hidden font-heading text-lg font-semibold leading-snug">
                        {product.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 h-[2lh] overflow-hidden text-sm leading-6 text-[#d7c9b5]">
                        {product.shortDescription}
                      </p>

                      {product.includedItems?.length ? (
                        <ul className="mt-4 min-h-21 space-y-2 text-sm text-[#e5d8c4]">
                          {product.includedItems.slice(0, 3).map((item) => (
                            <li key={item} className="flex gap-2">
                              <IconCircleCheck className="mt-0.5 size-4 shrink-0 text-[#d84132]" />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-4 min-h-21" aria-hidden="true" />
                      )}

                      <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#fffaf0]/10 pt-4">
                        <p className="font-heading text-lg font-semibold">
                          {formatCurrency(product.price)}
                        </p>
                        <Link
                          href={`/loja/${product.slug}`}
                          className="shrink-0 text-sm font-medium text-[#ffb0a5] hover:text-[#fffaf0] hover:underline"
                        >
                          Ver detalhes
                        </Link>
                      </div>
                    </div>
                  </GlowingCard>
                </ScrollRevealItem>
              )
            })}
          </ScrollRevealGroup>
        </div>
      </section>

      <section className="bg-[#d84132] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <ScrollReveal>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
                Pronto para abrir o arquivo?
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold">
                Garanta sua vaga antes que a próxima edição esgote.
              </h2>
              <TextGenerateEffect
                words={
                  finalCtaSubtitle?.value ??
                  "Garanta sua vaga no clube antes que a próxima edição esgote. A próxima pista já está sendo preparada."
                }
                textClassName="mt-2 text-sm text-white/80"
                staggerDelay={0.06}
                filter={false}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <Button asChild size="lg" className="bg-white text-[#171211] hover:bg-[#fff1dd]">
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
