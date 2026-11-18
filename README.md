# GGTECH

A GGTECH é uma loja acadêmica fictícia para quem vai montar o primeiro PC. O projeto foi desenvolvido para a disciplina de Desenvolvimento de Interfaces do CEUB em 2026, por **Gabriel Guimarães**.

[Entrega parcial no GitHub Pages](https://gabrielguimaraes07.github.io/Trabalho_final_di/)

## Recursos da entrega final

- PC 3D com nove categorias clicáveis, aproximação da câmera, vista explodida e alternativa estática.
- Estoque com 45 produtos fictícios, sugestões de busca e filtros de preço, nível e disponibilidade.
- Carrinho com orçamento, quantidade e avisos de compatibilidade.
- Montador com três perguntas e configurações prontas para jogar, estudar e criar conteúdo.
- Glossário de 29 termos, login fictício e formulário de contato simulado.
- Painel de acessibilidade com tema, tipografia, contraste, espaçamento, sublinhado, redução de movimento e opção para desativar o atalho de busca.

O código da entrega final está na branch `entrega-final`. A tag `v0.1-parcial` identifica a entrega parcial. O roteiro de usabilidade está disponível para as sessões com 3 a 5 pessoas.

## Como rodar localmente

1. Baixe o repositório e abra a pasta `ggtech` no Visual Studio Code.
2. Com a extensão **Live Server** instalada, clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Com Python instalado, você também pode abrir um servidor pelo terminal, na pasta do projeto.

```sh
python -m http.server 8765
```

Abra a página pelo endereço do servidor. [http://localhost:8765](http://localhost:8765)

O servidor permite que o navegador carregue os arquivos JSON usados no estoque, nas configurações prontas e no glossário. Three.js, GSAP e Inter são carregados pela internet. As ilustrações, a fonte de leitura e os dados estão no projeto.

### Atualizar a tabela de contraste

Com Node.js instalado, rode o comando abaixo na pasta do projeto. Ele lê as cores de `css/tokens.css` e atualiza `docs/wcag-contraste.md`.

```sh
node scripts/contraste.js
```

## Construção por etapas

| Etapa | Trabalho |
|---|---|
| Estrutura e design | Páginas, paleta Titânio, contraste, personas e primeiros esboços. |
| Entrega parcial | PC com quatro partes selecionáveis, temas, cartões e carrossel. |
| Acessibilidade e 3D | Painel de preferências, nove peças, câmera e vista explodida. |
| Loja e montador | Catálogo, carrinho, compatibilidade, perguntas e configurações prontas. |
| Ajuda e formulários | Glossário, login fictício, contato e perguntas frequentes. |
| Revisão | Animações de texto, verificações de acessibilidade, capturas e roteiro de usabilidade. |

## Material para o relatório

| Parte | Arquivos |
|---|---|
| A — Cores | [Paleta](docs/paleta.md) · [Psicologia das cores](docs/psicologia-cores.md) · [Tabela de contraste](docs/wcag-contraste.md) |
| B — Design e telas | [Design do site e capturas](docs/design-site.md) |
| C — IHC e experiência | [Heurísticas](docs/heuristicas-nielsen.md) · [IHC, UX e UI](docs/ihc-ux-ui.md) · [Design Thinking](docs/design-thinking.md) |
| D — Processo e fontes | [Uso de IA](docs/registro-ia.md) · [Referências e créditos](docs/referencias.md) |
| E — Código | [Índice dos arquivos](docs/codigo.md) |
| Revisão | [Auditoria técnica](docs/auditoria.md) · [Roteiro e questionário SUS](docs/usabilidade.md) |
