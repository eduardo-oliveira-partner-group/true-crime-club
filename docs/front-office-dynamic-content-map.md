# Mapa de Conteúdo Dinâmico — Front Office

> Mapeia todos os blocos de texto/banner/imagem/conteúdo usados nas telas do
> Front Office que deverão ser gerenciados pelo time de Design via Backoffice.
> Cada bloco tem chave, rota, tipo, valor mockado de fallback (em
> `src/lib/domain/mock-data.ts`), owner esperado no Backoffice e notas.

Convenções de tipo:

- `text` — texto curto/longo editável.
- `html` — HTML editável (renderizado com `dangerouslySetInnerHTML`).
- `image` — imagem substituível (path em `public/` ou URL).
- `banner` — bloco composto (imagem + texto + CTA).
- `seo` — metadados de SEO (título, descrição, OG).
- `faq` — entrada de FAQ (pergunta + resposta).

## Home (`/`)

| Chave | Tipo | Valor mockado de fallback | Owner Backoffice | Notas |
| --- | --- | --- | --- | --- |
| `home.hero.title` | text | `Investigue. Colete. Desvende.` | Marketing | Título principal do hero. |
| `home.hero.badge` | text | `Primeiro Clube de True Crime do Brasil` | Marketing | Selo acima do título. |
| `home.hero.subtitle` | text | `Eleve seu nível de conteúdo com uma caixa temática mensal...` | Marketing | Subtítulo do hero. |
| `home.hero.cta` | text | `Garantir minha vaga` | Marketing | Label do CTA do hero. |
| `home.hero.imagem` | image | `assets/images/home/hero-banner.png` | Design | Imagem de fundo do hero (atualmente importada como asset estático). |
| `home.club_overview.imagem` | image | `assets/images/home/club-overview-bg.png` | Design | Imagem da seção "O que é o Club". |
| `home.box_contents.imagem` | image | `assets/images/home/box-contents-bg.png` | Design | Imagem da seção "O que vem na caixa". |
| `home.investigation.imagem` | image | `assets/images/home/investigation-continuous-bg.png` | Design | Imagem da seção "Investigação contínua". |
| `home.final_cta.subtitle` | text | `Garanta sua vaga no clube antes que a próxima edição esgote...` | Marketing | Subtítulo do CTA final. |
| `home.final_cta.imagem` | image | `assets/images/home/final-cta-dossier-plate.png` | Design | Imagem do CTA final. |
| `home.trust.support` | text | `Suporte humano de segunda a sexta, das 9h às 18h.` | Operações | Texto de confiança (atualmente comentado no código). |
| `home.previous_boxes.imagem` | image | `assets/images/home/previous-boxes-banner.png` | Design | Banner da vitrine de edições anteriores. |
| `home.plans.imagem` | image | `assets/images/home/plans-dossier-plate.png` | Design | Imagem da seção de planos. |
| `home.club_overview.heading` | text | (hardcoded: `Muito além de uma caixa. Uma imersão mensal em true crime.`) | Marketing | Sugere-se extrair para conteúdo dinâmico. |
| `home.box_contents.heading` | text | (hardcoded: `O que você vai encontrar dentro da sua box?`) | Marketing | Sugere-se extrair para conteúdo dinâmico. |
| `home.investigation.heading` | text | (hardcoded: `Uma pista por mês. Um caso inteiro para desvendar.`) | Marketing | Sugere-se extrair para conteúdo dinâmico. |
| `home.how_it_works.heading` | text | (hardcoded: `Da assinatura ao dossiê final em três passos.`) | Marketing | Sugere-se extrair para conteúdo dinâmico. |
| `home.how_it_works.steps` | conteúdo estruturado | (array hardcoded `howItWorks` em `page.tsx`) | Marketing | Passos "Assine/Receba/Investigue". Sugere-se tornar editável. |
| `home.club_highlights` | conteúdo estruturado | (array hardcoded `clubHighlights`) | Marketing | Itens de destaque do clube. Sugere-se tornar editável. |
| `home.box_categories` | conteúdo estruturado | (array hardcoded `boxCategories`) | Marketing | Categorias "O que vem na caixa". Sugere-se tornar editável. |
| `home.featured_boxes` | dados | `listProducts({ featured: true })` | Catálogo (Backoffice de produtos) | Boxes em destaque na home. |

## Loja (`/loja`)

| Chave | Tipo | Valor mockado de fallback | Owner Backoffice | Notas |
| --- | --- | --- | --- | --- |
| `loja.hero.heading` | text | (hardcoded: `Arquivos abertos para colecionadores.`) | Marketing | Sugere-se extrair. |
| `loja.hero.subtitle` | text | (hardcoded: `Boxes anteriores, edições avulsas...`) | Marketing | Sugere-se extrair. |
| `loja.hero.imagem` | image | `assets/images/home/previous-boxes-banner.png` | Design | Banner do hero da loja. |
| `loja.stats` | conteúdo estruturado | (array hardcoded `stats`: boxes no arquivo, preço assinante, curadoria) | Marketing | Sugere-se tornar editável ou derivar de catálogo. |
| `loja.catalogo.produtos` | dados | `listProducts()` | Catálogo | Vitrine e catálogo. Gerenciado como produtos. |

