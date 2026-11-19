# GGTECH

**Gabriel Guimarães · Desenvolvimento de Interfaces · CEUB, 2026**

Minha ideia com a GGTECH foi criar uma loja fictícia para quem quer montar o primeiro PC e fica meio perdido com os nomes das peças. O ponto de partida é um gabinete 3D que dá para girar e explorar antes de olhar os preços.

[Abra a entrega parcial no GitHub Pages](https://gabrielguimaraes07.github.io/Trabalho_final_di/)

## O que dá para testar

- Gire o PC e selecione a placa de vídeo, o processador, a memória RAM ou a fonte. Dá para usar mouse, toque ou teclado. Os botões embaixo do gabinete também abrem as categorias.
- Cada peça abre um painel lateral com cinco produtos fictícios e busca por nome ou marca. São 20 produtos ao todo.
- No botão **Tema**, alterne entre claro e escuro. O site lembra a sua escolha.
- Os cartões explicam as peças com exemplos do dia a dia. No carrossel, você pode avançar, voltar ou pausar as imagens dos setups.

## Para abrir no VS Code

1. Extraia o ZIP e abra a pasta do projeto no VS Code.
2. Com a extensão **Live Server** instalada, clique com o botão direito em `index.html` e escolha **Open with Live Server**.
3. No navegador, experimente clicar em uma peça e trocar o tema.

Se preferir usar Python, rode este comando no terminal, dentro da pasta do projeto.

```sh
python -m http.server 8765
```

A página abre em [localhost:8765](http://localhost:8765/). O servidor local deixa o site ler a lista de produtos. O gabinete 3D usa o Three.js pela internet. Se ele ficar indisponível, entra a imagem estática e os botões das peças continuam abrindo o estoque.

## Cores e revisão

A tabela da paleta cruza todas as cores entre si. Por isso aparecem pares com contraste baixo, como branco sobre branco, que dá **1:1**. No botão principal, o texto branco fica sobre azul e dá **4,70:1**. O mínimo da WCAG 2.2 AA para texto comum é **4,5:1**. Páginas com vidro precisam de uma checagem adicional porque a cor muda conforme o fundo. [Tabela completa](docs/wcag-contraste.md)

Para recalcular a tabela depois de mexer nas cores, rode `node scripts/contraste.js` com o Node.js instalado. O que conferi na parcial e os pontos de ajuste estão na [revisão da entrega](docs/revisao-parcial.md).

## Capturas e processo

| Tela | Tema escuro | Tema claro |
|---|---|---|
| Início no computador | [Captura](docs/prints/inicio-desktop-escuro.png) | [Captura](docs/prints/inicio-desktop-claro.png) |
| Início no celular | [Captura](docs/prints/inicio-celular-escuro.png) | [Captura](docs/prints/inicio-celular-claro.png) |
| Painel de estoque | [Computador](docs/prints/estoque-desktop-escuro.png) | [Celular](docs/prints/estoque-celular-claro.png) |

- [Design Thinking](docs/design-thinking.md) tem as personas, o problema e os primeiros esboços.
- [Registro de IA](docs/registro-ia.md) e [referências](docs/referencias.md) mostram as ferramentas usadas e os créditos das imagens.

## O que fica para a final

Quero deixar o PC inteiro explorável, com aproximação da câmera e uma vista que mostra as peças separadas. Também entram o catálogo completo, o montador guiado, o carrinho com orçamento e avisos de compatibilidade, o glossário, o login fictício e a página de contato.

As opções de acessibilidade vão ganhar um painel completo. A revisão final inclui testes de teclado, zoom e sessões de usabilidade com participantes.
