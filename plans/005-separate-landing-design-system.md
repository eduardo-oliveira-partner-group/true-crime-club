# Plan 005: Separate the landing page and promote its design system across Front Office

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 484bdfd..HEAD -- src/app src/components src/lib src/assets DESIGN.md PRODUCT.md README.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: none
- **Category**: tech-debt / direction
- **Planned at**: commit `484bdfd`, 2026-07-01

## Why this matters

The current landing page is both the strongest implementation of the new
TrueCrime.Club visual identity and a large route-local Client Component. It
contains design tokens, shell UI, page sections, local content arrays, image
imports, scroll behavior, and the home-only header/footer in one file. This
makes it hard to reuse the documented `DESIGN.md` system on `/loja`,
`/assinatura`, `/faq`, cart, checkout, and confirmation pages without copying
classes by hand.

After this plan lands, the landing page should become a route that composes
shared design primitives and route-specific sections. The reusable paper-first
dossier system from `DESIGN.md` should be available to the rest of the Front
Office, and the existing dark, cinematic page surfaces should be replaced with
the documented paper/card/ink design language.

## Current state

Relevant files and roles:

- `src/app/(front-office)/landing.tsx` — home implementation; currently a
  1762-line Client Component containing the landing shell, tokens, header,
  footer, FAB, data arrays, and all sections.
- `src/app/(front-office)/page.tsx` — root route; imports fonts and renders
  `Landing`.
- `src/app/(front-office)/layout.tsx` — public route-group layout; currently
  hides global header/footer on `/` via `ConditionalLayoutWrapper`.
- `src/components/layout/conditional-layout-wrapper.tsx` — client wrapper that
  returns `fallback` when `pathname === '/'`.
- `src/components/layout/public-header-content.tsx` and
  `src/components/layout/public-footer.tsx` — current global public shell for
  non-home pages; their styling is not the same shell as the landing.
- `src/app/(front-office)/loja/page.tsx`,
  `src/app/(front-office)/loja/[slug]/page.tsx`,
  `src/app/(front-office)/assinatura/page.tsx`,
  `src/app/(front-office)/faq/page.tsx`,
  `src/app/(front-office)/carrinho/page.tsx`,
  `src/app/(front-office)/checkout/page.tsx`, and
  `src/app/(front-office)/checkout/confirmacao/page.tsx` — pages that must
  move from the older dark style to the documented landing design system.
- `DESIGN.md` — source of truth for the visual system.
- `PRODUCT.md` — product direction; confirms the visual identity must be
  premium, investigative, paper-first, and not dark by default.

Current landing excerpts to verify before editing:

```tsx
// src/app/(front-office)/landing.tsx:1-2
'use client'

// src/app/(front-office)/landing.tsx:54-72
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

// src/app/(front-office)/landing.tsx:283-349
export function Landing({ fontClassName }: SuggestedLandingProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showFab, setShowFab] = useState(false)
  const [jsReady, setJsReady] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  // ...
  return (
    <JsReadyContext.Provider value={jsReady}>
      <div
        className={`relative z-0 min-h-svh overflow-x-clip bg-(--paper) ... ${fontClassName}`}
        style={tokens}
      >
```

Current layout excerpt:

```tsx
// src/app/(front-office)/layout.tsx:10-20
return (
  <div className="flex min-h-svh flex-col bg-[#f4f1ec] text-[#211c18] dark:bg-[#090807] dark:text-[#fffaf0]">
    <ConditionalLayoutWrapper>
      <PublicHeader />
    </ConditionalLayoutWrapper>
    <main className="flex-1">{children}</main>
    <ConditionalLayoutWrapper>
      <PublicFooter />
      <FloatingActionButton />
    </ConditionalLayoutWrapper>
    <CookieConsentBanner />
  </div>
)
```

Current non-home styling example that must be replaced:

```tsx
// src/app/(front-office)/loja/page.tsx:39-52
return (
  <div className="bg-[#090807] text-[#fffaf0]">
    <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#090807]">
      <Image
        src={previousBoxesBanner}
        alt=""
        fill
        priority
        placeholder="blur"
```

Documented design constraints to honor:

