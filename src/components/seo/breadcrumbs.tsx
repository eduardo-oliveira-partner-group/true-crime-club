import Link from 'next/link'

import { JsonLd } from '@/src/components/seo/json-ld'
import { siteConfig } from '@/src/lib/site'
import { cn } from '@/src/lib/utils'

export interface BreadcrumbItem {
  name: string
  /** Caminho absoluto da rota (ex.: "/loja"). */
  path: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path}`,
    })),
  }

  return (
    <>
      <nav
        aria-label="Trilha de navegação"
        className={cn('text-sm text-(--ink-soft)', className)}
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={item.path} className="flex items-center gap-2">
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium text-(--ink)"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="transition-colors hover:text-(--red)"
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast ? (
                  <span className="text-(--ink-mute)/55">/</span>
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd data={jsonLd} />
    </>
  )
}
