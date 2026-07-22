# FO-004 — Pagamento com Cartão (Front)

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: FO-002
- **Category**: validation / checkout-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-004-pagamento-cartao.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → INCONCLUSIVO
- **Reconcile 2026-07-22 @ `3c431e5`**: nota SSR obsoleta — `/checkout` é client-side; **retest** necessário

## Objetivo

Validar checkout UI escolhendo cartão até a tela de sucesso.

## Fluxo

Escolher Assinatura → Checkout → Cartão → Pagamento → Sucesso

## Passos manuais

1. Escolher plano em `/assinatura`.
2. Autenticar se necessário.
3. Em `/checkout`, selecionar método **cartão**.
4. Preencher dados do cartão (mock) / selecionar cartão salvo.
5. Confirmar pagamento.
6. Verificar `/checkout/confirmacao` e, se aplicável, pedido em `/cliente/pedidos`.

## Critérios de aceite

- [ ] Opção cartão visível e selecionável
- [ ] Validação de campos obrigatórios antes do submit
- [ ] Sucesso navega para confirmação com resumo
- [ ] Erro de API (recusa mock) exibe `motivoRecusa` ou mensagem amigável

## Verificação

```bash
pnpm typecheck
# Network: POST /finalizacao/pedido com idMetodoPagamento de cartão
```

## Resultado

| Campo | Valor |
|-------|-------|
| Executado em | 2026-07-14 |
| Modo | API remota (`tcc-front-office-api.vercel.app`) via front local `:3000` |
| Passou? | INCONCLUSIVO |
| Evidências / issues | 07-14: CheckoutStepper trata credit_card; SSR /checkout sem paymentMethods. **Drift @ `3c431e5`**: checkout carrega perfil via `apiClient.customer.getProfile()` no client (sessão Bearer/cookie). Reexecutar com sessão válida. |

