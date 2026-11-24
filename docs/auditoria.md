# Auditoria técnica — GGTECH

As medições de 18/11 registram a base de seis páginas. A seção final descreve os testes executados após a entrada do catálogo real e do simulador.

Revisão local de 18/11/2026. O alvo de acessibilidade para a entrega é 95 ou mais no Lighthouse.

## Lighthouse e axe

O Lighthouse 12.8.2 inspecionou a acessibilidade de cada página no Chromium, com os perfis padrão de computador e celular. [Captura do resumo do Lighthouse](prints/final-auditoria-lighthouse.png)

| Página | Computador | Celular |
|---|---:|---:|
| Início | 100/100 | 100/100 |
| Estoque | 100/100 | 100/100 |
| Montador | 100/100 | 100/100 |
| Glossário | 100/100 | 100/100 |
| Login | 100/100 | 100/100 |
| Contato | 100/100 | 100/100 |

O axe-core 4.10.3 encontrou **zero violações automáticas em 15 estados**. Foram verificadas seis páginas no tema escuro a 1440 × 900 px e no claro a 393 × 852 px, além da gaveta de peças, do painel de acessibilidade e do carrinho acima do orçamento. [Captura do resumo do axe](prints/final-auditoria-axe.png)

As regras marcadas para verificação manual foram conferidas nos seguintes elementos.

| Verificação | Resultado |
|---|---|
| `aria-controls` do carrinho e da acessibilidade | Os IDs apontam para os diálogos corretos. Ao fechar com Esc, o foco volta para o botão que abriu cada painel. |
| Contraste do campo de mensagem | Texto a 19,29:1 no tema escuro e 15,46:1 no claro. |
| Contraste das gavetas e do carrinho | Com o fundo mais desfavorável em cada tema, o texto principal fica acima de 12,76:1 e o link em azul acima de 4,60:1. |
| Contraste da navegação fixa | A transparência foi reduzida. Os links sobre o fundo mais desfavorável de cada tema ficaram acima de 5:1. |

As razões para superfícies translúcidas usam a cor após compor o fundo sobre branco no tema escuro e sobre preto no claro. O cálculo das gavetas inclui a camada de fundo de 72%. [Tabela de contraste da paleta](wcag-contraste.md)

## Navegação e comportamento

- Pelo teclado, foram testados os nove pontos de seleção do PC, as gavetas, as abas e sugestões do catálogo, o carrinho, o montador, o painel de acessibilidade, o glossário, os formulários e as perguntas frequentes. O atalho `/` pode ser desligado no painel e a preferência continua depois de recarregar.
- A revisão com Tab e Shift+Tab encontrou elementos encobertos pelo menu em tela estreita. O ajuste de rolagem mantém o elemento focado visível abaixo do cabeçalho.
- Com o zoom nativo do Chromium a 200%, as seis páginas passaram de 1.440 px para 720 px de largura útil sem rolagem horizontal. O painel de acessibilidade abriu e fechou pelo teclado em cada página. As seis páginas também foram testadas com o texto ampliado a 200% em larguras de 393 px e 1.440 px.
- As seis páginas também abriram sem rolagem horizontal a 360 px e 1.920 px.
- No Chromium e no WebKit 26.5, as seis páginas abriram sem erros de console nos perfis de computador e celular. No WebKit, o gabinete 3D, a gaveta e o painel abriram nos dois tamanhos. O teste de WebKit foi feito em Linux. A verificação no Safari em aparelhos Apple continua pendente.
- Com WebGL desativado no Chromium, a vista estática manteve os nove pontos clicáveis. Com movimento reduzido, as revelações de títulos foram desativadas e o texto ficou visível.

## Estado da entrega final

- [x] PC 3D com nove categorias, aproximação da câmera e gaveta de estoque.
- [x] Estoque com abas, busca, filtros e 45 produtos.
- [x] Login fictício e contato com validação.
- [x] Painel de acessibilidade em todas as páginas.
- [x] Carrinho com orçamento e compatibilidade.
- [x] Glossário, dicas de termos e montador guiado.
- [x] Animações de texto, vista explodida, contornos, ventoinhas e RGB.
- [x] Lighthouse, axe, navegação por teclado e zoom de 200%.
- [x] Documentação, capturas e README para a entrega final.
- [ ] Sessões com 3 a 5 pessoas, pontuação SUS e correções motivadas pelos testes. [Roteiro de usabilidade](usabilidade.md)
- [x] Publicação da entrega final no GitHub Pages com a tag `v1.0-final`.

## Catálogo e simulador da versão final

