# Plano 003: Integração das telas da Área do Cliente com a identidade True Crime e Terminal Retrô de Casos

> **Instruções para o executor**: siga este plano passo a passo. Rode todos os comandos de verificação e confirme o resultado esperado antes de avançar para a próxima etapa. Ao finalizar, atualize a linha deste plano em `plans/README.md`.

## Status

- **Prioridade**: P1
- **Esforço**: M
- **Risco**: LOW
- **Depende de**: Plano 001 (Base do Front Office)
- **Categoria**: UI/UX
- **Planejado em**: 2026-06-26
- **Execução**: **DONE** — verificado no `master` @ `7f35cd6` no reconcile de 2026-06-26. Todos os recursos de gerenciamento pessoal e o painel de gamificação do terminal retrô de casos foram implementados e integrados com sucesso.

---

## Por que isso importa

Para que a experiência logada do assinante no **True Crime Club** seja imersiva e completa, precisamos implementar os recursos de gerenciamento pessoal e o painel de gamificação do detetive mapeados do site de produção original:
1. **Minha conta (Perfil e Endereços)**: Visualização e edição inline de informações básicas, contato, dados adicionais e endereços.
2. **Meus cartões**: Cadastro e exclusão de cartões de crédito para faturamento da assinatura.
3. **Casos (Terminal de Investigação)**: Recriar a experiência principal do site — uma central de arquivos gamificada com estilo de **terminal de computador antigo (CRT/DOS/Green Screen)**, permitindo navegar por pastas de evidências (Arquivos dos casos, Pendrive, Documentos) de cada uma das 4 caixas e acessar links reais de documentos fictícios hospedados em S3.
4. **Exposição no Header (Menu de Casos)**: Em vez de ficar oculto apenas na barra lateral da área do cliente, a opção de acessar a tela de **"Casos"** ficará visível em destaque no **header principal da aplicação** (quando o usuário estiver autenticado), fornecendo um acesso rápido e exposto para essa experiência de detetive.
5. **Navegação do Menu**: Ajustar o menu lateral (`ClientShell`) para refletir os botões do site de produção (Minha conta, Meus pedidos, Minhas assinaturas, Meus cartões, Casos e Sair).

---

## Modificações Propostas

### 1. Ajuste do Header Principal (`src/components/layout/public-header-content.tsx`)
Ajustar o header público para expor a central de investigação de forma destacada:
- Adicionar verificação de estado de autenticação (usando um sinalizador no cliente como `localStorage.getItem('isLoggedIn')` ou verificação correspondente).
- Se o usuário estiver logado, renderizar um link/menu especial **"Casos"** no navbar (tanto desktop quanto mobile), estilizado com destaque (texto verde brilhante `#62d84e` e efeito hover sutil), permitindo acesso imediato ao terminal retro de qualquer lugar da aplicação.

### 2. Ajuste do Menu Lateral da Área Logada (`src/components/layout/client-shell.tsx`)
Ajustar os itens de navegação do menu lateral para corresponder ao layout padrão:
- **Minha conta** -> `/cliente/perfil` (ícone `IconUser`)
- **Meus pedidos** -> `/cliente/pedidos` (ícone `IconBoxSeam`)
- **Minhas assinaturas** -> `/cliente/assinatura` (ícone `IconHome` / `IconRepeat`)
- **Meus cartões** -> `/cliente/cartoes` (ícone `IconCreditCard`)
- **Casos** -> `/cliente/casos` (ícone `IconUsers` e texto em verde brilhante `#62d84e`)
- **Sair** -> Redirecionamento para a Home pública `/` (ícone `IconLogout` e limpeza do status de autenticação no client-side).

