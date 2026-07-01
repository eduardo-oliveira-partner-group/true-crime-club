import {
  IconClipboardText,
  IconGift,
  IconStack2,
  IconUsers,
  type TablerIcon,
} from '@tabler/icons-react'
import type { StaticImageData } from 'next/image'

import archiveBox01 from '@/src/assets/images/design-sugerido/box-01.png'
import archiveBox02 from '@/src/assets/images/design-sugerido/box-02.png'
import archiveBox03 from '@/src/assets/images/design-sugerido/box-03.png'
import archiveBox04 from '@/src/assets/images/design-sugerido/box-04.png'
import logoBetoRibeiro from '@/src/assets/images/design-sugerido/logo-beto-ribeiro.png'
import logoCorreioBraziliense from '@/src/assets/images/design-sugerido/logo-correio-braziliense.png'
import logoIstoE from '@/src/assets/images/design-sugerido/logo-istoe.png'
import logoJanelaPublicitaria from '@/src/assets/images/design-sugerido/logo-janela-publicitaria.png'
import logoPoltronaNerd from '@/src/assets/images/design-sugerido/logo-poltrona-nerd.png'
import logoVejaSp from '@/src/assets/images/design-sugerido/logo-veja-sp.png'

export const landingNavLinks = [
  { href: '#oque', label: 'O Clube' },
  { href: '#funciona', label: 'Como funciona' },
  { href: '#planos', label: 'Planos' },
  { href: '#avulsas', label: 'Avulsas' },
  { href: '#arquivos', label: 'Arquivos' },
]

export const promoItems = [
  'O CASO VICTÓRIA MONTEIRO — CAIXA 03 DE 12',
  'ASSINE ATÉ DIA 28 PRA ENTRAR NESTE CASO',
  'MAIS DE 1000 INVESTIGADORES NO CLUBE',
]

export const ribbonItems = [
  { label: 'PISTAS REAIS', color: '#EFBC18' },
  { label: 'ITENS COLECIONÁVEIS', color: '#C5271F' },
  { label: '12 CAIXAS, UMA VERDADE', color: '#1AA587' },
  { label: 'COMUNIDADE QUE TEORIZA', color: '#5E5EA2' },
]

export const boxItems: Array<{
  code: string
  title: string
  description: string
  color: string
  icon: TablerIcon
}> = [
  {
    code: 'ITEM A',
    title: 'Colecionáveis exclusivos',
    description:
      'Objetos temáticos produzidos só pra edição do mês. Não se compra em loja nenhuma.',
    color: '#C5271F',
    icon: IconGift,
  },
  {
    code: 'ITEM B',
    title: 'Pistas e documentos',
    description:
      'Depoimentos, recortes, mapas e fotos pra você analisar como um verdadeiro investigador.',
    color: '#E0A50A',
    icon: IconClipboardText,
  },
  {
    code: 'ITEM C',
    title: 'Um caso que evolui',
    description:
      'Um único mistério se desdobra ao longo de 12 caixas. Cada uma revela uma nova camada da verdade.',
    color: '#1AA587',
    icon: IconStack2,
  },
  {
    code: 'ITEM D',
    title: 'Comunidade pra teorizar',
    description:
      'Grupo exclusivo de membros pra trocar teorias, palpites e descobrir junto.',
    color: '#5E5EA2',
    icon: IconUsers,
  },
]

export const steps = [
  {
    number: '01',
    title: 'Assine',
    description:
      'Escolha o plano mensal ou anual. Sem fidelidade complicada — cancela quando quiser.',
    color: '#C5271F',
  },
  {
    number: '02',
    title: 'Receba em casa',
    description:
      'Sua caixa chega lacrada todo mês, com novas pistas e itens do caso em andamento.',
    color: '#EFBC18',
  },
  {
    number: '03',
    title: 'Investigue',
    description:
      'Mergulhe nas pistas, debata com a comunidade e monte sua própria teoria.',
    color: '#1AA587',
  },
]

export const testimonials = [
  {
    text: 'Eu literalmente espalhei as pistas na mesa da cozinha e passei o domingo investigando. Melhor assinatura que já fiz. 🔍',
    user: '@marianacosta',
    likes: '1.243',
    color: '#C5271F',
  },
  {
    text: 'O que me pegou não foi o ‘crime’ — foi entender a cabeza dos personagens. A escrita é absurda de boa.',
    user: '@pedro.hqs',
    likes: '982',
    color: '#E0A50A',
  },
  {
    text: 'A qualidade dos itens é surreal. Parece que veio de um arquivo de polícia de verdade. 😱',
    user: '@carol.investiga',
    likes: '760',
    color: '#1AA587',
  },
  {
    text: 'Virou ritual lá em casa. Todo mês a galera vem teorizar junto. Vira um programa.',
    user: '@thiagoreis',
    likes: '1.510',
    color: '#5E5EA2',
  },
]

export const archiveBoxes: Array<{
  box: string
  title: string
  price: string
  href: string
  image: StaticImageData
  alt: string
  objectPosition: string
}> = [
  {
    box: 'BOX 01',
    title: 'Primeira Página',
    price: 'R$ 149,90',
    href: '/loja/tcc-caixa-01-avulsa',
    image: archiveBox01,
    alt: 'Box 01 — Primeira Página',
    objectPosition: '42% 38%',
  },
  {
    box: 'BOX 02',
    title: 'Tudo ao Meu Alcance',
    price: 'R$ 149,90',
    href: '/loja/tcc-caixa-02-avulsa',
    image: archiveBox02,
    alt: 'Box 02 — Tudo ao Meu Alcance',
    objectPosition: 'center',
  },
  {
    box: 'BOX 03',
    title: 'Pena',
    price: 'R$ 149,90',
    href: '/loja/tcc-caixa-03-avulsa',
    image: archiveBox03,
    alt: 'Box 03 — Pena',
    objectPosition: 'center',
  },
  {
    box: 'BOX 04',
    title: 'Estão de Olho em Você',
    price: 'R$ 149,90',
    href: '/loja/tcc-caixa-04-avulsa',
    image: archiveBox04,
    alt: 'Box 04 — Estão de Olho em Você',
    objectPosition: 'center',
  },
]

export const featuredByLogos = [
  { src: logoBetoRibeiro, alt: 'Beto Ribeiro' },
  { src: logoVejaSp, alt: 'Veja São Paulo' },
  { src: logoIstoE, alt: 'ISTOÉ' },
  { src: logoCorreioBraziliense, alt: 'Correio Braziliense' },
  { src: logoJanelaPublicitaria, alt: 'Janela Publicitária' },
  { src: logoPoltronaNerd, alt: 'Poltrona Nerd' },
]

export const boardPinOffsets = [
  'calc(12.5% - 7.5px)',
  'calc(37.5% - 2.5px)',
  'calc(62.5% + 2.5px)',
  'calc(87.5% + 7.5px)',
]

export const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 85,
  damping: 13,
  mass: 0.7,
} as const
