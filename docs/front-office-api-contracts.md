# Contratos de API Futuros — Front Office

> Especifica as APIs necessárias para substituir os mocks do Front Office por
> um backend real. Cada API mapeia a função de repositório em
> `src/lib/domain/repositories.ts` que hoje a atende, para que a substituição
> seja direta.

Convenções por API:

- **Método** e **Endpoint** sugeridos.
- **Descrição** do objetivo.
- **Usada em** — rota(s) que consomem a API.
- **Substitui** — função mockada em `repositories.ts`.
- **Request** / **Response** — exemplos JSON.
- **Erros** — códigos HTTP e causas.
- **Regras de negócio** — observações relevantes (ciclo cobrança×envio,
  permanência, etc.).

URL base sugerida: `https://api.truecrimeclub.com.br/v1`.

---

## Cliente

### Criar conta

- **Método:** `POST`
- **Endpoint:** `/clientes`
- **Descrição:** Cria uma nova conta de cliente.
- **Usada em:** `/cadastro`
- **Substitui:** (mock futuro)

Request:

```json
{
  "nome": "Mariana Silva",
  "email": "mariana.silva@email.com",
  "senha": "segredoforte",
  "telefone": "(11) 98765-4321"
}
```

Response `201`:

```json
{
  "id": "cust-001",
  "nome": "Mariana Silva",
  "email": "mariana.silva@email.com",
  "telefone": "(11) 98765-4321"
}
```

Erros:

- `400` — Dados inválidos (e-mail malformado, senha fraca).
- `409` — E-mail já cadastrado.

Regras de negócio:

- E-mail é único.
- Senha deve atender política mínima (a definir com segurança).

### Login

- **Método:** `POST`
- **Endpoint:** `/clientes/login`
- **Descrição:** Autentica o cliente e emite sessão/token.
- **Usada em:** `/login`
- **Substitui:** (mock futuro)

Request:

```json
{ "email": "mariana.silva@email.com", "senha": "segredoforte" }
```

Response `200`:

```json
{ "token": "jwt_exemplo", "cliente": { "id": "cust-001", "nome": "Mariana Silva" } }
```

Erros:

- `401` — Credenciais inválidas.
- `429` — Muitas tentativas (rate limit).

### Recuperar senha

- **Método:** `POST`
- **Endpoint:** `/clientes/recuperar-senha`
- **Descrição:** Dispara e-mail de recuperação de senha.
- **Usada em:** `/recuperar-senha`
- **Substitui:** (mock futuro)

Request:

```json
{ "email": "mariana.silva@email.com" }
```

Response `202`:

```json
{ "status": "email_enviado" }
```

Erros:

- `400` — E-mail inválido.
- `404` — E-mail não encontrado (opcional, conforme política de privacidade).

### Atualizar dados cadastrais

- **Método:** `PATCH`
- **Endpoint:** `/clientes/{id}`
- **Descrição:** Atualiza dados do cliente e preferências do assinante.
- **Usada em:** `/checkout` (preferências), `/cliente`
- **Substitui:** `getCurrentCustomer`, `updateSubscriberPreferences`

Request:

```json
{
  "telefone": "(11) 98765-4321",
  "preferencias": { "tamanhoCamiseta": "M", "tamanhoCalcado": "38", "notas": "Prefere tons escuros." }
}
```

Response `200`:

```json
{
  "id": "cust-001",
  "nome": "Mariana Silva",
  "email": "mariana.silva@email.com",
  "telefone": "(11) 98765-4321",
  "preferencias": { "tamanhoCamiseta": "M", "tamanhoCalcado": "38", "notas": "Prefere tons escuros." }
}
```

Erros:

- `400` — Dados inválidos.
- `401` — Não autenticado.
- `404` — Cliente não encontrado.

### Listar endereços

- **Método:** `GET`
- **Endpoint:** `/clientes/{id}/enderecos`
- **Descrição:** Lista endereços de entrega do cliente.
- **Usada em:** `/checkout`, `/cliente`
- **Substitui:** `listAddresses`

Response `200`:

```json
[
  {
    "id": "addr-001",
    "rotulo": "Casa",
    "rua": "Rua das Acácias",
    "numero": "142",
    "complemento": "Apto 82",
    "bairro": "Vila Madalena",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "05435-020",
    "principal": true
  }
]
```

Erros:

- `401` — Não autenticado.
- `404` — Cliente não encontrado.

### Criar/editar/remover endereço

- **Método:** `POST` / `PATCH` / `DELETE`
- **Endpoint:** `/clientes/{id}/enderecos` e `/clientes/{id}/enderecos/{enderecoId}`
- **Descrição:** CRUD de endereço de entrega.
- **Usada em:** `/checkout`, `/cliente`
- **Substitui:** (mock futuro)

Erros:

- `400` — Dados inválidos (CEP inválido, campos obrigatórios).
- `401` — Não autenticado.
- `404` — Endereço não encontrado.

---

## Catálogo

### Listar produtos

- **Método:** `GET`
- **Endpoint:** `/produtos`
- **Descrição:** Lista produtos e boxes, com filtros opcionais.
- **Usada em:** `/loja`, `/`, `/assinatura`
- **Substitui:** `listProducts`

Query params: `?destaque=true&categoria=box`

Response `200`:

```json
[
  {
    "id": "prod-005",
    "slug": "tcc-caixa-03-avulsa",
    "nome": "TCC - CAIXA 03 (AVULSA)",
    "tipo": "box",
    "preco": 18990,
    "precoAssinante": 15990,
    "disponibilidade": "limited",
    "emEstoque": true,
    "categorias": ["box", "avulsa"],
    "imagens": ["products/box-03.jpg"],
    "mesEdicao": "2026-03",
    "ciclo": 3
  }
]
```

Erros:

- `400` — Filtros inválidos.

### Detalhar produto

- **Método:** `GET`
- **Endpoint:** `/produtos/{slug}`
- **Descrição:** Detalha um produto/box.
- **Usada em:** `/loja/[slug]`
- **Substitui:** `getProductBySlug`

Response `200`:

```json
{
  "id": "prod-005",
  "slug": "tcc-caixa-03-avulsa",
  "nome": "TCC - CAIXA 03 (AVULSA)",
  "descricao": "Terceira caixa avulsa da coleção...",
  "descricaoCurta": "Caixa avulsa 03 da coleção True Crime Club.",
  "tipo": "box",
  "preco": 18990,
  "precoAssinante": 15990,
  "disponibilidade": "limited",
  "emEstoque": true,
  "categorias": ["box", "avulsa"],
  "imagens": ["products/box-03.jpg"],
  "itensInclusos": ["Box temática avulsa", "Preço de assinante R$159,90", "Estoque limitado"],
  "mesEdicao": "2026-03",
  "ciclo": 3,
  "relacionados": ["prod-002", "prod-006"]
}
```

Erros:

- `404` — Produto não encontrado.

### Listar planos de assinatura

- **Método:** `GET`
- **Endpoint:** `/planos`
- **Descrição:** Lista planos de assinatura (mensal, anual, avulso).
- **Usada em:** `/assinatura`, `/`, `/checkout`
- **Substitui:** `listPlans`, `getPlanBySlug`

Response `200`:

```json
[
  {
    "id": "plan-annual",
    "slug": "anual",
    "nome": "Plano Anual",
    "descricao": "Melhor custo-benefício...",
    "intervaloCobranca": "annual",
    "preco": 143880,
    "precoPorMes": 11990,
    "recomendado": true,
    "permanenciaMeses": 12,
    "beneficios": ["Tudo do plano mensal", "Economia equivalente a 2 meses"]
  }
]
```

---

## Carrinho e Checkout

### Obter carrinho

- **Método:** `GET`
- **Endpoint:** `/carrinho`
- **Descrição:** Retorna o carrinho atual do cliente (sessão ou anônimo).
- **Usada em:** `/carrinho`, `/checkout`
- **Substitui:** `getCart`

Response `200`:

