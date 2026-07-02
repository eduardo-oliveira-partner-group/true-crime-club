---
name: apply-true-crime-design
description: Apply the TrueCrime.Club front-office visual system from src/app/(front-office)/_landing to other application pages and sections. Use when Codex is asked to redesign, restyle, polish, migrate, or build pages so they match the landing design, including paper-first surfaces, dossier cards, investigative section rhythm, tokens, rounded corners, colors, spacing, motion, and reusable public-design components. Always pair with the local $impeccable skill for frontend craft and QA.
---

# Apply True Crime Design

## Overview

Apply the current TrueCrime.Club public design system to pages without drifting into a new aesthetic. Treat `src/app/(front-office)/_landing` as the source of truth for brand, components, spacing, color roles, and interaction polish.

## Required Workflow

1. Load and follow `$impeccable` first. Run its setup for the target path, read the required register reference, and use its QA expectations before editing UI.
2. Read the local Next.js guide in `node_modules/next/dist/docs/` before changing Next.js code, because this project warns that its Next.js version has breaking changes.
3. Inspect the target page and at least these design sources before editing:
   - `DESIGN.md`
   - `src/app/(front-office)/_landing/`
   - `src/lib/design/classes.ts`
   - `src/lib/design/tokens.ts`
   - `src/components/public-design/`
4. Treat `DESIGN.md` as the canonical design reference. Use it instead of maintaining a second landing-system reference.
5. Use `_landing` and the public-design helpers as implementation examples for `DESIGN.md`: `landing.tsx` for section composition, `sections/*.tsx` for concrete patterns, `DesignPageShell` for the paper shell, `SectionEyebrow` for section labels, and `src/lib/design/classes.ts` for reusable class strings.
6. Reuse existing design helpers and components before adding new ones. Prefer imports from `src/lib/design/classes`, `src/lib/design/tokens`, and `src/components/public-design`.
7. Implement the requested page end to end, then verify responsive behavior, contrast-sensitive text, motion reduction, and visual consistency with the landing.

## Design Application Rules

- Preserve the physical scene: a premium investigation dossier on warm paper under daylight. Do not turn pages into generic ecommerce, horror, police cosplay, or dark cinematic UI.
- Use `DesignPageShell` for public pages that should inherit the paper background, tokens, texture, and font context.
- Use the paper/card/night token vocabulary. Default public and commercial sections to `paper`, `paper-soft`, and `card`; reserve `night` for footers, strict media overlays, or rare inverted moments. Avoid pure white, cold gray, default dark mode, glass cards, gradient text, thick side stripes, and over-rounded cards.
- Do not use dark backgrounds for store heroes, catalog sections, product detail pages, product quick views, modals, drawers, checkout surfaces, or any commercial action panel unless the user explicitly asks for an inverted variant.
- Do not use images, radial gradients, atmospheric gradients, decorative grids, or wallpaper effects as section backgrounds. Product or editorial imagery belongs inside cards, galleries, media blocks, or actual product image areas.
- Apply rounded corners to every visible bordered UI element. Avoid `rounded-none`, `border-radius: 0`, and square bordered controls in public pages; use 2px for archive labels, 9-10px for buttons/inputs/badges/icon boxes, and 14-16px for cards and panels.
- Avoid serif fonts in the public front office. Do not rely on global `font-heading` when it can resolve to a serif legacy font; use `fontHeading`, `var(--design-font-heading)`, or other design helpers so headings, prices, CTAs, and product surfaces stay Archivo/system-ui sans.
- Keep cards physical and restrained: dossier surfaces, subtle asymmetry, warm shadows, tabs, pins, tape, dashed separators, and micro-rotation only when they serve the page.
- Follow the Four-Wire Rule: red = action/evidence, yellow = alert/highlight, teal = catalog/status, purple = community/exclusivity.
- Use `SectionEyebrow` for public marketing sections when it is part of the page rhythm, with meaningful section copy. Avoid generic repeated labels that do not communicate.
- Keep CTAs commercial and obvious. Suspense should never hide price, plan, delivery, account, checkout, or next action.
- Respect `prefers-reduced-motion`; content must be visible without JavaScript-triggered reveal classes.
- For portals, dialogs, quick views, sheets, and drawers rendered outside `DesignPageShell`, apply `designTokens` or an equivalent token scope directly to the portal wrapper so `--card`, `--paper`, `--ink`, and design fonts do not fall back to global dark/serif styles.

## Implementation Bias

When translating an existing page:

- Map each current section to a landing section archetype: hero, dossier intro, proof/featured-by, contents, process, testimonials, plans, archive, final CTA, or utility form.
- Replace local ad hoc colors/radii/shadows with design tokens and shared classes.
- Replace dark panels, section background images, decorative gradients, and square bordered controls with paper/card surfaces and rounded dossier controls.
- Replace serif-looking headings/prices caused by global `font-heading` with `fontHeading` or explicit `[font-family:var(--design-font-heading),system-ui,sans-serif]`.
- Keep page-specific content and IA intact unless the user asks for UX restructuring.
- Prefer a small set of reusable additions over duplicating long Tailwind class strings across many files.
- If the page is product or account UI rather than marketing, keep the same tokens but reduce art direction density. Design serves task completion there.

## Done Criteria

- The target page visibly belongs to the same system as `_landing`.
- Shared tokens/classes/components are used where available.
- Mobile, tablet, and desktop layouts do not overlap or overflow.
- Text contrast is acceptable on paper, card, colored, and night surfaces.
- Motion has reduced-motion alternatives.
- No section-level background images, atmospheric gradients, decorative grids, or default dark commercial panels remain.
- No public-front-office headings, prices, CTAs, product cards, or quick views use serif fonts.
- No visible bordered UI element uses square corners or `rounded-none`.
- Portals/dialogs/quick views use design tokens explicitly when they are rendered outside `DesignPageShell`.
- No absolute-ban patterns from `$impeccable` or this skill are introduced.
