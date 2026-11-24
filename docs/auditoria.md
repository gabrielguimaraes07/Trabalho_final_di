# Testes do GGTECH

## Ajuste de contraste

A legenda de preço da gaveta podia chegar a 3,84:1 no tema escuro com um fundo claro atrás do vidro. O menu, a gaveta e o painel de acessibilidade ganharam fundos mais opacos. Também foram ajustadas as cores do texto secundário, dos links e dos avisos. No cálculo com os fundos mais desfavoráveis, a legenda ficou em 5,26:1 no escuro e 5,71:1 no claro. [Cálculos](wcag-contraste.md)

O axe verificou a regra de contraste em 48 estados no Chromium, nos dois temas e em janelas de 1.440 e 390 px. A ferramenta não indicou violações automáticas. Os elementos sobrepostos pediram verificação manual. Os contrastes do menu fixo, da gaveta, do carrinho, do painel e do campo de mensagem foram conferidos com os estilos aplicados nos dois temas. O total da montagem passou a usar grafite sobre branco na impressão e ficou em 16,83:1 no PDF.

## Revisão de 24/11/2026

Esta revisão usou a versão com nove páginas, 56 produtos, 19 categorias e 16 setups. A maior parte dos cenários foi automatizada. O Chromium também foi usado para conferir os fluxos na versão publicada.

- **Catálogo.** A busca e os filtros foram conferidos junto das fotos e dos preços. O filtro avisa quando a faixa de preço está invertida. A barra mantém os modelos escolhidos e leva o foco à tabela de comparação, onde cada especificação fica na mesma linha.
- **Montador guiado.** Com R$ 4.000 para estudar, o montador mostrou R$ 6.904,76 como o menor valor disponível e voltou à pergunta de orçamento. Com R$ 8.500 e prioridade em economia, a sugestão mostrou fotos, subtotais e saldo de R$ 1.595,24. Foram conferidos o limite de R$ 25.000 e a sincronia entre campo e régua.
- **Montagem manual.** Os 16 setups abriram com peças e totais corretos. Foram testados conflito de socket e alimentação, troca de peças e cancelamento de substituição ou sobrescrita. O Ryzen 5 5600G sozinho marcou duas etapas essenciais porque tem vídeo integrado. A avaliação de desempenho apareceu após adicionar memória.
- **Carrinho e formulários.** Quantidades e preços conferiram até a revisão da compra simulada. Contato e login exibiram mensagens nos casos válido e inválido.
- **Contraste.** O texto secundário mediu pelo menos 4,65:1 nos fundos sólidos usados. Links e foco passaram de 5,1:1, e o branco sobre o azul do botão principal mediu 4,70:1. [Cálculos](wcag-contraste.md)

No Chromium de computador, com 393 px de largura útil via zoom, foi possível abrir o menu pelo teclado, fechar com Escape e voltar ao botão. Também foi conferido se a barra de total levava ao resumo abaixo do cabeçalho. Na revisão que retirou os links de referência, as páginas foram verificadas em janelas de 1.440 e 390 px. O catálogo, a gaveta do 3D, o guia e o simulador continuaram mostrando os preços.

## O que mudou entre as versões

A primeira versão com peças reais tinha 40 modelos e oito setups. Foram testados os limites de RAM, portas para armazenamento, baias, ventilação e altura do cooler, além do cálculo em centavos e dos itens sem preço. No Chrome, a revisão da versão publicada abriu o painel, trocou uma placa-mãe após conflito de socket e pausou o vídeo do notebook. Nesse teste, o navegador exibiu a vista estática do gabinete. [Capturas da entrega](design-site.md#capturas-da-versão-publicada)

Na revisão dos setups, os testes conferiram totais, compatibilidade e a importação no simulador. Na edição seguinte, foram verificados os links dos cinco cartões da página inicial. Eles levaram à categoria e ao título correspondente no guia.

## Lighthouse e axe em 18/11/2026

A medição abaixo foi feita na versão com seis páginas e 45 produtos que antecedeu o catálogo atual. O Lighthouse 12.8.2 deu **100/100 em acessibilidade** em todos os seis casos, nos perfis de computador e celular. Foram avaliados início, estoque, montador, glossário, login e contato. [Resumo do Lighthouse](prints/final-auditoria-lighthouse.png)

O axe-core 4.10.3 encontrou **zero violações automáticas em 15 estados**. As seis páginas foram abertas no tema escuro a 1.440 × 900 px e no claro a 393 × 852 px. Os outros casos foram gaveta de peças, painel de acessibilidade e carrinho acima do orçamento. [Resumo do axe](prints/final-auditoria-axe.png)

### O que foi conferido à mão

- **Foco.** Os controles do carrinho e da acessibilidade apontavam para seus diálogos, e o foco voltava ao botão ao fechar com Esc. O teste com Tab e Shift+Tab encontrou focos encobertos pelo menu fixo. Foi feito um ajuste de rolagem para deixá-los visíveis.
- **Contraste.** O texto do campo de mensagem marcou 19,29:1 no escuro e 15,46:1 no claro. Para as gavetas e o carrinho, o pior fundo simulado deu pelo menos 12,76:1 para o texto principal e 4,60:1 para links. O cálculo compôs o vidro sobre branco no tema escuro e sobre preto no claro, incluindo a camada de fundo de 72% das gavetas. Após reduzir a transparência do menu, os links ficaram acima de 5:1. [Relatório de contraste](wcag-contraste.md)
- **Zoom e largura.** As seis páginas abriram a 360 e 1.920 px sem rolagem horizontal. Também foram conferidos o zoom de 200%, o texto ampliado e a abertura do painel pelo teclado.
- **Com e sem WebGL.** O 3D e a gaveta abriram no Chromium e no WebKit 26.5 em Linux. Sem WebGL, a alternativa estática manteve nove pontos clicáveis. Com movimento reduzido, os títulos apareceram sem a animação.

A verificação em aparelhos Apple continua pendente.