- `DESIGN.md` defines the creative north star as "O Quadro de Evidências" and
  says the surface is "papel envelhecido sob luz do dia, não escuridão
  cinematográfica."
- `DESIGN.md` states the Paper-First Rule: default surface is `paper`
  `#ede4dd`, cards use `card` `#fbf9f6`, and pure white/cold gray surfaces are
  prohibited.
- `DESIGN.md` assigns the four accent roles: red = action/evidence, yellow =
  alert/highlight, teal = catalog/status, purple = community/exclusivity.
- `DESIGN.md` says `Special Elite` is reserved for archive metadata such as
  eyebrows, labels, badges, tags, and reference codes.
- `PRODUCT.md` says the brand should feel "reservada, investigativa e
  premium" and explicitly avoid dark default visuals, cold palettes, generic
  e-commerce, police caricature, and graphic horror.

Next.js conventions to follow:

- The repo uses Next.js `16.2.6`. Before changing route structure, read the
  local docs under `node_modules/next/dist/docs/`.
- The local project-structure docs say route groups like
  `app/(marketing)/page.tsx` do not change URLs, and private folders like
  `_folder` can colocate non-routable UI utilities.
- The local Server/Client Component docs say pages and layouts are Server
  Components by default; use Client Components only for state, event handlers,
  effects, browser APIs, or custom hooks.
- The local metadata docs show `params` and `searchParams` as Promises and
  recommend `generateMetadata` when metadata depends on fetched data.

## Commands you will need

| Purpose | Command | Expected on success |
| --- | --- | --- |
| Install | `pnpm install` | exit 0 |
| Typecheck | `pnpm typecheck` | exit 0, no errors |
| Lint | `pnpm lint` | exit 0 |
| Build | `pnpm build` | exit 0, no errors |
| Dev server | `pnpm dev` | starts local Next.js server |

There is no `test` script in `package.json` at the time this plan was written.
Do not add a test framework in this plan unless the operator explicitly asks.

## Suggested executor toolkit

- If available, use the `frontend-design` or `impeccable` skill while rewriting
  page visuals. The target is not novelty; the target is faithful application
  of `DESIGN.md` across existing workflows.
- Read these local Next.js docs before editing:
  - `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`

## Scope

**In scope** (the only source files you should modify or create):

- `src/app/globals.css`
- `src/app/(front-office)/page.tsx`
- `src/app/(front-office)/landing.tsx`
- `src/app/(front-office)/layout.tsx`
- `src/app/(front-office)/loja/page.tsx`
- `src/app/(front-office)/loja/[slug]/page.tsx`
- `src/app/(front-office)/assinatura/page.tsx`
- `src/app/(front-office)/faq/page.tsx`
- `src/app/(front-office)/carrinho/page.tsx`
- `src/app/(front-office)/checkout/page.tsx`
- `src/app/(front-office)/checkout/confirmacao/page.tsx`
- `src/components/layout/conditional-layout-wrapper.tsx`
- `src/components/layout/public-header.tsx`
- `src/components/layout/public-header-content.tsx`
- `src/components/layout/public-footer.tsx`
- `src/components/layout/floating-action-button.tsx`
- `src/components/shop/shop-catalog.tsx`
- `src/components/shop/product-detail-gallery.tsx`
- `src/components/shop/product-detail-included-preview.tsx`
- `src/components/shop/product-detail-pricing.tsx`
- `src/components/shop/related-product-card.tsx`
- `src/components/ui/product-quick-view.tsx`
- New files under `src/components/public-design/`
- New files under `src/app/(front-office)/_landing/`
- New files under `src/lib/design/`
- `plans/README.md`

**Out of scope** (do NOT touch, even though they look related):

- `src/app/(cliente)/**` — customer area migration should be a follow-up plan.
- `src/app/(auth)/**` — auth screens should be a follow-up plan after the
  public shell settles.
- `src/app/(design-sugerido)/**` — historical design preview/archive.
- `src/lib/domain/**`, `src/lib/server/**`, and `src/app/api/**` — data/API
  work belongs to Plan 004 or a separate backend integration plan.
