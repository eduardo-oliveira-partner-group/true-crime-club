import Image from 'next/image'

import { featuredByLogos } from '@/src/app/(front-office)/_landing/content'
import featuredSilhuetas from '@/src/assets/images/design-sugerido/featured-silhuetas.png'

export function FeaturedBy() {
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