```json
{
  "id": "cart-001",
  "itens": [
    {
      "id": "ci-001",
      "produtoId": "prod-005",
      "slug": "tcc-caixa-03-avulsa",
      "nome": "TCC - CAIXA 03 (AVULSA)",
      "tipo": "box",
      "quantidade": 1,
      "precoUnitario": 15990,
      "imagem": "products/box-03.jpg"
    }
  ],
  "cupom": "BEMVINDO10",
  "descontoCupom": 1000
}
```

### Adicionar item

- **Método:** `POST`
- **Endpoint:** `/carrinho/itens`
- **Usada em:** `/loja/[slug]`
- **Substitui:** `addCartItem`

Request:

```json
{ "produtoId": "prod-005", "quantidade": 1 }
```

Erros:

- `400` — Produto inválido.
- `409` — Produto indisponível (`availability: out_of_stock`).

### Atualizar/remover item

- **Método:** `PATCH` / `DELETE`
- **Endpoint:** `/carrinho/itens/{itemId}`
- **Usada em:** `/carrinho`
- **Substitui:** `updateCartItemQuantity`, `removeCartItem`

Request (`PATCH`):

```json
{ "quantidade": 2 }
```

### Calcular frete

- **Método:** `GET`
- **Endpoint:** `/frete?cep={cep}`
- **Usada em:** `/carrinho`, `/checkout`
- **Substitui:** `calculateShipping`

Response `200`:

```json
{ "regiao": "CEP 05435-020", "preco": 0, "prazo": "5–8 dias úteis" }
```

Erros:

- `400` — CEP inválido.

### Aplicar cupom

- **Método:** `POST`
- **Endpoint:** `/carrinho/cupom`
- **Usada em:** `/carrinho`
- **Substitui:** `applyCoupon`

Request:

```json
{ "codigo": "BEMVINDO10" }
```

Response `200`:

```json
{ "valido": true, "codigo": "BEMVINDO10", "desconto": 1000, "mensagem": "Cupom aplicado com sucesso." }
```

Erros:

- `400` — Cupom inválido/expirado (retorna `valido: false`).

### Criar pedido

- **Método:** `POST`
- **Endpoint:** `/pedidos`
- **Descrição:** Cria o pedido a partir do carrinho (ou do plano, no fluxo de
  assinatura). Retorna o pedido com ciclo de cobrança×envio.
- **Usada em:** `/checkout`
- **Substitui:** `createOrder`

Request:

```json
{
  "enderecoId": "addr-001",
  "frete": 1990,
  "pagamento": { "metodoId": "pm-001" },
  "planoId": "plan-annual"
}
```

Response `201`:

```json
{
  "id": "ord-003",
  "numero": "TCC-202604-0043",
  "status": "paid",
  "statusPagamento": "paid",
  "subtotal": 14990,
  "frete": 1990,
  "desconto": 0,
  "total": 16980,
  "notaCobranca": "Cobrança processada no mês da compra.",
  "notaEnvio": "Envio previsto para o mês seguinte — o rastreio será enviado por e-mail após o despacho.",
  "rastreio": null
}
```

Erros:

- `400` — Carrinho vazio / dados inválidos.
- `402` — Pagamento recusado ( gateway).
- `409` — Conflito de estoque.

Regras de negócio:

- **Ciclo cobrança×envio:** cobra no mês da compra, envia no mês seguinte.
  Comunicar em `notaCobranca` e `notaEnvio`.
- Após criar o pedido, o carrinho é esvaziado.

### Iniciar pagamento

- **Método:** `POST`
- **Endpoint:** `/pedidos/{id}/pagamento`
- **Descrição:** Inicia o pagamento (cartão ou Pix) do pedido.
- **Usada em:** `/checkout`
- **Substitui:** (mock futuro; hoje `createOrder` já retorna status)

Request:

```json
{ "metodo": "credit_card", "cartao": { "token": "tok_exemplo" } }
```

Response `200`:

```json
{ "status": "paid", "pagamentoId": "pay-005" }
```

Erros:

- `402` — Pagamento recusado.
- `410` — Pix expirado.

---

## Pedidos

### Listar pedidos

