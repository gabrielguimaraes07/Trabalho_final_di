# Revisão da entrega parcial

Esta revisão foi feita em 18/11/2026, com o commit `c44953d` como referência. A tag `v0.1-parcial` identifica a primeira publicação e antecede a correção do nome. [Versão usada na revisão](https://github.com/gabrielguimaraes07/Trabalho_final_di/tree/c44953d) · [Site atual](https://gabrielguimaraes07.github.io/Trabalho_final_di/)

## O que estava pronto

- A página inicial tinha cabeçalho, menu, rodapé e link para pular ao conteúdo. Cinco cartões explicavam as peças e o carrossel tinha navegação e pausa.
- O gabinete abria quatro categorias. Cada uma mostrava cinco produtos fictícios e busca por modelo ou marca. Era possível navegar com Tab, abrir com Enter e fechar com Esc. O foco voltava à peça selecionada.
- Os temas claro e escuro persistiam ao recarregar. A paleta ficava no CSS, com cálculo de contraste reproduzível. O repositório já incluía as personas, os esboços e as instruções para testar o site. [Paleta](paleta.md) · [Personas e esboços](design-thinking.md)

No Chromium, a página abriu com zoom de 200% sem rolagem horizontal. Com a biblioteca 3D bloqueada, a imagem de reserva manteve o acesso às quatro categorias. Naquela versão, o Lighthouse marcou 100/100 em acessibilidade para computador e celular. O axe apontou zero violações automáticas no início e no estoque, nos dois temas.

## O que precisou de ajuste

- **Menu com fundo translúcido.** No tema claro, o link “Início” chegou a 2,96:1 com a página rolada. Um fundo mais opaco elevou o contraste para mais de 5,2:1 nas posições medidas nos dois temas.
- **Foco abaixo do menu.** Alguns controles ficavam escondidos pelo cabeçalho. A página passou a ajustar a rolagem ao navegar com Tab e Shift+Tab.
- **Ícone da aba.** O ícone passou a carregar de um SVG local.

## Contraste dos pares usados

| Uso na interface | Escuro | Claro |
|---|---:|---:|
| Texto principal no fundo da página | 19,29:1 | 15,46:1 |
| Texto branco no botão azul | 4,70:1 | 4,70:1 |
| Link azul no fundo da página | 6,96:1 | 5,11:1 |

O mínimo é 4,5:1 para texto comum e 3:1 para texto grande. O cálculo completo inclui combinações que a página usa para outras finalidades ou que aparecem separadas. Uma superfície translúcida também muda conforme o que está atrás dela. [Cálculo completo](wcag-contraste.md) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/#contrast-minimum)
