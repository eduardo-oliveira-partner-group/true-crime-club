---
name: TrueCrime.Club
description: Clube de assinatura investigativo premium — papel, pistas e evidências sob a luz do dia.
colors:
  paper: '#ede4dd'
  paper-soft: '#f5eee4'
  card: '#fbf9f6'
  ink: '#211c18'
  ink-soft: '#3d362f'
  ink-mute: '#6e645a'
  red: '#c5271f'
  red-deep: '#a91d16'
  yellow: '#efbc18'
  amber: '#e0a50a'
  teal: '#1aa587'
  teal-deep: '#15735d'
  purple: '#5e5ea2'
  purple-deep: '#4a4580'
  night: '#0e1014'
  night-soft: '#16110e'
  cream: '#f4ecdc'
typography:
  display:
    fontFamily: 'Archivo, system-ui, sans-serif'
    fontSize: 'clamp(42px, 5.8vw, 74px)'
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: '-0.02em'
  heading:
    fontFamily: 'Archivo, system-ui, sans-serif'
    fontSize: 'clamp(28px, 3.4vw, 44px)'
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: '-0.015em'
  body:
    fontFamily: 'Hanken Grotesk, system-ui, sans-serif'
    fontSize: '18.5px'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'Special Elite, var(--design-font-mono), monospace'
    fontSize: '11.5px'
    fontWeight: 700
    letterSpacing: '0.12em'
  mono:
    fontFamily: 'Space Mono, monospace'
    fontSize: '14px'
    fontWeight: 700
    letterSpacing: '0.04em'
rounded:
  none: '0px'
  sm: '2px'
  card: '14px'
  card-top: '14px 14px 16px 16px'
  button: '9px'
  pill: '10px'
spacing:
  section-y: '84px'
  section-frame: '1180px'
  gutter: '32px'
  gutter-mobile: '22px'
  card-px: '30px'
  card-py: '34px'
components:
  button-primary:
    backgroundColor: '{colors.red}'
    textColor: '#fbf9f6'
    rounded: '{rounded.button}'
    padding: '14px 20px'
  button-primary-hover:
    backgroundColor: '{colors.red-deep}'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    rounded: '{rounded.pill}'
    padding: '15px 16px'
  button-secondary-hover:
    backgroundColor: '{colors.ink}'
    textColor: '#fbf9f6'
  button-hero-outline:
    backgroundColor: 'transparent'
    textColor: '{colors.cream}'
    rounded: '{rounded.button}'
    padding: '14px 20px'
  button-hero-outline-hover:
    backgroundColor: '#fbf9f6'
    textColor: '{colors.ink}'
  chip:
    backgroundColor: '{colors.paper-soft}'
    textColor: '{colors.ink}'
    rounded: '{rounded.sm}'
    padding: '8px 14px'
  chip-hover:
    backgroundColor: '{colors.red}'
    textColor: '#fbf9f6'
  card-dossier:
    backgroundColor: '{colors.card}'
    textColor: '{colors.ink}'
    rounded: '{rounded.card}'
    padding: '34px 30px'
  plan-card-featured:
    backgroundColor: '{colors.purple}'
    textColor: '#f4efe6'
    rounded: '{rounded.card}'
    padding: '34px 30px'
---

# Design System: TrueCrime.Club

## 1. Overview

**Creative North Star: "O Quadro de Evidências"**

O design system do TrueCrime.Club é construído em torno da metáfora do quadro de evidências: um painel de investigação onde fotos, pistas, fios coloridos e alfinetes conectam fragmentos de um caso aberto. A superfície é papel envelhecido sob luz do dia, não escuridão cinematográfica. Cada seção é uma peça de evidência pinada ao quadro — cards com alfinetes físicos, etiquetas de arquivo, selos de dossiê, fitas adesivas simuladas, linhas tracejadas conectando passos.

O sistema visual rejeita explicitamente terror apelativo, decoração policial caricata, superfícies brancas sem tratamento, glassmorphism como default, gradient text e a estética escura saturada de plataformas de crime genéricas. A investigação aqui é sofisticada e colecionável, não mórbida ou amadora. O acabamento é editorial e premium — cada elemento deve parecer produzido com a qualidade de um material de arquivo real.

**Key Characteristics:**

