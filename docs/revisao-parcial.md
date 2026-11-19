# Revisão da entrega parcial

Conferência feita em 18/11/2026 com a lista da entrega parcial do documento do projeto. O teste usou a versão publicada em `main` no commit `c44953d` como referência. [Site publicado](https://gabrielguimaraes07.github.io/Trabalho_final_di/)

## O que conferi

| Requisito | Evidência |
|---|---|
| Repositório e publicação | Repositório público de Gabriel Guimarães, commits por etapa e site no GitHub Pages. A tag `v0.1-parcial` identifica a primeira publicação e antecede a correção do nome. O link do README abre a versão atual. |
| Paleta e cálculo de contraste | Os valores estão em `css/tokens.css`. O script `scripts/contraste.js` gera a tabela com os dois temas. |
| Personas, problema e esboços | [Design Thinking](design-thinking.md) contém duas personas, a pergunta do projeto e esboços das telas. |
| Estrutura da página | O início tem cabeçalho, navegação, conteúdo principal, rodapé e link para pular direto para o conteúdo. |
| PC girável e estoque | As quatro peças abrem as categorias do catálogo. Cada categoria mostra cinco produtos e permite buscar pelo nome ou pela marca. |
| Acesso pelo teclado | Tab chega aos pontos sobre o gabinete. Enter abre o estoque e Esc fecha o painel e devolve o foco. A página ajusta a rolagem para manter o controle focado abaixo do cabeçalho. |
| Dois temas | Claro e escuro funcionam e a escolha é mantida depois de recarregar. |
| Cartões e carrossel | Cinco cartões explicam as peças. O carrossel permite voltar, avançar e pausar. |
| Catálogo | O arquivo `data/produtos.json` tem 20 produtos fictícios distribuídos entre quatro categorias. |
| README e capturas | O [README](../README.md) explica como abrir e testar o projeto, mostra capturas e lista os próximos recursos. |

A revisão em Chromium verificou o fluxo em computador e celular simulado. A página abriu com zoom de 200% sem rolagem horizontal. Também bloqueei a biblioteca 3D para conferir que a imagem de reserva e os botões em texto ainda permitem abrir as quatro categorias. A página marcou 100/100 de acessibilidade no Lighthouse nos dois perfis. O axe apontou zero violações automáticas nos testes da página e do estoque em ambos os temas.

## O que a tabela de contraste mostra

O mínimo para texto comum é **4,5:1**. Para texto grande, o mínimo é **3:1**. As partes visuais que identificam um controle ou estado também têm referência de **3:1**. [WCAG 2.2](https://www.w3.org/TR/WCAG22/#contrast-minimum) · [Contraste de componentes](https://www.w3.org/TR/WCAG22/#non-text-contrast)

| Uso na interface | Tema escuro | Tema claro |
|---|---:|---:|
| Texto principal sobre o fundo da página | 19,29:1 | 15,46:1 |
| Texto branco no botão principal azul | 4,70:1 | 4,70:1 |
| Link azul sobre o fundo da página | 6,96:1 | 5,11:1 |

O cálculo também cruza cores que não são usadas juntas como texto e fundo. Branco sobre branco, por exemplo, aparece com 1:1. As superfícies translúcidas precisam ser medidas com o que passa atrás delas. [Tabela completa](wcag-contraste.md)

## Ajustes depois da revisão

- **Contraste na navegação.** No tema claro, o link “Início” chegava a 2,96:1 com a página rolada. A barra agora usa um fundo mais opaco e mantém o desfoque. O link ficou acima de 5,2:1 nas posições medidas nos dois temas, em computador e celular.
- **Foco durante a rolagem.** A página ajusta a posição quando o cabeçalho encobre o controle que recebe o foco. O ajuste foi conferido com Tab e Shift+Tab em computador e celular.
- **Ícone da aba.** A página carrega o ícone do projeto a partir de um arquivo SVG local.