## Detalhe de produto (`/loja/[slug]`)

| Chave | Tipo | Valor mockado de fallback | Owner Backoffice | Notas |
| --- | --- | --- | --- | --- |
| `produto.{slug}.nome` | text | `product.name` | Catálogo | Nome do produto/box. |
| `produto.{slug}.descricao` | text | `product.description` | Catálogo | Descrição longa. |
| `produto.{slug}.descricao_curta` | text | `product.shortDescription` | Catálogo | Descrição curta. |
| `produto.{slug}.imagens` | image[] | `product.images` | Catálogo | Galeria de imagens. |
| `produto.{slug}.itens_inclusos` | text[] | `product.includedItems` | Catálogo | Lista de itens inclusos. |
| `produto.{slug}.preco` | dados | `product.price` / `subscriberPrice` | Catálogo | Preço e preço de assinante. |
| `produto.{slug}.disponibilidade` | dados | `product.availability` / `inStock` | Catálogo/Estoque | Status de disponibilidade. |

## Assinatura (`/assinatura`)

| Chave | Tipo | Valor mockado de fallback | Owner Backoffice | Notas |
| --- | --- | --- | --- | --- |
| `assinatura.hero.heading` | text | (hardcoded: `Planos de assinatura`) | Marketing | Sugere-se extrair. |
| `assinatura.hero.subtitle` | text | (hardcoded: `Escolha entre mensal, anual ou box avulsa...`) | Marketing | Sugere-se extrair. |
| `assinatura.how_it_works` | html | `<ol><li><strong>Assine</strong>...</li>...</ol>` | Marketing | Já é dinâmico via `getDynamicContent`. |
| `assinatura.hero.imagem` | image | `assets/images/home/plans-dossier-plate.png` | Design | Imagem do hero. |
| `assinatura.planos` | dados | `listPlans()` | Catálogo/Comercial | Planos (mensal/anual/avulso), preços e benefícios. |

## FAQ (`/faq`)

| Chave | Tipo | Valor mockado de fallback | Owner Backoffice | Notas |
| --- | --- | --- | --- | --- |
| `faq.intro` | text | `Respostas para as dúvidas mais comuns sobre o clube...` | Marketing/Suporte | Já é dinâmico via `getDynamicContent`. |
| `faq.hero.imagem` | image | `assets/images/home/previous-boxes-banner.png` | Design | Banner do hero do FAQ. |
| `faq.itens` | faq[] | (array hardcoded `faqItems` em `faq/page.tsx`) | Suporte | Perguntas e respostas. Sugere-se tornar editável via Backoffice. |
| `faq.cta.heading` | text | (hardcoded: `Entre no caso. O arquivo está aberto.`) | Marketing | Sugere-se extrair. |
| `faq.cta.subtitle` | text | (hardcoded: `Garanta sua vaga no clube...`) | Marketing | Sugere-se extrair. |

## Carrinho (`/carrinho`)

| Chave | Tipo | Valor mockado de fallback | Owner Backoffice | Notas |
| --- | --- | --- | --- | --- |
| `carrinho.hero.heading` | text | (hardcoded: `Seu carrinho`) | Marketing | Sugere-se extrair. |
| `carrinho.empty.heading` | text | (hardcoded: `Nenhuma evidência selecionada ainda.`) | Marketing | Sugere-se extrair. |
| `carrinho.empty.body` | text | (hardcoded: `Abra o arquivo da loja...`) | Marketing | Sugere-se extrair. |
| `carrinho.resumo.notas` | text[] | (hardcoded: `Pagamento seguro...`, `Envio previsto para o ciclo seguinte...`) | Operações | Notas do resumo. Sugere-se extrair. |
| `carrinho.frete.cep_exemplo` | dados | `05435-020` | — | CEP mockado para cálculo de frete. |

## Checkout (`/checkout`) e Confirmação (`/checkout/confirmacao`)

| Chave | Tipo | Valor mockado de fallback | Owner Backoffice | Notas |
| --- | --- | --- | --- | --- |
| `checkout.aviso_mock` | text | (hardcoded: `Fluxo mockado — nenhum pagamento real será processado.`) | Operações | Aviso de ambiente de validação. |
| `checkout.preferencias.opcoes` | conteúdo estruturado | (arrays hardcoded `shirtSizes`, `shoeSizes` no stepper) | Catálogo/Comercial | Tamanhos de camiseta/calçado. Sugere-se tornar editável. |
| `confirmacao.nota_cobranca` | text | `order.billingCycleNote` | Operações | Nota de cobrança (vem do pedido). |
| `confirmacao.nota_envio` | text | `order.shippingCycleNote` | Operações | Nota de envio (vem do pedido). |

## Autenticação (`/login`, `/cadastro`, `/recuperar-senha`)

