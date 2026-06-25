import type {
  Address,
  Box,
  Cart,
  Case,
  Clue,
  Customer,
  DynamicContentBlock,
  ExclusiveContent,
  Invoice,
  Order,
  Payment,
  PaymentMethod,
  Product,
  SeoEntry,
  SubscriberProgress,
  Subscription,
  SubscriptionPlan,
} from './types'

export const mockCustomer: Customer = {
  id: 'cust-001',
  name: 'Mariana Silva',
  email: 'mariana.silva@email.com',
  phone: '(11) 98765-4321',
  preferences: {
    shirtSize: 'M',
    shoeSize: '38',
    notes: 'Prefere tons escuros nas peças de vestuário.',
  },
}

export const mockAddresses: Address[] = [
  {
    id: 'addr-001',
    label: 'Casa',
    street: 'Rua das Acácias',
    number: '142',
    complement: 'Apto 82',
    neighborhood: 'Vila Madalena',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '05435-020',
    isDefault: true,
  },
]

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-001',
    type: 'credit_card',
    label: 'Visa terminando em 4242',
    lastFour: '4242',
    brand: 'Visa',
    isDefault: true,
  },
  {
    id: 'pm-002',
    type: 'pix',
    label: 'Pix',
    isDefault: false,
  },
]

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    slug: 'box-edicao-marco-2026',
    name: 'Box Edição Março 2026 — Sombras do Passado',
    description:
      'Uma curadoria exclusiva inspirada em casos reais do interior paulista. Cada box traz uma seleção surpresa de itens colecionáveis, papelaria premium e peças temáticas — sem prometer todos os tipos de produto em uma única edição.',
    shortDescription:
      'Edição limitada de março com itens colecionáveis e materiais exclusivos.',
    type: 'box',
    price: 18990,
    subscriberPrice: 14990,
    images: ['products/box-03.jpg'],
    categories: ['box', 'colecionaveis', 'papelaria'],
    inStock: true,
    availability: 'limited',
    featured: true,
    editionMonth: '2026-03',
    cycleNumber: 3,
    includedItems: [
      'Caderno de investigação com páginas numeradas',
      'Pôster exclusivo do caso',
      'Item colecionável surpresa',
      'Pista gamificada do ciclo 3',
    ],
    relatedProductIds: ['prod-002', 'prod-003'],
  },
  {
    id: 'prod-002',
    slug: 'box-edicao-fevereiro-2026',
    name: 'Box Edição Fevereiro 2026 — Arquivo Secreto',
    description:
      'Edição anterior disponível como compra avulsa. Ideal para quem quer completar a coleção ou conhecer a experiência antes de assinar.',
    shortDescription: 'Box avulsa de fevereiro, estoque limitado.',
    type: 'box',
    price: 17990,
    subscriberPrice: 13990,
    images: ['products/box-02.jpg'],
    categories: ['box', 'avulsa'],
    inStock: true,
    availability: 'available',
    featured: true,
    editionMonth: '2026-02',
    cycleNumber: 2,
    includedItems: [
      'Planner temático de investigação',
      'Camiseta exclusiva do ciclo',
      'Documento replicado do arquivo',
    ],
    relatedProductIds: ['prod-001'],
  },
  {
    id: 'prod-005',
    slug: 'tcc-caixa-01-avulsa',
    name: 'TCC — Caixa 01 (Avulsa)',
    description:
      'O ponto de partida da investigação. Esta edição apresenta o caso, os primeiros documentos e os itens que iniciam a trama colecionável do clube.',
    shortDescription:
      'Primeira caixa avulsa da coleção, ideal para começar o caso.',
    type: 'box',
    price: 18990,
    subscriberPrice: 15990,
    images: ['products/box-01.jpg'],
    categories: ['box', 'avulsa'],
    inStock: true,
    availability: 'available',
    featured: true,
    editionMonth: '2025-10',
    cycleNumber: 1,
    includedItems: [
      'Itens colecionáveis temáticos',
      'Documentos do arquivo inicial',
      'Pista gamificada do ciclo 1',
    ],
    relatedProductIds: ['prod-002'],
  },
  {
    id: 'prod-006',
    slug: 'tcc-caixa-04-avulsa',
    name: 'TCC — Caixa 04 (Avulsa)',
    description:
      'A investigação se aprofunda com novas conexões e evidências que desafiam o que parecia resolvido até aqui.',
    shortDescription: 'Quarta caixa avulsa para quem quer avançar na coleção.',
    type: 'box',
    price: 18990,
    subscriberPrice: 15990,
    images: ['products/box-04.jpg'],
    categories: ['box', 'avulsa'],
    inStock: true,
    availability: 'available',
    featured: true,
    editionMonth: '2026-01',
    cycleNumber: 4,
    includedItems: [
      'Itens colecionáveis temáticos',
      'Materiais exclusivos do ciclo 4',
      'Pista gamificada do ciclo 4',
    ],
    relatedProductIds: ['prod-001'],
  },
  {
    id: 'prod-003',
    slug: 'caderno-investigacao-premium',
    name: 'Caderno de Investigação Premium',
    description:
      'Caderno com capa rígida, páginas pontilhadas e marcadores temáticos. Produto avulso complementar à experiência do clube.',
    shortDescription: 'Papelaria premium para registrar teorias e pistas.',
    type: 'product',
    price: 8990,
    images: ['/images/placeholders/caderno-premium.jpg'],
    categories: ['papelaria'],
    inStock: true,
    availability: 'available',
    featured: false,
    relatedProductIds: ['prod-001'],
  },
  {
    id: 'prod-004',
    slug: 'poster-caso-arquivo-x',
    name: 'Pôster — Caso Arquivo X',
    description:
      'Impressão em alta qualidade com linha do tempo do caso fictício investigado pela comunidade.',
    shortDescription: 'Decoração temática para fãs de mistério.',
    type: 'product',
    price: 5990,
    subscriberPrice: 4490,
    images: ['/images/placeholders/poster-arquivo-x.jpg'],
    categories: ['decoracao'],
    inStock: false,
    availability: 'out_of_stock',
    featured: false,
  },
]

