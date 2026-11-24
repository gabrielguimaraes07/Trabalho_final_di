# Como a IA ajudou no GGTECH

O GGTECH é meu projeto de Desenvolvimento de Interfaces. Nas revisões, priorizei manter o gabinete 3D, facilitar a escolha de peças e ter foto e preço sem precisar sair da tela. Também pedi um painel de acessibilidade, fotos diferentes para cada nível de setup e uma etapa de compra simulada.

Usei o **OpenAI Codex** como apoio em várias partes, desde a estrutura inicial até ajustes maiores no código, pesquisa de preços, testes e documentação. O **OpenAI ImageGen** entrou na entrega parcial para criar três imagens de ambientes. Na edição para apresentação, as imagens ilustrativas do carrossel deram lugar a fotografias de setups reais. [Créditos e referências](referencias.md)

## Ajuda em cada etapa

- **Primeira página.** O Codex ajudou a organizar as pastas, a navegação e o CSS. Também preparou o cálculo de contraste.
- **Gabinete e carrossel.** Ajudou a desenvolver o modelo em Three.js, ligar as peças às categorias da gaveta e preparar a vista estática para navegadores sem WebGL. Também apoiou os cartões explicativos, a troca de tema e os controles do carrossel.
- **Acessibilidade.** Ajudou a implementar o painel, salvar as preferências e ajustar o foco, o contraste do menu fixo e a redução de movimento. As verificações incluíram teclado, zoom, Lighthouse e axe. [Auditoria](auditoria.md)
- **Catálogo e carrinho.** Apoiou a busca, os filtros, a comparação, a consulta de fichas e cotações, e a organização das fotos. Também ajudou com as regras de compatibilidade, os cálculos e a revisão da compra simulada. [Cotações](fontes-apresentacao.md)
- **Montagem e setups.** Ajudou na implementação das perguntas do montador guiado, das regras de sugestão e da montagem manual, incluindo o salvamento e a importação dos setups prontos. Quando a seleção de peças ficou difícil de usar, pedi uma revisão desse fluxo e dos avisos de orçamento.
- **Glossário, acesso e contato.** Ajudou a escrever as definições, ligar as dicas aos termos do estoque e testar os formulários simulados.
- **Publicação e documentação.** Apoiou a organização das evidências de teste, a troca da primeira foto do carrossel, a retirada das referências visíveis do site e a revisão do README e da pasta `docs/`.

Os resultados verificados estão no registro dos testes do projeto. [Auditoria](auditoria.md)
