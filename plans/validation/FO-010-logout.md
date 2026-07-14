# FO-010 — Logout (Front)

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: FO-002
- **Category**: validation / auth-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-010-logout.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → PASS parcial

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
| Passou? | PASS parcial |
| Evidências / issues | Botão Sair chama auth.logout + limpa isLoggedIn + vai para /. Sem proteção que bloqueie /cliente/* após logout. Ver `EXECUCAO-2026-07-14.md`. |

