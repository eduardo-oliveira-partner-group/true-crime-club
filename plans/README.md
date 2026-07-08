# Planos de Implementação

Gerado com o skill improve em 2026-06-24. Reconcile completo em 2026-07-08 @ `cbf9847`.

## Ordem de Execução e Status

| Plano | Título | Prioridade | Esforço | Depende de | Status |
|------|--------|------------|---------|------------|--------|
| 001 | Implementar as telas do Front Office com mocks, SEO e contratos futuros | P1 | L | - | **DONE** — reverificado @ `cbf9847`; typecheck/build exit 0 |
| 002 | Transformar a Home em uma experiência de abertura da caixa | P1 | L | - | **DONE** — reverificado @ `cbf9847`; typecheck/build exit 0 |
| 003 | Integração das telas da Área do Cliente com a identidade True Crime | P1 | M | 001 | **DONE** — reverificado @ `cbf9847`; typecheck/build exit 0 |
| 004 | Estratégia CMS para o Front Office | P1 | L | 003 | **DONE** — reverificado @ `cbf9847`; typecheck/build exit 0 |
| 005 | Separar a landing page e promover seu design system no Front Office | P1 | L | - | **DONE** — reverificado @ `cbf9847`; typecheck/build exit 0 |
| 006 | Integração da API Pública para Catálogo e Planos | P1 | M | - | **DONE** — reverificado @ `cbf9847`; typecheck/build exit 0 |
| 007 | Fechamento de Catálogo/Planos e Fallback Intencional | P1 | S | 006 | **DONE** — reverificado @ `cbf9847`; typecheck/build exit 0 |
| 008 | Integração pública de Carrinho | P1 | M | 007 | **DONE** — reverificado @ `cbf9847`; typecheck/build exit 0 |
| 009 | Integração pública de Checkout | P1 | M | 008 | **DONE** — reverificado @ `cbf9847`; typecheck/build exit 0 |
| 010 | Integração pública da Área do Cliente | P1 | L | 009 | **IN PROGRESS** — worktree `7161484`; A/B/C1/D aprovadas; financeiro BLOCKED (sem contrato openapi) |

Valores de status: TODO | IN PROGRESS | DONE | BLOCKED (com motivo em uma linha) | REJECTED (com justificativa em uma linha)

## Ordem recomendada agora

1. Aplicar worktree do Plano 010 (`7161484`) na branch principal — subfatias A/B/C1/D prontas.
2. Desbloquear financeiro: definir contratos `/cliente/pagamentos` e `/cliente/faturas` no openapi (API + proxy) e concluir Subfatia C2/C3.
3. Após 010 completo, considerar follow-up para suprimir warnings `ENOTFOUND` no build.

## Notas de Dependência

- O Plano 004 foi adaptado para a nova estratégia CMS, integrando os componentes criados no Plano 005 com schemas dinâmicos baseados em blocos.
- O Plano 005 não depende do Plano 004, mas conflita se ambos forem executados em paralelo. Execute um por vez; se o Plano 005 for concluído primeiro, revise o Plano 004 para preservar os novos componentes de design.
- Planos 008 e 009 foram mergeados em `c111a57` / `2ffd006`; status atualizado em `32f5c4c`.

## Reconcile 2026-07-08

### Verificado DONE (001–009)

- `pnpm typecheck` → exit 0 @ `cbf9847`
- `pnpm build` → exit 0 @ `cbf9847` (44 rotas geradas)
- Evidência de integração API-first em `src/lib/domain/repositories.ts`: cart, checkout, listOrders
- Evidência de merge: commits `feb13a4`, `930779c`, `9436f72`, `32f5c4c`

### Observação de drift (não invalida DONE)

- Com `.env.local` apontando `NEXT_PUBLIC_API_BASE_URL` para host inacessível, o build emite warnings `API * error, falling back to local mocks` com `ENOTFOUND`. `isConnectionRefused` em `repositories.ts:61-73` só suprime `ECONNREFUSED`. Build continua exit 0.

### Plano 010 — progresso parcial

| Subfatia | Estado |
|----------|--------|
| Auth (login/cadastro/shell) | UI usa `apiClient.auth` diretamente |
| Perfil / cartões | UI usa `apiClient.customer.getProfile/updateProfile/addAddress/deleteAddress` |
| Pedidos (lista) | `listOrders()` API-first em `repositories.ts:667-690` |
| Pedidos (detalhe) | Mock via `getOrderById()` — pendente |
| Assinatura | Mock via `getSubscription()` — pendente |
| Financeiro | Mock via `listPayments/listInvoices` — pendente |
| Conteúdos / casos | Mock via `getActiveCase/listClues` — pendente |
| `server/customer.ts` | Camada legada mock; perfil UI já bypassa |

### Execute 010 — resultado 2026-07-08

- **Veredito**: APPROVE parcial (revisão 1 corrigiu recursão em `route.ts`)
- **Worktree**: `/Users/eduardo/.cursor/worktrees/plan010-382b44c7/tcc-front-office-front-544f89878ca4` @ `7161484`
- **Concluído**: auth/perfil consolidado, pedidos (lista+detalhe), assinatura, conteúdos/casos
- **Pendente**: financeiro (`listPayments`/`listInvoices` mock-only — STOP válido, sem contrato openapi)
- **Verificação**: `pnpm typecheck` exit 0, `pnpm build` exit 0

### Executável agora

- Merge do worktree 010 + plano/spike para contratos financeiros no openapi.

## Itens Considerados e Rejeitados

- Nenhum. Estes planos vieram de planejamento de produto/tarefa, não de uma auditoria de bugs.