- `docs/front-office-api-contracts.md` and `docs/openapi.yaml` — API contracts
  are not part of this visual extraction.
- Adding a CMS, database, auth provider, payment gateway, or upload pipeline.
- Rewriting business logic, cart totals, checkout step state, or product data
  shapes.

## Git workflow

- Branch: `advisor/005-separate-landing-design-system`
- Commit message style: use Conventional Commits, matching existing history
  such as `feat: new layout to plans page + add v1 design copy to suggested design folder`.
- Do not push or open a PR unless the operator instructed it.
- Do not run Plan 004 concurrently with this plan. Both plans touch Front
  Office pages; running them at the same time will create avoidable conflicts.

## Steps

### Step 1: Extract design tokens and tiny primitives from the landing

Create a shared design layer without changing page behavior yet.

Recommended files:

- `src/lib/design/tokens.ts`
- `src/lib/design/classes.ts`
- `src/components/public-design/design-page-shell.tsx`
- `src/components/public-design/design-overlays.tsx`
- `src/components/public-design/section-eyebrow.tsx`
- `src/components/public-design/dossier-card.tsx`
- `src/components/public-design/design-button.tsx`

Move the `tokens`, `grainNoiseUrl`, `sectionFrame`, font-class helpers, CTA
classes, transition classes, card shadow strings, and small visual atoms from
`landing.tsx` into these shared files. Keep them semantically named after
`DESIGN.md`, for example `designTokens`, `grainNoiseBackground`,
`sectionFrameClass`, `paperPageClass`, `warmShadowClass`, and
`accentByRole`.

Also add global CSS variables in `src/app/globals.css` under `:root` for:

- `--paper`, `--paper-soft`, `--card`, `--ink`, `--ink-soft`, `--ink-mute`
- `--red`, `--red-deep`, `--yellow`, `--amber`, `--teal`, `--teal-deep`
- `--purple`, `--purple-deep`, `--night`, `--night-soft`, `--cream`
- `--design-font-body`, `--design-font-heading`, `--design-font-mono`

Do not remove the current shadcn variables. Add these design variables
alongside them so existing components continue to compile.

**Verify**: `pnpm typecheck` → exit 0, no TypeScript errors.

### Step 2: Move landing-only code into a private route folder

Create `src/app/(front-office)/_landing/` for landing-specific, non-routable
files. Use the local Next.js private-folder convention; `_landing` must not
create a public route.

Recommended split:

- `src/app/(front-office)/_landing/landing.tsx` — the top-level landing
  component that composes sections.
- `src/app/(front-office)/_landing/landing-client-chrome.tsx` — the smallest
  possible Client Component for menu state, body overflow lock, scroll/FAB
  visibility, and JS-ready context.
- `src/app/(front-office)/_landing/content.ts` — route-local arrays such as
  promo items, ribbon items, testimonials, archive boxes, and featured logos.
- `src/app/(front-office)/_landing/sections/*.tsx` — hero, club intro,
  featured logos, box contents, how it works, testimonials, plan cards,
  standalone edition, archive band, and final CTA.

Update `src/app/(front-office)/page.tsx` to import from
`./_landing/landing`. Leave URL `/` unchanged.

Keep `src/app/(front-office)/landing.tsx` only temporarily as a compatibility
shim during the move if needed. By the end of this step, either delete it or
make it a tiny re-export:

```tsx
export { Landing } from './_landing/landing'
```

Do not change copy, images, animation timing, links, or visual output in this
step. This is a structural separation.

**Verify**:

- `pnpm typecheck` → exit 0.
- `find src/app/'(front-office)'/_landing -maxdepth 3 -type f | sort` shows
  the new landing files.
- `wc -l src/app/'(front-office)'/landing.tsx` is under 20 lines if the file
  still exists.

### Step 3: Promote the landing header/footer/FAB into the shared public shell

Replace the two-shell setup with one design-system shell.

Current behavior hides `PublicHeader`, `PublicFooter`, and
`FloatingActionButton` on `/` via `ConditionalLayoutWrapper`, while the landing
renders `SuggestedHeader`, `SuggestedFooter`, and `SuggestedFab` internally.
This creates two competing public shells.

