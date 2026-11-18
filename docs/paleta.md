# A1 — Paleta Titânio

| Token | Escuro | Claro | Uso no GGTECH |
|---|---|---|---|
| `--bg` | `#000000` | `#f5f5f7` | Fundo das páginas e das áreas em que o produto precisa se destacar. |
| `--surface` | `#1d1d1f` | `#ffffff` | Cartões, campos de formulário e painéis sólidos. |
| `--text` | `#f5f5f7` | `#1d1d1f` | Títulos, textos principais e valores. |
| `--text-2` | `#86868b` | `#6e6e73` | Textos secundários e bordas de apoio. |
| `--accent` | `#2997ff` | `#0066cc` | Links, contornos do 3D, foco e seleção. |
| `--btn-primary` | `#0071e3` | `#0071e3` | Fundo do botão principal. |
| `--btn-text` | `#ffffff` | `#ffffff` | Texto do botão principal. |
| `--success` | `#30d158` | `#1a7f37` | Confirmações e estados de compatibilidade. |
| `--danger` | `#ff453a` | `#c9302c` | Orçamento excedido, erros e avisos. |
| `--glass` | `rgba(29, 29, 31, .6)` | `rgba(255, 255, 255, .7)` | Navegação e gavetas com efeito translúcido. |
| `--glass-blur` | `blur(20px)` | `blur(20px)` | Desfoque atrás do vidro. |

- O branco no botão azul primário tem contraste de **4,70:1**. O cinza secundário tem pelo menos **4,65:1** nos fundos sólidos previstos. [Tabela WCAG](wcag-contraste.md)
- O painel de alto contraste usa superfícies sólidas, aproxima o texto secundário da cor principal e reforça as bordas.
- As cores e medidas vêm do mesmo arquivo. A tipografia usa Inter, a grade usa múltiplos de 8 px e os cantos usam 12 px em cartões e 999 px em botões arredondados. [Tokens](../css/tokens.css)
