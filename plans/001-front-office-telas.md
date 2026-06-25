# Plano 001: Implementar as telas do Front Office com mocks, SEO e contratos futuros

> **Instruções para o executor**: siga este plano passo a passo. Rode todos os
> comandos de verificação e confirme o resultado esperado antes de avançar para
> a próxima etapa. Se alguma situação da seção "Condições de parada" acontecer,
> pare e reporte. Ao finalizar, atualize a linha de status deste plano em
> `plans/README.md`.
>
> **Verificação de drift (rode primeiro)**: `git diff --stat fe41adc..HEAD -- docs/escopo-frontend.md package.json src public components.json next.config.ts tsconfig.json`
> Se algum arquivo em escopo mudou desde que este plano foi escrito, compare os
> trechos da seção "Estado atual" com o código vivo antes de prosseguir. Se
> houver divergência material, trate como condição de parada.

## Status

- **Prioridade**: P1
- **Esforço**: L
- **Risco**: MED
- **Depende de**: nenhum
- **Categoria**: direção
- **Planejado em**: commit `fe41adc`, 2026-06-25 (reconcile; baseline original `d80f959`)
- **Execução**: IN PROGRESS — Etapas 1–4 em grande parte concluídas; Etapas 5–7 pendentes (ver seção "Progresso do reconcile")

## Por que isso importa

O projeto precisa de um Front Office completo, navegável e apoiado em mocks antes do desenvolvimento real do backend. O escopo exige explicitamente cobertura de compra, assinatura, área do cliente, financeiro, conteúdo exclusivo, SEO, dados mockados, conteúdo dinâmico e contratos futuros de API. O benchmark é a experiência pública atual da True Crime Club, mas a implementação deve melhorar a jornada sem copiar a interface.

O resultado esperado é um frontend que Design, Produto, Backend e stakeholders consigam usar para validar a jornada do cliente de ponta a ponta sem banco de dados real, autenticação real, gateway de pagamento, transportadora ou deploy definitivo de produção.

## Estado atual

