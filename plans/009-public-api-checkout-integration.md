# Plano 009: Integracao Publica de Checkout

Este plano vem depois do carrinho e migra frete/finalizacao para a API publica.

## Objetivo

Fazer o checkout consumir `tcc-front-office-api` para calcular frete e criar pedido mockado com resposta estavel para a tela de confirmacao.

## Escopo

Inclui:

- Pagina `/checkout`.
- Calculo de frete.
- Criacao de pedido.
- Pagina `/checkout/confirmacao`.
- Estados de loading, erro, carrinho vazio e sucesso.

Fora de escopo:

- Pagamento real.
- Gateway.
- Antifraude.
- Nota fiscal.
- Area do cliente autenticada.

## Etapas executaveis

1. Atualizar `docs/openapi.yaml` com contrato real de frete e pedido.
2. Criar camada API-first de checkout usando `apiClient.checkout` com fallback mock.
3. Migrar calculo de frete na UI.
4. Migrar criacao de pedido.
5. Persistir o resultado mockado necessario para a pagina de confirmacao enquanto nao houver backend publicado.
6. Garantir estados:
   - frete carregando;
   - frete invalido;
   - erro ao criar pedido;
   - carrinho vazio;
   - confirmacao sem pedido recente.
7. Rodar verificacoes.

## Verificacao

```bash
pnpm typecheck
pnpm build
```

## Recomendacao de execucao

Executar apenas depois do Plano 008. Separar em dois blocos: frete primeiro, finalizacao depois.