Target behavior:

- `src/app/(front-office)/layout.tsx` renders the shared public header/footer
  for all public Front Office routes, including `/`.
- `src/components/layout/public-header-content.tsx` is restyled to match the
  landing `SuggestedHeader`: paper background, dashed bottom border,
  Special-Elite/mono-style labels, red/paper CTAs, mobile fullscreen drawer,
  cart badge, and body scroll lock.
- `src/components/layout/public-footer.tsx` is restyled to the paper-first
  dossier/footer language from `DESIGN.md`; keep existing link destinations.
- `src/components/layout/floating-action-button.tsx` adopts the landing FAB
  styling and appears only when appropriate. If it currently has route-specific
  behavior, preserve it.
- `ConditionalLayoutWrapper` should be deleted or reduced to no-op only if no
  imports remain. Do not leave a home-only shell exception.

Remove `SuggestedHeader`, `SuggestedFooter`, and `SuggestedFab` from the
landing private files after the shared shell replaces them.

**Verify**:

- `rg -n "ConditionalLayoutWrapper|SuggestedHeader|SuggestedFooter|SuggestedFab" src/app src/components`
  returns no matches, unless `ConditionalLayoutWrapper` remains as an unused
  compatibility export with no imports.
- `pnpm typecheck` → exit 0.

### Step 4: Convert public page surfaces to the paper-first system

Use the primitives from Step 1 to migrate the public Front Office pages away
from the dark default. Keep data fetching, route behavior, forms, server
actions, redirects, SEO, JSON-LD, cart totals, and checkout state as-is.

Pages to migrate:

- `/loja` in `src/app/(front-office)/loja/page.tsx`
- `/loja/[slug]` in `src/app/(front-office)/loja/[slug]/page.tsx`
- `/assinatura` in `src/app/(front-office)/assinatura/page.tsx`
- `/faq` in `src/app/(front-office)/faq/page.tsx`
- `/carrinho` in `src/app/(front-office)/carrinho/page.tsx`
- `/checkout` in `src/app/(front-office)/checkout/page.tsx`
- `/checkout/confirmacao` in
  `src/app/(front-office)/checkout/confirmacao/page.tsx`

Migration requirements:

- Default page background is `paper`, not `#090807`.
- Use `card` surfaces for panels, product cards, cart items, checkout summary,
  FAQ details, and confirmation panels.
- Use `night` only for hero/image bands or short inverted sections.
- Replace cold/dark shadows with warm shadows based on `rgba(33,28,24,...)`.
- Every public section has a `SectionEyebrow` with a short code/label, matching
  `DESIGN.md`.
- Preserve all current content, data reads, links, button destinations, and
  server actions.
- Preserve `noindex` metadata for cart, checkout, and confirmation.
- Preserve `ProductJsonLd`, `Breadcrumbs`, and `FAQPage` JSON-LD.
- Respect `prefers-reduced-motion` for any new animation; do not add motion to
  cart/checkout where it slows the transaction.

This step may touch shop and UI components used by these pages:

- `src/components/shop/shop-catalog.tsx`
- `src/components/shop/product-detail-gallery.tsx`
- `src/components/shop/product-detail-included-preview.tsx`
- `src/components/shop/product-detail-pricing.tsx`
- `src/components/shop/related-product-card.tsx`
- `src/components/ui/product-quick-view.tsx`

Keep component APIs stable unless all callers are updated in the same step.

**Verify**:

- `rg -n "bg-\\[#090807\\]|bg-\\[#0b0908\\]|text-\\[#fffaf0\\]|rgba\\(0,0,0" src/app/'(front-office)' src/components/shop src/components/ui/product-quick-view.tsx`
  returns no matches in the migrated page/component files except intentional
  `night` image overlays or documented pin inset shadows.
- `pnpm typecheck` → exit 0.

### Step 5: Keep the landing visually identical while using shared primitives

Refactor the landing sections to consume shared primitives from
`src/components/public-design/` without changing the landing's visual contract.

Required checks:

- Landing route still starts at `/`.
- Hero still has the same image, message, CTA destinations, marquee,
  archive/product sections, and final CTA.
