import { adicionarAoCarrinho } from './carrinho.js?v=interfaces-4';
import { carregarGlossario, escreverTermo, prepararDicas } from './glossario.js?v=1.0-final';
import { carregarEstoque, categorias, grupos3d, mesmoGrupo, mostrarPreco, normalizarBusca, ordemCatalogo, rotuloCotacao, avisoDeVideo } from './estoque.js?v=interfaces-4';

import { conflitosDaPeca, lerMontagem } from './montagem.js?v=interfaces-4';

const ordem = [...ordemCatalogo, ...Object.keys(grupos3d)];
const todas = 'todas';
const categoriasPrincipais = [...new Set(ordemCatalogo.map(paiDaCategoria))];

function paiDaCategoria(id) {
  return Object.keys(grupos3d).find(pai => grupos3d[pai].includes(id)) ?? id;
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
  else {
    const ficha = document.createElement('a');
    ficha.href = produto.fonte;
    ficha.textContent = 'Ver foto no fabricante';
    foto.append(ficha);
  }

  const descricao = document.createElement('div');
  descricao.className = 'estoque-produto-descricao';
  const marca = document.createElement('p');
  marca.className = 'estoque-produto-marca';
  marca.textContent = produto.marca;
  const titulo = document.createElement('h2');
  titulo.textContent = produto.nome;
  descricao.append(marca, titulo);

  const especificacoes = document.createElement('dl');
  especificacoes.className = 'estoque-produto-specs';
  for (const [rotulo, valor] of Object.entries(produto.specs).slice(0, 3)) {
    const linha = document.createElement('div');
    const termo = document.createElement('dt');
    const descricao = document.createElement('dd');
    escreverTermo(termo, rotulo, termos);
    escreverTermo(descricao, valor, termos);
    linha.append(termo, descricao);
    especificacoes.append(linha);
  }

  const rodape = document.createElement('div');
  rodape.className = 'estoque-produto-rodape';
  const preco = document.createElement('strong');
  preco.textContent = mostrarPreco(produto.preco);
  const disponivel = document.createElement('p');
  disponivel.className = 'estoque-situacao';
  if (produto.fontePreco) {
    const fonte = document.createElement('a');
    fonte.href = produto.fontePreco;
    fonte.textContent = rotuloCotacao(produto) + ' · ' + produto.lojaPreco;
    disponivel.append(fonte);
  }
  const adicionar = document.createElement('button');
  adicionar.type = 'button';
  adicionar.className = 'botao-contorno';
  adicionar.dataset.adicionar = produto.id;
  adicionar.textContent = 'Adicionar ao carrinho';
  adicionar.setAttribute('aria-label', 'Adicionar ' + produto.nome + ' ao carrinho');
  adicionar.disabled = produto.estoque === 0;
  rodape.append(preco, disponivel);
  const detalhes = document.createElement('details');
  detalhes.className = 'estoque-detalhe';
  const resumo = document.createElement('summary');
  resumo.textContent = 'Detalhes da peça';
  const explicacao = document.createElement('p');
  explicacao.textContent = produto.descricao;
  const fonte = document.createElement('a');
  fonte.href = produto.fonte;
  fonte.textContent = 'Ficha técnica do fabricante';
  detalhes.append(resumo, explicacao, fonte);
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
  const formulario = raiz.querySelector('form');
  const busca = raiz.querySelector('#busca-produtos');
  const preco = raiz.querySelector('#preco-maximo');
  const minimo = raiz.querySelector('#preco-minimo');
  const marca = raiz.querySelector('#marca-produto');
  const ordenacao = raiz.querySelector('#ordem-produtos');
  const compativeis = raiz.querySelector('#somente-compativeis');
  const quadro = raiz.querySelector('.estoque-comparacao');
  const selecionados = new Set();
  const sugestoes = raiz.querySelector('#sugestoes-produtos');
  const categoriaCampo = raiz.querySelector('#categoria-produto');
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
    return ordem.includes(cat) ? cat : todas;
  }

  let categoria = categoriaDaURL();
  for (const id of categoriasPrincipais) categoriaCampo.add(new Option(categorias[id].nome, id));

  function atualizarCategorias() {
    const pai = paiDaCategoria(categoria);
    categoriaCampo.value = pai;
    const tipos = grupos3d[pai];
    grupoTipo.hidden = !tipos;
    tipoCampo.replaceChildren(...(tipos ? [new Option('Todos os tipos', pai), ...tipos.map(id =>
      new Option(categorias[id].nome, id))] : []));
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
    return (categoria === todas || mesmoGrupo(produto, categoria))
      && (!marca.value || marca.value === produto.marca)
      && (!Number.isFinite(teto) || (temPreco && produto.preco <= teto))
      && (!Number.isFinite(piso) || (temPreco && produto.preco >= piso))
      && (!compativeis.checked || !conflitos.length)
      && termos.every(termo => produto.busca.includes(termo));
  }

  function atualizarComparacao() {
    quadro.hidden = selecionados.size === 0;
    const saida = quadro.querySelector('.estoque-comparados');
    saida.replaceChildren();
    if (!selecionados.size) return;
    const itens = [...selecionados].map(id => porId.get(id));
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
    const chaves = [...new Set(itens.flatMap(p => Object.keys(p.specs)))];
    for (const [nome, dados] of [['Preço de referência', itens.map(p => mostrarPreco(p.preco))],
      ...chaves.map(chave => [chave, itens.map(p => p.specs[chave] ?? 'Não informado')])]) {
      const linha = corpo.insertRow();
      const campo = document.createElement('th');
      campo.scope = 'row';
      campo.textContent = nome;
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

  categoriaCampo.addEventListener('change', () => ativarCategoria(categoriaCampo.value, 'pushState'));
  tipoCampo.addEventListener('change', () => ativarCategoria(tipoCampo.value, 'pushState'));
  window.addEventListener('popstate', () => ativarCategoria(categoriaDaURL()));

  formulario.addEventListener('submit', evento => evento.preventDefault());
  formulario.addEventListener('input', evento => {
    if (evento.target !== categoriaCampo && evento.target !== tipoCampo) atualizar(evento.target === busca);
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
    status.textContent = selecionados.size + ' selecionado(s) para comparação.';
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
