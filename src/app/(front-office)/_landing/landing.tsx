'use client'

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

type LandingProps = {
  fontClassName: string
}

export function Landing({ fontClassName }: LandingProps) {
  return (
    <LandingClientChrome>
      <DesignPageShell fontClassName={fontClassName} showOverlays={false}>
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
      </DesignPageShell>
    </LandingClientChrome>
  )
}