- **Método:** `GET`
- **Endpoint:** `/clientes/{id}/pedidos`
- **Usada em:** `/cliente/pedidos`, `/checkout/confirmacao`
- **Substitui:** `listOrders`

Response `200`:

```json
[
  {
    "id": "ord-001",
    "numero": "TCC-202603-0042",
    "status": "awaiting_shipment",
    "statusPagamento": "paid",
    "total": 14990,
    "criadoEm": "2026-03-15T14:30:00.000Z",
    "notaCobranca": "Cobrança processada em março de 2026.",
    "notaEnvio": "Envio previsto para abril de 2026..."
  }
]
```

### Detalhar pedido

- **Método:** `GET`
- **Endpoint:** `/pedidos/{id}`
- **Usada em:** `/cliente/pedidos/[id]`
- **Substitui:** `getOrderById`

Response `200`: igual ao de "Criar pedido" + `itens`.

Erros:

- `401` — Não autenticado.
- `403` — Pedido não pertence ao cliente.
- `404` — Pedido não encontrado.

### Consultar rastreamento

- **Método:** `GET`
- **Endpoint:** `/pedidos/{id}/rastreio`
- **Usada em:** `/cliente/pedidos/[id]`
- **Substitui:** (mock futuro; hoje o pedido já traz `trackingCode`/`trackingUrl`)

Response `200`:

```json
{ "codigo": "BR123456789BR", "url": "https://rastreamento.mock/tcc/BR123456789BR" }
```

### Consultar nota fiscal

- **Método:** `GET`
- **Endpoint:** `/pedidos/{id}/nota-fiscal`
- **Usada em:** `/cliente/pedidos/[id]`
- **Substitui:** (mock futuro; hoje o pedido traz `invoicePlaceholder`)

Response `200`:

```json
{ "numero": "NF-202603-0042", "url": "/mock/receipts/nf.pdf" }
```

---

## Assinatura

### Consultar assinatura ativa

- **Método:** `GET`
- **Endpoint:** `/clientes/{id}/assinatura`
- **Usada em:** `/cliente/assinatura`, `/cliente`
- **Substitui:** `getSubscription`

Response `200`:

```json
{
  "id": "sub-001",
  "planoId": "plan-monthly",
  "planoNome": "Plano Mensal",
  "status": "active",
  "inicio": "2025-12-01T00:00:00.000Z",
  "proximaCobranca": "2026-04-01T00:00:00.000Z",
  "valorProximaCobranca": 14990,
  "boxCicloAtual": { "id": "prod-001", "nome": "Box Edição Março 2026 — Sombras do Passado" },
  "podeCancelar": true,
  "podeReativar": false
}
```

Erros:

- `404` — Cliente sem assinatura.

### Cancelar assinatura

- **Método:** `POST`
- **Endpoint:** `/clientes/{id}/assinatura/cancelar`
- **Usada em:** `/cliente/assinatura/cancelar`
- **Substitui:** `cancelSubscription`

Response `200`:

```json
{ "status": "cancelled", "canceladoEm": "2026-04-02T10:00:00.000Z", "podeReativar": true }
```

Erros:

- `409` — Não cancelável (ex.: plano anual dentro da permanência).

Regras de negócio:

- Plano mensal: cancelável a qualquer momento.
- Plano anual: permanência de 12 meses; cancelamento só após o período.

### Reativar assinatura

- **Método:** `POST`
- **Endpoint:** `/clientes/{id}/assinatura/reativar`
- **Usada em:** `/cliente/assinatura/cancelar`
- **Substitui:** `reactivateSubscription`

Response `200`:

```json
{ "status": "active", "podeCancelar": true }
```

Erros:

- `409` — Não reativável.

---

## Pagamentos

### Listar cobranças

- **Método:** `GET`
- **Endpoint:** `/clientes/{id}/pagamentos`
- **Usada em:** `/cliente/financeiro`
- **Substitui:** `listPayments`

Response `200`:

```json
[
  {
    "id": "pay-001",
    "assinaturaId": "sub-001",
    "valor": 14990,
    "status": "paid",
    "metodo": "credit_card",
    "vencimento": "2026-03-01T00:00:00.000Z",
    "pagoEm": "2026-03-01T08:12:00.000Z"
  }
]
```

