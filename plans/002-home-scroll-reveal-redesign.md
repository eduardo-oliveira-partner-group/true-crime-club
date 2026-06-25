# Plano 002: Transformar a Home em uma experiência de abertura da caixa

> **Instruções para o executor**: siga este plano passo a passo. Rode todos os
> comandos de verificação e confirme o resultado esperado antes de avançar para
> a próxima etapa. Se alguma situação da seção "Condições de parada" acontecer,
> pare e reporte. Ao finalizar, atualize a linha deste plano em
> `plans/README.md`.
>
> **Verificação de drift (rode primeiro)**:
> `git diff --stat e8847fa..HEAD -- 'src/app/(front-office)/page.tsx' src/components/ui/scroll-reveal.tsx src/components/ui/glowing-card.tsx src/lib/domain/mock-data.ts src/lib/domain/types.ts src/assets/images/home plans/README.md`
> Se qualquer arquivo em escopo mudou desde que este plano foi escrito, compare
> os trechos da seção "Estado atual" com o código vivo antes de prosseguir. Se
> houver divergência material no hero, na seção "O que vem na caixa", nos cards
> de planos ou nos dados de planos, trate como condição de parada.

## Status

- **Prioridade**: P1
- **Esforço**: L
- **Risco**: MED
- **Depende de**: nenhum
- **Categoria**: direção
- **Planejado em**: commit `e8847fa`, 2026-06-25

## Por que isso importa

A Home atual já tem uma estética forte no topo, mas depois do banner a página
volta a uma sequência de blocos escuros com grids e cards semelhantes. Isso
reduz a sensação de descoberta que o próprio produto promete: cada box deveria
parecer uma entrega de evidências, cada seção deveria funcionar como a próxima
pista e os planos deveriam parecer uma decisão de entrada no caso, não apenas
uma tabela de preços. Este plano transforma o banner em uma cena de abertura da
caixa, conecta visualmente as seções seguintes e redesenha os cards de planos
sem alterar preços, rotas, dados mockados ou CTAs comerciais.

## Estado atual

- O produto quer uma experiência de assinatura investigativa e colecionável:
  `README.md:11-29` descreve a plataforma como clube de boxes em que o usuário
  monta um dossiê e participa de uma narrativa coletiva.
- A direção sensorial documentada pede "investigação sofisticada", "arquivo
  confidencial", pistas reveladas aos poucos e storytelling com conversão
  (`README.md:31-61`; `design.md:20-59`).
- `design.md:82-90` recomenda imagens reais ou materiais que mostrem produto,
  box, pistas, documentos e itens colecionáveis; cards e áreas de conteúdo devem
  ser tratados como peças organizadas de um dossiê.
- `design.md:128-132` define que a Home deve comunicar imediatamente clube, box,
  mistério, colecionismo e valor premium.
- A Home vive em `src/app/(front-office)/page.tsx` e hoje é um Server Component.
  Ela busca conteúdo dinâmico, produtos, planos, caso ativo e progresso nas
  linhas `144-162`.
- O hero atual usa uma única imagem estática `heroBanner` importada de
  `src/assets/images/home/hero-banner.png` e renderizada com `next/image` nas
  linhas `166-179`. Essa imagem deve continuar exibindo o mesmo homem segurando
  a caixa; o fundo pode mudar, mas o sujeito e a caixa precisam permanecer como
  sinal principal do primeiro viewport.
- O título do hero usa recortes de papel e `EncryptedText` nas linhas `190-243`.
  Preserve esse DNA visual ou uma versão claramente evoluída dele.
- A seção "O que é o Club?" começa imediatamente após o hero nas linhas
  `320-425`; ela usa `clubOverviewBg`, um bloco centralizado e quatro
  `GlowingCard`.
- A seção "O que vem na caixa" está nas linhas `427-504`. Hoje ela renderiza
  `boxCategories` como cinco cards equivalentes em grid (`458-484`) e uma "Nota
  do arquivo" (`486-502`).
