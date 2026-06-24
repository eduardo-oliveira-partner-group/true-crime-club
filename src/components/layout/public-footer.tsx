import Link from "next/link"

import { BrandLogo } from "@/src/components/layout/brand-logo"

const siteMapLinks = [
  { href: "/cadastro", label: "Cadastro" },
  { href: "/faq", label: "Perguntas frequentes" },
]

const infoLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/termos", label: "Termos e condições" },
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
]

function FooterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {children}
    </div>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface-elevated">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <BrandLogo className="h-10" />
            </Link>
            <address className="space-y-0.5 text-sm not-italic text-muted-foreground">
              <p>Av. Tamboré, 287 - Tamboré,</p>
              <p>Barueri - SP, 06460-000, Torre Norte</p>
              <p>- 10º Andar</p>
            </address>
          </div>

          <FooterSection title="Mapa do site">
            <ul className="space-y-2">
              {siteMapLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="Informações">
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="Contato">
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contato@truecrime.club"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  contato@truecrime.club
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5511960185171"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  (11) 96018-5171 (apenas WhatsApp)
                </a>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground">
              De segunda a sexta-feira, das 11h às 16h. Exceto feriados.
            </p>
          </FooterSection>

          <FooterSection title="Siga-nos">
            <a
              href="https://instagram.com/oficialtruecrime.club"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              oficialtruecrime.club
            </a>
          </FooterSection>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} True Crime Club. Conteúdo mockado para validação de jornada.
      </div>
    </footer>
  )
}
