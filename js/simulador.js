import { carregarEstoque, categorias, mostrarPreco, mostrarSubtotal, ordemCatalogo, somarItens } from './estoque.js';
import { categoriasMultiplas, estimarConsumo, perifericos, rotulosCompatibilidade, verificarCompatibilidade } from './compatibilidade.js';
import { gravarMontagem, incluirPeca, itensDaMontagem, lerMontagem, lerSalvas,
  normalizarMontagem, pecaCompativel, salvarComNome, separarItens } from './montagem.js';

function elemento(tag, texto, atributos = {}) {
  const no = document.createElement(tag);
  if (texto !== undefined) no.textContent = texto;
  for (const [nome, valor] of Object.entries(atributos)) no.setAttribute(nome, valor);
  return no;
}

function foto(produto) {
  if (!produto.imagem) return null;
  return elemento('img', undefined, { src: produto.imagem, alt: produto.alt, width: 76, height: 64, loading: 'lazy' });
}

function pecaVisual({ produto, quantidade }) {
  const bloco = elemento('div', undefined, { class: 'sim-peca', 'data-categoria': produto.categoria });
  const imagem = foto(produto);
  if (imagem) bloco.append(imagem);
  bloco.append(elemento('strong', categorias[produto.categoria].nome),
    elemento('span', produto.nome + (quantidade > 1 ? ' × ' + quantidade : '')));
  return bloco;
}

function regraVisual(regra) {
  const li = elemento('li', undefined, { 'data-estado': regra.estado });
  li.append(elemento('strong', regra.titulo + ' · ' + rotulosCompatibilidade[regra.estado]),
    elemento('p', regra.mensagem));
  return li;
}

function desempenho(itens) {
  const cpu = itens.find(item => item.produto.categoria === 'cpu')?.produto.compat;
  const gpu = itens.find(item => item.produto.categoria === 'gpu')?.produto.compat;
  const ram = itens.reduce((soma, { produto, quantidade }) =>
    soma + (produto.categoria === 'ram' ? produto.compat.gb * quantidade : 0), 0);
  const video = cpu?.video || gpu;
  return [
    ['Estudos e navegação', 4, 8, 0], ['Programação', 6, 16, 0], ['Multitarefas', 6, 16, 0],
    ['Edição de imagens', 6, 16, 0], ['Edição de vídeos', 8, 32, 2],
    ['Jogos leves', 4, 8, 0], ['Jogos competitivos', 6, 16, 1], ['Jogos exigentes', 6, 32, 3],
  ].map(([nome, nucleos, gb, classe]) => {
    const precisa = !cpu || !ram || !video ? 'Selecione CPU, RAM e uma saída de vídeo'
      : cpu.nucleos >= nucleos && ram >= gb && (gpu?.classe ?? 0) >= classe ? 'Indicado pelos critérios' : 'Com limitações';
    return elemento('li', nome + ' · ' + precisa);
  });
}

function montarLinha(item) {
  const { produto, quantidade, preco } = item;
  const linha = elemento('li', undefined, { class: 'sim-linha' });
  const imagem = foto(produto);
  if (imagem) linha.append(imagem);
  const dados = elemento('div', undefined);
  dados.append(elemento('strong', produto.nome), elemento('p', mostrarPreco(preco ?? produto.preco) + ' por unidade'));
  const campos = elemento('div', undefined, { class: 'sim-campos-linha' });
  if (categoriasMultiplas.has(produto.categoria)) {
    const qtd = elemento('label', 'Unidades');
    qtd.append(elemento('input', undefined, { 'data-alterar': 'quantidade', 'data-id': produto.id,
      'aria-label': 'Quantidade de ' + produto.nome, type: 'number', value: quantidade, min: 1, max: 20, step: 1 }));
    campos.append(qtd);
  }
  const cotacao = elemento('label', 'Sua cotação em R$');
  cotacao.append(elemento('input', undefined, { 'data-alterar': 'preco', 'data-id': produto.id,
    'aria-label': 'Cotação unitária de ' + produto.nome, type: 'number', value: preco ?? '', min: 0, max: 1000000, step: '.01', inputmode: 'decimal' }));
  campos.append(cotacao, elemento('button', 'Remover', { type: 'button', class: 'botao-texto',
    'data-remover': produto.id, 'aria-label': 'Remover ' + produto.nome }));
  dados.append(campos);
  linha.append(dados);
  return linha;
}

function testarCompletude(itens) {
  const categorias = new Set(itens.map(({ produto }) => produto.categoria));
  return ['cpu', 'placa-mae', 'ram', 'fonte', 'gabinete'].every(categoria => categorias.has(categoria))
    && ['ssd-nvme', 'ssd-sata', 'hd'].some(categoria => categorias.has(categoria))
    && ['air-cooler', 'water-cooler'].some(categoria => categorias.has(categoria))
    && (categorias.has('gpu') || itens.some(({ produto }) => produto.categoria === 'cpu' && produto.compat.video));
}