- Modo claro com textura documental (grão fotográfico, micro-pontos, linhas de grade sutis em modo `mix-blend-multiply`)
- Paleta quente com acentos cirúrgicos em quatro cores de função (vermelho, amarelo, teal, roxo)
- Tipografia editorial com hierarquia forte: Archivo para títulos pesados, Hanken Grotesk para corpo limpo, Special Elite para metadados de arquivo
- Alfinetes de quadro de evidências (radial-gradients simulando pins 3D) como elemento visual de assinatura
- Micro-rotações em cards e fitas adesivas para simular materiais fixados ao quadro
- Separadores tracejados e bordas finas com baixa opacidade para ritmo documental

## 2. Colors

Paleta quente e documental: superfícies de papel envelhecido com quatro acentos cromáticos que marcam função, não decoração.

### Primary

- **paper** (#ede4dd): Fundo principal da página. Papel envelhecido que ancora toda a experiência no registro documental. Usado como `background-color` do body e superfície de referência para contraste.
- **red** (#c5271f): Cor de ação principal, evidência, urgência e CTA comercial. Usada em botões primários, selos "em cartaz", badges, links de ação e o marquee promocional. Representa o fio vermelho do quadro de evidências.

### Secondary

- **yellow** (#efbc18): Alerta, destaque premium e recomendação. Usada em fitas adesivas simuladas sobre testimonials, selo "caso em curso" no hero, badges de plano recomendado, e como cor de CTA no plano anual. Marca o que exige atenção imediata.
- **amber** (#e0a50a): Variante queimada do amarelo para estados de informação e ícones de conteúdo. Menos vibrante, mais editorial.
- **teal** (#1aa587): Catalogação, status positivo e progresso. Usada em selos "arquivo privado", checkmarks de benefícios no plano mensal, e indicadores de disponibilidade. Marca o que está organizado e verificado.
- **purple** (#5e5ea2): Comunidade, exclusividade e destaque premium. Usada como fundo da seção de arquivos, cor do plano anual inteiro, e badges "arquivado". Marca o que pertence ao universo do clube.

### Neutral

- **paper-soft** (#f5eee4): Superfície sutil para etiquetas de dossiê, chips e separadores internos. Um degrau acima do paper sem competir com card.
- **card** (#fbf9f6): Superfície elevada para cards, containers e painéis internos. Branco-quente, não branco puro.
- **ink** (#211c18): Texto principal e elementos de interface fortes. Preto-quente com subtom marrom.
- **ink-soft** (#3d362f): Texto de apoio e parágrafos extensos. Um degrau abaixo do ink para legibilidade confortável.
- **ink-mute** (#6e645a): Metadados, labels secundários e texto de menor hierarquia. Marrom médio.
- **night** (#0e1014): Fundo do hero e seções invertidas. Usado com overlays e gradients para o tratamento de imagem.
- **cream** (#f4ecdc): Texto claro sobre fundos escuros (hero, footer). Creme quente, não branco frio.

### Named Rules

**The Four-Wire Rule.** As quatro cores de acento (red, yellow, teal, purple) funcionam como fios coloridos do quadro de evidências. Cada uma marca uma função específica e não deve ser usada fora do seu papel. Red = ação e evidência. Yellow = alerta e destaque. Teal = catalogação e status. Purple = comunidade e exclusividade. Misturar funções dilui o sistema.

**The Paper-First Rule.** A superfície padrão é sempre paper (#ede4dd), nunca branco puro (#fff) ou cinza frio. Cards usam card (#fbf9f6), um branco-quente que flutua sobre o paper sem criar contraste frio. Superfícies brancas sem tratamento são proibidas.

**The Daylight Section Rule.** Seções públicas e comerciais usam superfícies claras (`paper`, `paper-soft`, `card`) como base. Não use fundos escuros em heroes, catálogos, product detail, quick views ou painéis de compra apenas para criar drama. `night` é reservado para footer, overlays de imagem estritamente necessários ou momentos invertidos muito pontuais, sempre com contraste testado e nunca como padrão da página.

**The No Section Wallpaper Rule.** Seções de página não usam imagens de fundo, wallpapers, gradientes atmosféricos, radiais decorativos ou grids como plano de fundo. Imagens pertencem a cards, galerias, produtos, fotos editoriais ou mídias reais com propósito. O fundo da seção deve continuar sendo uma superfície física clara do sistema.

## 3. Typography

**Display Font:** Archivo (com system-ui, sans-serif)
**Body Font:** Hanken Grotesk (com system-ui, sans-serif)
**Label/Typewriter Font:** Special Elite (com Space Mono fallback, monospace)
**Mono/Button Font:** Space Mono (monospace)

**Character:** A combinação Archivo + Hanken Grotesk oferece peso editorial nos títulos (grotesca condensada, pesada) contra legibilidade humanista no corpo. Special Elite adiciona a textura de máquina de escrever que ancora os metadados no registro investigativo sem recorrer a monospace genérica.

### Hierarchy

- **Display** (700, clamp(42px, 5.8vw, 74px), 0.98): Headline do hero. Uma linha por verbo. Caixa normal, não uppercase. text-shadow para separar da imagem de fundo. Arquivo para títulos pesados.
- **Heading** (600, clamp(28px, 3.4vw, 44px), 1.02, -0.015em): Títulos de seção. Uma frase curta que funciona como pista. Peso semibold, não bold.
- **Subheading** (600, 20-32px, 1.05-1.12): Títulos de card, nomes de edição, subtítulos internos. Arquivo semibold.
- **Body** (400, 18.5px, 1.6): Parágrafos de apresentação. Hanken Grotesk regular. Cor ink-soft (#3d362f), não ink puro. Primeira letra dos blocos principais usa drop-cap em Archivo bold + red.
- **Label** (700, 11.5-13px, tracking 0.06-0.14em, uppercase): Eyebrows de seção, metadados de dossiê, tags de arquivo. Special Elite (typewriter). Sempre uppercase com tracking amplo. Precedidos por traço horizontal em red ou yellow.

### Named Rules

**The Typewriter Rule.** Special Elite é reservada para metadados de arquivo: eyebrows, labels de card, badges, tags de status e códigos de referência. Nunca em títulos, nunca em body, nunca em botões. Se o texto não parecer uma etiqueta de catalogação, não usa typewriter.

**The No Serif Rule.** A experiência pública do TrueCrime.Club não usa fontes serifadas em títulos, preços, CTAs, cards, quick views ou superfícies de compra. `font-heading` global pode apontar para legados fora do sistema; páginas públicas devem preferir `var(--design-font-heading)` ou o helper `fontHeading` para garantir Archivo/system-ui. Preços usam a mesma família sans de heading, nunca serif.

**The Drop-Cap Rule.** O primeiro bloco de prosa de cada seção editorial usa drop-cap: primeira letra em Archivo bold, cor red, float left. Nunca em cards, nunca em listas. Um drop-cap por seção, máximo.

## 4. Elevation

O sistema usa elevação tonal (superfícies paper → card → card com gradient) combinada com sombras quentes e profundas. Não há sombras frias. A profundidade vem da simulação física de materiais pinados ao quadro: sombras projetadas por cards levemente rotacionados, alfinetes com radial-gradient 3D, e fitas adesivas com sombra sutil.

### Shadow Vocabulary

- **Card base** (`box-shadow: 0 18px 40px -18px rgba(33,28,24,0.22), inset 0 0 0 1px rgba(255,255,255,0.5)`): Sombra quente padrão para cards de dossiê. O inset cria a borda interna sutil sem border adicional.
- **Card hover** (`box-shadow: 0 24px 44px -18px rgba(33,28,24,0.3), inset 0 0 0 1px rgba(255,255,255,0.6)`): Elevação aumentada no hover. Blur e spread crescem, opacidade do inset cresce.
- **Polaroid/Testimonial** (`box-shadow: 0 12px 26px -12px rgba(33,28,24,0.28), inset 0 0 0 1px rgba(255,255,255,0.6)`): Para cards com rotação (testimonials). Sombra mais compacta que acompanha o tilt.
- **Plan featured** (`box-shadow: 0 20px 40px -14px rgba(74,69,128,0.55)`): Sombra colorida no plano anual (purple). A cor da sombra reforça a identidade do card.
- **Board pin** (`box-shadow: 0 3px 5px rgba(33,28,24,0.45), inset 0 -2px 3px rgba(0,0,0,0.3)`): Alfinete de quadro. Combinação de drop shadow + inset para simular a projeção física do pin sobre o quadro.
- **Button lift** (`box-shadow: 0 9px 22px -8px rgba(33,28,24,0.13)` → hover: `0 14px 30px -10px rgba(33,28,24,0.22)`): Elevação sutil para CTAs primários. Cresce no hover junto com `translateY(-2px)`.

### Named Rules

**The Warm-Shadow Rule.** Todas as sombras usam `rgba(33,28,24,...)` — a cor ink em transparência. Nunca `rgba(0,0,0,...)` puro (exceto no inset de pins). Sombras frias ou cinzas são proibidas. A sombra deve parecer a projeção de um objeto sob luz incandescente.

## 5. Components

### Buttons

- **Shape:** Cantos arredondados moderados (9px para CTAs, 10px para secundários). Nunca pill (999px), nunca quadrado (0px).
- **Primary:** Background red (#c5271f), texto #fbf9f6, padding 14px 20px, fonte Space Mono bold, uppercase, tracking 0.04em. Sombra quente base que cresce no hover.
- **Hover / Focus:** translateY(-2px), background red-deep (#a91d16), sombra expandida. Transição com cubic-bezier(0.22,1,0.36,1). Arrow icon desliza 4px para a direita.
- **Secondary:** Background transparente, borda rgba(33,28,24,0.15), texto ink. Hover inverte para bg ink, texto #fbf9f6.
- **Hero outline:** Borda white/40, texto cream, bg transparente. Hover inverte para bg #fbf9f6, texto ink.

### Chips / Tags

- **Style:** Background paper-soft, borda rgba(33,28,24,0.15), texto ink, radius 2px. Fonte Special Elite, uppercase, tracking 0.06em. Podem incluir ícone Tabler à esquerda.
- **State:** Hover inverte para bg red, texto #fbf9f6, borda red. Transição background-color + color + border-color 0.2s ease.

### Cards / Containers (Dossiê)

- **Corner Style:** 14px top, 16-18px bottom (assimétrico: `14px 14px 16px 16px`). Simula um documento com cantos levemente diferentes.
- **Background:** card (#fbf9f6) com gradient interno (`linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 120px)`).
- **Shadow Strategy:** Sombra quente base + inset border (ver Elevation).
- **Border:** 1px solid rgba(33,28,24,0.15) — fina, quente, sutil.
- **Internal Padding:** 30px horizontal, 34px top, 30px bottom (desktop). 24-26px em mobile.
- **Board Pin:** Alfinete decorativo no topo do card via `<span>` com radial-gradient simulando pin 3D. Cor do pin muda por card/seção.
- **Tab de Dossiê:** Aba superior posicionada com `absolute top -translate-y-full`, bordas arredondadas superiores, fundo paper-soft, texto Special Elite uppercase com código de referência.
- **Feature cards:** Micro-rotação alternada (±1.4deg), hover remove rotação e eleva -10px via motion/spring.

### Product / Commerce Surfaces

- **Product cards:** Cards de produto usam `DossierCard` ou superfície equivalente (`card`, borda quente, raio 14/16, pin/aba quando fizer sentido). Nunca usar card escuro para catálogo ou compra.
- **Quick view / modal:** Como quick views podem ser renderizados via portal fora do `DesignPageShell`, aplicar `designTokens` diretamente no wrapper do portal ou garantir equivalente. O fundo do artigo e do painel de conteúdo deve computar como `card` claro (#fbf9f6), não depender do tema global.
- **Product imagery:** Imagens de produto ficam dentro da área de mídia do card/modal/galeria. Não transformar foto de produto em wallpaper de seção.
- **Commercial clarity:** Preço, estoque, botão de compra e link para página completa devem permanecer visíveis em claro, com CTA red e texto de alto contraste.

### Inputs / Fields

- **Style:** Borda rgba(33,28,24,0.15), background transparente ou card, radius 10px.
- **Focus:** Não documentado na landing — usar borda red com glow sutil `0 0 0 2px rgba(197,39,31,0.15)`.

### Navigation

- **Desktop:** Sticky header com backdrop-blur, bg paper em 92% opacidade, borda dashed inferior. Links em Special Elite uppercase com underline animada (scale-x 0→1 no hover via pseudo-element `::after`). Transição de cor para red no hover.
- **Mobile:** Hamburguer abre menu fullscreen com links empilhados, borda dashed entre itens, dois CTAs (Entrar outline + Assinar red) lado a lado no fim. Body overflow hidden enquanto aberto.
- **Cart badge:** Pill red com borda paper, posicionada absolute top-right do ícone de carrinho.

### Testimonial Card (Assinatura)

Card com micro-rotação alternada (±1.8deg), fita adesiva amarela simulada no topo (pseudo-element com background yellow/55, rotate -2deg, borda dashed lateral), ícone de aspas colorido, texto em itálico, footer com dot colorido + username + likes. Tilt mantido no hover, sombra expande.

### Section Eyebrow (Assinatura)

Linha horizontal de 22px em currentColor + texto Special Elite bold uppercase + tracking 0.12em. Cor padrão red, variante yellow para seções sobre fundo escuro. Precede todo título de seção.

### Promo Marquee (Assinatura)

Faixa horizontal com fundo red, texto cream, fonte Special Elite, animação CSS infinite linear. Detalhe de borda perfurada (radial-gradient stamps) nas laterais simulando papel destacável. Pausa no hover do container.

### FAB — Floating Action Button (Assinatura)

Botão fixo bottom-right com ícone + texto + seta. Aparece após scroll do hero e desaparece antes do CTA final. Transição de entrada com scale + translate + opacity via cubic-bezier. Fundo red, cantos 13px. Full-width em mobile.

## 6. Do's and Don'ts

### Do:

- **Do** usar paper (#ede4dd) como fundo principal e card (#fbf9f6) para superfícies elevadas. Nunca branco puro.
- **Do** aplicar grão fotográfico (feTurbulence SVG inline) e linhas de grade (linear-gradient 34px) como overlays fixos em `mix-blend-multiply` com opacidade baixa (7% grão, 55% grade). Ambos `pointer-events: none`.
- **Do** usar alfinetes de quadro (radial-gradient pins com sombra 3D) como elemento de conexão visual entre cards e seções.
- **Do** alternar micro-rotações em cards adjacentes (±1.4deg feature cards, ±1.8deg testimonials). Hover remove a rotação e eleva o card.
- **Do** usar separadores tracejados (`repeating-linear-gradient` com dash 5px gap 4px) em vez de borders sólidos dentro de cards.
- **Do** aplicar cantos arredondados em todos os elementos com borda: botões, badges, ícones em caixas, inputs, mini cards, avisos fixos, barras de ação mobile e overlays. Use 2px para etiquetas de arquivo, 9-10px para controles e 14-16px para cards/painéis.
- **Do** garantir tokens claros em portais, dialogs e drawers que saem do `DesignPageShell`; eles devem herdar `paper`, `card`, `ink` e fontes do design system explicitamente quando necessário.
- **Do** respeitar `prefers-reduced-motion: reduce` em toda animação. Marquees param, hero-in fica visível sem animação, reveals aparecem instantaneamente.
- **Do** usar Special Elite apenas para metadados de arquivo (eyebrows, tags, labels, códigos). Nunca para corpo ou títulos.
- **Do** manter o Four-Wire Rule: red = ação, yellow = alerta/destaque, teal = catalogação/status, purple = comunidade/exclusividade.

### Don't:

- **Don't** usar fundo escuro como padrão. Night (#0e1014) é reservado para footer, overlays de mídia estritamente necessários e seções invertidas raras — nunca como base de hero de loja, catálogo, product detail, quick view, modal de compra ou página comercial.
- **Don't** usar imagens de fundo em seções. Fotos e assets devem viver dentro de cards, galerias ou blocos de mídia, nunca como wallpaper de seção.
- **Don't** usar fontes serifadas no front office público. Evite `font-heading` quando ele puder resolver para uma serif global; use `fontHeading`/`var(--design-font-heading)` para títulos e preços.
- **Don't** deixar elementos com borda e `border-radius: 0`, `rounded-none` ou cantos secos em interfaces públicas. O único raio zero aceitável é em linhas, divisores e elementos puramente estruturais sem borda visível.
- **Don't** usar border-left ou border-right maiores que 1px como accent colorido em cards (side-stripe ban).
- **Don't** usar gradient text (`background-clip: text` com gradient). Cor sólida sempre.
- **Don't** usar glassmorphism como default. Backdrop-blur aparece apenas no header sticky e em badges de overlay sobre imagens — nunca em cards ou containers.
- **Don't** usar border-radius maior que 16px em cards. Cards de dossiê usam 14-16px; pills são para badges e botões pequenos.
- **Don't** usar sombras frias (rgba(0,0,0,...)) em cards ou botões. Todas as sombras usam a cor ink em transparência (rgba(33,28,24,...)).
- **Don't** criar seções sem eyebrow. Toda seção pública tem um SectionEyebrow com código de seção e título curto.
- **Don't** usar superfícies brancas puras (#fff) ou cinzas frios. O sistema é quente do paper ao ink.
- **Don't** usar cards idênticos em grid sem variação. Feature cards têm rotações alternadas e pins coloridos. Archive cards têm abas amarelas rotacionadas e badges "arquivado".
- **Don't** usar terror apelativo, sangue, choque visual, decoração policial caricata ou linguagem mórbida. A investigação é sofisticada e colecionável, não apelativa ou amadora.
- **Don't** usar uppercase tracked labels acima de toda seção como scaffold AI — o eyebrow do TrueCrime.Club é um sistema deliberado com código de seção sequencial e traço de abertura, não um padrão genérico repetido sem intenção.
