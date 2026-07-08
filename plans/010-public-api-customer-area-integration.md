# Plano 010: Integracao Publica da Area do Cliente

Este plano deve ser executado depois de carrinho e checkout.

## Objetivo

Migrar a area do cliente para a API publica, preservando mocks locais enquanto a API nao estiver publicada e deixando claro o limite da autenticacao mockada.

## Escopo

Inclui:

- Login/cadastro/cliente atual mockado.
- Perfil.
- Pedidos.
- Assinatura.
- Financeiro.
- Conteudos exclusivos.
- Casos/progresso.

Fora de escopo:

- Autenticacao real.
- Recuperacao de senha real.
- Gateway de pagamento.
- Persistencia real.
- Back office administrativo.

## Etapas executaveis

1. Atualizar `docs/openapi.yaml` com os contratos de area do cliente validados pela API.
2. Criar/adaptar camadas API-first para:
   - auth;
   - cliente/perfil;
   - pedidos;
   - assinatura;
   - financeiro;
   - conteudos/casos.
3. Migrar telas por subfatias:
   - login e perfil;
   - pedidos e detalhes;
   - assinatura e cancelamento;
   - financeiro;
   - conteudos exclusivos e casos.
4. Garantir estados:
   - nao autenticado;
   - carregando;
   - erro;
   - lista vazia;
   - conteudo bloqueado;
   - sessao mock expirada/invalida.
5. Manter avisos de mock somente onde forem relevantes para o usuario.
6. Rodar verificacoes.

## Verificacao

```bash
pnpm typecheck
pnpm build
```

## Recomendacao de execucao

Executar por subfatias, nao tudo de uma vez:

1. Auth/perfil.
2. Pedidos/financeiro.
3. Assinatura.
4. Conteudos/casos.

