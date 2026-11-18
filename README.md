# GGTECH

A GGTECH é uma loja fictícia para quem vai montar o primeiro PC. A página inicial ensina a função das peças e permite explorar o catálogo clicando em um computador 3D montado em código. É um projeto acadêmico de Desenvolvimento de Interfaces do CEUB em 2026.

## Entrega parcial — `v0.1-parcial`

- PC girável com quatro peças selecionáveis por mouse, toque ou teclado. A imagem de reserva e os botões em texto também abrem o estoque.
- Gaveta com busca por nome ou marca e **20 produtos fictícios**, cinco em cada categoria.
- Temas claro e escuro com a escolha salva no navegador.
- Cinco cartões com analogias sobre as peças e carrossel de setups com controles e pausa.

## Como rodar localmente

Com o repositório baixado, abra a pasta `ggtech` no Visual Studio Code. Com a extensão **Live Server** instalada, clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Com Python instalado, você também pode iniciar o servidor pelo terminal na pasta do projeto.

```sh
python -m http.server 8765
```

Abra a página pelo endereço do servidor. [http://localhost:8765](http://localhost:8765)

O servidor permite que o navegador carregue `data/produtos.json` pelo comando `fetch`. A conexão com a internet carrega o Three.js e a fonte Inter. Quando o 3D está indisponível, a página usa a imagem estática do gabinete.

### Gerar a tabela de contraste

Com Node.js instalado, rode o comando abaixo na pasta do projeto. Ele lê as cores de `css/tokens.css` e atualiza o documento de contraste.

```sh
node scripts/contraste.js
```

## Capturas e documentação

| Tela | Tema escuro | Tema claro |
|---|---|---|
| Início no computador | [Captura](docs/prints/inicio-desktop-escuro.png) | [Captura](docs/prints/inicio-desktop-claro.png) |
| Início no celular | [Captura](docs/prints/inicio-celular-escuro.png) | [Captura](docs/prints/inicio-celular-claro.png) |
| Gaveta de estoque | [Computador](docs/prints/estoque-desktop-escuro.png) | [Celular](docs/prints/estoque-celular-claro.png) |

- Personas, problema e primeiros esboços. [Design Thinking](docs/design-thinking.md)
- Cores avaliadas nos dois temas. [Tabela de contraste](docs/wcag-contraste.md)
- Uso de IA e origem das imagens. [Registro de IA](docs/registro-ia.md) · [Créditos](docs/referencias.md)

## Revisão da parcial

O Lighthouse avaliou a acessibilidade da página inicial em **100/100** nos perfis de computador e celular simulado. A verificação com axe encontrou zero violações automáticas na página e na gaveta nos dois temas. O contraste da gaveta translúcida foi conferido por cálculo separado. Também foram verificados o atalho para o conteúdo, o filtro e o retorno do foco ao fechar a gaveta pelo teclado.

## Previsto para a entrega final

- Tornar todas as peças do PC selecionáveis, animar a câmera e apresentar a vista explodida e as explicações na rolagem.
- Completar o estoque com mais categorias, filtros e pelo menos 40 produtos.
- Implementar montador guiado, carrinho com orçamento e compatibilidade, glossário, login fictício e contato.
- Completar as opções de acessibilidade, revisar teclado e zoom, aplicar os testes com usuários e reunir a documentação do relatório.

## GitHub Pages

Endereço previsto para a publicação da GGTECH. [gabrielguimaraes07.github.io/Trabalho_final_di](https://gabrielguimaraes07.github.io/Trabalho_final_di/)
