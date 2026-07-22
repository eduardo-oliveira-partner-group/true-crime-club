# FO-002 — Login (Front)

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: —
- **Category**: validation / auth-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-002-login.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → PASS (smoke autenticado; ver EXECUCAO)
- **Reconcile 2026-07-22 @ `3c431e5`**: PASS mantido; retest recomendado (cookie `tcc_session`, redirect default → perfil, botões mock removidos)

## Objetivo

Validar login pela UI e entrada na área do cliente.

## Fluxo

Início → Login → Área do Cliente → Logout

## Passos manuais

1. Em `/`, abrir Login → `/login`.
2. Credenciais válidas (mock ou Supabase conforme ambiente).
3. Redirecionamento para área do cliente (ex.: `/cliente/perfil` ou hub).
4. Conteúdo autenticado carrega (nome/e-mail).
5. Logout (ver FO-010).

## Critérios de aceite

- [ ] Validação de formulário (e-mail/senha vazios)
- [ ] Credenciais inválidas: mensagem de erro, permanece em `/login`
- [ ] Sucesso: sessão disponível para navegação `/cliente/*`
- [ ] Se API retornar 410 em `/autenticacao/entrar`, UI documenta/fallback — **não** falha silenciosa

## Verificação

```bash
pnpm typecheck
# Inspecionar Network: POST autenticacao/entrar ou fluxo Supabase
```

## Resultado

| Campo | Valor |
|-------|-------|
| Executado em | 2026-07-14 |
| Modo | API remota (`tcc-front-office-api.vercel.app`) via front local `:3000` |
| Passou? | PASS (smoke 07-14 com guard + mock users); arquivo estava desatualizado vs EXECUCAO |
| Evidências / issues | EXECUCAO 07-14: login Usuário 1/2 + Bearer + redirect. **Drift**: botões mock removidos (`713db82`); redirect padrão agora perfil (`f5dc205`); sessão server usa cookie `tcc_session`. Revalidar com credenciais reais do ambiente. |