- A seção "Investigação contínua" nas linhas `506-610` já é o bloco mais próximo
  da direção desejada: tem fundo de dossiê, texto forte, painel de progresso e
  dados do caso.
- A seção "Como funciona?" nas linhas `612-656` volta ao padrão de três cards
  simples, todos em `GlowingCard`.
- A seção de planos nas linhas `658-723` renderiza `plans.map(...)` com cards
  similares; o plano recomendado só ganha um badge "Melhor escolha" (`685-689`).
- O CTA final nas linhas `847-880` é um bloco vermelho sólido. Ele chama atenção,
  mas quebra a atmosfera investigativa de forma brusca.
- `GlowingCard` em `src/components/ui/glowing-card.tsx:12-40` é genérico e
  reutilizado em muitas partes da Home; isso contribui para a repetição visual.
- `ScrollReveal` em `src/components/ui/scroll-reveal.tsx:1-120` já usa
  `motion/react` para entrada em viewport, mas não existe ainda animação
  vinculada ao progresso de scroll.
- Os planos vêm de `src/lib/domain/mock-data.ts:209-257`: Mensal, Anual e Box
  Avulsa. O Anual tem `isRecommended: true`, `commitmentMonths: 12`, `price` de
  `143880` e `pricePerMonth` de `11990`. Preserve esses dados.
- O tipo `SubscriptionPlan` está em `src/lib/domain/types.ts:38-49`. Não adicione
  campos obrigatórios a esse tipo para resolver apenas aparência da Home.
- Assets disponíveis hoje:
  - `src/assets/images/home/hero-banner.png`
  - `src/assets/images/home/club-overview-bg.png`
  - `src/assets/images/home/box-contents-bg.png`
  - `src/assets/images/home/investigation-continuous-bg.png`
  - `src/assets/images/home/previous-boxes-banner.png`
  - `src/assets/images/products/box-01.jpg` a `box-04.jpg`
- O `AGENTS.md` exige consultar docs locais do Next antes de alterar código.
  Para este plano, leia pelo menos:
  - `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
  - `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
- As notas relevantes desses docs são: pages/layouts do App Router são baseados
  em filesystem; páginas são Server Components por padrão; use Client Components
  apenas para interatividade, browser APIs ou hooks; quando marcar um arquivo
  com `"use client"`, todos os imports dele entram no bundle client; imagens
  locais importadas estaticamente funcionam com `next/image` e podem usar
  `placeholder="blur"`, `fill` e `sizes` desde que o pai tenha dimensões
  estáveis.

## Comandos necessários

| Finalidade | Comando | Esperado em caso de sucesso |
|------------|---------|-----------------------------|
| Instalação | `pnpm install` | exit 0; lockfile sem mudança, salvo se dependência for adicionada intencionalmente |
| Servidor dev | `pnpm dev` | servidor Next inicia; use a porta informada pelo terminal |
| Typecheck | `pnpm typecheck` | exit 0, sem erros TypeScript |
| Lint | `pnpm lint` | exit 0, sem erros ESLint/Prettier |
| Build | `pnpm build` | exit 0, build de produção concluído |

## Ferramentas sugeridas para o executor

- Use a skill `frontend-design`, se disponível, para preservar qualidade visual
  e responsividade.
- Use a skill `investigation-section-designer`, se disponível, para calibrar a
  linguagem visual de dossiê, evidência, arquivo e abertura da caixa.
- Se gerar ou editar bitmap, use apenas para fundos/placas atmosféricas. Mantenha
  textos, preços, CTAs, benefícios e links como React/HTML editável.

## Escopo

**Dentro do escopo**:

- `src/app/(front-office)/page.tsx`
- Novos componentes em `src/components/home/**` ou
  `src/components/sections/**`, se o executor optar por extrair a Home.
