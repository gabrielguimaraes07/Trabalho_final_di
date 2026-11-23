# GGTECH

**Gabriel Guimarães · Desenvolvimento de Interfaces · CEUB, 2026**

A ideia do GGTECH surgiu de uma pergunta simples. Como montar o primeiro PC sem ficar perdido nos nomes das peças? Comecei por um gabinete que dá para girar e explorar. Na versão final, o modelo leva a um catálogo com componentes reais e a um simulador que confere as escolhas antes de fechar o orçamento.

[Abra o GGTECH no GitHub Pages](https://gabrielguimaraes07.github.io/Trabalho_final_di/)

## O que dá para testar

- Explore o gabinete 3D e abra as categorias clicando nas peças. Os botões abaixo do modelo fazem a mesma coisa pelo teclado.
- Busque por nome e marca no catálogo. Dá para filtrar por preço, conferir as fichas e comparar até três produtos.
- Abra o **Simulador** para escolher peças uma a uma. Ajuste quantidades, veja os conflitos, informe suas cotações e salve montagens no navegador. O botão **Exportar PDF** abre a impressão para salvar o resumo.
- Abra **Setups recomendados** para experimentar oito pontos de partida. No **Guia de componentes**, cada categoria tem explicações e exemplos reais.
- No botão **Acessibilidade**, experimente trocar o tema, ampliar a fonte, aumentar o contraste ou reduzir movimento.

## Para abrir no VS Code

1. Extraia o ZIP ou clone este repositório e abra a pasta no VS Code.
2. Com a extensão Live Server instalada, abra `index.html` com **Open with Live Server**.

Também dá para iniciar um servidor no terminal, na pasta do projeto.

```sh
python -m http.server 8765
```

Abra a página no navegador. [http://localhost:8765](http://localhost:8765/)

O servidor permite que o navegador leia o catálogo e os outros arquivos JSON. O Three.js e o GSAP são carregados pela internet. O gabinete tem uma vista estática de reserva e o catálogo funciona com os arquivos locais.

## Como o projeto foi tomando forma

| Etapa | Trabalho |
|---|---|
| Primeira versão | Estruturei a página inicial, defini a paleta e usei o primeiro esboço do gabinete para ligar quatro categorias ao estoque. |
| Parcial | Entraram os dois temas, os cartões explicativos e o carrossel. A versão publicada recebeu ajustes de contraste, foco e ícone. |
| Base da final | Ampliei o modelo para nove áreas, acrescentei vista explodida, montador guiado, carrinho, login, contato, glossário e painel de acessibilidade. |
| Catálogo e montagem | Organizei os dados por categoria, liguei as fichas reais às regras do simulador e coloquei as oito configurações como ponto de partida. |
| Revisão | Conferi os dados, os cálculos e as mensagens de compatibilidade. Registrei as fontes, as licenças e o apoio de IA. |

## Dados e documentação

O catálogo inclui **40 modelos em 19 categorias**. Os preços registrados têm fonte de referência. Quando falta preço, o simulador mostra o subtotal conhecido e permite completar a cotação. A checagem de compatibilidade usa os dados de cada ficha e orienta a confirmação de folgas, cabos e BIOS no manual.

- [Fontes e licenças](docs/fontes-catalogo.md)
- [Paleta e contraste](docs/wcag-contraste.md) · [Psicologia das cores](docs/psicologia-cores.md)
- [Design e capturas](docs/design-site.md) · [Heurísticas de Nielsen](docs/heuristicas-nielsen.md)
- [Auditoria](docs/auditoria.md) · [Roteiro de usabilidade](docs/usabilidade.md)
- [Índice do código](docs/codigo.md) · [Registro de uso de IA](docs/registro-ia.md)

A tabela de contraste é gerada pelo comando `node scripts/contraste.js`.
