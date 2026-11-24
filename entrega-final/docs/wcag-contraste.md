# Contraste do GGTECH

A WCAG 2.2 pede **4,5:1** para texto comum e **3:1** para texto grande e para os elementos visuais necessários para identificar controles ou estados.

O cálculo compara o fundo da página, o dos cartões e o das áreas translúcidas. O resultado mostra o menor valor. Para ver o efeito da transparência, o fundo escuro fica sobre branco e o claro fica sobre preto. O texto do botão é comparado com o próprio azul do botão.

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

Para refazer o cálculo, rode `node scripts/contraste.js`. O script lê as cores de `css/tokens.css`.

[Testes no Adobe Color](contraste-adobe.md) · [Contraste de texto na WCAG 2.2](https://www.w3.org/TR/WCAG22/#contrast-minimum) · [Contraste de componentes](https://www.w3.org/TR/WCAG22/#non-text-contrast)
