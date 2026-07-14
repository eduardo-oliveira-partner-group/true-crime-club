# Planos de Validação — Front Office (Front-end)

**Criado em:** 2026-07-14  
**Fonte:** cenários FO-001…FO-010 (jornadas principais do Front Office)  
**App:** `tcc-front-office-front` (Next.js)  
**API pareada:** `tcc-front-office-api/plans/validation/`

## Objetivo

Validar na UI as jornadas de cadastro, autenticação, compra, pagamento e área logada, garantindo navegação, estados de loading/erro e integração com a API pública (ou mock local explícito).

## Status

| ID | Plano | Status | Tipo |
|----|-------|--------|------|
| FO-001 | [Contratação de Assinatura](./FO-001-contratacao-assinatura.md) | **NÃO EXECUTADO** | E2E UI |
| FO-002 | [Login](./FO-002-login.md) | **PASS** | Auth UI |
| FO-003 | [Recuperação de Senha](./FO-003-recuperacao-senha.md) | **PASS parcial** | Auth UI |
| FO-004 | [Pagamento com Cartão](./FO-004-pagamento-cartao.md) | **INCONCLUSIVO** | Checkout UI |
| FO-005 | [Pagamento com Pix](./FO-005-pagamento-pix.md) | **INCONCLUSIVO** | Checkout UI |
| FO-006 | [Área do Cliente](./FO-006-area-do-cliente.md) | **PASS parcial** | Painel UI |
| FO-007 | [Assinaturas](./FO-007-assinaturas.md) | **PASS** | Painel UI |
| FO-008 | [Pedidos](./FO-008-pedidos.md) | **PASS** | Painel UI |
| FO-009 | [Cartões](./FO-009-cartoes.md) | **PASS** | Painel UI |
| FO-010 | [Logout](./FO-010-logout.md) | **PASS** | Auth UI |

## Pré-requisitos comuns

```bash
# Front
pnpm install
pnpm typecheck
# Dev com API real:
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api pnpm dev
# Ou mock local explícito:
NEXT_PUBLIC_LOCAL_MOCK=true pnpm dev
```

Documentar no resultado de cada execução: **API real** vs **LOCAL_MOCK**.

## Rotas principais

| Área | Rotas |
|------|-------|
| Auth | `/login`, `/cadastro`, `/recuperar-senha` |
| Assinatura / compra | `/assinatura`, `/carrinho`, `/checkout`, `/checkout/confirmacao` |
| Cliente | `/cliente/perfil`, `/cliente/assinatura`, `/cliente/pedidos`, `/cliente/pedidos/[id]`, `/cliente/cartoes`, `/cliente/financeiro` |

## Ordem sugerida

```
FO-002 → FO-010 → FO-003 → FO-006 → FO-007 → FO-008 → FO-009
                ↘ FO-004 / FO-005
FO-001 (jornada completa)
```

## Última execução

- [EXECUCAO-2026-07-14.md](./EXECUCAO-2026-07-14.md) — smoke local em `:3000` + typecheck.
