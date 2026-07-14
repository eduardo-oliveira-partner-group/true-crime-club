# FO-008 — Pedidos (Front)

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: FO-002
- **Category**: validation / painel-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-008-pedidos.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → PASS smoke

## Objetivo

Validar listagem e detalhe de pedidos na UI.

## Fluxo

Login → Meus Pedidos → Detalhes do Pedido

## Passos manuais

1. Login → `/cliente/pedidos`.
2. Lista exibe pedidos (ou empty state).
3. Abrir um item → `/cliente/pedidos/[id]`.
4. Detalhe: itens, status, endereço/pagamento quando disponíveis.
5. ID inválido → not-found amigável.

## Critérios de aceite

- [ ] Lista e detalhe usam `listOrders` / `getOrder`
- [ ] Navegação lista → detalhe → voltar funciona
- [ ] Sem flash de conteúdo errado entre pedidos

## Verificação

```bash
pnpm typecheck
# Revisar src/app/(cliente)/cliente/pedidos
```

## Resultado

| Campo | Valor |
|-------|-------|
| Executado em | 2026-07-14 |
| Modo | API remota (`tcc-front-office-api.vercel.app`) via front local `:3000` |
| Passou? | PASS smoke |
| Evidências / issues | /cliente/pedidos 200; nav Meus pedidos presente. Ver `EXECUCAO-2026-07-14.md`. |

