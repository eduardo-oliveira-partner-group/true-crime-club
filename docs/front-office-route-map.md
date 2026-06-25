# Mapa de Rotas do Front Office

> Mapa das 19 rotas do Front Office implementadas com mocks. Cada rota mapeia
> finalidade, repositório mockado consumido, estratégia de SEO e regra de
> autenticação/indexação. Base para o time de Backend ao planejar APIs reais.

Convenções:

- **Repo mockado**: função em `src/lib/domain/repositories.ts` que hoje atende a
  rota e que deverá ser substituída por uma chamada de API.
- **SEO**: `metadata` estática, `generateMetadata` dinâmica, ou `noindex`.
- **Indexação**: `index` = indexável; `noindex` = excluída de busca; `private`
  = atrás de auth e sempre `noindex`.

## Rotas públicas — `(front-office)`

| Rota | Finalidade | Repo mockado | SEO | Indexação |
| --- | --- | --- | --- | --- |
| `/` | Home: promessa do clube, CTA de assinatura, destaques, caso ativo, planos e edições anteriores. | `getDynamicContent` (hero/CTA), `listProducts({ featured })`, `listPlans`, `getActiveCase`, `getSubscriberProgress`, `getSeoEntry('/')` | `metadata` estática (canonical, OG, Twitter) | index |
| `/loja` | Vitrine de boxes avulsas e produtos complementares. | `listProducts`, `getSeoEntry('/loja')` | `metadata` estática | index |
| `/loja/[slug]` | Detalhe de produto/box com breadcrumbs e JSON-LD de produto. | `getProductBySlug`, `listProducts`, `addCartItem`, `getSeoEntry('/loja')` | `generateMetadata` dinâmica (título/OG do produto) + `ProductJsonLd` + `Breadcrumbs` JSON-LD | index |
| `/assinatura` | Apresentação de planos (mensal/anual/avulso) e regras de cobrança×envio. | `listPlans`, `getDynamicContent('assinatura.how_it_works')`, `getSeoEntry('/assinatura')` | `metadata` estática | index |
| `/faq` | FAQ com acordeões e JSON-LD de FAQ. | `getDynamicContent('faq.intro')`, `getSeoEntry('/faq')` | `metadata` estática + `FAQPage` JSON-LD | index |
| `/carrinho` | Carrinho com itens, cupom, frete e resumo. | `getCart`, `getCartTotals`, `calculateShipping`, `applyCoupon`, `updateCartItemQuantity`, `removeCartItem` | `metadata` estática `noindex` | noindex |
| `/checkout` | Checkout com stepper (conta, endereço, frete, pagamento, preferências, revisão). Suporta `?plano=<slug>` para o fluxo de assinatura. | `getCart`, `getCartTotals`, `getCurrentCustomer`, `listAddresses`, `listPaymentMethods`, `calculateShipping`, `getPlanBySlug`, `createOrder`, `updateSubscriberPreferences` | `metadata` estática `noindex` | noindex |
| `/checkout/confirmacao` | Confirmação do pedido com ciclo de cobrança×envio e rastreio. | `listOrders` | `metadata` estática `noindex` | noindex |

## Rotas de autenticação — `(auth)`

Todas `noindex` via `metadata` no layout `src/app/(auth)/layout.tsx`
(`robots: { index: false, follow: false }`).

| Rota | Finalidade | Repo mockado | SEO | Indexação |
| --- | --- | --- | --- | --- |
| `/login` | Login do cliente. | (mock futuro: `login`) | `noindex` (layout) | private |
| `/cadastro` | Cadastro de cliente. | (mock futuro: `createAccount`) | `noindex` (layout) | private |
| `/recuperar-senha` | Recuperação de senha. | (mock futuro: `requestPasswordReset`) | `noindex` (layout) | private |

## Rotas da área do cliente — `(cliente)`

Todas `noindex` via `metadata` no layout `src/app/(cliente)/cliente/layout.tsx`.

| Rota | Finalidade | Repo mockado | SEO | Indexação |
| --- | --- | --- | --- | --- |
| `/cliente` | Painel do cliente (redireciona/apresenta resumo). | `getCurrentCustomer`, `getSubscription`, `listOrders`, `getSubscriberProgress` | `noindex` (layout) | private |
| `/cliente/pedidos` | Lista de pedidos. | `listOrders` | `noindex` (layout) | private |
| `/cliente/pedidos/[id]` | Detalhe de pedido (ciclo, rastreio, NF). | `getOrderById` | `noindex` (layout) | private |
| `/cliente/assinatura` | Assinatura ativa, próxima cobrança, box do ciclo. | `getSubscription`, `listPlans` | `noindex` (layout) | private |
| `/cliente/assinatura/cancelar` | Cancelamento/reativação. | `cancelSubscription`, `reactivateSubscription` | `noindex` (layout) | private |
| `/cliente/financeiro` | Histórico de cobranças, faturas e status de pagamento. | `listPayments`, `listInvoices`, `renewPixPayment` | `noindex` (layout) | private |
| `/cliente/financeiro/atualizar-cartao` | Atualização de cartão. | `updateCard`, `listPaymentMethods` | `noindex` (layout) | private |
| `/cliente/conteudos` | Hub de gamificação: timeline de pistas, progresso, evento ao vivo. | `getActiveCase`, `listClues`, `getSubscriberProgress`, `listExclusiveContent` | `noindex` (layout) | private |
| `/cliente/conteudos/[slug]` | Detalhe de conteúdo/pista com arquivos. | `getExclusiveContentBySlug`, `getClueBySlug` | `noindex` (layout) | private |

## Estados por rota

| Rota | `loading.tsx` | `error.tsx` | `not-found.tsx` |
| --- | --- | --- | --- |
| `(front-office)` | sim | sim (client, `unstable_retry`) | sim (branded 404) |
| `(front-office)/loja/[slug]` | sim | sim | sim |
| `(cliente)` | sim | sim | sim |
| `(cliente)/cliente/conteudos/[slug]` | sim | sim | sim |
| `(cliente)/cliente/pedidos/[id]` | sim | sim | sim |

## Infra de SEO

- `src/app/sitemap.ts` — gera `sitemap.xml` com rotas públicas + páginas de
  produto dinâmicas.
- `src/app/robots.ts` — gera `robots.txt` permitindo rastreio das rotas
  públicas e bloqueando `/cliente`, `/login`, `/cadastro`,
  `/recuperar-senha`.
- `src/lib/site.ts` — `siteConfig` (URL canônica base, OG default, locale).
- `src/lib/seo.ts` — `buildMetadata` (canonical, OG, Twitter, robots).
- `src/components/seo/json-ld.tsx`, `breadcrumbs.tsx`, `product-json-ld.tsx` —
  componentes reutilizáveis de structured data.
