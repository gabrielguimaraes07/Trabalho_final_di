# E — Índice do código

| Arquivo | Papel |
|---|---|
| [index.html](../index.html) | Página inicial com PC 3D, carrossel, explicações e configurações prontas. |
| [estoque.html](../estoque.html) | Catálogo, abas e filtros de busca. |
| [montador.html](../montador.html) | Quiz de três etapas e visualização da configuração sugerida. |
| [simulador.html](../simulador.html) | Seleção manual, resumo, preços, compatibilidade e comparação de montagens. |
| [guia.html](../guia.html) | Guia das 19 categorias com fichas de exemplos. |
| [setups.html](../setups.html) | Oito configurações personalizáveis e vídeo integrado ao notebook. |
| [glossario.html](../glossario.html) | Busca e lista de definições. |
| [login.html](../login.html) | Abas de acesso fictício e perfil da sessão. |
| [contato.html](../contato.html) | Formulário de contato simulado e perguntas frequentes. |
| [css/tokens.css](../css/tokens.css) | Cores, medidas e tipografia dos temas. |
| [css/base.css](../css/base.css) | Estilos de elementos básicos, foco e texto para leitor de tela. |
| [css/layout.css](../css/layout.css) | Estrutura da página, navegação e rodapé. |
| [css/componentes.css](../css/componentes.css) | Botões, gaveta, modelo 3D, carrossel e cartões. |
| [css/loja.css](../css/loja.css) | Estoque, cartões de produto e carrinho. |
| [css/montador.css](../css/montador.css) | Passos do quiz, resultado e cartões de configurações. |
| [css/simulador.css](../css/simulador.css) | Layout do simulador, impressão, guia e tela do notebook. |
| [css/apoio.css](../css/apoio.css) | Glossário, dicas, formulários e perguntas frequentes. |
| [css/acessibilidade.css](../css/acessibilidade.css) | Painel, preferências de leitura e fonte Atkinson. |
| [js/main.js](../js/main.js) | Inicia páginas, componentes e atalhos. |
| [js/navegacao.js](../js/navegacao.js) | Menu compacto, retorno de foco e espaçamento dos atalhos de rolagem. |
| [js/abas.js](../js/abas.js) | Calcula a próxima aba para as teclas de navegação. |
| [js/acessibilidade.js](../js/acessibilidade.js) | Interface de ajustes, prévia e restauração das preferências. |
| [js/tema.js](../js/tema.js) | Aplica a preferência salva antes da primeira pintura e acompanha o tema do sistema. |
| [js/animacoes.js](../js/animacoes.js) | Carrega GSAP e revela títulos ao rolar. |
| [js/cena3d.js](../js/cena3d.js) | Renderiza, gira, seleciona e aproxima a câmera do gabinete. |
| [js/modelo-pc.js](../js/modelo-pc.js) | Constrói as peças do PC com formas e materiais do Three.js. |
| [js/hotspots.js](../js/hotspots.js) | Projeta as posições das peças em botões HTML. |
| [js/vista-explodida.js](../js/vista-explodida.js) | Anima a separação das peças durante a rolagem. |
| [js/gaveta.js](../js/gaveta.js) | Abre o estoque no PC 3D e filtra as peças da categoria. |
| [js/dialogo.js](../js/dialogo.js) | Controla foco, Escape e fechamento das gavetas. |
| [js/carrossel.js](../js/carrossel.js) | Alterna as imagens e controla a pausa e o movimento reduzido. |
| [js/estoque.js](../js/estoque.js) | Carrega produtos e fornece nomes, descrições e formatação de preços. |
| [js/pagina-estoque.js](../js/pagina-estoque.js) | Exibe categorias, filtros, sugestões e a tabela de comparação. |
| [js/carrinho.js](../js/carrinho.js) | Salva itens e orçamento e mostra a revisão da compra simulada. |
| [js/compatibilidade.js](../js/compatibilidade.js) | Compara encaixe, memória, formato e potência. |
| [js/builds-prontos.js](../js/builds-prontos.js) | Agrupa as configurações por tipo de uso e mostra exemplos na página inicial. |
| [js/configuracoes.js](../js/configuracoes.js) | Valida os conjuntos prontos e busca combinações para o quiz. |
| [js/simulador.js](../js/simulador.js) | Interações do simulador, vista, alertas e compartilhamento. |
| [js/montagem.js](../js/montagem.js) | Seleção de peças, validação dos dados e gravação local. |
| [js/guia.js](../js/guia.js) | Explicações e fichas do guia de componentes. |
| [js/montador.js](../js/montador.js) | Coordena as perguntas, respostas e resultado do montador. |
| [js/glossario.js](../js/glossario.js) | Carrega termos e cria dicas e links para as explicações. |
| [js/formularios.js](../js/formularios.js) | Valida campos e confirma a simulação do contato. |
| [js/login.js](../js/login.js) | Controla abas, senha visível e sessão fictícia. |
| [scripts/contraste.js](../scripts/contraste.js) | Gera a tabela WCAG com os pares de cores do projeto. |

## Dados

- [produtos.json](../data/produtos.json) registra 56 produtos reais em 19 tipos, com preços e dados de compatibilidade.
- [builds.json](../data/builds.json) reúne 16 conjuntos de peças, organizados por uso e nível.
- [glossario.json](../data/glossario.json) reúne os termos e suas definições.
