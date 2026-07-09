# Plano 012: Conectar endpoints API restantes e tornar mocks locais explícitos

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report; do not improvise. When done, update the status row for this plan in
> `plans/README.md` unless a reviewer tells you they maintain the index.
>
> **Drift check (run first)**:
>
> ```bash
> git diff --stat c8649f9..HEAD -- docs/openapi.yaml src/lib/api-client.ts src/lib/domain/repositories.ts src/lib/domain/types.ts src/lib/domain/mock-data.ts src/app/api/[...rota]/route.ts src/app/casos/page.tsx src/app/'(cliente)'/cliente/cartoes/page.tsx src/app/'(cliente)'/cliente/financeiro/atualizar-cartao/page.tsx src/app/'(front-office)'/faq/page.tsx src/app/'(front-office)'/_landing src/app/'(front-office)'/page.tsx src/app/'(front-office)'/'[...slug]'/page.tsx package.json README.md
> ```
>
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts below against the live code before proceeding. On a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/007-catalog-plans-closure-and-fallback.md, plans/010-public-api-customer-area-integration.md, plans/011-suppress-enotfound-build-fallback-warnings.md
- **Category**: migration / tech-debt
- **Planned at**: commit `c8649f9`, 2026-07-08

## Why this matters

The project has moved most front-office journeys to API-shaped contracts, but
several screens still use data or mutations that exist only in React state or
local repository mocks. At the same time, repositories silently fall back to
local data whenever `NEXT_PUBLIC_API_BASE_URL` is missing or an API request
fails, which can hide integration regressions in production-like environments.
This plan closes the remaining API gaps for investigation files, cards, and
CMS-backed FAQ/home content, then makes mock mode an explicit opt-in instead of
the default behavior.

## Current state

- `package.json` defines `dev`, `build`, `lint`, `lint:fix`, `format`, and
  `typecheck`; there is no test script.
- `README.md` says the frontend currently validates the journey "com dados
  mockados" and specifically instructs agents to read local Next docs before API
  or route convention changes.
- Plans 001–011 in `plans/` delivered the API integration arc; this plan is the
  next step: close remaining endpoint gaps and remove implicit fallback.
- Next.js version is `16.2.10`; route handlers use async `params` and async
  `cookies()`. Before editing `src/app/api/[...rota]/route.ts`, read
  `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
  and `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`.

Relevant current-state excerpts:

```ts
// src/lib/domain/repositories.ts:101
function isLocalMockMode(): boolean {
  return (
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'
  )
}
```

```ts
// src/lib/domain/repositories.ts:136
const isLocalMockMode =
  !process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
  process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
  process.env.LOCAL_MOCK_MODE === 'true'

