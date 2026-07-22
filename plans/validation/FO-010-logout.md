# FO-010 — Logout (Front)

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: FO-002
- **Category**: validation / auth-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-010-logout.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → PASS (ver EXECUCAO)
- **Reconcile 2026-07-22 @ `3c431e5`**: PASS mantido; retest recomendado (`RequireAuth` + cookie session)

## Objetivo

Validar logout na UI e perda de acesso à área do cliente.

## Fluxo

Login → Área do Cliente → Logout

## Passos manuais

1. Login e abrir qualquer rota `/cliente/*`.
2. Acionar Logout (menu/header).
3. Confirmar chamada `auth.logout` / `POST /autenticacao/sair`.
4. Usuário vai para home ou login.
5. Acessar `/cliente/perfil` diretamente → redirect para login ou bloqueio.
6. Botão voltar do browser não restaura sessão autenticada.

## Critérios de aceite

- [ ] Sessão/token local descartado
- [ ] UI autenticada some (nome, menu cliente)
- [ ] Rotas privadas protegidas após logout

## Verificação

```bash
pnpm typecheck
# DevTools: cookies/storage limpos; 401 em chamadas subsequentes
```

## Resultado

| Campo | Valor |
|-------|-------|
| Executado em | 2026-07-14 |
| Modo | API remota (`tcc-front-office-api.vercel.app`) via front local `:3000` |
| Passou? | PASS (smoke 07-14); arquivo estava desatualizado vs EXECUCAO |
| Evidências / issues | EXECUCAO 07-14: logout limpa token; guard bloqueia `/cliente/*`. **Drift**: confirmar limpeza de cookie `tcc_session` além de storage local. |