export async function iniciarSimulador(raiz) {
  const localizar = seletor => raiz.querySelector(seletor);
  const status = localizar('#sim-status');
  let catalogo;
  try {
    catalogo = await carregarEstoque();
  } catch {
    status.textContent = 'O catálogo não carregou. Recarregue a página para tentar novamente.';
    return;
  }
  const url = new URL(location.href);
  let linhas = lerMontagem(catalogo);
  if (url.searchParams.has('pecas')) {
    const registros = (url.searchParams.get('pecas') ?? '').slice(0, 3000).split(',').map(trecho => {
      const [id, quantidade, preco] = trecho.split(':');
      return { id, quantidade, preco: preco === undefined || preco === '' ? undefined : Number(preco) };
    });
    const importadas = normalizarMontagem(registros, catalogo);
    if (importadas.length) {
      linhas = importadas;
      if (gravarMontagem(linhas)) {
        url.searchParams.delete('pecas');
        history.replaceState(null, '', url);
      }
    }
  }
  const adicionar = url.searchParams.get('adicionar');
  const sugestao = catalogo.find(produto => produto.id === adicionar);
  if (sugestao) {
    linhas = incluirPeca(linhas, sugestao, catalogo);
    gravarMontagem(linhas);
    url.searchParams.delete('adicionar');
    history.replaceState(null, '', url);
  }

  const categoria = localizar('#sim-categoria');
  const produto = localizar('#sim-produto');
  const compativeis = localizar('#sim-compativeis');
  const lista = localizar('#sim-lista');
  const salvas = localizar('#sim-salvas');
  const comparar = localizar('#sim-comparar');
  const saidaComparacao = localizar('#sim-comparacao');
  const nome = localizar('#sim-nome');
  const link = localizar('#sim-link');

  for (const externo of [false, true]) {
    const grupo = elemento('optgroup', undefined, { label: externo ? 'Periféricos opcionais' : 'Componentes internos' });
    grupo.append(...ordemCatalogo.filter(id => perifericos.has(id) === externo)
      .map(id => elemento('option', categorias[id].nome, { value: id })));
    categoria.append(grupo);
  }

  function atualizarOpcoes() {
    const anterior = produto.value;
    const opcoes = catalogo.filter(item => item.categoria === categoria.value
      && (!compativeis.checked || pecaCompativel(linhas, item, catalogo)));
    produto.replaceChildren(elemento('option', opcoes.length ? 'Escolha um modelo' : 'Nenhuma opção com este filtro', { value: '' }),
      ...opcoes.map(item => elemento('option', item.nome + ' · ' + mostrarPreco(item.preco), { value: item.id })));
    if (opcoes.some(opcao => opcao.id === anterior)) produto.value = anterior;
    atualizarDetalhe();
  }

  function atualizarDetalhe() {
    const peca = catalogo.find(item => item.id === produto.value);
    const detalhe = localizar('#sim-detalhe');
    detalhe.replaceChildren();
    localizar('#sim-adicionar').disabled = !peca;
    if (peca) {
      const imagem = foto(peca);
      if (imagem) detalhe.append(imagem);
      detalhe.append(elemento('p', peca.descricao), elemento('a', 'Ficha e foto no fabricante', { href: peca.fonte }));
    }
  }

  function atualizarCombinacoes() {
    for (const select of [salvas, comparar]) {
      const anterior = select.value;
      select.replaceChildren(elemento('option', 'Escolha uma montagem', { value: '' }),
        ...lerSalvas(catalogo).map(item => elemento('option', item.nome, { value: item.nome })));
      if ([...select.options].some(opcao => opcao.value === anterior)) select.value = anterior;
    }
  }

  function atualizar() {
    const itens = itensDaMontagem(linhas, catalogo);
    const { internos, acessorios } = separarItens(itens);
    const regras = verificarCompatibilidade(itens);
    const erros = regras.filter(regra => regra.estado === 'erro').length;
    localizar('#sim-internos').textContent = mostrarSubtotal(somarItens(internos));
    localizar('#sim-perifericos').textContent = mostrarSubtotal(somarItens(acessorios));
    localizar('#sim-total').textContent = mostrarSubtotal(somarItens(itens));
    const watts = estimarConsumo(itens);
    localizar('#sim-watts').textContent = watts === null ? 'Selecione CPU ou GPU' : watts + ' W estimados';
    localizar('#sim-estado').textContent = erros ? erros + (erros === 1 ? ' incompatibilidade' : ' incompatibilidades')
      : testarCompletude(itens) ? 'Montagem completa nas regras verificadas' : 'Montagem em andamento';
    localizar('#sim-alertas').replaceChildren(...regras.filter(regra => regra.estado !== 'pendente').map(regraVisual));
    localizar('#sim-visual').replaceChildren(...(internos.length ? internos.map(pecaVisual)
      : [elemento('p', 'As peças internas aparecem aqui conforme você escolhe.')]));
    lista.replaceChildren(...(itens.length ? itens.map(montarLinha) : [elemento('li', 'Sua montagem está vazia.')]));
    localizar('#sim-desempenho').replaceChildren(...(erros ? [elemento('li', 'Resolva as incompatibilidades antes de avaliar o uso.')] : desempenho(itens)));
    link.hidden = true;
    saidaComparacao.replaceChildren();
    atualizarOpcoes();
  }

  function aplicar(proximas, mensagem) {
    linhas = normalizarMontagem(proximas, catalogo);
    const guardou = gravarMontagem(linhas);
    atualizar();
    status.textContent = guardou ? mensagem : mensagem + ' O navegador bloqueou o salvamento local.';
  }

  categoria.addEventListener('change', atualizarOpcoes);
  compativeis.addEventListener('change', atualizarOpcoes);
  produto.addEventListener('change', atualizarDetalhe);
  localizar('#sim-escolha').addEventListener('submit', evento => {
    evento.preventDefault();
    const escolhida = catalogo.find(item => item.id === produto.value);
    if (!escolhida) return;
    aplicar(incluirPeca(linhas, escolhida, catalogo), escolhida.nome + ' na montagem.');
  });
  lista.addEventListener('click', evento => {
    const botao = evento.target.closest('[data-remover]');
    if (!botao) return;
    aplicar(linhas.filter(item => item.id !== botao.dataset.remover), 'Peça removida.');
    (lista.querySelector('button') ?? categoria).focus();
  });
  lista.addEventListener('change', ({ target }) => {
    const campo = target.dataset.alterar;
    if (!campo) return;
    if (!target.checkValidity()) {
      target.reportValidity();
      return;
    }
    const id = target.dataset.id;
    aplicar(linhas.map(item => item.id === id ? { ...item, [campo]: target.value === '' ? undefined : target.valueAsNumber } : item),
      'Montagem atualizada.');
    [...lista.querySelectorAll('input')].find(input => input.dataset.id === id && input.dataset.alterar === campo)?.focus({ preventScroll: true });
  });

  localizar('#sim-salvar').addEventListener('click', () => {
    const valor = nome.value.trim();
    if (!valor || !linhas.length) {
      status.textContent = 'Escolha pelo menos uma peça e dê um nome à montagem.';
      nome.focus();
      return;
    }
    status.textContent = salvarComNome(valor, linhas, catalogo) ? 'Montagem guardada no navegador.' : 'O navegador bloqueou o salvamento.';
    atualizarCombinacoes();
    salvas.value = valor;
  });
  localizar('#sim-carregar').addEventListener('click', () => {
    const registro = lerSalvas(catalogo).find(item => item.nome === salvas.value);
    if (!registro) { status.textContent = 'Escolha uma montagem salva.'; return; }
    nome.value = registro.nome;
    aplicar(registro.linhas, 'Montagem aberta para edição.');
  });
  localizar('#sim-limpar').addEventListener('click', () => {
    if (linhas.length && confirm('Limpar a montagem em edição?')) aplicar([], 'Montagem limpa.');
  });
  localizar('#sim-imprimir').addEventListener('click', () => window.print());
  localizar('#sim-compartilhar').addEventListener('click', async () => {
    if (!linhas.length) { status.textContent = 'Adicione uma peça para compartilhar.'; return; }
    const endereco = new URL(location.pathname, location.href);
    endereco.searchParams.set('pecas', linhas.map(({ id, quantidade, preco }) =>
      [id, quantidade, preco].filter(valor => valor !== undefined).join(':')).join(','));
    link.hidden = false;
    link.value = endereco.href;
    link.select();
    try {
      await navigator.clipboard.writeText(endereco.href);
      status.textContent = 'Link de montagem copiado.';
    } catch {
      status.textContent = 'Copie o link no campo de compartilhamento.';
      link.focus();
    }
  });
  localizar('#sim-acao-comparar').addEventListener('click', () => {
    const registro = lerSalvas(catalogo).find(item => item.nome === comparar.value);
    if (!registro) { status.textContent = 'Escolha uma montagem salva para comparar.'; return; }
    const colunas = [['Montagem atual', linhas], [registro.nome, registro.linhas]].map(([titulo, registros]) => {
      const itens = itensDaMontagem(registros, catalogo);
      const secao = elemento('section', undefined);
      const relacao = elemento('ul', undefined);
      relacao.append(...itens.map(({ produto, quantidade }) => elemento('li', quantidade + ' × ' + produto.nome)));
      secao.append(elemento('h3', titulo), elemento('p', mostrarSubtotal(somarItens(itens))),
        elemento('p', (estimarConsumo(itens) ?? '—') + ' W estimados'), relacao);
      return secao;
    });
    saidaComparacao.replaceChildren(...colunas);
  });

  atualizarCombinacoes();
  atualizar();
  localizar('#sim-conteudo').hidden = false;
  status.textContent = sugestao ? sugestao.nome + ' na montagem.' : 'Catálogo de montagem carregado.';
}
