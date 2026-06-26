# Plano 003: Integração das telas da Área do Cliente com a identidade True Crime

> **Instruções para o executor**: siga este plano passo a passo. Rode todos os comandos de verificação e confirme o resultado esperado antes de avançar para a próxima etapa. Ao finalizar, atualize a linha deste plano em `plans/README.md`.

## Status

- **Prioridade**: P1
- **Esforço**: M
- **Risco**: LOW
- **Depende de**: Plano 001 (Base do Front Office)
- **Categoria**: UI/UX
- **Planejado em**: 2026-06-25

---

## Por que isso importa

Para que a experiência logada do assinante no **True Crime Club** seja imersiva e completa, precisamos implementar os recursos de gerenciamento pessoal que existem no site de produção original:
1. **Minha conta (Perfil e Endereços)**: Visualização e edição inline das informações básicas, contato, dados adicionais e endereços.
2. **Meus cartões**: Cadastro e exclusão de cartões de crédito para faturamento da assinatura.
3. **Navegação do Menu**: Ajustar o menu lateral (`ClientShell`) para refletir exatamente os botões do site de produção (incluindo o atalho direto para "Minha conta" e "Meus cartões", substituindo a aba genérica "Financeiro" por "Meus cartões" e mantendo o histórico de faturas integrado ou secundário).

---

## Modificações Propostas

### 1. Ajuste do Menu Lateral (`src/components/layout/client-shell.tsx`)
Ajustar os itens de navegação do menu para corresponder à imagem e estrutura originais:
- **Minha conta** -> `/cliente/perfil` (ícone `IconUser`)
- **Meus pedidos** -> `/cliente/pedidos` (ícone `IconBoxSeam`)
- **Minhas assinaturas** -> `/cliente/assinatura` (ícone `IconHome` / `IconRepeat`)
- **Meus cartões** -> `/cliente/cartoes` (ícone `IconCreditCard`)
- **Casos** (Conteúdos) -> `/cliente/conteudos` (ícone `IconFileText` / `IconUsers` — ignorado nesta fase)
- **Sair** -> Redirecionamento para a Home pública `/` (ícone `IconLogout`)

### 2. Tela de Perfil do Cliente (`src/app/(cliente)/cliente/perfil/page.tsx`) [NEW]
Implementar a página principal de "Minha conta" dividida em 4 cards com o tema escuro/dossiê:
- **Card Informações Básicas**:
  - Campos: Nome, Sobrenome, CPF.
  - Ação: Edição inline (alternando para inputs) e botão "Alterar senha" (abrindo formulário mockado de nova senha).
- **Card Contato**:
  - Campos: E-mail, Telefone.
  - Ação: Edição inline.
- **Card Dados Adicionais (Preferências)**:
  - Campos: Tamanho de Camiseta, Tamanho de Calçado, Observações (vinculado a `customer.preferences` do repositório).
  - Ação: Edição inline.
- **Card Endereços**:
  - Exibição de todos os endereços retornados por `listAddresses()`.
  - Ações: Adicionar novo endereço (inline ou modal), "Editar endereço" (inline) e "Excluir endereço" (mock na memória).

### 3. Tela de Gerenciamento de Cartões (`src/app/(cliente)/cliente/cartoes/page.tsx`) [NEW]
Implementar a página "Meus cartões":
- **Lista de cartões**: Carrega os cartões vinculados do mock data. Caso esteja vazia, mostra "Sua lista de cartões está vazia".
- **Ação Adicionar**: Botão no cabeçalho que exibe o formulário inline contendo:
  - Número do cartão, Nome do titular, Data de expiração (Select Mês/Ano) e CVC.
  - Ações de "Salvar" (adicionando ao estado mockado) e "Cancelar".

---

## Plano de Ação

### Etapa 1: Atualização dos Itens do Menu
- Modificar os itens em `ClientShell` para corresponder à navegação real.
- Garantir que a ação de "Sair" redirecione corretamente para a página inicial pública `/`.

### Etapa 2: Desenvolvimento da Página de Perfil (`/cliente/perfil`)
- Criar a página de perfil incorporando os dados do cliente mockado (`getCurrentCustomer()`).
- Estilizar cada bloco de informações como cards dossiê com contornos finos dourados e fundo `#171211`.
- Adicionar estados de React para gerenciar o modo de edição inline de cada bloco de dados.
- Mapear a edição para persistir (no estado de memória da sessão) via funções mockadas in `repositories.ts` (ou criando funções auxiliares).

### Etapa 3: Desenvolvimento da Página de Cartões (`/cliente/cartoes`)
- Criar a página de cartões recuperando os cartões mockados do cliente.
- Desenvolver o formulário de cadastro de cartão de crédito.
- Integrar a ação de salvar atualizando os dados mockados em tela.

---

## Verificação e Testes
1. Executar verificação de build da aplicação (`pnpm build` ou `npm run build`) para garantir que as novas páginas compilam sem erros de TypeScript.
2. Navegar no painel do cliente localmente (`npm run dev`) e verificar se:
   - A barra lateral direciona corretamente para as novas páginas.
   - Os cards de perfil alternam para modo de edição e permitem salvar alterações.
   - O fluxo de cadastro e listagem de novos cartões funciona de forma fluida.
