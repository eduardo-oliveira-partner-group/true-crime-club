# True Crime Club

Front Office da plataforma True Crime Club, uma evolucao do site
[truecrime.club](https://www.truecrime.club/).

O projeto tem como objetivo entregar uma experiencia navegavel e responsiva
para a jornada publica de compra, assinatura, area do cliente, conteudos
exclusivos e integracoes com o backend.

## O que e o site

O True Crime Club e uma plataforma de assinatura e compra de boxes para fas de
true crime que transforma o consumo de conteudo em uma experiencia
investigativa, colecionavel e recorrente.

Mais do que uma loja, o site funciona como a porta de entrada para um clube: o
usuario descobre planos, compra boxes avulsas, acompanha pedidos, gerencia sua
assinatura e acessa conteudos exclusivos ligados a casos, pistas, arquivos e
progresso dentro da experiencia.

A proposta central e unir e-commerce premium, comunidade e narrativa de
investigacao. Cada box mensal deve parecer parte de um caso maior: objetos,
documentos, pistas, materiais colecionaveis e conteudos digitais que fazem o
assinante sentir que esta montando um dossie, acompanhando uma apuracao e
participando de algo reservado a quem esta dentro do clube.

## Vibe e direcao sensorial

A sensacao desejada e de entrar em uma investigacao sofisticada, misteriosa e
cuidadosamente curada, sem cair em um cenario caricato de crime.

O clima deve lembrar arquivo confidencial, mesa de investigacao, evidencias bem
organizadas, pistas reveladas aos poucos e uma comunidade de pessoas obcecadas
por detalhes.

A experiencia deve equilibrar:

- Misterio com clareza: atmosfera intrigante, mas navegacao simples e objetiva.
- Investigacao com premium: estetica de dossie, evidencia, arquivo e caso
  aberto, com acabamento moderno, limpo e profissional.
- Tensao com seguranca: suspense e descoberta no tema, mas confianca,
  organizacao e credibilidade na jornada de compra.
- Exclusividade com pertencimento: sensacao de entrar em um clube restrito, com
  acesso a itens, pistas e conteudos que nao estao disponiveis para qualquer
  pessoa.
- Storytelling com conversao: cada pagina deve conduzir o visitante como uma
  pista leva a proxima, sem atrapalhar acoes essenciais como assinar, comprar,
  acompanhar pedido ou acessar conteudo.

Frase-guia:

> O True Crime Club e uma experiencia premium de assinatura para fas de true
> crime, onde cada box funciona como uma entrega de evidencias, cada conteudo
> aprofunda a investigacao e cada assinante participa de uma narrativa coletiva
> de misterio, descoberta e colecao.

## Escopo do front office

O frontend deve permitir:

- Home, vitrine de produtos e boxes.
- Detalhes de produto ou box.
- Planos de assinatura.
- Carrinho, checkout e confirmacao de pedido.
- Login, cadastro e recuperacao de senha.
- Area do cliente com pedidos, assinatura, financeiro e conteudos exclusivos.
- Fluxos de assinatura, pagamento, cancelamento, reativacao e conteudos
  bloqueados/liberados.
- Estrutura preparada para SEO, APIs e conteudos dinamicos gerenciados via
  Backoffice.

## Desenvolvimento

Este projeto usa Next.js com shadcn/ui.

Antes de implementar alteracoes em APIs, estrutura de rotas ou convencoes do
Next.js, consulte a documentacao local em `node_modules/next/dist/docs/`, pois a
versao utilizada pode ter diferencas relevantes em relacao a versoes anteriores.

### Adicionar componentes

```bash
npx shadcn@latest add button
```

### Usar componentes

```tsx
import { Button } from "@/components/ui/button";
```

### Configuração de Ambiente

Por padrão, a aplicação exige que a variável `NEXT_PUBLIC_API_BASE_URL` esteja configurada apontando para um backend de API ativo.

A sessão é emitida exclusivamente pela FastAPI como cookie `HttpOnly`; o
frontend não armazena ou interpreta tokens. Em desenvolvimento, use o mesmo
hostname para front e API em uma execução — por exemplo,
`http://127.0.0.1:3000` com `http://127.0.0.1:8001/api`, ou `localhost` nos
dois. Não misture `localhost` e `127.0.0.1`, pois isso impede o envio do cookie
com `SameSite=Lax`.

Uma topologia de produção com front e API em sites diferentes exige decisão de
cookie cross-site (`SameSite=None; Secure`) e proteção CSRF antes do rollout.

Páginas CMS (home, FAQ, rotas dinâmicas) usam `CMS_DELIVERY_BASE_URL` quando
configurada; sem ela, o frontend cai no conteúdo CMS mock local
(`src/lib/domain/cms-mock-data.ts`).

Para validar os estados de erro de carregamento em desenvolvimento, acesse
`/loja`, `/cliente/pedidos` ou `/cliente/assinatura` com o parâmetro
`?simularErroApi=true`. A chamada HTTP continua sendo realizada pelo navegador
e, após a resposta, a simulação devolve erro `503` apenas para a chamada de
listagem correspondente e não é habilitada em produção.

### Testes

A suíte usa Vitest para regras e componentes isolados e Playwright para os
fluxos completos de tela. Os testes E2E iniciam automaticamente o Next.js e uma
API HTTP mockada em `127.0.0.1`, incluindo autenticação por cookie `HttpOnly`.
Não é necessário manter o backend real em execução.

Na primeira execução, instale o navegador do Playwright:

```bash
pnpm exec playwright install chromium
```

Comandos disponíveis:

```bash
pnpm test             # unitários + E2E
pnpm test:unit        # Vitest
pnpm test:unit:watch  # Vitest em modo watch
pnpm test:e2e         # Playwright headless
pnpm test:e2e:ui      # Playwright com interface
pnpm test:e2e:update  # atualiza as referências visuais
```

Os artefatos de falha ficam em `test-results/`; o relatório navegável do
Playwright fica em `playwright-report/`.