### 3. Tela de Perfil do Cliente (`src/app/(cliente)/cliente/perfil/page.tsx`) [NEW]
Implementar a página principal de "Minha conta" dividida em 4 cards com o tema escuro/dossiê:
- **Card Informações Básicas**: Nome, Sobrenome, CPF, ação de edição inline e alteração de senha.
- **Card Contato**: E-mail, Telefone e edição inline.
- **Card Dados Adicionais**: Preferências (Tamanho de Camiseta, Tamanho de Calçado, Observações) e edição inline.
- **Card Endereços**: Lista de endereços cadastrados, suporte para adicionar novo endereço, excluir e editar.

### 4. Tela de Gerenciamento de Cartões (`src/app/(cliente)/cliente/cartoes/page.tsx`) [NEW]
Implementar a página "Meus cartões":
- **Lista de cartões**: Carrega os cartões vinculados do mock data. Caso esteja vazia, mostra "Sua lista de cartões está vazia".
- **Ação Adicionar**: Botão que exibe o formulário inline contendo Número do cartão, Nome do titular, Data de expiração (Select Mês/Ano) e CVC.

### 5. Tela do Terminal de Casos (`src/app/(cliente)/cliente/casos/page.tsx`) [NEW]
Recriar a página do terminal retrô de investigação dos Casos:
- **Identidade Visual**: Estilo CRT/fósforo verde clássico de computadores antigos (fundo `#09110b`, texto `#62d84e`, scanlines, vinheta radial e fonte monoespaçada).
- **Fluxo de Telas**:
  1. **Início**: Gaveteiro clássico verde brilhante com rótulo "Casos".
  2. **Lista de Casos**: Card "Caso - Victória Monteiro".
  3. **Seleção de Caixa**: Layout split-screen de caixas 1 a 4 com detalhes da caixa e botão "Abrir área do investigador".
  4. **Área do Investigador**: Grade de pastas ("Arquivos dos casos", "Documentos", "Pendrive").
  5. **Lista de Arquivos**: Exibe os links de S3 reais extraídos das Caixas 1 a 4.
  - Botões de "Voltar" para cada etapa.

---

## Plano de Ação

### Etapa 1: Controle de Sessão e Atualização do Header Principal
- Implementar o controle simplificado de login client-side (`isLoggedIn`) que é ativado ao fazer login e desativado ao clicar em "Sair".
- Atualizar `src/components/layout/public-header-content.tsx` para monitorar o estado `isLoggedIn`.
- Caso logado, inserir o item especial **"Casos"** destacado em verde brilhante no menu de navegação.

### Etapa 2: Atualização dos Itens do Menu Lateral
- Modificar os itens de navegação em `ClientShell` para direcionar para `/cliente/perfil`, `/cliente/cartoes` e `/cliente/casos`.
- Ajustar estilos do botão "Casos" para ter o visual verde e brilhante.
- Garantir que a ação de "Sair" limpe o sinalizador de login no client-side e redirecione para `/`.

### Etapa 3: Desenvolvimento da Página de Perfil (`/cliente/perfil`)
- Criar a página de perfil incorporando dados do mock customer.
- Estilizar cada bloco de informações como cards dossiê com fundo `#171211`.
- Adicionar estados de React para gerenciar o modo de edição inline de cada bloco de dados.

### Etapa 4: Desenvolvimento da Página de Cartões (`/cliente/cartoes`)
- Criar a página de cartões e formulário de cadastro.

### Etapa 5: Criação do Terminal de Casos (`/cliente/casos`)
- Criar a rota `/cliente/casos/page.tsx` no formato de Client Component.
- Adicionar a estrutura de mock de casos (`src/lib/domain/cases-mock-data.ts`) contendo a lista completa de arquivos e URLs capturados das boxes 1 a 4.
- Implementar o visual retro com scanlines e gradientes em arquivos de estilos CSS.
- Programar o fluxo de estados (Fases 1 a 5) com botão de "Voltar" correspondente em cada etapa.

---

## Verificação e Testes
1. Executar build de produção (`pnpm build` ou `npm run build`) para verificar compilação.
2. Rodar localmente (`npm run dev`) e testar as transições de tela no Terminal de Casos, verificando se os links de S3 abrem os PDFs reais de depoimentos e imagens.
