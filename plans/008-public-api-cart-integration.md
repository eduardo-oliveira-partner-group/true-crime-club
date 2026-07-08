# Plano 008: Integracao Publica de Carrinho

Este plano migra o carrinho do front office para a API publica, mantendo fallback mock.

## Objetivo

Fazer a experiencia de carrinho consumir `tcc-front-office-api` para buscar carrinho, adicionar item, alterar quantidade, remover item e aplicar cupom.

## Escopo

Inclui:

- Pagina de carrinho.
- Indicador de quantidade no header.
- Acoes de produto que adicionam item ao carrinho.
- Cupom no carrinho.
- Estados de loading, vazio, erro e item indisponivel.

Fora de escopo:

- Checkout.
- Frete.
- Criacao de pedido.
- Area do cliente.
- Pagamento.

## Etapas executaveis

1. Atualizar `docs/openapi.yaml` com o contrato real de carrinho validado pela API.
2. Criar camada API-first para carrinho usando `apiClient.cart` com fallback mock.
3. Migrar a pagina `/carrinho` e componentes relacionados para a nova camada.
4. Migrar acoes de adicionar/remover/alterar quantidade sem quebrar o fluxo mock local.
5. Garantir estados:
   - carrinho vazio;
   - carregando;
   - erro de API;
   - produto indisponivel;
   - cupom invalido;
   - cupom aplicado.
6. Rodar verificacoes.

## Verificacao

```bash
pnpm typecheck
pnpm build
```

## Recomendacao de execucao

Executar em dois blocos:

1. Contrato e camada de dados.
2. UI, estados e validacao.

