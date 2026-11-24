# GGTECH

**Gabriel Guimarães · Desenvolvimento de Interfaces · CEUB, 2026**

A ideia do GGTECH surgiu de uma pergunta simples. Como montar o primeiro PC sem ficar perdido nos nomes das peças? Comecei por um gabinete que dá para girar e explorar. Na versão final, o modelo leva a um catálogo com componentes reais e a um simulador que confere as escolhas antes de fechar o orçamento.

Esta edição é o pacote local para a apresentação da disciplina.

## O que dá para testar

- Explore o gabinete 3D e abra as categorias clicando nas peças. Os botões abaixo do modelo fazem a mesma coisa pelo teclado.
- Busque por nome e marca no catálogo. Dá para filtrar por preço, conferir as fichas e comparar até três produtos.
- Abra o **Simulador**, selecione uma categoria e clique em **Escolher peça** no cartão com foto e preço. Use **Próxima categoria** para avançar ou **Revisar montagem** para conferir a lista e o total. O botão **Exportar PDF** abre a impressão para salvar o resumo.
- Compare **16 setups** de jogos, estudos, programação, edição de vídeo e produtividade. Cada uso tem opções de entrada, intermediária e avançada. Jogos também tem uma opção premium.
- No **Guia de componentes**, abra uma categoria para ver o que cada peça faz, a foto do modelo, o preço de referência e a ficha técnica.
- No botão **Acessibilidade**, experimente trocar o tema, ampliar a fonte, aumentar o contraste ou reduzir movimento.

## Para abrir no VS Code

1. Extraia o ZIP ou clone este repositório e abra a pasta no VS Code.
2. Com a extensão Live Server instalada, abra `index.html` com **Open with Live Server**.

Também dá para iniciar um servidor no terminal, na pasta do projeto.

```sh
python -m http.server 8765
```

Abra a página no navegador. [http://localhost:8765](http://localhost:8765/)

O servidor permite que o navegador leia o catálogo e os outros arquivos JSON. O Three.js, o GSAP, as fotos, os dados e o vídeo estão no ZIP e carregam pelo servidor local. O gabinete tem uma vista estática de reserva se o navegador não conseguir exibir WebGL.

## Como o projeto foi tomando forma

| Etapa | Trabalho |
|---|---|
| Primeira versão | Estruturei a página inicial, defini a paleta e usei o primeiro esboço do gabinete para ligar quatro categorias ao estoque. |
| Parcial | Entraram os dois temas, os cartões explicativos e o carrossel. A versão publicada recebeu ajustes de contraste, foco e ícone. |
| Base da final | Ampliei o modelo para nove áreas, acrescentei vista explodida, montador guiado, carrinho, login, contato, glossário e painel de acessibilidade. |
| Catálogo e montagem | Organizei os dados por categoria, liguei as fichas reais às regras do simulador e coloquei as oito configurações como ponto de partida. |
| Revisão | Conferi os dados, os cálculos e as mensagens de compatibilidade. Registrei as fontes, as licenças e o apoio de IA. |

## Dados e documentação

O catálogo inclui **40 modelos em 19 categorias**, todos com foto e preço de referência pesquisado em 23/11/2026. A indicação de preço histórico identifica uma oferta encerrada ou um produto sem estoque na página consultada. Todos os totais excluem frete. A checagem de compatibilidade usa os dados de cada ficha e orienta a confirmação de folgas, cabos e BIOS no manual.

- [Fontes dos 40 preços e fotos da apresentação](docs/fontes-apresentacao.md)
- [Paleta e contraste](docs/wcag-contraste.md) · [Psicologia das cores](docs/psicologia-cores.md)
- [Design e capturas](docs/design-site.md) · [Heurísticas de Nielsen](docs/heuristicas-nielsen.md)
- [Auditoria](docs/auditoria.md) · [Roteiro de usabilidade](docs/usabilidade.md)
- [Índice do código](docs/codigo.md) · [Registro de uso de IA](docs/registro-ia.md)

A tabela de contraste é gerada pelo comando `node scripts/contraste.js`.
