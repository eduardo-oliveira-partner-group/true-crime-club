# Design da Aplicacao

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

## Direcao criativa

A aplicacao deve parecer um clube investigativo moderno: reservado, elegante e
envolvente. A experiencia deve sugerir que o usuario esta abrindo um dossie
confidencial, analisando evidencias e avancando por uma narrativa que se revela
aos poucos.

O visual deve ser misterioso, mas nao pesado. Deve carregar suspense, sem perder
clareza, confianca e facilidade de uso. O usuario precisa sentir curiosidade
para explorar, mas tambem seguranca para comprar, assinar e acompanhar sua
jornada.

A pagina `src/app/(front-office)/page.tsx` e a referencia visual principal da
aplicacao. Novas paginas e componentes devem partir da mesma base: atmosfera
escura, imagem real de produto ou arquivo investigativo, camadas de overlay,
linhas de grade sutis, cards de dossie e acentos em vermelho e dourado.

## Vibe

- Investigacao sofisticada.
- Arquivo confidencial.
- Dossie premium.
- Evidencias bem organizadas.
- Pistas reveladas aos poucos.
- Comunidade exclusiva.
- Suspense controlado.
- Colecionismo com valor percebido.

## Principios de experiencia

### Misterio com clareza

A atmosfera pode ser intrigante, mas os fluxos devem ser simples. Comprar,
assinar, entrar na conta, consultar pedidos e acessar conteudos precisam ser
acoes obvias e rapidas.

### Investigacao com acabamento premium

Elementos visuais podem remeter a documentos, pistas, arquivos, etiquetas,
selos, fotografias, fichas e evidencias, desde que tratados com acabamento
moderno, limpo e profissional.

### Tensao com confianca

O tema true crime permite suspense, contraste e narrativa, mas a experiencia de
e-commerce deve transmitir credibilidade. Precos, planos, prazos, status,
pagamentos e proximas acoes devem estar sempre claros.

### Exclusividade com pertencimento

O usuario deve sentir que esta entrando em um clube restrito, com acesso a
materiais que nao estao disponiveis para qualquer pessoa. Ao mesmo tempo, deve
perceber que faz parte de uma comunidade que investiga, coleciona e acompanha os
casos em conjunto.

### Storytelling com conversao

Cada pagina deve conduzir o visitante como uma pista leva a proxima. A narrativa
deve apoiar a jornada comercial, nao competir com ela. Chamadas para assinar,
comprar, continuar investigando ou acessar conteudos devem surgir com naturalidade.

## Linguagem visual

O design deve evitar uma estetica caricata de crime. Nao deve parecer fantasia,
terror generico ou decoracao exagerada. A referencia principal e investigacao
editorial e premium: arquivos, mesas de analise, documentos, objetos de caso,
recortes, fotografias, lacres, envelopes e materiais colecionaveis.

Recomendacoes:

- Usar contraste de forma intencional para criar foco.
- Priorizar composicoes limpas, com hierarquia forte.
- Usar texturas e elementos tematicos com moderacao.
- Valorizar imagens reais ou materiais que mostrem produto, box, pistas,
  documentos e itens colecionaveis.
- Tratar cards, modais e areas de conteudo como pecas organizadas de um dossie.
- Manter botoes, formularios e informacoes comerciais extremamente legiveis.

## Padrao visual base

### Paleta

A base visual validada na home usa uma paleta escura e quente, com contraste
alto e acentos controlados.

- Fundo principal: `#090807`.
- Fundo secundario: `#0b0908`.
- Superficie elevada / dossie: `#171211`.
- Superficie profunda: `#050403` ou `#070604`.
- Texto principal: `#fffaf0` ou `#f0e8dd`.
- Texto secundario: `#d7c9b5`, `#c8bdad` ou `#bfb4a3`.
- Dourado editorial: `#d7b56d`.
- Dourado queimado / bordas: `#b98542`, `#a98453` ou `#b8945f`.
- Vermelho de acao e evidencia: `#d84132`, `#c8382b` ou `#bf3a2b`.
- Vermelho suave para estados e etiquetas: `#ffb0a5`.

O vermelho deve marcar a acao principal, tensao, disponibilidade ou evidencia.
O dourado deve marcar status premium, recomendacao, titulos auxiliares,
separadores e destaques editoriais. Evitar paginas dominadas por uma unica cor;
a leitura correta e escura, quente, documental e premium.

### Tipografia