export const mockBoxes: Box[] = mockProducts
  .filter((p): p is Box => p.type === 'box')
  .map((p) => ({
    ...p,
    type: 'box' as const,
    editionMonth: p.editionMonth ?? '2026-01',
    cycleNumber: p.cycleNumber ?? 1,
    categoriesIncluded: p.categories.slice(0, 3),
  }))

export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-monthly',
    slug: 'mensal',
    name: 'Plano Mensal',
    description:
      'Cobrança mensal com flexibilidade para cancelar quando quiser.',
    billingInterval: 'monthly',
    price: 14990,
    pricePerMonth: 14990,
    features: [
      'Box temática mensal com curadoria exclusiva',
      'Novidades e sorteios a cada lançamento',
      'Acesso à área de conteúdo gamificado',
      'Cancele quando quiser',
    ],
  },
  {
    id: 'plan-annual',
    slug: 'anual',
    name: 'Plano Anual',
    description:
      'Melhor custo-benefício com cobrança anual no cartão e permanência de 12 meses.',
    billingInterval: 'annual',
    price: 143880,
    pricePerMonth: 11990,
    isRecommended: true,
    commitmentMonths: 12,
    features: [
      'Tudo do plano mensal',
      'Economia equivalente a 2 meses',
      'Prioridade em edições limitadas',
      'Acesso antecipado a pistas extras',
    ],
  },
  {
    id: 'plan-standalone',
    slug: 'avulso',
    name: 'Box Avulsa',
    description: 'Compre edições anteriores sem compromisso de assinatura.',
    billingInterval: 'one_time',
    price: 17990,
    features: [
      'Edição específica escolhida na loja',
      'Sem recorrência',
      'Ideal para presentear ou experimentar',
    ],
  },
]

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'TCC-202603-0042',
    customerId: 'cust-001',
    items: [
      {
        id: 'ci-001',
        productId: 'prod-001',
        productSlug: 'box-edicao-marco-2026',
        productName: 'Box Edição Março 2026 — Sombras do Passado',
        productType: 'box',
        quantity: 1,
        unitPrice: 14990,
        image: 'products/box-03.jpg',
      },
    ],
    status: 'awaiting_shipment',
    paymentStatus: 'paid',
    subtotal: 14990,
    shipping: 0,
    discount: 0,
    total: 14990,
    createdAt: '2026-03-15T14:30:00.000Z',
    billingCycleNote: 'Cobrança processada em março de 2026.',
    shippingCycleNote:
      'Envio previsto para abril de 2026 — compras feitas em março são despachadas no mês seguinte.',
    invoicePlaceholder: 'Nota fiscal disponível após despacho.',
  },
  {
    id: 'ord-002',
    orderNumber: 'TCC-202602-0018',
    customerId: 'cust-001',
    items: [
      {
        id: 'ci-002',
        productId: 'prod-002',
        productSlug: 'box-edicao-fevereiro-2026',
        productName: 'Box Edição Fevereiro 2026 — Arquivo Secreto',
        productType: 'box',
        quantity: 1,
        unitPrice: 13990,
        image: 'products/box-02.jpg',
      },
    ],
    status: 'shipped',
    paymentStatus: 'paid',
    subtotal: 13990,
    shipping: 1590,
    discount: 0,
    total: 15580,
    createdAt: '2026-02-10T10:00:00.000Z',
    billingCycleNote: 'Cobrança processada em fevereiro de 2026.',
    shippingCycleNote: 'Despachado em março de 2026 conforme ciclo de entrega.',
    trackingCode: 'BR123456789BR',
    trackingUrl: 'https://rastreamento.mock/tcc/BR123456789BR',
    invoicePlaceholder:
      'NF-e TCC-202602-0018 — download disponível na área do cliente.',
  },
]