- `docs/escopo-frontend.md` define o objetivo do Front Office: frontend completo, responsivo, totalmente mockado e preparado para APIs reais futuras e gestão de conteúdo dinâmico via Backoffice (`docs/escopo-frontend.md:5-9`).
- O Frontend deve implementar rotas, componentes reutilizáveis, mocks, fluxos simulados, documentação de APIs futuras, preparo para dados reais e preparo para conteúdo dinâmico (`docs/escopo-frontend.md:23-34`).
- O Frontend deve entregar ao Backend a lista de APIs futuras, contratos de request/response, estrutura dos dados mockados e mapa de conteúdo dinâmico (`docs/escopo-frontend.md:46-51`).
- As telas públicas de comércio incluem Home, vitrine de produtos/boxes, detalhes de produto/box, planos de assinatura, carrinho, checkout e confirmação de pedido (`docs/escopo-frontend.md:75-87`).
- As telas da área do cliente incluem login, recuperação de senha, cadastro, pedidos, assinatura, financeiro e conteúdo exclusivo gamificado (`docs/escopo-frontend.md:100-112`).
- Os fluxos de assinatura/financeiro devem cobrir plano ativo, status da assinatura, próxima cobrança, box do ciclo atual, pagamento pendente, cancelamento, reativação, histórico de cobranças, faturas, recibos, pagamento recusado, renovação de Pix e atualização de cartão (`docs/escopo-frontend.md:116-138`).
- As telas de conteúdo/gamificação devem cobrir casos, conteúdos liberados, conteúdos bloqueados, arquivos disponíveis e progresso do assinante (`docs/escopo-frontend.md:142-150`).
- A UX deve ser premium, moderna, profissional, responsiva, componentizada, clara e incluir estados vazio, carregando, erro, sucesso, bloqueado e pendente (`docs/escopo-frontend.md:154-167`).
- Os mocks devem cobrir produtos, boxes, planos, cliente logado, pedidos, pagamentos, faturas, endereços, meios de pagamento, conteúdos, status de assinatura, status de pedido, status de pagamento e conteúdo dinâmico (`docs/escopo-frontend.md:175-196`).
- A documentação de APIs futuras deve incluir método, endpoint, uso, exemplos de request/response, erros e observações de regra de negócio (`docs/escopo-frontend.md:200-216`).
- SEO deve incluir títulos/descrições dinâmicas, Open Graph, Twitter Cards, slugs, canonical URLs, sitemap, robots, JSON-LD para produtos e breadcrumbs, breadcrumbs visíveis, hierarquia de headings, performance, lazy loading de imagens, pré-renderização quando aplicável e `noindex` em páginas privadas (`docs/escopo-frontend.md:319-342`).
- O aceite exige todas as telas principais navegáveis, fluxos com mocks funcionando, rotas organizadas, componentes reutilizáveis, responsividade, documentação de APIs, SEO, preparo para conteúdo dinâmico e documentação suficiente para o Backend iniciar a implementação (`docs/escopo-frontend.md:371-384`).
- Fora do escopo: backend real, banco de dados, gateway de pagamento, Omie, integração com transportadoras, autenticação real, pagamento real, emissão real de nota fiscal e deploy definitivo em produção (`docs/escopo-frontend.md:388-400`).
- Requisito de benchmark: entregar maturidade no mínimo equivalente a `https://www.truecrime.club/` em navegação, jornada do assinante, área do cliente e experiência geral, sem reproduzir a UI (`docs/escopo-frontend.md:404-416`).
- O Front Office já existe em route groups `(front-office)`, `(auth)` e `(cliente)` com 19 rotas compilando em `pnpm build` (commit `fe41adc`). A Home vive em `src/app/(front-office)/page.tsx`; não há mais placeholder em `src/app/page.tsx`.
- O layout raiz em `src/app/layout.tsx` usa `lang="pt-BR"`, `ThemeProvider`, `SmoothScrollProvider` e fontes Inter/Libre Baskerville/Geist Mono; metadata default em `src/app/layout.tsx:23-28`.
- `components.json` já aponta para `src/app/globals.css` e aliases `@/src/...` (`components.json:7-20`).
- A camada mockada está em `src/lib/domain/{types,mock-data,repositories,scenarios}.ts` e `src/lib/formatters.ts`, com funções como `listProducts`, `getCart`, `createOrder`, `getActiveCase`, `listClues`, `getSubscriberProgress` e `getSeoEntry` (`src/lib/domain/repositories.ts`).
- Layouts públicos: `PublicHeader`, `PublicFooter` em `src/components/layout/`; shell privado em `src/components/layout/client-shell.tsx`.
- Carrinho, checkout e confirmação existem; checkout é **página única simplificada** (`src/app/(front-office)/checkout/page.tsx`), sem stepper nem etapa de preferências de assinante.
- Gamificação na área logada: `src/app/(cliente)/cliente/conteudos/page.tsx` renderiza timeline de pistas, progresso e evento ao vivo.
- Confirmação comunica descompasso cobrança × envio via `order.billingCycleNote` / `order.shippingCycleNote` (`src/app/(front-office)/checkout/confirmacao/page.tsx:44-50`).
- **Ainda ausente**: `src/app/sitemap.ts`, `src/app/robots.ts`, `generateMetadata` por rota, JSON-LD, banner de cookies, `loading/error/not-found` por rota, docs em `docs/front-office-*.md`, `noindex` em layouts auth/cliente, formulário de preferências no checkout.
- Os scripts em `package.json:6-13` são `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`, `pnpm format` e `pnpm typecheck`.
- O projeto usa Next `16.2.6`, React `19.2.4`, Tailwind 4, shadcn, radix-ui, next-themes e Tabler icons (`package.json:14-25`).
- Gates em `fe41adc`: `pnpm typecheck` exit 0, `pnpm build` exit 0, `pnpm lint` **exit 1** (9 erros Prettier em arquivos de auth/cliente/faq).

## Notas do Benchmark (True Crime Club)

Requisito do escopo (`docs/escopo-frontend.md:404-416`): o Front Office deve entregar, **no mínimo**, maturidade equivalente a `https://www.truecrime.club/` em navegação, jornada do assinante, área do cliente e experiência geral — **buscando uma experiência superior**, sem reproduzir a interface, branding, copy ou imagens da referência. Use o conteúdo abaixo como benchmark **funcional e de jornada**, não como direção visual.

O conteúdo a seguir foi observado na home pública da referência em 2026-06-24 e serve para garantir paridade funcional mínima. Não copie textos; reescreva com a identidade da nova plataforma.

### Proposta de valor e narrativa (alimenta Home, Assinatura e Detalhe de box)

