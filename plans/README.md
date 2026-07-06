# Planos de Implementação

Gerado com o skill improve em 2026-06-24. Reconcile completo em 2026-06-26 @ `7f35cd6`.

## Ordem de Execução e Status

| Plano | Título | Prioridade | Esforço | Depende de | Status |
|------|--------|------------|---------|------------|--------|
| 001 | Implementar as telas do Front Office com mocks, SEO e contratos futuros | P1 | L | - | **DONE** — verificado no HEAD @ `7f35cd6`; build exit 0 |
| 002 | Transformar a Home em uma experiência de abertura da caixa | P1 | L | - | **DONE** — verificado no HEAD @ `7f35cd6`; build exit 0 |
| 003 | Integração das telas da Área do Cliente com a identidade True Crime | P1 | M | 001 | **DONE** — verificado no HEAD @ `7f35cd6`; build exit 0 |
| 004 | Estratégia CMS para o Front Office | P1 | L | 003 | **DONE** — migrado para entrega de seções estruturadas via CMS Delivery |

| 005 | Separar a landing page e promover seu design system no Front Office | P1 | L | - | **DONE** — commit `99b21da` no worktree `plan005-549b04b4`; typecheck/build exit 0; lint pré-existente (baseline @ `484bdfd` já falha) |

Valores de status: TODO | IN PROGRESS | DONE | BLOCKED (com motivo em uma linha) | REJECTED (com justificativa em uma linha)

## Ordem recomendada agora

O Plano 005 foi concluído. O Plano 004 foi executado sob a nova Estratégia CMS para o Front Office.

## Notas de Dependência

- O Plano 004 foi adaptado para a nova estratégia CMS, integrando os componentes criados no Plano 005 com schemas dinâmicos baseados em blocos.

- O Plano 005 não depende do Plano 004, mas conflita se ambos forem executados em paralelo. Execute um por vez; se o Plano 005 for concluído primeiro, revise o Plano 004 para preservar os novos componentes de design.

## Itens Considerados e Rejeitados

- Nenhum. Estes planos vieram de planejamento de produto/tarefa, não de uma auditoria de bugs.

