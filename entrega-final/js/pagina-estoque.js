import { abaPorTecla } from './abas.js?v=1.0-final';
import { adicionarAoCarrinho } from './carrinho.js?v=interfaces-11';
import { perifericos } from './compatibilidade.js?v=interfaces-4';
import { carregarGlossario, escreverTermo, prepararDicas } from './glossario.js?v=1.0-final';
import { carregarEstoque, categorias, grupos3d, mesmoGrupo, mostrarPreco, normalizarBusca, ordemCatalogo, rotuloCotacao, avisoDeVideo } from './estoque.js?v=interfaces-4';

import { conflitosDaPeca, lerMontagem } from './montagem.js?v=interfaces-4';

const todas = 'todas';
const gruposCatalogo = {
  armazenamento: grupos3d.armazenamento,
  refrigeracao: ['cooler', ...grupos3d.cooler, 'ventoinhas'],
  perifericos: ordemCatalogo.filter(id => perifericos.has(id)),
};
const abasCatalogo = [todas, 'cpu', 'gpu', 'ram', 'armazenamento', 'placa-mae', 'fonte', 'gabinete',
  'refrigeracao', 'perifericos'];
const nomesDasAbas = { [todas]: 'Todas', refrigeracao: 'Refrigeração', perifericos: 'Periféricos' };
const categoriasValidas = new Set([...ordemCatalogo, ...Object.keys(grupos3d), ...abasCatalogo]);

function paiDaCategoria(id) {
  return Object.keys(gruposCatalogo).find(pai => gruposCatalogo[pai].includes(id)) ?? id;
}

function dadosDaComparacao({ categoria, specs, compat }) {
  if (categoria === 'cpu') {
    const video = typeof compat.video === 'boolean'
      ? (compat.video ? 'Sim · placa dedicada opcional' : 'Não · requer placa dedicada') : 'Não informado';
    return { 'Vídeo integrado': video, ...specs };
  }
  if (categoria === 'ram') {
    return { 'Capacidade total': Number.isFinite(compat.gb) ? compat.gb + ' GB' : specs.Capacidade,
      'Módulos': compat.slots, 'Geração': compat.ddr ?? specs.Tipo, 'Taxa': specs.Taxa };
  }
  if (categoria === 'placa-mae') {
    return { ...specs, 'Saídas de vídeo': compat.video?.join(', '),
      'Limite de memória': Number.isFinite(compat.limiteRam) ? compat.limiteRam + ' GB' : undefined };
  }
  if (categoria === 'fonte') {
    return { ...specs, 'EPS (CPU)': compat.eps, 'PCIe de 8 pinos': compat.pcie8,
      'PCIe de 16 pinos': compat.pcie16 ? 'Sim' : undefined, 'Alimentação SATA': compat.sata };
  }
  return specs;
}