- Conceito central: clube de assinatura de "true crime" que envia mensalmente uma **caixa temática colecionável** com curadoria e fator surpresa. A Home deve comunicar promessa, prova de qualidade e CTA de assinatura logo no topo.
- Categorias de itens que compõem a box (use como facetas de catálogo, blocos de "o que vem na box" e filtros): itens colecionáveis exclusivos; papelaria premium (cadernos, planners temáticos); decoração e utilidades (pôsteres, quadros, itens de cozinha/organização); moda (camisetas, blusas, chinelos, acessórios); conteúdo exclusivo (trechos de livros raros, vídeos, materiais só para assinantes).
- Regra de curadoria/surpresa: cada edição traz **uma seleção** das categorias, variando a cada mês — o assinante **não** recebe todos os tipos em uma única edição. Reflita isso na copy mockada da box e na comunicação de expectativa, evitando prometer itens fixos.

### Gamificação / mistério contínuo (alimenta 3.5 Conteúdo / Gamificação)

- Mecânica-âncora: a cada edição o assinante recebe **uma nova pista** de um caso fictício investigado coletivamente. Pistas, evidências e documentos **se acumulam ao longo do ano**, culminando em um **evento online ao vivo** para desvendar o caso com a comunidade (a referência aponta início de 2027).
- Implicação direta para as telas de conteúdo exclusivo (`docs/escopo-frontend.md:142-150`): modele o hub gamificado como uma **linha do tempo de caso** com itens liberados por ciclo, itens bloqueados (estado `bloqueado` claro com motivo "libera no próximo ciclo"), arquivos/documentos baixáveis por pista, um **tracker de progresso do assinante** (quantas pistas coletadas vs. total) e um teaser/contagem para o evento ao vivo final. Esta é a maior oportunidade de **superar** o benchmark: a referência só descreve a mecânica na home; a nova plataforma deve torná-la uma área navegável e mensurável na área logada.

### Matriz de planos (alimenta tela de Assinatura e cards de plano)

- Plano Mensal: cobrança mensal, "cancele quando quiser", novidades mensais, sorteios a cada lançamento, edições limitadas.
- Plano Anual (rotulado **recomendado**): preço/mês menor, **cobrança anual no cartão**, com **permanência de 12 meses**. Destaque visual de plano recomendado.
- Caixas **avulsas** de meses anteriores vendidas separadamente (alimenta a Loja/vitrine e o fluxo de "compra de box avulsa").
- Os valores observados na referência são apenas ilustrativos; trate preços como **conteúdo dinâmico mockado** (ver `docs/front-office-dynamic-content-map.md`), nunca hardcoded em componentes.

### "Como funciona" e ciclo de entrega (alimenta Home, FAQ, Confirmação e área de pedidos)

- Três passos: **Assine** (planos mensal/anual + avulsas; vendas abertas até o último dia do mês) → **Receba em casa** (envio no mês seguinte ao da compra; ex.: compra em março, envio em abril; link de rastreio enviado por e-mail no despacho) → **Aproveite** (experiência mensal, nova imersão a cada box).
- Implicação: a Confirmação de pedido e a tela de pedidos da área do cliente devem comunicar claramente o **ciclo de cobrança vs. ciclo de envio** (cobra agora, envia no próximo mês) e o estado "aguardando despacho / rastreio disponível", já que esse descompasso é fonte comum de dúvida.

### Navegação, FAQ e conformidade

- Navegação pública mínima: Loja, Assinatura ("Assine"), o Clube ("o que é/o que tem"), FAQ/Dúvidas, acesso à conta e indicador de carrinho.
- FAQ deve cobrir: conceito do clube, o que vem na box, planos e preços, ciclo de cobrança (incl. permanência do anual), meios de pagamento, pagamento recusado, entrega/rastreio, prazo de envio (mês seguinte), cancelamento, suporte, privacidade/termos e contato.
- Banner de cookies/consentimento presente na referência — preveja um componente de consentimento no layout público (apenas UI mockada).

### Onde superar o benchmark (metas explícitas desta etapa)

1. Transformar a gamificação de "texto na home" em uma **área logada navegável** com progresso, desbloqueios por ciclo e arquivos.
2. Tornar **transparente o descompasso cobrança × envio** na confirmação e em "meus pedidos", reduzindo dúvidas.
3. Oferecer **área financeira e de assinatura** completas (faturas, recibos, próxima cobrança, atualização de cartão, renovação de Pix, cancelamento/reativação) — a referência expõe pouco disso publicamente.
4. Captura de preferências do assinante **integrada à jornada** de assinatura/checkout, em vez de um formulário avulso solto.

## Comandos Necessários

| Finalidade | Comando | Esperado em caso de sucesso |
|------------|---------|-----------------------------|
| Instalação | `pnpm install` | exit 0; lockfile sem mudança, salvo se dependências forem adicionadas intencionalmente |
| Servidor dev | `pnpm dev` | servidor Next dev inicia |
| Typecheck | `pnpm typecheck` | exit 0, sem erros TypeScript |
| Lint | `pnpm lint` | exit 0, sem erros ESLint |
| Build | `pnpm build` | exit 0, build de produção concluído |

