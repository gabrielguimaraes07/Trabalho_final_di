# C1 — IHC, UX, UI e marca

## Interação Humano-Computador

- **Pistas de interação.** Contorno, cursor e rótulo mostram que a peça do 3D pode ser selecionada. Botões em texto replicam o caminho da categoria.
- **Retorno imediato.** A gaveta mostra a categoria escolhida. O carrinho atualiza a quantidade e o total. O painel aplica as opções na hora.
- **Lei de Fitts.** Os botões principais têm áreas grandes e ficam perto da pergunta ou do conteúdo relacionado.
- **Lei de Hick.** O quiz divide as escolhas em três passos com poucas opções por vez.
- **Carga cognitiva.** A ficha mostra três dados por peça. Termos sublinhados abrem uma definição curta quando necessário.
- **Modelo mental.** Explorar o gabinete reproduz a ideia de olhar as peças que serão montadas. A vista explodida mostra a posição e o papel delas.

## Jornada

| Momento | Suporte oferecido |
|---|---|
| Descobrir | Gabinete girável e legenda dos pontos selecionáveis. |
| Entender | Vista das peças separadas, cartões, glossário e perguntas frequentes. |
| Escolher | Filtros, busca, montador e configurações prontas. |
| Validar | Compatibilidade, preço total e orçamento. |
| Reunir para compra | Carrinho editável, com revisão de quantidade e total antes da confirmação simulada. |

## Estados da interface

| Estado | Como é mostrado |
|---|---|
| Normal | Nome e papel da peça, preço e ação disponível. |
| Ponteiro sobre o controle | Contorno no 3D, sublinhado em links ou ação destacada. |
| Foco por teclado | Anel visível na cor de destaque. |
| Ativo ou selecionado | Categoria selecionada, etapas marcadas no montador e indicação de item escolhido. |
| Desabilitado | Botão de adicionar quando a peça está sem estoque ou a quantidade chegou ao limite. |
| Erro | Texto ligado ao campo e indicação visual ou aviso no carrinho. |
| Vazio | Mensagem no catálogo, no glossário ou no carrinho. |
| Carregando | Retorno de que peças ou termos estão sendo buscados. |

## Marca e acessibilidade

A marca usa grafite, azul e tipografia Inter. O fundo escuro e as áreas espaçosas destacam o produto. A linguagem de loja acadêmica, as analogias e os preços em reais aproximam o site do público brasileiro.

O painel permite trocar o tema, aumentar ou reduzir a fonte, usar uma fonte de leitura facilitada, ajustar o espaçamento, reforçar o contraste, sublinhar links e reduzir animações. As escolhas ficam no navegador e já são aplicadas na próxima abertura. Os detalhes da paleta e o escopo dos testes estão documentados. [Paleta](paleta.md) · [Auditoria](auditoria.md)

## Decisões da revisão de interfaces

- O menu compacto deixa marca e carrinho ao alcance. As outras páginas abrem pelo botão Menu, que informa o estado e recebe o foco ao fechar com Escape.
- A busca e a categoria ficam à vista. Preço, marca e compatibilidade aparecem sob demanda, e a tabela compara valores e características na mesma linha. Isso aplica reconhecimento e reduz o esforço de lembrar dados de cartões diferentes.
- A montagem manual mostra o total durante a escolha e explica siglas no mesmo lugar. As confirmações antes de apagar ou substituir peças ajudam a recuperar o controle em caso de engano.
- A montagem guiada mostra os limites reais do orçamento, explica os critérios da sugestão e leva de volta ao valor se o orçamento ficar curto.