- Shared shell appears once. There must not be a duplicate header/footer on `/`.
- The landing should no longer contain the only copy of design tokens,
  `grainNoiseUrl`, `SectionEyebrow`, dossier card styling, or FAB styling.

**Verify**:

- `rg -n "const tokens|grainNoiseUrl|function SuggestedHeader|function SuggestedFooter|function SuggestedFab" src/app/'(front-office)'/_landing src/app/'(front-office)'/landing.tsx`
  returns no matches.
- `pnpm typecheck` → exit 0.

### Step 6: Run final verification and update the plan index

Run the full static verification suite.

**Verify**:

- `pnpm lint` → exit 0.
- `pnpm typecheck` → exit 0.
- `pnpm build` → exit 0.
- `git status --short` shows only in-scope source files and `plans/README.md`.

Then update the Plan 005 row in `plans/README.md` from `TODO` to `DONE` or
`BLOCKED (reason)`.

## Test plan

No automated test framework exists in `package.json`. Use static checks and a
manual browser smoke test.

Manual smoke test after `pnpm dev` starts:

- Visit `/`: one public header, one footer, no duplicate shell, landing content
  intact, mobile menu opens/closes, FAB behavior still makes sense.
- Visit `/loja`: page uses paper/card design; product catalog renders; featured
  product links to a detail page.
- Visit `/loja/tcc-caixa-03-avulsa`: gallery, pricing, included items,
  related products, breadcrumbs, and add-to-cart actions still render.
- Visit `/assinatura`: plan cards render and checkout links keep their current
  destinations.
- Visit `/faq`: FAQ details open/close and JSON-LD remains rendered through
  the existing `JsonLd` component.
- Visit `/carrinho`, `/checkout`, and `/checkout/confirmacao`: transactional
  flows are legible, no dark-theme-only text remains, server actions still
  submit, and no text overlaps on mobile.

## Done criteria

All must hold:

- [ ] `src/app/(front-office)/landing.tsx` is deleted or is only a tiny
      re-export to `src/app/(front-office)/_landing/landing.tsx`.
- [ ] Shared design primitives exist under `src/components/public-design/`.
- [ ] Shared design constants exist under `src/lib/design/`.
- [ ] `src/app/(front-office)/layout.tsx` uses one shared public shell for all
      public routes; home is no longer a special shell exception.
- [ ] Public pages in scope use the `DESIGN.md` paper/card/ink system instead
      of the old dark default.
- [ ] Product, cart, checkout, FAQ, SEO, sitemap, JSON-LD, and server actions
      preserve their existing behavior.
- [ ] `pnpm lint` exits 0.
- [ ] `pnpm typecheck` exits 0.
- [ ] `pnpm build` exits 0.
- [ ] `git status --short` shows no modified files outside Scope.
- [ ] `plans/README.md` status row updated.

## STOP conditions

Stop and report back instead of improvising if:

- The code at the locations in "Current state" does not match the excerpts.
- The required migration appears to need changes under `src/lib/domain/**`,
  `src/lib/server/**`, `src/app/api/**`, `src/app/(cliente)/**`, or
  `src/app/(auth)/**`.
- The landing cannot be moved into `_landing` without changing the `/` URL.
- The shared header/footer introduces duplicate shell UI on `/`.
- A build or typecheck failure requires changing business logic or data shapes.
- You find Plan 004 has already been executed and its changes conflict with
  this plan's current-state assumptions; stop and ask for this plan to be
  refreshed.

## Maintenance notes

- Plan 004 touches several of the same pages for API integration. If this plan
  lands first, refresh Plan 004 before execution so it preserves the new
  public design primitives instead of reintroducing old dark page structures.
- Customer-area and auth pages are intentionally deferred. They should get
  their own follow-up plans after the public design system stabilizes.
- Reviewers should scrutinize that the extraction did not create a generic
  component library detached from `DESIGN.md`. The value is in preserving the
  evidence-board language while reducing duplication.
- Future CMS work should target the content arrays moved into
  `src/app/(front-office)/_landing/content.ts` and page-level copy, not
  route-local JSX scattered across pages.
