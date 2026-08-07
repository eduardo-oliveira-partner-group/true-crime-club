import { describe, expect, it } from 'vitest'

import {
  CMS_HTML_POLICY_VERSION,
  inspectCmsHtml,
  isCmsHtmlPublishable,
  sanitizeCmsHtml,
} from './cms-html-policy'

/** Fixtures compartilhadas com o backoffice — manter em paridade. */
export const CMS_HTML_SECURITY_FIXTURES = {
  benign: `<p>Texto <strong>negrito</strong> e <em>itálico</em></p>
<h2>Título</h2>
<ul><li>Item</li></ul>
<blockquote>Citação</blockquote>
<a href="/planos">Planos</a>
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Externo</a>
<code>snippet</code>
<pre>bloco</pre>`,
  scriptTag: `<p>Antes</p><script>alert(1)</script><p>Depois</p>`,
  scriptCase: `<p>Antes</p><ScRiPt>alert(1)</ScRiPt>`,
  nestedScript: `<div><p>Texto</p><script>evil()</script></div>`,
  onclick: `<p onclick="alert(1)">Clique</p>`,
  onerror: `<img src=x onerror="alert(1)">`,
  styleAttr: `<p style="color:red">Texto</p>`,
  iframe: `<iframe src="https://evil.com"></iframe>`,
  svg: `<svg onload="alert(1)"><circle r="1"/></svg>`,
  mathml: `<math><mi>x</mi></math>`,
  objectEmbed: `<object data="x"></object><embed src="x">`,
  javascriptUrl: `<a href="javascript:alert(1)">link</a>`,
  javascriptSpaced: `<a href="java script:alert(1)">link</a>`,
  javascriptEntity: `<a href="&#106;avascript:alert(1)">link</a>`,
  dataUrl: `<a href="data:text/html,<script>alert(1)</script>">link</a>`,
  relativeUrl: `<a href="/assinatura/planos">Planos</a>`,
  externalBlank: `<a href="https://example.com" target="_blank">Externo</a>`,
  dangerousSink: `<p>OK</p><script>document.body.dataset.pwned='1'</script>`,
} as const

const EXPECTED_POLICY_VERSION = 1

describe('cms-html-policy', () => {
  it('mantém a versão da política esperada', () => {
    expect(CMS_HTML_POLICY_VERSION).toBe(EXPECTED_POLICY_VERSION)
  })

  it('preserva elementos e atributos permitidos', () => {
    const sanitized = sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.benign)
    expect(sanitized).toContain('<strong>negrito</strong>')
    expect(sanitized).toContain('<a href="/planos">')
    expect(isCmsHtmlPublishable(CMS_HTML_SECURITY_FIXTURES.benign)).toBe(true)
  })

  it('remove script com variações de caixa e aninhamento', () => {
    for (const fixture of [
      CMS_HTML_SECURITY_FIXTURES.scriptTag,
      CMS_HTML_SECURITY_FIXTURES.scriptCase,
      CMS_HTML_SECURITY_FIXTURES.nestedScript,
    ]) {
      const sanitized = sanitizeCmsHtml(fixture)
      expect(sanitized.toLowerCase()).not.toContain('<script')
    }
  })

  it('remove atributos de evento como onclick e onerror', () => {
    expect(sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.onclick)).not.toContain(
      'onclick',
    )
    expect(
      sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.onerror).toLowerCase(),
    ).not.toContain('onerror')
  })

  it('remove style, iframe, SVG/MathML e object/embed', () => {
    expect(sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.styleAttr)).not.toContain(
      'style=',
    )
    expect(sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.iframe)).not.toContain(
      '<iframe',
    )
    expect(sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.svg)).not.toContain(
      '<svg',
    )
    expect(sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.mathml)).not.toContain(
      '<math',
    )
    const objectEmbed = sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.objectEmbed)
    expect(objectEmbed).not.toContain('<object')
    expect(objectEmbed).not.toContain('<embed')
  })

  it('rejeita javascript:, variantes com espaços/entidades e data:', () => {
    for (const fixture of [
      CMS_HTML_SECURITY_FIXTURES.javascriptUrl,
      CMS_HTML_SECURITY_FIXTURES.javascriptSpaced,
      CMS_HTML_SECURITY_FIXTURES.javascriptEntity,
      CMS_HTML_SECURITY_FIXTURES.dataUrl,
    ]) {
      expect(sanitizeCmsHtml(fixture)).not.toContain('href=')
      expect(inspectCmsHtml(fixture).changed).toBe(true)
    }
  })

  it('preserva URL relativa válida', () => {
    expect(sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.relativeUrl)).toContain(
      'href="/assinatura/planos"',
    )
  })

  it('normaliza link externo com target=_blank', () => {
    const sanitized = sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.externalBlank)
    expect(sanitized).toContain('rel="noopener noreferrer"')
  })

  it('é idempotente', () => {
    const once = sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.benign)
    expect(sanitizeCmsHtml(once)).toBe(once)
  })

  it('nunca entrega payload perigoso ao sink', () => {
    const sanitized = sanitizeCmsHtml(CMS_HTML_SECURITY_FIXTURES.dangerousSink)
    expect(sanitized.toLowerCase()).not.toContain('<script')
    expect(sanitized).not.toContain('pwned')
  })
})