## Ferramentas e Referências para o Executor

- Leia a documentação relevante do Next 16 antes de alterar rotas, metadata, imagens ou JSON-LD:
  - `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`
  - `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md`
- Use a estrutura `src` e os aliases existentes. O `tsconfig.json` define `"paths": { "@/*": ["./*"] }` (alias relativo à raiz), portanto o import correto é `@/src/...`, por exemplo `@/src/components/ui/button` e `@/src/lib/utils`. Confirme em `src/app/layout.tsx`.
- **Atenção (drift do `components.json`)**: o `components.json` está desatualizado em relação à estrutura real. Ele declara `"tailwind.css": "app/globals.css"` e aliases sem `src/` (`@/components`, `@/lib`, `@/components/ui`, `@/hooks`), mas os arquivos reais vivem em `src/app/globals.css`, `src/components/...`, `src/lib/...`. Antes de adicionar qualquer componente via CLI do shadcn, **atualize o `components.json`** para `"tailwind.css": "src/app/globals.css"` e aliases `@/src/components`, `@/src/lib`, `@/src/components/ui`, `@/src/hooks`, `@/src/lib/utils`. Caso contrário a CLI grava nos diretórios errados. Se preferir, crie os componentes manualmente seguindo o padrão de `src/components/ui/button.tsx`.
- Gerenciador de pacotes confirmado: **pnpm** (existem `pnpm-lock.yaml` e `pnpm-workspace.yaml`). Todos os comandos usam `pnpm`.
- `next.config.ts` está vazio. Se forem usadas imagens remotas (`next/image` com host externo) ou houver necessidade de configuração de imagem/metadata, adicione a config mínima necessária e documente o motivo.
- Use Tabler icons porque `components.json` define `"iconLibrary": "tabler"` e o projeto depende de `@tabler/icons-react`.

## Escopo

**Dentro do escopo**:

- Arquivos de rota, route groups, layouts, estados de loading/error/not-found, arquivos de sitemap/robots metadata e páginas em `src/app/**`.
- Componentes reutilizáveis de UI e de features em `src/components/**`.
- Adaptadores de dados, repositórios mockados, tipos de domínio, formatadores, helpers de SEO, helpers de carrinho/checkout e helpers de contratos futuros em `src/lib/**`.
- Hooks client-side em `src/hooks/**` quando a interação exigir Client Components.
- Assets mockados/placeholder e imagens de SEO/social em `public/**`, caso assets finais não existam.
- Documentação de contratos de API e mapa de conteúdo dinâmico em `docs/**`.
- `next.config.ts`, apenas se for necessário para configuração de imagens ou comportamento de metadata.
- `components.json`, apenas para corrigir os caminhos/aliases desatualizados descritos em "Ferramentas e Referências" antes de usar a CLI do shadcn.
- `package.json`, apenas se uma dependência de UI/form/teste for claramente necessária e justificada.

**Fora do escopo**:

- Chamadas reais de backend.
- Autenticação/sessão real e segura.
- Pagamento real, Pix real, tokenização real de cartão, integração com gateway, integração com transportadora, Omie, emissão de nota fiscal ou deploy de produção.
- Copiar UI, branding, textos, imagens ou composição visual da True Crime Club. Use-a somente como benchmark funcional.

## Fluxo Git

- Branch: `codex/front-office-telas`.
- Faça commits por marco lógico se estiver trabalhando manualmente. Mensagens sugeridas:
  - `feat: add front office data foundation`
  - `feat: build public commerce journey`
  - `feat: build customer area journey`
  - `docs: document future front office APIs`
- Não faça push nem abra PR sem instrução explícita.

## Mapa de Rotas a Implementar

Use route groups para separar layouts de loja pública e área privada sem alterar URLs:

