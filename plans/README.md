# Planos de Implementação

Gerado com o skill improve em 2026-06-24. Reconcile completo em 2026-06-25 @ `fc79de0`.

## Ordem de Execução e Status

| Plano | Título | Prioridade | Esforço | Depende de | Status |
|------|--------|------------|---------|------------|--------|
| 001 | Implementar as telas do Front Office com mocks, SEO e contratos futuros | P1 | L | - | **DONE** — verificado @ `fc79de0`; gates exit 0 |
| 002 | Transformar a Home em uma experiência de abertura da caixa | P1 | L | - | **IN PROGRESS** — ~90%; lacuna hero mobile + QA manual |

Valores de status: TODO | IN PROGRESS | DONE | BLOCKED (com motivo em uma linha) | REJECTED (com justificativa em uma linha)

## Ordem recomendada agora

1. **Concluir 002** — fallback visual homem+caixa no hero mobile (`HeroCaseReveal`); QA manual da checklist da Etapa 7.
2. **Cleanup opcional** — worktree obsoleto `codex/front-office-telas` @ `1937fe6` (conteúdo já em `master`); remover com `/delete-worktree`.

## Notas de Dependência

- O plano 001 é a base concluída do Front Office.
- O plano 002 evolui a Home; a maior parte do código já está no HEAD — falta fechar critério mobile e QA.

## Itens Considerados e Rejeitados

- Nenhum. Estes planos vieram de planejamento de produto/tarefa, não de uma auditoria de bugs.
