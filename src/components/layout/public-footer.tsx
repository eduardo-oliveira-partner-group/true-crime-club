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
  { href: '/design-sugerido', label: 'Design sugerido' },
  { href: '/cadastro', label: 'Criar conta' },
  { href: '/login', label: 'Entrar na conta' },
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
      <h3 className="text-xs font-semibold tracking-[0.22em] text-[#d7b56d] uppercase">
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
    <footer className="border-t border-[#fffaf0]/10 bg-[#090807] text-[#fffaf0]">
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

            <p className="max-w-sm text-sm/6 text-[#d7c9b5]">
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
                    className="text-sm text-[#d7c9b5] transition-colors hover:text-[#fffaf0]"
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
                    className="text-sm text-[#d7c9b5] transition-colors hover:text-[#fffaf0]"
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
                  className="inline-flex items-center gap-2 text-sm text-[#d7c9b5] transition-colors hover:text-[#fffaf0]"
                >
                  <IconMail className="size-4 shrink-0 text-[#d84132]" />
                  contato@truecrime.club
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5511960185171"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#d7c9b5] transition-colors hover:text-[#fffaf0]"
                >
                  <IconPhone className="size-4 shrink-0 text-[#d84132]" />
                  (11) 96018-5171
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/oficialtruecrime.club"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#d7c9b5] transition-colors hover:text-[#fffaf0]"
                >
                  <IconBrandInstagram className="size-4 shrink-0 text-[#d84132]" />
                  @oficialtruecrime.club
                </a>
              </li>
            </ul>
            <p className="text-xs/5 text-[#a89882]">
              {trustSupport?.value ??
                'Suporte humano de segunda a sexta, das 9h às 18h.'}
            </p>
          </FooterSection>
        </div>

        <div className="mt-10 border border-[#fffaf0]/10 bg-[#171211]/60 p-5 sm:p-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
            Endereço
          </p>
          <address className="mt-2 space-y-0.5 text-sm/6 text-[#d7c9b5] not-italic">
            <p>Av. Tamboré, 287 - Tamboré,</p>
            <p>Barueri - SP, 06460-000, Torre Norte — 10º Andar</p>
          </address>
        </div>
      </div>

      <div className="border-t border-[#fffaf0]/10 p-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-xs text-[#a89882] sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} True Crime Club. Todos os direitos
            reservados.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[#fffaf0]"
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