- Novos componentes utilitários em `src/components/ui/**` apenas quando forem
  reaproveitáveis e pequenos.
- Novos assets derivados em `src/assets/images/home/**`, se necessários para
  estados da caixa, fundo do hero ou textura de dossiê.
- `src/app/globals.css`, somente para utilitários globais indispensáveis, como
  keyframes sem equivalente prático em Tailwind.
- `plans/README.md`, apenas para atualizar o status deste plano ao final.

**Fora do escopo**:

- Alterar preços, slugs, features ou nomes dos planos em
  `src/lib/domain/mock-data.ts`.
- Alterar contratos de `SubscriptionPlan` em `src/lib/domain/types.ts`, salvo se
  houver necessidade clara e opcional para apresentação.
- Alterar rotas de checkout, loja, assinatura, área do cliente ou layout global.
- Trocar o homem/caixa do hero por outra pessoa ou por uma caixa diferente.
- Achatar textos comerciais, preços ou botões em imagem.
- Adicionar dependências novas de animação sem justificar; `motion` já existe.
- Implementar backend, analytics real, CMS ou personalização por usuário real.

## Fluxo Git

- Branch sugerida: `codex/home-scroll-reveal-redesign`.
- Mensagem de commit sugerida: `feat: add scroll-driven home reveal`.
- Não faça push nem abra PR sem instrução explícita.
- Se houver alterações não relacionadas no working tree, não reverta. Trabalhe
  somente nos arquivos do escopo e registre qualquer conflito como condição de
  parada.

## Direção visual obrigatória

1. **Hero como cena, não apenas banner**: o primeiro viewport deve mostrar o
   mesmo homem com a caixa como sinal principal. O fundo pode virar mesa de
   investigação, arquivo confidencial, luz de bancada ou parede de evidências,
   mas sem gore, arma, cena de crime explícita ou estética de terror genérico.
2. **Abertura da caixa no scroll**: ao rolar, a caixa deve parecer ganhar foco,
   liberar luz ou revelar pistas. A animação pode ser ilusão CSS/transform com a
   imagem atual, ou pode usar assets derivados de caixa fechada/semiaberta/aberta
   caso existam.
3. **Próxima seção emerge da caixa**: "O que vem na caixa" deve aparecer como
   conteúdo revelado, não como grid independente.
4. **Planos como escolha de entrada no caso**: Mensal, Anual e Avulsa devem ter
   identidades visuais distintas, preservando clareza comercial.
5. **Storytelling com conversão**: toda estética investigativa precisa apoiar
   CTA, preço, planos, loja e assinatura. Não esconda preço ou CTA em nome da
   atmosfera.

## Etapa 1: Isolar a animação do hero em um Client Component

1. Crie um Client Component para o hero, por exemplo
   `src/components/home/hero-case-reveal.tsx`, começando com `"use client"`.
2. Mantenha `src/app/(front-office)/page.tsx` como Server Component. Ele deve
   continuar buscando `getDynamicContent`, `listProducts`, `listPlans`,
   `getActiveCase` e `getSubscriberProgress`, e passar props serializáveis para
   o componente client.
3. Use `motion/react` com `useScroll`, `useTransform` e `useReducedMotion`.
4. Não importe repositórios, dados mockados ou funções server-only dentro do
   Client Component.
5. Preserve o render inicial legível antes da hidratação: título, copy, CTAs e
   imagem devem aparecer mesmo se a animação ainda não estiver ativa.

**Verificar**: `pnpm typecheck` -> exit 0. Confirme que nenhum erro reclama de
props não serializáveis entre Server e Client Component.

## Etapa 2: Construir o hero sticky com progresso de scroll

1. Substitua o `<section>` atual do hero (`page.tsx:166-318`) por uma seção
   com altura aproximada de `min-h-[160vh]` a `min-h-[220vh]` e um conteúdo
   interno `sticky top-0 min-h-screen`.
