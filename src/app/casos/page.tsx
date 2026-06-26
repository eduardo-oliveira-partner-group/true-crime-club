'use client'

import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCheck,
  IconDatabase,
  IconDownload,
  IconFileSpreadsheet,
  IconFileText,
  IconFolder,
  IconFolderOpen,
  IconLayoutDashboard,
  IconLock,
  IconLockOpen,
  IconLogout,
  IconMusic,
  IconPause,
  IconPlay,
  IconTerminal,
  IconVideo,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import {
  CaseFile,
  pendriveTree,
  unlockKey,
  volumeInfo,
} from '@/src/lib/domain/cases-mock-data'

type ScreenStage = 'welcome' | 'cipher_gate' | 'system_loading' | 'explorer'

import styles from './crt-screen.module.css'

export function CrtScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.screen}>
        <div className={styles.content}>{children}</div>

        <div className={styles.scanlines} />
        <div className={styles.vignette} />
        <div className={styles.glass} />
      </div>
    </div>
  )
}

export default function CasosPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [stage, setStage] = useState<ScreenStage>('welcome')

  // Real-time retro clock
  const [timeStr, setTimeStr] = useState('--:--:--')

  // Caesar Cipher mini-game states
  const CIPHER_SECRET = 'INQUERITO'
  const CIPHER_TEXT = 'PUXBLYPAV' // 'INQUERITO' shifted by 7
  const [cipherShift, setCipherShift] = useState(13)
  const [isCipherSolved, setIsCipherSolved] = useState(false)
  const [cipherLogs, setCipherLogs] = useState<string[]>([])
  const [isValidatingCipher, setIsValidatingCipher] = useState(false)

  // System loading states
  const [loadingLogs, setLoadingLogs] = useState<string[]>([])
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Explorer states
  // currentPath: [] = Root, [folderId, subfolderId...]
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<CaseFile | null>(null)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [unlockedZips, setUnlockedZips] = useState<Record<string, boolean>>({})

  // Locked ZIP password/decryption states
  const [lockedZipPassword, setLockedZipPassword] = useState('')
  const [lockedZipError, setLockedZipError] = useState('')
  const [lockedZipDecrypting, setLockedZipDecrypting] = useState(false)
  const [lockedZipDecryptLogs, setLockedZipDecryptLogs] = useState<string[]>([])
  const [lockedFileToUnlock, setLockedFileToUnlock] = useState<CaseFile | null>(
    null,
  )

  // Audio recovery states
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

  // Sound ref for audio playback simulation
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({})
  const logsContainerRef = useRef<HTMLDivElement | null>(null)

  // Scroll loader console logs to bottom automatically
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight
    }
  }, [loadingLogs])

  // 1. Auth check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
    setLoadingAuth(false)
  }, [router])

  // 2. Retro Clock updates
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      setTimeStr(
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
      )
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])

  // 3. Caesar cipher shift logic
  const getDecryptedText = (text: string, shift: number) => {
    // Decrypting means shifting backwards by 'shift'
    return text.replace(/[A-Z]/g, (char) =>
      String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65),
    )
  }

  const currentDecryptedText = getDecryptedText(CIPHER_TEXT, cipherShift)

  useEffect(() => {
    if (currentDecryptedText === CIPHER_SECRET) {
      setIsCipherSolved(true)
    } else {
      setIsCipherSolved(false)
    }
  }, [currentDecryptedText])

  const handleValidateCipher = () => {
    if (!isCipherSolved || isValidatingCipher) return
    setIsValidatingCipher(true)
    setCipherLogs([])

    const steps = [
      '[OK ] credencial validada',
      '[SYS] abrindo sessão segura...',
      '[OK ] acesso concedido — Inquérito 59/2026',
    ]

    let i = 0
    const interval = setInterval(() => {
      const logLine = steps[i]
      if (logLine) {
        setCipherLogs((prev) => [...prev, logLine])
      }
      i++
      if (i >= steps.length) {
        clearInterval(interval)
        setTimeout(() => {
          setStage('system_loading')
          triggerSystemLoading()
        }, 800)
      }
    }, 400)
  }

  // 4. Multi-step loading simulation
  const triggerSystemLoading = () => {
    setLoadingProgress(0)
    setLoadingLogs([])

    const logs = [
      {
        progress: 10,
        text: '[SYS] Montando volume forense (CÓPIA FORENSE)...',
      },
      {
        progress: 30,
        text: '[SYS] Calculando checksum SHA-256 do contêiner...',
      },
      {
        progress: 50,
        text: '[SYS] Carregando índices das Caixas de Evidência...',
      },
      {
        progress: 75,
        text: '[SYS] Verificando integridade das mídias anexadas...',
      },
      {
        progress: 95,
        text: '[OK ] Dispositivo montado no barramento principal.',
      },
      {
        progress: 100,
        text: '[OK ] Sistema pronto para investigação forense.',
      },
    ]

    let currentVal = 0
    const interval = setInterval(() => {
      currentVal += Math.floor(Math.random() * 8) + 4
      if (currentVal >= 100) {
        currentVal = 100
        clearInterval(interval)
      }
      setLoadingProgress(currentVal)

      // Add all logs whose progress landmark has been reached
      logs.forEach((logItem) => {
        if (currentVal >= logItem.progress) {
          const logText = logItem.text
          setLoadingLogs((prev) => {
            if (!prev.includes(logText)) {
              return [...prev, logText]
            }
            return prev
          })
        }
      })
    }, 120)
  }

  // 5. Zip decryption simulation
  const handleDecryptZip = () => {
    if (lockedZipPassword !== unlockKey) {
      setLockedZipError('[ERR] credencial incorreta — acesso negado.')
      return
    }

    setLockedZipError('')
    setLockedZipDecrypting(true)
    setLockedZipDecryptLogs([])

    const steps = [
      '[OK ] credencial aceita',
      '[SYS] descriptografando protocolo independente...',
      '[OK ] integridade do contêiner verificada',
      `[OK ] ${lockedFileToUnlock?.children?.length || 0} arquivo(s) recuperado(s)`,
    ]

    let i = 0
    const interval = setInterval(() => {
      const logLine = steps[i]
      if (logLine) {
        setLockedZipDecryptLogs((prev) => [...prev, logLine])
      }
      i++
      if (i >= steps.length) {
        clearInterval(interval)
        setTimeout(() => {
          if (lockedFileToUnlock) {
            setUnlockedZips((prev) => ({
              ...prev,
              [lockedFileToUnlock.id]: true,
            }))
            setCurrentPath([lockedFileToUnlock.id])
          }
          setLockedZipDecrypting(false)
          setLockedFileToUnlock(null)
          setLockedZipPassword('')
          setLockedZipDecryptLogs([])
        }, 750)
      }
    }, 450)
  }

  // 6. Audio corruption recovery simulation
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

  // 7. Navigation handlers
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  }

  const navigateTo = (path: string[]) => {
    setCurrentPath(path)
  }

  const goBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  // Helper: Find node in tree
  const getNodeByPath = (path: string[], tree: CaseFile[]): CaseFile | null => {
    let currentNode: CaseFile | null = null
    let currentChildren = tree

    for (const segment of path) {
      const found = currentChildren.find((node) => node.id === segment)
      if (!found) return null
      currentNode = found
      currentChildren = found.children || []
    }

    return currentNode
  }

  const activeNode = getNodeByPath(currentPath, pendriveTree)
  const currentFiles = activeNode ? activeNode.children || [] : pendriveTree

  const iconFor = (file: CaseFile) => {
    if (file.type === 'folder') return '📁'
    if (file.type === 'locked') {
      return unlockedZips[file.id] ? '📂' : '🔒'
    }
    if (file.type === 'image') return '🖼'
    if (file.type === 'audio') {
      const isCorrupted = file.corrupted && !recoveredAudios[file.id]
      return isCorrupted ? '⚠' : '🎧'
    }
    if (file.type === 'sheet') return '▦'
    return '📄'
  }

  if (loadingAuth) {
    return (
      <CrtScreen>
        <div className="terminal-crt-container flex min-h-screen w-full flex-col items-center justify-center bg-[#061006] font-mono text-[#65f24c] md:h-full md:min-h-0">
          <div className="space-y-3 text-center">
            <IconTerminal className="mx-auto size-12 animate-pulse text-[#62d84e]" />
            <p className="terminal-crt-text-glow text-sm font-bold tracking-widest uppercase">
              CONECTANDO AO TERMINAL...
            </p>
            <p className="text-xs opacity-60">
              STATUS: CARREGANDO COMPONENTES_
            </p>
          </div>
        </div>
      </CrtScreen>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <CrtScreen>
      <div className="terminal-crt-container flex min-h-screen w-full flex-col justify-between bg-[#061006] p-4 font-mono text-sm/relaxed text-[#65f24c] md:h-full md:min-h-0 md:p-6">
        {/* ---------------- WELCOME STAGE ---------------- */}
        {stage === 'welcome' && (
          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-10 text-center">
            <div className="terminal-crt-border-glow border border-[#62d84e]/30 bg-[#09110b]/80 p-8 md:p-12">
              <div className="mb-6 flex justify-center">
                <IconTerminal className="size-16 animate-pulse text-[#62d84e]" />
              </div>
              <h2 className="terminal-crt-text-glow mb-4 font-mono text-xl font-black tracking-widest uppercase md:text-2xl">
                Acesso ao Terminal
              </h2>
              <p className="mb-8 text-xs tracking-wider text-[#62d84e]/80 uppercase">
                PCSP // NÚCLEO DE PERÍCIA CIBERNÉTICA
                <br />
                VISUALIZADOR DE EVIDÊNCIAS DIGITAIS
              </p>

              <button
                onClick={() => setStage('cipher_gate')}
                className="w-full cursor-pointer border-2 border-[#62d84e] bg-[#62d84e]/10 py-4 font-mono font-bold tracking-widest text-[#62d84e] uppercase transition-all hover:bg-[#62d84e]/20"
              >
                [ ESTABELECER CONEXÃO ]
              </button>
            </div>
          </div>
        )}

        {/* ---------------- CIPHER GATE STAGE (GAMIFICATION) ---------------- */}
        {stage === 'cipher_gate' && (
          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-6">
            <div className="terminal-crt-border-glow border border-[#62d84e]/40 bg-[#070f08]/95 p-6 md:p-8">
              <div className="mb-2 text-center text-xs font-bold tracking-wider text-[#ff8c00] uppercase">
                {isCipherSolved
                  ? '✓ CREDENCIAL RECONSTRUÍDA'
                  : '⚠ PROTOCOLO SOB CIFRA'}
              </div>
              <h3 className="mb-2 text-center text-base font-bold tracking-wider text-[#62d84e] uppercase">
                Cifra de Decodificação Forense
              </h3>
              <p className="mb-6 text-center text-[11px] leading-relaxed text-[#62d84e]/60">
                Ajuste o deslocamento da cifra de César usando o slider para
                decifrar a credencial de segurança e acessar as caixas de
                evidência.
              </p>

              {/* Cipher Box */}
              <div className="mb-6 border border-dashed border-[#62d84e]/40 bg-[#040805] p-5 text-center">
                <div className="mb-2 text-[10px] tracking-widest text-[#62d84e]/50 uppercase">
                  Texto Sob Cifra:
                </div>
                <div className="font-mono text-2xl font-bold tracking-[8px] text-[#ff8c00] uppercase">
                  {CIPHER_TEXT}
                </div>
              </div>

              {/* Shift Slider */}
              <div className="mb-6 border border-[#62d84e]/30 bg-[#09140b]/40 p-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-[#62d84e]/60 uppercase">
                    Deslocamento (Shift Key):
                  </span>
                  <span className="font-bold text-[#62d84e]">
                    {cipherShift}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={cipherShift}
                  onChange={(e) => setCipherShift(Number(e.target.value))}
                  className="h-2 w-full appearance-none rounded-lg border border-[#62d84e]/30 bg-[#0d220e] accent-[#62d84e]"
                  disabled={isValidatingCipher}
                />
              </div>

              {/* Decoded Text Box */}
              <div className="mb-6 border border-[#62d84e]/30 bg-[#09110b] p-4 text-center">
                <div className="mb-1 text-[10px] tracking-widest text-[#62d84e]/50 uppercase">
                  Resultado Decodificado:
                </div>
                <div
                  className={`font-mono text-2xl font-bold tracking-[8px] uppercase transition-all ${
                    isCipherSolved
                      ? 'terminal-crt-text-glow text-[#62d84e]'
                      : 'text-[#62d84e]/85'
                  }`}
                >
                  {currentDecryptedText}
                </div>
              </div>

              <button
                onClick={handleValidateCipher}
                disabled={!isCipherSolved || isValidatingCipher}
                className={`w-full border border-2 py-4 text-center font-mono font-bold tracking-widest uppercase transition-all ${
                  isCipherSolved && !isValidatingCipher
                    ? 'cursor-pointer border-[#62d84e] bg-[#62d84e]/10 text-[#62d84e] hover:bg-[#62d84e]/20'
                    : 'cursor-not-allowed border-[#62d84e]/20 bg-transparent text-[#62d84e]/30'
                }`}
              >
                [ VALIDAR CREDENCIAL ]
              </button>

              {cipherLogs.length > 0 && (
                <div className="mt-4 space-y-1 border-t border-[#62d84e]/20 pt-3 font-mono text-[11px] text-[#62d84e]/80">
                  {cipherLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={
                        log?.includes('concedido') ? 'text-[#62d84e]' : ''
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- SYSTEM LOADING STAGE ---------------- */}
        {stage === 'system_loading' && (
          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-6">
            <div className="terminal-crt-border-glow border border-[#62d84e]/40 bg-[#070f08]/95 p-6 md:p-8">
              <h3 className="mb-6 text-center text-sm font-bold tracking-widest uppercase">
                MONTANDO DIRETÓRIO SEGURO...
              </h3>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="mb-2 flex justify-between text-xs">
                  <span>CARREGANDO PACOTES FORENSES:</span>
                  <span className="font-bold">{loadingProgress}%</span>
                </div>
                <div className="h-6 w-full border border-[#62d84e]/30 bg-[#0d220e] p-0.5">
                  <div
                    className="h-full bg-[#62d84e] transition-all duration-100 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>

              {/* Console output logs */}
              <div
                ref={logsContainerRef}
                data-lenis-prevent
                className="h-32 scrollbar-thin scrollbar-thumb-[#62d84e]/30 space-y-1.5 overflow-y-auto border border-[#62d84e]/20 bg-[#040805] p-4 font-mono text-xs"
              >
                {loadingLogs.map((log, idx) => (
                  <div key={idx} className="opacity-95">
                    {log}
                  </div>
                ))}
                {loadingProgress < 100 && (
                  <div className="animate-pulse">
                    [SYS] carregando...<span className="blink">█</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStage('explorer')}
                disabled={loadingProgress < 100}
                className={`mt-6 w-full border border-2 py-4 text-center font-mono font-bold tracking-widest uppercase transition-all ${
                  loadingProgress === 100
                    ? 'cursor-pointer border-[#62d84e] bg-[#62d84e]/10 text-[#62d84e] hover:bg-[#62d84e]/20'
                    : 'cursor-not-allowed border-[#62d84e]/20 bg-transparent text-[#62d84e]/30'
                }`}
              >
                [ ACESSAR DISPOSITIVO ]
              </button>
            </div>
          </div>
        )}

        {/* ---------------- EXPLORER STAGE (MAIN SYSTEM) ---------------- */}
        {stage === 'explorer' && (
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-between">
            {/* Header */}
            <div className="mb-4 flex flex-col gap-4 border border-[#62d84e]/30 bg-[#09110b]/90 p-4 text-xs md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/imagens/logo.png"
                  alt="PCSP Logo"
                  className="size-10 object-contain drop-shadow-[0_0_2px_rgba(98,216,78,0.4)] filter"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span className="text-xs font-bold tracking-wider md:text-sm">
                  PCSP // VISUALIZADOR DE EVIDÊNCIA
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-6">
                <span className="font-mono whitespace-nowrap text-[#62d84e]/60">
                  SOMENTE LEITURA
                </span>
                <span className="font-mono whitespace-nowrap text-[#ff8c00]">
                  {timeStr}
                </span>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href="/cliente/perfil"
                    className="border border-[#62d84e]/30 px-3 py-1 font-mono whitespace-nowrap transition hover:border-[#62d84e] hover:bg-[#62d84e]/10"
                  >
                    [ PAINEL ]
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="border border-[#d84132]/40 px-3 py-1 font-mono whitespace-nowrap text-[#ffb0a5] transition hover:border-[#d84132] hover:bg-[#d84132]/10"
                  >
                    [ SAIR ]
                  </button>
                </div>
              </div>
            </div>

            {/* Breadcrumb Path Bar */}
            <div className="flex flex-wrap items-center gap-1.5 border border-b-0 border-[#62d84e]/30 bg-[#0c1c0f]/50 px-4 py-2 text-xs">
              <span className="mr-1 border border-[#ff8c00] px-1.5 py-0.5 text-[10px] font-bold text-[#ff8c00]">
                EVIDÊNCIA 59/2026-PD
              </span>
              <button
                onClick={() => navigateTo([])}
                className="text-[#62d84e] hover:underline"
              >
                {volumeInfo.drive}\
              </button>
              {currentPath.map((segment, idx) => {
                const subPath = currentPath.slice(0, idx + 1)
                const node = getNodeByPath(subPath, pendriveTree)
                if (!node) return null
                const isLast = idx === currentPath.length - 1
                return (
                  <span key={segment} className="flex items-center gap-1.5">
                    <span className="text-[#62d84e]/40">›</span>
                    {isLast ? (
                      <span
                        className={
                          node.type === 'locked'
                            ? 'font-bold text-[#ff8c00]'
                            : 'font-bold text-[#62d84e]'
                        }
                      >
                        {node.name}
                      </span>
                    ) : (
                      <button
                        onClick={() => navigateTo(subPath)}
                        className="text-[#62d84e] hover:underline"
                      >
                        {node.name}
                      </button>
                    )}
                  </span>
                )
              })}
            </div>

            {/* Main Dual-Column Panel */}
            <div className="grid min-h-[440px] flex-1 grid-cols-1 border border-[#62d84e]/30 bg-[#050b06]/70 md:grid-cols-[240px_1fr]">
              {/* Left Column: Directory Tree */}
              <aside
                data-lenis-prevent
                className="overflow-y-auto border-b border-[#62d84e]/30 bg-[#070e08]/90 p-3 md:border-r md:border-b-0"
              >
                <div className="mb-3 text-[10px] font-bold tracking-wider text-[#62d84e]/50 uppercase">
                  Estrutura do Dispositivo
                </div>
                <div className="space-y-1 font-mono text-xs">
                  {/* Root Drive */}
                  <div
                    onClick={() => navigateTo([])}
                    className={`flex cursor-pointer items-center gap-2 rounded p-1.5 transition ${
                      currentPath.length === 0
                        ? 'bg-[#103010] text-[#62d84e]'
                        : 'text-[#62d84e]/85 hover:bg-[#102010]'
                    }`}
                  >
                    <span>💾</span>
                    <span>
                      {volumeInfo.label} ({volumeInfo.drive})
                    </span>
                  </div>

                  {/* Main folders and Locked Archives */}
                  {pendriveTree
                    .filter((n) => n.type === 'folder' || n.type === 'locked')
                    .map((node) => {
                      const isZipUnlocked = unlockedZips[node.id]
                      const isActive = currentPath[0] === node.id
                      const isLocked = node.type === 'locked' && !isZipUnlocked

                      return (
                        <div key={node.id} className="pl-3">
                          <div
                            onClick={() => {
                              if (isLocked) {
                                setLockedFileToUnlock(node)
                              } else {
                                navigateTo([node.id])
                              }
                            }}
                            className={`flex cursor-pointer items-center gap-2 rounded p-1.5 transition ${
                              isActive
                                ? isLocked
                                  ? 'bg-[#30150b]/40 text-[#ff8c00]'
                                  : 'bg-[#103010] text-[#62d84e]'
                                : isLocked
                                  ? 'text-[#ff8c00] hover:bg-[#201010]'
                                  : 'text-[#62d84e]/85 hover:bg-[#102010]'
                            }`}
                          >
                            <span>{iconFor(node)}</span>
                            <span className="truncate">{node.name}</span>
                          </div>

                          {/* If nested prints folder is visible inside tree */}
                          {isActive && node.id === 'instituto_quintella' && (
                            <div className="mt-1 border-l border-[#62d84e]/20 pl-4">
                              {node.children
                                ?.filter((sub) => sub.type === 'folder')
                                .map((subFolder) => {
                                  const isSubActive =
                                    currentPath[1] === subFolder.id
                                  return (
                                    <div
                                      key={subFolder.id}
                                      onClick={() =>
                                        navigateTo([node.id, subFolder.id])
                                      }
                                      className={`flex cursor-pointer items-center gap-2 rounded p-1.5 transition ${
                                        isSubActive
                                          ? 'bg-[#103010] text-[#62d84e]'
                                          : 'text-[#62d84e]/80 hover:bg-[#102010]'
                                      }`}
                                    >
                                      <span>📁</span>
                                      <span className="truncate">
                                        {subFolder.name}
                                      </span>
                                    </div>
                                  )
                                })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </aside>

              {/* Right Column: Listing Area */}
              <main data-lenis-prevent className="overflow-y-auto p-4">
                {currentFiles.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#62d84e]/60 italic">
                    Pasta vazia ou contêiner bloqueado.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-[#62d84e]/20 bg-[#050b06]/80 text-xs">
                      {/* Table Header */}
                      <div className="grid grid-cols-[1fr_80px] gap-2 border-b border-[#62d84e]/20 p-2.5 text-[10px] font-bold tracking-wider text-[#62d84e]/50 uppercase md:grid-cols-[1fr_160px_100px]">
                        <span>Nome</span>
                        <span className="hidden md:inline">Modificado</span>
                        <span className="text-right md:text-left">Tamanho</span>
                      </div>

                      {/* File / Folder Rows */}
                      <div className="divide-y divide-[#62d84e]/10">
                        {currentFiles.map((file) => {
                          const isFileLocked =
                            file.type === 'locked' && !unlockedZips[file.id]

                          return (
                            <div
                              key={file.id}
                              onClick={() => {
                                if (isFileLocked) {
                                  setLockedFileToUnlock(file)
                                } else if (file.type === 'folder') {
                                  navigateTo([...currentPath, file.id])
                                } else {
                                  setSelectedFile(file)
                                }
                              }}
                              className={`grid cursor-pointer grid-cols-[1fr_80px] items-center gap-2 p-2.5 transition md:grid-cols-[1fr_160px_100px] ${
                                isFileLocked
                                  ? 'text-[#ff8c00] hover:bg-[#30150b]/20'
                                  : file.type === 'folder'
                                    ? 'font-bold text-[#62d84e] hover:bg-[#102411]/25'
                                    : 'text-[#62d84e]/95 hover:bg-[#102411]/20'
                              }`}
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="shrink-0 text-sm">
                                  {iconFor(file)}
                                </span>
                                <span className="truncate font-mono hover:underline">
                                  {file.name}
                                </span>
                              </div>
                              <span className="hidden font-mono text-[11px] text-[#62d84e]/50 md:inline">
                                {file.modified}
                              </span>
                              <span className="text-right font-mono text-[11px] text-[#62d84e]/50 md:text-left">
                                {file.size}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>

            {/* Bottom explorer bar */}
            <div className="mt-4 flex flex-col items-start gap-3 border border-t-0 border-[#62d84e]/30 bg-[#09110b]/90 p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
              {currentPath.length > 0 ? (
                <button
                  onClick={goBack}
                  className="flex cursor-pointer items-center gap-2 border border-[#62d84e]/50 px-4 py-1.5 font-mono whitespace-nowrap text-[#62d84e] uppercase transition-all hover:bg-[#62d84e]/10"
                >
                  <IconArrowLeft className="size-4" />[ VOLTAR ]
                </button>
              ) : (
                <span className="whitespace-nowrap text-[#62d84e]/40 select-none">
                  [ SISTEMA PRONTO ]
                </span>
              )}
              <span className="font-mono text-[10px] leading-normal text-[#62d84e]/50">
                VOLUME: {volumeInfo.label} ({volumeInfo.drive}) · SHA-256
                REGISTRADO · MONTADO EM MODO SOMENTE-LEITURA
              </span>
            </div>
          </div>
        )}

        {/* ---------------- DECRYPTION ZIP DIALOG (OVERLAY WINDOW) ---------------- */}
        {lockedFileToUnlock && (
          <div
            data-lenis-prevent
            className="animate-fade-in fixed inset-0 z-40 flex items-center justify-center bg-[#020502]/90 p-4 md:absolute"
          >
            <div className="win w-full max-w-md border border-[#ff8c00] bg-[#090b09] shadow-[0_0_20px_rgba(255,140,0,0.2)]">
              {/* Header bar */}
              <div className="win-bar flex items-center justify-between border-b border-[#ff8c00] p-2 text-xs font-bold tracking-wider text-[#ff8c00] uppercase">
                <span>SISTEMA DE ARQUIVOS BLOQUEADO</span>
                <button
                  onClick={() => {
                    setLockedFileToUnlock(null)
                    setLockedZipPassword('')
                    setLockedZipError('')
                  }}
                  className="cursor-pointer rounded border border-[#ff8c00]/40 px-1 text-[10px] transition hover:border-[#ff8c00] hover:text-white"
                >
                  ✕
                </button>
              </div>
              {/* Body */}
              <div className="space-y-4 p-6">
                <p className="text-xs text-[#ff8c00]/80">
                  O arquivo{' '}
                  <b className="font-mono text-[#ff8c00]">
                    {lockedFileToUnlock.name}
                  </b>{' '}
                  está sob criptografia robusta (AES-256). Digite a senha do
                  investigador para montá-lo e descriptografar os dados.
                </p>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold tracking-widest text-[#62d84e]/50 uppercase">
                    Credencial de Descriptografia:
                  </label>
                  <input
                    type="password"
                    value={lockedZipPassword}
                    onChange={(e) => setLockedZipPassword(e.target.value)}
                    placeholder="DIGITE A SENHA..."
                    disabled={lockedZipDecrypting}
                    className="w-full rounded border border-[#ff8c00]/40 bg-[#0d140e] p-2.5 font-mono text-xs text-[#ff8c00] focus:border-[#ff8c00] focus:outline-none"
                  />
                </div>

                {lockedZipError && (
                  <div className="font-mono text-[11px] font-bold text-[#d84132]">
                    {lockedZipError}
                  </div>
                )}

                {lockedZipDecrypting ? (
                  <div className="space-y-2 pt-2">
                    <div className="h-1.5 overflow-hidden rounded-full border border-[#ff8c00]/20 bg-[#142015] p-0.5">
                      <div
                        className="h-full animate-pulse rounded-full bg-[#ff8c00]"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="h-20 space-y-1 overflow-y-auto rounded bg-black/60 p-2 font-mono text-[10px] text-[#ff8c00]/80">
                      {lockedZipDecryptLogs.map((log, idx) => (
                        <div key={idx}>{log}</div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleDecryptZip}
                    className="w-full cursor-pointer rounded border border-[#ff8c00] bg-[#ff8c00]/10 py-3 font-mono text-xs font-bold tracking-wider text-[#ff8c00] uppercase transition hover:bg-[#ff8c00]/25"
                  >
                    [ INICIAR DESCRIPTOGRAFIA ]
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- FILE VIEWER MODAL OVERLAY ---------------- */}
        {selectedFile && (
          <div
            onClick={() => {
              setSelectedFile(null)
              setIsImageZoomed(false)
            }}
            data-lenis-prevent
            className="fixed inset-0 z-40 flex cursor-pointer items-center justify-center overflow-y-auto bg-[#020502]/92 p-4 md:absolute"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="win flex max-h-[90vh] w-full max-w-3xl cursor-default flex-col justify-between border border-[#62d84e] bg-[#050b06] shadow-[0_0_30px_rgba(98,216,78,0.2)]"
            >
              {/* Header bar */}
              <div className="win-bar flex shrink-0 items-center justify-between border-b border-[#62d84e]/30 bg-[#070e08]/90 p-3 text-xs font-bold tracking-wider text-[#62d84e] uppercase">
                <span className="truncate">
                  Visualizador: {selectedFile.name}
                </span>
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    setIsImageZoomed(false)
                  }}
                  className="size-6 cursor-pointer rounded border border-[#62d84e]/40 text-center leading-5 transition hover:border-[#62d84e] hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Meta Data Panel */}
              <div className="shrink-0 space-y-0.5 border-b border-[#62d84e]/20 bg-[#09140b]/90 p-3 font-mono text-[10px] leading-relaxed text-[#62d84e]/60">
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
              <div className="max-h-[60vh] flex-1 overflow-y-auto bg-[#030603] p-6">
                {/* TEXT or PDF VIEW */}
                {selectedFile.type === 'text' && (
                  <div className="rounded border border-[#62d84e]/20 bg-[#040804] p-4 font-mono text-xs/relaxed whitespace-pre-wrap text-[#62d84e]/95 select-text selection:bg-[#62d84e]/30">
                    {selectedFile.content}
                  </div>
                )}

                {/* SHEET (SPREADSHEET) VIEW */}
                {selectedFile.type === 'sheet' && (
                  <div className="overflow-x-auto rounded border border-[#62d84e]/30 bg-[#040804]">
                    <table className="w-full border-collapse text-left font-mono text-xs text-[#62d84e]/90">
                      <thead>
                        <tr className="border-b border-[#62d84e]/30 bg-[#0d220e] text-[#62d84e]">
                          {selectedFile.columns?.map((col, idx) => (
                            <th
                              key={idx}
                              className="border-r border-[#62d84e]/20 bg-[#0d1f0d] p-2 text-[10px] font-bold tracking-wider uppercase"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#62d84e]/20">
                        {selectedFile.rows?.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#103010]/20">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className="border-r border-[#62d84e]/10 p-2"
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
                    {/* Renders the actual image downloaded from server */}
                    <div className="relative rounded border border-[#62d84e]/30 bg-black p-4 text-center">
                      <img
                        src={selectedFile.downloadUrl}
                        alt={selectedFile.name}
                        onClick={() => setIsImageZoomed(true)}
                        className="mx-auto max-h-[380px] max-w-full cursor-zoom-in border border-[#62d84e]/20 object-contain transition-all hover:border-[#62d84e]"
                        onError={(e) => {
                          // Display retro placeholder if file fails to load
                          e.currentTarget.style.display = 'none'
                          const fallbackDiv = e.currentTarget
                            .nextElementSibling as HTMLDivElement
                          if (fallbackDiv) fallbackDiv.style.display = 'block'
                        }}
                      />
                      <div className="hidden space-y-4 py-8">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-dashed border-[#62d84e] text-lg font-bold text-[#62d84e]">
                          IMG
                        </div>
                        <div className="mx-auto max-w-md text-xs/relaxed text-[#62d84e]/80">
                          (fonte de imagem indisponível —{' '}
                          {selectedFile.downloadUrl})
                        </div>
                      </div>
                      <div className="mt-2 font-mono text-[10px] text-[#62d84e]/50">
                        [ CLIQUE NA IMAGEM PARA AMPLIAR / ZOOM ]
                      </div>
                      <div className="mt-3 border-l-2 border-[#62d84e]/40 pl-3 text-left font-mono text-[11px] text-[#62d84e]/60">
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
                      <div className="space-y-4 rounded border border-[#d84132]/40 bg-[#1a0808]/90 p-5 text-center">
                        <div className="flex justify-center text-[#d84132]">
                          <IconAlertTriangle className="size-12 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[#d84132] uppercase">
                            ARQUIVO CORROMPIDO OU SETOR DEFEITUOSO DETECTADO
                          </h4>
                          <p className="mx-auto max-w-md text-[11px] leading-relaxed text-[#ffb0a5]/80">
                            O arquivo{' '}
                            <span className="font-mono font-bold">
                              {selectedFile.name}
                            </span>{' '}
                            apresenta perda de pacotes e sincronização de
                            cabeçalhos binários.
                          </p>
                        </div>

                        {isRecoveringAudio[selectedFile.id] ? (
                          /* RECOVERY IN PROGRESS */
                          <div className="mx-auto max-w-sm space-y-3 pt-2 text-left">
                            <div className="flex justify-between text-[11px] font-bold text-[#ff8c00]">
                              <span>RECONSTRUINDO PACOTES DE ONDA:</span>
                              <span>
                                {audioRecoveryProgress[selectedFile.id]}%
                              </span>
                            </div>
                            <div className="h-4 overflow-hidden rounded-full border border-[#ff8c00]/30 bg-[#1e100a] p-0.5">
                              <div
                                className="h-full rounded-full bg-[#ff8c00] transition-all duration-100 ease-out"
                                style={{
                                  width: `${audioRecoveryProgress[selectedFile.id]}%`,
                                }}
                              />
                            </div>
                            <div className="max-h-16 space-y-0.5 overflow-y-auto rounded bg-black/40 p-2 font-mono text-[9px] text-[#ff8c00]/70">
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
                            className="cursor-pointer rounded border border-[#ff8c00] bg-[#ff8c00]/10 px-6 py-2.5 font-mono text-xs font-bold tracking-wider text-[#ff8c00] uppercase transition hover:bg-[#ff8c00]/25"
                          >
                            [ RECONSTRUIR ARQUIVO ]
                          </button>
                        )}
                      </div>
                    ) : (
                      /* RECOVERED / REGULAR AUDIO VIEW */
                      <div className="space-y-4">
                        {selectedFile.corrupted && (
                          <div className="flex items-center gap-2 rounded border border-[#62d84e]/30 bg-[#0d220e]/60 px-3 py-1.5 font-mono text-[11px] font-bold tracking-wider text-[#62d84e] uppercase">
                            <IconCheck className="size-4 shrink-0 text-[#62d84e]" />
                            <span>
                              Arquivo recuperado via alinhamento forense digital
                              de canais
                            </span>
                          </div>
                        )}

                        {/* Hidden native audio element */}
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

                        {/* Interactive Custom Audio Player & Waveform */}
                        <div className="flex flex-col items-center justify-between gap-6 rounded border border-[#62d84e]/30 bg-black p-5 md:flex-row">
                          {/* Play/Pause Button on the Left */}
                          <div className="flex shrink-0 items-center gap-4">
                            <button
                              onClick={() => handleTogglePlay(selectedFile.id)}
                              className="flex size-14 cursor-pointer items-center justify-center rounded-full border-2 border-[#62d84e] bg-[#62d84e]/10 text-[#62d84e] shadow-[0_0_10px_rgba(98,216,78,0.2)] transition-all hover:bg-[#62d84e]/20 focus:outline-none"
                              aria-label={isPlayingAudio ? 'Pausar' : 'Tocar'}
                            >
                              {isPlayingAudio ? (
                                <IconPause className="size-7 fill-[#62d84e] text-[#62d84e]" />
                              ) : (
                                <IconPlay className="size-7 fill-[#62d84e] text-[#62d84e] pl-0.5" />
                              )}
                            </button>

                            <div className="flex flex-col font-mono text-xs">
                              <span className="text-sm font-bold tracking-wider text-[#62d84e]">
                                {isPlayingAudio ? 'REPRODUZINDO' : 'PAUSADO'}
                              </span>
                              <span className="mt-0.5 text-[11px] text-[#62d84e]/60">
                                {formatTime(audioCurrentTime)} /{' '}
                                {formatTime(audioDuration || 6)}
                              </span>
                            </div>
                          </div>

                          {/* Waveform Visualizer */}
                          <div className="flex h-14 w-full flex-1 items-center justify-center gap-1.5 rounded border border-[#62d84e]/10 bg-[#050b06] px-4">
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
                                  className={`w-1 rounded-full bg-[#62d84e] transition-all duration-150 ${animClass}`}
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
                        <div className="space-y-2 rounded border border-[#62d84e]/20 bg-[#040804] p-4">
                          <span className="block border-b border-[#62d84e]/10 pb-1 text-[10px] font-bold tracking-widest text-[#62d84e]/50 uppercase">
                            {'// transcrição automática (parcial):'}
                          </span>
                          <p className="font-mono text-xs/relaxed text-[#62d84e]/90 italic select-text selection:bg-[#62d84e]/30">
                            <span className="text-[#62d84e]">
                              &ldquo;{selectedFile.fragment}&rdquo;
                            </span>{' '}
                            <span className="text-[#ff4444]">
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
              <div className="flex shrink-0 flex-col gap-3 border-t border-[#62d84e]/30 bg-[#070e08]/90 p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                {selectedFile.downloadUrl ? (
                  <a
                    href={selectedFile.downloadUrl}
                    download
                    className="flex w-full cursor-pointer items-center justify-center gap-2 border border-[#62d84e]/40 px-4 py-1.5 font-mono tracking-wider whitespace-nowrap text-[#62d84e] uppercase transition-all hover:border-[#62d84e] hover:bg-[#62d84e]/10 sm:w-auto"
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
                  className="w-full cursor-pointer border border-[#62d84e] bg-[#62d84e]/10 px-5 py-1.5 font-mono font-bold tracking-wider whitespace-nowrap text-[#62d84e] uppercase transition hover:bg-[#62d84e]/25 sm:w-auto"
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
            data-lenis-prevent
            className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center overflow-y-auto bg-[#020502]/98 p-4 md:absolute md:p-8"
          >
            <div className="absolute top-4 right-4 z-10 rounded border border-[#62d84e] bg-[#09110b] px-4 py-1.5 font-mono text-xs font-bold tracking-wider text-[#62d84e] uppercase select-none">
              [ FECHAR ZOOM ]
            </div>
            <div className="my-auto flex w-full max-w-[95vw] flex-col items-center py-12 md:max-w-[85vw] lg:max-w-[75vw]">
              <img
                src={selectedFile.downloadUrl}
                alt={selectedFile.name}
                className="h-auto w-full border border-[#62d84e]/30 bg-black object-contain shadow-[0_0_40px_rgba(98,216,78,0.3)]"
                onClick={(e) => e.stopPropagation()}
              />
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-6 max-w-xl cursor-default rounded border border-[#62d84e]/30 bg-[#09110b]/90 px-4 py-2 text-center font-mono text-[11px] leading-relaxed text-[#62d84e]"
              >
                {selectedFile.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </CrtScreen>
  )
}
