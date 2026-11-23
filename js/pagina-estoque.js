import { abaPorTecla } from './abas.js?v=1.0-final';
import { adicionarAoCarrinho } from './carrinho.js?v=1.0-final';
import { carregarGlossario, escreverTermo, prepararDicas } from './glossario.js?v=1.0-final';
import { carregarEstoque, categorias, grupos3d, mesmoGrupo, mostrarPreco, normalizarBusca, ordemCatalogo } from './estoque.js?v=1.0-final';

import { lerMontagem, pecaCompativel } from './montagem.js?v=1.0-final';

const ordem = [...ordemCatalogo, ...Object.keys(grupos3d)];
const todas = 'todas';
const rotulos = { ram: 'Memória', armazenamento: 'Armazenamento', ventoinhas: 'Ventoinhas' };

function criarCartao(produto, termos, selecionado) {
  const item = document.createElement('li');
  item.className = 'estoque-produto';

  const foto = document.createElement('div');
  foto.className = 'estoque-produto-foto';
  const imagem = document.createElement('img');
  if (produto.imagem) imagem.src = produto.imagem;
  imagem.alt = produto.alt ?? '';
  imagem.width = 256;
  imagem.height = 256;
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
    fonte.textContent = 'Fonte da cotação';
    disponivel.append(fonte);
  }
  const adicionar = document.createElement('button');
  adicionar.type = 'button';
  adicionar.className = 'botao-primario estoque-adicionar';
  adicionar.dataset.adicionar = produto.id;
  adicionar.textContent = 'Adicionar';
  adicionar.setAttribute('aria-label', 'Adicionar ' + produto.nome + ' ao carrinho');
  adicionar.disabled = produto.estoque === 0;
  rodape.append(preco, disponivel, adicionar);
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
  simular.textContent = 'Usar na montagem';
  const rotuloComparar = document.createElement('label');
  const comparar = document.createElement('input');
  comparar.type = 'checkbox';
  comparar.dataset.comparar = produto.id;
  comparar.checked = selecionado;
  comparar.setAttribute('aria-label', 'Comparar ' + produto.nome);
  rotuloComparar.append(comparar, ' Comparar');
  detalhes.append(simular);
  item.append(foto, descricao, especificacoes, detalhes, rodape, rotuloComparar);
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
  const abas = raiz.querySelector('[role="tablist"]');
  const painel = raiz.querySelector('[role="tabpanel"]');
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
  const botoes = [todas, ...ordem].map(chave => {
    const aba = document.createElement('button');
    aba.type = 'button';
    aba.id = 'aba-estoque-' + chave;
    aba.dataset.categoria = chave;
    aba.textContent = chave === todas ? 'Todas' : rotulos[chave] ?? categorias[chave].nome;
    aba.setAttribute('role', 'tab');
    aba.setAttribute('aria-controls', painel.id);
    abas.append(aba);
    return aba;
  });

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

  function filtrar(produto) {
    const termos = normalizarBusca(busca.value).split(/\s+/).filter(Boolean);
    const teto = preco.valueAsNumber;
    const piso = minimo.valueAsNumber;
    const temPreco = Number.isFinite(produto.preco);
    return (categoria === todas || mesmoGrupo(produto, categoria))
      && (!marca.value || marca.value === produto.marca)
      && (!Number.isFinite(teto) || (temPreco && produto.preco <= teto))
      && (!Number.isFinite(piso) || (temPreco && produto.preco >= piso))
      && (!compativeis.checked || pecaCompativel(lerMontagem(produtos), produto, produtos))
      && termos.every(termo => produto.busca.includes(termo));
  }

  function atualizarComparacao() {
    quadro.hidden = selecionados.size === 0;
    const cartoes = [...selecionados].map(id => {
      const produto = porId.get(id);
      const bloco = document.createElement('article');
      const titulo = document.createElement('h3');
      titulo.textContent = produto.nome;
      const dados = document.createElement('dl');
      for (const [nome, valor] of Object.entries(produto.specs)) {
        const termo = document.createElement('dt');
        const info = document.createElement('dd');
        termo.textContent = nome;
        info.textContent = valor;
        dados.append(termo, info);
      }
      bloco.append(titulo, dados);
      return bloco;
    });
    quadro.querySelector('.estoque-comparados').replaceChildren(...cartoes);
  }

  function atualizar(exibirSugestoes = false) {
    const abaAtual = botoes.find(aba => aba.dataset.categoria === categoria);
    for (const aba of botoes) {
      aba.setAttribute('aria-selected', String(aba === abaAtual));
      aba.tabIndex = aba === abaAtual ? 0 : -1;
    }
    painel.setAttribute('aria-labelledby', abaAtual.id);
    painel.removeAttribute('aria-label');
    ocultarSugestoes();
    if (!produtos) return;
    const encontrados = produtos.filter(filtrar).sort((a, b) => {
      if (ordenacao.value === 'nome') return a.nome.localeCompare(b.nome, 'pt-BR');
      if (!Number.isFinite(a.preco)) return Number.isFinite(b.preco) ? 1 : 0;
      if (!Number.isFinite(b.preco)) return -1;
      return ordenacao.value === 'menor' ? a.preco - b.preco : b.preco - a.preco;
    });
    grade.replaceChildren(...encontrados.map(produto => criarCartao(produto, termos, selecionados.has(produto.id))));
    status.textContent = encontrados.length === 0
      ? "Nenhuma peça com esse nome. Tente ‘SSD’ ou ‘memória’, ou revise os filtros."
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
    atualizar();
  }

  abas.addEventListener('click', evento => {
    const aba = evento.target.closest('button');
    if (aba) ativarCategoria(aba.dataset.categoria, 'pushState');
  });
  abas.addEventListener('keydown', evento => {
    const proximo = abaPorTecla(evento, botoes);
    if (!proximo) return;
    ativarCategoria(proximo.dataset.categoria, 'replaceState');
    proximo.focus();
  });
  window.addEventListener('popstate', () => ativarCategoria(categoriaDaURL()));

  formulario.addEventListener('submit', evento => evento.preventDefault());
  formulario.addEventListener('input', evento => atualizar(evento.target === busca));
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
    status.textContent = 'Não foi possível carregar o estoque. Recarregue a página para tentar novamente.';
  }
}
