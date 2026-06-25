# Escopo Frontend — Front Office da Plataforma

## 1. Objetivo

Criar o frontend completo do **Front Office** da plataforma, com interface navegável, responsiva e totalmente mockada, permitindo validar experiência, fluxos, regras de negócio e necessidades futuras de integração com backend.

O frontend deverá ser desenvolvido com dados mockados, porém com a estrutura preparada para futura integração com APIs reais.

Além disso, o frontend deve considerar desde o início que conteúdos como textos, banners, imagens e demais elementos visuais poderão ser gerenciados pelo time de Design via Backoffice no futuro, exigindo uma arquitetura preparada para conteúdo dinâmico.

# Responsabilidades e Handoff

## Responsabilidade do Designer

O Designer será responsável por definir:

- Experiência visual das telas.
- Hierarquia das informações.
- Textos comerciais e institucionais.
- Banners, imagens e elementos visuais.
- Mapa de conteúdos editáveis pelo Backoffice.

## Responsabilidade do Frontend

O Frontend será responsável por:

- Implementar as telas.
- Criar rotas e navegação.
- Criar componentes reutilizáveis.
- Implementar mocks.
- Simular os fluxos principais.
- Documentar APIs futuras.
- Preparar a estrutura para consumo de dados reais.
- Preparar a estrutura para consumo de conteúdos dinâmicos via APIs futuras.

## Handoff obrigatório

O Designer deverá entregar para o Frontend:

- Mockup.
- Layout desktop e mobile.
- Textos e imagens utilizadas.
- Mapa de conteúdos dinâmicos.
- Regras visuais de responsividade.

O Frontend deverá entregar ao Backend:

- Lista de APIs necessárias.
- Contratos esperados de request/response.
- Estrutura dos dados mockados.
- Mapa dos conteúdos dinâmicos que precisarão ser gerenciados no Backoffice.

---

# 2. Escopo Geral

O trabalho contempla:

- Design das telas do Front Office.
- Implementação frontend das telas.
- Navegação entre páginas.
- Fluxos simulados com dados mockados.
- Componentização da interface.
- Responsividade desktop/mobile.
- Documentação das APIs necessárias para backend futuro.
- Mapeamento dos contratos esperados de request/response.
- Implementação da estrutura completa de SEO.
- Definição, em conjunto com Design, dos conteúdos que deverão ser dinâmicos (textos, banners, imagens, etc.).
- Preparação do frontend para consumir conteúdos dinâmicos via APIs futuras.

---

# 3. Telas do Front Office

## 3.1 Loja

Responsável pela experiência pública de compra.

Telas previstas:

- Home
- Vitrine de produtos/boxes
- Página de Detalhes do Produto / Box
- Página de planos de assinatura
- Carrinho
- Checkout
- Confirmação de pedido

Fluxos contemplados:

- Compra de produto simples
- Compra de box avulsa
- Contratação de assinatura
- Aplicação de frete
- Escolha de pagamento
- Finalização do pedido

---

## 3.2 Área do Cliente

Área logada onde o cliente acompanha sua jornada.

Telas previstas:

- Login
- Recuperação de senha
- Cadastro
- Meus pedidos
- Minha assinatura
- Financeiro
- Conteúdos exclusivos (Gamificação)

---

## 3.3 Assinatura

Fluxos específicos da assinatura:

- Visualizar plano contratado
- Status da assinatura
- Próxima cobrança
- Box do ciclo atual
- Pagamento pendente
- Cancelamento de assinatura
- Reativação, se aplicável

---

Telas/áreas previstas:

- Histórico de cobranças
- Status de pagamento
- Faturas
- Recibos
- Pagamento recusado
- Reenvio/renovação de pagamento Pix
- Atualização de cartão

---

## 3.5 Conteúdo / Gamificação

Telas previstas:

- Área de casos
- Conteúdos liberados
- Conteúdos bloqueados
- Arquivos disponíveis
- Progresso do assinante

---

# 4. Diretrizes de UX/UI

A interface deve seguir o padrão visual validado na Home pública em `src/app/(front-office)/page.tsx`. Essa página é a base de estilização para os demais componentes e telas do Front Office: atmosfera escura e premium, linguagem de dossiê investigativo, imagens reais de produto/arquivo, overlays cinematográficos, grade sutil, acentos dourados/vermelhos e navegação clara.

Diretrizes gerais:

