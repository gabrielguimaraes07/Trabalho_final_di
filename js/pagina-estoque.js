import { adicionarAoCarrinho } from './carrinho.js';
import { carregarEstoque, categorias, normalizarBusca, precoEmReais } from './estoque.js';

const ordem = ['cpu', 'gpu', 'ram', 'placa-mae', 'armazenamento', 'fonte', 'cooler', 'ventoinhas', 'gabinete'];
const todas = 'todas';
const rotulos = { ram: 'Memória', armazenamento: 'Armazenamento', ventoinhas: 'Ventoinhas' };

function criarCartao(produto) {
  const item = document.createElement('li');
  item.className = 'estoque-produto';

  const foto = document.createElement('div');
  foto.className = 'estoque-produto-foto';
  const imagem = document.createElement('img');
  imagem.src = produto.imagem;
  imagem.alt = produto.alt;
  imagem.width = 256;
  imagem.height = 256;
  imagem.loading = 'lazy';
  imagem.decoding = 'async';
  foto.append(imagem);

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
    termo.textContent = rotulo;
    descricao.textContent = valor;
    linha.append(termo, descricao);
    especificacoes.append(linha);
  }

  const rodape = document.createElement('div');
  rodape.className = 'estoque-produto-rodape';
  const preco = document.createElement('strong');
  preco.textContent = precoEmReais.format(produto.preco);
  const disponivel = document.createElement('p');
  disponivel.className = 'estoque-situacao';
  disponivel.textContent = produto.estoque ? '✓ Em estoque' : '— Sem estoque';
  const adicionar = document.createElement('button');
  adicionar.type = 'button';
  adicionar.className = 'botao-primario estoque-adicionar';
  adicionar.dataset.adicionar = produto.id;
  adicionar.textContent = 'Adicionar';
  adicionar.setAttribute('aria-label', 'Adicionar ' + produto.nome + ' ao carrinho');
  adicionar.disabled = produto.estoque === 0;
  rodape.append(preco, disponivel, adicionar);
  item.append(foto, descricao, especificacoes, rodape);
  return item;
}

export async function iniciarPaginaEstoque(raiz) {
  const formulario = raiz.querySelector('form');
  const busca = raiz.querySelector('#busca-produtos');
  const preco = raiz.querySelector('#preco-maximo');
  const nivel = raiz.querySelector('#nivel-produto');
  const disponiveis = raiz.querySelector('#somente-disponiveis');
  const sugestoes = raiz.querySelector('#sugestoes-produtos');
  const abas = raiz.querySelector('[role="tablist"]');
  const painel = raiz.querySelector('[role="tabpanel"]');
  const status = painel.querySelector('[role="status"]');
  const grade = painel.querySelector('.estoque-grade');
  let listaSugestoes = [];
  let sugestaoAtiva = -1;
  let produtos;
  let porId;

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
    const valor = preco.valueAsNumber;
    return (categoria === todas || categoria === produto.categoria)
      && (!nivel.value || nivel.value === produto.nivel)
      && (!disponiveis.checked || produto.estoque > 0)
      && (!(valor >= 0) || produto.preco <= valor)
      && termos.every(termo => produto.busca.includes(termo));
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
    const encontrados = produtos.filter(filtrar);
    grade.replaceChildren(...encontrados.map(criarCartao));
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
    const indice = botoes.indexOf(evento.target);
    if (indice < 0) return;
    const destinos = {
      ArrowLeft: (indice - 1 + botoes.length) % botoes.length,
      ArrowRight: (indice + 1) % botoes.length,
      Home: 0,
      End: botoes.length - 1,
    };
    const proximo = botoes[destinos[evento.key]];
    if (!proximo) return;
    evento.preventDefault();
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
    const catalogo = await carregarEstoque();
    produtos = catalogo.map(produto => ({
      ...produto,
      busca: normalizarBusca([produto.nome, produto.marca, produto.destaque, categorias[produto.categoria].nome,
        categorias[produto.categoria].titulo, ...Object.values(produto.specs)].join(' ')),
    }));
    porId = new Map(produtos.map(produto => [produto.id, produto]));
    atualizar();
  } catch {
    status.textContent = 'Não foi possível carregar o estoque. Recarregue a página para tentar novamente.';
  }
}
