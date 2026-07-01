import type { CSSProperties } from 'react'

/** Design tokens from DESIGN.md — paper-first dossier system. */
export const designTokens = {
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

/** Noise overlay used as a subtle film-grain texture over the whole page. */
export const grainNoiseUrl =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Four-Wire Rule accent roles from DESIGN.md. */
export const accentByRole = {
  action: '#c5271f',
  alert: '#efbc18',
  catalog: '#1aa587',
  community: '#5e5ea2',
} as const