2. Preserve os elementos essenciais do hero:
   - badge "Primeiro Clube de True Crime do Brasil";
   - título de recortes de papel;
   - subtitle dinâmico;
   - CTA para `/assinatura`;
   - CTA secundário para `/loja`;
   - itens de confiança;
   - "Caso em andamento" e "Ciclo atual".
3. Defina transforms por progresso:
   - `0.00-0.25`: hero como hoje, texto dominante.
   - `0.25-0.55`: texto reduz opacidade/escala; imagem do homem/caixa aproxima
     levemente; fundo ganha foco na caixa.
   - `0.55-0.80`: glow interno da caixa aparece; linhas/etiquetas de evidência
     surgem em torno dela.
   - `0.80-1.00`: uma faixa/porta visual prepara a seção seguinte.
4. O efeito de "abrir a caixa" pode ser feito de duas formas:
   - **Sem novo asset**: use uma camada escura sobre a tampa, `clip-path`,
     `scaleY`, rotação sutil e glow dourado/vermelho vindo da região da caixa.
   - **Com assets derivados**: crie imagens em `src/assets/images/home/` com
     nomes explícitos, por exemplo `hero-box-closed.png`,
     `hero-box-opening.png`, `hero-box-open.png`, e cruze opacidades conforme o
     scroll. Use `next/image` e `placeholder="blur"` quando o import estático
     permitir.
5. Use `useReducedMotion` para desligar transformações contínuas. Quando
   reduzido, renderize uma versão estática com a caixa destacada e um separador
   visual claro para a seção seguinte.

**Verificar**: `pnpm lint` -> exit 0. Com `pnpm dev`, abra a Home no desktop e
confirme visualmente que o primeiro viewport mostra o mesmo homem segurando a
caixa e que a rolagem do hero não oculta CTAs antes de o usuário poder vê-los.

## Etapa 3: Fazer "O que vem na caixa" emergir do reveal

1. Redesenhe a seção `page.tsx:427-504` para parecer uma bancada de abertura da
   caixa, não um grid comum.
2. Preserve o array `boxCategories` como fonte textual, mas mude a composição:
   - um item principal maior, representando a evidência em destaque;
   - quatro fichas menores posicionadas em grid assimétrico;
   - etiquetas "01" a "05" como marcadores de evidência;
   - linhas, lacres, abas ou tags discretas ligando a caixa aos itens.
3. Transforme a "Nota do arquivo" em uma ficha lateral ou rodapé de dossiê,
   mantendo a mensagem essencial: cada edição recebe uma seleção de alguns itens,
   não todas as categorias.
4. Evite usar `GlowingCard` em todos os itens. Crie uma variação visual como
   `EvidenceTile`, `DossierNote` ou similar, com borda fina, fundo de papel
   escuro/quente, textura discreta e hierarquia própria.
5. Em mobile, a composição deve virar lista vertical clara, sem elementos
   absolutos que encubram texto.

**Verificar**: `pnpm typecheck` -> exit 0. No navegador, confira que os cinco
títulos de `boxCategories` continuam visíveis e que a nota de curadoria continua
legível em desktop e mobile.

## Etapa 4: Unificar a narrativa entre "O Club", "Investigação" e "Como funciona"

1. Revise a seção "O que é o Club?" (`page.tsx:320-425`) para funcionar como
   continuação do reveal. Ela pode virar uma faixa "arquivo aberto" com menos
   cards equivalentes e mais ritmo editorial.
2. Use a seção "Investigação contínua" (`page.tsx:506-610`) como referência de
   força visual: painel de dados, escala de título, bordas de dossiê e fundo
   fotográfico com overlay.
3. Redesenhe "Como funciona?" (`page.tsx:612-656`) como uma timeline horizontal
   ou vertical de caso:
   - 01 Assine: registro de entrada;
   - 02 Receba em casa: despacho da caixa;
   - 03 Investigue: abertura da pista e avanço no caso.
