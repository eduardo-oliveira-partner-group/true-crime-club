# Planos de Implementação

Gerado com o skill improve em 2026-06-24 e atualizado em 2026-06-25 (reconcile do plano 001).
Execute na ordem abaixo, salvo quando as dependências indicarem outro fluxo. Cada executor
deve ler o plano completo antes de começar, respeitar as condições de parada e
atualizar sua linha de status ao finalizar.

## Ordem de Execução e Status

| Plano | Título | Prioridade | Esforço | Depende de | Status |
|------|--------|------------|---------|------------|--------|
| 001 | Implementar as telas do Front Office com mocks, SEO e contratos futuros | P1 | L | - | IN PROGRESS — Etapas 1–4 ~done; 5–7 pendentes (reconcile 2026-06-25 @ `fe41adc`) |
| 002 | Transformar a Home em uma experiência de abertura da caixa | P1 | L | - | IN PROGRESS |

Valores de status: TODO | IN PROGRESS | DONE | BLOCKED (com motivo em uma linha) | REJECTED (com justificativa em uma linha)

## Ordem recomendada agora

1. **Concluir 001** — retomar na Etapa 5 (SEO/metadata), Etapa 6 (docs `front-office-*`), corrigir lint e lacunas de checkout/preferências (Etapa 3/7).
2. **002** — pode continuar em paralelo na Home; se 001 alterar `(front-office)/page.tsx`, rodar drift check do 002 antes de merge.

## Notas de Dependência

- O plano 001 é a base para todo o Front Office. Se necessário, divida a execução em PRs menores, mas mantenha o mesmo mapa de rotas, os mesmos contratos de dados e os mesmos critérios de aceite.
- O plano 002 aprimora a Home já existente com uma experiência narrativa e visual mais forte. Ele pode ser executado independentemente se a Home atual estiver presente; se o plano 001 ainda estiver em execução e alterar a Home, rode a verificação de drift do plano 002 antes de começar.

## Itens Considerados e Rejeitados

- Nenhum. Estes planos vieram de planejamento de produto/tarefa, não de uma auditoria de bugs.
