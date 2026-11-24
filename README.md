# GGTECH

**Gabriel Guimarães · Desenvolvimento de Interfaces · UniCEUB, 2026**

O GGTECH surgiu de uma dúvida comum na hora de montar o primeiro PC. Mesmo quando a pessoa tem um orçamento, ainda precisa entender o que cada peça faz, comparar opções parecidas e descobrir se elas funcionam juntas. O site junta essas decisões em um simulador para que seja possível experimentar antes de comprar.

## Onde estão as entregas

- [Entrega parcial](entrega-parcial/) — a primeira versão, com o gabinete interativo, quatro categorias de peças, 20 itens demonstrativos, os temas e o carrossel.
- [Entrega final](entrega-final/) — o projeto completo, com catálogo real, montagem guiada e manual, comparação, carrinho, guia, glossário e opções de acessibilidade.

Cada pasta tem seu próprio `index.html` e os arquivos necessários para abrir a versão. A final tem **62 produtos em 19 categorias** e **16 setups**. As duas entregas mostram como o projeto cresceu desde a primeira página.

![Página inicial do GGTECH com as opções de montagem e o gabinete interativo](entrega-final/docs/prints/apresentacao-inicio.jpg)

[Catálogo](entrega-final/docs/prints/apresentacao-catalogo.jpg) · [Montagem guiada](entrega-final/docs/prints/apresentacao-montador.jpg) · [Montagem manual](entrega-final/docs/prints/apresentacao-simulador.jpg) · [Início no celular](entrega-final/docs/prints/apresentacao-celular.jpg) · [Painel de acessibilidade](entrega-final/docs/prints/apresentacao-acessibilidade.jpg)

## Como o site foi construído

### 1. Comecei pela estrutura da página

A primeira página foi montada em HTML com cabeçalho, menu, conteúdo principal e rodapé. A ideia era que uma pessoa que nunca viu uma montagem pudesse começar pelo gabinete e só depois entrar nos detalhes. Também entrou um link para pular o menu e ir direto ao conteúdo, útil quando se navega por Tab.

No CSS, concentrei cores, espaçamentos, tamanhos de fonte e cantos dos cartões em um único arquivo. Isso facilitou aplicar a mesma linguagem visual em outras telas. A paleta usa preto e grafite no escuro, superfícies claras no outro tema e azul para ações, links e foco. A tipografia Inter é a padrão, e a fonte Atkinson Hyperlegible fica disponível como opção de leitura. [Paleta](entrega-final/docs/paleta.md)

### 2. Criei o gabinete como ponto de entrada

O gabinete foi construído em Three.js com formas, materiais e luzes. O modelo permite girar a cena e reconhecer a posição do processador, da memória, da placa de vídeo e da fonte. Selecionar uma peça abre a gaveta da categoria. A gaveta busca os dados no JSON e mostra os modelos com foto, preço e uma explicação curta.

Os pontos clicáveis são acompanhados de botões em texto. Com isso, dá para abrir as categorias pelo teclado ou usar a imagem de reserva quando o WebGL estiver indisponível. Na entrega final também entrou a vista explodida. Ela separa as peças na tela para indicar onde cada uma fica no gabinete.

### 3. Fechei a primeira entrega com temas e explicações

A parcial ficou com quatro grupos de produtos demonstrativos. Foram adicionados cartões com analogias simples, como a RAM comparada à mesa de trabalho, e um carrossel para mostrar exemplos de ambientes. O carrossel ganhou setas, indicadores e pausa, e a preferência de tema passou a ser lembrada pelo navegador.

A revisão da parcial corrigiu o nome do autor, o contraste na navegação fixa e o foco de controles encobertos pelo cabeçalho. Também colocou o ícone da aba em um arquivo local. É essa edição revisada que está na pasta da parcial. [Revisão da parcial](entrega-final/docs/revisao-parcial.md)

### 4. Ampliei a navegação e a acessibilidade

Na final, separei catálogo, montagem guiada, montagem manual, setups, guia, glossário e contato. O menu mantém os mesmos nomes em todas as páginas. No celular, ele vira um botão expansível. O item da página atual é indicado por texto azul e fundo discreto, e o foco do teclado continua visível.

O painel de acessibilidade reúne tema, tamanho e espaçamento do texto, alto contraste, fonte de leitura, sublinhado de links e redução de movimento. Os ajustes aparecem na prévia e ficam guardados no navegador. Ao reduzir movimento, a interface evita a rotação automática e as animações de entrada. Os botões de navegação e as alternativas estáticas continuam disponíveis. [Interface e acessibilidade](entrega-final/docs/ihc-ux-ui.md)

### 5. Troquei os dados de exemplo por produtos reais

Na parcial, os modelos serviam para demonstrar a interface. Na final, o catálogo passou a usar peças identificadas por marca e modelo, com fotografias e dados técnicos. O campo `id` liga a peça ao catálogo, ao guia, ao carrinho e às montagens salvas. Cada item traz preço, tipo e data da cotação, a origem da foto e a ficha de referência. Os arquivos de imagem ficam locais para a página funcionar durante a apresentação.

