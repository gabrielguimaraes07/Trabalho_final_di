import { avisoDeVideo, carregarEstoque, categorias, mostrarPreco, mostrarSubtotal, resumoEspecificacoes, rotuloCotacao, somarItens } from './estoque.js?v=interfaces-4';
import { carregarGlossario } from './glossario.js?v=1.0-final';
import { categoriasMultiplas, estimarConsumo, perifericos, rotulosCompatibilidade, verificarCompatibilidade } from './compatibilidade.js?v=interfaces-4';
import { levarMontagemAoCarrinho } from './carrinho.js?v=interfaces-4';
import { conflitosDaPeca, excluirSalva, gravarMontagem, incluirPeca, itensDaMontagem, lerMontagem, lerSalvas,
  limiteMontagensSalvas, mesmaMontagem, normalizarMontagem, salvarComNome, separarItens } from './montagem.js?v=interfaces-4';

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
  const ajustar = elemento('details', undefined, { class: 'sim-cotacao' });
  ajustar.append(elemento('summary', 'Editar cotação'));
  if (categoriasMultiplas.has(produto.categoria)) {
    const qtd = elemento('label', 'Unidades');
    qtd.append(elemento('input', undefined, { 'data-alterar': 'quantidade', 'data-id': produto.id,
      'aria-label': 'Quantidade de ' + produto.nome, type: 'number', value: quantidade, min: 1, max: 20, step: 1 }));
    campos.append(qtd);
  }
  const cotacao = elemento('label', 'Sua cotação em R$');
  cotacao.append(elemento('input', undefined, { 'data-alterar': 'preco', 'data-id': produto.id,
    'aria-label': 'Cotação unitária de ' + produto.nome, type: 'number', value: preco ?? '', min: 0, max: 1000000, step: '.01', inputmode: 'decimal' }));
  ajustar.append(cotacao);
  campos.append(ajustar, elemento('button', 'Remover', { type: 'button', class: 'botao-texto',
    'data-remover': produto.id, 'aria-label': 'Remover ' + produto.nome }));
  dados.append(campos);
  linha.append(dados);
  return linha;
}

const etapas = [
  ['Processador', 'cpu'], ['Placa-mãe', 'placa-mae'], ['Memória RAM', 'ram'],
  ['Armazenamento', 'ssd-nvme', 'ssd-sata', 'hd'], ['Saída de vídeo', 'gpu'],
  ['Fonte', 'fonte'], ['Gabinete', 'gabinete'], ['Refrigeração', 'air-cooler', 'water-cooler'],
];

const termosPorCategoria = {
  cpu: ['socket', 'nucleos', 'tdp'], 'placa-mae': ['socket', 'microatx'], ram: ['ddr4', 'ddr5', 'mt-s'],
  gpu: ['gpu', 'vram'], 'ssd-sata': ['ssd'], 'ssd-nvme': ['m2-nvme'], fonte: ['potencia', 'cabos-modulares'],
  gabinete: ['atx', 'microatx', 'mini-itx'], 'air-cooler': ['cooler', 'dissipacao'],
  'water-cooler': ['cooler'], ventoinhas: ['ventoinha'], monitor: ['resolucao', 'full-hd'],
};

function estadoDasEtapas(itens) {
  const escolhidas = new Set(itens.map(({ produto }) => produto.categoria));
  const videoIntegrado = itens.some(({ produto }) => produto.categoria === 'cpu' && produto.compat.video);
  return etapas.map(([nome, categoria, ...alternativas]) => ({
    nome, categoria,
    pronta: escolhidas.has(categoria) || alternativas.some(id => escolhidas.has(id)) || (categoria === 'gpu' && videoIntegrado),
  }));
}