A auditoria acima é o registro da base anterior à ampliação do catálogo. A versão de novembro de 2026 inclui 40 modelos reais, 19 categorias e oito configurações. Os testes das regras conferiram cenários compatíveis, socket e DDR divergentes, excesso de RAM e unidades M.2, falta de baias, ventilação, altura do cooler e fonte insuficiente. Também foram conferidos os subtotais em centavos, os preços ausentes, a troca de peças e o salvamento local.

As entrevistas e o questionário SUS seguem como etapas pendentes. O roteiro fica disponível para aplicação com participantes. [Roteiro de usabilidade](usabilidade.md)

No Chrome da versão publicada, foram verificados o painel de acessibilidade, o catálogo, a troca de placa-mãe após um conflito de socket e a pausa do vídeo do notebook. O navegador exibiu a alternativa estática do gabinete. A vista interativa em WebGL já tinha sido testada na base, e o modelo 3D foi preservado. As capturas atuais registram a viewport de computador. [Capturas](design-site.md#capturas-da-versão-publicada)

## Edição local para apresentação

O teste automatizado de interface conferiu o carregamento dos 40 registros, as 40 relações entre imagem e modelo, a busca, a seleção por cartão, o filtro de compatibilidade, a troca de placa-mãe, o cálculo do total, a quantidade de memória, a reabertura de montagens e a gaveta do 3D. Foram conferidos os arquivos de mídia e as oito configurações recomendadas. A prévia visual desta edição ficou indisponível no ambiente de verificação.

Na revisão dos setups, foram conferidos os 16 totais, as imagens, as regras de compatibilidade e a importação pelo simulador. O teste do guia verificou a foto e o preço com a origem da cotação para cada um dos 40 modelos. A prévia visual desta revisão ficou indisponível.

## Revisão de interfaces de 24/11/2026

A edição reúne 9 páginas, 56 produtos, 19 tipos de peça e 16 setups. Os preços são referências, com as ofertas indisponíveis marcadas como históricas.

| Verificação | O que passou nesta revisão |
|---|---|
| Navegação | Abertura do menu compacto, fechamento com Escape, retorno do foco ao botão e transição para a navegação de computador no teste de DOM. |
| Catálogo | Todas as fotos e cotações, busca, categoria e tipo, faixa invertida, limpeza de filtros e comparação de preços na mesma linha. |
| Montagem guiada | Limite de R$ 25.000, sincronização entre campo e régua, mensagem de orçamento insuficiente e critérios de economia, desempenho e RGB. |
| Montagem manual | Importação dos 16 setups, total, troca de peças, conflito de socket e de alimentação, salvamento e cancelamento de substituição ou sobrescrita. |
| Carrinho e formulários | Quantidades e cotações preservadas até a compra simulada. Contato e login conferidos em estados inválido e válido, com confirmação fictícia. |
| Contraste | O texto secundário ficou em 4,65:1 ou mais sobre os fundos sólidos usados nos dois temas. Links e foco passaram de 5,1:1, e o texto branco nos botões azuis ficou em 4,70:1. |

O contraste foi calculado para as cores usadas e os fluxos foram conferidos com testes automatizados de interface. As notas Lighthouse e axe acima pertencem à base indicada no início. As sessões com participantes e a pontuação SUS ainda dependem da aplicação do roteiro. [Roteiro de usabilidade](usabilidade.md)

No Chromium, na versão publicada, foram conferidos o tema claro e o escuro, a gaveta com seis fontes e o catálogo com sete placas de vídeo. Com 393 px de largura útil via zoom, o menu abriu por teclado, fechou com Escape e devolveu o foco. A barra de total levou ao resumo abaixo do cabeçalho. Também foi conferida a sincronização do orçamento digitado. Esse teste de largura foi feito no Chromium de computador.

## Acabamento do catálogo e da montagem

- No teste automatizado do montador guiado, **Estudar** com R$ 4.000 exibiu o menor total do catálogo, R$ 6.904,76, na etapa de orçamento. A sugestão de Economia com R$ 8.500 exibiu miniaturas, subtotais e saldo de R$ 1.595,24.
- A barra de comparação manteve a seleção por tipo, levou o foco ao quadro e permitiu remover modelos individualmente. As linhas de processador, memória, placa-mãe, SSD e fonte foram conferidas, incluindo o vídeo integrado do Ryzen 5 5600G.
- O Ryzen 5 5600G sozinho marcou duas etapas, com a saída de vídeo atendida automaticamente. A orientação sobre desempenho apareceu uma vez e deu lugar à avaliação quando a memória foi selecionada.
- As cinco fotos da página inicial foram conferidas. Os links abriram a categoria correspondente no guia e levaram o foco ao título da seção.
