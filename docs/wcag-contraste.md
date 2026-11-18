# Contraste da paleta Titânio

Gerado por `node scripts/contraste.js` a partir de `css/tokens.css`.

A WCAG 2.2 nível AA exige pelo menos **4,5:1** para texto comum e **3:1** para texto grande. O limite de **3:1** também se aplica a ícones informativos e partes visuais necessárias para identificar componentes da interface.

Cada par de cores aparece uma vez por tema. A razão é a mesma nos dois sentidos. A classificação usa o resultado antes do arredondamento.

As linhas com `--glass` calculam a cor translúcida sobre o fundo `--bg` do mesmo tema. Com o vidro sobre imagens, a cor e o contraste variam de acordo com o que está atrás dele.

Nos botões principais, a paleta usa `--btn-text` sobre `--btn-primary`. A cor `--accent` é usada em links, foco e destaques.

## Tema escuro

| Primeira cor | Segunda cor | Contraste | Critérios atingidos |
|---|---|---:|---|
| `--bg` (#000000) | `--surface` (#1d1d1f) | 1,25:1 | Abaixo dos limites avaliados |
| `--bg` (#000000) | `--text` (#f5f5f7) | 19,29:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#000000) | `--text-2` (#86868b) | 5,80:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#000000) | `--accent` (#2997ff) | 6,96:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#000000) | `--btn-primary` (#0071e3) | 4,47:1 | Texto grande e elementos visuais |
| `--bg` (#000000) | `--btn-text` (#ffffff) | 21,00:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#000000) | `--success` (#30d158) | 10,39:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#000000) | `--danger` (#ff453a) | 6,16:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#000000) | `--glass` (rgba(29, 29, 31, .6)) | 1,12:1 | Abaixo dos limites avaliados |
| `--surface` (#1d1d1f) | `--text` (#f5f5f7) | 15,46:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#1d1d1f) | `--text-2` (#86868b) | 4,65:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#1d1d1f) | `--accent` (#2997ff) | 5,58:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#1d1d1f) | `--btn-primary` (#0071e3) | 3,58:1 | Texto grande e elementos visuais |
| `--surface` (#1d1d1f) | `--btn-text` (#ffffff) | 16,83:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#1d1d1f) | `--success` (#30d158) | 8,32:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#1d1d1f) | `--danger` (#ff453a) | 4,94:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#1d1d1f) | `--glass` (rgba(29, 29, 31, .6)) | 1,12:1 | Abaixo dos limites avaliados |
| `--text` (#f5f5f7) | `--text-2` (#86868b) | 3,33:1 | Texto grande e elementos visuais |
| `--text` (#f5f5f7) | `--accent` (#2997ff) | 2,77:1 | Abaixo dos limites avaliados |
| `--text` (#f5f5f7) | `--btn-primary` (#0071e3) | 4,31:1 | Texto grande e elementos visuais |
| `--text` (#f5f5f7) | `--btn-text` (#ffffff) | 1,09:1 | Abaixo dos limites avaliados |
| `--text` (#f5f5f7) | `--success` (#30d158) | 1,86:1 | Abaixo dos limites avaliados |
| `--text` (#f5f5f7) | `--danger` (#ff453a) | 3,13:1 | Texto grande e elementos visuais |
| `--text` (#f5f5f7) | `--glass` (rgba(29, 29, 31, .6)) | 17,28:1 | Texto comum, texto grande e elementos visuais |
| `--text-2` (#86868b) | `--accent` (#2997ff) | 1,20:1 | Abaixo dos limites avaliados |
| `--text-2` (#86868b) | `--btn-primary` (#0071e3) | 1,30:1 | Abaixo dos limites avaliados |
| `--text-2` (#86868b) | `--btn-text` (#ffffff) | 3,62:1 | Texto grande e elementos visuais |
| `--text-2` (#86868b) | `--success` (#30d158) | 1,79:1 | Abaixo dos limites avaliados |
| `--text-2` (#86868b) | `--danger` (#ff453a) | 1,06:1 | Abaixo dos limites avaliados |
| `--text-2` (#86868b) | `--glass` (rgba(29, 29, 31, .6)) | 5,19:1 | Texto comum, texto grande e elementos visuais |
| `--accent` (#2997ff) | `--btn-primary` (#0071e3) | 1,56:1 | Abaixo dos limites avaliados |
| `--accent` (#2997ff) | `--btn-text` (#ffffff) | 3,02:1 | Texto grande e elementos visuais |
| `--accent` (#2997ff) | `--success` (#30d158) | 1,49:1 | Abaixo dos limites avaliados |
| `--accent` (#2997ff) | `--danger` (#ff453a) | 1,13:1 | Abaixo dos limites avaliados |
| `--accent` (#2997ff) | `--glass` (rgba(29, 29, 31, .6)) | 6,24:1 | Texto comum, texto grande e elementos visuais |
| `--btn-primary` (#0071e3) | `--btn-text` (#ffffff) | 4,70:1 | Texto comum, texto grande e elementos visuais |
| `--btn-primary` (#0071e3) | `--success` (#30d158) | 2,32:1 | Abaixo dos limites avaliados |
| `--btn-primary` (#0071e3) | `--danger` (#ff453a) | 1,38:1 | Abaixo dos limites avaliados |
| `--btn-primary` (#0071e3) | `--glass` (rgba(29, 29, 31, .6)) | 4,01:1 | Texto grande e elementos visuais |
| `--btn-text` (#ffffff) | `--success` (#30d158) | 2,02:1 | Abaixo dos limites avaliados |
| `--btn-text` (#ffffff) | `--danger` (#ff453a) | 3,41:1 | Texto grande e elementos visuais |
| `--btn-text` (#ffffff) | `--glass` (rgba(29, 29, 31, .6)) | 18,81:1 | Texto comum, texto grande e elementos visuais |
| `--success` (#30d158) | `--danger` (#ff453a) | 1,68:1 | Abaixo dos limites avaliados |
| `--success` (#30d158) | `--glass` (rgba(29, 29, 31, .6)) | 9,30:1 | Texto comum, texto grande e elementos visuais |
| `--danger` (#ff453a) | `--glass` (rgba(29, 29, 31, .6)) | 5,52:1 | Texto comum, texto grande e elementos visuais |

## Tema claro

| Primeira cor | Segunda cor | Contraste | Critérios atingidos |
|---|---|---:|---|
| `--bg` (#f5f5f7) | `--surface` (#ffffff) | 1,09:1 | Abaixo dos limites avaliados |
| `--bg` (#f5f5f7) | `--text` (#1d1d1f) | 15,46:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#f5f5f7) | `--text-2` (#6e6e73) | 4,66:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#f5f5f7) | `--accent` (#0066cc) | 5,11:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#f5f5f7) | `--btn-primary` (#0071e3) | 4,31:1 | Texto grande e elementos visuais |
| `--bg` (#f5f5f7) | `--btn-text` (#ffffff) | 1,09:1 | Abaixo dos limites avaliados |
| `--bg` (#f5f5f7) | `--success` (#1a7f37) | 4,66:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#f5f5f7) | `--danger` (#c9302c) | 4,89:1 | Texto comum, texto grande e elementos visuais |
| `--bg` (#f5f5f7) | `--glass` (rgba(255, 255, 255, .7)) | 1,06:1 | Abaixo dos limites avaliados |
| `--surface` (#ffffff) | `--text` (#1d1d1f) | 16,83:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#ffffff) | `--text-2` (#6e6e73) | 5,07:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#ffffff) | `--accent` (#0066cc) | 5,57:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#ffffff) | `--btn-primary` (#0071e3) | 4,70:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#ffffff) | `--btn-text` (#ffffff) | 1,00:1 | Abaixo dos limites avaliados |
| `--surface` (#ffffff) | `--success` (#1a7f37) | 5,08:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#ffffff) | `--danger` (#c9302c) | 5,33:1 | Texto comum, texto grande e elementos visuais |
| `--surface` (#ffffff) | `--glass` (rgba(255, 255, 255, .7)) | 1,03:1 | Abaixo dos limites avaliados |
| `--text` (#1d1d1f) | `--text-2` (#6e6e73) | 3,32:1 | Texto grande e elementos visuais |
| `--text` (#1d1d1f) | `--accent` (#0066cc) | 3,02:1 | Texto grande e elementos visuais |
| `--text` (#1d1d1f) | `--btn-primary` (#0071e3) | 3,58:1 | Texto grande e elementos visuais |
| `--text` (#1d1d1f) | `--btn-text` (#ffffff) | 16,83:1 | Texto comum, texto grande e elementos visuais |
| `--text` (#1d1d1f) | `--success` (#1a7f37) | 3,31:1 | Texto grande e elementos visuais |
| `--text` (#1d1d1f) | `--danger` (#c9302c) | 3,16:1 | Texto grande e elementos visuais |
| `--text` (#1d1d1f) | `--glass` (rgba(255, 255, 255, .7)) | 16,41:1 | Texto comum, texto grande e elementos visuais |
| `--text-2` (#6e6e73) | `--accent` (#0066cc) | 1,10:1 | Abaixo dos limites avaliados |
| `--text-2` (#6e6e73) | `--btn-primary` (#0071e3) | 1,08:1 | Abaixo dos limites avaliados |
| `--text-2` (#6e6e73) | `--btn-text` (#ffffff) | 5,07:1 | Texto comum, texto grande e elementos visuais |
| `--text-2` (#6e6e73) | `--success` (#1a7f37) | 1,00:1 | Abaixo dos limites avaliados |
| `--text-2` (#6e6e73) | `--danger` (#c9302c) | 1,05:1 | Abaixo dos limites avaliados |
| `--text-2` (#6e6e73) | `--glass` (rgba(255, 255, 255, .7)) | 4,94:1 | Texto comum, texto grande e elementos visuais |
| `--accent` (#0066cc) | `--btn-primary` (#0071e3) | 1,19:1 | Abaixo dos limites avaliados |
| `--accent` (#0066cc) | `--btn-text` (#ffffff) | 5,57:1 | Texto comum, texto grande e elementos visuais |
| `--accent` (#0066cc) | `--success` (#1a7f37) | 1,10:1 | Abaixo dos limites avaliados |
| `--accent` (#0066cc) | `--danger` (#c9302c) | 1,05:1 | Abaixo dos limites avaliados |
| `--accent` (#0066cc) | `--glass` (rgba(255, 255, 255, .7)) | 5,43:1 | Texto comum, texto grande e elementos visuais |
| `--btn-primary` (#0071e3) | `--btn-text` (#ffffff) | 4,70:1 | Texto comum, texto grande e elementos visuais |
| `--btn-primary` (#0071e3) | `--success` (#1a7f37) | 1,08:1 | Abaixo dos limites avaliados |
| `--btn-primary` (#0071e3) | `--danger` (#c9302c) | 1,13:1 | Abaixo dos limites avaliados |
| `--btn-primary` (#0071e3) | `--glass` (rgba(255, 255, 255, .7)) | 4,58:1 | Texto comum, texto grande e elementos visuais |
| `--btn-text` (#ffffff) | `--success` (#1a7f37) | 5,08:1 | Texto comum, texto grande e elementos visuais |
| `--btn-text` (#ffffff) | `--danger` (#c9302c) | 5,33:1 | Texto comum, texto grande e elementos visuais |
| `--btn-text` (#ffffff) | `--glass` (rgba(255, 255, 255, .7)) | 1,03:1 | Abaixo dos limites avaliados |
| `--success` (#1a7f37) | `--danger` (#c9302c) | 1,05:1 | Abaixo dos limites avaliados |
| `--success` (#1a7f37) | `--glass` (rgba(255, 255, 255, .7)) | 4,95:1 | Texto comum, texto grande e elementos visuais |
| `--danger` (#c9302c) | `--glass` (rgba(255, 255, 255, .7)) | 5,19:1 | Texto comum, texto grande e elementos visuais |

[WCAG 2.2, contraste mínimo de texto](https://www.w3.org/TR/WCAG22/#contrast-minimum) · [WCAG 2.2, contraste de elementos não textuais](https://www.w3.org/TR/WCAG22/#non-text-contrast)