- Titulos usam `font-heading`, peso alto, caixa alta quando a chamada for
  editorial ou heroica.
- Textos de apoio usam `font-sans`, linhas confortaveis e cor secundaria.
- Eyebrows e metadados usam texto pequeno, `font-semibold`, uppercase e
  tracking amplo entre `0.16em` e `0.3em`.
- Numeros de progresso, ciclos, precos e indices podem usar `font-heading` em
  peso forte para parecerem marcadores de arquivo.
- Codigos de referencia, como `CLUB-01`, `EVID-03` e `PROC-02`, podem usar
  `font-mono`, tamanho pequeno e baixa opacidade.

### Layout e secoes

As paginas publicas devem ser compostas como sequencias de secoes full-width,
separadas por bordas finas em `#fffaf0` com baixa opacidade. Evitar blocos
flutuantes genericos e excesso de cards dentro de cards.

- Usar containers centrais entre `max-w-6xl` e `max-w-7xl`.
- Usar padding horizontal `px-4 sm:px-6` e, em heroes desktop, `lg:px-10`.
- Usar padding vertical entre `py-14` e `py-24` para secoes editoriais.
- Alternar fundos `#090807`, `#0b0908`, `#171211` e `#050403` para criar ritmo.
- Aplicar overlays de imagem com gradients escuros em vez de escurecer o
  conteudo textual.
- Usar grades sutis como camada de arquivo:
  `linear-gradient(... 1px, transparent 1px)` com tamanho entre `28px`,
  `42px` e `56px`.

### Imagens e midia

Imagens devem revelar o universo real do produto: box, evidencia, arquivo,
mesa de investigacao, conteudo colecionavel ou embalagem. A home usa imagens de
fundo e video para criar imersao; outras telas devem seguir essa direcao quando
houver espaco editorial.

- Hero e secoes principais devem usar imagem ou video real como primeira camada.
- Usar `object-cover`, overlays escuros e brilho reduzido quando necessario.
- Evitar imagens genericas, abstratas, excessivamente borradas ou meramente
  atmosfericas.
- Em cards de produto, a foto deve ser clara e inspecionavel.
- Alt vazio e permitido apenas para imagens decorativas; imagens de produto
  precisam de texto alternativo descritivo.

### Cards de dossie

O card de dossie e o componente visual padrao para features, passos, planos,
produtos e conteudos catalogados.

Anatomia recomendada:

- Container retangular sem cantos exagerados, com borda fina e fundo
  `#0c0a09` ou `#171211`.
- Sombra profunda, por exemplo `0_20px_48px_rgba(0,0,0,0.38)`.
- Cabecalho tecnico com icone, label curta e codigo de referencia.
- Corpo com grade sutil, indice ou preco em destaque, titulo, descricao e
  separador inferior.
- Estados premium/recomendado usam borda dourada e glow interno suave.
- Estados neutros usam borda clara com opacidade baixa.
- Estados de acao, evidencia, limite ou alerta usam vermelho.
- Hover pode elevar o card levemente (`hover:-translate-y-1`) e revelar radial
  gradient discreto.

Evitar cards arredondados demais, superficies brancas, sombras frias ou
decoracao policial caricata.

### Botoes e links de acao

Os CTAs principais seguem a linguagem da home: retangulares, fortes, com icone
e texto objetivo.

- Primario comercial: fundo vermelho `#d84132` ou `#bf3a2b`, texto claro,
  sombra/glow vermelho suave.
- Primario premium/recomendado: fundo dourado `#d7b56d`, texto escuro.
- Secundario: outline dourado ou claro, fundo escuro translucido e hover com
  baixa opacidade.
- Em heroes, botoes podem ser `rounded-none`, uppercase e com cantos marcados
  por pequenos detalhes de borda.
- Em fluxos utilitarios, manter o componente `Button` padrao quando a clareza
  for mais importante que a expressao editorial.

### Movimento e revelacao

A home estabelece uma experiencia de descoberta progressiva com
`ScrollReveal`, `ScrollRevealGroup`, `TextGenerateEffect` e video controlado
pelo scroll no hero.

- Usar animacoes para revelar narrativa e hierarquia, nao para atrasar fluxos.
- Respeitar `prefers-reduced-motion`.
- Usar stagger em grupos de cards.
- Em checkout, login, carrinho e area do cliente, reduzir movimento e priorizar
  velocidade, foco e confianca.

### Iconografia

