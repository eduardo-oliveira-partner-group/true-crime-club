import {
  IconBrandInstagram,
  // IconCircleCheck,
  // IconFingerprint,
  IconMail,
  IconPhone,
} from '@tabler/icons-react'
import Link from 'next/link'

import { BrandLogo } from '@/src/components/layout/brand-logo'
import { getDynamicContent } from '@/src/lib/domain/repositories'

const clubLinks = [
  { href: '/assinatura', label: 'Assinatura e planos' },
  { href: '/assinatura', label: 'Garantir minha vaga' },
  { href: '/faq', label: 'Dúvidas frequentes' },
]

const exploreLinks = [
  { href: '/loja', label: 'Loja completa' },
  { href: '/loja', label: 'Boxes avulsas' },
  { href: '/api-docs', label: 'Dossiê de API' },
  { href: '/cadastro', label: 'Criar conta' },
  { href: '/login', label: 'Entrar na conta' },
]

const designPreviewLinks = [
  {
    href: '/design-sugerido',
    version: 'v1',
    label: 'Proposta original',
    description: 'Layout base da landing page',
  },
  {
    href: '/design-sugerido-v2',
    version: 'v2',
    label: 'Proposta refinada',
    description: 'Hero animado e microinterações',
  },
  {
    href: '/design-sugerido-v3',
    version: 'v3',
    label: 'Dossiê de investigação',
    description: 'Tema de arquivo e pasta manila',
  },
]

const legalLinks = [
  { href: '/termos', label: 'Termos e condições' },
  { href: '/politica-de-privacidade', label: 'Política de privacidade' },
]

// const trustItems = [
//   'Primeiro clube do Brasil',
//   'Pistas mensais',
//   'Evento ao vivo com a comunidade',
//   'Cancelamento flexível',
// ]

function FooterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold tracking-[0.22em] text-[#8f6126] uppercase dark:text-[#d7b56d]">
        {title}
      </h3>
      {children}
    </div>
  )
}

export function PublicFooter() {
  // const heroBadge = getDynamicContent('home.hero.badge')
  const trustSupport = getDynamicContent('home.trust.support')

  return (
    <footer className="border-t border-[#211c18]/10 bg-[#f4f1ec] text-[#211c18] dark:border-[#fffaf0]/10 dark:bg-[#090807] dark:text-[#fffaf0]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <BrandLogo className="h-10" />
            </Link>

            {/* <div className="inline-flex max-w-full items-center gap-2 border border-[#d84132]/45 bg-[#2c1713]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#ffb0a5]">
              <IconFingerprint className="size-3.5 shrink-0" />
              <span>
                {heroBadge?.value ?? "Primeiro Clube de True Crime do Brasil"}
              </span>
            </div> */}

            <p className="max-w-sm text-sm/6 text-[#5f5147] dark:text-[#d7c9b5]">
              Caixa temática mensal com itens colecionáveis, pistas de um caso
              fictício anual e conteúdos exclusivos para quem vive true crime.
            </p>

            {/* <ul className="grid max-w-md gap-2 sm:grid-cols-2">
              {trustItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#e5d8c4]">
                  <IconCircleCheck className="mt-0.5 size-4 shrink-0 text-[#d84132]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul> */}
          </div>

          <FooterSection title="O clube">
            <ul className="space-y-2.5">
              {clubLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#5f5147] transition-colors hover:text-[#211c18] dark:text-[#d7c9b5] dark:hover:text-[#fffaf0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="Explore">
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#5f5147] transition-colors hover:text-[#211c18] dark:text-[#d7c9b5] dark:hover:text-[#fffaf0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="Contato">
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contato@truecrime.club"
                  className="inline-flex items-center gap-2 text-sm text-[#5f5147] transition-colors hover:text-[#211c18] dark:text-[#d7c9b5] dark:hover:text-[#fffaf0]"
                >
                  <IconMail className="size-4 shrink-0 text-[#b5332a] dark:text-[#d84132]" />
                  contato@truecrime.club
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5511960185171"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#5f5147] transition-colors hover:text-[#211c18] dark:text-[#d7c9b5] dark:hover:text-[#fffaf0]"
                >
                  <IconPhone className="size-4 shrink-0 text-[#b5332a] dark:text-[#d84132]" />
                  (11) 96018-5171
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/oficialtruecrime.club"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#5f5147] transition-colors hover:text-[#211c18] dark:text-[#d7c9b5] dark:hover:text-[#fffaf0]"
                >
                  <IconBrandInstagram className="size-4 shrink-0 text-[#b5332a] dark:text-[#d84132]" />
                  @oficialtruecrime.club
                </a>
              </li>
            </ul>
            <p className="text-xs/5 text-[#6e6055] dark:text-[#a89882]">
              {trustSupport?.value ??
                'Suporte humano de segunda a sexta, das 9h às 18h.'}
            </p>
          </FooterSection>
        </div>

        <div className="mt-4 border border-[#211c18]/10 bg-[#fffaf2]/70 p-5 sm:p-6 dark:border-[#fffaf0]/10 dark:bg-[#171211]/60">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#8f6126] uppercase dark:text-[#d7b56d]">
            Endereço
          </p>
          <address className="mt-2 space-y-0.5 text-sm/6 text-[#5f5147] not-italic dark:text-[#d7c9b5]">
            <p>Av. Tamboré, 287 - Tamboré,</p>
            <p>Barueri - SP, 06460-000, Torre Norte — 10º Andar</p>
          </address>
        </div>

        <div className="mt-10 border border-[#211c18]/10 bg-[#fffaf2]/70 p-5 sm:p-6 dark:border-[#fffaf0]/10 dark:bg-[#171211]/60">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#8f6126] uppercase dark:text-[#d7b56d]">
                Versões de Design
              </p>
              <p className="mt-1 max-w-xl text-xs/5 text-[#6e6055] dark:text-[#a89882]">
                Propostas de homepage para revisão e comparação.
              </p>
            </div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#76675b] uppercase dark:text-[#6f6458]">
              Pré-visualização interna
            </p>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {designPreviewLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex h-full flex-col gap-1 rounded-sm border border-[#211c18]/10 bg-[#f4f1ec]/80 px-4 py-3 transition-colors hover:border-[#9a662a]/35 hover:bg-[#fffaf2] dark:border-[#fffaf0]/10 dark:bg-[#090807]/70 dark:hover:border-[#d7b56d]/35 dark:hover:bg-[#090807]"
                >
                  <span className="flex items-center gap-2">
                    <span className="inline-flex min-w-7 items-center justify-center rounded-sm border border-[#9a662a]/30 bg-[#9a662a]/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-[#8f6126] uppercase dark:border-[#d7b56d]/30 dark:bg-[#d7b56d]/10 dark:text-[#d7b56d]">
                      {link.version}
                    </span>
                    <span className="text-sm font-medium text-[#211c18] transition-colors group-hover:text-[#8f6126] dark:text-[#fffaf0] dark:group-hover:text-[#d7b56d]">
                      {link.label}
                    </span>
                  </span>
                  <span className="text-xs/5 text-[#6e6055] dark:text-[#a89882]">
                    {link.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#211c18]/10 p-4 sm:px-6 dark:border-[#fffaf0]/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-xs text-[#6e6055] sm:flex-row sm:text-left dark:text-[#a89882]">
          <p>
            © {new Date().getFullYear()} True Crime Club. Todos os direitos
            reservados.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[#211c18] dark:hover:text-[#fffaf0]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
