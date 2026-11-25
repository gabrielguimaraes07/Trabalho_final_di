# Testes do GGTECH

## Revisão mais recente

- **Navegação.** No Chromium, foram testadas larguras de 320, 390, 1.170, 1.260 e 1.440 px. O menu lateral recolheu, mostrou o rótulo no foco e permaneceu fixo ao rolar. No celular, **Menu** abriu o painel, e Esc devolveu o foco ao botão.
- **Gabinete.** O modelo girou por mouse, toque simulado e teclado. Arrastar manteve a gaveta fechada, e o giro automático voltou depois de alguns segundos sem mexer. O botão de pausa manteve o giro desligado. A seleção abriu a gaveta com fotos e preços. Também foram conferidos zoom, restauração da vista, movimento reduzido e a imagem de reserva sem WebGL.
- **Catálogo e glossário.** O painel de filtros abriu no celular, a categoria escolhida na lateral atualizou a aba, e limpar os filtros voltou a mostrar os 62 produtos. A comparação abriu e a busca aceitou termos e siglas. O link direto para **Socket** chegou à definição e **Ver mais** mostrou o complemento.
- **Visual.** As nove páginas carregaram a DM Sans localmente em 1.440 px. O início e o catálogo também foram conferidos em 320 e 390 px. O tema claro e a opção de alto contraste usaram fundo sólido. [Capturas atualizadas](design-site.md#capturas-da-versão-publicada)

## O site em telas grandes e pequenas

O teste no Chromium passou pelas nove páginas da final, com larguras de 390 e 1.440 px e nos dois temas. Na tela pequena, deu para abrir o menu pelo teclado, fechar com Esc e voltar ao mesmo botão. Na montagem manual, a barra de total levou direto ao resumo.

Com o texto a 200% numa tela de 390 px, algumas palavras passavam da largura na página inicial. A quebra de linha foi ajustada, e as nove páginas foram conferidas de novo. Também foi testado o link dos cinco cartões de peças na home. Cada um abriu a categoria certa no guia e levou o foco ao título. [Capturas do site](design-site.md#capturas-da-versão-publicada)

## Gabinete, catálogo e setups

Na final, o gabinete girou, a vista explodida carregou e a gaveta mostrou as fotos e os preços das peças. Sem WebGL, apareceu a imagem de reserva. Com a preferência de reduzir movimento ligada, o carrossel ficou parado. O vídeo e a imagem de capa do notebook carregaram no caminho da publicação.

Os filtros do catálogo encontraram os três gabinetes e os três headsets adicionados, com as seis fotos. Quando a faixa de preço foi preenchida ao contrário, apareceu um aviso. Na comparação, os modelos ficaram selecionados durante a rolagem e os preços apareceram junto das características. Os 16 setups abriram na montagem manual com suas peças e totais.

As abas do catálogo foram testadas com clique, setas, Home e End. Os links diretos para as 19 categorias abriram a aba e o tipo certos. Também foi conferido o que acontece ao voltar no navegador, combinar a busca com filtros e limpar a seleção. As abas couberam em telas de 320 e 390 px e continuaram acessíveis com o texto ampliado a 200% em 390 px.

A entrega parcial foi aberta em uma subpasta, como no GitHub Pages. O gabinete girou, e as quatro categorias abriram a gaveta. Os 24 arquivos do site dessa versão foram comparados com o commit `5615947`.

## Da escolha das peças ao carrinho

- **Montagem guiada.** Na opção **Estudar**, R$ 4.000 ficou abaixo da menor configuração do catálogo, que custava R$ 6.904,76. Com R$ 8.500 e prioridade em economia, o resultado mostrou os subtotais e um saldo de R$ 1.595,24. O limite de R$ 25.000 e a sincronia entre a régua e o campo também foram conferidos.
- **Montagem manual.** Os testes incluíram um conflito de socket, um de alimentação e o cancelamento da troca de uma montagem salva. Com o Ryzen 5 5600G, o simulador contou o vídeo integrado como saída de vídeo. A estimativa de desempenho apareceu depois de selecionar a memória.
- **Gabinetes e headsets.** Os seis modelos adicionados funcionaram na montagem, na comparação e no carrinho. No MSI MAG PANO M100R PZ, o simulador avisou quando a combinação de discos ultrapassou o espaço nas baias compartilhadas.
- **Compra simulada.** As quantidades e os preços bateram até a tela de revisão. Login e contato mostraram os avisos esperados com exemplos de dados válidos e inválidos.

## Contraste

Na paleta azul-petróleo, o texto secundário mediu pelo menos **6,65:1** no escuro e **5,71:1** no claro nos fundos verificados. O item atual do menu deu **6,57:1** no escuro e **6,25:1** no claro. Também conferi o texto de apoio da montagem guiada quando o mouse passa sobre o cartão. [Cálculo atual](wcag-contraste.md)

Em uma revisão anterior, a transparência da gaveta foi um dos pontos que precisaram de ajuste. No tema escuro, uma legenda chegou a **3,84:1** com um fundo claro atrás da gaveta. A mudança de opacidade e de cor levou o cálculo para **5,26:1** no escuro e **5,71:1** no claro, mesmo nos fundos mais desfavoráveis usados no teste.

No Adobe Color, o item atual do menu deu **4,89:1** no escuro e **5,71:1** no claro com os códigos das cores. O teste no navegador usou as cores aplicadas na tela e deu **4,88:1** e **5,69:1** para o mesmo item. No PDF, o total em grafite sobre branco ficou em **16,83:1**. [Registro anterior no Adobe Color](contraste-adobe.md)

Em uma revisão anterior, o axe checou o contraste em 48 estados e não apontou violações automáticas dessa regra. A gaveta, o carrinho, o menu e o painel também foram conferidos com atenção às cores em camadas. O campo de mensagem foi testado nos dois temas. [Método de cálculo](wcag-contraste.md)

## Testes de versões anteriores

- **18/11.** As seis páginas que existiam no teste ficaram em 100/100 no item de acessibilidade do Lighthouse 12.8.2. O axe-core 4.10.3 não apontou violações automáticas nos 15 estados registrados. A revisão incluiu os tamanhos de 360 e 1.920 px, navegação por teclado e texto a 200%. O gabinete e a gaveta abriram no Chromium e no WebKit 26.5 em Linux. [Lighthouse](capturas/final-auditoria-lighthouse.png) · [axe](capturas/final-auditoria-axe.png)
- **Ajustes que vieram desses testes.** Com Tab e Shift+Tab, alguns controles ficavam atrás do cabeçalho. A rolagem foi ajustada para deixá-los à vista. O campo de mensagem mediu 19,29:1 no escuro e 15,46:1 no claro. Naquele cálculo, com a camada escura de 72%, gavetas e carrinho ficaram acima de 12,76:1 para texto e 4,60:1 para links. Com a transparência reduzida, o menu passou de 5:1.
- **Primeiro catálogo real.** Com 40 modelos e oito setups, foram conferidos memória, armazenamento, baias, refrigeração, soma em centavos e itens sem preço. No Chrome, também foram testados o painel, a troca de placa-mãe depois de um conflito de socket e a pausa do vídeo do notebook. Nessa sessão, o gabinete apareceu na versão estática.
- **24/11, com 56 produtos.** Depois de tirar os links de origem da interface, os preços continuaram visíveis no catálogo, na gaveta, no guia e no simulador. A revisão foi feita a 390 e 1.440 px. O texto secundário ficou em pelo menos 4,65:1 nos fundos sólidos. Links e contorno de foco passaram de 5,1:1 e o texto branco sobre o botão azul ficou em 4,70:1.

## O que falta testar

Ainda falta abrir o site em aparelhos Apple. O WebKit rodou em Linux. As notas do Lighthouse e do axe acima registram as versões conferidas na época.
