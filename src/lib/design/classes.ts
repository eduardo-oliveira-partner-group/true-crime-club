/** Mono font stack reused across labels, badges and tags. */
export const fontMono = '[font-family:var(--design-font-mono),monospace]'
export const fontType = fontMono

/** Heading font stack reused across titles. */
export const fontHeading =
  '[font-family:var(--design-font-heading),system-ui,sans-serif]'

/** Shared frame for main content sections (max-width 1180px + responsive gutters). */
export const sectionFrame = 'mx-auto max-w-[1180px] px-8 max-[860px]:px-[22px]'

/** Paper page background with micro-dot texture. */
export const paperPageClass =
  'relative z-0 min-h-svh overflow-x-clip bg-(--paper) bg-[radial-gradient(rgba(33,28,24,0.06)_0.7px,transparent_0.7px),radial-gradient(rgba(33,28,24,0.035)_0.7px,transparent_0.7px)] bg-size-[5px_5px,5px_5px] bg-position-[0_0,2px_2px] [font-family:var(--design-font-body),system-ui,sans-serif] text-(--ink) antialiased'

/** One-shot entrance animation for hero copy lines. */
export const heroRevealBase = 'animate-hero-in'

/** Shared composite-transition values. */
export const transitionColors =
  '[transition:translate_0.24s_cubic-bezier(0.22,1,0.36,1),rotate_0.24s_cubic-bezier(0.22,1,0.36,1),scale_0.24s_cubic-bezier(0.22,1,0.36,1),transform_0.24s_cubic-bezier(0.22,1,0.36,1),background-color_0.2s_ease,border-color_0.2s_ease,color_0.2s_ease,box-shadow_0.24s_cubic-bezier(0.22,1,0.36,1)]'
export const transitionBgColor =
  '[transition:background-color_0.2s_ease,border-color_0.2s_ease,color_0.2s_ease]'
export const transitionChip =
  '[transition:background-color_0.2s_ease,color_0.2s_ease,border-color_0.2s_ease]'
export const transitionLift =
  '[transition:translate_0.24s_cubic-bezier(0.22,1,0.36,1),scale_0.24s_cubic-bezier(0.22,1,0.36,1),transform_0.24s_cubic-bezier(0.22,1,0.36,1),box-shadow_0.24s_cubic-bezier(0.22,1,0.36,1)]'
export const transitionCardHover =
  '[transition:translate_0.32s_cubic-bezier(0.22,1,0.36,1),transform_0.32s_cubic-bezier(0.22,1,0.36,1),box-shadow_0.32s_cubic-bezier(0.22,1,0.36,1)]'
export const transitionPolaroid =
  '[transition:translate_0.3s_cubic-bezier(0.22,1,0.36,1),rotate_0.3s_cubic-bezier(0.22,1,0.36,1),transform_0.3s_cubic-bezier(0.22,1,0.36,1),box-shadow_0.3s_ease]'
export const transitionFab =
  '[transition:opacity_0.35s_ease,translate_0.35s_cubic-bezier(0.22,1,0.36,1),scale_0.35s_cubic-bezier(0.22,1,0.36,1),transform_0.35s_cubic-bezier(0.22,1,0.36,1)]'
export const arrowTransition =
  '[transition:translate_0.25s_cubic-bezier(0.22,1,0.36,1),transform_0.25s_cubic-bezier(0.22,1,0.36,1)]'

/** Shared look for hero/final CTA buttons (filled + outline variants). */
export const ctaButtonBase = `inline-flex items-center justify-center rounded-[9px] px-5 py-[14px] text-[14px] leading-none font-bold tracking-[0.04em] whitespace-nowrap uppercase no-underline ${transitionColors} ${fontMono}`

/** Arrow glyph that nudges right on hover — pair with a `group` ancestor. */
export const arrowIconClass = `inline-flex items-center leading-none ${arrowTransition} group-hover:translate-x-1`

/** Warm shadow vocabulary from DESIGN.md Elevation section. */
export const warmShadowClass =
  'shadow-[0_18px_40px_-18px_rgba(33,28,24,0.22),inset_0_0_0_1px_rgba(255,255,255,0.5)]'
export const warmShadowHoverClass =
  'shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3),inset_0_0_0_1px_rgba(255,255,255,0.6)]'
export const cardShadowBase =
  'shadow-[0_18px_40px_-18px_rgba(33,28,24,0.22),inset_0_0_0_1px_rgba(255,255,255,0.5)]'
export const cardShadowHover =
  'shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3),inset_0_0_0_1px_rgba(255,255,255,0.6)]'
export const polaroidShadow =
  'shadow-[0_12px_26px_-12px_rgba(33,28,24,0.28),inset_0_0_0_1px_rgba(255,255,255,0.6)]'
export const buttonLiftShadow =
  'shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)]'

/** Standard dossier card surface classes. */
export const dossierCardSurface =
  'rounded-[14px_14px_16px_16px] border border-[rgba(33,28,24,0.15)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_120px)]'

/** Form label on paper/card surfaces — body font, not typewriter. */
export const formLabelClass =
  'text-sm font-semibold text-(--ink) [font-family:var(--design-font-body),system-ui,sans-serif]'

/** Form input aligned with DESIGN.md Inputs / Fields.
 * Includes overrides so shadcn Input/Textarea defaults (h-9, ring, rounded-3xl) do not win. */
export const formInputClass = `mt-2 h-auto min-h-0 w-full min-w-0 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--card) px-4 py-3 text-sm text-(--ink) shadow-none outline-none placeholder:text-(--ink-mute) ${transitionBgColor} focus:border-(--red) focus:bg-(--card) focus:shadow-[0_0_0_2px_rgba(197,39,31,0.15)] focus-visible:border-(--red) focus-visible:bg-(--card) focus-visible:shadow-[0_0_0_2px_rgba(197,39,31,0.15)] focus-visible:ring-0`

/** Inline action links on auth and utility forms. */
export const formLinkClass = `font-medium text-(--red) no-underline ${transitionBgColor} hover:text-(--red-deep)`
