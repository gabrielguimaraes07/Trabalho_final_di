# GGTECH

**Gabriel Guimarães · Desenvolvimento de Interfaces · UniCEUB, 2026**

A ideia do GGTECH é ajudar quem está montando o primeiro PC. Dá para explorar as peças no gabinete, entender as especificações e conferir se os componentes escolhidos funcionam juntos. [Abrir o GGTECH](https://gabrielguimaraes07.github.io/Trabalho_final_di/)

## O que dá para testar

- **Montagem guiada.** Responda três perguntas e receba uma sugestão para o seu uso. O orçamento inclui o computador e os periféricos que aparecem na lista.
- **Montagem manual.** Escolha peça por peça, veja o que falta e confira os avisos. Salve a configuração no navegador ou compartilhe o link. Depois de reunir as peças essenciais, leve a montagem ao carrinho e simule a compra.
- **Setups prontos.** Abra um dos 16 PCs para jogos, estudos, programação, edição de vídeo ou produtividade. Cada configuração pode ser ajustada na montagem manual.
- **Catálogo.** Pesquise entre 56 modelos em 19 tipos de peça e compare até três produtos do mesmo tipo. O filtro de compatibilidade usa a montagem manual. O carrinho é uma lista separada para a compra simulada.
- **Gabinete, guia e glossário.** Selecione as peças no gabinete 3D ou pelos botões abaixo da imagem. O guia traz fotos, preços e fichas, e o glossário explica as siglas mais comuns.
- **Acessibilidade.** Os dois temas e as preferências de leitura e movimento ficam guardados no navegador.

## Como rodar localmente

1. Clone ou baixe o repositório e abra a pasta no VS Code.
2. Abra `index.html` com **Open with Live Server**.

Também dá para abrir um terminal na pasta, executar `python -m http.server 8765` e acessar [http://localhost:8765](http://localhost:8765/). O servidor permite ler os dados JSON. Fotos, vídeo, Three.js e GSAP acompanham o projeto. Sem WebGL, o gabinete funciona com uma imagem e os botões das categorias.

## Preços e documentação

Os preços em reais são referências da consulta de 23/11/2026, sem frete. O rótulo **Preço histórico** indica uma oferta encerrada ou um anúncio indisponível naquele dia. A compatibilidade usa dados das fichas e sinaliza pontos que valem uma conferida no manual. [Fontes das cotações e fotos](docs/fontes-apresentacao.md)

- [IHC, UX e interface](docs/ihc-ux-ui.md) · [Design Thinking](docs/design-thinking.md) · [Heurísticas de Nielsen](docs/heuristicas-nielsen.md)
- [Paleta e cálculo de contraste](docs/wcag-contraste.md) · [Auditoria técnica](docs/auditoria.md) · [Roteiro de usabilidade](docs/usabilidade.md)
- [Mapa do código](docs/codigo.md) · [Registro de uso de IA](docs/registro-ia.md)
