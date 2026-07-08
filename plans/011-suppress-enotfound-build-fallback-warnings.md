# Plan 011: Suprimir warnings ENOTFOUND no fallback do build

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 94cc25f..HEAD -- src/lib/domain/repositories.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/007-catalog-plans-closure-and-fallback.md (intenção de fallback silencioso offline)
- **Category**: dx
- **Planned at**: commit `94cc25f`, 2026-07-08

## Why this matters

O Plano 007 introduziu fallback silencioso para `ECONNREFUSED` quando a API está configurada mas indisponível (build sem backend, dev offline). Com `NEXT_PUBLIC_API_BASE_URL` apontando para um host inacessível, o `fetch` do Node falha com `ENOTFOUND` (DNS) em vez de `ECONNREFUSED`. O helper atual não reconhece esse caso, então o build imprime dezenas de linhas `API * error, falling back to local mocks` — ruído que mascara erros reais e contradiz a intenção do 007.

Após este plano, falhas de conectividade esperadas (offline/build) continuam caindo no mock sem log; falhas de API com resposta HTTP ou erros de negócio continuam logando.

## Current state

- `src/lib/domain/repositories.ts:62-74` — `isConnectionRefused()` cobre apenas `ECONNREFUSED` na cadeia de erro.
- ~28 blocos `catch` usam `if (!isConnectionRefused(e)) { console.warn(...) }` antes do fallback mock.
- `isLocalMockMode()` já existe em `repositories.ts:76-83`, mas várias funções ainda duplicam a mesma expressão inline — **não refatorar isso neste plano** (fora de escopo).
- `.env.local` define `NEXT_PUBLIC_API_BASE_URL` (host remoto). Em build offline, `isLocalMockMode()` é `false` → tenta API → `ENOTFOUND` → loga warning.
- Exemplo de saída atual no build (host inacessível):

```
API getCart error, falling back to local mocks: [TypeError: fetch failed] {
  [cause]: Error: getaddrinfo ENOTFOUND ...
}
```

- Commit anterior relacionado: `bdce94e` adicionou `isConnectionRefused` — este plano estende o mesmo padrão.

### Padrão existente a preservar

```typescript
} catch (e) {
  if (!isConnectionRefused(e)) {
    console.warn('API listProducts error, falling back to local mocks:', e)
  }
}
```

Substituir a condição, não remover o `console.warn` para erros inesperados.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Typecheck | `pnpm typecheck` | exit 0 |
| Build     | `pnpm build` | exit 0 |
| Contagem de warnings | `pnpm build 2>&1 \| rg -c "API .* error, falling back"` | `0` com API offline/inacessível |

## Scope

**In scope**:
- `src/lib/domain/repositories.ts`

**Out of scope**:
- Mudar lógica de fallback (continua API-first → mock).
- Alterar `api-client.ts`, `route.ts`, páginas ou `docs/openapi.yaml`.
- Refatorar duplicação de `isLocalMockMode` inline.
- Mudar `.env.local` ou documentação de deploy.
- Adicionar testes automatizados (repo não tem suite de testes para esta camada).

## Git workflow

- Branch: `advisor/011-enotfound-fallback`
- Commit: estilo do repo — ex. `feat: suppress ENOTFOUND fallback warnings during offline build`
- Não fazer push/PR a menos que o operador peça.

## Steps

### Step 1: Generalizar detecção de erro offline

Em `src/lib/domain/repositories.ts`, substituir `isConnectionRefused` por um helper mais amplo. Nome sugerido: `isExpectedOfflineFetchError`.

O helper deve retornar `true` quando o erro indica indisponibilidade de rede/host (não erro HTTP de negócio). Cobrir pelo menos:

| Código / condição | Contexto |
|-------------------|----------|
| `ECONNREFUSED` | API local não rodando |
| `ENOTFOUND` | DNS/host inacessível (caso atual do build) |
| `EAI_AGAIN` | DNS temporário |
| `ETIMEDOUT` | timeout de conexão |
| `ENETUNREACH` | rede inacessível |
| `UND_ERR_CONNECT_TIMEOUT` | undici (fetch do Node) |
| `fetch failed` na mensagem **com** `cause` offline acima | wrapper TypeError do fetch |

Implementação sugerida — percorrer `error` e `error.cause` (e `error.cause.errors` se array), checando `code` e mensagem:

```typescript
const OFFLINE_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ETIMEDOUT',
  'ENETUNREACH',
  'UND_ERR_CONNECT_TIMEOUT',
])

function getErrorChain(error: unknown): unknown[] {
  const chain: unknown[] = []
  let current: unknown = error
  const seen = new Set<unknown>()
  while (current && !seen.has(current)) {
    seen.add(current)
    chain.push(current)
    if (typeof current === 'object' && current !== null) {
      const node = current as { cause?: unknown; errors?: unknown[] }
      if (Array.isArray(node.errors)) {
        chain.push(...node.errors)
      }
      current = node.cause
      continue
    }
    break
  }
  return chain
}

function isExpectedOfflineFetchError(error: unknown): boolean {
  return getErrorChain(error).some((node) => {
    if (!node || typeof node !== 'object') return false
    const record = node as { code?: string; message?: string }
    if (record.code && OFFLINE_ERROR_CODES.has(record.code)) return true
    const msg = String(record.message ?? '')
    return msg.includes('ECONNREFUSED') || msg.includes('ENOTFOUND')
  })
}
```

Manter `isConnectionRefused` como alias deprecated **ou** remover e atualizar todos os call sites — preferir renomear direto para evitar dois helpers.

**Verify**: `pnpm typecheck` → exit 0

### Step 2: Atualizar todos os call sites

Substituir cada `if (!isConnectionRefused(...))` por `if (!isExpectedOfflineFetchError(...))` em `repositories.ts`.

Há ~28 ocorrências. Não alterar a mensagem do `console.warn` nem a lógica de fallback após o catch.

**Verify**: `rg "isConnectionRefused" src/lib/domain/repositories.ts` → 0 matches

### Step 3: Validar build silencioso offline

Com o `.env.local` atual (API remota configurada mas inacessível no ambiente de build):

```bash
pnpm build 2>&1 | rg "API .* error, falling back" || true
```

Esperado: **nenhuma linha** de output.

Confirmar que o build ainda completa:

```bash
pnpm build 2>&1 | tail -5
```

Esperado: exit 0, rotas geradas.

**Verify**: contagem de warnings = 0; build exit 0

### Step 4: Sanity check — erro inesperado ainda loga

Garantir que erros HTTP (ex. API retorna 500 e `apiClient` lança `Error` com mensagem de status) **não** são engolidos.

Leitura de código: `api-client.ts` lança `new Error(errorData.mensagem || 'Erro na requisição: ${response.status}')` — isso não tem `code` offline, então `isExpectedOfflineFetchError` deve retornar `false` e o `console.warn` deve permanecer.

Se após implementação um 500 for silenciado, **STOP** — ajustar o helper para não tratar mensagens HTTP como offline.

**Verify**: revisão manual do helper contra o throw de `api-client.ts:61-66` — confirmar que status HTTP não entra nos códigos offline.

## Test plan

Repo sem testes unitários para `repositories.ts`. Validação por comandos:

1. Build offline (Step 3) — regressão principal.
2. `pnpm typecheck` — sem quebra de tipos.
3. Revisão estática: helper não inclui strings como `Erro na requisição: 500`.

## Done criteria

- [ ] `pnpm typecheck` exit 0
- [ ] `pnpm build` exit 0
- [ ] `pnpm build 2>&1 | rg -c "API .* error, falling back"` retorna `0` com API inacessível
- [ ] `rg "isConnectionRefused" src/` retorna 0 matches (ou só comentário de histórico — preferir 0)
- [ ] Apenas `src/lib/domain/repositories.ts` modificado
- [ ] `plans/README.md` status do 011 atualizado para DONE

## STOP conditions

- Se suprimir warnings também silenciar erros HTTP 4xx/5xx reais, pare e reporte — não shippar.
- Se for necessário alterar `api-client.ts` para distinguir erros, pare — escopo é só `repositories.ts`; proponha plano separado.
- Se `.env.local` não existir no worktree do executor, usar `NEXT_PUBLIC_API_BASE_URL=https://host-inexistente.invalid/api` inline no comando de build para simular ENOTFOUND.

## Maintenance note

Novos wrappers API-first em `repositories.ts` devem usar `isExpectedOfflineFetchError` no catch, não `isConnectionRefused`. Em review, qualquer `console.warn` de fallback sem essa guarda é regressão do 007/011.