4. Não transforme cada passo em outro card genérico. Use conectores, linha de
   progresso, selos ou pequenos painéis de processo.
5. Preserve o texto de `howItWorks` e os ícones existentes, salvo ajustes
   pequenos de copy visual dentro do próprio componente.

**Verificar**: `pnpm lint` -> exit 0. A Home deve contar uma sequência visual:
hero abre a caixa -> itens aparecem -> pistas/caso avançam -> usuário entende
como participar.

## Etapa 5: Redesenhar os cards dos planos como dossiês de escolha

1. Substitua a aparência atual dos cards em `page.tsx:678-721` por uma composição
   com identidade por tipo de plano:
   - **Plano Mensal**: "entrada recorrente no caso"; visual de ficha ativa.
   - **Plano Anual**: "arquivo completo"; destaque premium, selo recomendado,
     borda mais forte e indicação de compromisso de 12 meses se
     `commitmentMonths` existir.
   - **Box Avulsa**: "caso isolado"; visual de ficha arquivada ou edição avulsa.
2. Preserve exatamente:
   - `formatCurrency(plan.pricePerMonth)` quando `pricePerMonth` existir;
   - fallback `formatCurrency(plan.price)`;
   - link `href={`/checkout?plano=${plan.slug}`}`;
   - todas as features renderizadas hoje por `plan.features.slice(0, 4)`.
3. Para o plano recomendado, o destaque deve ser perceptível além do badge:
   borda dourada/vermelha, selo de arquivo, pequena faixa de "melhor escolha" ou
   maior presença visual. Não aumente tanto a altura a ponto de quebrar o grid.
4. Adicione microcopy comercial clara quando derivável dos dados:
   - se `billingInterval === 'annual'` e `commitmentMonths` existe, mostrar
     "permanência de 12 meses";
   - se `billingInterval === 'one_time'`, mostrar "sem recorrência";
   - se `billingInterval === 'monthly'`, mostrar "cancele quando quiser".
5. Não altere `mockPlans`; derive esses rótulos no componente ou em helper local.

**Verificar**: `pnpm typecheck` -> exit 0. No navegador, confirme que os três
planos aparecem, o anual segue recomendado, os preços continuam corretos e cada
CTA vai para `/checkout?plano=mensal`, `/checkout?plano=anual` e
`/checkout?plano=avulso`.

## Etapa 6: Reintegrar loja e CTA final à atmosfera

1. Preserve a seção "Loja e edições avulsas" e os cards de produto
   (`page.tsx:725-845`), mas revise espaçamentos/transição para ela não parecer
   uma página separada colada na Home.
2. O CTA final (`page.tsx:847-880`) deve deixar de ser apenas uma faixa vermelha
   sólida. Transforme-o em alerta/dossiê de fechamento:
   - fundo escuro ou vermelho controlado;
   - selo "arquivo prestes a fechar" ou equivalente;
   - CTA forte para `/assinatura`;
   - copy legível e sem excesso narrativo.
3. Garanta que o vermelho continue sendo cor de ação, não pano de fundo
   dominante que apaga a atmosfera.

**Verificar**: `pnpm lint` -> exit 0. O final da página deve continuar tendo CTA
visível e contraste suficiente.

## Etapa 7: Responsividade, acessibilidade e performance visual

1. Teste pelo menos estes viewports:
   - desktop próximo de `1280x720`;
   - desktop alto/largo próximo de `1440x900`;
   - mobile próximo de `390x844`.
2. Em mobile, o hero não deve exigir rolagem longa demais antes de mostrar os
   CTAs; se necessário, reduza o trecho sticky em telas pequenas.
3. Nenhum texto deve sobrepor imagem de forma ilegível. Use overlays, sombras e
   containers sem transformar tudo em card.