### Detalhar cobrança

- **Método:** `GET`
- **Endpoint:** `/pagamentos/{id}`
- **Usada em:** `/cliente/financeiro`
- **Substitui:** (mock futuro)

Response `200`: igual ao item de "Listar cobranças" + `pixQrCode`/`pixExpiresAt`
quando Pix.

### Definir cartão padrão

- **Método:** `PATCH`
- **Endpoint:** `/cliente/cartoes/{id}`
- **Usada em:** `/cliente/cartoes`
- **Substitui:** `updateCard`

Request:

```json
{ "padrao": true }
```

Response `200`:

```json
{ "id": "pm-001", "rotulo": "Visa terminando em 4242", "bandeira": "Visa", "principal": true }
```

### Renovar pagamento Pix

- **Método:** `POST`
- **Endpoint:** `/pagamentos/{id}/renovar-pix`
- **Usada em:** `/cliente/financeiro`
- **Substitui:** `renewPixPayment`

Response `200`:

```json
{
  "id": "pay-004",
  "status": "pending",
  "pixQrCode": "00020126580014BR.GOV.BCB.PIX0136...",
  "pixExpiresAt": "2026-04-01T23:59:00.000Z"
}
```

Erros:

- `409` — Pagamento já pago.
- `410` — Pagamento expirado definitivamente.

### Listar faturas

- **Método:** `GET`
- **Endpoint:** `/clientes/{id}/faturas`
- **Usada em:** `/cliente/financeiro`
- **Substitui:** `listInvoices`

Response `200`:

```json
[
  {
    "id": "inv-001",
    "numero": "REC-202603-0042",
    "pagamentoId": "pay-001",
    "valor": 14990,
    "emitidoEm": "2026-03-01T08:15:00.000Z",
    "urlRecibo": "/mock/receipts/rec-202603-0042.pdf"
  }
]
```

---

## Conteúdo

### Listar conteúdos disponíveis

- **Método:** `GET`
- **Endpoint:** `/conteudos`
- **Usada em:** `/cliente/conteudos`
- **Substitui:** `listExclusiveContent`

Query params: `?caseId=case-2026`

Response `200`:

```json
[
  {
    "id": "clue-003",
    "slug": "pista-ciclo-3",
    "titulo": "Ciclo 3 — Registro bancário",
    "descricao": "Extrato parcial...",
    "tipo": "clue",
    "ciclo": 3,
    "status": "liberado",
    "arquivos": [
      { "id": "file-003", "nome": "extrato-parcial.pdf", "tipo": "pdf", "url": "/mock/files/extrato-parcial.pdf", "tamanho": "180 KB" }
    ]
  }
]
```

### Detalhar conteúdo

- **Método:** `GET`
- **Endpoint:** `/conteudos/{slug}`
- **Usada em:** `/cliente/conteudos/[slug]`
- **Substitui:** `getExclusiveContentBySlug`, `getClueBySlug`

Erros:

- `403` — Conteúdo bloqueado para o ciclo atual do assinante.
- `404` — Conteúdo não encontrado.

### Listar arquivos de um conteúdo

- **Método:** `GET`
- **Endpoint:** `/conteudos/{slug}/arquivos`
- **Usada em:** `/cliente/conteudos/[slug]`
- **Substitui:** (mock futuro; hoje vem embutido no conteúdo)

### Consultar progresso do assinante

- **Método:** `GET`
- **Endpoint:** `/clientes/{id}/progresso?caseId={caseId}`
- **Usada em:** `/cliente/conteudos`, `/`
- **Substitui:** `getSubscriberProgress`

Response `200`:

```json
{
  "caseId": "case-2026",
  "pistasColetadas": 3,
  "totalPistas": 12,
  "cicloAtual": 3,
  "eventoAoVivo": { "data": "2027-01-15T20:00:00.000Z", "titulo": "Grande Revelação — Operação Meia-Noite" },
  "percentualConcluido": 25
}
```

### Listar casos ativos

