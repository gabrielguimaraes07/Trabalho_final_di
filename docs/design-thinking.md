# Design Thinking — GGTECH

## Empatizar

As personas são perfis fictícios usados para orientar o projeto. Os mapas de empatia registram hipóteses a conferir com pessoas durante os testes de usabilidade.

### Lucas, 16 anos

Quer montar o primeiro PC para jogar com os amigos. Tem orçamento curto e receio de comprar uma peça que não encaixe.

- **Pensa e sente.** Tem medo de economizar na peça errada e o PC não funcionar.
- **Vê e ouve.** Acompanha vídeos de montagem e catálogos cheios de siglas. Os amigos falam de memória e placa de vídeo, mas ele ainda tem dúvidas sobre como elas trabalham juntas.
- **Diz e faz.** Pergunta quanto custa um PC para jogar e guarda links para comparar.
- **Onde trava.** Tem pouca margem para errar e fica na dúvida sobre qual peça escolher primeiro.
- **O que ajudaria.** Ver um conjunto no orçamento e entender o papel de cada peça.

### Carla, 34 anos

Quer um PC para editar vídeos do trabalho. Tem pouco tempo para pesquisar e encontra especificações que ainda não sabe interpretar.

- **Pensa e sente.** Quer editar e exportar com fluidez e tem receio de gastar além do que precisa.
- **Vê e ouve.** Encontra modelos muito parecidos e ouve recomendações diferentes sobre memória e armazenamento.
- **Diz e faz.** Procura uma configuração pronta e anota termos que ainda precisa pesquisar.
- **Onde trava.** Tem pouco tempo para comparar preços e confirmar se as peças funcionam juntas.
- **O que ajudaria.** Ver o preço total e uma explicação do que aquela combinação oferece para edição de vídeo.

## Definir

> Como podemos ajudar iniciantes a montar o primeiro PC com segurança, sem precisar entender tudo de hardware?

O site deve ajudar a pessoa a reconhecer as peças, entender a função de cada uma e escolher uma configuração adequada ao uso e ao orçamento.

## Idear

- **PC 3D clicável.** A pessoa vê onde uma peça fica dentro do gabinete e abre o estoque daquela categoria a partir dela. Os botões sobre o modelo e a lista de categorias também permitem encontrar as peças pelo teclado.
- **Montador guiado.** A pessoa informa para que vai usar o PC, quanto pode gastar e o que mais valoriza. O site mostra uma configuração compatível com preço total.
- **Glossário e cartões.** Explicações curtas com exemplos cotidianos ajudam quando aparecem termos como memória RAM e SSD.
- **Configurações prontas.** Exemplos de PCs para jogo, estudo e criação de conteúdo ajudam quem já sabe o uso principal e quer consultar as peças diretamente.

O PC 3D e o montador orientaram os esboços iniciais. O primeiro ajuda a descobrir a função e a localização das peças. O segundo ajuda a escolher uma configuração inteira.

## Prototipar

Os wireframes são esboços da posição do conteúdo e dos controles. Os desenhos abaixo mostram a estrutura planejada para o início, o estoque e o montador.

### Início no computador

```text
┌──────────────────────────────────────────────────────────────────┐
│ GGTECH   Início  Estoque  Monte seu PC  Glossário  Contato       │
│                                         Carrinho  Entrar  Acess. │
├──────────────────────────────────────────────────────────────────┤
│                Monte seu primeiro PC sem medo.                   │
│                     [Começar a montar]                           │
│                                                                  │
│       ┌──────────────────┐        ┌─────────────────────────┐    │
│       │ PC girável       │        │ Gaveta ao escolher  [X] │    │
│       │ [CPU]     [RAM]  │ ─────► │ Nome e função da peça   │    │
│       │ [GPU]   [Fonte]  │        │ Filtro e produtos       │    │
│       └──────────────────┘        │ [Ver todas no estoque]  │    │
│       Categorias em texto         └─────────────────────────┘    │
├──────────────────────────────────────────────────────────────────┤
│ Por dentro do seu PC                                             │
│ O que cada peça faz?        Cartões explicativos                 │
│ Setups da comunidade        [Anterior] [Pausa] [Próximo]         │
│ Configurações prontas       Gamer  Estudo  Criação               │
│ [Abrir o montador guiado]                                        │
├──────────────────────────────────────────────────────────────────┤
│ Contato · links · créditos acadêmicos                            │
└──────────────────────────────────────────────────────────────────┘
```

### Início no celular

```text
┌─────────────────────────────┐
│ GGTECH  Carrinho  Acess.    │
│ Menu e botão Entrar         │
├─────────────────────────────┤
│ Monte seu primeiro PC       │
│ sem medo.                   │
│ [Começar a montar]          │
│                             │
│         PC girável          │
│  [CPU] [RAM] [GPU] [Fonte]  │
│ Categorias em texto         │
├─────────────────────────────┤
│ Explicações das peças       │
│ Setups da comunidade        │
│ Configurações prontas       │
│ [Abrir montador guiado]     │
│ Rodapé                      │
└─────────────────────────────┘
```

Ao escolher uma peça, a gaveta ocupa a largura disponível com o botão de fechar no topo. A lista de categorias em texto fica logo abaixo do PC.

### Estoque e montador guiado

```text
┌──────────────────────────────┐     ┌──────────────────────────────┐
│ Estoque                      │     │ Monte seu PC                 │
│ [Buscar peças              ] │     │ Uma pergunta por vez         │
│ [Todas] [CPU] [GPU] [RAM] …  │     │ Uso, orçamento e prioridade  │
│ Preço · Nível · Em estoque   │     │ [Voltar] [Continuar]         │
│ ┌───────────┐ ┌───────────┐  │     ├──────────────────────────────┤
│ │ Foto      │ │ Foto      │  │     │ Configuração sugerida        │
│ │ Nome      │ │ Nome      │  │     │ Peças, preço e motivo        │
│ │ Preço     │ │ Preço     │  │     │ [Adicionar tudo ao carrinho] │
│ │ Adicionar │ │ Adicionar │  │     └──────────────────────────────┘
│ └───────────┘ └───────────┘  │
└──────────────────────────────┘
```

Os protótipos de alta fidelidade estão nas capturas do projeto. [Telas e recursos](design-site.md)

## Testar

A revisão técnica conferiu os fluxos no navegador. O roteiro com participantes parte das dúvidas de Lucas e Carla. Uma tarefa mede se a pessoa encontra uma peça dentro de um valor. Outra observa se ela consegue escolher e revisar um PC inteiro. Também há tarefas de comparação e acessibilidade. As sessões e os resultados do SUS ainda estão pendentes. [Roteiro](usabilidade.md) · [Testes técnicos](auditoria.md)

Alguns ajustes surgiram antes das sessões. O orçamento passou a aceitar digitação direta. A comparação ganhou uma linha de preços. A montagem passou a pedir confirmação antes de substituir uma configuração salva.