- `src/app/(front-office)/layout.tsx` - header público, navegação, indicador do carrinho, footer, banner de cookies se necessário.
- `src/app/(front-office)/page.tsx` - Home.
- `src/app/(front-office)/loja/page.tsx` - listagem de produtos/boxes.
- `src/app/(front-office)/loja/[slug]/page.tsx` - detalhe de produto ou box.
- `src/app/(front-office)/assinatura/page.tsx` - planos de assinatura e explicação.
- `src/app/(front-office)/carrinho/page.tsx` - carrinho.
- `src/app/(front-office)/checkout/page.tsx` - checkout.
- `src/app/(front-office)/checkout/confirmacao/page.tsx` - confirmação de pedido.
- `src/app/(front-office)/faq/page.tsx` - FAQ e suporte.
- `src/app/(auth)/login/page.tsx` - login.
- `src/app/(auth)/cadastro/page.tsx` - cadastro.
- `src/app/(auth)/recuperar-senha/page.tsx` - recuperação de senha.
- `src/app/(cliente)/cliente/layout.tsx` - shell privado com sidebar/topbar. Apenas autenticação mockada.
- `src/app/(cliente)/cliente/pedidos/page.tsx` - pedidos.
- `src/app/(cliente)/cliente/pedidos/[id]/page.tsx` - detalhe do pedido, status, rastreio e placeholder de nota fiscal.
- `src/app/(cliente)/cliente/assinatura/page.tsx` - visão geral da assinatura.
- `src/app/(cliente)/cliente/assinatura/cancelar/page.tsx` - simulação de cancelamento.
- `src/app/(cliente)/cliente/financeiro/page.tsx` - cobranças, faturas, recibos e pagamento recusado.
- `src/app/(cliente)/cliente/financeiro/atualizar-cartao/page.tsx` - simulação de atualização de cartão.
- `src/app/(cliente)/cliente/conteudos/page.tsx` - hub de conteúdo exclusivo/gamificação.
- `src/app/(cliente)/cliente/conteudos/[slug]/page.tsx` - detalhe de caso/conteúdo com estados bloqueado/liberado.

## Tarefas de Modelo de Dados

Crie dados mockados tipados e funções de acesso que imitem os limites das APIs futuras:

- `src/lib/domain/types.ts`: `Product`, `Box`, `SubscriptionPlan`, `Customer`, `Address`, `PaymentMethod`, `Cart`, `CartItem`, `Order`, `OrderStatus`, `Payment`, `PaymentStatus`, `Invoice`, `Subscription`, `SubscriptionStatus`, `ExclusiveContent`, `ContentStatus`, `DynamicContentBlock`, `SeoEntry`.
- Tipos da gamificação/mistério (derivados das "Notas do Benchmark"): `Case` (caso fictício investigado ao longo do ano), `Clue` (pista por ciclo, com `status: liberado | bloqueado`, ciclo de liberação e arquivos associados), `CaseFile` (documento/evidência baixável), `SubscriberProgress` (pistas coletadas vs. total, ciclo atual, data do evento ao vivo final). Estes tipos sustentam a área logada de conteúdo exclusivo, que é o principal vetor para superar o benchmark.
- `src/lib/domain/mock-data.ts`: registros mockados realistas para todas as entidades listadas em `docs/escopo-frontend.md:175-194`.
- `src/lib/domain/repositories.ts`: funções mockadas de leitura/escrita como `listProducts`, `getProductBySlug`, `listPlans`, `getCart`, `addCartItem`, `calculateShipping`, `applyCoupon`, `createOrder`, `getCurrentCustomer`, `listOrders`, `getSubscription`, `cancelSubscription`, `reactivateSubscription`, `listPayments`, `renewPixPayment`, `updateCard`, `listExclusiveContent`, `getDynamicContent`, `getActiveCase`, `listClues`, `getClueBySlug`, `getSubscriberProgress`.
- `src/lib/domain/scenarios.ts`: alternadores de cenário para vazio, carregando, erro, sucesso, bloqueado, pendente, produto indisponível, pagamento recusado, Pix pendente, assinatura cancelada e reativação disponível.
- `src/lib/formatters.ts`: moeda, data, labels de status e labels de região/frete.

**Verificar**: `pnpm typecheck` -> exit 0.

## Tarefas de Componentes

Crie componentes reutilizáveis antes de compor as páginas:

- Layout/navegação: header público, navegação mobile, links de conta/carrinho, breadcrumbs, footer e shell privado do cliente.
- Comércio: hero, faixa de conteúdo, grid/lista de produtos, card de produto, controles de filtro/ordenação, bloco de preço, badge de disponibilidade, card de plano, comparação de planos, estimador de frete, campo de cupom, resumo do carrinho, stepper de checkout e painel de pedido concluído.
- Formulários: campos de conta, formulário de recuperação de senha, formulário de endereço, seletor de meio de pagamento, instruções de Pix e formulário de preferências para camiseta/calçado ou preferências futuras do assinante.
- Conta: timeline de status, card/detalhe de pedido, painel de status da assinatura, painel da próxima cobrança, painel da box do ciclo atual e painéis de cancelamento/reativação.
- Financeiro: tabela de histórico de cobranças, linhas de fatura/recibo, alerta de pagamento recusado, ação para renovar Pix e formulário de atualização de cartão.
- Conteúdo/gamificação: card de caso, tracker de progresso, overlay bloqueado, lista de arquivos/downloads e layout de detalhe de conteúdo.
- Estados: vazio, skeletons de carregamento, painéis de erro, alertas/toasts de sucesso e banners bloqueado/pendente.
- SEO: componente de script JSON-LD que escape `<` como `\u003c`, componente de dados estruturados de breadcrumb e componente de dados estruturados de produto.

