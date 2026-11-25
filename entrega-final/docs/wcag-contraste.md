# Contraste do GGTECH

A WCAG 2.2 pede **4,5:1** para texto comum e **3:1** para texto grande e para os elementos visuais necessários para identificar controles ou estados.

O cálculo compara os fundos da página, dos cartões e das áreas translúcidas. No tema escuro, também inclui as paradas do degradê. A camada escura é simulada sobre branco e a clara sobre preto. Cada resultado mostra o menor valor entre as amostras verificadas para aquele uso. Essa medição cobre as combinações de cores listadas.

## Tema escuro

- **Texto principal.** 10,14:1.
- **Texto secundário.** 6,65:1.
- **Links.** 6,12:1.
- **Item selecionado do menu.** 6,57:1.
- **Contorno lateral do item selecionado e seta da montagem guiada.** 4,44:1.
- **Texto de apoio no cartão da montagem guiada.** 5,99:1.
- **Mensagens de confirmação.** 6,36:1.
- **Mensagens de erro.** 6,27:1.
- **Texto no botão principal.** 9,45:1.
- **Contorno de foco.** 6,12:1.
- **Borda dos campos.** 5,20:1.
- **Botão principal em relação ao fundo.** 6,44:1.

## Tema claro

- **Texto principal.** 12,01:1.
- **Texto secundário.** 5,71:1.
- **Links.** 6,20:1.
- **Item selecionado do menu.** 6,25:1.
- **Contorno lateral do item selecionado e seta da montagem guiada.** 4,55:1.
- **Texto de apoio no cartão da montagem guiada.** 5,27:1.
- **Mensagens de confirmação.** 5,85:1.
- **Mensagens de erro.** 5,77:1.
- **Texto no botão principal.** 6,63:1.
- **Contorno de foco.** 6,20:1.
- **Borda dos campos.** 3,99:1.
- **Botão principal em relação ao fundo.** 5,58:1.

Para refazer o cálculo, rode `node scripts/contraste.js`. O script lê as cores de `css/tokens.css`.

[Registro anterior no Adobe Color](contraste-adobe.md) · [Contraste de texto na WCAG 2.2](https://www.w3.org/TR/WCAG22/#contrast-minimum) · [Contraste de componentes](https://www.w3.org/TR/WCAG22/#non-text-contrast)
