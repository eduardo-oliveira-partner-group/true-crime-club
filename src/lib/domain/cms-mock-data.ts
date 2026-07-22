import type { DynamicContentBlock, MenuCms, PaginaCms, SeoEntry } from './types'

export const mockDynamicContent: DynamicContentBlock[] = [
  {
    key: 'home.hero.title',
    type: 'text',
    value: 'Investigue. Colete. Desvende.',
    route: '/',
  },
  {
    key: 'home.hero.badge',
    type: 'text',
    value: 'Primeiro Clube de True Crime do Brasil',
    route: '/',
  },
  {
    key: 'home.hero.subtitle',
    type: 'text',
    value:
      'Eleve seu nível de conteúdo com uma caixa temática mensal, recheada de surpresas exclusivas — da abertura ao design impecável de cada item colecionável.',
    route: '/',
  },
  {
    key: 'home.hero.cta',
    type: 'text',
    value: 'Garantir minha vaga',
    route: '/',
  },
  {
    key: 'home.final_cta.subtitle',
    type: 'text',
    value:
      'Garanta sua vaga no clube antes que a próxima edição esgote. A próxima pista já está sendo preparada.',
    route: '/',
  },
  {
    key: 'home.trust.support',
    type: 'text',
    value: 'Suporte humano de segunda a sexta, das 9h às 18h.',
    route: '/',
  },
  {
    key: 'assinatura.how_it_works',
    type: 'html',
    value:
      '<ol><li><strong>Assine</strong> — escolha plano mensal ou anual.</li><li><strong>Receba em casa</strong> — envio no mês seguinte à compra.</li><li><strong>Aproveite</strong> — nova imersão a cada ciclo.</li></ol>',
    route: '/assinatura',
  },
  {
    key: 'faq.intro',
    type: 'text',
    value:
      'Respostas para as dúvidas mais comuns sobre o clube, planos e entregas.',
    route: '/faq',
  },
]

export const mockSeoEntries: Record<string, SeoEntry> = {
  '/': {
    title: 'True Crime Club — Clube de assinatura de mistério',
    description:
      'Assine e receba mensalmente boxes temáticas de true crime com curadoria exclusiva, conteúdo gamificado e comunidade investigativa.',
  },
  '/loja': {
    title: 'Loja — Boxes e produtos',
    description:
      'Explore boxes atuais, edições avulsas e produtos complementares do clube.',
  },
  '/assinatura': {
    title: 'Planos de assinatura',
    description:
      'Compare planos mensal e anual e entenda o ciclo de cobrança e entrega.',
  },
  '/faq': {
    title: 'Perguntas frequentes',
    description:
      'Tire dúvidas sobre planos, entrega, pagamento e cancelamento.',
  },
  '/carrinho': {
    title: 'Carrinho — Dossiê de compra',
    description:
      'Revise os itens selecionados, aplique cupons e calcule o frete antes de finalizar o pedido.',
  },
  '/checkout': {
    title: 'Checkout — Finalizar pedido',
    description:
      'Informe conta, endereço, frete, pagamento e preferências para concluir a compra ou assinatura.',
  },
  '/checkout/confirmacao': {
    title: 'Pedido confirmado',
    description:
      'Confirmação do pedido com ciclo de cobrança, envio e rastreio do True Crime Club.',
  },
}

