/**
 * Política de HTML do CMS — manter em paridade com
 * mvp-betalabs-frontend/src/lib/cms/html-policy.ts até existir pacote compartilhado.
 *
 * isomorphic-dompurify + jsdom@25 (override) para compatibilidade com Node 20:
 * jsdom@30+ / undici@8 exigem Node 22+ (markAsUncloneable).
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
  removeHook(entryPoint: 'uponSanitizeElement'): void
  removeHook(entryPoint: 'uponSanitizeAttribute'): void
  sanitize(source: string, config?: Config): string
}

const purify = DOMPurify as typeof DOMPurify & DOMPurifyHookable

export const CMS_HTML_POLICY_VERSION = 1

export type CmsHtmlRiskCategory =
  | 'forbidden-element'
  | 'forbidden-attribute'
  | 'unsafe-url'
  | 'link-normalization'
  | 'element-remap'

export type CmsHtmlTagRemap = {
  from: string
  to: string
}

export type CmsHtmlInspection = {
  policyVersion: typeof CMS_HTML_POLICY_VERSION
  sanitizedHtml: string
  changed: boolean
  riskCategories: CmsHtmlRiskCategory[]
  removedElementCount: number
  removedAttributeCount: number
  /** Tags HTML proibidas que seriam removidas (ex.: ["script"]). */
  removedElementTags: string[]
  /** Atributos proibidos/inseguros que seriam removidos (ex.: ["onclick", "style"]). */
  removedAttributeNames: string[]
  /** Tags convertidas para equivalentes permitidos (ex.: h1 → h2). */
  remappedElementTags: CmsHtmlTagRemap[]
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

/** Conversões editoriais seguras antes da remoção (título máximo permitido é h2). */
const TAG_REMAP: Record<string, string> = {
  h1: 'h2',
}

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
  removedElementTags: Set<string>
  removedAttributeNames: Set<string>
  remappedElementTags: Map<string, string>
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

function normalizeBlankTargetRel(node: Element, stats: SanitizeStats): void {
  const target = node.getAttribute('target')?.toLowerCase()
  if (target !== '_blank') {
    return
  }

  const rel = node.getAttribute('rel') ?? ''
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
    node.setAttribute('rel', Array.from(parts).join(' '))
    stats.riskCategories.add('link-normalization')
  }
}

function sanitizeWithStats(source: string): {
  html: string
  stats: SanitizeStats
} {
  const stats: SanitizeStats = {
    removedElementCount: 0,
    removedAttributeCount: 0,
    removedElementTags: new Set(),
    removedAttributeNames: new Set(),
    remappedElementTags: new Map(),
    riskCategories: new Set(),
  }

  const onSanitizeElement = (node: Element, data: SanitizeElementHookEvent) => {
    const tag = data.tagName?.toLowerCase()
    if (!tag || IGNORED_SANITIZE_TAGS.has(tag)) {
      return
    }

    const remappedTo = TAG_REMAP[tag]
    if (
      remappedTo &&
      node.nodeType === 1 &&
      node.parentNode &&
      node.ownerDocument
    ) {
      const replacement = node.ownerDocument.createElement(remappedTo)
      while (node.firstChild) {
        replacement.appendChild(node.firstChild)
      }
      node.parentNode.replaceChild(replacement, node)
      stats.remappedElementTags.set(tag, remappedTo)
      stats.riskCategories.add('element-remap')
      return
    }

    if (!ALLOWED_TAG_SET.has(tag)) {
      // Conta apenas elementos HTML reais removidos da marcação editorial.
      if (node.nodeType === 1 && node.parentNode) {
        stats.removedElementCount += 1
        stats.removedElementTags.add(tag)
        stats.riskCategories.add('forbidden-element')
      }
      return
    }

    if (tag === 'a' && node.nodeType === 1) {
      normalizeBlankTargetRel(node, stats)
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
      stats.removedAttributeNames.add(attr)
      stats.riskCategories.add('forbidden-attribute')
      data.keepAttr = false
      return
    }

    if (attr === 'style') {
      stats.removedAttributeCount += 1
      stats.removedAttributeNames.add(attr)
      stats.riskCategories.add('forbidden-attribute')
      data.keepAttr = false
      return
    }

    if (attr === 'href' && typeof data.attrValue === 'string') {
      if (isUnsafeUrl(data.attrValue) || !isAllowedHref(data.attrValue)) {
        stats.removedAttributeCount += 1
        stats.removedAttributeNames.add(attr)
        stats.riskCategories.add('unsafe-url')
        data.keepAttr = false
      }
    }
  }

  purify.addHook('uponSanitizeElement', onSanitizeElement)
  purify.addHook('uponSanitizeAttribute', onSanitizeAttribute)

  const html = purify.sanitize(source, SANITIZE_CONFIG)

  purify.removeHook('uponSanitizeElement')
  purify.removeHook('uponSanitizeAttribute')

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
    removedElementTags: Array.from(stats.removedElementTags).sort(),
    removedAttributeNames: Array.from(stats.removedAttributeNames).sort(),
    remappedElementTags: Array.from(stats.remappedElementTags.entries())
      .map(([from, to]) => ({ from, to }))
      .sort((a, b) => a.from.localeCompare(b.from)),
  }
}

export function isCmsHtmlPublishable(source: string): boolean {
  return !inspectCmsHtml(source).changed
}