if (!isLocalMockMode) {
  try {
    const apiProducts = await apiClient.products.list({
      featured: options?.featured,
      category: options?.category,
    })
    return apiProducts.map(mapApiProductToDomain)
  } catch (e) {
    if (!isExpectedOfflineFetchError(e)) {
      console.warn('API listProducts error, falling back to local mocks:', e)
    }
  }
}
```

```ts
// src/lib/api-client.ts:47
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
```

```ts
// src/lib/api-client.ts:357
cases: {
  getData: () => fetcher('/casos'),
},
```

```ts
// src/app/api/[...rota]/route.ts:819
if (method === 'GET' && path === 'casos') {
  const activeCase = getActiveCaseMock()
  const progress = getSubscriberProgressMock()
  return json({
    casoAtivo: activeCase ? toCase(activeCase) : null,
    progresso: progress ? toProgress(progress) : null,
    pistas: listCluesMock().map(toClue),
  })
}
```

```tsx
// src/app/casos/page.tsx:46
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
```

```tsx
// src/app/casos/page.tsx:363
const currentFiles = mockFilesByBox[selectedBox]?.[selectedCategory] || []
const allBoxes = Array.from({ length: 12 }, (_, i) => i + 1)
```

```tsx
// src/app/(cliente)/cliente/cartoes/page.tsx:47
const handleAddCard = (e: React.FormEvent) => {
  e.preventDefault()
  if (!cardNumber || !holderName || !cvc) return

  const lastFour = cardNumber.replace(/\s+/g, '').slice(-4)
  // Detect brand based on first digit (simplistic mock)
  const brand = cardNumber.startsWith('5') ? 'Mastercard' : 'Visa'

  const newCard: PaymentMethod = {
    id: `pm-${Date.now()}`,
    type: 'credit_card',
    label: `${brand} terminando em ${lastFour}`,
    lastFour,
    brand,
    isDefault: cards.length === 0,
  }

  setCards([...cards, newCard])
```

```tsx
// src/app/(cliente)/cliente/cartoes/page.tsx:75
const handleDeleteCard = (id: string) => {
  setCards(cards.filter((card) => card.id !== id))
}
```

```tsx
// src/app/(cliente)/cliente/financeiro/atualizar-cartao/page.tsx:37
<p className="mt-2 text-sm/6 text-(--ink-mute)">
  Formulário mockado — dados não são enviados a nenhum gateway.
</p>
```

```tsx
// src/app/(front-office)/faq/page.tsx:31
const faqItems = [
  {
    code: 'FAQ-01',
    question: 'O que é o True Crime Club?',
    answer:
      'Um clube de assinatura que envia mensalmente uma box temática de true crime com curadoria exclusiva e conteúdo gamificado.',
  },
```

```tsx
// src/app/(front-office)/page.tsx:25
export default async function HomePage() {
  const page = await getCmsPageByRoute('/')
  if (!page) {
    notFound()
  }

  return <Landing page={page} />
}
```

```ts
// src/lib/domain/types.ts:78
export type PaymentMethodType = 'credit_card' | 'pix'

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  label: string
  lastFour?: string
  brand?: string
  isDefault: boolean
}
```

```ts
// src/lib/domain/types.ts:201
export interface ExclusiveContent {
  id: string
  slug: string
  title: string
  description: string
  status: ContentStatus
  cycleNumber: number
  releaseCycle?: number
  blockedReason?: string
  type: 'clue' | 'video' | 'document' | 'article'
  files?: CaseFile[]
}
```

```yaml
# docs/openapi.yaml:788
/cliente/cartao:
  post:
    tags:
      - Cliente & Painel
    summary: Atualizar cartão padrão do cliente
```

## Commands you will need

This repo may not have `node` on the default PATH in Codex. Use the explicit
PATH prefix below when needed.

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm typecheck` | exit 0, no TypeScript errors |
| Build | `PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH NEXT_PUBLIC_LOCAL_MOCK=true pnpm build` | exit 0 |
| OpenAPI parse | `/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "const fs=require('fs'); const yaml=require('js-yaml'); yaml.load(fs.readFileSync('docs/openapi.yaml','utf8')); console.log('openapi yaml ok')"` | prints `openapi yaml ok` |
| Lint awareness | `PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm lint` | currently may fail on pre-existing `no-explicit-any`; do not make it worse |

There is no test command in `package.json`; do not add a test runner in this
plan. Use typecheck, build, OpenAPI parse, and API smoke checks.

## Scope

**In scope**:

- `docs/openapi.yaml`
- `README.md`
- `.env.example` (create if still absent)
- `src/lib/api-client.ts`
- `src/lib/domain/types.ts`
- `src/lib/domain/mock-data.ts`
- `src/lib/domain/repositories.ts`
- `src/app/api/[...rota]/route.ts`
- `src/app/casos/page.tsx`
- `src/app/(cliente)/cliente/cartoes/page.tsx`
- `src/app/(cliente)/cliente/financeiro/atualizar-cartao/page.tsx`
- `src/app/(front-office)/faq/page.tsx`
- `src/app/(front-office)/page.tsx`
- `src/app/(front-office)/[...slug]/page.tsx`
- `src/app/(front-office)/_landing/*` only if needed to reuse `PageRenderer` or CMS section rendering

**Out of scope**:

- Do not modify files under `src/app/(design-sugerido)/`.
- Do not integrate a real payment gateway SDK. Use a token field in the app API
  contract and keep gateway integration as a backend responsibility.
- Do not remove the internal mock route handler at `src/app/api/[...rota]/route.ts`;
  it remains useful for explicit local mock mode.
- Do not add a new testing framework or large architectural rewrite.
- Do not change public visual design except removing copy that falsely says a
  connected flow is mock-only.

## Git workflow

- Branch: `plan/012-connect-api-endpoints-remove-fallback`
- Commit style in recent history uses conventional prefixes, e.g.
  `feat(cliente): implement customer registration and profile retrieval endpoints`.
- Suggested commits:
  - `feat(api): document remaining customer and investigation endpoints`
  - `feat(cliente): connect cards and investigation files to api`
  - `refactor(api): make local mocks explicit`

## Steps

### Step 1: Make mock/API mode explicit

Create a small environment helper, preferably `src/lib/api-mode.ts`, so all
repositories and the HTTP client share the same rules:

- `isExplicitLocalMockMode()` returns `true` only when
  `NEXT_PUBLIC_LOCAL_MOCK === 'true'`, `NEXT_PUBLIC_MOCK_MODE === 'true'`, or
  `LOCAL_MOCK_MODE === 'true'`.
- `getApiBaseUrl()` returns `NEXT_PUBLIC_API_BASE_URL` when present.
- If local mock mode is explicit, `getApiBaseUrl()` may return `/api` for
  browser-only calls and repository functions may use local mock data directly.
- If neither explicit local mock mode nor `NEXT_PUBLIC_API_BASE_URL` is present,
  throw an error with this exact intent: "API base URL is required unless local
  mock mode is explicitly enabled."
- Remove `!process.env.NEXT_PUBLIC_API_BASE_URL` from mock-mode checks.

Update `src/lib/api-client.ts` so `fetcher()` no longer silently defaults to
`/api` unless explicit local mock mode is enabled. Update
`src/lib/domain/repositories.ts` so failed API calls throw in API mode instead
of falling back to local mocks. Local mocks are allowed only behind explicit
mock mode.

Do not do this with a broad regex-only rewrite. Some functions use inline
`const isLocalMockMode = ...`; others call `isLocalMockMode()`. Convert both
patterns deliberately.

Add `.env.example` if absent:

```dotenv
# Use the real backend/API.
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Opt into local repository/proxy mocks instead of the real backend.
# NEXT_PUBLIC_LOCAL_MOCK=true

# Optional CMS delivery backend for published CMS pages.
# CMS_DELIVERY_BASE_URL=http://localhost:8000/api
```

Update `README.md` development notes with the same rule: API mode requires
`NEXT_PUBLIC_API_BASE_URL`; mock mode must be explicitly enabled.

**Verify**:

```bash
rg -n "!process\\.env\\.NEXT_PUBLIC_API_BASE_URL|falling back to local mocks|process\\.env\\.NEXT_PUBLIC_API_BASE_URL \\|\\| '/api'" src/lib src/app
```

Expected: no matches in production repository/API path code. Matches in old
plans or docs are acceptable, but not under `src/lib` or `src/app`.

Then run:

```bash
PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm typecheck
```

Expected: exit 0.

### Step 2: Add the missing OpenAPI contracts

Update `docs/openapi.yaml` with these endpoints and schemas, matching the
existing Portuguese naming style:

- `GET /casos/arquivos`
  - Tag: `Conteúdo & Investigação`
  - Summary: listar arquivos/documentos da experiência investigativa por box.
  - Response shape should be grouped by box id:

```json
{
  "boxes": [
    {
      "id": "box-4",
      "arquivos": [],
      "documentos": []
    }
  ]
}
```

- `GET /cliente/cartoes`
  - Returns an array of `MetodoPagamento` filtered to `cartao_credito`.
- `POST /cliente/cartoes`
  - Creates a new card/payment method from a gateway token.
  - Request body should require `token`, `nomeImpresso`, `ultimosQuatro`, and
    `bandeira`.
  - Response `201` returns `MetodoPagamento`.
- `DELETE /cliente/cartoes/{id}`
  - Removes a saved card/payment method.
  - Response returns `{ sucesso: true }` or the updated array; choose one and
    keep `apiClient`/mock consistent.
- Update `POST /cliente/cartao` so `token` is no longer described as
  mock/future only. It should update the default card using a gateway token.

Add component schemas as needed:

- `ArquivoCasoInvestigativo` with fields corresponding to the current
  `CasoFile` interface in `src/app/casos/page.tsx`: `id`, `nome`, `tipo`,
  `modificadoEm`, `tamanho`, `urlDownload`, `conteudo`, `corrompido`,
  `colunas`, `linhas`, `fragmento`.
- `ArquivosCasoPorBox` with `id`, `arquivos`, and `documentos`.

Do not add a new FAQ endpoint. The API already has `GET /paginas`; FAQ/home
should use CMS page delivery where possible.

**Verify**:

```bash
/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "const fs=require('fs'); const yaml=require('js-yaml'); yaml.load(fs.readFileSync('docs/openapi.yaml','utf8')); console.log('openapi yaml ok')"
```

Expected: `openapi yaml ok`.

Also run:

```bash
rg -n "/casos/arquivos|/cliente/cartoes|ArquivoCasoInvestigativo|ArquivosCasoPorBox" docs/openapi.yaml
```

Expected: matches for every new path and schema.

### Step 3: Add domain and API-client support

In `src/lib/domain/types.ts`, add types for investigation files that match the
current `/casos` component fields. Use English domain names for TypeScript, as
the repo already does (`Customer`, `PaymentMethod`, `ExclusiveContent`), and
Portuguese names only in API payload mapping:

```ts
export type InvestigationFileType = 'audio' | 'image' | 'text' | 'sheet'

export interface InvestigationFile {
  id: string
  name: string
  type: InvestigationFileType
  modified: string
  size: string
  downloadUrl?: string
  content?: string
  corrupted?: boolean
  columns?: string[]
  rows?: string[][]
  fragment?: string
}

export interface InvestigationFilesByBox {
  id: string
  arquivos: InvestigationFile[]
  documentos: InvestigationFile[]
}
```

Move the data currently inline in `src/app/casos/page.tsx` into
`src/lib/domain/mock-data.ts` as mock investigation file data. This keeps local
mock mode centralized with the rest of the mock domain data.

In `src/lib/api-client.ts`:

- Add mappers between API payload (`nome`, `tipo`, `modificadoEm`, etc.) and
  `InvestigationFile`.
- Add `apiClient.cases.listFiles()` for `GET /casos/arquivos`.
- Add `apiClient.customer.listCards()`, `addCard()`, and `deleteCard()`.
- Update `apiClient.customer.updateCard()` to send `token` as well as display
  metadata.

In `src/lib/domain/repositories.ts`:

- Add `listInvestigationFilesByBox()`.
- Add `listCards()`, `addCard()`, and `deleteCard()`.
- Make `listPaymentMethodsMock()` use mutable payment-method state rather than
  returning the imported `mockPaymentMethods` directly. The mock route needs to
  reflect card creation/deletion during explicit local mock mode.
- Keep existing fallback behavior only when explicit local mock mode is enabled.

Payment safety boundary:

- Do not send raw full card number or CVC to the app API.
- The frontend may derive `lastFour` and `brand` for display, but the backend
  contract should receive a `token` from a gateway. In local mock mode, use a
  synthetic token such as `mock-card-token-${lastFour}`; in real API mode, if no
  tokenization mechanism exists, STOP and report instead of sending PAN/CVC.

**Verify**:

```bash
PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm typecheck
```

Expected: exit 0.

Then run:

```bash
rg -n "cardNumber.*JSON|cvc.*JSON|numeroCartao|codigoSeguranca" src/lib src/app
```

Expected: no matches indicating raw card number/CVC is sent to the app API.

### Step 4: Implement the mock/proxy endpoints

Update `src/app/api/[...rota]/route.ts` to emulate the new API endpoints in
explicit local mock mode:

- `GET casos/arquivos` returns the grouped investigation files from
  `src/lib/domain/mock-data.ts`.
- `GET cliente/cartoes` returns credit-card payment methods only.
- `POST cliente/cartoes` validates `token`, `nomeImpresso`, `ultimosQuatro`,
  and `bandeira`, then returns a created `MetodoPagamento` with status `201`.
- `DELETE cliente/cartoes/{id}` removes the card and returns the response shape
  chosen in Step 2.
- `POST cliente/cartao` accepts `token` and updates the default card. Preserve
  the current route path because it is already documented and consumed.

Follow the existing route-handler style:

- Keep the `handlePtBrApi()` central dispatcher.
- Use `await params` and `await cookies()` as currently done.
- Use `json()` and `error()` helpers.
- Use Portuguese API payload keys.

**Verify**:

```bash
PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm typecheck
```

Expected: exit 0.

If you can run a dev server, do a smoke check in explicit mock mode:

```bash
NEXT_PUBLIC_LOCAL_MOCK=true pnpm dev
```

Expected: server starts. In another shell:

```bash
curl -s http://localhost:3000/api/casos/arquivos | head
curl -s http://localhost:3000/api/cliente/cartoes | head
```

Expected: JSON responses, not 404. If the dev server uses a different port,
adapt only the port.

### Step 5: Connect `/casos` to the API

Update `src/app/casos/page.tsx`:

- Remove the inline `mockFilesByBox` constant.
- Replace the local `CasoFile` interface with the shared type from
  `src/lib/domain/types.ts`.
- After `apiClient.auth.me()` succeeds, load investigation files from
  `apiClient.cases.listFiles()` or a repository helper that is safe for client
  use.
- Store the grouped result in component state.
- Render loading and empty states for file data separately from auth loading.
- Keep `handleRecoverAudio()` local; it is UI interaction state, not backend
  data.
- Keep current visual behavior and CRT style.

The line currently selecting files is:

```tsx
// src/app/casos/page.tsx:363
const currentFiles = mockFilesByBox[selectedBox]?.[selectedCategory] || []
```

After the change, this should read from API-loaded state, for example:

```tsx
const currentFiles = filesByBox[selectedBox]?.[selectedCategory] ?? []
```

**Verify**:

```bash
rg -n "mockFilesByBox|Mock Files mapped by Box" src/app/casos/page.tsx
```

Expected: no matches.

Then:

```bash
PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm typecheck
```

Expected: exit 0.

### Step 6: Connect card management screens to the API

Update `src/app/(cliente)/cliente/cartoes/page.tsx`:

- Use a single import from React, e.g. `import { useEffect, useState } from 'react'`.
- Replace local-only `handleAddCard()` with an async call to
  `apiClient.customer.addCard()` or `addCard()` repository wrapper.
- Replace local-only `handleDeleteCard()` with an async call to
  `apiClient.customer.deleteCard()` or repository wrapper.
- Add submitting/deleting/error state so the UI does not double-submit or hide
  backend failures.
- Do not send raw card number or CVC to the API. Derive `lastFour` and `brand`,
  then pass a token. Use a synthetic token only in explicit local mock mode.

Update `src/app/(cliente)/cliente/financeiro/atualizar-cartao/page.tsx`:

- Update the copy so it no longer says the form is mock-only when wired to API.
- Add a `token` field to the server action payload. If the real gateway token is
  not available yet, use a mock token only when explicit local mock mode is on.
- Preserve the existing server action pattern with `'use server'`.

**Verify**:

```bash
rg -n "setCards\\(\\[\\.\\.\\.cards|setCards\\(cards\\.filter|mockado|mock\\)" src/app/'(cliente)'/cliente/cartoes/page.tsx src/app/'(cliente)'/cliente/financeiro/atualizar-cartao/page.tsx
```

Expected: no local-only card mutations and no user-facing "mock" copy in these
two files. Internal comments about explicit local mock mode are acceptable if
they do not describe the user-facing flow as fake.

Then:

```bash
PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm typecheck
```

Expected: exit 0.

### Step 7: Connect FAQ/home editorial content to CMS delivery

Home already calls `getCmsPageByRoute('/')`; catch-all CMS pages call
`getCmsPageByRoute(routePath)`. FAQ is a reserved route and currently uses a
hardcoded `faqItems` array plus `getDynamicContent('faq.intro')`.

Update `src/app/(front-office)/faq/page.tsx` so API mode uses CMS delivery:

- Make `FaqPage` async.
- Fetch `const page = await getCmsPageByRoute('/faq')`.
- If the page exists and `page.status === 'publicada'`, render its `faq`
  section(s) through the same `PageRenderer`/section patterns used by
  `src/app/(front-office)/[...slug]/page.tsx`.
- If explicit local mock mode is enabled, the current local FAQ copy may remain
  as the mock fallback.
- If API mode is active and `/faq` is missing from CMS, fail loudly with
  `notFound()` or a thrown configuration/content error; do not silently render
  hardcoded FAQ.
- Build `FAQPage` JSON-LD from CMS FAQ items when CMS content is present.

Do not fully redesign the FAQ page. This is an integration plan, not a visual
redesign.

For the landing/home static arrays in `src/app/(front-office)/_landing/content.ts`,
do not try to eliminate every array in this plan. Only remove arrays that
duplicate CMS data already present in `PaginaCms.sections`. Record any remaining
static editorial arrays as follow-up in the PR description.

**Verify**:

```bash
rg -n "const faqItems|getDynamicContent\\('faq\\.intro'\\)|Cartão de crédito e Pix \\(mockados" src/app/'(front-office)'/faq/page.tsx
```

Expected: no matches in API-connected FAQ path. A local mock fallback block is
acceptable only if guarded by explicit local mock mode.

Then:

```bash
PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm typecheck
```

Expected: exit 0.

### Step 8: Final verification and cleanup

Run the full verification set:

```bash
/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "const fs=require('fs'); const yaml=require('js-yaml'); yaml.load(fs.readFileSync('docs/openapi.yaml','utf8')); console.log('openapi yaml ok')"
```

Expected: `openapi yaml ok`.

```bash
PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm typecheck
```

Expected: exit 0.

```bash
PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH NEXT_PUBLIC_LOCAL_MOCK=true pnpm build
```

Expected: exit 0.

```bash
rg -n "falling back to local mocks|!process\\.env\\.NEXT_PUBLIC_API_BASE_URL|mockFilesByBox|setCards\\(\\[\\.\\.\\.cards|setCards\\(cards\\.filter|Formulário mockado|\\(mock\\)" src/lib src/app --glob '!src/app/(design-sugerido)/**'
```

Expected: no matches except references that are clearly inside explicit local
mock support, mock route implementation, or non-user-facing scenario tooling.

Run lint:

```bash
PATH=/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/eduardo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH pnpm lint
```

Expected: ideally exit 0. If it fails only on pre-existing `no-explicit-any`
findings outside files changed by this plan, record the exact failures in the
handoff. If it fails inside files changed by this plan, fix those failures.

## Test plan

There is no test runner configured. Use these characterization checks instead:

- OpenAPI YAML parse passes after adding schemas and endpoints.
- TypeScript passes after every API-client/repository/UI step.
- Explicit mock build passes with `NEXT_PUBLIC_LOCAL_MOCK=true`.
- API smoke checks against the local route handler return JSON for:
  - `GET /api/casos/arquivos`
  - `GET /api/cliente/cartoes`
  - `POST /api/cliente/cartoes`
  - `DELETE /api/cliente/cartoes/{id}`
- Search checks confirm local-only UI mocks have been removed from `/casos` and
  card screens.
- Search checks confirm automatic fallback on missing API base URL has been
  removed from `src/lib` and `src/app`.

## Done criteria

All must hold:

- [ ] `docs/openapi.yaml` documents `GET /casos/arquivos`, `GET /cliente/cartoes`, `POST /cliente/cartoes`, and `DELETE /cliente/cartoes/{id}`.
- [ ] `POST /cliente/cartao` OpenAPI request body requires/uses `token` as an active gateway token field.
- [ ] `.env.example` documents real API mode and explicit local mock mode.
- [ ] `src/lib/api-client.ts` refuses to silently use `/api` unless explicit local mock mode is enabled.
- [ ] `src/lib/domain/repositories.ts` no longer falls back to local mocks after API errors unless explicit local mock mode is enabled.
- [ ] `/casos` no longer contains inline investigation file data and loads files from API/client/repository state.
- [ ] `/cliente/cartoes` add/delete operations call API methods and do not mutate React state as the source of truth.
- [ ] Card add/update flows do not send raw full card number or CVC to the app API.
- [ ] `/faq` uses CMS delivery in API mode and only uses local hardcoded FAQ under explicit mock mode.
- [ ] OpenAPI parse command exits 0.
- [ ] `pnpm typecheck` exits 0.
- [ ] `NEXT_PUBLIC_LOCAL_MOCK=true pnpm build` exits 0.
- [ ] No files outside the in-scope list are modified.
- [ ] `plans/README.md` status row is updated.

## STOP conditions

Stop and report back if:

- The code at the cited "Current state" excerpts does not match live code after
  the drift check.
- The backend team has already chosen different endpoint paths for investigation
  files or cards. Do not invent adapters for a different contract without
  confirmation.
- The card flow cannot obtain a token and would require sending raw card number
  or CVC to the app API.
- Removing automatic fallback breaks build in a way that cannot be solved with
  explicit `NEXT_PUBLIC_LOCAL_MOCK=true` or real `NEXT_PUBLIC_API_BASE_URL`.
- `getCmsPageByRoute('/faq')` cannot represent the current FAQ content and no
  CMS section shape exists to express FAQ items.
- A step's verification fails twice after reasonable correction.

## Maintenance notes

- This plan intentionally leaves the internal Next mock API route in place for
  explicit local mock mode. Future cleanup should delete or isolate it only
  after the real backend is reliable in all dev/test environments.
- Once a real payment gateway is selected, replace synthetic local tokens with
  the gateway's tokenization flow. Reviewers should reject any PR that sends
  full card number or CVC to this app's API.
- The repository currently has repeated API-mode checks. A future follow-up can
  reduce duplication further after this migration stabilizes.
- `pnpm lint` has had pre-existing `no-explicit-any` failures in earlier runs;
  do not use those legacy findings to expand this plan, but do fix lint errors
  introduced in touched files.