export const mockPayments: Payment[] = [
  {
    id: 'pay-001',
    subscriptionId: 'sub-001',
    amount: 14990,
    status: 'paid',
    method: 'credit_card',
    dueDate: '2026-03-01T00:00:00.000Z',
    paidAt: '2026-03-01T08:12:00.000Z',
  },
  {
    id: 'pay-002',
    subscriptionId: 'sub-001',
    amount: 14990,
    status: 'paid',
    method: 'credit_card',
    dueDate: '2026-02-01T00:00:00.000Z',
    paidAt: '2026-02-01T09:05:00.000Z',
  },
  {
    id: 'pay-003',
    orderId: 'ord-001',
    amount: 14990,
    status: 'paid',
    method: 'pix',
    dueDate: '2026-03-15T00:00:00.000Z',
    paidAt: '2026-03-15T14:35:00.000Z',
  },
  {
    id: 'pay-004',
    subscriptionId: 'sub-001',
    amount: 14990,
    status: 'pending',
    method: 'pix',
    dueDate: '2026-04-01T00:00:00.000Z',
    pixQrCode: '00020126580014BR.GOV.BCB.PIX0136mock-pix-qr-code',
    pixExpiresAt: '2026-04-01T23:59:00.000Z',
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    number: 'REC-202603-0042',
    paymentId: 'pay-001',
    amount: 14990,
    issuedAt: '2026-03-01T08:15:00.000Z',
    receiptUrl: '/mock/receipts/rec-202603-0042.pdf',
    downloadUrl: '/mock/receipts/rec-202603-0042.pdf',
  },
  {
    id: 'inv-002',
    number: 'REC-202602-0018',
    paymentId: 'pay-002',
    amount: 14990,
    issuedAt: '2026-02-01T09:10:00.000Z',
    receiptUrl: '/mock/receipts/rec-202602-0018.pdf',
    downloadUrl: '/mock/receipts/rec-202602-0018.pdf',
  },
]

export const mockSubscription: Subscription = {
  id: 'sub-001',
  customerId: 'cust-001',
  planId: 'plan-monthly',
  planName: 'Plano Mensal',
  status: 'active',
  startedAt: '2025-12-01T00:00:00.000Z',
  nextBillingDate: '2026-04-01T00:00:00.000Z',
  nextBillingAmount: 14990,
  currentCycleBoxId: 'prod-001',
  currentCycleBoxName: 'Box Edição Março 2026 — Sombras do Passado',
  canCancel: true,
  canReactivate: false,
}

