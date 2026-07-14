# FO-007 — Assinaturas (Front)

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: FO-002
- **Category**: validation / painel-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-007-assinaturas.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → PASS smoke

## Objetivo

Validar a tela de assinatura e o detalhe exibido ao cliente.

## Fluxo

Login → Minhas Assinaturas → Detalhes da Assinatura

## Passos manuais

1. Login → `/cliente/assinatura`.
2. Conferir status, plano, próximo ciclo / caixa atual.
3. Se houver ações (cancelar → `/cliente/assinatura/cancelar`, reativar): validar navegação e confirmação.
4. Estado vazio/sem assinatura tratado (empty state).

## Critérios de aceite

- [ ] Dados vindos de `customer.getSubscription`
- [ ] Loading e erro de rede tratados
- [ ] Links de ação não quebram (404)

## Verificação

```bash
pnpm typecheck
# Revisar src/app/(cliente)/cliente/assinatura
```

## Resultado

| Campo | Valor |
|-------|-------|
| Executado em | 2026-07-14 |
| Modo | API remota (`tcc-front-office-api.vercel.app`) via front local `:3000` |
| Passou? | PASS smoke |
| Evidências / issues | /cliente/assinatura 200; nav Minhas assinaturas; getSubscription no server component. Ver `EXECUCAO-2026-07-14.md`. |

