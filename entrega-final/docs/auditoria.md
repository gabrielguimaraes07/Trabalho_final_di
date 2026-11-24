# Testes do GGTECH

## Depois de reorganizar os arquivos

Os caminhos foram conferidos com as duas versões em uma subpasta, como no GitHub Pages. A final carregou os módulos de Three.js e GSAP, o gabinete, a vista explodida, o catálogo e os dois pesos da fonte Atkinson. O vídeo e a capa abriram no caminho novo. O teste dos 16 setups conferiu a importação das peças e os totais na montagem.

Na parcial, o gabinete girável e a gaveta abriram no Chromium. Os 24 arquivos que compõem o site dessa versão têm o mesmo conteúdo do commit `5615947`. As nove páginas da final foram novamente abertas nos dois temas a 390 e 1.440 px.

## Navegação e catálogo

- **Telas e teclado.** As nove páginas da final foram abertas no Chromium a 1.440 e 390 px, nos temas claro e escuro. O menu compacto abriu pelo teclado. Escape fechou o menu e devolveu o foco ao botão. A barra de total levou ao resumo da montagem.
- **Texto ampliado.** A 200% em 390 px, algumas palavras ultrapassavam a largura da página inicial. A quebra de texto foi corrigida e as nove páginas foram conferidas novamente.
- **Gabinete e movimento.** A imagem de reserva abriu sem WebGL. O carrossel ficou parado com a preferência de movimento reduzido. Na parcial, as quatro categorias e a gaveta abriram corretamente.
- **Busca e comparação.** Os filtros encontraram os novos modelos, e as seis fotos abriram nas categorias correspondentes. A faixa de preço invertida mostrou uma mensagem de erro. Na comparação, os modelos continuaram selecionados ao rolar, e os preços apareceram junto das características.
- **Fotos da página inicial.** Os links dos cinco cartões abriram a categoria correspondente no guia e colocaram o foco no título. [Capturas da final](design-site.md#capturas-da-versão-publicada)

## Montagem, carrinho e formulários

- **Montagem guiada.** Ao escolher estudo e digitar R$ 4.000, o montador mostrou R$ 6.904,76 como o menor valor do catálogo para aquele uso. Com R$ 8.500 na opção de economia, a sugestão exibiu os subtotais e saldo de R$ 1.595,24. O teste também conferiu o limite de R$ 25.000 e a sincronia entre o campo e a régua de orçamento.
- **Montagem manual.** Os 16 setups abriram com peças e totais corretos. Foram testados conflitos de socket e alimentação, troca de peças e cancelamento da substituição de um setup salvo. Com o Ryzen 5 5600G, a etapa de vídeo ficou atendida pelo vídeo integrado. A estimativa de desempenho começou a aparecer depois da seleção de memória.
- **Gabinetes e headsets.** Os três gabinetes e os três headsets novos entraram na montagem, na comparação e no carrinho. No MSI MAG PANO M100R PZ, o simulador sinalizou quando a combinação de discos ultrapassava a capacidade das baias compartilhadas.
- **Carrinho e formulários.** As quantidades e os preços bateram até a revisão da compra simulada. Login e contato mostraram as mensagens esperadas com dados válidos e inválidos.

## Contraste

As legendas na gaveta podiam chegar a 3,84:1 no tema escuro quando havia um fundo claro atrás do vidro. Depois dos ajustes de opacidade e de cor, a legenda chegou a 5,26:1 no escuro e 5,71:1 no claro, no cenário calculado com o fundo mais desfavorável. O item atual do menu ficou em 4,88:1 no escuro e 5,69:1 no claro. No PDF, o total da montagem ficou em 16,83:1 com o texto grafite sobre branco.

O axe verificou a regra de contraste em 48 estados e não apontou violações automáticas. Onde havia sobreposição, foi preciso conferir as cores aplicadas na gaveta, no carrinho, no menu e no painel. O campo de mensagem também foi conferido nos dois temas. [Medições de contraste](wcag-contraste.md)

## Registros das versões anteriores

- **18/11, antes do catálogo atual.** As seis páginas testadas ficaram em 100/100 no item de acessibilidade do Lighthouse 12.8.2, em computador e celular. O axe-core 4.10.3 não apontou violações automáticas nos 15 estados registrados. As telas também foram conferidas a 360 e 1.920 px, com teclado e com ampliação de 200%. O gabinete e a gaveta abriram em Chromium e WebKit 26.5 em Linux. [Lighthouse](capturas/final-auditoria-lighthouse.png) · [axe](capturas/final-auditoria-axe.png)
- **Ajustes manuais em 18/11.** Tab e Shift+Tab revelaram controles encobertos pelo cabeçalho. A rolagem passou a deixá-los à vista. O campo de mensagem mediu 19,29:1 no escuro e 15,46:1 no claro. Nos cálculos com vidro e a camada escura de 72%, as gavetas e o carrinho ficaram acima de 12,76:1 para texto e 4,60:1 para links. Com a redução da transparência, o menu passou de 5:1.
- **Primeiro catálogo real, com 40 modelos e oito setups.** Os testes cobriram memória, armazenamento, baias, refrigeração, cálculo em centavos e itens sem preço. No Chrome, também foram conferidos o painel, a troca de placa-mãe após conflito de socket e a pausa do vídeo do notebook. O gabinete apareceu na alternativa estática nessa sessão.
- **Revisão de 24/11 com 56 produtos.** O catálogo, a gaveta do 3D, o guia e o simulador continuaram mostrando os preços depois que os links de origem saíram da interface. Os testes usaram 1.440 e 390 px. O texto secundário ficou em pelo menos 4,65:1 nos fundos sólidos, links e foco passaram de 5,1:1 e o botão azul com texto branco ficou em 4,70:1.

## O que falta conferir

A navegação em aparelhos Apple ainda está pendente. Os resultados antigos do Lighthouse e do axe registram as versões testadas na época.
