# Planos de Implementação

Gerado com o skill improve em 2026-06-24. Reconcile completo em 2026-07-13 @ `8f82afb`. Plano 011 adicionado em 2026-07-08. Plano 012 adicionado em 2026-07-08 (migrado de `advisor-plans/001`).

## Ordem de Execução e Status

| Plano | Título | Prioridade | Esforço | Depende de | Status |
|------|--------|------------|---------|------------|--------|
| 001 | Implementar as telas do Front Office com mocks, SEO e contratos futuros | P1 | L | - | **DONE** — reverificado @ `94cc25f`; typecheck/build exit 0 |
| 002 | Transformar a Home em uma experiência de abertura da caixa | P1 | L | - | **DONE** — reverificado @ `94cc25f`; typecheck/build exit 0 |
| 003 | Integração das telas da Área do Cliente com a identidade True Crime | P1 | M | 001 | **DONE** — reverificado @ `94cc25f`; typecheck/build exit 0 |
| 004 | Estratégia CMS para o Front Office | P1 | L | 003 | **DONE** — reverificado @ `94cc25f`; typecheck/build exit 0 |
| 005 | Separar a landing page e promover seu design system no Front Office | P1 | L | - | **DONE** — reverificado @ `94cc25f`; typecheck/build exit 0 |
| 006 | Integração da API Pública para Catálogo e Planos | P1 | M | - | **DONE** — reverificado @ `94cc25f`; typecheck/build exit 0 |
| 007 | Fechamento de Catálogo/Planos e Fallback Intencional | P1 | S | 006 | **DONE** — reverificado @ `94cc25f`; typecheck/build exit 0 |
| 008 | Integração pública de Carrinho | P1 | M | 007 | **DONE** — reverificado @ `94cc25f`; typecheck/build exit 0 |
| 009 | Integração pública de Checkout | P1 | M | 008 | **DONE** — reverificado @ `94cc25f`; typecheck/build exit 0 |
| 010 | Integração pública da Área do Cliente | P1 | L | 009 | **DONE** — `26db9e3` + financeiro `94cc25f`; typecheck/build exit 0 |
| 011 | Suprimir warnings ENOTFOUND no fallback do build | P2 | S | 007 | **DONE** — verificado @ `d2bcbfd`; build silencioso offline |
| 012 | Conectar endpoints API restantes e tornar mocks locais explícitos | P1 | L | 007, 010, 011 | **DONE** — verificado @ `8f82afb`; typecheck/build exit 0 |

Valores de status: TODO | IN PROGRESS | DONE | BLOCKED (com motivo em uma linha) | REJECTED (com justificativa em uma linha)

## Ordem recomendada agora

Não há mais planos pendentes. Todos os planos de 001 a 012 estão concluídos e validados.

## Notas de Dependência

- Plano 011 é follow-up do 007: estende `isConnectionRefused` para cobrir `ENOTFOUND` e outros erros offline.
- Plano 010 entregue em dois commits: área do cliente `26db9e3`, financeiro `94cc25f`.
- Plano 012 é o próximo passo da integração API: conecta telas ainda mockadas (`/casos`, cartões, FAQ) e inverte o modelo de fallback — mock passa a ser opt-in explícito (`NEXT_PUBLIC_LOCAL_MOCK=true`) em vez de default silencioso.

## Reconcile 2026-07-13 @ `8f82afb`

### Verificado DONE (001–012)

- `pnpm typecheck` → exit 0 (confirmado com sucesso)
- `NEXT_PUBLIC_LOCAL_MOCK=true pnpm build` → exit 0 (44 rotas compiladas com sucesso)
- `pnpm lint` → exit 1 due to pre-existing Prettier issues in `/design-sugerido` (which is out of scope) and a warning in `src/lib/api-client.ts` (catch block parameter `_` not used). No blocking functional issues.
- Todos os planos continuam válidos, aplicados e sem regressões na branch `master`.

## Reconcile 2026-07-09 (tarde) @ `8f82afb`

### Verificado DONE (011–012)

- `pnpm typecheck` → exit 0
- `NEXT_PUBLIC_LOCAL_MOCK=true pnpm build` → exit 0 (44 rotas compiladas)
- Plano 011 verificado e confirmado — warnings ENOTFOUND silenciados durante build offline.
- Plano 012 verificado e confirmado — endpoints integrados em `/casos`, `/cliente/cartoes`, `/cliente/financeiro/atualizar-cartao` e `/faq` via CMS.
- Worktrees stale foram removidos e limpos com sucesso.

## Reconcile 2026-07-08 (noite) @ `94cc25f`

### Verificado DONE (001–010)

- `pnpm typecheck` → exit 0
- `pnpm build` → exit 0 (44 rotas)
- Plano 010 completo — todas as subfatias entregues

### Drift aberto → Plano 011

- Build com `NEXT_PUBLIC_API_BASE_URL` configurado para host inacessível emite warnings `ENOTFOUND` no fallback.
- `isConnectionRefused` em `repositories.ts:62-74` não cobre esse caso.
- Commit `bdce94e` resolveu apenas `ECONNREFUSED`.

## Itens Considerados e Rejeitados

- Refatorar duplicação de `isLocalMockMode` inline — fora do escopo do 011; baixo leverage isolado.
- Pular fetch durante `next build` via detecção de fase — mais invasivo; helper de erro é suficiente.
