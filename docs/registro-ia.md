# Registro de uso de IA — GGTECH

## Etapa 1 — Estrutura inicial

- **IA usada:** OpenAI Codex.
- **Como foi usada:** ajudou a organizar as pastas e a criar a página inicial com navegação, título, link para pular ao conteúdo e rodapé. Também reuniu as cores, os tamanhos de fonte e os espaçamentos da especificação em um arquivo CSS.
- **Autorização:** o trabalho começou após a aprovação do plano da etapa pelo estudante.

## Etapa 2 — Contraste e esboços

- **IA usada** — OpenAI Codex.
- **Como foi usada** — implementou o cálculo de contraste a partir das cores do CSS, gerou a tabela dos temas claro e escuro e ajudou a descrever as personas, os mapas de empatia e os esboços da interface.
- **Autorização** — o trabalho começou após a aprovação do plano da etapa pelo estudante.

## Etapa 3 — PC 3D e gaveta de estoque

- **IA usada** — OpenAI Codex.
- **Como foi usada** — montou o gabinete e as peças com formas básicas em Three.js, ligou os botões do modelo ao estoque e ajudou a preparar 20 produtos fictícios. A imagem estática do gabinete e as quatro ilustrações de categoria foram renderizadas a partir do modelo criado no projeto.
- **Revisão** — verificou o giro, a abertura e o fechamento da gaveta e o acesso às categorias com mouse, toque e teclado. Também verificou a imagem com os mesmos botões quando o navegador está sem WebGL.
- **Autorização** — o trabalho começou após a aprovação do plano da etapa pelo estudante.

## Etapa 4 — Tema, cartões e carrossel

- **IA usada** — OpenAI Codex e OpenAI ImageGen.
- **Como foi usada** — Codex implementou a troca de tema, escreveu os cartões com analogias e criou os controles do carrossel. ImageGen gerou três imagens ilustrativas de setups para jogar, estudar e criar conteúdo. As imagens foram convertidas em WebP para reduzir o tamanho dos arquivos.
- **Revisão** — verificou a preferência de tema após recarregar, a navegação pelo teclado, a pausa e a redução de movimento. A verificação automática com axe no Chromium apontou zero violações nos dois temas com o seletor aberto.
- **Autorização** — o trabalho começou após a aprovação do plano da etapa pelo estudante.

## Etapa 5 — Revisão da entrega parcial

- **IA usada** — OpenAI Codex.
- **Como foi usada** — montou o README, registrou seis capturas em computador e celular e corrigiu um atributo ARIA que o Lighthouse encontrou no carrossel.
- **Revisão** — a página atingiu 100/100 em acessibilidade nos dois perfis do Lighthouse. O axe apontou zero violações automáticas no início e na gaveta, em ambos os temas. O contraste do vidro da gaveta foi conferido por cálculo separado.
- **Autorização** — o trabalho começou após a aprovação do plano da etapa pelo estudante.

## Etapa 6 — Aba de acessibilidade

- **IA usada** — OpenAI Codex.
- **Como foi usada** — desenvolveu o painel com prévia dos ajustes e integrou as preferências ao tema, à tipografia, ao PC 3D e ao carrossel. As preferências são lidas no início da página para evitar troca visual depois do carregamento.
- **Revisão** — testou a navegação por teclado, o toque em tela de 360 px, o texto a 200%, a restauração das opções e a redução de movimento. O axe apontou zero violações no painel escuro e no painel claro com alto contraste.
- **Autorização** — o trabalho começou após a aprovação do plano da etapa pelo estudante.

## Etapa 7 — PC 3D completo

- **IA usada** — OpenAI Codex.
- **Como foi usada** — modelou as cinco categorias restantes, ampliou o catálogo para 45 produtos fictícios e integrou a aproximação da câmera e a vista explodida. Atualizou as ilustrações a partir do próprio modelo.
- **Revisão** — verificou os nove pontos por teclado, a seleção por clique e toque, o retorno do foco e da câmera e a alternativa sem WebGL. Também testou a troca para a ilustração quando a preferência por movimento reduzido é ativada.
- **Autorização** — o trabalho começou após a aprovação do plano da etapa pelo estudante.

## Etapa 8 — Estoque e carrinho

- **IA usada** — OpenAI Codex.
- **Como foi usada** — criou o estoque com abas, sugestões de busca e filtros. Ligou as gavetas do PC 3D às categorias e implementou o carrinho com quantidades, orçamento salvo e avisos de encaixe, memória, formato e potência.
- **Revisão** — verificou o fluxo por teclado e toque, os estados de estoque e orçamento e exemplos com peças compatíveis, incompatíveis e incompletas. O axe apontou zero violações automáticas nos estados de estoque e carrinho auditados.
- **Autorização** — o trabalho começou após a aprovação do plano da etapa pelo estudante.

## Etapa 9 — Montador guiado

- **IA usada** — OpenAI Codex.
- **Como foi usada** — criou o quiz em três etapas, a sugestão baseada em uso, orçamento e prioridade e as três configurações prontas. O montador guarda a última escolha e confere o estoque antes de adicionar o conjunto ao carrinho. O kit fictício Aura Trio está disponível no catálogo para a opção de visual com RGB.
- **Revisão** — verificou os preços e a compatibilidade em 72 cenários, além da navegação por teclado e toque. Testou a revisão do orçamento, a retomada após recarregar e o caso em que falta estoque para uma peça do conjunto. O axe apontou zero violações automáticas nos estados auditados do quiz e do resultado.
- **Autorização** — o trabalho começou após a aprovação do plano da etapa pelo estudante.

## Etapa 10 — Glossário, login e contato

- **IA usada** — OpenAI Codex.
- **Como foi usada** — criou 29 definições pesquisáveis e ligou os termos do estoque às dicas por mouse e teclado. Implementou as abas de login fictício, o armazenamento de nome e e-mail e o formulário de contato simulado com validação acessível.
- **Revisão** — verificou foco, Escape e navegação direta para as definições, a alternância de senha e que a simulação de contato confirma o formulário sem transmitir os dados. O axe apontou zero violações automáticas nos estados auditados das três páginas.
- **Autorização** — o trabalho começou após a aprovação do plano da etapa pelo estudante.