function criarCartao(produto, termos, selecionado, conflitos) {
  const item = document.createElement('li');
  item.className = 'estoque-produto';

  const foto = document.createElement('div');
  foto.className = 'estoque-produto-foto';
  const imagem = document.createElement('img');
  if (produto.imagem) imagem.src = produto.imagem;
  imagem.alt = produto.alt ?? '';
  imagem.width = 720;
  imagem.height = 540;
  imagem.loading = 'lazy';
  imagem.decoding = 'async';
  if (produto.imagem) foto.append(imagem);
  else foto.textContent = 'Foto indisponível';

  const descricao = document.createElement('div');
  descricao.className = 'estoque-produto-descricao';
  const marca = document.createElement('p');
  marca.className = 'estoque-produto-marca';
  marca.textContent = produto.marca;
  const titulo = document.createElement('h2');
  titulo.textContent = produto.nome;
  const preco = document.createElement('strong');
  preco.className = 'estoque-produto-preco';
  preco.textContent = mostrarPreco(produto.preco);
  const disponivel = document.createElement('p');
  disponivel.className = 'estoque-situacao';
  disponivel.textContent = rotuloCotacao(produto);
  descricao.append(titulo, preco, disponivel, marca);

  const especificacoes = document.createElement('dl');
  especificacoes.className = 'estoque-produto-specs';
  const maisEspecificacoes = document.createElement('dl');
  maisEspecificacoes.className = 'estoque-produto-specs';
  for (const [i, [rotulo, valor]] of Object.entries(produto.specs).entries()) {
    const linha = document.createElement('div');
    const termo = document.createElement('dt');
    const descricao = document.createElement('dd');
    escreverTermo(termo, rotulo, termos);
    escreverTermo(descricao, valor, termos);
    linha.append(termo, descricao);
    (i < 3 ? especificacoes : maisEspecificacoes).append(linha);
  }

  const rodape = document.createElement('div');
  rodape.className = 'estoque-produto-rodape';
  const adicionar = document.createElement('button');
  adicionar.type = 'button';
  adicionar.className = 'botao-contorno';
  adicionar.dataset.adicionar = produto.id;
  adicionar.textContent = 'Adicionar ao carrinho';
  adicionar.setAttribute('aria-label', 'Adicionar ' + produto.nome + ' ao carrinho');
  adicionar.disabled = produto.estoque === 0;
  const detalhes = document.createElement('details');
  detalhes.className = 'estoque-detalhe';
  const resumo = document.createElement('summary');
  resumo.textContent = 'Detalhes da peça';
  const explicacao = document.createElement('p');
  explicacao.textContent = produto.descricao;
  detalhes.append(resumo, explicacao);
  if (maisEspecificacoes.childElementCount) detalhes.append(maisEspecificacoes);
  const simular = document.createElement('a');
  simular.href = './simulador.html?adicionar=' + encodeURIComponent(produto.id);
  simular.textContent = 'Usar na montagem manual';
  simular.className = 'botao-primario';
  simular.setAttribute('aria-label', 'Usar ' + produto.nome + ' na montagem manual');
  const rotuloComparar = document.createElement('label');
  const comparar = document.createElement('input');
  comparar.type = 'checkbox';
  comparar.dataset.comparar = produto.id;
  comparar.checked = selecionado;
  comparar.setAttribute('aria-label', 'Comparar ' + produto.nome);
  rotuloComparar.append(comparar, ' Comparar');
  const aviso = avisoDeVideo(produto);
  if (aviso || conflitos.length) {
    const alerta = document.createElement('p');
    alerta.className = 'estoque-produto-aviso';
    alerta.textContent = [aviso, conflitos[0]?.mensagem].filter(Boolean).join(' ');
    item.append(foto, descricao, especificacoes, alerta);
  } else {
    item.append(foto, descricao, especificacoes);
  }
  rodape.append(simular, adicionar, rotuloComparar);
  item.append(detalhes, rodape);
  return item;
}