| Chave | Tipo | Valor mockado de fallback | Owner Backoffice | Notas |
| --- | --- | --- | --- | --- |
| `auth.logo` | image | `assets/images/brand/logo.png` | Design | Logo nas telas de auth. |
| `auth.login.heading` | text | (hardcoded nas páginas) | Marketing | Sugere-se extrair. |
| `auth.cadastro.heading` | text | (hardcoded) | Marketing | Sugere-se extrair. |
| `auth.recuperar.heading` | text | (hardcoded) | Marketing | Sugere-se extrair. |

## Área do cliente (`/cliente/**`)

| Chave | Tipo | Valor mockado de fallback | Owner Backoffice | Notas |
| --- | --- | --- | --- | --- |
| `cliente.logo` | image | `assets/images/brand/logo.png` | Design | Logo no shell do cliente. |
| `cliente.navegacao` | conteúdo estruturado | (itens hardcoded no `client-shell.tsx`) | Produto | Itens do menu (Home, Pedidos, Assinatura, Financeiro, Conteúdos). Sugere-se tornar configurável. |
| `cliente.pedidos.vazio` | text | (hardcoded) | Suporte | Mensagem de estado vazio. |
| `cliente.assinatura.vazio` | text | (hardcoded) | Suporte | Mensagem de estado vazio. |
| `cliente.assinatura.cancelamento_aviso` | text | (hardcoded) | Jurídico/Operações | Aviso de permanência anual. |
| `cliente.financeiro.vazio` | text | (hardcoded) | Suporte | Mensagem de estado vazio. |
| `cliente.financeiro.atualizar_cartao.aviso` | text | (hardcoded) | Operações | Aviso de ambiente mockado. |
| `cliente.conteudos.evento_ao_vivo` | dados | `mockActiveCase.liveEventDate` / `liveEventTitle` | Produto/Marketing | Data e título do evento ao vivo. |
| `cliente.conteudos.caso_descricao` | text | `mockActiveCase.description` | Produto/Marketing | Descrição do caso fictício do ano. |
| `cliente.conteudos.bloqueado.motivo` | text | `Libera no próximo ciclo` | Produto | Motivo padrão de conteúdo bloqueado. |

## Conteúdo dinâmico existente (mock-data)

Os blocos abaixo já estão modelados em `mockDynamicContent` e consumidos via
`getDynamicContent(key)`:

- `home.hero.title` (text, `/`)
- `home.hero.badge` (text, `/`)
- `home.hero.subtitle` (text, `/`)
- `home.hero.cta` (text, `/`)
- `home.final_cta.subtitle` (text, `/`)
- `home.trust.support` (text, `/`)
- `assinatura.how_it_works` (html, `/assinatura`)
- `faq.intro` (text, `/faq`)

## SEO (entries em `mockSeoEntries`)

Cada rota pública tem uma entrada de SEO consumida via `getSeoEntry(path)` e
montada por `buildMetadata` (canonical, OG, Twitter). Owner Backoffice:
Marketing/SEO.

| Rota | Título (fallback) | Descrição (fallback) |
| --- | --- | --- |
| `/` | True Crime Club — Clube de assinatura de mistério | Assine e receba mensalmente boxes temáticas... |
| `/loja` | Loja — Boxes e produtos | Explore boxes atuais, edições avulsas... |
| `/assinatura` | Planos de assinatura | Compare planos mensal e anual... |
| `/faq` | Perguntas frequentes | Tire dúvidas sobre planos, entrega, pagamento... |
| `/carrinho` | Carrinho — Dossiê de compra | Revise os itens selecionados, aplique cupons... |
| `/checkout` | Checkout — Finalizar pedido | Informe conta, endereço, frete, pagamento... |
| `/checkout/confirmacao` | Pedido confirmado | Confirmação do pedido com ciclo de cobrança... |

## Recomendações para o Backoffice

1. **Priorizar extração de copy hardcoded**: títulos, subtítulos e CTAs das
   seções da Home/Loja/Assinatura/FAQ atualmente embutidos em componentes
   devem migrar para conteúdo dinâmico (chaves `*.hero.heading`,
   `*.hero.subtitle`, etc.).
2. **FAQ editável**: o array `faqItems` deve virar uma coleção gerenciada no
   Backoffice, com pergunta, resposta, código (FAQ-01…) e ordem.
3. **Categorias e destaques**: `clubHighlights`, `boxCategories` e
   `howItWorks` são arrays estruturados — modelar como blocos editáveis com
   ícone, título e descrição.
4. **Imagens**: todas as imagens em `src/assets/images/**` hoje são assets
   estáticos importados. Para conteúdo dinâmico, migrar para URLs
   gerenciadas (uploads do Backoffice) e consumir via API.
5. **SEO por rota**: manter `getSeoEntry` como fonte única de metadados por
   rota; o Backoffice deve editar título/descrição/OG/noindex por rota.
6. **Preferências do assinante**: os arrays `shirtSizes`/`shoeSizes` no
   checkout stepper devem ser configuráveis no Backoffice (catálogo de
   preferências).
