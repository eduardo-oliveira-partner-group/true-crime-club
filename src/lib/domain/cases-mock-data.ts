export interface CaseFile {
  id: string
  name: string
  type: 'folder' | 'image' | 'audio' | 'sheet' | 'text' | 'locked'
  modified: string
  size: string
  content?: string
  corrupted?: boolean
  downloadUrl?: string
  columns?: string[]
  rows?: string[][]
  children?: CaseFile[]
  fragment?: string
  transcript?: string
}

export const volumeInfo = {
  label: 'SEM RÓTULO',
  drive: 'E:',
  used: '5,9 GB',
  total: '8 GB',
}

export const unlockKey = 'P3n@P3n@'

export const pendriveTree: CaseFile[] = [
  {
    id: 'leiame',
    name: 'LEIA-ME.txt',
    type: 'text',
    modified: '28/02/2026 21:54',
    size: '1 KB',
    content: `se você está lendo isto, então ou aconteceu alguma coisa comigo
ou eu finalmente tomei coragem e entreguei tudo.

de qualquer jeito: o que está aqui não é fofoca. não é teoria.
é o que eu consegui fotografar antes que percebessem.

o Instituto Quintella não é o que dizem que é.
o que eles mostram por fora não é o que está nos papéis.
eu não consigo provar isso sozinha — então deixei tudo aqui.

confere com calma. principalmente as datas.

a parte que pesa de verdade eu tranquei.
a chave eu deixei onde só quem me conhece vai procurar.

— V.`,
  },
  {
    id: 'instituto_quintella',
    name: 'instituto_quintella',
    type: 'folder',
    modified: '27/02/2026 23:10',
    size: '4 itens',
    children: [
      {
        id: 'IMG_PD_01',
        name: 'escritura_zonasul_2022.jpg',
        type: 'image',
        modified: '21/02/2026 16:02',
        size: '3,4 MB',
        downloadUrl: '/imagens/pendrive/IMG_PD_01.jpg',
        content: 'Foto da Escritura Pública de Venda e Compra de terreno na Zona Sul de São Paulo, lavrada em 14/08/2022.',
      },
      {
        id: 'IMG_PD_02',
        name: 'convenio_quintella_p1.jpg',
        type: 'image',
        modified: '21/02/2026 16:03',
        size: '2,9 MB',
        downloadUrl: '/imagens/pendrive/IMG_PD_02.jpg',
        content: 'Cópia da página 1 do convênio de cooperação financeira assinado entre a prefeitura municipal e o Instituto Quintella.',
      },
      {
        id: 'IMG_PD_03',
        name: 'convenio_quintella_p2.jpg',
        type: 'image',
        modified: '21/02/2026 16:03',
        size: '2,7 MB',
        downloadUrl: '/imagens/pendrive/IMG_PD_03.jpg',
        content: 'Cópia da página 2 do convênio, mostrando assinaturas datadas de 03/11/2023.',
      },
      {
        id: 'IMG_PD_04',
        name: 'planilha_pc_lucas.jpg',
        type: 'image',
        modified: '19/02/2026 22:41',
        size: '2,1 MB',
        downloadUrl: '/imagens/pendrive/IMG_PD_04.jpg',
        content: 'Planilha de contabilidade extraída do computador do Lucas, registrando lotes, valores de desapropriação e titularidade anterior.',
      },
      {
        id: 'prints_instagram_ong',
        name: 'prints_instagram_ong',
        type: 'folder',
        modified: '25/02/2026 19:30',
        size: '3 itens',
        children: [
          {
            id: 'IMG_PD_05',
            name: 'post_inauguracao.png',
            type: 'image',
            modified: '25/02/2026 19:28',
            size: '880 KB',
            downloadUrl: '/imagens/pendrive/IMG_PD_05.jpg',
            content: 'Print da postagem do Instagram celebrando a inauguração da sede própria em 18/01/2023.',
          },
          {
            id: 'IMG_PD_06',
            name: 'post_100familias.png',
            type: 'image',
            modified: '25/02/2026 19:29',
            size: '910 KB',
            downloadUrl: '/imagens/pendrive/IMG_PD_06.jpg',
            content: 'Print do infográfico divulgando a marca de 100 famílias atendidas pelo projeto social.',
          },
          {
            id: 'IMG_PD_07',
            name: 'post_evento_beneficente.png',
            type: 'image',
            modified: '25/02/2026 19:29',
            size: '1,2 MB',
            downloadUrl: '/imagens/pendrive/IMG_PD_07.jpg',
            content: 'Print de divulgação do evento beneficente realizado na Zona Sul em 22/05/2025.',
          },
        ],
      },
    ],
  },
  {
    id: 'linha_do_tempo',
    name: 'linha_do_tempo',
    type: 'folder',
    modified: '27/02/2026 23:55',
    size: '3 itens',
    children: [
      {
        id: 'datas_x_posts',
        name: 'datas_x_posts.xlsx',
        type: 'sheet',
        modified: '27/02/2026 23:51',
        size: '24 KB',
        columns: ['O que foi divulgado', 'Data no Instagram', 'Data no documento', 'Não fecha porque...'],
        rows: [
          [
            'Inauguração da sede própria',
            '18/01/2023',
            'escritura do terreno 14/08/2022',
            'terreno comprado meses antes da "inauguração" comemorada',
          ],
          [
            'Convênio com a prefeitura',
            'anunciado jan/2024',
            'assinado 03/11/2023',
            'dois meses de silêncio entre assinar e divulgar',
          ],
          [
            '100 famílias atendidas no ano',
            '27/02/2026',
            'sem balanço público',
            'número alardeado sem nenhum relatório que comprove',
          ],
          [
            'Evento beneficente — zona sul',
            '22/05/2025',
            'área em processo de desapropriação',
            '"beneficiando" um bairro que estava sendo esvaziado',
          ],
        ],
      },
      {
        id: 'anotacoes',
        name: 'anotacoes.txt',
        type: 'text',
        modified: '27/02/2026 23:54',
        size: '2 KB',
        content: `anotações — NÃO é pra ninguém ler ainda

. comecei conferindo as datas só por teimosia. agora não consigo
  parar de ver: cada post bonitinho deles tem um papel que diz o contrário.

. 14/08/2022 — escritura do terreno (zona sul). bem antes de tudo.
. 18/01/2023 — eles postam "INAUGURAMOS a sede". mas o terreno é de 2022.
. 03/11/2023 — convênio com a prefeitura assinado.
. jan/2024 — só AGORA anunciam o convênio. por que segurar dois meses?

. a planilha do PC do L. é a chave. "titular anterior" +
  "valor" + as áreas — se eu cruzar isso com os nomes certos, fecha.
  eu só tive uns segundos pra fotografar.

. não dá pra publicar isso solto. precisa do conjunto.
  por isso o resto foi pro arquivo trancado.

. se eu sumir e alguém abrir isto: olha as DATAS. é tudo nas datas.`,
      },
      {
        id: 'AUD_PD_01',
        name: 'gravacao_voz_22-02.m4a',
        type: 'audio',
        corrupted: true,
        modified: '22/02/2026 23:17',
        size: '412 KB',
        downloadUrl: '/audio/AUD_PD_01.m4a',
        fragment: '…achei melhor gravar do que escrever. o que eu descobri sobre as datas do—',
        transcript: 'achei melhor gravar do que escrever. o que eu descobri sobre as datas do—',
      },
    ],
  },
  {
    id: 'pessoal',
    name: 'pessoal',
    type: 'folder',
    modified: '14/02/2026 10:12',
    size: '3 itens',
    children: [
      {
        id: 'receita',
        name: 'receita_bolo_fuba.txt',
        type: 'text',
        modified: '09/01/2026 18:40',
        size: '1 KB',
        content: `bolo de fubá da vó (do jeito certo)

2 xícaras de fubá
1 xícara de farinha
3 ovos
2 xícaras de açúcar
1 xícara de óleo
2 xícaras de leite
1 colher de fermento
erva-doce a gosto

bate tudo no liquidificador menos o fermento.
fermento por último, mexendo na mão.
forno 180º, ~40 min.

(fazer pra lari no aniversário dela)`,
      },
      {
        id: 'playlist',
        name: 'playlist.txt',
        type: 'text',
        modified: '02/02/2026 23:11',
        size: '1 KB',
        content: `pra escrever / pra pensar

- algo de piano, sem letra
- aquela trilha do Aftersun
- Frances Ha (a cena da dança)
- nada com notícia. silêncio também conta.`,
      },
      {
        id: 'IMG_PD_08',
        name: 'foto_lari_eu.jpg',
        type: 'image',
        modified: '31/12/2025 23:58',
        size: '4,0 MB',
        downloadUrl: '/imagens/pendrive/IMG_PD_08.jpg',
        content: 'Fotografia mostrando Victória e Larissa sorrindo, registrada na noite de ano novo.',
      },
    ],
  },
  {
    id: 'arquivo_paralelo',
    name: 'arquivo_paralelo.zip',
    type: 'locked',
    modified: '28/02/2026 21:48',
    size: '18,6 MB',
    children: [
      {
        id: 'sintese',
        name: 'sintese.txt',
        type: 'text',
        modified: '28/02/2026 21:47',
        size: '3 KB',
        content: `SÍNTESE — o que eu acho que está acontecendo
(não é prova de tudo. é o fio. puxa.)

1. o Instituto Quintella se apresenta como filantropia.
   na prática, ele aparece sempre perto de áreas que mudam de dono
   logo antes de virarem "projeto" da cidade.

2. quem assina dos dois lados, em momentos diferentes, é gente
   ligada ao meu pai. e o nome Roberto Rocha aparece mais de uma vez
   onde não devia.

3. as datas são o problema deles. eles contam uma história pro público
   (Instagram, eventos) e outra história nos papéis. as duas não cabem
   no mesmo calendário.

4. o L. tem acesso a isso. não sei se ele entende o que tem em mãos
   ou se só faz o que mandam. quero acreditar na segunda.

5. eu NÃO tenho a prova final aqui. tenho o desenho.
   a prova final são os documentos originais — e esses eu não consigo
   tirar de onde estão sem que percebam.

se algo me aconteceu: não é acidente. comecem pelas datas,
e perguntem por que um instituto que "ajuda" precisa de tanto sigilo.

— V.`,
      },
      {
        id: 'pendencias',
        name: 'o_que_falta.txt',
        type: 'text',
        modified: '28/02/2026 21:48',
        size: '1 KB',
        content: `o que ainda falta (e onde pode estar)

- a escritura ORIGINAL, não a foto. (cartório / arquivo paralelo)
- o vínculo direto, no papel, entre o nome dele e o instituto.
- a confirmação de quem mandou os bombons com o aviso.

isso não está neste pen drive.
está na pasta amarela, e na mochila azul sem brasão.
quem leu minhas anotações sabe onde procurar.`,
      },
    ],
  },
]
