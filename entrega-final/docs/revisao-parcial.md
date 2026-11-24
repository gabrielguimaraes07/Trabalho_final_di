# Revisão da entrega parcial

A revisão de 18/11/2026 começou no commit `c44953d`, quando o nome já tinha sido corrigido. A cópia que abre no navegador vem do commit `5615947`, com os ajustes de contraste, foco e ícone. É a mesma edição da tag `v0.1.1-parcial`. [Abrir a parcial](https://gabrielguimaraes07.github.io/Trabalho_final_di/entrega-parcial/) · [Baixar a parcial](https://github.com/gabrielguimaraes07/Trabalho_final_di/releases/tag/v0.1.1-parcial)

## O que estava pronto

- A página inicial tinha cabeçalho, menu, rodapé e link para pular ao conteúdo. Cinco cartões explicavam as peças e o carrossel tinha navegação e pausa.
- O gabinete abria quatro categorias. Cada uma mostrava cinco produtos fictícios e busca por modelo ou marca. Era possível navegar com Tab, abrir com Enter e fechar com Esc. O foco voltava à peça selecionada.
- Os temas claro e escuro persistiam ao recarregar. A paleta ficava no CSS, com cálculo de contraste reproduzível. As instruções para abrir o site já estavam no repositório. [Paleta](paleta.md)

No Chromium, a página abriu com zoom de 200% sem rolagem horizontal. Ao bloquear a biblioteca 3D, a imagem de reserva continuou dando acesso às quatro categorias. Naquela versão, o Lighthouse marcou 100/100 no item de acessibilidade para computador e celular, e o axe apontou zero violações automáticas no início e no estoque, nos dois temas.

## O que precisou de ajuste

- **Menu com fundo translúcido.** No tema claro, o link “Início” chegou a 2,96:1 com a página rolada. Um fundo mais opaco elevou o contraste para mais de 5,2:1 nas posições medidas nos dois temas.
- **Foco abaixo do menu.** Alguns controles ficavam escondidos pelo cabeçalho. A página passou a ajustar a rolagem ao navegar com Tab e Shift+Tab.
- **Ícone da aba.** O ícone passou a carregar de um SVG local.

## Contraste dos pares usados

Na entrega parcial, o texto principal mediu 19,29:1 no tema escuro e 15,46:1 no claro. Os links no fundo da página marcaram 6,96:1 no escuro e 5,11:1 no claro. O branco sobre o botão azul ficou em 4,70:1 nos dois temas.

A WCAG usa 4,5:1 como mínimo para texto comum e 3:1 para texto grande. Para consultar as combinações atuais, veja o relatório de contraste. [Cálculo atual](wcag-contraste.md) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/#contrast-minimum)
