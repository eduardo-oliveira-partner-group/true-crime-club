# FO-005 — Pagamento com Pix (Front)

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: FO-002
- **Category**: validation / checkout-ui
- **Pareado com**: `tcc-front-office-api/plans/validation/FO-005-pagamento-pix.md`
- **Planned at**: 2026-07-14
- **Última execução**: 2026-07-14 → INCONCLUSIVO

## Objetivo

Validar checkout UI com Pix, incluindo exibição de QR/código quando pendente.

## Fluxo

Escolher Assinatura → Checkout → Pix → Pagamento → Sucesso

## Passos manuais

1. Escolher plano → `/checkout`.
2. Selecionar **Pix**.
3. Confirmar.
4. Se status pendente: UI mostra QR ou código copia-cola (`pixQrCode`).
5. Fluxo de sucesso/confirmação acessível (ou instrução de aguardar pagamento mock).
6. Em financeiro (se houver): opção renovar Pix não quebra a tela.

## Critérios de aceite

- [ ] Método Pix selecionável
- [ ] UI trata ausência de QR sem crash
- [ ] Confirmação coerente com resposta da API
- [ ] Diferencia visualmente fluxo Pix vs cartão

## Verificação

```bash
pnpm typecheck
# Network: pedido com método pix; inspecionar campos pixQrCode / pixExpiraEm
```

## Resultado

| Campo | Valor |
|-------|-------|
| Executado em | 2026-07-14 |
| Modo | API remota (`tcc-front-office-api.vercel.app`) via front local `:3000` |
| Passou? | INCONCLUSIVO |
| Evidências / issues | Código do CheckoutStepper trata pix. Mesma limitação de SSR sem métodos de pagamento na sessão. Ver `EXECUCAO-2026-07-14.md`. |

