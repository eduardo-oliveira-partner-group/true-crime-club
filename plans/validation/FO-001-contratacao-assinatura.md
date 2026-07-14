# FO-001 — Contratação de Assinatura (Front)

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: HIGH
- **Depends on**: FO-002, FO-004 ou FO-005, FO-007–010
- **Category**: validation / e2e-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-001-contratacao-assinatura.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → NÃO EXECUTADO

## Objetivo

Validar a jornada UI completa de contratação de assinatura até a área logada.

## Fluxo

Início → Escolher Assinatura → Cadastro → Login → Checkout → Pagamento → Sucesso → Minhas Assinaturas → Meus Pedidos → Meus Cartões → Logout

## Passos manuais

1. Abrir `/` (home) — CTA de assinatura visível.
2. Ir a `/assinatura` (ou planos na landing) e escolher um plano.
3. Seguir para cadastro em `/cadastro` (se não autenticado) — preencher e submeter.
4. Login em `/login` se a sessão não foi criada no cadastro.
5. Ir a `/checkout` com o plano/carrinho; preencher endereço e pagamento.
6. Confirmar → `/checkout/confirmacao` (sucesso).
7. Navegar `/cliente/assinatura`, `/cliente/pedidos`, `/cliente/cartoes`.
8. Logout — voltar a estado público; rotas `/cliente/*` redirecionam ou bloqueiam.

## Critérios de aceite

- [ ] Nenhum dead-end: cada etapa tem CTA claro
- [ ] Erros de API exibem feedback (toast/alerta), não tela em branco
- [ ] Confirmação mostra identificador de pedido/assinatura quando a API retorna
- [ ] Painel reflete a contratação (mock ou API)
- [ ] Logout encerra acesso à área do cliente

## Chamadas esperadas (via `api-client`)

`planos.list` → `auth.register` / `auth.login` → `cart.*` → `checkout.createOrder` → `customer.getSubscription` / `listOrders` / `listCards` → `auth.logout`

## Verificação técnica

```bash
pnpm typecheck
# Smoke: percorrer o fluxo no browser com Network aberto
```

## Resultado

| Campo | Valor |
|-------|-------|
| Executado em | 2026-07-14 |
| Modo | API remota (`tcc-front-office-api.vercel.app`) via front local `:3000` |
| Passou? | NÃO EXECUTADO |
| Evidências / issues | E2E bloqueado sem sessão autenticada interativa. Rotas /assinatura, /checkout, /checkout/confirmacao respondem 200. Ver `EXECUCAO-2026-07-14.md`. |

