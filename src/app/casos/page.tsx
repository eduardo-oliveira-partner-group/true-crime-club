/* eslint-disable @next/next/no-img-element */
'use client'

import 'vault66-crt-effect/dist/vault66-crt-effect.css'

import {
  IconAlertTriangle,
  IconCheck,
  IconDownload,
  IconFileSpreadsheet,
  IconFileText,
  IconMusic,
  IconPhoto,
  IconPlayerPause,
  IconPlayerPlay,
} from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import CRTEffect from 'vault66-crt-effect'

import { apiClient } from '@/src/lib/api-client'

// Layout Stages
type ViewStage =
  | 'investigador-root'
  | 'casos-list'
  | 'caso-detail'
  | 'arquivos-list'

interface CasoFile {
  id: string
  name: string
  type: 'audio' | 'image' | 'text' | 'sheet'
  modified: string
  size: string
  downloadUrl?: string
  content?: string
  corrupted?: boolean
  columns?: string[]
  rows?: string[][]
  fragment?: string
}

// Mock Files mapped by Box and Category
const mockFilesByBox: Record<
  string,
  Record<'arquivos' | 'documentos', CasoFile[]>
> = {
  'box-1': { arquivos: [], documentos: [] },
  'box-2': { arquivos: [], documentos: [] },
  'box-3': { arquivos: [], documentos: [] },
  'box-4': {
    arquivos: [
      {
        id: 'audio_larissa',
        name: 'Audio_Larissa.mp3',
        type: 'audio',
        modified: '22/02/2026 23:17',
        size: '412 KB',
        downloadUrl: '/audio/AUD_PD_01.m4a',
        fragment:
          '…achei melhor gravar do que escrever. o que eu descobri sobre as datas do—',
        corrupted: true,
      },
      {
        id: 'foto_mesa',
        name: 'fotos_mesa_de_trabalho_Larissa.Jpg',
        type: 'image',
        modified: '31/12/2025 23:58',
        size: '4,0 MB',
        downloadUrl: '/imagens/pendrive/IMG_PD_08.jpg',
        content:
          'Fotografia mostrando Victória e Larissa sorrindo, registrada na noite de ano novo.',
      },
    ],
    documentos: [
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
        id: 'datas_x_posts',
        name: 'datas_x_posts.xlsx',
        type: 'sheet',
        modified: '27/02/2026 23:51',
        size: '24 KB',
        columns: [
          'O que foi divulgado',
          'Data no Instagram',
          'Data no documento',
          'Não fecha porque...',
        ],
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
    ],
  },
  'box-5': { arquivos: [], documentos: [] },
  'box-6': { arquivos: [], documentos: [] },
}