export async function iniciarSimulador(raiz) {
  const localizar = seletor => raiz.querySelector(seletor);
  const status = localizar('#sim-status');
  let catalogo;
  let glossario;
  try {
    [catalogo, glossario] = await Promise.all([carregarEstoque(), carregarGlossario().catch(() => [])]);
  } catch {
    status.textContent = 'O catálogo não carregou. Recarregue a página para tentar novamente.';
    return;
  }
  const url = new URL(location.href);
  let linhas = lerMontagem(catalogo);
  let avisoInicial;
  if (url.searchParams.has('pecas')) {
    const registros = (url.searchParams.get('pecas') ?? '').slice(0, 3000).split(',').map(trecho => {
      const [id, quantidade, preco] = trecho.split(':');
      return { id, quantidade, preco: preco === undefined || preco === '' ? undefined : Number(preco) };
    });
    const importadas = normalizarMontagem(registros, catalogo);
    if (importadas.length) {
      if (!linhas.length || mesmaMontagem(linhas, importadas) || confirm('Abrir as peças deste link no lugar da montagem atual?')) {
        linhas = importadas;
        avisoInicial = gravarMontagem(linhas) ? 'Montagem do link aberta.' : 'Montagem aberta. O navegador bloqueou o salvamento.';
      } else {
        avisoInicial = 'A montagem atual foi mantida.';
      }
    } else avisoInicial = 'O link não trouxe peças conhecidas do catálogo.';
    url.searchParams.delete('pecas');
    history.replaceState(null, '', url);
  }
  const adicionar = url.searchParams.get('adicionar');
  const sugestao = catalogo.find(produto => produto.id === adicionar);
  if (sugestao) {
    const novas = incluirPeca(linhas, sugestao, catalogo);
    const anterior = linhas.find(linha => !novas.some(peca => peca.id === linha.id));
    const nomeAnterior = catalogo.find(produto => produto.id === anterior?.id)?.nome;
    if (!nomeAnterior || confirm('Trocar ' + nomeAnterior + ' por ' + sugestao.nome + ' na montagem?')) {
      linhas = novas;
      avisoInicial = gravarMontagem(linhas) ? sugestao.nome + ' na montagem.' : 'Peça escolhida. O navegador bloqueou o salvamento.';
    } else {
      avisoInicial = 'A peça anterior foi mantida.';
    }
    url.searchParams.delete('adicionar');
    history.replaceState(null, '', url);
  }

  const grupos = localizar('#sim-categorias');
  const cartoes = localizar('#sim-cartoes');
  const compativeis = localizar('#sim-compativeis');
  const proxima = localizar('#sim-proxima');
  const lista = localizar('#sim-lista');
  const essenciais = localizar('#sim-essenciais');
  const levar = localizar('#sim-levar-carrinho');
  const tituloCategoria = localizar('#sim-categoria-titulo');
  const salvas = localizar('#sim-salvas');
  const comparar = localizar('#sim-comparar');
  const saidaComparacao = localizar('#sim-comparacao');
  const nome = localizar('#sim-nome');
  const link = localizar('#sim-link');
  let categoria = sugestao?.categoria ?? 'cpu';
  let proximaEtapa;

  const ordemMontagem = [...etapas.flatMap(([, ...ids]) => ids), 'ventoinhas', ...perifericos];
  for (const id of ordemMontagem) {
    const grupo = localizar(perifericos.has(id) ? '#sim-externas' : '#sim-internas');
    grupo.append(elemento('button', categorias[id].nome, { type: 'button', 'data-categoria': id, 'aria-pressed': 'false' }));
  }
  if (perifericos.has(categoria)) localizar('#sim-opcionais').open = true;

  function cartao(produto, jaNaMontagem, conflitos, categoriaOcupada) {
    const bloco = elemento('article', undefined, { class: 'sim-card', 'data-selecionada': String(!!jaNaMontagem) });
    const imagem = foto(produto);
    if (imagem) {
      imagem.height = 210;
      imagem.width = 280;
      bloco.append(imagem);
    }
    const dados = elemento('div', undefined, { class: 'sim-card-dados' });
    const rotuloPreco = rotuloCotacao(produto);
    dados.append(elemento('h4', produto.nome),
      elemento('p', resumoEspecificacoes(produto, 3)),
      elemento('strong', mostrarPreco(produto.preco)),
      elemento('a', rotuloPreco, { href: produto.fontePreco, class: 'sim-card-fonte',
        'aria-label': rotuloPreco + ' de ' + produto.nome }));
    const video = avisoDeVideo(produto);
    if (video) dados.append(elemento('p', video));
    if (conflitos.length) dados.append(elemento('p', conflitos[0].mensagem, { class: 'sim-conflito' }));
    if (jaNaMontagem) dados.append(elemento('p', jaNaMontagem.quantidade + ' na montagem', { class: 'sim-selecionada' }));
    const multipla = categoriasMultiplas.has(produto.categoria);
    const rotulo = jaNaMontagem ? (multipla ? 'Adicionar unidade' : 'Selecionada')
      : !multipla && categoriaOcupada ? 'Trocar por esta' : 'Escolher peça';
    const botao = elemento('button', rotulo, {
      type: 'button', class: 'botao-contorno', 'data-escolher': produto.id, 'aria-label': rotulo + ' — ' + produto.nome,
    });
    botao.setAttribute('aria-disabled', String(!!jaNaMontagem && (!multipla || jaNaMontagem.quantidade >= 20)));
    dados.append(botao);
    if (jaNaMontagem) dados.append(elemento('button', proximaEtapa ? 'Continuar montagem' : 'Revisar montagem', {
      type: 'button', class: 'botao-texto', 'data-continuar': '',
    }));
    bloco.append(dados);
    return bloco;
  }

  function atualizarOpcoes() {
    const preenchidas = new Set(itensDaMontagem(linhas, catalogo).map(({ produto }) => produto.categoria));
    for (const botao of grupos.querySelectorAll('[data-categoria]')) {
      botao.setAttribute('aria-pressed', String(botao.dataset.categoria === categoria));
      botao.toggleAttribute('data-preenchida', preenchidas.has(botao.dataset.categoria));
    }
    const escolhas = catalogo.filter(produto => produto.categoria === categoria)
      .map(produto => ({ produto, conflitos: conflitosDaPeca(linhas, produto, catalogo),
        item: linhas.find(linha => linha.id === produto.id) }))
      .filter(({ conflitos, item }) => !compativeis.checked || !conflitos.length || item)
      .sort((a, b) => Number(!!a.conflitos.length) - Number(!!b.conflitos.length) || a.produto.preco - b.produto.preco);
    tituloCategoria.textContent = categorias[categoria].nome;
    localizar('#sim-categoria-dica').textContent = categorias[categoria].descricao;
    localizar('#sim-contagem').textContent = escolhas.length + (escolhas.length === 1 ? ' opção' : ' opções');
    const outroTipoDeCooler = { 'air-cooler': 'water-cooler', 'water-cooler': 'air-cooler' }[categoria];
    const categoriaOcupada = preenchidas.has(categoria) || preenchidas.has(outroTipoDeCooler);
    cartoes.replaceChildren(...escolhas.map(({ produto, conflitos, item }) => cartao(produto, item, conflitos, categoriaOcupada)));
    if (!escolhas.length) cartoes.append(elemento('p', 'Nenhuma peça compatível nesta categoria. Desmarque o filtro para ver as demais.'));
  }

  function atualizarGlossario() {
    const bloco = localizar('#sim-glossario');
    const termos = glossario.filter(({ id }) => termosPorCategoria[categoria]?.includes(id));
    bloco.hidden = !termos.length;
    bloco.open = false;
    bloco.querySelector('dl').replaceChildren(...termos.flatMap(({ termo, descricao }) =>
      [elemento('dt', termo), elemento('dd', descricao)]));
  }

  function mudarCategoria(nova) {
    categoria = nova;
    atualizarOpcoes();
    atualizarGlossario();
    tituloCategoria.focus();
  }

  function atualizarCombinacoes() {
    const registros = lerSalvas(catalogo);
    for (const select of [salvas, comparar]) {
      const anterior = select.value;
      select.replaceChildren(elemento('option', 'Escolha uma montagem', { value: '' }),
        ...registros.map(item => elemento('option', item.nome, { value: item.nome })));
      if ([...select.options].some(opcao => opcao.value === anterior)) select.value = anterior;
    }
  }

  function atualizar() {
    const itens = itensDaMontagem(linhas, catalogo);
    const { internos, acessorios } = separarItens(itens);
    const regras = verificarCompatibilidade(itens);
    const incompatibilidades = regras.filter(regra => regra.estado === 'erro');
    const erros = incompatibilidades.length;
    const etapasAtuais = estadoDasEtapas(itens);
    const completas = etapasAtuais.filter(etapa => etapa.pronta).length;
    proximaEtapa = etapasAtuais.find(etapa => !etapa.pronta);
    const conflito = localizar('#sim-conflito-atual');
    conflito.hidden = !erros;
    conflito.textContent = incompatibilidades[0]?.mensagem ?? '';
    essenciais.replaceChildren(...etapasAtuais.map(etapa => {
      const linha = elemento('li', undefined);
      const botao = elemento('button', (etapa.pronta ? '✓ ' : 'Escolher ') + etapa.nome,
        { type: 'button', class: 'botao-texto', 'data-etapa-categoria': etapa.categoria });
      linha.append(botao);
      return linha;
    }));
    localizar('#sim-etapas').value = completas;
    localizar('#sim-progresso').textContent = completas + ' de ' + etapasAtuais.length + ' etapas essenciais preenchidas';
    levar.disabled = !!proximaEtapa || !!erros;
    localizar('#sim-envio-dica').textContent = erros ? 'Corrija as incompatibilidades para continuar.'
      : proximaEtapa ? 'Complete as etapas essenciais para enviar ao carrinho.' : 'Confira as peças e simule a compra no carrinho.';
    proxima.textContent = proximaEtapa ? 'Próxima pendência · ' + proximaEtapa.nome : 'Revisar montagem';
    localizar('#sim-internos').textContent = mostrarSubtotal(somarItens(internos));
    localizar('#sim-perifericos').textContent = mostrarSubtotal(somarItens(acessorios));
    const total = mostrarSubtotal(somarItens(itens));
    localizar('#sim-total').textContent = total;
    localizar('#sim-total-movel').textContent = total;
    const watts = estimarConsumo(itens);
    localizar('#sim-watts').textContent = watts === null ? 'Selecione CPU ou GPU' : watts + ' W estimados';
    localizar('#sim-estado').textContent = erros ? erros + (erros === 1 ? ' incompatibilidade' : ' incompatibilidades')
      : !proximaEtapa ? 'Montagem completa nas regras verificadas' : 'Montagem em andamento';
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

  grupos.addEventListener('click', evento => {
    const botao = evento.target.closest('[data-categoria]');
    if (botao) mudarCategoria(botao.dataset.categoria);
  });
  compativeis.addEventListener('change', atualizarOpcoes);
  function continuar() {
    if (proximaEtapa) mudarCategoria(proximaEtapa.categoria);
    else localizar('#sim-resumo-titulo').focus();
  }
  proxima.addEventListener('click', continuar);
  essenciais.addEventListener('click', evento => {
    const botao = evento.target.closest('[data-etapa-categoria]');
    if (botao) mudarCategoria(botao.dataset.etapaCategoria);
  });
  levar.addEventListener('click', () => {
    if (levarMontagemAoCarrinho(itensDaMontagem(linhas, catalogo))) {
      window.dispatchEvent(new CustomEvent('ggtech:abrir-carrinho', { detail: levar }));
    }
  });
  cartoes.addEventListener('click', evento => {
    if (evento.target.closest('[data-continuar]')) {
      continuar();
      return;
    }
    const botao = evento.target.closest('[data-escolher]');
    if (!botao || botao.getAttribute('aria-disabled') === 'true') return;
    const escolhida = catalogo.find(produto => produto.id === botao.dataset.escolher);
    aplicar(incluirPeca(linhas, escolhida, catalogo), escolhida.nome + ' na montagem.');
    const equivalente = [...cartoes.querySelectorAll('[data-escolher]')].find(item => item.dataset.escolher === escolhida.id);
    (equivalente?.closest('article').querySelector('[data-continuar]') ?? equivalente ?? tituloCategoria)
      .focus({ preventScroll: true });
  });
  lista.addEventListener('click', evento => {
    const botao = evento.target.closest('[data-remover]');
    if (!botao) return;
    const produto = catalogo.find(item => item.id === botao.dataset.remover);
    if (!confirm('Remover ' + produto.nome + ' da montagem?')) return;
    aplicar(linhas.filter(item => item.id !== botao.dataset.remover), 'Peça removida.');
    (lista.querySelector('button') ?? grupos.querySelector('[aria-pressed="true"]')).focus();
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
    const entrada = [...lista.querySelectorAll('input')].find(input => input.dataset.id === id && input.dataset.alterar === campo);
    if (campo === 'preco' && entrada) entrada.closest('details').open = true;
    entrada?.focus({ preventScroll: true });
  });

  const retorno = localizar('#sim-gestao-status');
  localizar('#sim-salvar').addEventListener('click', () => {
    const valor = nome.value.trim();
    if (!valor || !linhas.length) {
      retorno.textContent = 'Escolha pelo menos uma peça e dê um nome à montagem.';
      nome.focus();
      return;
    }
    const registros = lerSalvas(catalogo);
    const existente = registros.find(item => item.nome === valor);
    if (existente && !mesmaMontagem(linhas, existente.linhas) && !confirm('Sobrescrever a montagem “' + valor + '”?')) return;
    if (!existente && registros.length >= limiteMontagensSalvas) {
      retorno.textContent = 'Limite de ' + limiteMontagensSalvas + ' montagens. Exclua uma salva para guardar outra.';
      return;
    }
    retorno.textContent = salvarComNome(valor, linhas, catalogo) ? 'Montagem guardada no navegador.' : 'O navegador bloqueou o salvamento.';
    atualizarCombinacoes();
    salvas.value = valor;
  });
  localizar('#sim-carregar').addEventListener('click', () => {
    const registro = lerSalvas(catalogo).find(item => item.nome === salvas.value);
    if (!registro) { retorno.textContent = 'Escolha uma montagem salva.'; return; }
    if (linhas.length && !mesmaMontagem(linhas, registro.linhas) && !confirm('Abrir esta montagem salva no lugar da montagem atual?')) return;
    nome.value = registro.nome;
    aplicar(registro.linhas, 'Montagem aberta para edição.');
    retorno.textContent = 'Montagem aberta para edição.';
  });
  localizar('#sim-excluir-salva').addEventListener('click', () => {
    const valor = salvas.value;
    if (!valor) { retorno.textContent = 'Escolha uma montagem salva para excluir.'; return; }
    if (!confirm('Excluir a montagem salva “' + valor + '”?')) return;
    retorno.textContent = excluirSalva(valor, catalogo) ? 'Montagem salva excluída.' : 'O navegador bloqueou a alteração.';
    atualizarCombinacoes();
  });
  localizar('#sim-limpar').addEventListener('click', () => {
    if (linhas.length && confirm('Limpar a montagem em edição?')) aplicar([], 'Montagem limpa.');
  });
  localizar('#sim-imprimir').addEventListener('click', () => window.print());
  localizar('#sim-compartilhar').addEventListener('click', async () => {
    if (!linhas.length) { retorno.textContent = 'Adicione uma peça para compartilhar.'; return; }
    const endereco = new URL(location.pathname, location.href);
    endereco.searchParams.set('pecas', linhas.map(({ id, quantidade, preco }) =>
      [id, quantidade, preco].filter(valor => valor !== undefined).join(':')).join(','));
    link.hidden = false;
    link.value = endereco.href;
    link.select();
    try {
      await navigator.clipboard.writeText(endereco.href);
      retorno.textContent = 'Link de montagem copiado.';
    } catch {
      retorno.textContent = 'Copie o link no campo de compartilhamento.';
      link.focus();
    }
  });
  localizar('#sim-acao-comparar').addEventListener('click', () => {
    const registro = lerSalvas(catalogo).find(item => item.nome === comparar.value);
    if (!registro) { retorno.textContent = 'Escolha uma montagem salva para comparar.'; return; }
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
  atualizarGlossario();
  localizar('#sim-conteudo').hidden = false;
  localizar('#sim-barra').hidden = false;
  status.textContent = avisoInicial ?? (linhas.length ? 'Sua montagem está carregada.' : 'Selecione o processador para começar.');
}
