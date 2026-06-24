import Image from "next/image"
import Link from "next/link"
import {
  IconArrowRight,
  IconBoxSeam,
  IconCalendarEvent,
  IconChecklist,
  IconCircleCheck,
  IconClipboardText,
  IconCreditCard,
  IconFingerprint,
  IconPackage,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react"

import { Button } from "@/src/components/ui/button"
import heroBanner from "@/src/assets/images/banner-hero-v2.png"
import {
  getActiveCase,
  getDynamicContent,
  getSubscriberProgress,
  listPlans,
  listProducts,
} from "@/src/lib/domain/repositories"
import { formatCurrency } from "@/src/lib/formatters"

const clubHighlights = [
  {
    icon: IconBoxSeam,
    title: "Box temática mensal",
    description:
      "Uma curadoria surpresa com itens colecionáveis, papelaria premium, decoração e acessórios inspirados no universo true crime.",
  },
  {
    icon: IconFingerprint,
    title: "Pistas colecionáveis",
    description:
      "Cada ciclo libera uma nova evidência da investigação fictícia do ano, criada para ser acompanhada com a comunidade.",
  },
  {
    icon: IconClipboardText,
    title: "Conteúdos exclusivos",
    description:
      "Arquivos, registros e materiais digitais para aprofundar teorias e conectar os detalhes entre uma box e outra.",
  },
  {
    icon: IconSparkles,
    title: "Edições limitadas",
    description:
      "Produtos avulsos, extras e lançamentos especiais para completar a coleção ou presentear quem também ama mistério.",
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
  "Curadoria temática",
  "Pistas mensais",
  "Conteúdo exclusivo",
  "Cancelamento flexível",
]

const heroWordAngles = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-0"]

export default function HomePage() {
  const heroTitle = getDynamicContent("home.hero.title")
  const heroSubtitle = getDynamicContent("home.hero.subtitle")
  const heroCta = getDynamicContent("home.hero.cta")
  const trustSupport = getDynamicContent("home.trust.support")
  const featuredProducts = listProducts({ featured: true })
  const plans = listPlans()
  const activeCase = getActiveCase()
  const progress = activeCase ? getSubscriberProgress(activeCase.id) : null
  const featuredBox = featuredProducts.find((product) => product.type === "box")
  const titleWords = (heroTitle?.value ?? "Investigue. Colete. Desvende.").split(" ")

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
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(216,65,50,0.22),transparent_24%),linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />

        <div className="mx-auto flex min-h-[720px] max-w-6xl items-center px-4 py-16 sm:px-6 lg:min-h-[760px]">
          <div className="max-w-3xl space-y-7">
            <div className="inline-flex max-w-full items-center gap-2 border border-[#d84132]/45 bg-[#2c1713]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#ffb0a5] shadow-[0_0_24px_rgba(216,65,50,0.18)]">
              <IconFingerprint className="size-4 shrink-0" />
              <span>Clube de assinatura investigativo</span>
            </div>

            <div className="space-y-5">
              <h1
                className="flex max-w-3xl flex-wrap items-start gap-x-3 gap-y-2 font-heading text-4xl font-black uppercase leading-[0.95] tracking-wide text-[#171211] sm:text-6xl lg:text-7xl"
                aria-label={heroTitle?.value ?? "Investigue. Colete. Desvende."}
              >
                {titleWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    aria-hidden="true"
                    className={`${heroWordAngles[index % heroWordAngles.length]} inline-block border border-[#fffaf0]/70 bg-[#fffaf0] px-2 pb-1 pt-0.5 shadow-[0_0_0_1px_rgba(26,18,17,0.35),0_0_22px_rgba(123,83,255,0.42)]`}
                  >
                    {word}
                  </span>
                ))}
              </h1>
              <p className="max-w-2xl bg-black/28 py-1 text-lg leading-8 text-[#f0e2c5] [box-decoration-break:clone] sm:text-xl">
                {heroSubtitle?.value ??
                  "O clube de assinatura que envia mensalmente uma box temática de true crime com curadoria exclusiva, surpresa e uma trama investigativa contínua."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#d84132] text-white shadow-[0_0_26px_rgba(216,65,50,0.35)] hover:bg-[#b93227]"
              >
                <Link href="/assinatura">
                  {heroCta?.value ?? "Assine agora"}
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

            <div className="grid max-w-2xl gap-2 text-sm text-[#e5d8c4] sm:grid-cols-2">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <IconCircleCheck className="size-4 text-[#d84132]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="grid max-w-2xl gap-3 pt-2 text-sm sm:grid-cols-2">
              <div className="border border-[#fffaf0]/14 bg-[#090807]/58 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7b56d]">
                  Caso em andamento
                </p>
                <p className="mt-2 font-heading text-xl font-semibold">
                  {activeCase?.title ?? "Operação Meia-Noite"}
                </p>
              </div>
              <div className="border border-[#fffaf0]/14 bg-[#090807]/58 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d7b56d]">
                  Ciclo atual
                </p>
                <p className="mt-2 font-heading text-xl font-semibold">
                  {featuredBox?.cycleNumber ? `Box #${featuredBox.cycleNumber}` : "Nova box mensal"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#fffaf0]/10 bg-[#090807]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
              O que é o Club?
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Uma caixa mensal para quem gosta de investigar detalhes.
            </h2>
            <p className="text-base leading-7 text-[#d7c9b5]">
              A experiência combina produto físico, narrativa colecionável e conteúdo digital.
              Cada entrega funciona como uma nova página do arquivo: você recebe itens para usar,
              guardar e conectar com as pistas do caso em andamento.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-[#fffaf0]/25 bg-transparent text-[#fffaf0] hover:bg-[#fffaf0]/12 hover:text-[#fffaf0]"
            >
              <Link href="/assinatura">
                Conhecer planos
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {clubHighlights.map((feature) => {
              const Icon = feature.icon
              return (
                <article
                  key={feature.title}
                  className="border border-[#fffaf0]/14 bg-[#171211] p-5 transition-transform hover:-translate-y-1 hover:border-[#fffaf0]/22"
                >
                  <div className="flex size-10 items-center justify-center bg-[#d84132] text-white">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#d7c9b5]">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#fffaf0]/10 bg-[#171211]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
              Investigação contínua
            </p>
            <h2 className="max-w-3xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Uma pista por mês, um caso inteiro para desvendar ao longo do ano.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-[#d7c9b5]">
              Além dos itens da box, assinantes acompanham uma trama fictícia com documentos,
              registros e evidências digitais. O caso avança em ciclos e termina em um evento
              ao vivo com a comunidade.
            </p>
          </div>

          <div className="border border-[#fffaf0]/14 bg-[#090807] p-5 text-[#fffaf0]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#d7b56d]">
                  Progresso atual
                </p>
                <h3 className="mt-2 font-heading text-2xl font-semibold">
                  {progress ? `${progress.percentComplete}% investigado` : "Caso aberto"}
                </h3>
              </div>
              <IconCalendarEvent className="size-9 text-[#d84132]" />
            </div>
            <div className="mt-6 grid grid-cols-3 border border-[#fffaf0]/12 text-center">
              <div className="border-r border-[#fffaf0]/12 p-4">
                <p className="font-heading text-2xl font-semibold">
                  {progress?.currentCycle ?? 1}
                </p>
                <p className="mt-1 text-xs text-[#d7c9b5]">ciclo</p>
              </div>
              <div className="border-r border-[#fffaf0]/12 p-4">
                <p className="font-heading text-2xl font-semibold">
                  {progress?.collectedClues ?? 0}
                </p>
                <p className="mt-1 text-xs text-[#d7c9b5]">pistas</p>
              </div>
              <div className="p-4">
                <p className="font-heading text-2xl font-semibold">
                  {activeCase?.totalClues ?? progress?.totalClues ?? 12}
                </p>
                <p className="mt-1 text-xs text-[#d7c9b5]">no ano</p>
              </div>
            </div>
            <Button asChild className="mt-6 w-full bg-[#d84132] text-white hover:bg-[#b93227]">
              <Link href="/cliente/conteudos">
                Explorar conteúdos exclusivos
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-[#fffaf0]/10 bg-[#090807]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
                Escolha seu plano
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Comece pelo ritmo que combina com você.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#d7c9b5]">
              Planos recorrentes para acompanhar todos os ciclos ou compra avulsa para experimentar
              uma edição específica.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className="relative border border-[#fffaf0]/14 bg-[#171211] p-6"
              >
                {plan.isRecommended ? (
                  <span className="absolute right-4 top-4 bg-[#d84132] px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
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
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#fffaf0]/10 bg-[#171211]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
              Como funciona?
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Da assinatura ao dossiê final em três passos.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {howItWorks.map((step, index) => {
              const Icon = step.icon
              return (
                <article
                  key={step.title}
                  className="border border-[#fffaf0]/14 bg-[#090807] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center bg-[#d84132] text-white">
                      <Icon className="size-5" />
                    </div>
                    <span className="font-heading text-4xl font-semibold text-[#fffaf0]/10">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#d7c9b5]">{step.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#171211] text-[#fffaf0]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d7b56d]">
              Loja e edições avulsas
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Quer experimentar antes de assinar?
            </h2>
            <p className="text-sm leading-6 text-[#d7c9b5]">
              Boxes anteriores e produtos extras continuam disponíveis enquanto houver estoque.
              Assinantes veem preços especiais em itens selecionados.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-[#fffaf0]/25 bg-transparent text-[#fffaf0] hover:bg-[#fffaf0]/12 hover:text-[#fffaf0]"
            >
              <Link href="/loja">
                Ver loja completa
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featuredProducts.map((product) => (
              <article
                key={product.id}
                className="border border-[#fffaf0]/14 bg-[#090807] p-5 shadow-xl shadow-black/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffb0a5]">
                    {product.type === "box" ? "Box temática" : "Produto"}
                  </p>
                  <span className="border border-[#fffaf0]/14 bg-[#171211] px-2 py-1 text-xs text-[#d7c9b5]">
                    {product.availability === "limited" ? "Limitado" : "Disponível"}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold">{product.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-[#d7c9b5]">
                  {product.shortDescription}
                </p>
                {product.includedItems?.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-[#e5d8c4]">
                    {product.includedItems.slice(0, 3).map((item) => (
                      <li key={item} className="flex gap-2">
                        <IconCircleCheck className="mt-0.5 size-4 shrink-0 text-[#d84132]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className="font-semibold">{formatCurrency(product.price)}</p>
                  <Link
                    href={`/loja/${product.slug}`}
                    className="text-sm font-medium text-[#ffb0a5] hover:text-[#fffaf0] hover:underline"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#d84132] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
              Pronto para abrir o arquivo?
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold">
              Sua próxima pista pode chegar no próximo ciclo.
            </h2>
            <p className="mt-2 text-sm text-white/80">
              {trustSupport?.value ?? "Suporte humano de segunda a sexta, das 9h às 18h."}
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-[#171211] hover:bg-[#fff1dd]">
            <Link href="/assinatura">
              Comparar planos
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
