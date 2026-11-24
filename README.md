# GGTECH

**Gabriel Guimarães · Desenvolvimento de Interfaces · UniCEUB, 2026**

A ideia do GGTECH é ajudar quem está montando o primeiro PC. Dá para explorar um gabinete, entender a função de cada peça e conferir se os componentes escolhidos funcionam juntos. [Abrir o GGTECH no GitHub Pages](https://gabrielguimaraes07.github.io/Trabalho_final_di/)

## O que dá para fazer

- **Explorar o gabinete.** Clique nas peças do modelo 3D ou use os botões com os nomes das categorias. O guia e o glossário explicam as especificações em linguagem simples.
- **Pesquisar e comparar.** O catálogo tem 56 produtos em 19 tipos de peça. A barra de comparação guarda até três modelos do mesmo tipo enquanto você pesquisa.
- **Montar com ajuda.** Diga para que vai usar o PC, quanto quer gastar e o que prioriza. O montador avisa cedo quando o orçamento fica abaixo dos setups disponíveis e separa as peças e os periféricos no resultado.
- **Escolher peça por peça.** Comece do zero ou abra um dos 16 setups prontos. A montagem manual mostra o progresso, avisa sobre incompatibilidades e permite salvar ou compartilhar a configuração.
- **Revisar no carrinho.** Confira os itens e o total antes de confirmar uma compra simulada. O painel de acessibilidade permite ajustar tema, leitura e movimento.

## Tecnologias e pastas

O site usa HTML, CSS e JavaScript. O Three.js renderiza o gabinete e o GSAP cuida das animações. Produtos, setups e glossário são carregados de arquivos JSON. Preferências, carrinho e montagens salvas ficam no armazenamento local do navegador.

- A raiz tem as páginas HTML, como `index.html`, `estoque.html` e `montador.html`.
- `css/` reúne os estilos. `js/` contém as regras e interações das páginas.
- `data/` guarda os dados do catálogo, dos setups e do glossário.
- `assets/` reúne fotos, vídeo, ícones e bibliotecas. `docs/` tem os créditos, a documentação da disciplina e os testes.

## Como rodar no seu computador

1. Clone ou baixe o repositório e abra a pasta no VS Code.
2. Abra `index.html` com **Open with Live Server**.

Se preferir, execute `python -m http.server 8765` no terminal a partir da pasta do projeto e abra [http://localhost:8765](http://localhost:8765/). O servidor local permite que as páginas carreguem os arquivos JSON. Sem WebGL, o gabinete aparece como uma imagem com os mesmos botões de categoria.

## Limites e créditos

Compra e login são simulações. O site funciona sem servidor de contas ou pagamentos. Os preços, consultados em 23/11/2026, são referências em reais e sem frete. **Preço histórico** identifica um anúncio indisponível ou uma oferta encerrada na consulta. Os avisos de compatibilidade usam as fichas do catálogo. Confira no manual do fabricante detalhes como folgas, cabos e BIOS. [Cotações e créditos das fotos](docs/fontes-apresentacao.md)

- [IHC, experiência e interface](docs/ihc-ux-ui.md) · [Design Thinking](docs/design-thinking.md) · [Heurísticas de Nielsen](docs/heuristicas-nielsen.md)
- [Contraste](docs/wcag-contraste.md) · [Auditoria](docs/auditoria.md) · [Roteiro de usabilidade](docs/usabilidade.md)
- [Mapa do código](docs/codigo.md) · [Registro de uso de IA](docs/registro-ia.md)
