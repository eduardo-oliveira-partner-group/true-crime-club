'use client'

import {
  IconArrowLeft,
  IconDatabase,
  IconFileText,
  IconFolder,
  IconFolderOpen,
  IconLayoutDashboard,
  IconLogout,
  IconTerminal,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { mockCaseBoxes } from '@/src/lib/domain/cases-mock-data'

type ScreenStage =
  | 'welcome'
  | 'case_list'
  | 'box_selection'
  | 'investigator_area'
  | 'file_list'

export default function CasosPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [stage, setStage] = useState<ScreenStage>('welcome')
  const [selectedBoxNum, setSelectedBoxNum] = useState<number | null>(null)
  const [selectedFolderName, setSelectedFolderName] = useState<
    'arquivos' | 'documentos' | 'pendrive' | null
  >(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
    setLoadingAuth(false)
  }, [router])

  const selectedBox = mockCaseBoxes.find((b) => b.number === selectedBoxNum)

  // Handlers
  const handleStart = () => setStage('case_list')
  const handleSelectCase = () => setStage('box_selection')
  const handleSelectBox = (boxNum: number) => {
    setSelectedBoxNum(boxNum)
    setStage('investigator_area')
  }
  const handleSelectFolder = (
    folderKey: 'arquivos' | 'documentos' | 'pendrive',
  ) => {
    setSelectedFolderName(folderKey)
    setStage('file_list')
  }

  // Back actions
  const goBack = () => {
    if (stage === 'file_list') {
      setStage('investigator_area')
      setSelectedFolderName(null)
    } else if (stage === 'investigator_area') {
      setStage('box_selection')
      setSelectedBoxNum(null)
    } else if (stage === 'box_selection') {
      setStage('case_list')
    } else if (stage === 'case_list') {
      setStage('welcome')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    router.push('/')
  }

  if (loadingAuth) {
    return (
      <div className="terminal-crt-container flex min-h-screen w-full flex-col items-center justify-center font-mono text-[#62d84e]">
        <div className="space-y-3 text-center">
          <IconTerminal className="mx-auto size-12 animate-pulse" />
          <p className="terminal-crt-text-glow text-sm font-bold tracking-widest uppercase">
            CONECTANDO AO TERMINAL...
          </p>
          <p className="text-xs opacity-60">STATUS: CARREGANDO COMPONENTES_</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="terminal-crt-container flex min-h-screen w-full flex-col justify-between p-4 font-mono text-sm/relaxed text-[#62d84e] md:p-8">
      {/* Header do Terminal */}
      <div className="flex flex-col gap-4 border-b border-[#62d84e]/30 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <IconTerminal className="size-5 animate-pulse text-[#62d84e]" />
          <span className="terminal-crt-text-glow text-base font-bold tracking-wider">
            TCC_DETETIVE_OS.EXE
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <Link
            href="/cliente/perfil"
            className="flex items-center gap-1 border border-[#62d84e]/30 px-2.5 py-1 text-[11px] transition hover:border-[#62d84e] hover:bg-[#62d84e]/10"
          >
            <IconLayoutDashboard className="size-3.5" />[ PAINEL ]
          </Link>
          <Link
            href="/"
            className="border border-[#62d84e]/30 px-2.5 py-1 text-[11px] transition hover:border-[#62d84e] hover:bg-[#62d84e]/10"
          >
            [ IR PARA O SITE ]
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 border border-[#d84132]/40 px-2.5 py-1 text-[11px] text-[#ffb0a5] transition hover:border-[#d84132] hover:bg-[#d84132]/10"
          >
            <IconLogout className="size-3.5" />[ DESCONECTAR ]
          </button>
        </div>
      </div>

      {/* Main Terminal Screen Content Area */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center py-8">
        <div className="w-full">
          {/* STAGE 1: Welcome Screen */}
          {stage === 'welcome' && (
            <div className="space-y-6 py-10 text-center">
              <h2 className="terminal-crt-text-glow animate-pulse text-xl font-black tracking-widest uppercase md:text-2xl">
                Acesso ao Terminal Investigativo
              </h2>
              <p className="mx-auto max-w-md text-xs text-[#62d84e]/85 md:text-sm">
                SISTEMA OPERACIONAL RETRÔ DE ANÁLISE DE EVIDÊNCIAS E CONTEÚDOS
                DO TRUE CRIME CLUB.
              </p>

              <div className="flex justify-center py-6">
                <button
                  onClick={handleStart}
                  className="group terminal-crt-border-glow flex w-full max-w-xs cursor-pointer flex-col items-center gap-4 border-2 border-[#62d84e] bg-[#62d84e]/10 p-6 text-center transition-all hover:bg-[#62d84e]/20 md:p-10"
                >
                  <IconDatabase className="size-16 text-[#62d84e] transition-transform group-hover:scale-105" />
                  <span className="terminal-crt-text-glow font-heading text-lg font-bold tracking-widest uppercase">
                    [ ABRIR GAVETEIRO ]
                  </span>
                  <span className="text-[9px] opacity-75">
                    CARREGANDO CASOS...
                  </span>
                </button>
              </div>
              <p className="text-[10px] text-[#62d84e]/60">
                CLIQUE NO GAVETEIRO PARA INICIAR A PESQUISA
              </p>
            </div>
          )}

          {/* STAGE 2: Cases list */}
          {stage === 'case_list' && (
            <div className="space-y-6">
              <div className="border-b border-[#62d84e]/15 pb-2">
                <span className="text-xs text-[#62d84e]/70">
                  DIRETÓRIO: C:\CASOS\
                </span>
                <h2 className="terminal-crt-text-glow mt-1 text-lg font-bold tracking-wider uppercase">
                  Lista de Dossiês Ativos
                </h2>
              </div>

              <div className="grid max-w-xl gap-4 py-4">
                <button
                  onClick={handleSelectCase}
                  className="flex w-full cursor-pointer items-start gap-4 border border-[#62d84e]/50 bg-[#62d84e]/5 p-5 text-left transition-all hover:border-[#62d84e] hover:bg-[#62d84e]/15"
                >
                  <IconFolder className="size-8 shrink-0 text-[#62d84e]" />
                  <div>
                    <h3 className="terminal-crt-text-glow text-base font-bold tracking-wide uppercase">
                      Caso: Victória Monteiro
                    </h3>
                    <p className="mt-2 text-xs text-[#62d84e]/80">
                      Dossiê investigativo referente ao misterioso
                      desaparecimento de Victória Monteiro. Evidências
                      catalogadas de Caixas 1 a 4.
                    </p>
                    <p className="mt-2 font-mono text-[10px] text-[#62d84e]/65">
                      STATUS: ABERTO PARA INVESTIGAÇÃO · DATA: 2026
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: Boxes grid selection */}
          {stage === 'box_selection' && (
            <div className="space-y-6">
              <div className="border-b border-[#62d84e]/15 pb-2">
                <span className="text-xs text-[#62d84e]/70">
                  DIRETÓRIO: C:\CASOS\VICTORIA_MONTEIRO\
                </span>
                <h2 className="terminal-crt-text-glow mt-1 text-lg font-bold tracking-wider uppercase">
                  Selecione a Caixa de Evidências
                </h2>
              </div>

              <div className="grid gap-4 py-4 md:grid-cols-2">
                {mockCaseBoxes.map((box) => (
                  <button
                    key={box.number}
                    onClick={() => handleSelectBox(box.number)}
                    className="flex w-full cursor-pointer flex-col justify-between border border-[#62d84e]/40 bg-[#62d84e]/5 p-5 text-left text-sm transition-all hover:border-[#62d84e] hover:bg-[#62d84e]/10"
                  >
                    <div>
                      <div className="mb-3 flex items-center gap-2 border-b border-[#62d84e]/20 pb-2">
                        <span className="border border-[#62d84e]/40 px-1.5 py-0.5 font-mono text-xs font-bold text-[#62d84e] uppercase">
                          BOX #{box.number}
                        </span>
                        <h4 className="terminal-crt-text-glow font-bold tracking-wide uppercase">
                          {box.title}
                        </h4>
                      </div>
                      <p className="line-clamp-2 text-xs text-[#62d84e]/85">
                        {box.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#62d84e]/10 pt-2 text-xs font-bold">
                      <span className="text-[10px] text-[#62d84e]/70">
                        CONTEÚDO CLASSIFICADO
                      </span>
                      <span className="text-[#62d84e]">[ ACESSAR ]</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 4: Investigator Area folders */}
          {stage === 'investigator_area' && selectedBox && (
            <div className="space-y-6">
              <div className="border-b border-[#62d84e]/15 pb-2">
                <span className="text-xs text-[#62d84e]/70">
                  DIRETÓRIO: C:\CASOS\VICTORIA_MONTEIRO\CAIXA_
                  {selectedBox.number}\
                </span>
                <h2 className="terminal-crt-text-glow mt-1 text-lg font-bold tracking-wider uppercase">
                  Área do Investigador - Caixa #{selectedBox.number}
                </h2>
                <p className="mt-1 text-xs text-[#62d84e]/80">
                  {selectedBox.description}
                </p>
              </div>

              <div className="grid gap-6 py-6 sm:grid-cols-3">
                {/* Folder 1: Arquivos do caso */}
                <button
                  onClick={() => handleSelectFolder('arquivos')}
                  className="flex cursor-pointer flex-col items-center border border-[#62d84e]/30 p-6 text-center transition-all hover:border-[#62d84e] hover:bg-[#62d84e]/10"
                >
                  <IconFolder className="mb-3 size-16 text-[#62d84e]" />
                  <span className="terminal-crt-text-glow text-xs font-bold tracking-wide text-[#62d84e] uppercase">
                    Arquivos dos Casos
                  </span>
                  <span className="mt-2 text-[10px] text-[#62d84e]/70">
                    {selectedBox.folders.arquivos.files.length} arquivos
                    catalogados
                  </span>
                </button>

                {/* Folder 2: Documentos */}
                <button
                  onClick={() => handleSelectFolder('documentos')}
                  className="flex cursor-pointer flex-col items-center border border-[#62d84e]/30 p-6 text-center transition-all hover:border-[#62d84e] hover:bg-[#62d84e]/10"
                >
                  <IconFolderOpen className="mb-3 size-16 text-[#62d84e]" />
                  <span className="terminal-crt-text-glow text-xs font-bold tracking-wide text-[#62d84e] uppercase">
                    Documentos
                  </span>
                  <span className="mt-2 text-[10px] text-[#62d84e]/70">
                    {selectedBox.folders.documentos.files.length} arquivos
                    catalogados
                  </span>
                </button>

                {/* Folder 3: Pendrive */}
                <button
                  onClick={() => handleSelectFolder('pendrive')}
                  className="flex cursor-pointer flex-col items-center border border-[#62d84e]/30 p-6 text-center transition-all hover:border-[#62d84e] hover:bg-[#62d84e]/10"
                >
                  <IconFolder className="mb-3 size-16 text-[#62d84e]" />
                  <span className="terminal-crt-text-glow text-xs font-bold tracking-wide text-[#62d84e] uppercase">
                    Pendrive
                  </span>
                  <span className="mt-2 text-[10px] text-[#62d84e]/70">
                    {selectedBox.folders.pendrive.files.length} arquivos
                    catalogados
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 5: File List */}
          {stage === 'file_list' && selectedBox && selectedFolderName && (
            <div className="space-y-6">
              <div className="border-b border-[#62d84e]/15 pb-2">
                <span className="text-xs text-[#62d84e]/70">
                  DIRETÓRIO: C:\CASOS\VICTORIA_MONTEIRO\CAIXA_
                  {selectedBox.number}\{selectedFolderName.toUpperCase()}\
                </span>
                <h2 className="terminal-crt-text-glow mt-1 text-lg font-bold tracking-wider uppercase">
                  Arquivos em: {selectedBox.folders[selectedFolderName].name}
                </h2>
              </div>

              <div className="divide-y divide-[#62d84e]/20 border border-[#62d84e]/30 bg-[#09110b]/60">
                {selectedBox.folders[selectedFolderName].files.length === 0 ? (
                  <div className="p-4 text-xs text-[#62d84e]/70 italic">
                    Pasta vazia ou conteúdo bloqueado.
                  </div>
                ) : (
                  selectedBox.folders[selectedFolderName].files.map((file) => (
                    <a
                      key={file.id}
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex cursor-pointer items-center justify-between p-4 text-xs transition-colors hover:bg-[#62d84e]/10 md:text-sm"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <IconFileText className="size-5 shrink-0 text-[#62d84e]" />
                        <span className="truncate font-mono text-[#62d84e] group-hover:underline">
                          {file.name}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-4 font-mono text-[11px] text-[#62d84e]/80">
                        <span>[{file.type.toUpperCase()}]</span>
                        <span>{file.sizeLabel}</span>
                        <span className="text-[#62d84e] transition-transform group-hover:scale-105">
                          [ BAIXAR ]
                        </span>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer do Terminal com Botão Voltar */}
      <div className="flex items-center justify-between border-t border-[#62d84e]/30 pt-4 text-xs">
        {stage !== 'welcome' ? (
          <button
            onClick={goBack}
            className="flex cursor-pointer items-center gap-2 border border-[#62d84e]/50 px-4 py-2 font-mono text-[#62d84e] uppercase transition-colors hover:border-[#62d84e] hover:bg-[#62d84e]/15"
          >
            <IconArrowLeft className="size-4 text-[#62d84e]" />[ VOLTAR ]
          </button>
        ) : (
          <div className="text-[#62d84e]/50 select-none">
            [ SISTEMA PRONTO ]
          </div>
        )}
        <div className="font-mono text-[10px] text-[#62d84e]/60">
          USER: DETETIVE_MOCK · CASO_ID: VM_2026
        </div>
      </div>
    </div>
  )
}