- Manter boa hierarquia visual e leitura rápida.
- Construir componentes reutilizáveis a partir da anatomia já usada na Home.
- Garantir experiência responsiva, com versões desktop e mobile planejadas.
- Priorizar clareza na jornada do cliente, especialmente em compra, assinatura, login, checkout e área logada.
- Definir estados bem legíveis: vazio, carregando, erro, sucesso, bloqueado, pendente, indisponível e recomendado.
- Preparar a estrutura para conteúdos dinâmicos definidos pelo Design (ex: textos editáveis, banners configuráveis, imagens substituíveis).
- Usar movimento e revelação progressiva para storytelling, sem atrapalhar fluxos transacionais.

Diretrizes visuais obrigatórias derivadas da Home:

- Paleta: fundo principal `#090807`, superfícies `#0b0908`, `#171211` e `#050403`, texto claro `#fffaf0`/`#f0e8dd`, texto secundário `#d7c9b5`, dourado `#d7b56d` e vermelho de ação `#d84132`.
- Seções: usar blocos full-width com bordas finas de baixa opacidade, containers `max-w-6xl`/`max-w-7xl`, overlays escuros e grades sutis de arquivo.
- Cards: tratar features, planos, produtos, passos e conteúdos como dossiês, com borda fina, cabeçalho técnico, ícone, label, código de referência, corpo com índice/preço/progresso e textura sutil.
- CTAs: usar vermelho para ação comercial principal, dourado para recomendação/premium e outline escuro/dourado para ações secundárias.
- Tipografia: títulos com `font-heading`, peso alto e hierarquia forte; metadados em uppercase com tracking amplo; códigos e referências podem usar `font-mono`.
- Iconografia: preferir Tabler Icons para ações, status e cabeçalhos de card.
- Imagens: priorizar fotos ou vídeos que mostrem box, produto, evidência, arquivo, mesa de investigação ou itens colecionáveis. Evitar imagens genéricas ou apenas atmosféricas quando o usuário precisar entender o produto.
- Movimento: reaproveitar padrões como `ScrollReveal`, `ScrollRevealGroup` e `TextGenerateEffect` em páginas editoriais; reduzir movimento em checkout, carrinho, login e área do cliente.

Referências externas continuam úteis para validar fluxo e conversão, mas não devem substituir a identidade visual da Home:

- https://www\.wine\.com\.br/ (referência para experiência de assinatura, storytelling de produto e jornada de compra)
- https://literaturaclassica\.com\.br (referência para apresentação de produtos, organização de catálogo e comunicação de valor)
- https://nerdaocubo\.com\.br (referência para experiência de box por assinatura, engajamento e construção de comunidade)

---

# 5. Dados Mockados

Toda a aplicação deverá funcionar com dados mockados.

O frontend deve simular:

- Produtos
- Boxes
- Planos de assinatura
- Cliente logado
- Pedidos
- Pagamentos
- Faturas
- Endereços
- Meios de pagamento
- Conteúdos
- Status de assinatura
- Status de pedido
- Status de pagamento
- Conteúdos dinâmicos (textos, banners, imagens) que futuramente serão gerenciados via Backoffice

Os mocks devem estar organizados de forma fácil de substituir posteriormente por chamadas reais de API.

---

# 6. APIs Futuras

O frontend deverá entregar uma documentação contendo todas as APIs necessárias para o backend.

Para cada API, especificar:

- Nome da API
- Método HTTP
- Endpoint sugerido
- Descrição
- Quando é usada
- Request esperado (com exemplo JSON)
- Response esperado (com exemplo JSON)
- Estados de erro (com códigos HTTP e exemplos)
- Observações de regra de negócio

Além disso, deverão ser previstas APIs específicas para gerenciamento de conteúdo dinâmico, permitindo que o Design possa atualizar textos, banners, imagens e outros elementos via Backoffice.

Exemplo de especificação:

### Criar Conta

- Método: POST
- Endpoint: /api/clientes
- Descrição: Cria uma nova conta de cliente

Request:

{

“email”: “joao@email.com”,

“senha”: “123456”

}

Response:

{

“id”: “123”,

“nome”: “João Silva”,

“email”: “joao@email.com”,

“token”: “jwt_token_exemplo”

}

Erros:

- 400: Dados inválidos
- 409: Email já cadastrado

---

Exemplos de grupos de APIs:

## Cliente

- Criar conta
- Login
- Recuperar senha
- Atualizar dados cadastrais
- Listar endereços
- Criar/editar/remover endereço

