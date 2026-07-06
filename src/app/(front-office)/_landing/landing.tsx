'use client'

import { IconChevronDown } from '@tabler/icons-react'

import { LandingClientChrome } from '@/src/app/(front-office)/_landing/landing-client-chrome'
import { Reveal } from '@/src/app/(front-office)/_landing/reveal'
import { ArchiveBand } from '@/src/app/(front-office)/_landing/sections/archive-band'
import { BoxContents } from '@/src/app/(front-office)/_landing/sections/box-contents'
import { ClubIntro } from '@/src/app/(front-office)/_landing/sections/club-intro'
import { FeaturedBy } from '@/src/app/(front-office)/_landing/sections/featured-by'
import { FinalCta } from '@/src/app/(front-office)/_landing/sections/final-cta'
import { Hero } from '@/src/app/(front-office)/_landing/sections/hero'
import { HowItWorks } from '@/src/app/(front-office)/_landing/sections/how-it-works'
import { PlanCards } from '@/src/app/(front-office)/_landing/sections/plan-cards'
import { RibbonMarquee } from '@/src/app/(front-office)/_landing/sections/ribbon-marquee'
import { StandaloneEdition } from '@/src/app/(front-office)/_landing/sections/standalone-edition'
import { Testimonials } from '@/src/app/(front-office)/_landing/sections/testimonials'
import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  transitionCardHover,
} from '@/src/lib/design/classes'
import { PaginaCms, SecaoCms } from '@/src/lib/domain/types'
import { cn } from '@/src/lib/utils'

export function PageRenderer({ sections }: { sections: SecaoCms[] }) {
  const sortedSections = [...sections].sort((a, b) => a.ordem - b.ordem)

  return (
    <>
      {sortedSections.map((section) => {
        const key = section.id
        const props = section.props || {}

        switch (section.tipo) {
          case 'landing.hero':
            return <Hero key={key} {...props} />
          case 'landing.ribbon':
            return <RibbonMarquee key={key} {...props} />
          case 'landing.clubIntro':
            return (
              <Reveal key={key}>
                <ClubIntro {...props} />
              </Reveal>
            )
          case 'landing.featuredBy':
            return (
              <Reveal key={key}>
                <FeaturedBy />
              </Reveal>
            )
          case 'landing.boxContents':
            return (
              <Reveal key={key}>
                <BoxContents />
              </Reveal>
            )
          case 'landing.howItWorks':
            return (
              <Reveal key={key}>
                <HowItWorks />
              </Reveal>
            )
          case 'landing.testimonials':
            return (
              <Reveal key={key}>
                <Testimonials {...props} />
              </Reveal>
            )
          case 'commerce.planCards':
            return (
              <Reveal key={key}>
                <PlanCards />
              </Reveal>
            )
          case 'landing.standaloneEdition':
            return (
              <Reveal key={key}>
                <StandaloneEdition />
              </Reveal>
            )
          case 'commerce.productArchive':
            return <ArchiveBand key={key} />
          case 'landing.finalCta':
            return (
              <Reveal key={key}>
                <FinalCta {...props} />
              </Reveal>
            )
          case 'richText': {
            const richTextProps = props as { content?: string }
            return (
              <section key={key} className="mx-auto max-w-[800px] px-8 py-16">
                <div
                  dangerouslySetInnerHTML={{
                    __html: richTextProps.content || '',
                  }}
                />
              </section>
            )
          }
          case 'faq': {
            const faqProps = props as {
              items?: { question: string; answer: string }[]
            }
            return (
              <section key={key} className="mx-auto max-w-[840px] px-8 py-16">
                <div className="mb-8">
                  <SectionEyebrow>FAQ</SectionEyebrow>
                  <h2
                    className={`m-0 text-[clamp(28px,3.4vw,44px)] font-semibold tracking-tight text-(--ink) ${fontHeading}`}
                  >
                    Perguntas Frequentes
                  </h2>
                </div>
                <div className="space-y-4">
                  {(faqProps.items || []).map((item, idx: number) => (
                    <details
                      key={idx}
                      className={cn(
                        'group relative p-5 transition-all duration-300 sm:p-6',
                        dossierCardSurface,
                        cardShadowBase,
                        transitionCardHover,
                        'hover:-translate-y-0.5 hover:border-(--red)/30 hover:shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3)]',
                      )}
                    >
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 outline-none [&::-webkit-details-marker]:hidden">
                        <span
                          className={`text-base font-semibold tracking-tight text-(--ink) sm:text-lg ${fontHeading}`}
                        >
                          {item.question}
                        </span>
                        <IconChevronDown className="mt-0.5 size-5 shrink-0 text-(--red) transition-transform duration-300 group-open:rotate-180" />
                      </summary>
                      <div className="mt-4 border-t border-dashed border-[rgba(33,28,24,0.15)] pt-4 text-[16px] leading-[1.6] text-(--ink-soft)">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )
          }
          default:
            return null
        }
      })}
    </>
  )
}

interface LandingProps {
  page: PaginaCms
}

export function Landing({ page }: LandingProps) {
  return (
    <LandingClientChrome>
      <DesignPageShell showOverlays={false}>
        <main>
          <PageRenderer sections={page.sections} />
        </main>
      </DesignPageShell>
    </LandingClientChrome>
  )
}