- **Método:** `GET`
- **Endpoint:** `/casos`
- **Usada em:** `/`, `/cliente/conteudos`
- **Substitui:** `getActiveCase`, `listClues`

Response `200`:

```json
[
  {
    "id": "case-2026",
    "slug": "operacao-meia-noite",
    "titulo": "Operação Meia-Noite",
    "descricao": "Caso fictício investigado coletivamente...",
    "ano": 2026,
    "totalPistas": 12,
    "eventoAoVivo": { "data": "2027-01-15T20:00:00.000Z", "titulo": "Grande Revelação — Operação Meia-Noite" }
  }
]
```

---

## Dynamic Content

APIs para que o Backoffice gerencie textos, banners, imagens e demais blocos
editáveis consumidos pelo Front Office. Hoje o Front consome
`getDynamicContent(key)` e `getDynamicContentByRoute(route)`.

### Listar blocos dinâmicos

- **Método:** `GET`
- **Endpoint:** `/conteudo-dinamico?rota={rota}`
- **Descrição:** Lista blocos de conteúdo dinâmico, opcionalmente filtrados por rota.
- **Usada em:** todas as páginas públicas e área do cliente.
- **Substitui:** `getDynamicContentByRoute`

Response `200`:

```json
[
  { "chave": "home.hero.title", "tipo": "text", "valor": "Investigue. Colete. Desvende.", "rota": "/" }
]
```

### Obter bloco dinâmico

- **Método:** `GET`
- **Endpoint:** `/conteudo-dinamico/{chave}`
- **Usada em:** todas as páginas.
- **Substitui:** `getDynamicContent`

Response `200`:

```json
{ "chave": "home.hero.title", "tipo": "text", "valor": "Investigue. Colete. Desvende.", "rota": "/" }
```

Erros:

- `404` — Chave não encontrada.

### Atualizar bloco dinâmico (Backoffice)

- **Método:** `PUT`
- **Endpoint:** `/conteudo-dinamico/{chave}`
- **Descrição:** Atualiza um bloco de conteúdo dinâmico. Restrito ao Backoffice.
- **Usada em:** Backoffice (fora do Front Office).
- **Substitui:** (sem mock no Front; apenas leitura)

Request:

```json
{ "tipo": "text", "valor": "Novo título do hero", "rota": "/" }
```

Response `200`:

```json
{ "chave": "home.hero.title", "tipo": "text", "valor": "Novo título do hero", "rota": "/" }
```

Erros:

- `401` / `403` — Sem permissão de Backoffice.
- `404` — Chave não encontrada.

### Listar entradas de SEO

- **Método:** `GET`
- **Endpoint:** `/seo?rota={rota}`
- **Descrição:** Retorna metadados de SEO por rota (título, descrição, canonical, OG).
- **Usada em:** todas as páginas públicas.
- **Substitui:** `getSeoEntry`

Response `200`:

```json
[
  { "rota": "/", "titulo": "True Crime Club — Clube de assinatura de mistério", "descricao": "Assine e receba mensalmente...", "noindex": false }
]
```

### Atualizar entrada de SEO (Backoffice)

- **Método:** `PUT`
- **Endpoint:** `/seo/{rota}`
- **Descrição:** Atualiza a entrada de SEO de uma rota. Restrito ao Backoffice.
- **Substitui:** (sem mock no Front; apenas leitura)

Request:

```json
{ "titulo": "True Crime Club — Clube de assinatura", "descricao": "Nova descrição." }
```

Erros:

- `401` / `403` — Sem permissão de Backoffice.

---

## Observações gerais

- Todas as APIs autenticadas devem validar a sessão do cliente e o ownership
  do recurso (pedido, assinatura, endereço, etc.).
- Os mocks em `src/lib/domain/mock-data.ts` já estão no formato esperado das
  respostas — a substituição deve preservar os contratos para não reescrever
  as páginas.
- Os cenários de erro em `src/lib/domain/scenarios.ts` (payment_refused,
  pix_pending, subscription_cancelled, blocked, etc.) espelham os estados de
  erro esperados das APIs reais e servem de guia para testes de backend.