export async function iniciarPaginaEstoque(raiz) {
  const listaAbas = raiz.querySelector('#estoque-abas');
  const painelAbas = raiz.querySelector('#estoque-painel');
  const formulario = raiz.querySelector('form');
  const busca = raiz.querySelector('#busca-produtos');
  const preco = raiz.querySelector('#preco-maximo');
  const minimo = raiz.querySelector('#preco-minimo');
  const marca = raiz.querySelector('#marca-produto');
  const ordenacao = raiz.querySelector('#ordem-produtos');
  const compativeis = raiz.querySelector('#somente-compativeis');
  const quadro = raiz.querySelector('.estoque-comparacao');
  const tituloComparacao = quadro.querySelector('h2');
  const barra = raiz.querySelector('.estoque-barra-comparacao');
  const removerModelos = barra.querySelector('details');
  const listaComparacao = barra.querySelector('ul');
  const contagemComparacao = barra.querySelector('.estoque-comparacao-contagem');
  const selecionados = new Set();
  const sugestoes = raiz.querySelector('#sugestoes-produtos');
  const grupoTipo = raiz.querySelector('#estoque-tipo');
  const tipoCampo = raiz.querySelector('#tipo-produto');
  const faixaErro = raiz.querySelector('#preco-aviso');
  const painel = raiz.querySelector('#estoque-resultados');
  const status = painel.querySelector('[role="status"]');
  const grade = painel.querySelector('.estoque-grade');
  let listaSugestoes = [];
  let sugestaoAtiva = -1;
  let produtos;
  let porId;
  let termos;

  function categoriaDaURL() {
    const cat = new URL(location.href).searchParams.get('cat');
    return categoriasValidas.has(cat) ? cat : todas;
  }

  let categoria = categoriaDaURL();
  const abas = abasCatalogo.map(id => {
    const aba = document.createElement('button');
    aba.type = 'button';
    aba.id = 'estoque-aba-' + id;
    aba.dataset.categoria = id;
    aba.setAttribute('role', 'tab');
    aba.setAttribute('aria-controls', painelAbas.id);
    aba.textContent = nomesDasAbas[id] ?? categorias[id].titulo;
    return aba;
  });
  listaAbas.replaceChildren(...abas);

  function atualizarCategorias() {
    const pai = paiDaCategoria(categoria);
    for (const aba of abas) {
      const selecionada = aba.dataset.categoria === pai;
      aba.setAttribute('aria-selected', String(selecionada));
      aba.tabIndex = selecionada ? 0 : -1;
      if (selecionada) painelAbas.setAttribute('aria-labelledby', aba.id);
    }
    const tipos = gruposCatalogo[pai];
    grupoTipo.hidden = !tipos;
    tipoCampo.replaceChildren(...(tipos ? [new Option('Todos os tipos', pai), ...tipos.map(id =>
      new Option(id === 'cooler' ? 'Todos os coolers' : categorias[id].nome, id))] : []));
    tipoCampo.value = categoria;
  }

  function ocultarSugestoes() {
    listaSugestoes = [];
    sugestaoAtiva = -1;
    sugestoes.hidden = true;
    sugestoes.replaceChildren();
    busca.setAttribute('aria-expanded', 'false');
    busca.removeAttribute('aria-activedescendant');
  }

  function listarSugestoes(itens) {
    listaSugestoes = itens.slice(0, 5);
    sugestoes.replaceChildren(...listaSugestoes.map((produto, indice) => {
      const opcao = document.createElement('li');
      opcao.id = 'sugestao-produto-' + indice;
      opcao.dataset.indice = indice;
      opcao.setAttribute('role', 'option');
      opcao.setAttribute('aria-selected', 'false');
      opcao.textContent = produto.nome;
      return opcao;
    }));
    busca.setAttribute('aria-expanded', 'true');
    sugestoes.hidden = false;
  }

  function selecionarSugestao(indice) {
    const produto = listaSugestoes[indice];
    if (!produto) return;
    busca.value = produto.nome;
    ocultarSugestoes();
    atualizar();
  }

  function filtrar(produto, conflitos) {
    const termos = normalizarBusca(busca.value).split(/\s+/).filter(Boolean);
    const teto = preco.valueAsNumber;
    const piso = minimo.valueAsNumber;
    const temPreco = Number.isFinite(produto.preco);
    const tipos = gruposCatalogo[categoria];
    return (categoria === todas || (tipos ? tipos.includes(produto.categoria) : mesmoGrupo(produto, categoria)))
      && (!marca.value || marca.value === produto.marca)
      && (!Number.isFinite(teto) || (temPreco && produto.preco <= teto))
      && (!Number.isFinite(piso) || (temPreco && produto.preco >= piso))
      && (!compativeis.checked || !conflitos.length)
      && termos.every(termo => produto.busca.includes(termo));
  }

  function atualizarComparacao() {
    quadro.hidden = barra.hidden = selecionados.size === 0;
    const saida = quadro.querySelector('.estoque-comparados');
    saida.replaceChildren();
    const itens = [...selecionados].map(id => porId.get(id));
    contagemComparacao.textContent = itens.length === 1 ? '1 modelo selecionado' : itens.length + ' modelos selecionados';
    listaComparacao.replaceChildren(...itens.map(produto => {
      const item = document.createElement('li');
      const nome = document.createElement('span');
      nome.textContent = produto.nome;
      const remover = document.createElement('button');
      remover.type = 'button';
      remover.className = 'botao-texto';
      remover.dataset.removerComparacao = produto.id;
      remover.textContent = 'Remover';
      remover.setAttribute('aria-label', 'Remover ' + produto.nome + ' da comparação');
      item.append(nome, remover);
      return item;
    }));
    if (!itens.length) {
      removerModelos.open = false;
      return;
    }
    const tabela = document.createElement('table');
    tabela.setAttribute('aria-label', 'Preço e características dos modelos selecionados');
    const cabecalho = tabela.createTHead().insertRow();
    for (const nome of ['Característica', ...itens.map(p => p.nome)]) {
      const celula = document.createElement('th');
      celula.scope = 'col';
      celula.textContent = nome;
      cabecalho.append(celula);
    }
    const corpo = tabela.createTBody();
    const especificacoes = itens.map(dadosDaComparacao);
    const chaves = [...new Set(especificacoes.flatMap(p => Object.keys(p)))]
      .filter(chave => especificacoes.some(p => p[chave] !== undefined));
    for (const [nome, dados] of [['Preço de referência', itens.map(p => mostrarPreco(p.preco))],
      ...chaves.map(chave => [chave, especificacoes.map(p => p[chave] ?? 'Não informado')])]) {
      const linha = corpo.insertRow();
      const campo = document.createElement('th');
      campo.scope = 'row';
      campo.textContent = nome;
      if (new Set(dados).size > 1) {
        const nota = document.createElement('span');
        nota.className = 'estoque-comparacao-diferenca';
        nota.textContent = 'Diferença';
        campo.append(nota);
      }
      linha.append(campo);
      for (const valor of dados) linha.insertCell().textContent = valor;
    }
    saida.append(tabela);
  }

  function atualizar(exibirSugestoes = false) {
    ocultarSugestoes();
    if (!produtos) return;
    const erro = minimo.valueAsNumber > preco.valueAsNumber;
    preco.setCustomValidity(erro ? 'O máximo precisa ser igual ou maior que o mínimo.' : '');
    preco.setAttribute('aria-invalid', String(erro));
    faixaErro.hidden = !erro;
    faixaErro.textContent = erro ? 'O máximo precisa ser igual ou maior que o mínimo.' : '';
    if (erro) {
      grade.replaceChildren();
      status.textContent = 'Corrija a faixa de preço para ver as peças.';
      return;
    }
    const montagem = lerMontagem(produtos);
    const conflitos = new Map(produtos.map(produto => [produto.id,
      montagem.length ? conflitosDaPeca(montagem, produto, produtos) : []]));
    const encontrados = produtos.filter(produto => filtrar(produto, conflitos.get(produto.id))).sort((a, b) => {
      if (ordenacao.value === 'nome') return a.nome.localeCompare(b.nome, 'pt-BR');
      if (!Number.isFinite(a.preco)) return Number.isFinite(b.preco) ? 1 : 0;
      if (!Number.isFinite(b.preco)) return -1;
      return ordenacao.value === 'menor' ? a.preco - b.preco : b.preco - a.preco;
    });
    grade.replaceChildren(...encontrados.map(produto => criarCartao(produto, termos, selecionados.has(produto.id), conflitos.get(produto.id))));
    const filtrosAtivos = [categoria !== todas && 'categoria', marca.value && 'marca',
      (preco.value || minimo.value) && 'faixa de preço', compativeis.checked && 'compatibilidade'].filter(Boolean);
    status.textContent = encontrados.length === 0
      ? (busca.value.trim() ? 'Nenhuma peça para a busca “' + busca.value.trim() + '”. ' : 'Nenhuma peça encontrada. ')
        + (filtrosAtivos.length ? 'Revise os filtros de ' + filtrosAtivos.join(', ') + ' ou limpe os filtros.' : 'Tente outro nome ou modelo.')
      : encontrados.length === 1 ? '1 peça encontrada.' : encontrados.length + ' peças encontradas.';
    if (exibirSugestoes && busca.value.trim() && encontrados.length) listarSugestoes(encontrados);
  }

  function ativarCategoria(chave, metodo) {
    if (chave === categoria) return;
    categoria = chave;
    const endereco = new URL(location.href);
    if (chave === todas) endereco.searchParams.delete('cat');
    else endereco.searchParams.set('cat', chave);
    if (metodo) history[metodo](null, '', endereco);
    atualizarCategorias();
    atualizar();
  }

  function selecionarAba(aba) {
    if (aba.dataset.categoria !== paiDaCategoria(categoria)) ativarCategoria(aba.dataset.categoria, 'pushState');
  }

  for (const aba of abas) aba.addEventListener('click', () => selecionarAba(aba));
  listaAbas.addEventListener('keydown', evento => {
    const proxima = abaPorTecla(evento, abas);
    if (!proxima) return;
    selecionarAba(proxima);
    proxima.focus();
  });
  tipoCampo.addEventListener('change', () => ativarCategoria(tipoCampo.value, 'pushState'));
  window.addEventListener('popstate', () => ativarCategoria(categoriaDaURL()));

  formulario.addEventListener('submit', evento => evento.preventDefault());
  formulario.addEventListener('input', evento => {
    if (evento.target !== tipoCampo) atualizar(evento.target === busca);
  });
  raiz.querySelector('.estoque-reset').addEventListener('click', () => {
    formulario.reset();
    if (categoria === todas) {
      atualizarCategorias();
      atualizar();
    } else ativarCategoria(todas, 'replaceState');
    busca.focus();
  });
  window.addEventListener('storage', evento => {
    if (evento.key === 'ggtech-montagem' || evento.key === null) atualizar();
  });
  busca.addEventListener('keydown', evento => {
    if (sugestoes.hidden) return;
    if (evento.key === 'Escape') {
      evento.preventDefault();
      ocultarSugestoes();
      return;
    }
    if (evento.key === 'Enter' && sugestaoAtiva >= 0) {
      evento.preventDefault();
      selecionarSugestao(sugestaoAtiva);
      return;
    }
    if (evento.key !== 'ArrowDown' && evento.key !== 'ArrowUp') return;
    evento.preventDefault();
    const direcao = evento.key === 'ArrowDown' ? 1 : -1;
    const inicio = sugestaoAtiva < 0 && direcao < 0 ? 0 : sugestaoAtiva;
    sugestaoAtiva = (inicio + direcao + listaSugestoes.length) % listaSugestoes.length;
    for (const [indice, opcao] of [...sugestoes.children].entries()) {
      opcao.setAttribute('aria-selected', String(indice === sugestaoAtiva));
    }
    busca.setAttribute('aria-activedescendant', sugestoes.children[sugestaoAtiva].id);
  });
  busca.addEventListener('blur', ocultarSugestoes);
  sugestoes.addEventListener('mousedown', evento => evento.preventDefault());
  sugestoes.addEventListener('click', evento => {
    const opcao = evento.target.closest('[data-indice]');
    if (opcao) selecionarSugestao(Number(opcao.dataset.indice));
  });
  grade.addEventListener('change', ({ target }) => {
    const id = target.dataset.comparar;
    if (!id) return;
    if (target.checked && selecionados.size === 3) {
      target.checked = false;
      status.textContent = 'Compare até três produtos por vez.';
      return;
    }
    if (target.checked && selecionados.size && porId.get([...selecionados][0]).categoria !== porId.get(id).categoria) {
      target.checked = false;
      status.textContent = 'Escolha peças do mesmo tipo ou limpe a comparação para começar de novo.';
      return;
    }
    if (target.checked) selecionados.add(id);
    else selecionados.delete(id);
    atualizarComparacao();
  });
  barra.querySelector('[data-ver-comparacao]').addEventListener('click', () => {
    removerModelos.open = false;
    tituloComparacao.focus();
    tituloComparacao.scrollIntoView({ block: 'start' });
  });
  removerModelos.addEventListener('keydown', evento => {
    if (evento.key !== 'Escape' || !removerModelos.open) return;
    evento.preventDefault();
    removerModelos.open = false;
    removerModelos.querySelector('summary').focus();
  });
  listaComparacao.addEventListener('click', ({ target }) => {
    const remover = target.closest('[data-remover-comparacao]');
    if (!remover) return;
    const id = remover.dataset.removerComparacao;
    const ordem = [...listaComparacao.querySelectorAll('button')].indexOf(remover);
    selecionados.delete(id);
    const checkbox = grade.querySelector(`input[data-comparar="${id}"]`);
    if (checkbox) checkbox.checked = false;
    atualizarComparacao();
    const botoes = listaComparacao.querySelectorAll('button');
    (botoes[Math.min(ordem, botoes.length - 1)] ?? checkbox ?? busca).focus({ preventScroll: true });
  });
  quadro.querySelector('[data-limpar-comparacao]').addEventListener('click', () => {
    selecionados.clear();
    atualizarComparacao();
    atualizar();
    busca.focus();
  });
  grade.addEventListener('click', evento => {
    const botao = evento.target.closest('[data-adicionar]');
    if (!botao) return;
    const produto = porId.get(botao.dataset.adicionar);
    status.textContent = adicionarAoCarrinho(produto)
      ? produto.nome + ' foi adicionado ao carrinho.'
      : 'O carrinho já tem todas as unidades disponíveis de ' + produto.nome + '.';
  });

  atualizarCategorias();
  listaAbas.hidden = false;
  atualizar();
  try {
    const [catalogo, glossario] = await Promise.all([carregarEstoque(), carregarGlossario().catch(() => [])]);
    termos = prepararDicas(painel, glossario);
    produtos = catalogo.map(produto => ({
      ...produto,
      busca: normalizarBusca([produto.nome, produto.marca, produto.destaque, categorias[produto.categoria].nome,
        categorias[produto.categoria].titulo, ...Object.values(produto.specs)].join(' ')),
    }));
    porId = new Map(produtos.map(produto => [produto.id, produto]));
    for (const nome of [...new Set(produtos.map(produto => produto.marca))].sort()) {
      marca.add(new Option(nome, nome));
    }
    atualizar();
  } catch {
    status.textContent = 'Não foi possível carregar o catálogo. Recarregue a página para tentar novamente.';
  }
}
