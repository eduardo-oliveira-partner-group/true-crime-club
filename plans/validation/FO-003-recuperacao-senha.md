# FO-003 — Recuperação de Senha (Front)

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: FO-002
- **Category**: validation / auth-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-003-recuperacao-senha.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → PASS parcial

## Objetivo

Validar o fluxo UI de “Esqueci minha senha” e o retorno ao login.

## Fluxo

Login → Esqueci Minha Senha → Redefinir Senha → Login

## Passos manuais

1. Em `/login`, acionar “Esqueci minha senha” → `/recuperar-senha`.
2. Informar e-mail e enviar.
3. Feedback de sucesso genérico (mesmo se e-mail não existir).
4. Se houver tela/token de redefinição: completar e voltar a `/login` com senha nova.
5. Se **não** houver redefinição: registrar lacuna; aceitar apenas solicitação + link de volta ao login.

## Critérios de aceite

- [ ] Link Login ↔ Recuperar senha funciona nos dois sentidos
- [ ] Chamada `auth.recoverPassword` → `/clientes/recuperar-senha`
- [ ] Estados: idle, loading, sucesso, erro de rede
- [ ] Lacuna de redefinição real marcada explicitamente no resultado

## Verificação

```bash
pnpm typecheck
# Revisar src/app/(auth)/recuperar-senha
```

## Resultado

| Campo | Valor |
|-------|-------|
| Executado em | 2026-07-14 |
| Modo | API remota (`tcc-front-office-api.vercel.app`) via front local `:3000` |
| Passou? | PASS parcial |
| Evidências / issues | /recuperar-senha OK (solicitação + feedback + link login). Reset com token ausente; copy admite simulação. Ver `EXECUCAO-2026-07-14.md`. |

