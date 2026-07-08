# Plano 010: Integração Pública da Área do Cliente

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `plans/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 26db9e3..HEAD -- src/lib/api-client.ts src/lib/domain/repositories.ts src/lib/server/customer.ts src/app/(auth) src/app/(cliente) docs/openapi.yaml`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/009-public-api-checkout-integration.md
- **Category**: direction
- **Planned at**: commit `26db9e3`, 2026-07-08
- **Progress**: DONE — merge `26db9e3`; Subfatias A/B/C1/C2/C3/D concluídas

## Objetivo

Migrar a área do cliente para a API pública, preservando mocks locais enquanto a API não estiver publicada e deixando claro o limite da autenticação mockada.

## Current state

### Já migrado em `26db9e3` (não refazer)

- `src/lib/server/customer.ts` — reexporta funções API-first de `repositories.ts`.
- `src/lib/domain/repositories.ts` — `getCustomerProfile`, `updateCustomerProfile`, `addCustomerAddress`, `deleteCustomerAddress`, `listOrders`, `getOrderById`, `getSubscription`, `cancelSubscription`, `reactivateSubscription`, `listExclusiveContent`, `getActiveCase`, `listClues`, `getSubscriberProgress` API-first com fallback mock.
- `src/app/api/[...rota]/route.ts` — handler mock usa helpers `*Mock` (evita recursão com wrappers API-first).
- Telas migradas: `/cliente/pedidos/[id]`, `/cliente/assinatura`, `/cliente/assinatura/cancelar`, `/cliente/conteudos`, `/cliente/conteudos/[slug]`.
- `docs/openapi.yaml` — contratos de auth, pedidos, assinatura, conteúdos e casos presentes.

### Ainda mock-only (Subfatia C2/C3 — escopo restante)

Nenhum — financeiro migrado para API-first com fallback mock.

### Padrão a seguir

Replicar o padrão API-first de `listOrders()` em `repositories.ts:667-690`:

```typescript
const isLocalMockMode =
  !process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
  process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
  process.env.LOCAL_MOCK_MODE === 'true'

if (!isLocalMockMode) {
  try {
    return await apiClient.customer.listOrders()
  } catch (e) {
    if (!isConnectionRefused(e)) {
      console.warn('API listOrders error, falling back to local mocks:', e)
    }
  }
}
return mockFallback
```

## Escopo

Inclui:

- Login/cadastro/cliente atual mockado.
- Perfil.
- Pedidos.
- Assinatura.
- Financeiro.
- Conteúdos exclusivos.
- Casos/progresso.

Fora de escopo:

- Autenticação real.
- Recuperação de senha real.
- Gateway de pagamento.
- Persistência real.
- Back office administrativo.

## Commands you will need

| Purpose   | Command          | Expected on success |
|-----------|------------------|---------------------|
| Typecheck | `pnpm typecheck` | exit 0              |
| Build     | `pnpm build`     | exit 0              |

## Etapas executáis (por subfatia)

### Subfatia A — Auth/perfil (consolidar camada)

1. Migrar `server/customer.ts` para delegar a `repositories.ts` API-first (ou deprecar funções mock duplicadas).
2. Garantir estados: não autenticado, carregando, erro, sessão mock expirada.
3. Verificar: `pnpm typecheck && pnpm build`.

### Subfatia B — Pedidos

1. Adicionar `getOrderById()` API-first via `apiClient.customer.getOrder(id)` + `mapApiOrderToDomain`.
2. Migrar `src/app/(cliente)/cliente/pedidos/[id]/page.tsx` para usar função async.
3. Atualizar `docs/openapi.yaml` se contrato divergir.
4. Verificar: `pnpm typecheck && pnpm build`.

### Subfatia C — Assinatura + financeiro

1. API-first para `getSubscription`, `cancelSubscription`, `reactivateSubscription`.
2. API-first para pagamentos/faturas (confirmar endpoints em openapi; criar em `apiClient` se faltarem).
3. Migrar telas `/cliente/assinatura`, `/cliente/assinatura/cancelar`, `/cliente/financeiro`.
4. Verificar: `pnpm typecheck && pnpm build`.

### Subfatia D — Conteúdos e casos

1. API-first para `exclusiveContent.list/getBySlug` e `cases.getData`.
2. Migrar `/cliente/conteudos` e `/cliente/conteudos/[slug]`.
3. Garantir estados: conteúdo bloqueado, lista vazia.
4. Verificar: `pnpm typecheck && pnpm build`.

## STOP conditions

- Se `docs/openapi.yaml` não tiver contrato para um endpoint necessário, pare e reporte — não invente payload.
- Se a API real exigir autenticação que o proxy `/api/[...rota]` ainda não repassa, pare e reporte.
- Se subfatia A mostrar que perfil UI e `server/customer.ts` conflitam de forma irreconciliável sem decisão de produto, pare.

## Verificação final

```bash
pnpm typecheck
pnpm build
```

Esperado: exit 0 em ambos; fallback mock silencioso ou documentado quando API offline.

## Recomendação de execução

Executar por subfatias, não tudo de uma vez:

1. Auth/perfil (consolidar — parcialmente feito na UI).
2. Pedidos (detalhe pendente).
3. Assinatura + financeiro.
4. Conteúdos/casos.
