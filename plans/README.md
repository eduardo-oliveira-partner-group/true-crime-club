# Planos de Implementação

Gerado com o skill improve em 2026-06-24. Reconcile completo em 2026-07-08 @ `26db9e3`.

## Ordem de Execução e Status

| Plano | Título | Prioridade | Esforço | Depende de | Status |
|------|--------|------------|---------|------------|--------|
| 001 | Implementar as telas do Front Office com mocks, SEO e contratos futuros | P1 | L | - | **DONE** — reverificado @ `26db9e3`; typecheck/build exit 0 |
| 002 | Transformar a Home em uma experiência de abertura da caixa | P1 | L | - | **DONE** — reverificado @ `26db9e3`; typecheck/build exit 0 |
| 003 | Integração das telas da Área do Cliente com a identidade True Crime | P1 | M | 001 | **DONE** — reverificado @ `26db9e3`; typecheck/build exit 0 |
| 004 | Estratégia CMS para o Front Office | P1 | L | 003 | **DONE** — reverificado @ `26db9e3`; typecheck/build exit 0 |
| 005 | Separar a landing page e promover seu design system no Front Office | P1 | L | - | **DONE** — reverificado @ `26db9e3`; typecheck/build exit 0 |
| 006 | Integração da API Pública para Catálogo e Planos | P1 | M | - | **DONE** — reverificado @ `26db9e3`; typecheck/build exit 0 |
| 007 | Fechamento de Catálogo/Planos e Fallback Intencional | P1 | S | 006 | **DONE** — reverificado @ `26db9e3`; typecheck/build exit 0 |
| 008 | Integração pública de Carrinho | P1 | M | 007 | **DONE** — reverificado @ `26db9e3`; typecheck/build exit 0 |
| 009 | Integração pública de Checkout | P1 | M | 008 | **DONE** — reverificado @ `26db9e3`; typecheck/build exit 0 |
| 010 | Integração pública da Área do Cliente | P1 | L | 009 | **DONE** — merge `26db9e3`; financeiro API-first concluído (C2/C3) |

Valores de status: TODO | IN PROGRESS | DONE | BLOCKED (com motivo em uma linha) | REJECTED (com justificativa em uma linha)

## Ordem recomendada agora

1. Considerar follow-up para suprimir warnings `ENOTFOUND` no build (drift vs. intenção do 007).

## Notas de Dependência

- O Plano 004 foi adaptado para a nova estratégia CMS, integrando os componentes criados no Plano 005 com schemas dinâmicos baseados em blocos.
- O Plano 005 não depende do Plano 004, mas conflita se ambos forem executados em paralelo. Execute um por vez; se o Plano 005 for concluído primeiro, revise o Plano 004 para preservar os novos componentes de design.
- Plano 010 mergeado em `26db9e3` (conteúdo do worktree `7161484`). Worktree `plan010-382b44c7` pode ser removido.

## Reconcile 2026-07-08 (tarde)

### Verificado DONE (001–009)

- `pnpm typecheck` → exit 0 @ `26db9e3`
- `pnpm build` → exit 0 @ `26db9e3` (44 rotas)
- Nenhuma regressão detectada após merge do 010

### Plano 010 — estado pós-merge

| Subfatia | Estado @ `26db9e3` |
|----------|-------------------|
| A — Auth/perfil | **DONE** — `server/customer.ts` delega; `getCustomerProfile` API-first |
| B — Pedidos | **DONE** — `getOrderById` API-first; página async |
| C1 — Assinatura | **DONE** — `getSubscription` / cancel / reactivate API-first |
| C2/C3 — Financeiro | **DONE** — `listPayments`/`listInvoices`/`renewPixPayment`/`updateCard` API-first |
| D — Conteúdos/casos | **DONE** — `listExclusiveContent`, `getActiveCase`, `listClues` API-first |
| Proxy mock `/api` | **DONE** — usa helpers `*Mock` (sem recursão) |

Evidência financeiro mock: `repositories.ts:1149-1179`, `financeiro/page.tsx:12-16`.

Contrato openapi financeiro (2026-07-08): `/cliente/pagamentos`, `/cliente/pagamentos/{id}`, `/cliente/pagamentos/{id}/renovar-pix`, `/cliente/faturas`, `/cliente/cartao` — espelhado em `tcc-front-office-api/docs/openapi.yaml`.

### Worktree stale

- `/Users/eduardo/.cursor/worktrees/plan010-382b44c7/...` ainda existe, mas conteúdo já está em `26db9e3`. Seguro remover.

### Observação de drift (não invalida DONE)

- Build com `NEXT_PUBLIC_API_BASE_URL` apontando para host inacessível ainda emite warnings `ENOTFOUND` no fallback. `isConnectionRefused` não cobre esse caso.

### Executável agora

- `plan financeiro openapi` ou `execute 010` (somente Subfatia C2/C3, após contratos definidos).

## Itens Considerados e Rejeitados

- Nenhum. Estes planos vieram de planejamento de produto/tarefa, não de uma auditoria de bugs.
