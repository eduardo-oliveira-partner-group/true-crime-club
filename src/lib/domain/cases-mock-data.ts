export interface CaseFile {
  id: string
  name: string
  type: 'pdf' | 'image' | 'audio' | 'video'
  downloadUrl: string
  sizeLabel: string
}

export interface CaseFolder {
  name: string
  files: CaseFile[]
}

export interface CaseBox {
  number: number
  title: string
  description: string
  folders: {
    arquivos: CaseFolder
    documentos: CaseFolder
    pendrive: CaseFolder
  }
}

export const mockCaseBoxes: CaseBox[] = [
  {
    number: 1,
    title: 'Caixa 1: A Descoberta',
    description:
      'Primeiro ciclo de evidências sobre o desaparecimento de Victória Monteiro.',
    folders: {
      arquivos: {
        name: 'Arquivos dos casos',
        files: [
          {
            id: 'v-box1-file1',
            name: 'depoimento_testemunha_chave.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box1/depoimento_testemunha_chave.pdf',
            sizeLabel: '342 KB',
          },
          {
            id: 'v-box1-file2',
            name: 'laudo_preliminar_local.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box1/laudo_preliminar_local.pdf',
            sizeLabel: '1.2 MB',
          },
        ],
      },
      documentos: {
        name: 'Documentos',
        files: [
          {
            id: 'v-box1-file3',
            name: 'certidao_nascimento_victoria.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box1/certidao_nascimento_victoria.pdf',
            sizeLabel: '185 KB',
          },
          {
            id: 'v-box1-file4',
            name: 'registro_escolar_historico.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box1/registro_escolar_historico.pdf',
            sizeLabel: '512 KB',
          },
        ],
      },
      pendrive: {
        name: 'Pendrive',
        files: [
          {
            id: 'v-box1-file5',
            name: 'audio_gravacao_anonima.mp3',
            type: 'audio',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box1/audio_gravacao_anonima.mp3',
            sizeLabel: '3.4 MB',
          },
          {
            id: 'v-box1-file6',
            name: 'foto_carro_suspeito.jpg',
            type: 'image',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box1/foto_carro_suspeito.jpg',
            sizeLabel: '890 KB',
          },
        ],
      },
    },
  },
  {
    number: 2,
    title: 'Caixa 2: Rastros de Sangue',
    description:
      'Evidências coletadas na residência e análises de contas bancárias.',
    folders: {
      arquivos: {
        name: 'Arquivos dos casos',
        files: [
          {
            id: 'v-box2-file1',
            name: 'relatorio_pericia_luminol.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box2/relatorio_pericia_luminol.pdf',
            sizeLabel: '2.1 MB',
          },
          {
            id: 'v-box2-file2',
            name: 'depoimento_porteiro.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box2/depoimento_porteiro.pdf',
            sizeLabel: '280 KB',
          },
        ],
      },
      documentos: {
        name: 'Documentos',
        files: [
          {
            id: 'v-box2-file3',
            name: 'extrato_bancario_victoria.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box2/extrato_bancario_victoria.pdf',
            sizeLabel: '720 KB',
          },
          {
            id: 'v-box2-file4',
            name: 'contrato_locacao_imovel.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box2/contrato_locacao_imovel.pdf',
            sizeLabel: '1.4 MB',
          },
        ],
      },
      pendrive: {
        name: 'Pendrive',
        files: [
          {
            id: 'v-box2-file5',
            name: 'video_camera_seguranca.mp4',
            type: 'video',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box2/video_camera_seguranca.mp4',
            sizeLabel: '12.8 MB',
          },
          {
            id: 'v-box2-file6',
            name: 'foto_objeto_deixado.jpg',
            type: 'image',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box2/foto_objeto_deixado.jpg',
            sizeLabel: '640 KB',
          },
        ],
      },
    },
  },
  {
    number: 3,
    title: 'Caixa 3: O Álibi',
    description:
      'Confrontação dos depoimentos dos suspeitos e ligações suspeitas.',
    folders: {
      arquivos: {
        name: 'Arquivos dos casos',
        files: [
          {
            id: 'v-box3-file1',
            name: 'interrogatorio_principal_suspeito.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box3/interrogatorio_principal_suspeito.pdf',
            sizeLabel: '940 KB',
          },
          {
            id: 'v-box3-file2',
            name: 'depoimento_amiga_proxima.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box3/depoimento_amiga_proxima.pdf',
            sizeLabel: '410 KB',
          },
        ],
      },
      documentos: {
        name: 'Documentos',
        files: [
          {
            id: 'v-box3-file3',
            name: 'registro_ligacoes_celular.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box3/registro_ligacoes_celular.pdf',
            sizeLabel: '315 KB',
          },
          {
            id: 'v-box3-file4',
            name: 'passagem_aerea_compra.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box3/passagem_aerea_compra.pdf',
            sizeLabel: '120 KB',
          },
        ],
      },
      pendrive: {
        name: 'Pendrive',
        files: [
          {
            id: 'v-box3-file5',
            name: 'gravacao_ligacao_resgate.mp3',
            type: 'audio',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box3/gravacao_ligacao_resgate.mp3',
            sizeLabel: '4.8 MB',
          },
          {
            id: 'v-box3-file6',
            name: 'dados_gps_rastreador.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box3/dados_gps_rastreador.pdf',
            sizeLabel: '310 KB',
          },
        ],
      },
    },
  },
  {
    number: 4,
    title: 'Caixa 4: O Desfecho',
    description: 'Relatório conclusivo do inquérito e mandados de prisão.',
    folders: {
      arquivos: {
        name: 'Arquivos dos casos',
        files: [
          {
            id: 'v-box4-file1',
            name: 'relatorio_final_delegado.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box4/relatorio_final_delegado.pdf',
            sizeLabel: '4.5 MB',
          },
          {
            id: 'v-box4-file2',
            name: 'laudo_necropsia_definitivo.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box4/laudo_necropsia_definitivo.pdf',
            sizeLabel: '1.8 MB',
          },
        ],
      },
      documentos: {
        name: 'Documentos',
        files: [
          {
            id: 'v-box4-file3',
            name: 'carta_confissao_encontrada.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box4/carta_confissao_encontrada.pdf',
            sizeLabel: '210 KB',
          },
          {
            id: 'v-box4-file4',
            name: 'mandado_prisao_emitido.pdf',
            type: 'pdf',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box4/mandado_prisao_emitido.pdf',
            sizeLabel: '95 KB',
          },
        ],
      },
      pendrive: {
        name: 'Pendrive',
        files: [
          {
            id: 'v-box4-file5',
            name: 'video_reconstituicao_crime.mp4',
            type: 'video',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box4/video_reconstituicao_crime.mp4',
            sizeLabel: '22.4 MB',
          },
          {
            id: 'v-box4-file6',
            name: 'fotos_evidencias_finais.zip',
            type: 'image',
            downloadUrl:
              'https://true-crime-club-cases.s3.amazonaws.com/victoria-monteiro/box4/fotos_evidencias_finais.zip',
            sizeLabel: '8.7 MB',
          },
        ],
      },
    },
  },
]