**Verificar**: `pnpm lint` -> exit 0.

## Etapa 1: Estabelecer a Fundação do Front Office

1. Atualize o idioma do layout raiz para `pt-BR` (`src/app/layout.tsx` hoje usa `lang="en"`).
2. Corrija o `components.json` (caminho de CSS para `src/app/globals.css` e aliases com `src/`) **antes** de usar a CLI do shadcn, conforme "Ferramentas e Referências".
3. Defina route groups e layouts compartilhados para áreas pública, auth e cliente.
4. Substitua a Home placeholder pela rota pública de Home.
5. Crie uma primeira versão dos tokens do design system em `src/app/globals.css` apenas quando necessário, mantendo compatibilidade com shadcn/Tailwind 4.
6. Crie a camada de domínio mockada tipada e os repositórios listados acima.
7. Garanta que todas as páginas importem dados mockados por funções de repositório, não por arrays crus diretamente.

**Verificar**: `pnpm typecheck` -> exit 0; `pnpm lint` -> exit 0.

## Etapa 2: Construir as Telas Públicas de Comércio

1. Home: comunicar a promessa do clube, ciclo/box em destaque, produtos em destaque, CTA de assinatura, resumo de confiança/suporte e teaser de conteúdo exclusivo recente.
2. Loja: listar produtos/boxes com ordenação, filtros, estados de disponibilidade, preço de assinante, preço regular, breadcrumbs e estado vazio.
3. Detalhe de produto/box: galeria, descrição, itens incluídos, estoque/disponibilidade, benefício de assinante, quantidade/adicionar ao carrinho, produtos relacionados e JSON-LD estruturado de produto.
4. Assinatura: cards de plano mensal/anual/avulso, plano recomendado, benefícios, "como funciona", notas de cobrança/frete/cancelamento e entrada para captura de preferências de assinante.
5. FAQ: cobrir conceito, conteúdos, planos/preços, ciclo de cobrança, meios de pagamento, pagamento recusado, entrega/frete, cancelamento, suporte e links de termos/privacidade.

**Verificar**: abra cada rota pública localmente via `pnpm dev`; nenhuma rota deve mostrar conteúdo placeholder; `pnpm typecheck` e `pnpm lint` devem passar.

## Etapa 3: Construir Fluxos de Carrinho, Checkout e Confirmação

1. Carrinho: lista de itens, controles de quantidade, ação de remover, simulação de cupom, estimativa de frete por CEP/região, totais, estado de carrinho vazio e CTA para checkout.
2. Checkout: etapa de conta/login, etapa de endereço, etapa de frete, etapa de pagamento com opções mockadas de cartão e Pix, etapa de preferências para assinatura, etapa de revisão e estados pendente/erro/sucesso.
3. Confirmação: número do pedido, status de pagamento, status de assinatura quando aplicável, próximos passos, placeholder de rastreio e links para área do cliente.
4. Mantenha todas as ações somente mockadas, mas com estado suficiente para validar a jornada no navegador.

**Verificar**: a partir de Home/Loja/Assinatura, o usuário deve conseguir chegar à confirmação nos cenários de produto, box avulsa e assinatura sem chamadas de backend.

## Etapa 4: Construir Auth e Área do Cliente

1. Login, cadastro e recuperação de senha simulam estados de sucesso/erro e direcionam o usuário para `/cliente/pedidos` ou para o caminho de retorno pretendido.
2. Shell privado: sidebar/topbar com pedidos, assinatura, financeiro, conteúdos, resumo de conta e logout mockado.
3. Pedidos: lista de pedidos, status, página de detalhe, timeline, itens, status de pagamento, placeholder de rastreio e placeholder de nota fiscal.
4. Minha assinatura: plano, status, próxima cobrança, box do ciclo atual, pagamento pendente, cancelamento e reativação quando aplicável.
5. Financeiro: histórico de cobranças, faturas, recibos, pagamento recusado, renovação de Pix e fluxo de atualização de cartão.
6. Conteúdos (gamificação): apresente o caso ativo como **linha do tempo de pistas** por ciclo, com pistas liberadas e bloqueadas (estado `bloqueado` com motivo "libera no próximo ciclo"), arquivos/evidências baixáveis por pista, **tracker de progresso do assinante** (pistas coletadas vs. total) e teaser/contagem para o evento ao vivo final. Páginas de detalhe por pista/conteúdo com estados liberado/bloqueado. Esta tela deve superar o benchmark tornando a mecânica navegável e mensurável (ver "Notas do Benchmark").

