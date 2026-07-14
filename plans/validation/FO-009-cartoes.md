# FO-009 — Cartões (Front)

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: FO-002
- **Category**: validation / painel-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-009-cartoes.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → PASS smoke

## Objetivo

Validar visualização de cartões em `/cliente/cartoes`.

## Fluxo

Login → Meus Cartões → Visualizar Cartões

## Passos manuais

1. Login → `/cliente/cartoes`.
2. Lista mascara número (últimos 4) e bandeira.
3. Empty state se não houver cartões.
4. Se UI permitir adicionar/remover: validar feedback; senão, escopo = somente leitura.

## Critérios de aceite

- [ ] Nenhum PAN/CVV completo na UI ou no Network response tratado pela tela
- [ ] Integração com `GET /cliente/cartoes`
- [ ] Erro de API não derruba o layout do painel

## Verificação

```bash
pnpm typecheck
# Revisar src/app/(cliente)/cliente/cartoes
```

## Resultado

| Campo | Valor |
|-------|-------|
| Executado em | 2026-07-14 |
| Modo | API remota (`tcc-front-office-api.vercel.app`) via front local `:3000` |
| Passou? | PASS smoke |
| Evidências / issues | /cliente/cartoes 200; listCards/add/delete no client; nav Meus cartões. Ver `EXECUCAO-2026-07-14.md`. |