Usar icones Tabler em botoes, cabecalhos de card, labels de status e blocos de
beneficio. Icones devem parecer ferramentas de catalogacao ou investigacao:
arquivo, pacote, calendario, cartao, checklist, digital, usuarios, livro,
notebook, box, evidencia e seta de acao.

## Tom de voz

O texto deve soar curioso, envolvente e confiante. A comunicacao pode provocar o
desejo de investigar, abrir pistas e descobrir o proximo detalhe, mas sem perder
objetividade nos momentos de compra e gestao da conta.

Direcionadores:

- Convide o usuario a entrar no caso.
- Use misterio como gancho, nao como obstaculo.
- Seja claro em preco, prazo, frete, cobranca e status.
- Reforce exclusividade, curadoria e recorrencia.
- Evite exageros sensacionalistas.
- Evite linguagem morbida, agressiva ou apelativa.

## Componentes e telas

### Home

Deve apresentar imediatamente o True Crime Club como uma experiencia de
assinatura investigativa. O primeiro contato precisa comunicar clube, box,
misterio, colecionismo e valor premium.

A home atual e a base de padronizacao para o restante do front office:

- Hero imersivo com fundo escuro, video/imagem de abertura da box, headline
  curta em tres verbos e CTA forte.
- Secoes full-width com imagens editoriais, overlays, grade sutil e bordas
  finas.
- Cards de dossie para beneficios, categorias, passos e planos.
- Linguagem visual de arquivo: labels, codigos, indices, progresso, selo de
  recomendacao e nota do arquivo.
- Uso consistente de dourado para exclusividade e vermelho para acao.

### Vitrine e detalhes de produto

Devem tratar cada box ou item como uma peca de colecao ou evidencia de um caso.
Fotos, descricao, beneficios, disponibilidade e chamada de compra devem ser
claros e persuasivos.

Produtos devem seguir a estrutura de arquivo avulso: foto grande, etiqueta de
disponibilidade, numero/ciclo quando houver, descricao curta, preco destacado,
beneficio para assinante e CTA de detalhes. A pagina de detalhes pode expandir
essa mesma linguagem para galeria, ficha tecnica, conteudo da box e regras de
compra.

### Planos de assinatura

Devem explicar valor, recorrencia, vantagens, regras e cancelamento com muita
clareza. A comparacao entre planos deve ser objetiva, com destaque para a opcao
recomendada quando fizer sentido.

Planos devem usar cards de dossie com cabecalho tecnico, referencia do plano,
microcopy de recorrencia, preco forte, lista curta de beneficios e CTA. A opcao
recomendada deve receber borda e acento dourado, nao apenas um badge isolado.

### Carrinho e checkout

Devem ser diretos, confiaveis e sem excesso narrativo. O usuario ja decidiu
avancar; agora a prioridade e reduzir friccao e reforcar seguranca.

Nesses fluxos, manter a paleta e superficies da home, mas diminuir a carga
cinematografica. Usar cards escuros bem legiveis, estados claros, resumo de
pedido fixo quando fizer sentido e vermelho apenas para acao principal ou erro.
Garantir contraste alto para campos, precos, prazos, frete e formas de
pagamento.

### Area do cliente

Deve funcionar como o painel pessoal do assinante dentro do clube. Pedidos,
assinatura, financeiro e conteudos exclusivos precisam parecer organizados,
rastreaveis e faceis de consultar.

A area logada deve parecer um arquivo pessoal do assinante: listas e paineis
podem usar a estetica de dossie, mas com densidade maior e menos efeitos.
Priorizar leitura, status e proximas acoes. Codigos, datas, ciclos e progresso
podem reforcar a metafora de rastreamento.

### Conteudos exclusivos e gamificacao

Devem reforcar a sensacao de progresso investigativo. Conteudos liberados,
bloqueados, arquivos, pistas e status do assinante podem usar metaforas de caso,
dossie e linha de investigacao, mantendo legibilidade e navegacao simples.

Conteudos podem usar cards de evidencia, progresso do caso, ciclos, pistas
coletadas e estados bloqueado/liberado. O padrao visual deve continuar premium:
sem terror grafico, sem sensacionalismo e sem transformar o fluxo em jogo
confuso.

## Frase-guia

> O True Crime Club e uma experiencia premium de assinatura para fas de true
> crime, onde cada box funciona como uma entrega de evidencias, cada conteudo
> aprofunda a investigacao e cada assinante participa de uma narrativa coletiva
> de misterio, descoberta e colecao.