export default function CasosPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // Current stage in the investigator area
  const [viewStage, setViewStage] = useState<ViewStage>('investigador-root')

  // Selected state
  const [selectedBox, setSelectedBox] = useState<string>('box-4')
  const [selectedCategory, setSelectedCategory] = useState<
    'arquivos' | 'documentos'
  >('arquivos')
  const [selectedFile, setSelectedFile] = useState<CasoFile | null>(null)

  // Modal visualizer states
  const [isImageZoomed, setIsImageZoomed] = useState(false)

  // Audio corruption recovery simulation states
  const [audioRecoveryProgress, setAudioRecoveryProgress] = useState<
    Record<string, number>
  >({})
  const [audioRecoveryLogs, setAudioRecoveryLogs] = useState<
    Record<string, string[]>
  >({})
  const [isRecoveringAudio, setIsRecoveringAudio] = useState<
    Record<string, boolean>
  >({})
  const [recoveredAudios, setRecoveredAudios] = useState<
    Record<string, boolean>
  >({})
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({})

  // Auth check on mount
  useEffect(() => {
    apiClient.auth
      .me()
      .then((customer) => {
        if (customer) {
          setIsAuthenticated(true)
          localStorage.setItem('isLoggedIn', 'true')
        } else {
          router.push('/login')
        }
      })
      .catch(() => {
        localStorage.removeItem('isLoggedIn')
        router.push('/login')
      })
      .finally(() => {
        setLoadingAuth(false)
      })
  }, [router])

  // Pause audio when modal closes or changes
  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause()
      }
    })
    setIsPlayingAudio(false)
    setAudioCurrentTime(0)
  }, [selectedFile])

  // Navigation handlers
  const handleGoBack = () => {
    if (viewStage === 'investigador-root') {
      router.push('/cliente/perfil')
    } else if (viewStage === 'casos-list') {
      setViewStage('investigador-root')
    } else if (viewStage === 'caso-detail') {
      setViewStage('casos-list')
    } else if (viewStage === 'arquivos-list') {
      setViewStage('caso-detail')
    }
  }

  // Audio corruption recovery simulation
  const handleRecoverAudio = (fileId: string) => {
    if (isRecoveringAudio[fileId]) return

    setIsRecoveringAudio((prev) => ({ ...prev, [fileId]: true }))
    setAudioRecoveryProgress((prev) => ({ ...prev, [fileId]: 0 }))
    setAudioRecoveryLogs((prev) => ({ ...prev, [fileId]: [] }))

    const steps = [
      { pct: 15, text: '[SYS] inicializando varredura de setores...' },
      { pct: 40, text: '[SYS] reconstruindo cabeçalhos binários perdidos...' },
      { pct: 70, text: '[SYS] alinhando canais de áudio fragmentados...' },
      { pct: 90, text: '[SYS] executando correção de ruído estático...' },
      { pct: 100, text: '[OK ] arquivo de áudio restaurado com sucesso.' },
    ]

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      }

      setAudioRecoveryProgress((prev) => ({ ...prev, [fileId]: progress }))

      steps.forEach((stepItem) => {
        if (progress >= stepItem.pct) {
          const stepText = stepItem.text
          setAudioRecoveryLogs((prev) => {
            const currentLogs = prev[fileId] || []
            if (!currentLogs.includes(stepText)) {
              return { ...prev, [fileId]: [...currentLogs, stepText] }
            }
            return prev
          })
        }
      })

      if (progress === 100) {
        setTimeout(() => {
          setRecoveredAudios((prev) => ({ ...prev, [fileId]: true }))
          setIsRecoveringAudio((prev) => ({ ...prev, [fileId]: false }))
        }, 400)
      }
    }, 150)
  }

  const handleTogglePlay = (fileId: string) => {
    const audioEl = audioRefs.current[fileId]
    if (!audioEl) return

    if (isPlayingAudio) {
      audioEl.pause()
      setIsPlayingAudio(false)
    } else {
      audioEl.play()
      setIsPlayingAudio(true)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#171c16] font-handjet text-[#62b543]">
        <div className="space-y-3 text-center">
          <div className="mx-auto size-12 animate-pulse rounded-full border border-[#62b543]" />
          <p className="text-sm font-bold tracking-widest uppercase">
            CONECTANDO AO SISTEMA...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }
  const currentFiles = mockFilesByBox[selectedBox]?.[selectedCategory] || []

  return (
    <CRTEffect
      enableScanlines
      enableSweep
      enableEdgeGlow
      enableFlicker
      enableNoise
      enableVignette
      flickerIntensity={0.02}
      flickerSpeed={5}
      scanlineOpacity={0.08}
      sweepDuration={4}
      sweepThickness={8}
      glowColor="rgba(85, 255, 80, 0.25)"
      edgeGlowColor="rgba(90, 255, 80, 0.2)"
    >
      <main className="flex min-h-screen flex-col justify-between bg-[#071008] p-4 font-handjet text-[#62ff4d] md:p-8">
        <style
          dangerouslySetInnerHTML={{
            __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(98, 181, 67, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(98, 181, 67, 0.6);
        }
      `,
          }}
        />
        <div className="flex flex-1 flex-col justify-start">
          {/* Header */}
          <header className="mb-6 flex flex-row items-center gap-4 border-b border-[#62b543]/40 pb-4">
            <img
              src="/imagens/logo.png"
              alt="PCSP Logo"
              className="size-16 object-contain md:size-20"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <h1 className="text-left text-base/tight font-bold tracking-wider text-[#62b543] uppercase md:text-xl lg:text-2xl">
              DELEGACIA DE
              <br className="block md:hidden" /> INVESTIGAÇÕES GERAIS - DIG
            </h1>
          </header>

          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={handleGoBack}
              className="flex cursor-pointer items-center gap-2 border border-[#62b543] px-6 py-2 text-2xl font-bold transition-all hover:bg-[#62b543]/10 md:text-3xl"
            >
              Voltar
            </button>
          </div>

          {/* ---------------- STAGE 1: INVESTIGADOR ROOT ---------------- */}
          {viewStage === 'investigador-root' && (
            <div className="flex flex-1 flex-col items-center justify-center py-10">
              <button
                onClick={() => setViewStage('casos-list')}
                className="group flex cursor-pointer flex-col items-center justify-center"
              >
                <div className="size-32 p-4 transition-all duration-300 md:size-40">
                  <img
                    src="/imagens/icons/Casos.png"
                    alt="Casos"
                    className="size-full object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <span className="mt-4 text-2xl font-bold tracking-wider group-hover:underline">
                  Casos
                </span>
              </button>
            </div>
          )}

          {/* ---------------- STAGE 2: CASOS LIST ---------------- */}
          {viewStage === 'casos-list' && (
            <div className="flex flex-1 flex-col items-center justify-center py-6">
              <div className="grid w-full max-w-4xl grid-cols-1 gap-8 px-4 md:gap-16">
                {/* Caso Victoria Monteiro */}
                <button
                  onClick={() => {
                    setViewStage('caso-detail')
                  }}
                  className="group flex cursor-pointer flex-col items-center justify-center"
                >
                  <img
                    src="/imagens/icons/Caso_VictoriaMonteiro.png"
                    alt="Caso Victoria"
                    className="mb-3 size-24 object-contain transition-transform group-hover:scale-105 md:size-32"
                  />
                  <span className="text-center text-2xl font-bold tracking-wide group-hover:underline">
                    Caso - Victória Monteiro
                  </span>
                </button>

                {/* Caso X */}
                {/* <div className="flex flex-col items-center justify-center opacity-60">
                  <img
                    src="/imagens/icons/Caso_VictoriaMonteiro.png"
                    alt="Caso X"
                    className="mb-3 size-32 object-contain grayscale filter md:size-40"
                  />
                  <span className="text-center text-2xl font-bold tracking-wide md:text-3xl">
                    Caso - X
                  </span>
                </div> */}

                {/* Caso Y */}
                {/* <div className="flex flex-col items-center justify-center opacity-60">
                  <img
                    src="/imagens/icons/Caso_VictoriaMonteiro.png"
                    alt="Caso Y"
                    className="mb-3 size-32 object-contain grayscale filter md:size-40"
                  />
                  <span className="text-center text-2xl font-bold tracking-wide md:text-3xl">
                    Caso - Y
                  </span>
                </div> */}
              </div>
            </div>
          )}

          {/* ---------------- STAGE 3: CASO DETAIL ---------------- */}
          {viewStage === 'caso-detail' && (
            <div className="flex flex-1 flex-col">
              {/* Title Bar */}
              <div className="mb-6 flex items-center gap-3 border-b border-[#62b543] pb-4">
                {/* Responsive title based on PDF specs: "Caso - Victória Monteiro" on desktop, "Arquivos dos casos" on mobile */}
                <img
                  src="/imagens/icons/Caso_VictoriaMonteiro.png"
                  alt="Case icon"
                  className="hidden size-8 object-contain md:block"
                />
                <img
                  src="/imagens/icons/Arquivos_dos_casos.png"
                  alt="Case icon mobile"
                  className="size-8 object-contain md:hidden"
                />
                <span className="hidden text-2xl font-bold tracking-wider md:inline">
                  Caso - Victória Monteiro
                </span>
                <span className="text-2xl font-bold tracking-wider md:hidden">
                  Arquivos dos casos
                </span>
              </div>

              {/* Main Dual-Column Panel */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] md:gap-10">
                {/* Left Column: Boxes list */}
                <div className="border-b border-[#62b543]/20 pb-4 md:border-y md:border-b-0 md:border-[#62b543] md:py-2 md:pb-0">
                  <aside
                    data-lenis-prevent
                    className="custom-scrollbar flex max-h-[280px] flex-col gap-2 overflow-y-auto pr-2 md:max-h-[320px]"
                  >
                    {(() => {
                      const allBoxes = Array.from(
                        { length: 12 },
                        (_, i) => i + 1,
                      )
                      return allBoxes.map((num) => {
                        const boxId = `box-${num}`
                        const isSelected = selectedBox === boxId
                        return (
                          <button
                            key={boxId}
                            onClick={() => setSelectedBox(boxId)}
                            className={`flex cursor-pointer items-center gap-3 px-4 py-2 font-handjet text-xl font-bold tracking-wider transition-all ${
                              isSelected
                                ? 'border border-[#62b543] bg-[#62b543] text-[#171c16]'
                                : 'border border-transparent bg-transparent text-[#62b543] hover:bg-[#62b543]/10'
                            }`}
                          >
                            <img
                              src="/imagens/icons/Caixa.png"
                              alt="Box icon"
                              className={`size-5 object-contain ${isSelected ? 'brightness-0' : ''}`}
                            />
                            <span>Box {num}</span>
                          </button>
                        )
                      })
                    })()}
                  </aside>
                </div>

                {/* Right Column: Folders select */}
                <main className="flex items-center justify-center py-6 md:py-12">
                  <div className="grid w-full max-w-lg grid-cols-2 gap-8 px-6">
                    {/* Category: Arquivos do caso */}
                    <button
                      onClick={() => {
                        setSelectedCategory('arquivos')
                        setViewStage('arquivos-list')
                      }}
                      className="group flex cursor-pointer flex-col items-center justify-center bg-transparent p-6 text-[#62b543] transition-all"
                    >
                      <img
                        src="/imagens/icons/Arquivos_dos_casos.png"
                        alt="Arquivos do caso"
                        className="mb-3 size-16 object-contain transition-transform group-hover:scale-105"
                      />
                      <span className="text-center font-handjet text-2xl font-bold tracking-wider">
                        Arquivos do caso
                      </span>
                    </button>

                    {/* Category: Documentos */}
                    <button
                      onClick={() => {
                        setSelectedCategory('documentos')
                        setViewStage('arquivos-list')
                      }}
                      className="group flex cursor-pointer flex-col items-center justify-center bg-transparent p-6 text-[#62b543] transition-all"
                    >
                      <img
                        src="/imagens/icons/Documentos.png"
                        alt="Documentos"
                        className="mb-3 size-16 object-contain transition-transform group-hover:scale-105"
                      />
                      <span className="text-center font-handjet text-2xl font-bold tracking-wider">
                        Documentos
                      </span>
                    </button>
                  </div>
                </main>
              </div>
            </div>
          )}

          {/* ---------------- STAGE 4: ARQUIVOS LIST ---------------- */}
          {viewStage === 'arquivos-list' && (
            <div className="flex flex-1 flex-col">
              {/* Title Bar */}
              <div className="mb-6 flex items-center gap-3 border-b border-[#62b543] pb-4">
                <img
                  src={
                    selectedCategory === 'arquivos'
                      ? '/imagens/icons/Arquivos_dos_casos.png'
                      : '/imagens/icons/Documentos.png'
                  }
                  alt="Category icon"
                  className="size-8 object-contain"
                />
                <span className="text-2xl font-bold tracking-wider">
                  {selectedCategory === 'arquivos'
                    ? 'Arquivos do Caso'
                    : 'Documentos'}
                </span>
              </div>

              {/* Files List */}
              {currentFiles.length === 0 ? (
                <div className="flex min-h-[300px] flex-1 items-center justify-center text-sm text-[#62b543]/60 italic">
                  Pasta vazia ou contêiner bloqueado.
                </div>
              ) : (
                <div className="divide-y divide-[#62b543]/20">
                  {currentFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className="flex cursor-pointer items-center gap-4 py-4 transition-colors hover:bg-[#62b543]/10"
                    >
                      <span className="shrink-0">
                        {file.type === 'audio' && (
                          <IconMusic className="size-6 text-[#62b543] md:size-7" />
                        )}
                        {file.type === 'image' && (
                          <IconPhoto className="size-6 text-[#62b543] md:size-7" />
                        )}
                        {file.type === 'text' && (
                          <IconFileText className="size-6 text-[#62b543] md:size-7" />
                        )}
                        {file.type === 'sheet' && (
                          <IconFileSpreadsheet className="size-6 text-[#62b543] md:size-7" />
                        )}
                      </span>
                      <span className="text-xl hover:underline md:text-2xl">
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-[#62b543]/40 pt-4">
          <div className="flex justify-center font-handjet text-sm tracking-widest text-[#62b543]/60">
            <span>© 2026, True crime Club</span>
          </div>
        </footer>

        {/* ---------------- FILE VIEWER MODAL OVERLAY ---------------- */}
        {selectedFile && (
          <div
            onClick={() => {
              setSelectedFile(null)
              setIsImageZoomed(false)
            }}
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/90 p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[90vh] w-full max-w-3xl cursor-default flex-col justify-between border border-[#62b543] bg-[#171c16] font-handjet text-[#62b543] shadow-[0_0_30px_rgba(98,181,67,0.2)]"
            >
              {/* Header bar */}
              <div className="flex shrink-0 items-center justify-between border-b border-[#62b543]/30 bg-[#171c16] p-3 text-lg font-bold tracking-wider">
                <span className="truncate">
                  Visualizador: {selectedFile.name}
                </span>
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setIsImageZoomed(false)
                  }}
                  className="size-6 cursor-pointer border border-[#62b543]/40 text-center leading-5 transition-colors hover:border-[#62b543]"
                >
                  ✕
                </button>
              </div>

              {/* Meta Data Panel */}
              <div className="shrink-0 space-y-0.5 border-b border-[#62b543]/20 bg-[#171c16] p-3 text-xs/relaxed opacity-85">
                <div>
                  <b>ID DA EVIDÊNCIA:</b> {selectedFile.id}
                </div>
                <div>
                  <b>TIPO REGISTRADO:</b> {selectedFile.type.toUpperCase()}
                </div>
                <div>
                  <b>TAMANHO FORENSE:</b> {selectedFile.size}
                </div>
                <div className="truncate">
                  <b>SHA-256:</b>{' '}
                  f3a7d9b8e62c140df95a631bcde4529a73bd1056ef9823ac54bc1bde
                  {selectedFile.id}
                </div>
              </div>

              {/* Modal Body */}
              <div
                data-lenis-prevent
                className="max-h-[55vh] flex-1 overflow-y-auto bg-black/20 p-4 md:p-6"
              >
                {/* TEXT VIEW */}
                {selectedFile.type === 'text' && (
                  <div className="rounded border border-[#62b543]/20 bg-black/40 p-4 text-lg/relaxed whitespace-pre-wrap text-[#62b543]/90 select-text">
                    {selectedFile.content}
                  </div>
                )}

                {/* SHEET (SPREADSHEET) VIEW */}
                {selectedFile.type === 'sheet' && (
                  <div
                    data-lenis-prevent
                    className="overflow-x-auto rounded border border-[#62b543]/30 bg-black/40"
                  >
                    <table className="w-full border-collapse text-left text-lg text-[#62b543]/90">
                      <thead>
                        <tr className="border-b border-[#62b543]/30 bg-[#62b543]/10">
                          {selectedFile.columns?.map((col, idx) => (
                            <th
                              key={idx}
                              className="border-r border-[#62b543]/20 p-2 text-sm font-bold tracking-wider uppercase"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#62b543]/20">
                        {selectedFile.rows?.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#62b543]/5">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className="border-r border-[#62b543]/10 p-2"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* IMAGE VIEW */}
                {selectedFile.type === 'image' && (
                  <div className="space-y-4">
                    <div className="relative rounded border border-[#62b543]/30 bg-black p-4 text-center">
                      <img
                        src={selectedFile.downloadUrl}
                        alt={selectedFile.name}
                        onClick={() => setIsImageZoomed(true)}
                        className="mx-auto max-h-[380px] max-w-full cursor-zoom-in border border-[#62b543]/20 object-contain transition-all hover:border-[#62b543]"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const fallbackDiv = e.currentTarget
                            .nextElementSibling as HTMLDivElement
                          if (fallbackDiv) fallbackDiv.style.display = 'block'
                        }}
                      />
                      <div className="hidden space-y-4 py-8">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-dashed border-[#62b543] text-lg font-bold">
                          IMG
                        </div>
                        <div className="mx-auto max-w-md text-xs/relaxed text-[#62b543]/80">
                          (fonte de imagem indisponível —{' '}
                          {selectedFile.downloadUrl})
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-[#62b543]/50">
                        [ CLIQUE NA IMAGEM PARA AMPLIAR / ZOOM ]
                      </div>
                      <div className="mt-3 border-l-2 border-[#62b543]/40 pl-3 text-left text-[11px] text-[#62b543]/70">
                        {selectedFile.content}
                      </div>
                    </div>
                  </div>
                )}

                {/* AUDIO VIEW WITH CORRUPTION RECOVERY */}
                {selectedFile.type === 'audio' && (
                  <div className="space-y-5">
                    {selectedFile.corrupted &&
                    !recoveredAudios[selectedFile.id] ? (
                      /* CORRUPTED STATE */
                      <div className="space-y-4 rounded border border-red-500/40 bg-red-950/20 p-5 text-center">
                        <div className="flex justify-center text-red-500">
                          <IconAlertTriangle className="size-12 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-red-500 uppercase">
                            ARQUIVO CORROMPIDO OU SETOR DEFEITUOSO DETECTADO
                          </h4>
                          <p className="mx-auto max-w-md text-[11px] leading-relaxed text-red-300">
                            O arquivo{' '}
                            <span className="font-bold">
                              {selectedFile.name}
                            </span>{' '}
                            apresenta perda de pacotes e sincronização de
                            cabeçalhos binários.
                          </p>
                        </div>

                        {isRecoveringAudio[selectedFile.id] ? (
                          /* RECOVERY IN PROGRESS */
                          <div className="mx-auto max-w-sm space-y-3 pt-2 text-left">
                            <div className="flex justify-between text-[11px] font-bold text-[#62b543]">
                              <span>RECONSTRUINDO PACOTES DE ONDA:</span>
                              <span>
                                {audioRecoveryProgress[selectedFile.id]}%
                              </span>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full border border-[#62b543]/30 bg-black p-0.5">
                              <div
                                className="h-full rounded-full bg-[#62b543] transition-all duration-100 ease-out"
                                style={{
                                  width: `${audioRecoveryProgress[selectedFile.id]}%`,
                                }}
                              />
                            </div>
                            <div
                              data-lenis-prevent
                              className="max-h-16 space-y-0.5 overflow-y-auto rounded bg-black/40 p-2 text-[9px] text-[#62b543]/70"
                            >
                              {(audioRecoveryLogs[selectedFile.id] || []).map(
                                (log, idx) => (
                                  <div key={idx}>{log}</div>
                                ),
                              )}
                            </div>
                          </div>
                        ) : (
                          /* RECOVER TRIGGER BUTTON */
                          <button
                            onClick={() => handleRecoverAudio(selectedFile.id)}
                            className="cursor-pointer rounded border border-[#62b543] bg-[#62b543]/10 px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-all hover:bg-[#62b543]/20"
                          >
                            [ RECONSTRUIR ARQUIVO ]
                          </button>
                        )}
                      </div>
                    ) : (
                      /* RECOVERED / REGULAR AUDIO VIEW */
                      <div className="space-y-4">
                        {selectedFile.corrupted && (
                          <div className="flex items-center gap-2 rounded border border-[#62b543]/30 bg-[#62b543]/10 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase">
                            <IconCheck className="size-4 shrink-0 text-[#62b543]" />
                            <span>
                              Arquivo recuperado via alinhamento forense digital
                              de canais
                            </span>
                          </div>
                        )}

                        <audio
                          ref={(el) => {
                            audioRefs.current[selectedFile.id] = el
                            if (el) {
                              el.onplay = () => setIsPlayingAudio(true)
                              el.onpause = () => setIsPlayingAudio(false)
                              el.onended = () => {
                                setIsPlayingAudio(false)
                                setAudioCurrentTime(0)
                              }
                              el.ontimeupdate = () =>
                                setAudioCurrentTime(el.currentTime)
                              el.onloadedmetadata = () =>
                                setAudioDuration(el.duration)
                            }
                          }}
                          src={selectedFile.downloadUrl}
                          className="hidden"
                        />

                        <div className="flex flex-col items-center justify-between gap-6 rounded border border-[#62b543]/30 bg-black/20 p-5 md:flex-row">
                          {/* Play/Pause Button */}
                          <div className="flex shrink-0 items-center gap-4">
                            <button
                              onClick={() => handleTogglePlay(selectedFile.id)}
                              className="flex size-14 cursor-pointer items-center justify-center rounded-full border-2 border-[#62b543] bg-[#62b543]/10 text-[#62b543] transition-all hover:bg-[#62b543]/20 focus:outline-none"
                              aria-label={isPlayingAudio ? 'Pausar' : 'Tocar'}
                            >
                              {isPlayingAudio ? (
                                <IconPlayerPause className="size-7 fill-[#62b543] text-[#62b543]" />
                              ) : (
                                <IconPlayerPlay className="size-7 fill-[#62b543] pl-0.5 text-[#62b543]" />
                              )}
                            </button>

                            <div className="flex flex-col text-xs">
                              <span className="text-sm font-bold tracking-wider">
                                {isPlayingAudio ? 'REPRODUZINDO' : 'PAUSADO'}
                              </span>
                              <span className="mt-0.5 opacity-60">
                                {formatTime(audioCurrentTime)} /{' '}
                                {formatTime(audioDuration || 6)}
                              </span>
                            </div>
                          </div>

                          {/* Waveform Visualizer */}
                          <div className="flex h-14 w-full flex-1 items-center justify-center gap-1.5 rounded border border-[#62b543]/10 bg-black/40 px-4">
                            {[
                              35, 60, 45, 90, 75, 40, 20, 80, 50, 95, 35, 70,
                              85, 45, 60, 25, 55, 90, 40, 75, 20, 80, 65, 30,
                            ].map((h, idx) => {
                              const animClass = isPlayingAudio
                                ? 'animate-pulse'
                                : ''
                              const heightFactor = isPlayingAudio
                                ? Math.sin(audioCurrentTime * 10 + idx) * 15 + h
                                : h
                              const heightPct = Math.min(
                                100,
                                Math.max(10, heightFactor),
                              )

                              return (
                                <div
                                  key={idx}
                                  className={`w-1 rounded-full bg-[#62b543] transition-all duration-150 ${animClass}`}
                                  style={{
                                    height: `${heightPct}%`,
                                    animationDelay: `${idx * 0.04}s`,
                                  }}
                                />
                              )
                            })}
                          </div>
                        </div>

                        {/* Audio Transcript Box */}
                        <div className="space-y-2 rounded border border-[#62b543]/20 bg-black/40 p-4">
                          <span className="block border-b border-[#62b543]/10 pb-1 text-[10px] font-bold tracking-widest opacity-60">
                            {'// transcrição automática (parcial):'}
                          </span>
                          <p className="text-xs/relaxed italic select-text">
                            <span>&ldquo;{selectedFile.fragment}&rdquo;</span>{' '}
                            <span className="text-red-500">
                              [sinal perdido]
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex shrink-0 flex-col gap-3 border-t border-[#62b543]/30 bg-[#171c16] p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                {selectedFile.downloadUrl ? (
                  <a
                    href={selectedFile.downloadUrl}
                    download
                    className="flex w-full cursor-pointer items-center justify-center gap-2 border border-[#62b543]/40 px-4 py-1.5 font-handjet tracking-wider whitespace-nowrap uppercase hover:border-[#62b543] hover:bg-[#62b543]/10 sm:w-auto"
                  >
                    <IconDownload className="size-4" />[ Exportar Cópia / Baixar
                    ]
                  </a>
                ) : (
                  <div className="hidden sm:block" />
                )}
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setIsImageZoomed(false)
                  }}
                  className="w-full cursor-pointer border border-[#62b543] bg-[#62b543]/10 px-5 py-1.5 font-bold tracking-wider whitespace-nowrap uppercase hover:bg-[#62b543]/25 sm:w-auto"
                >
                  [ Fechar Visualizador ]
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- ZOOMED IMAGE OVERLAY LIGHTBOX ---------------- */}
        {selectedFile && selectedFile.type === 'image' && isImageZoomed && (
          <div
            onClick={() => setIsImageZoomed(false)}
            className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center bg-black/95 p-4 md:p-8"
          >
            <div className="absolute top-4 right-4 z-10 rounded border border-[#62b543] bg-[#171c16] px-4 py-1.5 text-xs font-bold tracking-wider uppercase select-none">
              [ FECHAR ZOOM ]
            </div>
            <div className="my-auto flex w-full max-w-[95vw] flex-col items-center py-12 md:max-w-[85vw] lg:max-w-[75vw]">
              <img
                src={selectedFile.downloadUrl}
                alt={selectedFile.name}
                className="h-auto w-full border border-[#62b543]/30 bg-black object-contain shadow-[0_0_40px_rgba(98,181,67,0.3)]"
                onClick={(e) => e.stopPropagation()}
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-6 max-w-xl cursor-default rounded border border-[#62b543]/30 bg-[#171c16] px-4 py-2 text-center text-[11px] leading-relaxed"
              >
                {selectedFile.content}
              </div>
            </div>
          </div>
        )}
      </main>
    </CRTEffect>
  )
}
