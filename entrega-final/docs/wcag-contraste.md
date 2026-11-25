# Contraste do GGTECH

A WCAG 2.2 pede **4,5:1** para texto comum e **3:1** para texto grande e para os elementos visuais necessários para identificar controles ou estados.

O cálculo compara os fundos da página, dos cartões e das áreas translúcidas. No tema escuro, também inclui as paradas do degradê. A camada escura é simulada sobre branco e a clara sobre preto. Cada resultado mostra o menor valor entre as amostras verificadas para aquele uso. Essa medição cobre as combinações de cores listadas.

## Tema escuro

- **Texto principal.** 10,99:1.
- **Texto secundário.** 7,61:1.
- **Links.** 7,00:1.
- **Item selecionado do menu.** 6,49:1.
- **Contorno lateral do item selecionado e seta da montagem guiada.** 3,81:1.
- **Texto de apoio no cartão da montagem guiada.** 5,30:1.
- **Mensagens de confirmação.** 7,05:1.
- **Mensagens de erro.** 6,96:1.
- **Texto no botão principal.** 9,27:1.
- **Contorno de foco.** 7,00:1.
- **Borda dos campos.** 5,37:1.
- **Botão principal em relação ao fundo.** 7,07:1.

## Tema claro

- **Texto principal.** 11,75:1.
- **Texto secundário.** 5,78:1.
- **Links.** 5,97:1.
- **Item selecionado do menu.** 6,03:1.
- **Contorno lateral do item selecionado e seta da montagem guiada.** 4,46:1.
- **Texto de apoio no cartão da montagem guiada.** 5,38:1.
- **Mensagens de confirmação.** 5,68:1.
- **Mensagens de erro.** 5,60:1.
- **Texto no botão principal.** 7,21:1.
- **Contorno de foco.** 5,97:1.
- **Borda dos campos.** 4,10:1.
- **Botão principal em relação ao fundo.** 5,87:1.

Para refazer o cálculo, rode `node scripts/contraste.js`. O script lê as cores de `css/tokens.css`.

[Registro anterior no Adobe Color](contraste-adobe.md) · [Contraste de texto na WCAG 2.2](https://www.w3.org/TR/WCAG22/#contrast-minimum) · [Contraste de componentes](https://www.w3.org/TR/WCAG22/#non-text-contrast)
