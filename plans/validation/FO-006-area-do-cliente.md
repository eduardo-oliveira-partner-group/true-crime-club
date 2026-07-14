# FO-006 — Área do Cliente / Meus Dados (Front)

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: FO-002
- **Category**: validation / painel-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-006-area-do-cliente.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → FAIL parcial

## Objetivo

Validar visualização e edição de dados em `/cliente/perfil`.

## Fluxo

Login → Minha Conta → Meus Dados → Salvar → Logout

## Passos manuais

1. Login → abrir `/cliente/perfil` (Meus Dados).
2. Verificar dados pré-carregados.
3. Alterar um campo permitido (nome, telefone, etc.) e Salvar.
4. Recarregar a página — alteração persiste (API) ou comportamento mock documentado.
5. Logout.

## Critérios de aceite

- [ ] Formulário carrega sem erro
- [ ] Salvar mostra sucesso/erro
- [ ] Não usa `cliente-001` hardcoded quando JWT tem outro `id` (se falhar → registrar gap conhecido)
- [ ] Campos read-only vs editáveis claros

## Verificação

```bash
pnpm typecheck
# Revisar src/app/(cliente)/cliente/perfil e api-client customer.update*
```

## Resultado

| Campo | Valor |
|-------|-------|
| Executado em | 2026-07-14 |
| Modo | API remota (`tcc-front-office-api.vercel.app`) via front local `:3000` |
| Passou? | FAIL parcial |
| Evidências / issues | Página 200 + Salvar via updateProfile. Gaps: defaults hardcoded; PATCH /clientes/cliente-001; sem guard. Ver `EXECUCAO-2026-07-14.md`. |

