# GGTECH

**Português** · [English](README.en.md)

**Gabriel Guimarães · Desenvolvimento de Interfaces · UniCEUB, 2026**

Fiz o GGTECH para ajudar quem quer montar o primeiro PC. No site, dá para explorar um gabinete em 3D, entender para que serve cada peça, comparar preços e ver se as peças funcionam juntas.

## Abra as duas entregas

- **Parcial.** Tem o gabinete 3D com quatro grupos de peças, 20 produtos de exemplo, troca de tema e carrossel. Esta cópia vem do commit `5615947`, que inclui ajustes no contraste, no foco do teclado e no ícone da aba. [Abrir a parcial](https://gabrielguimaraes07.github.io/Trabalho_final_di/entrega-parcial/) · [Arquivos da parcial](entrega-parcial/)
- **Final.** Tem 62 produtos reais em 19 categorias, 16 setups prontos, montagem guiada e manual, comparação de peças, guia, glossário, carrinho e painel de acessibilidade. [Abrir a final](https://gabrielguimaraes07.github.io/Trabalho_final_di/entrega-final/) · [Arquivos da final](entrega-final/)

![Página inicial do GGTECH com as opções de montagem e o gabinete interativo](entrega-final/docs/capturas/apresentacao-inicio.jpg)

[Catálogo](entrega-final/docs/capturas/apresentacao-catalogo.jpg) · [Montagem guiada](entrega-final/docs/capturas/apresentacao-montador.jpg) · [Montagem manual](entrega-final/docs/capturas/apresentacao-simulador.jpg) · [Início no celular](entrega-final/docs/capturas/apresentacao-celular.jpg) · [Painel de acessibilidade](entrega-final/docs/capturas/apresentacao-acessibilidade.jpg)

## Como o site foi construído

### 1. A primeira página

Comecei com cabeçalho, menu, conteúdo e rodapé em HTML. O link **Pular para o conteúdo** leva quem usa o teclado direto à parte principal. No CSS, as cores, os tamanhos de texto e os espaços ficaram no mesmo arquivo para que as outras telas pudessem usar o mesmo visual. [Paleta](entrega-final/docs/paleta.md) · [Psicologia das cores](entrega-final/docs/psicologia-cores.md)

### 2. O gabinete em 3D

O gabinete foi feito no Three.js. Dá para girá-lo e clicar nas peças para abrir uma lista daquela categoria. Os botões abaixo do modelo dão o mesmo acesso pelo teclado. Quando o 3D fica indisponível, aparece uma imagem no lugar. Na final, a vista explodida separa as peças para mostrar onde cada uma fica.

### 3. Os primeiros exemplos

Adicionei explicações simples sobre as peças. A RAM, por exemplo, funciona como uma mesa de trabalho onde ficam as coisas em uso. O carrossel ganhou setas e um botão de pausa, e a escolha do tema passou a ficar salva no navegador. Na revisão da parcial, alguns controles que ficavam atrás do menu ao usar Tab foram ajustados. [Revisão da parcial](entrega-final/docs/revisao-parcial.md)

### 4. O menu e a leitura

Na final, o menu passou a levar ao catálogo, às montagens, aos setups, ao glossário e ao contato. No celular, dá para abrir e fechar o menu com um botão. No painel de acessibilidade, dá para mudar o tema, o tamanho e o espaçamento do texto, aumentar o contraste e sublinhar os links. A prévia mostra as mudanças na hora. Também dá para reduzir o movimento do gabinete e do carrossel. [Escolhas de interface](entrega-final/docs/ihc-ux-ui.md)

### 5. Os produtos reais

Troquei os produtos de exemplo por modelos reais. Cada peça tem foto, marca, modelo, preço de referência e especificações. O mesmo código de identificação liga a peça ao catálogo, ao guia, ao carrinho e à montagem salva. As fotos ficam nos arquivos do projeto. [Dados dos produtos](entrega-final/dados/produtos.json)

### 6. A busca e a comparação

No catálogo, dá para buscar pelo nome e filtrar por categoria, marca, preço ou compatibilidade. **Detalhes da peça** abre a ficha completa. Dá para comparar até três modelos do mesmo tipo lado a lado. Por exemplo, ao comparar processadores, dá para ver quais têm vídeo integrado. [Heurísticas de Nielsen no GGTECH](entrega-final/docs/heuristicas-nielsen.md)

### 7. Dois jeitos de montar o PC

Na **montagem guiada**, a pessoa escolhe o uso do PC, o orçamento e o que importa mais entre economia, desempenho e iluminação RGB. Se o valor for baixo demais, o site mostra o mínimo para aquele uso. O resultado separa as peças do PC e os periféricos.

Na **montagem manual**, dá para começar do zero ou mudar um setup pronto. A lista, o total e os avisos mudam conforme as peças escolhidas. Dá para salvar a montagem, compartilhar por link ou imprimir.

### 8. A checagem das peças e o carrinho

O site confere se as peças encaixam e se têm espaço, energia e conexões suficientes. No gabinete MSI MAG PANO M100R PZ, por exemplo, SSDs SATA e HDs dividem um suporte. O simulador avisa quando a quantidade escolhida passa do limite.

No carrinho, dá para conferir os itens, as quantidades e o total antes de confirmar a compra simulada. No celular, a barra com o total leva direto ao resumo da montagem.

### 9. Os testes

Os testes passaram pelo teclado, por telas grandes e pequenas, pelo texto ampliado a 200% e pelo contraste. Também foram conferidos a comparação, o carrinho e a opção de abrir e salvar montagens. [Testes do projeto](entrega-final/docs/auditoria.md) · [Contraste no Adobe Color](entrega-final/docs/contraste-adobe.md) · [Como usei IA](entrega-final/docs/registro-ia.md)

## Um exemplo para mostrar na apresentação

1. Abra **Montagem guiada** e escolha **Estudar**.
2. Digite R$ 4.000 para ver o aviso de orçamento. Depois, ajuste para R$ 8.500.
3. Confira os subtotais e clique em **Personalizar na montagem manual** para trocar um gabinete ou headset.
4. Veja o novo total e os avisos. Leve as peças ao carrinho e confira os itens antes de confirmar a simulação.

## Como rodar no seu computador

No VS Code, abra o `index.html` da versão que quiser e escolha **Open with Live Server**. Se preferir usar Python, abra o terminal na pasta principal do projeto e rode este comando.

```sh
python -m http.server 8765
```

Depois, abra [a parcial](http://localhost:8765/entrega-parcial/) ou [a final](http://localhost:8765/entrega-final/). O servidor ajuda o navegador a carregar os dados e os arquivos JavaScript. A parcial carrega o Three.js pela internet. Na final, a biblioteca vem junto com o projeto.

## Onde mexer no código

- **HTML.** `index.html` é a página inicial, `estoque.html` é o catálogo e `simulador.html` é a montagem manual.
- **CSS.** A pasta `css/` guarda os estilos. `tokens.css` tem a paleta e `layout.css` define o menu e o rodapé.
- **JavaScript.** Em `js/`, `principal.js` liga as funções de cada página e `compatibilidade.js` confere as combinações de peças.
- **Dados.** A pasta `dados/` guarda os produtos, os setups prontos e o glossário.
- **Imagens e bibliotecas.** Tudo fica em `recursos/`. O Three.js desenha o gabinete, e o GSAP cuida de animações como a separação das peças. [Mapa do código](entrega-final/docs/codigo.md)

## Limites da demonstração

Os preços servem de referência, em reais e sem frete. Alguns vieram de ofertas que já acabaram. O simulador usa as medidas e conexões cadastradas. Na montagem física, ainda é preciso conferir coisas como a versão da BIOS, a folga para os cabos e a posição do radiador. O login, o contato e a compra são simulados. O carrinho, as preferências e as montagens salvas ficam no navegador. [Créditos das fotos e referências](entrega-final/docs/referencias.md)
