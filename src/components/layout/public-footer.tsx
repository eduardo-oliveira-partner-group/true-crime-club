import Image from 'next/image'
import Link from 'next/link'

import logo from '@/src/assets/images/brand/logo.png'
import { fontType, transitionBgColor } from '@/src/lib/design/classes'

const clubLinks = [
  { href: '/#oque', label: 'O que é' },
  { href: '/#funciona', label: 'Como funciona' },
  { href: '/#planos', label: 'Planos' },
  { href: '/#arquivos', label: 'Arquivos' },
  { href: '/api-docs', label: 'Dossiê de API' },
]

const helpLinks = [
  { href: '/faq', label: 'Perguntas frequentes' },
  { href: '/faq', label: 'Entregas e prazos' },
  { href: 'mailto:contato@truecrime.club', label: 'Fale com a gente' },
  { href: '/faq', label: 'Política de cancelamento' },
]

const socialLinks = [
  {
    href: 'https://instagram.com/oficialtruecrime.club',
    label: 'Instagram',
  },
  { href: '#', label: 'TikTok' },
  { href: '#', label: 'YouTube' },
  { href: '#', label: 'Newsletter' },
]

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <h3
        className={`m-0 mb-[14px] text-[11.5px] tracking-[0.08em] text-[#7a7066] uppercase ${fontType}`}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-[10px] text-[14px]">
        {links.map((link) =>
          link.href.startsWith('/') ? (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={`${transitionBgColor} text-[#c9bfb0] no-underline hover:text-(--paper)`}
            >
              {link.label}
            </Link>
          ) : (
            <a
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={`${transitionBgColor} text-[#c9bfb0] no-underline hover:text-(--paper)`}
            >
              {link.label}
            </a>
          ),
        )}
      </div>
    </div>
  )
}

export function PublicFooter() {
  return (
    <footer className="relative border-t border-[rgba(33,28,24,0.15)] bg-(--ink) text-[#c9bfb0]">
      <div className="mx-auto max-w-[1180px] px-8 pt-[58px] pb-[30px] max-[860px]:px-[22px]">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 max-[860px]:grid-cols-2">
          <div>
            <div className="mb-4">
              <Image
                src={logo}
                alt="TrueCrime.Club"
                className="block h-[38px] w-auto"
              />
            </div>
            <p className="m-0 max-w-[280px] text-[14px] leading-[1.55] text-[#c9bfb0]">
              O clube de assinatura true crime pra quem é fascinado pelo
              comportamento humano. Um novo caso, todo mês.
            </p>
            <div
              aria-hidden="true"
              className={`mt-[22px] inline-flex rotate-[-4deg] items-center justify-center border-2 border-[rgba(239,188,24,0.6)] px-[14px] py-1.5 pb-[7px] text-[11px] font-bold tracking-[0.18em] text-[rgba(239,188,24,0.85)] uppercase ${fontType}`}
            >
              CASE FILE
            </div>
          </div>
          <FooterColumn title="O Clube" links={clubLinks} />
          <FooterColumn title="Ajuda" links={helpLinks} />
          <FooterColumn title="Siga" links={socialLinks} />
        </div>
        <div className="mt-9 mb-5 h-[1.5px] [background:repeating-linear-gradient(90deg,rgba(255,255,255,0.16)_0,rgba(255,255,255,0.16)_5px,transparent_5px,transparent_9px)]" />
        <div
          className={`flex flex-wrap justify-between gap-3 text-[11px] tracking-[0.06em] text-[#7a7066] ${fontType}`}
        >
          <span>
            © {new Date().getFullYear()} TRUECRIME.CLUB · TODOS OS CASOS
            RESERVADOS
          </span>
          <span>CNPJ 00.000.000/0001-00 · FEITO NO BRASIL</span>
        </div>
      </div>
    </footer>
  )
}