## Catálogo

- Listar produtos
- Detalhar produto
- Listar boxes
- Detalhar box
- Listar planos de assinatura

## Carrinho e Checkout

- Criar carrinho
- Adicionar item
- Remover item
- Calcular frete
- Aplicar cupom
- Criar pedido
- Iniciar pagamento

## Pedidos

- Listar pedidos do cliente
- Detalhar pedido
- Consultar rastreamento
- Consultar nota fiscal

## Assinatura

- Consultar assinatura ativa
- Consultar status da assinatura
- Consultar próxima cobrança
- Consultar box do ciclo
- Cancelar assinatura
- Reativar assinatura

## Pagamentos

- Listar cobranças
- Detalhar cobrança
- Atualizar cartão
- Consultar status do pagamento

## Conteúdo

- Listar conteúdos disponíveis
- Listar arquivos
- Consultar progresso do assinante
- Listar conteúdos dinâmicos (textos, banners, imagens)
- Atualizar conteúdos via Backoffice (previsto para backend)

---

# 7. Estrutura de SEO

O frontend/design deverá implementar uma estrutura completa de SEO para todas as páginas públicas, de preferencia avaliar o que tem no atual e manter.

Itens sugeridos:

- Meta title dinâmico por página
- Meta description
- Meta keywords (quando aplicável)
- Open Graph (og:title, og:description, og:image, og:type)
- Twitter Cards
- URL amigável (slug)
- Canonical URL
- Sitemap.xml
- Robots.txt
- Structured Data (JSON-LD) para:
    - Produtos
    - Breadcrumbs
- Breadcrumbs visíveis e estruturados
- Heading tags corretas (H1, H2, H3)
- Performance otimizada (Core Web Vitals)
- Lazy loading de imagens
- SSR ou pré-renderização quando aplicável
- Controle de indexação (noindex em páginas privadas)

---

# 8. Entregáveis

## Designer

- Mockups das telas.
- Versão desktop e mobile.
- Fluxos principais documentados.
- Definição clara dos conteúdos que deverão ser dinâmicos (textos, banners, imagens, etc.).
- Alinhamento com frontend sobre necessidades de conteúdo dinâmico.

## Frontend

- Projeto frontend implementado.
- Rotas criadas.
- Componentes reutilizáveis.
- Dados mockados.
- Fluxos navegáveis.
- Responsividade.
- Documentação das APIs necessárias.
- Estrutura preparada para integração futura com backend.
- Implementação da estrutura de SEO.
- Estrutura preparada para consumo de conteúdos dinâmicos via API.

---

# 9. Critérios de Aceite

O projeto será considerado entregue quando:

- Todas as telas principais estiverem navegáveis.
- Os fluxos principais funcionarem com mocks.
- A experiência estiver validável sem backend.
- As rotas estiverem organizadas.
- Os componentes estiverem reutilizáveis.
- A aplicação estiver responsiva.
- As APIs futuras estiverem documentadas com request e response.
- A estrutura de SEO estiver implementada.
- O frontend estiver preparado para consumir conteúdos dinâmicos definidos pelo Design.
- O backend conseguir usar a documentação para iniciar a implementação.

---

# 10. Fora do Escopo

Não faz parte desta etapa:

- Backend real.
- Banco de dados.
- Integração real com gateway.
- Integração real com Omie.
- Integração real com transportadoras.
- Autenticação real.
- Pagamento real.
- Emissão real de nota fiscal.
- Deploy definitivo em produção.

---

# 11. Objetivo Final da Etapa

Ao final desta etapa, devemos ter um **Front Office completo, navegável e validável.**

Como referência de experiência, qualidade de execução e maturidade do produto, o Front Office deverá entregar, no mínimo, uma experiência equivalente à plataforma **True Crime Club (**https://www.truecrime.club/) , servindo como benchmark para navegação, jornada do assinante, área do cliente e experiência geral do usuário. O objetivo, entretanto, não é reproduzir sua interface, mas usar as funcionalidades como referência e buscar uma experiência superior, alinhada às necessidades e identidade da nova plataforma.

- validar experiência do cliente;
- validar jornada de compra;
- validar jornada de assinatura;
- validar área do cliente;
- mapear todas as necessidades do backend;
- prever e estruturar conteúdos dinâmicos para gestão futura pelo Design via Backoffice;
- reduzir dúvidas antes do desenvolvimento das APIs reais.
