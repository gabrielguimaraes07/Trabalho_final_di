# Design do site

O GGTECH foi pensado para quem quer montar o primeiro PC e ainda está aprendendo o nome, a função e o preço de cada peça. A página inicial dá dois caminhos para começar. **Começar pela montagem guiada** abre a seleção por uso e orçamento. **Escolher cada peça** leva direto ao simulador manual.

## Identidade visual e navegação

O gabinete é a primeira coisa que ganha destaque. Usei um fundo em degradê de azul acinzentado para grafite, a fonte DM Sans e um G branco em um quadrado azul. O ícone aparece no cabeçalho, no rodapé e na aba do navegador. No catálogo, a foto, o nome e o preço vêm antes dos detalhes da peça nos dois temas. O azul marca links, seleções e foco no teclado. Nos avisos de montagem e orçamento, a cor chama a atenção e o texto explica o que aconteceu. [Psicologia das cores](psicologia-cores.md)

No computador, a barra lateral fica visível durante a rolagem e pode ser recolhida. Ela mostra o item atual, e os nomes aparecem ao focar os ícones ou ao passar o mouse no modo recolhido. No celular, o botão **Menu** abre o painel, e Esc fecha e devolve o foco. Entrar, Acessibilidade e Carrinho ficam no cabeçalho nos dois tamanhos. Na montagem manual, as áreas de escolha e resumo ficam lado a lado no computador. No celular, a barra com o total leva ao resumo completo. [Início no celular](capturas/apresentacao-celular.jpg) · [Montagem manual](capturas/apresentacao-simulador.jpg)

## Explorar o gabinete e aprender sobre as peças

Na página inicial, dá para girar o PC com mouse, toque ou setas. A rotação automática dá lugar ao controle manual assim que a pessoa começa a mexer. A câmera desacelera perto da peça e, ao fechar a gaveta, retoma a visão anterior. Também há botões de zoom e de restauração da vista. Ao escolher uma categoria, a gaveta lateral explica o que a peça faz e mostra modelos, fotos e preços. A busca na gaveta filtra por nome ou marca. Os botões abaixo do gabinete abrem as mesmas categorias. Se o 3D ficar indisponível, o site mostra uma imagem do gabinete com os controles em texto. [Gaveta de peças](capturas/apresentacao-gabinete.jpg)

Na seção **Por dentro do seu PC**, a rolagem e a régua de separação mostram onde cada peça fica. Os cartões da página inicial usam exemplos do dia a dia, como a RAM comparada a uma mesa de trabalho. O guia reúne fotos, preços e diferenças entre modelos de 19 categorias. O glossário explica 29 termos. Cada termo tem uma definição curta, com o significado da sigla quando houver. Exemplos e complementos ficam em **Ver mais**, e as explicações também podem aparecer junto das especificações do catálogo. [Glossário](capturas/apresentacao-glossario.jpg)

## Encontrar e comparar modelos

O catálogo tem 62 modelos. As abas deixam os grupos de peças à vista. Ao escolher **Armazenamento**, **Refrigeração** ou **Periféricos**, dá para refinar a lista em **Tipo de peça**. Busca, categoria, preço, marca e compatibilidade ficam no painel à esquerda. No celular, o painel abre pelo botão **Filtros**. O topo dos resultados mostra a quantidade de peças, os filtros ativos e a ação para limpar. Cada cartão traz foto, nome, preço e algumas especificações. **Ver detalhes** abre a ficha e **Usar na montagem** leva o modelo ao simulador. [Catálogo com as abas](capturas/apresentacao-catalogo.jpg)

Dá para comparar até três modelos do mesmo tipo. As escolhas ficam em uma barra enquanto a pessoa pesquisa. O quadro compara preço e características equivalentes na mesma linha. Por exemplo, quem está escolhendo um processador consegue ver quais modelos têm vídeo integrado. O filtro de compatibilidade usa as peças já selecionadas na montagem manual.

## Escolher uma configuração pronta ou montar do zero