A última ampliação acrescentou os gabinetes aquário MSI MAG PANO M100R PZ White, NZXT H6 Flow Black e Corsair 3500X ARGB White. Também entraram os headsets Razer BlackShark V2 X, Logitech G432 e HyperX Cloud III Wireless. O guia mostra o que vem na caixa, as conexões e os limites de montagem conforme cada modelo. [Fotos, fichas e cotações](entrega-final/docs/fontes-apresentacao.md#gabinetes-aquário-e-headsets)

### 6. Separei a busca, a comparação e a escolha de peças

No catálogo, a busca e a categoria ficam à vista. Marca, faixa de preço e compatibilidade ficam juntas nos filtros adicionais. O cartão destaca nome, preço e a ação de levar a peça à montagem manual. As especificações resumidas ficam abaixo, com os outros dados disponíveis em **Detalhes da peça**.

A comparação reúne até três modelos do mesmo tipo. Uma barra mostra quantos estão escolhidos mesmo depois de rolar a página. No quadro, as informações equivalentes aparecem na mesma linha. Em processadores, por exemplo, dá para ver de uma vez quais têm vídeo integrado. O ganho aqui é poder comparar sem decorar o que estava em cada cartão. [Heurísticas de Nielsen no projeto](entrega-final/docs/heuristicas-nielsen.md)

### 7. Montei dois caminhos para chegar a um setup

A **montagem guiada** tem três perguntas. A pessoa escolhe o uso do PC, informa o orçamento e decide entre economia, desempenho e visual com RGB. Se o limite ficar abaixo dos setups do catálogo para aquele uso, o aviso aparece nessa etapa. O valor só muda quando a pessoa escolhe outro. A sugestão mostra as peças com fotos e separa os subtotais do computador e dos periféricos.

A **montagem manual** permite escolher categoria por categoria e acompanhar as etapas essenciais. A lista de peças, o total e os alertas mudam conforme a seleção. Se o processador tem vídeo integrado, a etapa de saída de vídeo pode aparecer como atendida automaticamente. Também é possível partir de um dos setups prontos, trocar peças, salvar, compartilhar a configuração por link ou imprimir o resumo.

### 8. Liguei a montagem às regras e ao carrinho

As regras cruzam socket, geração de memória e ocupação de slots, formato da placa-mãe, folga de GPU e cooler, radiadores, baias, alimentação e conexão de vídeo. Por exemplo, o MSI MAG PANO M100R PZ tem uma baia compartilhada. O simulador avisa quando a combinação de SSDs SATA e HDs passaria do número de suportes desse gabinete.

As verificações usam os dados cadastrados e consideram medidas nominais. Folga de cabos, versão de BIOS, posição de ventoinhas, espaço ocupado por radiadores e portas de áudio do computador ainda precisam ser conferidos conforme a montagem. O consumo é estimado. O preço é uma referência em reais, sem frete. Uma oferta que estava indisponível fica indicada como histórica.

O carrinho permite rever quantidades, total e orçamento antes da confirmação simulada. Ele compartilha as regras de compatibilidade com o simulador. Os produtos disponíveis para experimentar na montagem fazem parte do catálogo demonstrativo. Montagens, preferências e carrinho ficam no armazenamento do navegador. O login e o contato são demonstrações de formulário.

### 9. Ajustei os detalhes pensando na apresentação

Ao longo das revisões, os ajustes mais práticos foram mostrar o orçamento cedo, deixar o total acessível no celular e pedir confirmação antes de substituir uma montagem. O menu e o rodapé passaram a agrupar os caminhos de entrada. O início ficou com fotos reais dos componentes e links que abrem a categoria correspondente no guia.

As verificações do projeto incluem teclado, contraste, navegação em telas largas e estreitas, montagem, carrinho e salvamento. A auditoria identifica a versão de cada medição e registra o que ainda está pendente. [Testes do projeto](entrega-final/docs/auditoria.md) · [Como a IA ajudou](entrega-final/docs/registro-ia.md)

## Um exemplo para a apresentação

1. Abra **Montagem guiada** e escolha **Estudar**.
2. Informe R$ 4.000 para ver o aviso de orçamento e depois teste com R$ 8.500.
3. Confira o que entrou no computador, quais itens são periféricos e quanto sobrou do orçamento.
4. Use **Personalizar na montagem manual**. Troque o gabinete ou adicione um headset e observe o total e os alertas.
5. Leve a configuração ao carrinho e revise as quantidades antes de confirmar a simulação.

## Como rodar no seu computador

No VS Code, abra o `index.html` da entrega que quiser e use **Open with Live Server**. Outra opção é rodar este comando na raiz do repositório.

```sh
python -m http.server 8765
```

Depois, abra `http://localhost:8765/entrega-parcial/` ou `http://localhost:8765/entrega-final/`. O endereço base do servidor leva à final. Usar um servidor local permite que o JavaScript leia o catálogo e os módulos com as permissões esperadas pelo navegador.

## Onde mexer no código

- **HTML** organiza as páginas e seus controles. Dentro da final, `index.html` é o início, `estoque.html` é o catálogo e `simulador.html` é a montagem manual.
- **CSS** fica em `css/`. `tokens.css` guarda a paleta, `layout.css` cuida do menu e do rodapé, e os estilos específicos ficam separados por tela ou recurso.
- **JavaScript** fica em `js/`. `main.js` inicializa a página, `compatibilidade.js` reúne as regras e `simulador.js` liga as escolhas ao resumo.
- **JSON** fica em `data/`. `produtos.json` guarda o catálogo, `builds.json` guarda as configurações prontas e `glossario.json` guarda o texto das definições.
- **Three.js e GSAP** ficam em `assets/vendor/` na final. Three.js desenha o gabinete e GSAP ajuda a controlar as animações. `assets/` também guarda fotos, vídeo, ícones e fontes. [Mapa do código](entrega-final/docs/codigo.md)

Os créditos das fotos, fontes e bibliotecas estão na documentação da final. [Referências e licenças](entrega-final/docs/referencias.md)
