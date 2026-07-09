# Planos de Implementação

Gerado com o skill improve em 2026-06-24. Reconcile completo em 2026-07-08 @ `94cc25f`. Plano 011 adicionado em 2026-07-08. Plano 012 adicionado em 2026-07-08 (migrado de `advisor-plans/001`).

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
| 012 | Conectar endpoints API restantes e tornar mocks locais explícitos | P1 | L | 007, 010, 011 | TODO |

Valores de status: TODO | IN PROGRESS | DONE | BLOCKED (com motivo em uma linha) | REJECTED (com justificativa em uma linha)

## Ordem recomendada agora

1. Executar Plano 012 (`execute 012`) — fecha gaps de `/casos`, cartões e FAQ; remove fallback implícito.
2. Remover worktree stale `plan010-382b44c7` se ainda existir.

## Notas de Dependência

- Plano 011 é follow-up do 007: estende `isConnectionRefused` para cobrir `ENOTFOUND` e outros erros offline.
- Plano 010 entregue em dois commits: área do cliente `26db9e3`, financeiro `94cc25f`.
- Plano 012 é o próximo passo da integração API: conecta telas ainda mockadas (`/casos`, cartões, FAQ) e inverte o modelo de fallback — mock passa a ser opt-in explícito (`NEXT_PUBLIC_LOCAL_MOCK=true`) em vez de default silencioso.

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
