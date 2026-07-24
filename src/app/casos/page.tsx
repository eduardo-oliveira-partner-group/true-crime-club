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
import type {
  CaseDetail,
  CaseSummary,
  InvestigationFile,
} from '@/src/lib/domain/types'

import styles from './crt-screen.module.css'

// Layout Stages
type ViewStage =
  | 'investigador-root'
  | 'casos-list'
  | 'caso-detail'
  | 'arquivos-list'

export default function CasosPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // Real-time clock state for CRT header
  const [systemTime, setSystemTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      const formatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      setSystemTime(formatted)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Current stage in the investigator area
  const [viewStage, setViewStage] = useState<ViewStage>('investigador-root')

  // Selected state
  const [selectedBox, setSelectedBox] = useState<string | null>(null)
  const [cases, setCases] = useState<CaseSummary[]>([])
  const [selectedCase, setSelectedCase] = useState<CaseDetail | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<
    'arquivos' | 'documentos'
  >('arquivos')
  const [selectedFile, setSelectedFile] = useState<InvestigationFile | null>(
    null,
  )

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

  const [filesByBox, setFilesByBox] = useState<
    Record<string, Record<'arquivos' | 'documentos', InvestigationFile[]>>
  >({})
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [loadingCases, setLoadingCases] = useState(true)

  // Cases and files are loaded only after the API validates the authenticated customer.
  useEffect(() => {
    apiClient.auth
      .me()
      .then((customer) => {
        if (customer) {
          setIsAuthenticated(true)
          apiClient.cases
            .list()
            .then(setCases)
            .catch((e) => console.error('Erro ao carregar casos:', e))
            .finally(() => setLoadingCases(false))
        } else {
          router.replace('/login')
        }
      })
      .catch(() => {
        router.replace('/login')
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

  const handleSelectBox = (boxId: string) => {
    setSelectedBox(boxId)
    if (viewStage === 'arquivos-list') {
      setViewStage('caso-detail')
    }
  }

  const handleSelectCase = async (caseSummary: CaseSummary) => {
    setLoadingFiles(true)
    setSelectedFile(null)
    try {
      const detail = await apiClient.cases.get(caseSummary.identifier)
      const files = await apiClient.cases.listFiles(caseSummary.identifier)
      const mapped: Record<
        string,
        Record<'arquivos' | 'documentos', InvestigationFile[]>
      > = {}
      files.forEach((box) => {
        mapped[box.id] = {
          arquivos: box.arquivos,
          documentos: box.documentos,
        }
      })
      setSelectedCase(detail)
      setFilesByBox(mapped)
      setSelectedBox(detail.boxes[0]?.id ?? null)
      setViewStage('caso-detail')
    } catch (error) {
      console.error('Erro ao carregar o caso:', error)
    } finally {
      setLoadingFiles(false)
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
      <div
        className={`${styles.terminalSurface} flex min-h-screen w-full flex-col items-center justify-center font-handjet`}
      >
        <div className="space-y-3 text-center">
          <div className="mx-auto size-12 animate-pulse rounded-full border border-[#33ff33]" />
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

  const currentFiles = selectedBox
    ? (filesByBox[selectedBox]?.[selectedCategory] ?? [])
    : []
  const boxes = selectedCase?.boxes ?? []

  return (
    <div className={styles.shell}>
      <div className={styles.bezel}>
        <div className={styles.screen}>
          <div className={styles.vhsTracking} />
          <div className={styles.scanlines} />
          <div className={styles.vignette} />
          <div className={styles.glass} />
          <div className={`${styles.content} size-full`}>
            <CRTEffect
              enableScanlines={false}
              scanlineOpacity={0.25}
              enableSweep={true}
              sweepDuration={8}
              sweepThickness={8}
              sweepStyle="classic"
              enableGlow={true}
              glowColor="rgba(51, 255, 51, 0.28)"
              enableEdgeGlow={true}
              edgeGlowColor="rgba(139, 255, 118, 0.18)"
              edgeGlowSize={58}
              enableFlicker={true}
              flickerIntensity={0.035}
              flickerSpeed={3}
              enableNoise={true}
              noiseOpacity={0.1}
              enableCurvature={true}
              curvatureIntensity={0.78}
              enableGlare={true}
              glareIntensity={0.18}
            >
              <main
                className={`${styles.terminalSurface} ${styles.crtScrollbar} flex h-full flex-col overflow-y-auto p-3 font-handjet select-none sm:p-4 md:p-6`}
              >
                <div className="flex min-h-0 flex-1 flex-col justify-start">
                  {/* ── Header ── */}
                  <header className="relative mb-5 flex flex-col gap-4 border border-[#33ff33]/45 bg-[#030703]/40 p-3 md:flex-row md:items-center md:justify-between md:p-4">
                    {/* Corner Markers */}
                    <span
                      className={`${styles.cornerMarker} ${styles.cornerMarkerTL}`}
                    />
                    <span
                      className={`${styles.cornerMarker} ${styles.cornerMarkerTR}`}
                    />
                    <span
                      className={`${styles.cornerMarker} ${styles.cornerMarkerBL}`}
                    />
                    <span
                      className={`${styles.cornerMarker} ${styles.cornerMarkerBR}`}
                    />

                    <div className="flex items-center gap-3 md:gap-4">
                      <img
                        src="/imagens/logo.png"
                        alt="PCSP Logo"
                        className="size-10 shrink-0 object-contain md:size-14"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h1 className="text-[15px]/tight font-bold tracking-wider text-[#33ff33] uppercase sm:text-base md:text-2xl md:leading-none md:tracking-widest">
                          DELEGACIA DE INVESTIGAÇÕES GERAIS - DIG
                        </h1>
                        <div className="mt-0.5 text-[11px] font-semibold tracking-wider text-[#33ff33]/80 uppercase sm:text-xs md:tracking-widest">
                          SISTEMA DE ARQUIVOS E EVIDÊNCIAS &nbsp; v2.6.1
                        </div>
                        <div className="mt-1 font-mono text-[9.5px] tracking-wide text-[#33ff33]/60 uppercase sm:text-[10px] md:text-xs">
                          <span className="block sm:inline">
                            TERMINAL: DIG-ARCH-04 &nbsp;|&nbsp; ACESSO: RESTRITO
                          </span>
                          <span className="hidden sm:inline">
                            {' '}
                            &nbsp;|&nbsp;{' '}
                          </span>
                          <span className="block sm:inline">
                            USUÁRIO: INVESTIGADOR_07
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Online Box */}
                    <div className={styles.onlineStatusBox}>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#33ff33]">
                        <span className="relative flex size-1.5">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#33ff33] opacity-75" />
                          <span className="relative inline-flex size-1.5 rounded-full bg-[#33ff33]" />
                        </span>
                        <span>ONLINE</span>
                      </div>
                      <div className="font-mono text-[10px] text-[#33ff33]/70 md:mt-0.5">
                        {systemTime || '25/05/2026 23:47:19'}
                      </div>
                    </div>
                  </header>

                  {/* ── Back Button (Hidden on detail stages where it's embedded in the sidebar) ── */}
                  {viewStage !== 'caso-detail' &&
                    viewStage !== 'arquivos-list' && (
                      <div className="mb-6">
                        <button
                          onClick={handleGoBack}
                          className="flex cursor-pointer items-center gap-2 border border-dashed border-[#33ff33] px-5 py-1.5 text-xl font-bold tracking-widest uppercase transition-all hover:border-solid hover:bg-[#33ff33] hover:text-[#030703] md:text-2xl"
                        >
                          ← Voltar
                        </button>
                      </div>
                    )}

                  {/* ════════ STAGE 1: INVESTIGADOR ROOT ════════ */}
                  {viewStage === 'investigador-root' && (
                    <div
                      key="stage-root"
                      className={`${styles.stageEnter} flex flex-1 flex-col items-center justify-center py-12`}
                    >
                      <div
                        className={`${styles.terminalWindow} flex w-full max-w-sm flex-col items-center p-6 sm:p-12`}
                      >
                        <span
                          className={`${styles.cornerMarker} ${styles.cornerMarkerTL}`}
                        />
                        <span
                          className={`${styles.cornerMarker} ${styles.cornerMarkerTR}`}
                        />
                        <span
                          className={`${styles.cornerMarker} ${styles.cornerMarkerBL}`}
                        />
                        <span
                          className={`${styles.cornerMarker} ${styles.cornerMarkerBR}`}
                        />

                        <button
                          onClick={() => setViewStage('casos-list')}
                          className="group flex cursor-pointer flex-col items-center justify-center focus:outline-none"
                        >
                          <div className={`${styles.iconBrackets} mb-2`}>
                            <img
                              src="/imagens/icons/Casos.png"
                              alt="Casos"
                              className="size-20 object-contain transition-transform group-hover:scale-105"
                            />
                          </div>
                          <span className="mt-3 text-2xl font-bold tracking-widest uppercase group-hover:underline">
                            Casos
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ════════ STAGE 2: CASOS LIST ════════ */}
                  {viewStage === 'casos-list' && (
                    <div
                      key="stage-list"
                      className={`${styles.stageEnter} flex flex-1 flex-col items-center justify-center py-8`}
                    >
                      <div
                        className={`${styles.terminalWindow} flex w-full max-w-5xl flex-col items-center p-6 sm:p-10`}
                      >
                        <span
                          className={`${styles.cornerMarker} ${styles.cornerMarkerTL}`}
                        />
                        <span
                          className={`${styles.cornerMarker} ${styles.cornerMarkerTR}`}
                        />
                        <span
                          className={`${styles.cornerMarker} ${styles.cornerMarkerBL}`}
                        />
                        <span
                          className={`${styles.cornerMarker} ${styles.cornerMarkerBR}`}
                        />

                        {loadingCases ? (
                          <p className="text-center text-sm text-[#33ff33]/70 uppercase">
                            CARREGANDO CASOS AUTORIZADOS...
                          </p>
                        ) : cases.length === 0 ? (
                          <p className="text-center text-sm text-[#33ff33]/70 uppercase">
                            NENHUM CASO DISPONÍVEL PARA ESTE USUÁRIO.
                          </p>
                        ) : (
                          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                            {cases.map((caseSummary) => (
                              <button
                                key={caseSummary.id}
                                onClick={() =>
                                  void handleSelectCase(caseSummary)
                                }
                                className="group flex min-w-0 cursor-pointer flex-col items-center justify-center focus:outline-none"
                              >
                                <div className={`${styles.iconBrackets} mb-2`}>
                                  <img
                                    src="/imagens/icons/Casos.png"
                                    alt="Caso"
                                    className="size-16 object-contain transition-transform group-hover:scale-105"
                                  />
                                </div>
                                <span className="mt-2 text-center text-base font-bold tracking-widest uppercase group-hover:underline sm:text-lg">
                                  {caseSummary.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ════════ STAGE 3: CASO DETAIL ════════ */}
                  {viewStage === 'caso-detail' && (
                    <div
                      key="stage-detail"
                      className={`${styles.stageEnter} flex min-h-0 flex-1 flex-col`}
                    >
                      {/* Main Layout: Boxes + Folders */}
                      <div className="flex min-h-0 flex-1 flex-col gap-5 md:flex-row md:gap-6">
                        {/* Left Panel: Sidebar */}
                        <div
                          className={`${styles.terminalWindow} flex shrink-0 flex-col md:w-[260px]`}
                        >
                          {/* Corner Markers */}
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerTL}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerTR}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerBL}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerBR}`}
                          />

                          {/* Back button inside sidebar */}
                          <button
                            onClick={handleGoBack}
                            className="mb-4 flex cursor-pointer items-center justify-center gap-2 border border-[#33ff33]/60 px-4 py-1.5 text-lg font-bold tracking-widest uppercase transition-all hover:bg-[#33ff33]/10"
                          >
                            ← Voltar
                          </button>

                          {/* Case Title */}
                          <div className="text-md mb-2 flex items-center gap-2 px-1 font-bold tracking-wider text-[#33ff33] uppercase">
                            <span>📁 {selectedCase?.title ?? 'CASO'}</span>
                          </div>

                          {/* Dashed Separator */}
                          <div className="my-2 border-t border-dashed border-[#33ff33]/30" />

                          {/* Boxes list */}
                          <div
                            data-lenis-prevent
                            className={`${styles.boxStrip} ${styles.crtScrollbar} mt-2`}
                          >
                            {boxes.map((box) => {
                              const isSelected = selectedBox === box.id
                              return (
                                <button
                                  key={box.id}
                                  onClick={() => handleSelectBox(box.id)}
                                  className={`flex shrink-0 cursor-pointer items-center gap-2 px-3 py-2 font-handjet text-lg font-bold tracking-wider uppercase transition-all ${
                                    isSelected
                                      ? styles.activeBoxBtn
                                      : 'border border-transparent text-[#33ff33]/85 hover:bg-[#33ff33]/10'
                                  }`}
                                >
                                  {isSelected ? (
                                    <span className="mr-0.5 text-xs text-[#030703]">
                                      ▶
                                    </span>
                                  ) : null}
                                  <img
                                    src="/imagens/icons/Caixa.png"
                                    alt=""
                                    className={`size-4.5 object-contain ${isSelected ? '' : 'brightness-100'}`}
                                  />
                                  <span className="whitespace-nowrap">
                                    {box.name || `Box ${box.number}`}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Right Panel: Folders selection */}
                        <div
                          className={`${styles.terminalWindow} flex min-h-[300px] flex-1 flex-col justify-start p-4 sm:p-6`}
                        >
                          {/* Corner Markers */}
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerTL}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerTR}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerBL}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerBR}`}
                          />

                          {/* Directory Path Indicator */}
                          <div className="mb-8 flex flex-col gap-1 border-b border-[#33ff33]/25 pb-2 font-mono text-xs tracking-wider text-[#33ff33]/70 select-none sm:flex-row sm:justify-between">
                            <span>
                              SISTEMA:{' '}
                              {selectedCase?.identifier?.toUpperCase() ??
                                'CASO'}{' '}
                              /{' '}
                              {boxes
                                .find((box) => box.id === selectedBox)
                                ?.name.toUpperCase() ?? 'BOX'}
                            </span>
                            <span className="opacity-60 sm:text-right">
                              [SELECIONE UMA PASTA]
                            </span>
                          </div>

                          <div className="relative flex flex-1 items-center justify-center">
                            {/* Background decoration */}
                            <div
                              className={`${styles.crosshairDeco}`}
                              style={{ top: '10px', left: '10px' }}
                            >
                              +
                            </div>
                            <div
                              className={`${styles.crosshairDeco}`}
                              style={{ top: '10px', right: '10px' }}
                            >
                              +
                            </div>
                            <div
                              className={`${styles.crosshairDeco}`}
                              style={{ bottom: '10px', left: '10px' }}
                            >
                              +
                            </div>
                            <div
                              className={`${styles.crosshairDeco}`}
                              style={{ bottom: '10px', right: '10px' }}
                            >
                              +
                            </div>
                            <div
                              className={`${styles.crosshairDeco}`}
                              style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              +
                            </div>

                            <div className="grid w-full max-w-lg grid-cols-2 gap-4 px-2 sm:gap-8 sm:px-6">
                              {/* Category: Arquivos do caso */}
                              <button
                                onClick={() => {
                                  setSelectedCategory('arquivos')
                                  setViewStage('arquivos-list')
                                }}
                                className="group flex cursor-pointer flex-col items-center justify-center text-[#33ff33] focus:outline-none"
                              >
                                <div className={styles.iconBrackets}>
                                  <img
                                    src="/imagens/icons/Arquivos_dos_casos.png"
                                    alt="Arquivos do caso"
                                    className="size-16 object-contain transition-transform group-hover:scale-110"
                                  />
                                </div>
                                <span className="mt-1 font-mono text-xs text-[#33ff33]/60">
                                  01
                                </span>
                                <span className="mt-1 text-center font-handjet text-lg font-bold tracking-widest uppercase group-hover:underline">
                                  Arquivos do Caso
                                </span>
                              </button>

                              {/* Category: Documentos */}
                              <button
                                onClick={() => {
                                  setSelectedCategory('documentos')
                                  setViewStage('arquivos-list')
                                }}
                                className="group flex cursor-pointer flex-col items-center justify-center text-[#33ff33] focus:outline-none"
                              >
                                <div className={styles.iconBrackets}>
                                  <img
                                    src="/imagens/icons/Documentos.png"
                                    alt="Documentos"
                                    className="size-16 object-contain transition-transform group-hover:scale-110"
                                  />
                                </div>
                                <span className="mt-1 font-mono text-xs text-[#33ff33]/60">
                                  02
                                </span>
                                <span className="mt-1 text-center font-handjet text-lg font-bold tracking-widest uppercase group-hover:underline">
                                  Documentos
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ════════ STAGE 4: ARQUIVOS LIST ════════ */}
                  {viewStage === 'arquivos-list' && (
                    <div
                      key="stage-files"
                      className={`${styles.stageEnter} flex min-h-0 flex-1 flex-col`}
                    >
                      <div className="flex min-h-0 flex-1 flex-col gap-5 md:flex-row md:gap-6">
                        {/* Left Panel: Sidebar */}
                        <div
                          className={`${styles.terminalWindow} flex shrink-0 flex-col md:w-[260px]`}
                        >
                          {/* Corner Markers */}
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerTL}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerTR}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerBL}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerBR}`}
                          />

                          {/* Back button */}
                          <button
                            onClick={handleGoBack}
                            className="mb-4 flex cursor-pointer items-center justify-center gap-2 border border-[#33ff33]/60 px-4 py-1.5 text-lg font-bold tracking-widest uppercase transition-all hover:bg-[#33ff33]/10"
                          >
                            ← Voltar
                          </button>

                          {/* Case Title */}
                          <div className="text-md mb-2 flex items-center gap-2 px-1 font-bold tracking-wider text-[#33ff33] uppercase">
                            <span>📁 {selectedCase?.title ?? 'CASO'}</span>
                          </div>

                          {/* Dashed Separator */}
                          <div className="my-2 border-t border-dashed border-[#33ff33]/30" />

                          {/* Boxes list */}
                          <div
                            data-lenis-prevent
                            className={`${styles.boxStrip} ${styles.crtScrollbar} mt-2`}
                          >
                            {boxes.map((box) => {
                              const isSelected = selectedBox === box.id
                              return (
                                <button
                                  key={box.id}
                                  onClick={() => handleSelectBox(box.id)}
                                  className={`flex shrink-0 cursor-pointer items-center gap-2 px-3 py-2 font-handjet text-lg font-bold tracking-wider uppercase transition-all ${
                                    isSelected
                                      ? styles.activeBoxBtn
                                      : 'border border-transparent text-[#33ff33]/85 hover:bg-[#33ff33]/10'
                                  }`}
                                >
                                  {isSelected ? (
                                    <span className="mr-0.5 text-xs text-[#030703]">
                                      ▶
                                    </span>
                                  ) : null}
                                  <img
                                    src="/imagens/icons/Caixa.png"
                                    alt=""
                                    className={`size-4.5 object-contain ${isSelected ? '' : 'brightness-100'}`}
                                  />
                                  <span className="whitespace-nowrap">
                                    {box.name || `Box ${box.number}`}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Right Panel: Files List */}
                        <div
                          className={`${styles.terminalWindow} flex min-h-[300px] flex-1 flex-col p-4 sm:p-6`}
                        >
                          {/* Corner Markers */}
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerTL}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerTR}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerBL}`}
                          />
                          <span
                            className={`${styles.cornerMarker} ${styles.cornerMarkerBR}`}
                          />

                          {/* Directory Path Indicator */}
                          <div className="mb-4 flex flex-col gap-1 border-b border-[#33ff33]/25 pb-2 font-mono text-xs tracking-wider text-[#33ff33]/70 select-none sm:flex-row sm:justify-between">
                            <span>
                              SISTEMA:{' '}
                              {selectedCase?.identifier?.toUpperCase() ??
                                'CASO'}{' '}
                              /{' '}
                              {boxes
                                .find((box) => box.id === selectedBox)
                                ?.name.toUpperCase() ?? 'BOX'}{' '}
                              / {selectedCategory.toUpperCase()}
                            </span>
                            <span className="opacity-60 sm:text-right">
                              [LISTANDO ARQUIVOS]
                            </span>
                          </div>

                          {/* Title Bar */}
                          <div className="mb-4 flex items-center gap-3 border-b border-[#33ff33]/30 pb-2">
                            <img
                              src={
                                selectedCategory === 'arquivos'
                                  ? '/imagens/icons/Arquivos_dos_casos.png'
                                  : '/imagens/icons/Documentos.png'
                              }
                              alt="Category icon"
                              className="size-7 object-contain"
                            />
                            <span className="text-xl font-bold tracking-widest uppercase">
                              {selectedCategory === 'arquivos'
                                ? 'Arquivos do Caso'
                                : 'Documentos'}
                            </span>
                          </div>

                          {/* Files List */}
                          {loadingFiles ? (
                            <div className="flex min-h-[200px] flex-1 animate-pulse items-center justify-center text-sm text-[#33ff33]/70 uppercase">
                              CONECTANDO AO ARQUIVO...
                            </div>
                          ) : currentFiles.length === 0 ? (
                            <div className="flex min-h-[200px] flex-1 items-center justify-center text-sm text-[#33ff33]/50 italic">
                              Pasta vazia ou contêiner bloqueado.
                            </div>
                          ) : (
                            <div
                              className={`min-h-0 flex-1 divide-y divide-[#33ff33]/15 overflow-y-auto pr-2 ${styles.crtScrollbar}`}
                            >
                              {currentFiles.map((file) => (
                                <div
                                  key={file.id}
                                  onClick={() => setSelectedFile(file)}
                                  className="flex cursor-pointer items-center gap-3 px-2 py-3 transition-colors hover:bg-[#33ff33]/10"
                                >
                                  <span className="shrink-0">
                                    {file.type === 'audio' && (
                                      <IconMusic className="size-5 text-[#33ff33] md:size-6" />
                                    )}
                                    {file.type === 'image' && (
                                      <IconPhoto className="size-5 text-[#33ff33] md:size-6" />
                                    )}
                                    {file.type === 'text' && (
                                      <IconFileText className="size-5 text-[#33ff33] md:size-6" />
                                    )}
                                    {file.type === 'sheet' && (
                                      <IconFileSpreadsheet className="size-5 text-[#33ff33] md:size-6" />
                                    )}
                                  </span>
                                  <span className="text-lg hover:underline md:text-xl">
                                    {file.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Footer ── */}
                <footer className="relative mt-6 flex items-center justify-between border-t border-[#33ff33]/25 pt-4 font-mono text-[10px] tracking-wider text-[#33ff33]/50 uppercase select-none">
                  {/* Left Panel */}
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#33ff33] opacity-50" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-[#33ff33]" />
                      </span>
                      SYS_OK
                    </span>
                    <span
                      className={`${styles.progressMeterLeft} hidden font-sans tracking-[1px] text-[#33ff33] md:inline-block`}
                    >
                      ███████
                    </span>
                    <span className="hidden items-center gap-1.5 md:ml-4 md:inline-flex">
                      SIGNAL: 98%
                      <span className="ml-1 inline-flex h-[10px] items-end gap-[2px]">
                        <span
                          className={`${styles.signalBar} ${styles.signalBar1}`}
                        />
                        <span
                          className={`${styles.signalBar} ${styles.signalBar2}`}
                        />
                        <span
                          className={`${styles.signalBar} ${styles.signalBar3}`}
                        />
                        <span
                          className={`${styles.signalBar} ${styles.signalBar4}`}
                        />
                        <span
                          className={`${styles.signalBar} ${styles.signalBar5}`}
                        />
                      </span>
                    </span>
                  </div>

                  {/* Centered Copyright Text */}
                  <div
                    className={`${styles.footerCopyright} font-handjet text-xs font-bold tracking-widest text-[#33ff33]/60`}
                  >
                    --- © 2026, TRUE CRIME CLUB ---
                  </div>

                  {/* Right Panel */}
                  <div className="flex items-center gap-2">
                    <span className="hidden md:inline">ARCHIVE MODE</span>
                    <span
                      className={`${styles.progressMeterRight} hidden font-sans tracking-[1px] text-[#33ff33] md:inline-block`}
                    >
                      ████░
                    </span>
                    {/* Mobile-only Signal status */}
                    <span className="flex items-center md:hidden">
                      <span className="inline-flex h-[10px] items-end gap-[2px]">
                        <span
                          className={`${styles.signalBar} ${styles.signalBar1}`}
                        />
                        <span
                          className={`${styles.signalBar} ${styles.signalBar2}`}
                        />
                        <span
                          className={`${styles.signalBar} ${styles.signalBar3}`}
                        />
                        <span
                          className={`${styles.signalBar} ${styles.signalBar4}`}
                        />
                        <span
                          className={`${styles.signalBar} ${styles.signalBar5}`}
                        />
                      </span>
                    </span>
                  </div>
                </footer>

                {/* ════════ FILE VIEWER MODAL ════════ */}
                {selectedFile && (
                  <div
                    onClick={() => {
                      setSelectedFile(null)
                      setIsImageZoomed(false)
                    }}
                    className={`${styles.crtModalBackdrop} fixed inset-0 z-50 flex cursor-pointer items-center justify-center p-3 md:p-4`}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`${styles.crtModalPanel} relative flex max-h-[92vh] w-full max-w-3xl cursor-default flex-col p-1 font-handjet`}
                    >
                      {/* Corner Markers */}
                      <span
                        className={`${styles.cornerMarker} ${styles.cornerMarkerTL}`}
                      />
                      <span
                        className={`${styles.cornerMarker} ${styles.cornerMarkerTR}`}
                      />
                      <span
                        className={`${styles.cornerMarker} ${styles.cornerMarkerBL}`}
                      />
                      <span
                        className={`${styles.cornerMarker} ${styles.cornerMarkerBR}`}
                      />
                      {/* Header bar */}
                      <div className="flex shrink-0 items-center justify-between border-b border-[#33ff33]/30 p-3 text-base font-bold tracking-wider">
                        <span className="truncate pr-2">
                          {selectedFile.name}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedFile(null)
                            setIsImageZoomed(false)
                          }}
                          className="flex size-6 cursor-pointer items-center justify-center border border-[#33ff33]/40 text-center leading-5 transition-colors hover:border-[#33ff33] hover:bg-[#33ff33]/10"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Meta Data */}
                      <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1.5 border-b border-[#33ff33]/15 px-3 py-2 text-[10px] text-[#33ff33]/70">
                        <span>
                          <b>TIPO:</b> {selectedFile.type.toUpperCase()}
                        </span>
                        <span>
                          <b>TAMANHO:</b> {selectedFile.size}
                        </span>
                        <span>
                          <b>MODIFICADO:</b> {selectedFile.modified}
                        </span>
                        {selectedFile.storageKey && (
                          <span className="w-full break-all">
                            <b>STORAGE KEY:</b> {selectedFile.storageKey}
                          </span>
                        )}
                      </div>

                      {/* Modal Body */}
                      <div
                        data-lenis-prevent
                        className={`flex-1 overflow-y-auto bg-black/20 p-4 md:p-5 ${styles.crtScrollbar}`}
                      >
                        {/* TEXT VIEW */}
                        {selectedFile.type === 'text' && (
                          <div
                            className={`${styles.crtMediaFrame} rounded border border-[#33ff33]/20 p-4 text-base/relaxed whitespace-pre-wrap text-[#33ff33]/90 select-text`}
                          >
                            {selectedFile.content}
                          </div>
                        )}

                        {/* SHEET (SPREADSHEET) VIEW */}
                        {selectedFile.type === 'sheet' && (
                          <div
                            data-lenis-prevent
                            className={`${styles.crtMediaFrame} overflow-x-auto rounded border border-[#33ff33]/30`}
                          >
                            <table className="w-full border-collapse text-left text-base text-[#33ff33]/90">
                              <thead>
                                <tr className="border-b border-[#33ff33]/30 bg-[#33ff33]/10">
                                  {selectedFile.columns?.map((col, idx) => (
                                    <th
                                      key={idx}
                                      className="border-r border-[#33ff33]/20 p-2 text-xs font-bold tracking-wider uppercase"
                                    >
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#33ff33]/20">
                                {selectedFile.rows?.map((row, rIdx) => (
                                  <tr
                                    key={rIdx}
                                    className="hover:bg-[#33ff33]/5"
                                  >
                                    {row.map((cell, cIdx) => (
                                      <td
                                        key={cIdx}
                                        className="border-r border-[#33ff33]/10 p-2 text-sm"
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
                          <div className="space-y-3">
                            <div
                              className={`${styles.crtMediaFrame} relative rounded border border-[#33ff33]/30 p-3 text-center`}
                            >
                              <img
                                src={selectedFile.downloadUrl}
                                alt={selectedFile.name}
                                onClick={() => setIsImageZoomed(true)}
                                className="mx-auto max-h-[40vh] max-w-full cursor-zoom-in border border-[#33ff33]/20 object-contain transition-all hover:border-[#33ff33] sm:max-h-[380px]"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  const fallbackDiv = e.currentTarget
                                    .nextElementSibling as HTMLDivElement
                                  if (fallbackDiv)
                                    fallbackDiv.style.display = 'block'
                                }}
                              />
                              <div className="hidden space-y-4 py-8">
                                <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-dashed border-[#33ff33] text-lg font-bold">
                                  IMG
                                </div>
                                <div className="mx-auto max-w-md text-xs/relaxed text-[#33ff33]/80">
                                  (fonte de imagem indisponível —{' '}
                                  {selectedFile.downloadUrl})
                                </div>
                              </div>
                              <div className="mt-2 text-[10px] text-[#33ff33]/40">
                                [ CLIQUE NA IMAGEM PARA AMPLIAR ]
                              </div>
                            </div>
                            {selectedFile.content && (
                              <p className="px-1 text-[11px] text-[#33ff33]/60 italic">
                                {selectedFile.content}
                              </p>
                            )}
                          </div>
                        )}

                        {/* AUDIO VIEW WITH CORRUPTION RECOVERY */}
                        {selectedFile.type === 'audio' && (
                          <div className="space-y-4">
                            {selectedFile.corrupted &&
                            !recoveredAudios[selectedFile.id] ? (
                              /* CORRUPTED STATE */
                              <div className="space-y-4 rounded border border-red-500/40 bg-red-950/20 p-5 text-center">
                                <div className="flex justify-center text-red-500">
                                  <IconAlertTriangle className="size-10 animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-red-500 uppercase">
                                    ARQUIVO CORROMPIDO
                                  </h4>
                                  <p className="mx-auto max-w-md text-[11px] leading-relaxed text-red-300">
                                    O arquivo{' '}
                                    <span className="font-bold">
                                      {selectedFile.name}
                                    </span>{' '}
                                    apresenta perda de pacotes e sincronização
                                    de cabeçalhos binários.
                                  </p>
                                </div>

                                {isRecoveringAudio[selectedFile.id] ? (
                                  /* RECOVERY IN PROGRESS */
                                  <div className="mx-auto max-w-sm space-y-3 pt-2 text-left">
                                    <div className="flex justify-between text-[11px] font-bold text-[#33ff33]">
                                      <span>
                                        RECONSTRUINDO PACOTES DE ONDA:
                                      </span>
                                      <span>
                                        {audioRecoveryProgress[selectedFile.id]}
                                        %
                                      </span>
                                    </div>
                                    <div className="h-2.5 overflow-hidden rounded-full border border-[#33ff33]/30 bg-black p-0.5">
                                      <div
                                        className="h-full rounded-full bg-[#33ff33] transition-all duration-100 ease-out"
                                        style={{
                                          width: `${audioRecoveryProgress[selectedFile.id]}%`,
                                        }}
                                      />
                                    </div>
                                    <div
                                      data-lenis-prevent
                                      className={`max-h-14 space-y-0.5 overflow-y-auto rounded bg-black/40 p-2 text-[9px] text-[#33ff33]/70 ${styles.crtScrollbar}`}
                                    >
                                      {(
                                        audioRecoveryLogs[selectedFile.id] || []
                                      ).map((log, idx) => (
                                        <div key={idx}>{log}</div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  /* RECOVER TRIGGER BUTTON */
                                  <button
                                    onClick={() =>
                                      handleRecoverAudio(selectedFile.id)
                                    }
                                    className="cursor-pointer rounded border border-[#33ff33] bg-[#33ff33]/10 px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all hover:bg-[#33ff33]/20"
                                  >
                                    [ RECONSTRUIR ARQUIVO ]
                                  </button>
                                )}
                              </div>
                            ) : (
                              /* RECOVERED / REGULAR AUDIO VIEW */
                              <div className="space-y-4">
                                {selectedFile.corrupted && (
                                  <div className="flex items-center gap-2 rounded border border-[#33ff33]/30 bg-[#33ff33]/10 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase">
                                    <IconCheck className="size-4 shrink-0 text-[#33ff33]" />
                                    <span>
                                      Arquivo recuperado via alinhamento forense
                                      digital de canais
                                    </span>
                                  </div>
                                )}

                                <audio
                                  ref={(el) => {
                                    audioRefs.current[selectedFile.id] = el
                                    if (el) {
                                      el.onplay = () => setIsPlayingAudio(true)
                                      el.onpause = () =>
                                        setIsPlayingAudio(false)
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

                                <div
                                  className={`${styles.crtMediaFrame} flex flex-col items-center justify-between gap-5 rounded border border-[#33ff33]/30 p-4 md:flex-row`}
                                >
                                  {/* Play/Pause Button */}
                                  <div className="flex shrink-0 items-center gap-3">
                                    <button
                                      onClick={() =>
                                        handleTogglePlay(selectedFile.id)
                                      }
                                      className="flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-[#33ff33] bg-[#33ff33]/10 text-[#33ff33] transition-all hover:bg-[#33ff33]/20 focus:outline-none"
                                      aria-label={
                                        isPlayingAudio ? 'Pausar' : 'Tocar'
                                      }
                                    >
                                      {isPlayingAudio ? (
                                        <IconPlayerPause className="size-6 fill-[#33ff33] text-[#33ff33]" />
                                      ) : (
                                        <IconPlayerPlay className="size-6 fill-[#33ff33] pl-0.5 text-[#33ff33]" />
                                      )}
                                    </button>

                                    <div className="flex flex-col text-xs">
                                      <span className="text-sm font-bold tracking-wider">
                                        {isPlayingAudio
                                          ? 'REPRODUZINDO'
                                          : 'PAUSADO'}
                                      </span>
                                      <span className="mt-0.5 opacity-60">
                                        {formatTime(audioCurrentTime)} /{' '}
                                        {formatTime(audioDuration || 6)}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Waveform Visualizer */}
                                  <div
                                    className={`${styles.crtMediaFrame} flex h-12 w-full flex-1 items-center justify-center gap-1 rounded border border-[#33ff33]/10 px-3`}
                                  >
                                    {[
                                      35, 60, 45, 90, 75, 40, 20, 80, 50, 95,
                                      35, 70, 85, 45, 60, 25, 55, 90, 40, 75,
                                      20, 80, 65, 30,
                                    ].map((h, idx) => {
                                      const heightFactor = isPlayingAudio
                                        ? Math.sin(
                                            audioCurrentTime * 10 + idx,
                                          ) *
                                            15 +
                                          h
                                        : h
                                      const heightPct = Math.min(
                                        100,
                                        Math.max(10, heightFactor),
                                      )

                                      return (
                                        <div
                                          key={idx}
                                          className="w-0.5 rounded-full bg-[#33ff33] transition-all duration-150"
                                          style={{
                                            height: `${heightPct}%`,
                                          }}
                                        />
                                      )
                                    })}
                                  </div>
                                </div>

                                {/* Audio Transcript Box */}
                                <div
                                  className={`${styles.crtMediaFrame} space-y-2 rounded border border-[#33ff33]/20 p-3`}
                                >
                                  <span className="block border-b border-[#33ff33]/10 pb-1 text-[10px] font-bold tracking-widest opacity-50">
                                    {'// transcrição automática (parcial):'}
                                  </span>
                                  <p className="text-xs/relaxed italic select-text">
                                    <span>
                                      &ldquo;{selectedFile.fragment}&rdquo;
                                    </span>{' '}
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
                      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#33ff33]/30 p-3 text-xs">
                        {selectedFile.downloadUrl ? (
                          <a
                            href={selectedFile.downloadUrl}
                            download
                            className="flex cursor-pointer items-center gap-2 border border-[#33ff33]/40 px-3 py-1 font-handjet tracking-wider whitespace-nowrap uppercase hover:border-[#33ff33] hover:bg-[#33ff33]/10"
                          >
                            <IconDownload className="size-3.5" /> Baixar
                          </a>
                        ) : (
                          <span className="text-[10px] text-[#33ff33]/50 uppercase">
                            Download indisponível até a integração de URL
                            assinada.
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setSelectedFile(null)
                            setIsImageZoomed(false)
                          }}
                          className="cursor-pointer border border-[#33ff33] bg-[#33ff33]/10 px-4 py-1 font-bold tracking-wider whitespace-nowrap uppercase hover:bg-[#33ff33]/25"
                        >
                          Fechar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ════════ ZOOMED IMAGE LIGHTBOX ════════ */}
                {selectedFile &&
                  selectedFile.type === 'image' &&
                  isImageZoomed && (
                    <div
                      onClick={() => setIsImageZoomed(false)}
                      className={`${styles.crtModalBackdrop} fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center p-4 md:p-8`}
                    >
                      <div className="absolute top-4 right-4 z-10 rounded border border-[#33ff33] bg-[#030703] px-3 py-1 text-xs font-bold tracking-wider uppercase select-none">
                        ESC
                      </div>
                      <div className="my-auto flex w-full max-w-[95vw] flex-col items-center py-8 md:max-w-[85vw] lg:max-w-[75vw]">
                        <img
                          src={selectedFile.downloadUrl}
                          alt={selectedFile.name}
                          className="max-h-[75vh] w-auto max-w-full border border-[#33ff33]/30 bg-black object-contain shadow-[0_0_40px_rgba(51,255,51,0.2)]"
                          onClick={(e) => e.stopPropagation()}
                        />
                        {selectedFile.content && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 max-w-xl cursor-default rounded border border-[#33ff33]/30 bg-[#030703] px-4 py-2 text-center text-[11px] leading-relaxed"
                          >
                            {selectedFile.content}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </main>
            </CRTEffect>
          </div>
        </div>
      </div>
    </div>
  )
}
