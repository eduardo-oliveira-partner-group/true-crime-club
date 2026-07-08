# Plano 007: Fechamento de Catalogo/Planos e Fallback Intencional

Este plano fecha a fatia de Catalogo + Planos ja migrada para API-first.

## Objetivo

Eliminar o fallback barulhento no build e validar a experiencia real com API rodando, mantendo mocks locais como fallback quando a API nao estiver configurada.

## Escopo

Inclui:

- Smoke test das telas de catalogo e planos com API local.
- Ajuste do comportamento de fallback para evitar `ECONNREFUSED` esperado durante build sem API publicada.
- Validacao visual das telas publicas afetadas.

Fora de escopo:

- Carrinho.
- Checkout.
- Area do cliente.
- Remocao dos mocks.

## Etapas executaveis

1. Confirmar que `NEXT_PUBLIC_API_BASE_URL` esta configurado para `http://localhost:8000/api` no ambiente local quando a API estiver rodando.
2. Validar manualmente:
   - `/loja`
   - `/loja/tcc-caixa-01-avulsa`
   - `/assinatura`
   - secao de planos da landing.
3. Ajustar a camada de dados para:
   - usar mock direto quando API nao estiver configurada;
   - tentar fetch apenas quando API estiver configurada;
   - logar fallback somente quando uma API configurada falhar.
4. Garantir que `pnpm build` nao exiba erros esperados de conexao recusada em ambiente mock.
5. Rodar verificacoes.

## Verificacao

```bash
pnpm typecheck
pnpm build
```

## Recomendacao de execucao

Executar tudo de uma vez antes de abrir carrinho. Esta etapa reduz ruido e melhora confianca no build.