**Verificar**: todas as rotas da área do cliente devem ser alcançáveis pelo shell privado; páginas privadas devem incluir metadata `noindex`; cenários de status devem ser inspecionáveis com mock data.

## Etapa 5: Implementar SEO e Metadata

1. Adicione `metadata` estático/dinâmico ou `generateMetadata` nas páginas públicas.
2. Adicione canonical URLs e metadata de Open Graph/Twitter.
3. Adicione breadcrumbs visíveis e JSON-LD de breadcrumbs.
4. Adicione JSON-LD de produto nas páginas de detalhe de produto/box.
5. Adicione `src/app/sitemap.ts` e `src/app/robots.ts`.
6. Use `next/image` com width/height ou `fill` mais dimensões estáveis no elemento pai e `sizes` para imagens responsivas.
7. Garanta que páginas privadas/auth tenham metadata `noindex`.

**Verificar**: `pnpm build` -> exit 0; inspecione páginas públicas geradas e confirme que metadata está presente.

## Etapa 6: Documentar Contratos de API Futuros e Conteúdo Dinâmico

Crie ou atualize documentos em `docs/`:

- `docs/front-office-api-contracts.md`: uma seção por grupo de `docs/escopo-frontend.md:257-315`: Cliente, Catálogo, Carrinho e Checkout, Pedidos, Assinatura, Pagamentos, Conteúdo e Dynamic Content.
- Cada API deve incluir método, endpoint, descrição, onde é usada, exemplo de request, exemplo de response, erros e observações de regra de negócio.
- `docs/front-office-dynamic-content-map.md`: todos os blocos de texto/banner/imagem/conteúdo usados por páginas públicas, auth e área do cliente; inclua chave, rota, tipo, valor mockado de fallback, owner esperado no Backoffice e notas.
- `docs/front-office-route-map.md`: rotas, finalidade, repositório mockado usado, estratégia de SEO e regra de autenticação/indexação.

**Verificar**: a documentação deve cobrir todas as páginas implementadas e toda função de repositório mockado que represente uma chamada futura de backend.

## Etapa 7: QA Final de UX, Responsividade e Estados

1. Valide layouts desktop e mobile em todas as rotas.
2. Confirme que não há texto sobreposto, botões estourando, cards redimensionando indevidamente em hover/conteúdo dinâmico, e que UIs repetidas usam dimensões estáveis quando apropriado.
3. Confirme a existência dos estados exigidos: vazio, carregando, erro, sucesso, bloqueado e pendente.
4. Confirme que os fluxos de carrinho/checkout/conta continuam compreensíveis sem texto técnico explicando funcionamento interno na UI.
5. Confirme que o resultado supera o benchmark ao tornar as jornadas de conta, assinatura, financeiro e conteúdo mais coerentes e fáceis de navegar do que a referência.

**Verificar**: `pnpm typecheck`, `pnpm lint` e `pnpm build` devem finalizar com exit 0.

## Plano de Testes

O repo atualmente não tem script de testes. Não adicione um framework completo de testes sem instrução. No mínimo, use estes gates:

- `pnpm typecheck` para correção TypeScript.
- `pnpm lint` para qualidade estática.
- `pnpm build` para prontidão do build de produção Next.
- QA manual no navegador via `pnpm dev` para os três fluxos principais:
  - Compra de produto/box: Home ou Loja -> detalhe -> carrinho -> checkout -> confirmação.
  - Assinatura: Home ou Assinatura -> selecionar plano -> preferências -> checkout -> confirmação -> cliente/assinatura.
  - Jornada do cliente: login -> pedidos -> assinatura -> financeiro -> conteúdos -> detalhe de conteúdo.

Se a adição de testes for aprovada, priorize testes focados de componente/domínio para repositórios mockados, totais de carrinho, cálculos de frete/cupom, transições de status de assinatura e transições de status de pagamento.

## Progresso do reconcile (2026-06-25, HEAD `fe41adc`)