export const mockCmsPages: PaginaCms[] = [
  {
    id: 'page-home',
    rota: '/',
    slug: '',
    titulo: 'True Crime Club — Investigação na sua porta',
    status: 'publicada',
    locale: 'pt-BR',
    seo: {
      titulo: 'True Crime Club — Clube de assinatura de mistério',
      descricao:
        'Assine e receba mensalmente boxes temáticas de true crime com curadoria exclusiva, conteúdo gamificado e comunidade investigativa.',
      urlCanonica: 'https://truecrimeclub.com.br/',
      imagemCompartilhamento: '/og-image.jpg',
      naoIndexar: false,
    },
    sections: [
      { id: 'sec-hero', tipo: 'landing.hero', ordem: 1 },
      { id: 'sec-ribbon', tipo: 'landing.ribbon', ordem: 2 },
      { id: 'sec-intro', tipo: 'landing.clubIntro', ordem: 3 },
      { id: 'sec-featured', tipo: 'landing.featuredBy', ordem: 4 },
      { id: 'sec-boxcontents', tipo: 'landing.boxContents', ordem: 5 },
      { id: 'sec-howitworks', tipo: 'landing.howItWorks', ordem: 6 },
      { id: 'sec-testimonials', tipo: 'landing.testimonials', ordem: 7 },
      { id: 'sec-plancards', tipo: 'commerce.planCards', ordem: 8 },
      { id: 'sec-standalone', tipo: 'landing.standaloneEdition', ordem: 9 },
      { id: 'sec-productarchive', tipo: 'commerce.productArchive', ordem: 10 },
      { id: 'sec-finalcta', tipo: 'landing.finalCta', ordem: 11 },
    ],
    updatedAt: '2026-07-06T16:21:32-03:00',
  },
  {
    id: 'page-sobre',
    rota: '/sobre-o-clube',
    slug: 'sobre-o-clube',
    titulo: 'Sobre o Clube',
    status: 'publicada',
    locale: 'pt-BR',
    seo: {
      titulo: 'Sobre o Clube — True Crime Club',
      descricao:
        'Conheça a história e os bastidores por trás do maior clube de investigação do país.',
      urlCanonica: 'https://truecrimeclub.com.br/sobre-o-clube',
      imagemCompartilhamento: '/og-image.jpg',
      naoIndexar: false,
    },
    sections: [
      {
        id: 'sec-sobre-rich',
        tipo: 'richText',
        ordem: 1,
        props: {
          content: `
            <div class="prose max-w-none text-(--ink-soft)">
              <h1 class="text-3xl font-bold text-(--ink) mb-6">Nossa História</h1>
              <p class="mb-4 text-lg leading-relaxed">O <strong>True Crime Club</strong> nasceu do desejo de transformar o consumo passivo de histórias de mistério e investigações criminais em uma experiência ativa, física e tátil. Fundado por entusiastas do gênero de mistério e comportamento humano, o clube se baseia no princípio da dedução e análise de pistas reais.</p>
              <p class="mb-4 text-lg leading-relaxed">Diferente de um livro tradicional ou série de TV, cada caso do clube é projetado de forma transmídia e gamificada. Os membros recebem depoimentos de testemunhas, recortes de jornais de época, relatórios forenses detalhados, mapas de cenas de crime e réplicas de evidências físicas que ajudam a desvendar o mistério.</p>
              <h2 class="text-2xl font-semibold text-(--ink) mt-8 mb-4">O Compromisso com a Imersão</h2>
              <p class="mb-4 text-lg leading-relaxed">Nossa equipe de escritores, historiadores e designers trabalha incansavelmente para criar histórias ricas e coerentes. Nossos itens colecionáveis e réplicas de evidências são manufaturados com altíssimo nível de detalhamento para garantir que a sua mesa de cozinha realmente pareça o quartel-general de uma investigação policial de alto nível.</p>
            </div>
          `,
        },
      },
      { id: 'sec-sobre-cta', tipo: 'landing.finalCta', ordem: 2 },
    ],
    updatedAt: '2026-07-06T16:21:32-03:00',
  },
]

export const mockCmsMenus: Record<string, MenuCms> = {
  'header-principal': {
    chave: 'header-principal',
    itens: [
      { label: 'O Clube', href: '/#oque' },
      { label: 'Como funciona', href: '/#funciona' },
      { label: 'Planos', href: '/#planos' },
      { label: 'Avulsas', href: '/#avulsas' },
      { label: 'Arquivos', href: '/#arquivos' },
    ],
  },
  'footer-principal': {
    chave: 'footer-principal',
    itens: [
      {
        label: 'O Clube',
        href: '',
        itens: [
          { href: '/#oque', label: 'O que é' },
          { href: '/#funciona', label: 'Como funciona' },
          { href: '/#planos', label: 'Planos' },
          { href: '/#arquivos', label: 'Arquivos' },
          { href: '/sobre-o-clube', label: 'Sobre o Clube' },
        ],
      },
      {
        label: 'Ajuda',
        href: '',
        itens: [
          { href: '/faq', label: 'Perguntas frequentes' },
          { href: '/faq', label: 'Entregas e prazos' },
          { href: 'mailto:contato@truecrime.club', label: 'Fale com a gente' },
          { href: '/faq', label: 'Política de cancelamento' },
        ],
      },
    ],
  },
}