4. Botões precisam manter área clicável confortável e texto sem quebra estranha.
5. Imagens com `fill` precisam ter pai `relative` e dimensões estáveis
   (`min-h`, `aspect-ratio` ou constraints equivalentes), seguindo os docs de
   imagem do Next.
6. Respeite `prefers-reduced-motion` via `useReducedMotion` para movimentos
   vinculados ao scroll. Entrada simples por `ScrollReveal` pode permanecer.
7. Não use texto dentro de imagem para conteúdo comercial ou SEO. O logo dentro
   da foto da caixa pode permanecer por ser parte do produto fotografado, mas
   títulos e CTAs devem continuar em React.

**Verificar**: `pnpm build` -> exit 0. No navegador, confirme manualmente desktop
e mobile: sem overlap, sem textos cortados, sem hero vazio, sem seção inacessível
por causa do sticky.

## Plano de teste

- Não há suíte de testes automatizados configurada no repo além de typecheck,
  lint e build. Não invente um framework de testes neste plano.
- Rode:
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm build`
- Rode `pnpm dev` e valide manualmente:
  - Home carrega sem erro;
  - hero mostra o mesmo homem segurando a caixa;
  - scroll do hero revela a próxima seção;
  - `prefers-reduced-motion` não deixa a Home quebrada;
  - os cinco itens de `boxCategories` continuam visíveis;
  - os três planos continuam com preços, features e links corretos;
  - CTA final leva para `/assinatura`;
  - mobile não tem sobreposição de texto.

## Critérios de conclusão

- [ ] `pnpm typecheck` sai com exit 0.
- [ ] `pnpm lint` sai com exit 0.
- [ ] `pnpm build` sai com exit 0.
- [ ] A Home mantém `src/app/(front-office)/page.tsx` como Server Component ou
      isola qualquer `"use client"` em componentes menores.
- [ ] O hero exibe o mesmo homem segurando a caixa no primeiro viewport.
- [ ] O scroll do hero tem reveal perceptível da caixa e prepara a seção
      seguinte.
- [ ] A seção "O que vem na caixa" não é apenas cinco `GlowingCard` equivalentes.
- [ ] Os planos Mensal, Anual e Box Avulsa têm hierarquia visual própria sem
      alteração de dados mockados.
- [ ] O plano Anual continua marcado como recomendado.
- [ ] CTAs existentes continuam apontando para `/assinatura`, `/loja` e
      `/checkout?plano=<slug>` conforme o estado atual.
- [ ] `plans/README.md` está atualizado com o status deste plano.

## Condições de parada

Pare e reporte se:

- O código vivo do hero, dos planos ou dos dados de planos não corresponder aos
  trechos citados em "Estado atual".
- A animação de abertura exigir trocar o homem/caixa por outra pessoa ou por um
  produto diferente.
- A solução exigir adicionar dependência de animação nova para algo que `motion`
  já cobre.
- A melhoria visual exigir alterar preços, slugs, features ou contratos de dados.
- O sticky scroll ficar intratável em mobile após duas tentativas razoáveis de
  simplificação.
- `pnpm typecheck`, `pnpm lint` ou `pnpm build` falhar duas vezes após correções
  razoáveis.

## Notas de manutenção

- Esta Home deve continuar preparada para conteúdo dinâmico: não hardcode preços
  ou textos já vindos de `getDynamicContent`, `listPlans`, `listProducts` ou
  repositórios mockados.
- Revise qualquer novo asset de hero como parte do produto: se o time de Design
  futuramente trocar o banner via Backoffice, o componente deve degradar para uma
  composição estática legível.
- Em review, olhe especialmente o tamanho do bundle client. O componente client
  deve conter só a parte interativa do hero/reveal, não a página inteira.
- Este plano adia uma possível extração de design system para cards/dossiês em
  todo o site. Se os novos padrões funcionarem bem na Home, uma próxima tarefa
  pode consolidar `EvidenceTile`, `DossierPanel` e `PlanDossierCard` para outras
  páginas.
