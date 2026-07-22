# Planos de Implementação

Gerado com o skill improve em 2026-06-24. Reconcile completo em 2026-07-22 @ `3c431e5` (anterior: 2026-07-13 @ `8f82afb`). Plano 011 adicionado em 2026-07-08. Plano 012 adicionado em 2026-07-08 (migrado de `advisor-plans/001`).

## Ordem de Execução e Status

| Plano | Título | Prioridade | Esforço | Depende de | Status |
|------|--------|------------|---------|------------|--------|
| 001 | Implementar as telas do Front Office com mocks, SEO e contratos futuros | P1 | L | - | **DONE** — spot-check @ `3c431e5`; `pnpm typecheck` exit 0 |
| 002 | Transformar a Home em uma experiência de abertura da caixa | P1 | L | - | **DONE** — spot-check @ `3c431e5`; landing `_landing/` presente |
| 003 | Integração das telas da Área do Cliente com a identidade True Crime | P1 | M | 001 | **DONE** — spot-check @ `3c431e5`; área `/cliente/*` + `RequireAuth` |
| 004 | Estratégia CMS para o Front Office | P1 | L | 003 | **DONE** — spot-check @ `3c431e5` |
| 005 | Separar a landing page e promover seu design system no Front Office | P1 | L | - | **DONE** — spot-check @ `3c431e5` |
| 006 | Integração da API Pública para Catálogo e Planos | P1 | M | - | **DONE** — spot-check @ `3c431e5` |
| 007 | Fechamento de Catálogo/Planos e Fallback Intencional | P1 | S | 006 | **DONE** — supersedido em parte pelo 012 (mock opt-in) |
| 008 | Integração pública de Carrinho | P1 | M | 007 | **DONE** — spot-check @ `3c431e5` |
| 009 | Integração pública de Checkout | P1 | M | 008 | **DONE** — spot-check @ `3c431e5`; checkout client-side |
| 010 | Integração pública da Área do Cliente | P1 | L | 009 | **DONE** — spot-check @ `3c431e5` |
| 011 | Suprimir warnings ENOTFOUND no fallback do build | P2 | S | 007 | **DONE** — helper obsoleto pós-012; sem fallback silencioso |
| 012 | Conectar endpoints API restantes e tornar mocks locais explícitos | P1 | L | 007, 010, 011 | **DONE** — spot-check @ `3c431e5`; `isLocalMockMode` + domains |

Valores de status: TODO | IN PROGRESS | DONE | BLOCKED (com motivo em uma linha) | REJECTED (com justificativa em uma linha)

## Validação de jornadas (FO-001…FO-010)

Suíte criada em 2026-07-14. Complementa os planos de implementação 001–012.

→ Índice canônico: [`plans/validation/README.md`](./validation/README.md)

| ID | Cenário | Status (reconcile 2026-07-22) |
|----|---------|-------------------------------|
| FO-001 | Contratação de Assinatura | **EM RETESTE** (última nota 2026-07-16) |
| FO-002 | Login | **PASS** — retest recomendado (auth/cookie evoluíram) |
| FO-003 | Recuperação de Senha | **PASS parcial** |
| FO-004 | Pagamento com Cartão | **INCONCLUSIVO** — checkout client-side resolveu SSR; retest |
| FO-005 | Pagamento com Pix | **INCONCLUSIVO** — gap: `confirmacao` força `pixPayment = null` |
| FO-006 | Área do Cliente | **RETESTE** — gaps `cliente-001`/guard corrigidos no código |
| FO-007 | Assinaturas | **PASS** |
| FO-008 | Pedidos | **PASS** |
| FO-009 | Cartões | **PASS** |
| FO-010 | Logout | **PASS** — retest recomendado (guard existe) |

Pareamento API: `tcc-front-office-api/plans/validation/`.

## Última execução do checklist (2026-07-14)

Smoke local em `:3000` + `pnpm typecheck` (exit 0). Detalhes: [`validation/EXECUCAO-2026-07-14.md`](./validation/EXECUCAO-2026-07-14.md).

Achados daquela execução (atualizados no reconcile 2026-07-22):

| Achado | Estado @ `3c431e5` |
|--------|---------------------|
| Sem guard em `/cliente/*` | **Corrigido** — `RequireAuth` em `cliente/layout.tsx` |
| `cliente-001` hardcoded no PATCH | **Corrigido** — `getCustomerId()` via `/autenticacao/cliente-atual` |
| Checkout SSR sem métodos de pagamento | **Corrigido** — `/checkout` é client-side + `apiClient.customer.getProfile()` |
| Botões mock Usuário 1/2 no login | **Removidos de propósito** (`713db82`) |
| Confirmação Pix sem QR | **Aberto** — `confirmacao/page.tsx` define `pixPayment = null` |

## Ordem recomendada agora

1. Retestar **FO-006** (gaps históricos sumiram — candidato a PASS).
2. Retestar **FO-002** / **FO-010** (sessão cookie `tcc_session` + redirect default para perfil).
3. Retestar **FO-004**; em **FO-005** validar checkout Pix e registrar o gap de confirmação (ou corrigir via novo plano).
4. Fechar **FO-001** (já EM RETESTE — aceito visual integral).

Não há planos de implementação TODO/BLOCKED/IN PROGRESS. Próximo ciclo de `/improve` (audit) só se quiser plano para o gap Pix na confirmação.

## Notas de Dependência

- Plano 011 é follow-up do 007: estendia detecção offline. Pós-012 o modelo é mock **opt-in** (`NEXT_PUBLIC_LOCAL_MOCK=true`); falha de API propaga (sem `console.warn` + fallback). O helper `isExpectedOfflineFetchError` foi removido na reestruturação de `repository/` — intenção do 011 permanece válida no novo modelo (sem ruído de fallback).
- Plano 010 entregue em dois commits: área do cliente `26db9e3`, financeiro `94cc25f`.
- Plano 012 inverteu fallback silencioso → mock explícito; domains em `src/lib/domain/repository/domains/`.

## Reconcile 2026-07-22 @ `3c431e5`

### Desde o último reconcile (`8f82afb` → `3c431e5`)

- **57 commits** no `master` (auth/sessão, reestruturação API/repository, checkout Pix, skeletons cliente, CI/Docker, remoção de design-sugerido legado).
- `pnpm typecheck` → exit 0.
- Worktrees git registrados: só o main. Pastas órfãs em `~/.cursor/worktrees/{plan001,plan005,plan010,front-office-telas}` — vazias ou de outro projeto; seguras para limpeza manual (não registradas em `git worktree list`).

### Verificado DONE (001–012)

- Critérios baratos ok; artefatos-chave presentes (`RequireAuth`, `isLocalMockMode`, domains, landing).
- Nenhum plano BLOCKED ou IN PROGRESS.

### Drift / refresh (validação)

- Índice raiz estava desatualizado (todos FO como TODO) vs `validation/README.md` — **sincronizado** nesta reconcile.
- FO-001 no arquivo individual já era **EM RETESTE** (2026-07-16); índice de validation atualizado.
- FO-006: gaps da execução 07-14 corrigidos independentemente → status **RETESTE**.
- FO-004/005: nota de SSR obsoleta; novo gap documentado em confirmação Pix.

### Rejeitado / corrigido independentemente

- Hardcode `cliente-001` no update de perfil — resolvido por `getCustomerId()`.
- Ausência de guard em `/cliente/*` — resolvido por `RequireAuth`.
- Plano de “restaurar botões mock de login” — rejeitado (remoção intencional).

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
- Restaurar botões “Usuário 1/2” no login — removidos de propósito; não reabrir como finding.
