# Contraste do GGTECH

A WCAG 2.2 pede **4,5:1** para texto comum e **3:1** para texto grande e para os elementos visuais necessários para identificar controles ou estados.

O cálculo compara os fundos da página, dos cartões e das áreas translúcidas. No tema escuro, também inclui as paradas do degradê. A camada escura é simulada sobre branco e a clara sobre preto. Cada resultado mostra o menor valor entre as amostras verificadas para aquele uso. Essa medição cobre as combinações de cores listadas.

## Tema escuro

- **Texto principal.** 13,32:1.
- **Texto secundário.** 6,29:1.
- **Links.** 5,93:1.
- **Item selecionado do menu.** 5,89:1.
- **Mensagens de confirmação.** 7,17:1.
- **Mensagens de erro.** 4,79:1.
- **Texto branco no botão principal.** 4,70:1.
- **Contorno de foco.** 5,93:1.
- **Botão principal em relação ao fundo.** 3,09:1.

## Tema claro

- **Texto principal.** 14,32:1.
- **Texto secundário.** 5,31:1.
- **Links.** 5,65:1.
- **Item selecionado do menu.** 5,66:1.
- **Mensagens de confirmação.** 5,39:1.
- **Mensagens de erro.** 5,42:1.
- **Texto branco no botão principal.** 4,70:1.
- **Contorno de foco.** 5,65:1.
- **Botão principal em relação ao fundo.** 4,00:1.

Para refazer o cálculo, rode `node scripts/contraste.js`. O script lê as cores de `css/tokens.css`.

[Registro anterior no Adobe Color](contraste-adobe.md) · [Contraste de texto na WCAG 2.2](https://www.w3.org/TR/WCAG22/#contrast-minimum) · [Contraste de componentes](https://www.w3.org/TR/WCAG22/#non-text-contrast)