Verificado spot-check no commit atual. **Não marcar DONE** até todos os critérios abaixo passarem.

| Etapa | Situação | Evidência |
|-------|----------|-----------|
| 1 — Fundação | Concluída | `lang="pt-BR"`, route groups, domínio mockado, `components.json` corrigido |
| 2 — Comércio público | Concluída | Home, Loja, `[slug]`, Assinatura, FAQ navegáveis; breadcrumbs inline em detalhe |
| 3 — Carrinho/checkout | Parcial | Carrinho rico (cupom, frete, vazio); checkout single-page; confirmação com notas de ciclo; **falta stepper, preferências e fluxo assinatura completo** |
| 4 — Auth + cliente | Concluída | 19 rotas no build; gamificação com progresso/pistas bloqueadas |
| 5 — SEO | Não iniciada | Sem `sitemap.ts`/`robots.ts`, sem `generateMetadata` por rota, sem JSON-LD; `getSeoEntry` existe mas não é consumido |
| 6 — Docs | Não iniciada | `docs/front-office-api-contracts.md`, `docs/front-office-dynamic-content-map.md`, `docs/front-office-route-map.md` ausentes |
| 7 — QA final | Parcial | Build/typecheck OK; lint falha; sem arquivos `loading/error/not-found`; cookie consent ausente |

**Próximo executor**: retomar na **Etapa 5** (SEO), depois **Etapa 6** (docs), depois fechar lacunas das Etapas 3 e 7. Rodar `pnpm lint --fix` ou corrigir manualmente os 9 erros Prettier antes de marcar DONE.

## Critérios de Conclusão

Todos devem ser verdadeiros:

- [x] Toda rota em "Mapa de Rotas a Implementar" existe e é navegável.
- [x] O fluxo público de compra de produto/box funciona com mocks.
- [ ] O fluxo de assinatura funciona com mocks e captura preferências do assinante.
- [x] Os fluxos da área do cliente funcionam com mocks para pedidos, assinatura, financeiro e conteúdo exclusivo.
- [x] Os mock data cobrem toda entidade exigida em `docs/escopo-frontend.md:175-194`.
- [ ] A documentação de APIs futuras cobre todo grupo exigido em `docs/escopo-frontend.md:257-315`.
- [ ] O mapa de conteúdo dinâmico existe e inclui textos, banners, imagens, texto de SEO, entradas de FAQ, copy de planos e conteúdo configurável da área do cliente.
- [ ] SEO existe para páginas públicas, incluindo metadata, Open Graph/Twitter, sitemap, robots, breadcrumbs visíveis, JSON-LD de produto e JSON-LD de breadcrumbs.
- [ ] Páginas privadas/auth têm comportamento `noindex`.
- [ ] O layout responsivo foi validado em mobile e desktop.
- [x] `pnpm typecheck` finaliza com exit 0.
- [ ] `pnpm lint` finaliza com exit 0.
- [x] `pnpm build` finaliza com exit 0.
- [ ] A linha de status em `plans/README.md` foi atualizada.

## Condições de Parada

Pare e reporte se:

- Arquivos de escopo (`docs/escopo-frontend.md`, `package.json`, `src/app/layout.tsx`, camada `src/lib/domain/**`) divergirem materialmente da seção "Estado atual" **sem** atualizar este plano via reconcile.
- A documentação do Next 16 contradizer qualquer abordagem de rotas, metadata, imagens ou JSON-LD deste plano.
- Implementar uma página exigir credenciais reais de backend, chamadas reais de pagamento/gateway, autenticação real ou integração real de frete.
- Assets/copy finais de design forem obrigatórios e estiverem indisponíveis; use placeholders mockados somente se Produto/Design aceitarem isso para esta etapa.
- Uma nova dependência parecer necessária para lógica central de comércio/auth/pagamento; pause e justifique antes de adicionar.
- `pnpm build` falhar duas vezes após tentativas razoáveis de correção.

## Notas de Manutenção

- Mantenha os mocks no formato esperado das respostas futuras de API para que a integração com backend possa substituir os repositórios sem reescrever páginas.
- Evite embutir copy comercial ou escolhas de imagem diretamente em componentes quando esses itens devem se tornar conteúdo dinâmico gerenciado pelo Backoffice.
- Revisores devem avaliar especialmente coerência de fluxo, responsividade, correção de metadata e se os estados mockados revelam claramente os requisitos de backend.
- O benchmark deve orientar cobertura funcional, não direção visual. A identidade do novo produto deve vir do design system validado e do handoff futuro de Design.