export const mockActiveCase: Case = {
  id: 'case-2026',
  slug: 'operacao-meia-noite',
  title: 'Operação Meia-Noite',
  description:
    'Um caso fictício investigado coletivamente ao longo de 2026. A cada ciclo, uma nova pista é liberada para assinantes, culminando em evento ao vivo com a comunidade.',
  year: 2026,
  totalClues: 12,
  liveEventDate: '2027-01-15T20:00:00.000Z',
  liveEventTitle: 'Grande Revelação — Operação Meia-Noite',
}

export const mockClues: Clue[] = [
  {
    id: 'clue-001',
    slug: 'pista-ciclo-1',
    caseId: 'case-2026',
    title: 'Ciclo 1 — O telefonema anônimo',
    description:
      'Gravação transcrita de um telefonema recebido na madrugada de 14 de janeiro.',
    cycleNumber: 1,
    status: 'liberado',
    releasedAt: '2026-01-05T00:00:00.000Z',
    files: [
      {
        id: 'file-001',
        name: 'transcricao-telefonema.pdf',
        type: 'pdf',
        downloadUrl: '/mock/files/transcricao-telefonema.pdf',
        sizeLabel: '245 KB',
      },
    ],
  },
  {
    id: 'clue-002',
    slug: 'pista-ciclo-2',
    caseId: 'case-2026',
    title: 'Ciclo 2 — Foto parcial do arquivo',
    description:
      'Imagem recuperada de uma câmera descartável encontrada no local.',
    cycleNumber: 2,
    status: 'liberado',
    releasedAt: '2026-02-05T00:00:00.000Z',
    files: [
      {
        id: 'file-002',
        name: 'foto-arquivo-parcial.jpg',
        type: 'image',
        downloadUrl: '/mock/files/foto-arquivo-parcial.jpg',
        sizeLabel: '1,2 MB',
      },
    ],
  },
  {
    id: 'clue-003',
    slug: 'pista-ciclo-3',
    caseId: 'case-2026',
    title: 'Ciclo 3 — Registro bancário',
    description:
      'Extrato parcial com movimentações suspeitas na véspera do incidente.',
    cycleNumber: 3,
    status: 'liberado',
    releasedAt: '2026-03-05T00:00:00.000Z',
    files: [
      {
        id: 'file-003',
        name: 'extrato-parcial.pdf',
        type: 'pdf',
        downloadUrl: '/mock/files/extrato-parcial.pdf',
        sizeLabel: '180 KB',
      },
    ],
  },
  {
    id: 'clue-004',
    slug: 'pista-ciclo-4',
    caseId: 'case-2026',
    title: 'Ciclo 4 — Depoimento bloqueado',
    description: 'Depoimento de testemunha-chave ainda sob sigilo narrativo.',
    cycleNumber: 4,
    status: 'bloqueado',
    blockedReason: 'Libera no próximo ciclo',
    files: [],
  },
]

export const mockExclusiveContent: ExclusiveContent[] = mockClues.map(
  (clue) => ({
    id: clue.id,
    slug: clue.slug,
    title: clue.title,
    description: clue.description,
    status: clue.status,
    cycleNumber: clue.cycleNumber,
    releaseCycle: clue.cycleNumber,
    blockedReason: clue.blockedReason,
    type: 'clue' as const,
    files: clue.files,
  }),
)

export const mockSubscriberProgress: SubscriberProgress = {
  caseId: 'case-2026',
  collectedClues: 3,
  totalClues: 12,
  currentCycle: 3,
  liveEventDate: '2027-01-15T20:00:00.000Z',
  liveEventTitle: 'Grande Revelação — Operação Meia-Noite',
  percentComplete: 25,
}

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
}

export const initialCart: Cart = {
  id: 'cart-001',
  items: [],
}

export const VALID_COUPONS: Record<string, number> = {
  BEMVINDO10: 1000,
  CLUBE15: 1500,
}

export const SHIPPING_RATES: Record<string, { price: number; days: string }> = {
  '05435-020': { price: 0, days: '5–8 dias úteis' },
  '01310-100': { price: 1590, days: '6–10 dias úteis' },
  default: { price: 1990, days: '8–15 dias úteis' },
}