- **Setups prontos.** As 16 sugestões estão organizadas por uso, como jogos, estudos, programação, edição de vídeo e produtividade. Cada uma mostra preço de referência e lista de peças. **Personalizar montagem** abre o conjunto no simulador. O carrossel da página inicial mostra ambientes reais e pode ser pausado. Na área de programação, um vídeo reproduz o terminal dentro da tela do notebook. [Setups](capturas/versao-final-setups.jpg) · [Notebook](capturas/versao-final-notebook.jpg)
- **Montagem guiada.** O site pergunta qual será o uso, quanto se pode gastar e se a prioridade é economia, desempenho ou visual com RGB. Ao informar um orçamento insuficiente, a pessoa já vê o menor valor disponível e pode ajustar o limite. O resultado separa as peças do computador e os periféricos, com subtotais e saldo do orçamento. [Etapa inicial](capturas/final-montador-desktop-escuro.png) · [Exemplo de resultado](capturas/final-montador-resultado.png)
- **Montagem manual.** A pessoa escolhe uma categoria por vez. O progresso acompanha as etapas essenciais, e os periféricos ficam em um grupo opcional. O resumo mostra peças, quantidades, total e alertas de encaixe, memória, alimentação e outras regras. A vista ilustrada é atualizada com a seleção. É possível guardar montagens no navegador, comparar configurações salvas, compartilhar por link e preparar o resumo para impressão. [Simulador](capturas/versao-final-simulador.jpg)

## Revisar o carrinho e pedir ajuda

O carrinho mostra as quantidades e o total e aponta diferenças em relação ao orçamento. Antes da confirmação simulada, a revisão apresenta os itens e os avisos de compatibilidade. As páginas de acesso e contato demonstram sessões e formulários fictícios. As perguntas frequentes ficam na página de contato. [Orçamento](capturas/final-carrinho-orcamento.png) · [Compatibilidade](capturas/final-carrinho-compatibilidade.png) · [Contato](capturas/versao-final-contato.jpg)

## Acessibilidade

O link para pular ao conteúdo e os indicadores de foco ajudam quem usa teclado. As gavetas e o painel fecham com Esc e devolvem o foco ao botão que os abriu. No painel de acessibilidade, é possível escolher tema, tamanho da fonte, espaçamento, sublinhado de links e alto contraste. A opção de reduzir movimento pausa o giro automático do gabinete e a troca de fotos. Os ajustes aparecem na prévia e ficam salvos no mesmo navegador. [Painel de acessibilidade](capturas/apresentacao-acessibilidade.jpg) · [Testes do projeto](auditoria.md)

## Capturas da versão publicada

[Início](capturas/apresentacao-inicio.jpg) · [Gabinete](capturas/apresentacao-gabinete.jpg) · [Glossário](capturas/apresentacao-glossario.jpg) · [Catálogo](capturas/apresentacao-catalogo.jpg) · [Montagem guiada](capturas/apresentacao-montador.jpg) · [Simulador](capturas/apresentacao-simulador.jpg) · [Celular](capturas/apresentacao-celular.jpg) · [Painel de acessibilidade](capturas/apresentacao-acessibilidade.jpg)

Essas capturas mostram a entrega com o menu lateral, o fundo novo e a DM Sans. Para testar os controles, abra o site ou rode o projeto no computador. [Site](https://gabrielguimaraes07.github.io/Trabalho_final_di/) · [Como rodar](../README.md#como-rodar-no-seu-computador)

## Capturas da primeira versão final

- **Início** [Computador](capturas/final-inicio-desktop-escuro.png) · [Celular](capturas/final-inicio-celular-claro.png)
- **Catálogo** [Computador](capturas/final-estoque-desktop-escuro.png) · [Celular](capturas/final-estoque-celular-claro.png)
- **Montador** [Computador](capturas/final-montador-desktop-escuro.png) · [Celular](capturas/final-montador-celular-claro.png)
- **Glossário** [Computador](capturas/final-glossario-desktop-escuro.png) · [Celular](capturas/final-glossario-celular-claro.png)
- **Login** [Computador](capturas/final-login-desktop-escuro.png) · [Celular](capturas/final-login-celular-claro.png)
- **Contato** [Computador](capturas/final-contato-desktop-escuro.png) · [Celular](capturas/final-contato-celular-claro.png)

As telas de computador usam o tema escuro. As de celular usam o tema claro. [Perguntas frequentes](capturas/final-perguntas-frequentes.png)
