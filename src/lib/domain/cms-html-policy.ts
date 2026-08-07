/**
 * Política de HTML do CMS — manter em paridade com
 * mvp-betalabs-frontend/src/lib/cms/html-policy.ts até existir pacote compartilhado.
 */
import DOMPurify, { type Config } from 'isomorphic-dompurify'

type SanitizeElementHookEvent = {
  tagName?: string
}

type SanitizeAttributeHookEvent = {
  attrName?: string
  attrValue?: string
  keepAttr?: boolean
}

type DOMPurifyHookable = {
  addHook(
    entryPoint: 'uponSanitizeElement',
    hook: (node: Element, data: SanitizeElementHookEvent) => void,
  ): void
  addHook(
    entryPoint: 'uponSanitizeAttribute',
    hook: (node: Element, data: SanitizeAttributeHookEvent) => void,
  ): void
  removeHook(
    entryPoint: 'uponSanitizeElement',
    hook: (node: Element, data: SanitizeElementHookEvent) => void,
  ): void
  removeHook(
    entryPoint: 'uponSanitizeAttribute',
    hook: (node: Element, data: SanitizeAttributeHookEvent) => void,
  ): void
  sanitize(source: string, config?: Config): string
}

const purify = DOMPurify as typeof DOMPurify & DOMPurifyHookable

export const CMS_HTML_POLICY_VERSION = 1

export type CmsHtmlRiskCategory =
  | 'forbidden-element'
  | 'forbidden-attribute'
  | 'unsafe-url'
  | 'link-normalization'

export type CmsHtmlInspection = {
  policyVersion: typeof CMS_HTML_POLICY_VERSION
  sanitizedHtml: string
  changed: boolean
  riskCategories: CmsHtmlRiskCategory[]
  removedElementCount: number
  removedAttributeCount: number
}

const ALLOWED_TAGS = [
  'p',
  'h2',
  'h3',
  'h4',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'br',
  'hr',
  'code',
  'pre',
] as const

const ALLOWED_ATTR = ['href', 'target', 'rel'] as const

const ALLOWED_TAG_SET = new Set<string>(ALLOWED_TAGS)

/** Nós internos do DOMPurify/DOM — não são conteúdo editorial removido. */
const IGNORED_SANITIZE_TAGS = new Set([
  '#text',
  '#comment',
  '#document',
  '#document-fragment',
  'html',
  'head',
  'body',
])

const SANITIZE_CONFIG: Config = {
  ALLOWED_TAGS: [...ALLOWED_TAGS],
  ALLOWED_ATTR: [...ALLOWED_ATTR],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
}

type SanitizeStats = {
  removedElementCount: number
  removedAttributeCount: number
  riskCategories: Set<CmsHtmlRiskCategory>
}

function decodeHtmlEntities(value: string): string {
  if (typeof document === 'undefined') {
    return value
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      )
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
  }

  const textarea = document.createElement('textarea')
  textarea.innerHTML = value
  return textarea.value
}

function collapseUrlWhitespace(value: string): string {
  return value.replace(/\s+/g, '')
}

function isUnsafeUrl(href: string): boolean {
  const decoded = decodeHtmlEntities(href).trim()
  const collapsed = collapseUrlWhitespace(decoded).toLowerCase()

  if (/^javascript:/i.test(collapsed)) {
    return true
  }

  if (/^data:/i.test(collapsed)) {
    return true
  }

  if (/^\s*java\s*script\s*:/i.test(decoded)) {
    return true
  }

  if (/^\s*data\s*:/i.test(decoded)) {
    return true
  }

  return false
}

function isAllowedHref(href: string): boolean {
  if (isUnsafeUrl(href)) {
    return false
  }

  const decoded = decodeHtmlEntities(href).trim()
  const lower = decoded.toLowerCase()

  if (lower.startsWith('mailto:')) {
    return true
  }

  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    return true
  }

  if (
    lower.startsWith('/') ||
    lower.startsWith('./') ||
    lower.startsWith('../') ||
    lower.startsWith('#')
  ) {
    return true
  }

  return false
}

function normalizeExternalLinks(html: string, stats: SanitizeStats): string {
  if (typeof DOMParser === 'undefined') {
    return html
  }

  const doc = new DOMParser().parseFromString(html, 'text/html')

  for (const anchor of doc.body.querySelectorAll(
    "a[target='_blank'], a[target='_BLANK']",
  )) {
    const rel = anchor.getAttribute('rel') ?? ''
    const parts = new Set(rel.split(/\s+/).filter(Boolean))
    const required = ['noopener', 'noreferrer']
    let changed = false

    for (const token of required) {
      if (!parts.has(token)) {
        parts.add(token)
        changed = true
      }
    }

    if (changed) {
      anchor.setAttribute('rel', Array.from(parts).join(' '))
      stats.riskCategories.add('link-normalization')
    }
  }

  return doc.body.innerHTML
}

function sanitizeWithStats(source: string): {
  html: string
  stats: SanitizeStats
} {
  const stats: SanitizeStats = {
    removedElementCount: 0,
    removedAttributeCount: 0,
    riskCategories: new Set(),
  }

  const onSanitizeElement = (node: Element, data: SanitizeElementHookEvent) => {
    const tag = data.tagName?.toLowerCase()
    if (!tag || ALLOWED_TAG_SET.has(tag) || IGNORED_SANITIZE_TAGS.has(tag)) {
      return
    }

    // Conta apenas elementos HTML reais removidos da marcação editorial.
    if (node.nodeType === 1 && node.parentNode) {
      stats.removedElementCount += 1
      stats.riskCategories.add('forbidden-element')
    }
  }

  const onSanitizeAttribute = (
    _node: Element,
    data: SanitizeAttributeHookEvent,
  ) => {
    const attr = data.attrName?.toLowerCase()
    if (!attr) {
      return
    }

    if (attr.startsWith('on')) {
      stats.removedAttributeCount += 1
      stats.riskCategories.add('forbidden-attribute')
      data.keepAttr = false
      return
    }

    if (attr === 'style') {
      stats.removedAttributeCount += 1
      stats.riskCategories.add('forbidden-attribute')
      data.keepAttr = false
      return
    }

    if (attr === 'href' && typeof data.attrValue === 'string') {
      if (isUnsafeUrl(data.attrValue) || !isAllowedHref(data.attrValue)) {
        stats.removedAttributeCount += 1
        stats.riskCategories.add('unsafe-url')
        data.keepAttr = false
      }
    }
  }

  purify.addHook('uponSanitizeElement', onSanitizeElement)
  purify.addHook('uponSanitizeAttribute', onSanitizeAttribute)

  let html = purify.sanitize(source, SANITIZE_CONFIG)

  purify.removeHook('uponSanitizeElement', onSanitizeElement)
  purify.removeHook('uponSanitizeAttribute', onSanitizeAttribute)

  html = normalizeExternalLinks(html, stats)

  return { html, stats }
}

export function sanitizeCmsHtml(source: string): string {
  return sanitizeWithStats(source).html
}

export function inspectCmsHtml(source: string): CmsHtmlInspection {
  const { html, stats } = sanitizeWithStats(source)

  return {
    policyVersion: CMS_HTML_POLICY_VERSION,
    sanitizedHtml: html,
    changed: html !== source,
    riskCategories: Array.from(stats.riskCategories),
    removedElementCount: stats.removedElementCount,
    removedAttributeCount: stats.removedAttributeCount,
  }
}

export function isCmsHtmlPublishable(source: string): boolean {
  return !inspectCmsHtml(source).changed
}
