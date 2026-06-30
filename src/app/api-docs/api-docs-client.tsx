'use client'

import {
  IconArrowLeft,
  IconCheck,
  IconCopy,
  IconDatabase,
  IconFileDescription,
  IconFiles,
  IconFolderOpen,
  IconInfoCircle,
  IconPlayerPlay,
  IconSearch,
  IconServer,
  IconTerminal,
} from '@tabler/icons-react'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'

import { OpenApiRoute, OpenApiSchema, OpenApiSpec } from '@/src/lib/openapi'

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

const MOCK_DATE_TIME = '2026-04-27T14:50:00.000Z'

const escapeJsonForHtml = (json: string) =>
  json.replace(/[<>&]/g, (char) => {
    switch (char) {
      case '<':
        return '\\u003c'
      case '>':
        return '\\u003e'
      case '&':
        return '\\u0026'
      default:
        return char
    }
  })

interface ApiDocsClientProps {
  spec: OpenApiSpec
  initialTag?: string
  initialQuery?: string
}

export default function ApiDocsClient({
  spec,
  initialTag = '',
  initialQuery = '',
}: ApiDocsClientProps) {
  const [activeTab, setActiveTab] = useState<'routes' | 'models'>('routes')
  const [selectedTag, setSelectedTag] = useState<string>(initialTag)
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery)
  const [selectedRoute, setSelectedRoute] = useState<OpenApiRoute | null>(null)

  // Terminal simulation states
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([])
  const [simulatedResponse, setSimulatedResponse] = useState<string | null>(
    null,
  )
  const [copiedText, setCopiedText] = useState<string | null>(null)

  // Initialize selected route
  useEffect(() => {
    if (spec.routes.length > 0 && !selectedRoute) {
      setSelectedRoute(spec.routes[0])
    }
  }, [spec, selectedRoute])

  // Reset selected tag when switching tabs
  const handleTabChange = (tab: 'routes' | 'models') => {
    setActiveTab(tab)
    if (tab === 'models') {
      setSelectedTag('')
    }
  }

  // Filter routes based on search and selected tag
  const filteredRoutes = useMemo(() => {
    return spec.routes.filter((route) => {
      const matchesTag = !selectedTag || route.tags?.includes(selectedTag)
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        route.path.toLowerCase().includes(query) ||
        route.summary?.toLowerCase().includes(query) ||
        route.description?.toLowerCase().includes(query) ||
        route.method.toLowerCase().includes(query)

      return matchesTag && matchesSearch
    })
  }, [spec.routes, selectedTag, searchQuery])

  // Filter models based on search
  const filteredModels = useMemo(() => {
    return Object.entries(spec.schemas).filter(([name, schema]) => {
      const query = searchQuery.toLowerCase()
      return (
        !searchQuery ||
        name.toLowerCase().includes(query) ||
        schema.description?.toLowerCase().includes(query)
      )
    })
  }, [spec.schemas, searchQuery])

  // Group routes by tags for listing count
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    spec.routes.forEach((route) => {
      route.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return counts
  }, [spec.routes])

  // Helper to generate schema JSON examples
  const generateMockJson = (schema: OpenApiSchema | undefined): JsonValue => {
    if (!schema) return null
    if (schema.example !== undefined) return schema.example

    // Resolve type
    if (schema.type === 'object') {
      const res: Record<string, JsonValue> = {}
      if (schema.properties) {
        for (const [key, val] of Object.entries(schema.properties)) {
          res[key] = generateMockJson(val)
        }
      }
      return res
    }

    if (schema.type === 'array') {
      return [generateMockJson(schema.items)]
    }

    if (schema.type === 'string') {
      if (schema.format === 'email') return 'mariana.silva@email.com'
      if (schema.format === 'date-time') return MOCK_DATE_TIME
      if (schema.enum && schema.enum.length > 0) return schema.enum[0]
      return 'string'
    }

    if (schema.type === 'integer' || schema.type === 'number') {
      return 100
    }

    if (schema.type === 'boolean') {
      return true
    }

    return null
  }

  const formatMockJson = (schema: OpenApiSchema | undefined) =>
    escapeJsonForHtml(JSON.stringify(generateMockJson(schema), null, 2))

  // Handle simulate request
  const simulateRequest = async (route: OpenApiRoute) => {
    if (isSimulating) return
    setIsSimulating(true)
    setSimulatedResponse(null)

    const logs = [
      `> INITIATING SECURE LINK TO EVIDENCES SYSTEM...`,
      `> ACCESSING DATABASE WITH KEY: TCC-SYS-SECURE`,
      `> DISPATCHING SIMULATED REQUEST...`,
      `> METHOD: ${route.method}`,
      `> URL: http://localhost:3000/api${route.path}`,
    ]

    setSimulatedLogs([logs[0]])

    // Animate logs printout
    for (let i = 1; i < logs.length; i++) {
      await new Promise((r) => setTimeout(r, 200))
      setSimulatedLogs((prev) => [...prev, logs[i]])
    }

    await new Promise((r) => setTimeout(r, 600))
    setSimulatedLogs((prev) => [
      ...prev,
      `> ESTABLISHING SECURE HANDSHAKE... STATUS: 200 OK`,
    ])

    // Find the first successful response
    const successResponse =
      route.responses['200'] ||
      route.responses['201'] ||
      Object.values(route.responses)[0]
    const schema = successResponse?.content?.['application/json']?.schema
    setSimulatedResponse(formatMockJson(schema))
    setIsSimulating(false)
  }

  // Effect to load new route in simulation console when route changes
  useEffect(() => {
    if (selectedRoute) {
      setSimulatedLogs([
        `> TERMINAL READY.`,
        `> TARGET: ${selectedRoute.method} ${selectedRoute.path}`,
        `> PRESS 'SIMULATE EVIDENCE FETCH' TO TRIGGER CONNECTION.`,
      ])
      setSimulatedResponse(null)
    }
  }, [selectedRoute])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const getMethodColorClass = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-[#1e3422] text-[#8be2a5] border-[#2e5d37]/50'
      case 'POST':
        return 'bg-[#3b2f1c] text-[#fcd386] border-[#6b552d]/50'
      case 'PATCH':
      case 'PUT':
        return 'bg-[#18293a] text-[#8dc7f6] border-[#294c6d]/50'
      case 'DELETE':
        return 'bg-[#3a1d1d] text-[#fca5a5] border-[#6b2c2c]/50'
      default:
        return 'bg-[#292524] text-[#d6d3d1] border-[#44403c]/50'
    }
  }

  return (
    <div className="flex h-screen min-h-0 flex-col overflow-hidden">
      {/* HEADER SECTION */}
      <header className="z-20 flex shrink-0 flex-col justify-between gap-4 border-b border-[#fffaf0]/10 bg-[#0b0908] px-6 py-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 text-[#d7c9b5] transition-colors hover:text-[#fffaf0]"
          >
            <IconArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="font-mono text-xs tracking-wider uppercase">
              Voltar
            </span>
          </Link>
          <div className="hidden h-4 w-px bg-[#fffaf0]/15 md:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="flex animate-pulse items-center gap-1.5 font-mono text-xs font-semibold tracking-widest text-[#d84132] uppercase">
                <span className="inline-block size-1.5 rounded-full bg-[#d84132]" />
                CONEXÃO SEGURA // TCC-DB
              </span>
              <span className="font-mono text-xs text-[#fffaf0]/30">|</span>
              <span className="font-mono text-xs font-semibold tracking-wider text-[#d7b56d] uppercase">
                SISTEMA DE INTELIGÊNCIA DE API
              </span>
            </div>
            <h1 className="mt-0.5 font-heading text-xl font-bold text-[#fffaf0] md:text-2xl">
              Dossiê de Rotas de API
            </h1>
          </div>
        </div>

        {/* Server & Info Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-md border border-[#fffaf0]/10 bg-[#171211] px-3 py-1.5 font-mono text-xs text-[#d7c9b5]">
            <IconServer size={14} className="text-[#d7b56d]" />
            <span className="text-[#fffaf0]/60">V:</span>
            <span className="font-semibold text-[#fffaf0]">
              {spec.info.version}
            </span>
          </div>
          <a
            href="/docs/openapi.yaml"
            download
            className="flex items-center gap-2 rounded-md border border-[#fffaf0]/10 bg-[#171211] px-3 py-1.5 font-mono text-xs text-[#d7c9b5] transition-colors hover:bg-[#fffaf0]/10"
            title="Baixar OpenAPI YAML"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
              <path
                fill="currentColor"
                d="M8 2.5a.75.75 0 0 1 .75.75v5.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3A.75.75 0 1 1 5.53 7.22L7.25 8.94V3.25A.75.75 0 0 1 8 2.5Zm-5.25 9a.75.75 0 1 0 0 1.5h10.5a.75.75 0 0 0 0-1.5H2.75Z"
              />
            </svg>
            <span className="text-[#fffaf0]/60">Baixar:</span>
            <span className="font-semibold text-[#fffaf0]">openapi.yaml</span>
          </a>

          {/* {spec.servers && spec.servers.length > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-[#fffaf0]/10 bg-[#171211] px-3 py-1.5 font-mono text-xs text-[#d7c9b5]">
              <span className="text-[#fffaf0]/60">Host:</span>
              <span className="font-semibold text-[#fffaf0]">
                {spec.servers[0].url}
              </span>
            </div>
          )} */}
        </div>
      </header>

      {/* DASHBOARD CONTAINER */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        {/* COLUMN 1: SIDEBAR (TAG FILTERS, SEARCH, ROUTE LIST) */}
        <aside className="z-10 flex min-h-0 w-full shrink-0 flex-col border-b border-[#fffaf0]/10 bg-[#0b0908] lg:w-[320px] lg:border-r lg:border-b-0">
          {/* TAB SELECTOR */}
          <div className="flex gap-1.5 border-b border-[#fffaf0]/10 p-2">
            <button
              onClick={() => handleTabChange('routes')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 font-mono text-xs tracking-wider uppercase transition-all ${
                activeTab === 'routes'
                  ? 'border-[#b98542]/30 bg-[#171211] text-[#d7b56d] shadow-inner'
                  : 'border-transparent bg-transparent text-[#d7c9b5]/60 hover:bg-[#fffaf0]/5 hover:text-[#fffaf0]'
              }`}
            >
              <IconTerminal size={14} />
              Rotas
            </button>
            <button
              onClick={() => handleTabChange('models')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 font-mono text-xs tracking-wider uppercase transition-all ${
                activeTab === 'models'
                  ? 'border-[#b98542]/30 bg-[#171211] text-[#d7b56d] shadow-inner'
                  : 'border-transparent bg-transparent text-[#d7c9b5]/60 hover:bg-[#fffaf0]/5 hover:text-[#fffaf0]'
              }`}
            >
              <IconDatabase size={14} />
              Modelos
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="relative border-b border-[#fffaf0]/10 p-3">
            <IconSearch
              size={16}
              className="absolute top-1/2 left-6 -translate-y-1/2 text-[#d7c9b5]/40"
            />
            <input
              type="text"
              placeholder={
                activeTab === 'routes'
                  ? 'Buscar rotas (ex: /auth)...'
                  : 'Buscar modelos...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[#fffaf0]/10 bg-[#171211] py-2 pr-4 pl-10 font-mono text-xs text-[#fffaf0] placeholder:text-[#d7c9b5]/30 focus:border-[#b98542]/40 focus:ring-1 focus:ring-[#b98542]/20 focus:outline-none"
            />
          </div>

          {/* ROUTES SECTION */}
          {activeTab === 'routes' && (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* TAG FILTERS LIST */}
              <div className="shrink-0 border-b border-[#fffaf0]/5 p-3">
                <span className="mb-2 block font-mono text-[10px] font-semibold tracking-widest text-[#fffaf0]/30 uppercase">
                  Categorias de Investigação
                </span>
                <div
                  data-lenis-prevent-wheel
                  className="custom-scrollbar flex max-h-[140px] flex-col gap-1 overflow-y-auto pr-1"
                >
                  <button
                    onClick={() => setSelectedTag('')}
                    className={`flex items-center justify-between rounded px-2.5 py-1.5 text-left font-mono text-xs transition-all ${
                      selectedTag === ''
                        ? 'border border-[#d84132]/30 bg-[#d84132]/10 font-semibold text-[#fffaf0]'
                        : 'border border-transparent text-[#d7c9b5]/75 hover:bg-[#fffaf0]/5 hover:text-[#fffaf0]'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <IconFiles
                        size={14}
                        className="shrink-0 text-[#d7b56d]"
                      />
                      <span className="truncate">TODOS OS ARQUIVOS</span>
                    </span>
                    <span className="text-[10px] opacity-55">
                      ({spec.routes.length})
                    </span>
                  </button>
                  {spec.tags?.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => setSelectedTag(tag.name)}
                      className={`flex items-center justify-between rounded px-2.5 py-1.5 text-left font-mono text-xs transition-all ${
                        selectedTag === tag.name
                          ? 'border border-[#d84132]/30 bg-[#d84132]/10 font-semibold text-[#fffaf0]'
                          : 'border border-transparent text-[#d7c9b5]/75 hover:bg-[#fffaf0]/5 hover:text-[#fffaf0]'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <IconFolderOpen
                          size={14}
                          className="shrink-0 text-[#d7c9b5]/70"
                        />
                        <span className="truncate">
                          {tag.name.toUpperCase()}
                        </span>
                      </span>
                      <span className="text-[10px] opacity-55">
                        ({tagCounts[tag.name] || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* LIST OF FILTERED ROUTES */}
              <div
                data-lenis-prevent-wheel
                className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto overscroll-contain bg-[#070605] p-3"
              >
                <span className="mb-1 block font-mono text-[10px] font-semibold tracking-widest text-[#fffaf0]/30 uppercase">
                  Evidências / Endpoints ({filteredRoutes.length})
                </span>
                {filteredRoutes.length === 0 ? (
                  <div className="py-8 text-center font-mono text-xs text-[#d7c9b5]/40 italic">
                    Nenhuma rota encontrada.
                  </div>
                ) : (
                  filteredRoutes.map((route) => (
                    <button
                      key={`${route.method}-${route.path}`}
                      onClick={() => {
                        setSelectedRoute(route)
                        // Smooth scroll to card
                        const el = document.getElementById(
                          `route-${route.method}-${route.path.replace(/\//g, '-')}`,
                        )
                        if (el)
                          el.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          })
                      }}
                      className={`flex w-full flex-col gap-1.5 rounded-md border p-2.5 text-left font-mono text-xs transition-all ${
                        selectedRoute?.path === route.path &&
                        selectedRoute?.method === route.method
                          ? 'translate-x-1 border-[#b98542]/40 bg-[#171211] shadow-md'
                          : 'border-[#fffaf0]/5 bg-[#090807] text-[#d7c9b5] hover:border-[#fffaf0]/15 hover:text-[#fffaf0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex h-5 items-center justify-center rounded border px-1.5 text-[10px] font-bold ${getMethodColorClass(route.method)}`}
                        >
                          {route.method}
                        </span>
                        <span className="truncate text-xs leading-none font-semibold text-[#fffaf0]">
                          {route.path}
                        </span>
                      </div>
                      {route.summary && (
                        <span className="line-clamp-1 block truncate font-sans text-[11px] opacity-60">
                          {route.summary}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* MODELS SECTION */}
          {activeTab === 'models' && (
            <div
              data-lenis-prevent-wheel
              className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto overscroll-contain bg-[#070605] p-3"
            >
              <span className="mb-1 block font-mono text-[10px] font-semibold tracking-widest text-[#fffaf0]/30 uppercase">
                Dicionário de Modelos ({filteredModels.length})
              </span>
              {filteredModels.length === 0 ? (
                <div className="py-8 text-center font-mono text-xs text-[#d7c9b5]/40 italic">
                  Nenhum modelo encontrado.
                </div>
              ) : (
                filteredModels.map(([name, schema]) => (
                  <button
                    key={name}
                    onClick={() => {
                      // Trigger scroll to the schema
                      const el = document.getElementById(`model-${name}`)
                      if (el)
                        el.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                    }}
                    className="flex w-full flex-col gap-1 rounded-md border border-[#fffaf0]/5 bg-[#090807] p-2.5 text-left text-[#d7c9b5] transition-all hover:border-[#b98542]/30 hover:bg-[#171211]/30 hover:text-[#fffaf0]"
                  >
                    <span className="flex min-w-0 items-center gap-2 font-mono text-xs font-semibold text-[#d7b56d]">
                      <IconFileDescription size={14} className="shrink-0" />
                      <span className="truncate">{name}</span>
                    </span>
                    {schema.description && (
                      <span className="line-clamp-1 block font-sans text-[11px] opacity-60">
                        {schema.description}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </aside>

        {/* COLUMN 2: MIDDLE - DETAIL CARDS */}
        <main
          data-lenis-prevent-wheel
          className="custom-scrollbar flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain p-4 sm:p-6"
        >
          {activeTab === 'routes' ? (
            /* ROUTES LIST DETAIL CARDS */
            <>
              {filteredRoutes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#fffaf0]/15 bg-[#171211]/20 py-20 text-center">
                  <IconInfoCircle
                    size={40}
                    className="mb-3 text-[#d7c9b5]/40"
                  />
                  <h3 className="mb-1 font-heading text-lg font-semibold text-[#fffaf0]">
                    Nenhum Dossiê Selecionado
                  </h3>
                  <p className="max-w-sm text-xs text-[#d7c9b5]/60">
                    Ajuste os filtros de busca ou clique em uma das categorias
                    de API no menu lateral para visualizar os arquivos.
                  </p>
                </div>
              ) : (
                filteredRoutes.map((route) => {
                  const hasParams =
                    route.parameters && route.parameters.length > 0
                  const reqBody =
                    route.requestBody?.content?.['application/json']?.schema

                  return (
                    <div
                      key={`${route.method}-${route.path}`}
                      id={`route-${route.method}-${route.path.replace(/\//g, '-')}`}
                      className={`relative overflow-visible rounded-lg border bg-[#171211] p-4 shadow-2xl transition-all duration-300 sm:p-6 ${
                        selectedRoute?.path === route.path &&
                        selectedRoute?.method === route.method
                          ? 'border-[#b98542]/50 shadow-[#b98542]/5'
                          : 'border-[#fffaf0]/10'
                      }`}
                    >
                      {/* DOSSIER HEADER */}
                      <div className="mb-4 border-b border-[#fffaf0]/10 pb-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="min-w-0 truncate font-mono text-[9px] tracking-wider text-[#fffaf0]/25 uppercase">
                            REF: {route.method}-
                            {route.path
                              .slice(1)
                              .replace(/\//g, '_')
                              .toUpperCase()}
                          </span>
                          <button
                            onClick={() => simulateRequest(route)}
                            className="flex shrink-0 items-center gap-1 rounded bg-[#d84132] px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest text-[#fffaf0] uppercase transition-colors hover:bg-[#c8382b]"
                          >
                            <IconPlayerPlay size={10} />
                            Simular
                          </button>
                        </div>
                        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                          <span
                            className={`inline-flex h-6 items-center justify-center rounded border px-2 text-xs font-bold ${getMethodColorClass(route.method)}`}
                          >
                            {route.method}
                          </span>
                          <span className="min-w-0 font-mono text-lg/tight font-bold break-all text-[#fffaf0]">
                            {route.path}
                          </span>
                        </div>
                        {route.summary && (
                          <h3 className="mt-2 font-heading text-sm font-semibold text-[#d7b56d]">
                            {route.summary}
                          </h3>
                        )}
                        {route.description && (
                          <p className="mt-2 font-sans text-xs/relaxed whitespace-pre-line text-[#d7c9b5]">
                            {route.description}
                          </p>
                        )}
                      </div>

                      {/* PARAMETERS SECTION */}
                      {hasParams && (
                        <div className="mb-6">
                          <h4 className="mb-2.5 flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-[#fffaf0]/60 uppercase">
                            <span className="size-1.5 rounded-full bg-[#b98542]" />
                            Parâmetros
                          </h4>
                          <div className="overflow-x-auto rounded-md border border-[#fffaf0]/10">
                            <table className="w-full border-collapse text-left text-xs">
                              <thead>
                                <tr className="border-b border-[#fffaf0]/10 bg-[#0b0908] font-mono text-[#d7c9b5]/60">
                                  <th className="p-2.5">Nome</th>
                                  <th className="p-2.5">Local</th>
                                  <th className="p-2.5">Tipo</th>
                                  <th className="p-2.5">Obrigatório</th>
                                  <th className="p-2.5">Descrição</th>
                                </tr>
                              </thead>
                              <tbody>
                                {route.parameters?.map((param, i) => (
                                  <tr
                                    key={i}
                                    className="border-b border-[#fffaf0]/5 font-mono text-[11px] transition-colors last:border-b-0 hover:bg-[#fffaf0]/2"
                                  >
                                    <td className="p-2.5 font-bold text-[#fffaf0]">
                                      {param.name}
                                    </td>
                                    <td className="p-2.5 text-[#d7c9b5]/80">
                                      {param.in}
                                    </td>
                                    <td className="p-2.5 text-[#d7b56d]">
                                      {param.schema?.type || 'string'}
                                    </td>
                                    <td className="p-2.5">
                                      {param.required ? (
                                        <span className="font-semibold text-[#d84132]">
                                          Sim
                                        </span>
                                      ) : (
                                        <span className="text-[#d7c9b5]/40">
                                          Não
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-2.5 font-sans text-[#d7c9b5]">
                                      {param.description || '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* REQUEST BODY SECTION */}
                      {reqBody && (
                        <div className="mb-6">
                          <h4 className="mb-2 flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-[#fffaf0]/60 uppercase">
                            <span className="size-1.5 rounded-full bg-[#b98542]" />
                            Corpo da Requisição (JSON)
                          </h4>
                          <div className="relative">
                            <pre className="overflow-x-auto rounded-md border border-[#fffaf0]/10 bg-[#0b0908] p-3.5 font-mono text-[11px] leading-relaxed text-[#fffaf0]">
                              {formatMockJson(reqBody)}
                            </pre>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  formatMockJson(reqBody),
                                  `${route.method}-${route.path}-body`,
                                )
                              }
                              className="absolute top-2.5 right-2.5 rounded border border-[#fffaf0]/10 bg-[#171211] p-1.5 text-[#d7c9b5]/80 transition-all hover:border-[#fffaf0]/25 hover:text-[#fffaf0]"
                              title="Copiar JSON"
                            >
                              {copiedText ===
                              `${route.method}-${route.path}-body` ? (
                                <IconCheck
                                  size={13}
                                  className="text-[#8be2a5]"
                                />
                              ) : (
                                <IconCopy size={13} />
                              )}
                            </button>
                          </div>

                          {/* Schema breakdown tree */}
                          <div className="mt-3.5 rounded border border-[#fffaf0]/5 bg-[#0b0908]/40 p-3 font-mono text-[11px]">
                            <div className="mb-2 text-[10px] font-bold tracking-widest text-[#fffaf0]/40 uppercase">
                              Estrutura do Objeto (Schema)
                            </div>
                            <SchemaProperties schema={reqBody} />
                          </div>
                        </div>
                      )}

                      {/* RESPONSES SECTION */}
                      <div>
                        <h4 className="mb-2.5 flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-[#fffaf0]/60 uppercase">
                          <span className="size-1.5 rounded-full bg-[#b98542]" />
                          Respostas
                        </h4>
                        <div className="flex flex-col gap-3">
                          {Object.entries(route.responses).map(
                            ([code, response]) => {
                              const respSchema =
                                response.content?.['application/json']?.schema
                              const statusColor = code.startsWith('2')
                                ? 'text-[#8be2a5]'
                                : 'text-[#fca5a5]'

                              return (
                                <div
                                  key={code}
                                  className="rounded-md border border-[#fffaf0]/5 bg-[#0b0908]/50 p-3.5"
                                >
                                  <div className="mb-2 flex items-center gap-2 border-b border-[#fffaf0]/5 pb-2">
                                    <span
                                      className={`font-mono text-xs font-bold ${statusColor}`}
                                    >
                                      [{code}]
                                    </span>
                                    <span className="font-sans text-[11px] font-semibold text-[#fffaf0]">
                                      {response.description}
                                    </span>
                                  </div>

                                  {respSchema && (
                                    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                                      {/* Mock JSON */}
                                      <div>
                                        <div className="mb-1 font-mono text-[9px] font-semibold tracking-wider text-[#d7c9b5]/40 uppercase">
                                          Exemplo de Resposta JSON
                                        </div>
                                        <div className="relative">
                                          <pre
                                            data-lenis-prevent-wheel
                                            className="custom-scrollbar max-h-[180px] overflow-x-auto rounded border border-[#fffaf0]/10 bg-[#0b0908] p-2.5 font-mono text-[10px] leading-relaxed text-[#fffaf0]"
                                          >
                                            {formatMockJson(respSchema)}
                                          </pre>
                                          <button
                                            onClick={() =>
                                              copyToClipboard(
                                                formatMockJson(respSchema),
                                                `${route.method}-${route.path}-${code}`,
                                              )
                                            }
                                            className="absolute top-1.5 right-1.5 rounded border border-[#fffaf0]/10 bg-[#171211] p-1 text-[#d7c9b5]/70 hover:border-[#fffaf0]/25 hover:text-[#fffaf0]"
                                          >
                                            {copiedText ===
                                            `${route.method}-${route.path}-${code}` ? (
                                              <IconCheck
                                                size={11}
                                                className="text-[#8be2a5]"
                                              />
                                            ) : (
                                              <IconCopy size={11} />
                                            )}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Schema Type info */}
                                      <div>
                                        <div className="mb-1 font-mono text-[9px] font-semibold tracking-wider text-[#d7c9b5]/40 uppercase">
                                          Tipos das Propriedades
                                        </div>
                                        <div
                                          data-lenis-prevent-wheel
                                          className="custom-scrollbar max-h-[180px] overflow-y-auto rounded border border-[#fffaf0]/10 bg-[#0b0908]/80 p-2.5 font-mono text-[10px]"
                                        >
                                          <SchemaProperties
                                            schema={respSchema}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </>
          ) : (
            /* MODELS/SCHEMAS LIST DETAIL CARDS */
            <>
              {filteredModels.length === 0 ? (
                <div className="py-12 text-center font-mono text-xs text-[#d7c9b5]/40 italic">
                  Nenhum modelo encontrado.
                </div>
              ) : (
                filteredModels.map(([name, schema]) => (
                  <div
                    key={name}
                    id={`model-${name}`}
                    className="relative overflow-visible rounded-lg border border-[#fffaf0]/10 bg-[#171211] p-4 shadow-2xl sm:p-6"
                  >
                    <div className="mb-4 border-b border-[#fffaf0]/10 pb-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate font-mono text-[10px] font-semibold tracking-widest text-[#d84132] uppercase">
                          MODELO DE DADOS (SCHEMA)
                        </span>
                        <span className="shrink-0 rounded border border-[#fffaf0]/10 bg-[#0b0908] px-2.5 py-1 font-mono text-[10px] text-[#fffaf0]/45 uppercase">
                          TYPE: {schema.type || 'object'}
                        </span>
                      </div>
                      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                        <IconFileDescription
                          size={18}
                          className="text-[#d7b56d]"
                        />
                        <h2 className="min-w-0 font-mono text-lg/tight font-bold break-all text-[#d7b56d]">
                          {name}
                        </h2>
                      </div>
                    </div>

                    {schema.description && (
                      <p className="mb-5 font-sans text-xs/relaxed text-[#d7c9b5]">
                        {schema.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Schema Property list */}
                      <div>
                        <h3 className="mb-2.5 flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-[#fffaf0]/60 uppercase">
                          <span className="size-1.5 rounded-full bg-[#b98542]" />
                          Propriedades e Tipos
                        </h3>
                        <div
                          data-lenis-prevent-wheel
                          className="custom-scrollbar max-h-[300px] overflow-y-auto rounded-md border border-[#fffaf0]/10 bg-[#0b0908] p-3.5 font-mono text-[11px] leading-relaxed"
                        >
                          <SchemaProperties schema={schema} />
                        </div>
                      </div>

                      {/* Mock JSON */}
                      <div>
                        <h3 className="mb-2.5 flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-[#fffaf0]/60 uppercase">
                          <span className="size-1.5 rounded-full bg-[#b98542]" />
                          Estrutura de Exemplo
                        </h3>
                        <div className="relative">
                          <pre
                            data-lenis-prevent-wheel
                            className="custom-scrollbar max-h-[300px] overflow-x-auto rounded-md border border-[#fffaf0]/10 bg-[#0b0908] p-3.5 font-mono text-[11px] leading-relaxed text-[#fffaf0]"
                          >
                            {formatMockJson(schema)}
                          </pre>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                formatMockJson(schema),
                                `model-json-${name}`,
                              )
                            }
                            className="absolute top-2.5 right-2.5 rounded border border-[#fffaf0]/10 bg-[#171211] p-1.5 text-[#d7c9b5]/80 transition-all hover:border-[#fffaf0]/25 hover:text-[#fffaf0]"
                          >
                            {copiedText === `model-json-${name}` ? (
                              <IconCheck size={13} className="text-[#8be2a5]" />
                            ) : (
                              <IconCopy size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </main>

        {/* COLUMN 3: RIGHT - MOCK CONSOLE TERMINAL (CRT STYLED) */}
        <aside className="z-10 flex min-h-0 w-full shrink-0 flex-col border-t border-[#fffaf0]/10 bg-[#070605] lg:hidden xl:flex xl:w-[420px] xl:border-t-0 xl:border-l">
          <div className="flex shrink-0 items-center justify-between border-b border-[#fffaf0]/10 bg-[#0b0908] p-4">
            <span className="flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider text-[#d7b56d] uppercase">
              <IconTerminal size={14} className="text-[#d7b56d]" />
              Terminal de Análise CRT
            </span>
            <div className="flex gap-1.5">
              <span className="size-2 rounded-full bg-[#d84132]/60" />
              <span className="size-2 rounded-full bg-[#d7b56d]/60" />
              <span className="size-2 rounded-full bg-[#8be2a5]/60" />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
            {/* CRT MONITOR */}
            <div
              data-lenis-prevent-wheel
              className="terminal-crt-container custom-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain rounded-lg border border-[#386b46]/30 p-4 font-mono text-xs/relaxed select-none"
            >
              {/* SCANLINE / GLOW EFFECTS PROVIDED BY terminal-crt-container IN CSS */}
              <div className="flex justify-between border-b border-[#386b46]/20 pb-1.5 text-[10px] font-bold text-[#4ea23e]">
                <span>TRUE CRIME CLUB INTEL SYSTEM</span>
                <span>SECURE_LINK // ACTIVE</span>
              </div>

              {/* Logs */}
              <div className="flex shrink-0 flex-col gap-1.5 font-mono text-[#62d84e]/90">
                {simulatedLogs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {log}
                  </div>
                ))}
              </div>

              {/* Simulated Response JSON */}
              {simulatedResponse && (
                <div className="mt-2 flex min-h-[200px] flex-1 flex-col border-t border-[#386b46]/20 pt-3 text-[#62d84e]">
                  <span className="mb-1 block text-[9px] font-bold text-[#4ea23e]/70 uppercase">
                    [EVIDENCES_RETRIEVED_JSON]
                  </span>
                  <pre
                    data-lenis-prevent-wheel
                    className="custom-scrollbar flex-1 overflow-x-auto font-mono text-[10px] leading-relaxed"
                  >
                    {simulatedResponse}
                  </pre>
                </div>
              )}

              {/* Simulation status */}
              {isSimulating && (
                <div className="mt-2 flex animate-pulse items-center gap-2 font-bold text-[#62d84e]">
                  <span className="inline-block size-2.5 animate-spin rounded-full border-2 border-[#62d84e] border-t-transparent" />
                  AGUARDANDO RETORNO DOS MOCKS DO SERVIDOR...
                </div>
              )}
            </div>

            {/* ACTION BUTTON */}
            {selectedRoute && (
              <div className="mt-4 flex shrink-0 flex-col gap-2">
                <button
                  onClick={() => simulateRequest(selectedRoute)}
                  disabled={isSimulating}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-[#fffaf0]/15 bg-[#d84132]/90 px-4 py-3 font-mono text-xs font-bold tracking-widest text-[#fffaf0] uppercase shadow-lg transition-all hover:bg-[#d84132] active:scale-[0.98] disabled:opacity-50"
                >
                  <IconPlayerPlay size={14} />
                  Simular Requisição
                </button>
                <div className="text-center font-mono text-[10px] text-[#d7c9b5]/40">
                  Isso executa uma chamada simulada com base na especificação.
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

/* Recursive component to render properties of a schema */
function SchemaProperties({
  schema,
  depth = 0,
}: {
  schema: OpenApiSchema | undefined
  depth?: number
}) {
  if (!schema)
    return (
      <div className="font-italic text-gray-500">
        [Sem definição de propriedades]
      </div>
    )

  // If schema is reference/resolves, or has allOf (already handled by getOpenApiSpec merging)
  const properties = schema.properties

  if (schema.type === 'array' && schema.items) {
    return (
      <div className="border-l border-[#fffaf0]/5 py-1 pl-2">
        <span className="text-[#fffaf0]/40">[Array de itens]</span>
        <SchemaProperties schema={schema.items} depth={depth + 1} />
      </div>
    )
  }

  if (!properties || Object.keys(properties).length === 0) {
    return (
      <div className="border-l border-[#fffaf0]/5 pl-2 text-[#d7c9b5]/60 italic">
        Tipo:{' '}
        <span className="font-bold text-[#d7b56d]">{schema.type || 'any'}</span>
        {schema.description && (
          <span className="mt-0.5 block font-sans text-xs text-[#d7c9b5]">
            {schema.description}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(properties).map(([name, prop]) => {
        const isRequired = schema.required?.includes(name)

        return (
          <div
            key={name}
            style={{ paddingLeft: `${depth * 6}px` }}
            className="border-b border-[#fffaf0]/5 pb-1.5 last:border-b-0"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#fffaf0]">
                {name}
              </span>
              {isRequired && (
                <span className="text-[9px] font-bold tracking-tighter text-[#d84132]">
                  *
                </span>
              )}
              <span className="font-mono text-[10px] font-medium text-[#d7c9b5]/40">
                {prop.type || 'string'}
                {prop.format ? `(${prop.format})` : ''}
              </span>
              {prop.enum && (
                <span className="rounded border border-[#d7b56d]/20 bg-[#d7b56d]/5 px-1 text-[9px] text-[#d7b56d]">
                  enum: [{prop.enum.join(', ')}]
                </span>
              )}
            </div>
            {prop.description && (
              <p className="mt-0.5 font-sans text-[10px] leading-relaxed text-[#d7c9b5]/85">
                {prop.description}
              </p>
            )}

            {/* If nested object or array */}
            {(prop.type === 'object' ||
              (prop.type === 'array' && prop.items?.type === 'object')) && (
              <div className="mt-1.5 border-l border-[#b98542]/20 pl-2">
                <SchemaProperties
                  schema={prop.type === 'array' ? prop.items : prop}
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
