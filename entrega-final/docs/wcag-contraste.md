# Contraste do GGTECH

A WCAG 2.2 pede **4,5:1** para texto comum e **3:1** para texto grande e para os elementos visuais necessários para identificar controles ou estados.

O cálculo usa o menor contraste entre os fundos da página, dos cartões e das superfícies translúcidas. Para simular a condição mais difícil do vidro, o tema escuro é testado sobre branco e o claro, sobre preto. O texto do botão principal é medido sobre seu próprio fundo azul.

## Tema escuro

- **Texto principal.** 13,87:1.
- **Texto secundário.** 5,26:1.
- **Links.** 5,01:1.
- **Mensagens de confirmação.** 7,47:1.
- **Mensagens de erro.** 4,99:1.
- **Texto branco no botão principal.** 4,70:1.
- **Contorno de foco.** 5,01:1.
- **Botão principal em relação ao fundo.** 3,21:1.

## Tema claro

- **Texto principal.** 15,41:1.
- **Texto secundário.** 5,71:1.
- **Links.** 6,08:1.
- **Mensagens de confirmação.** 5,80:1.
- **Mensagens de erro.** 5,84:1.
- **Texto branco no botão principal.** 4,70:1.
- **Contorno de foco.** 6,08:1.
- **Botão principal em relação ao fundo.** 4,30:1.

Para repetir o cálculo, execute `node scripts/contraste.js`. Os valores vêm da paleta em `css/tokens.css`.

[Testes no Adobe Color](contraste-adobe.md) · [Contraste de texto na WCAG 2.2](https://www.w3.org/TR/WCAG22/#contrast-minimum) · [Contraste de componentes](https://www.w3.org/TR/WCAG22/#non-text-contrast)
