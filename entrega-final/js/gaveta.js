import { carregarEstoque, categorias, mesmoGrupo, mostrarPreco, normalizarBusca, rotuloCotacao } from './estoque.js?v=interfaces-4';

function resumoProduto(produto) {
  const item = document.createElement('li');
  item.className = 'produto-resumo';

  const imagem = document.createElement('img');
  if (produto.imagem) imagem.src = produto.imagem;
  imagem.alt = produto.alt ?? '';
  imagem.hidden = !produto.imagem;
  imagem.width = 240;
  imagem.height = 180;
  imagem.decoding = 'async';
  imagem.loading = 'lazy';

  const conteudo = document.createElement('div');
  const nome = document.createElement('h3');
  nome.textContent = produto.nome;
  const preco = document.createElement('p');
  preco.textContent = mostrarPreco(produto.preco);
  preco.className = 'produto-resumo-preco';
  const situacao = document.createElement('p');
  situacao.className = 'estoque-situacao';
  situacao.textContent = rotuloCotacao(produto);
  const montar = document.createElement('a');
  montar.href = './simulador.html?adicionar=' + encodeURIComponent(produto.id);
  montar.textContent = 'Usar na montagem manual';
  montar.setAttribute('aria-label', 'Usar ' + produto.nome + ' na montagem');
  conteudo.append(nome, preco, situacao, montar);
  item.append(imagem, conteudo);
  return item;
}

export function iniciarGaveta(painel, atualizarSelecao) {
  const titulo = painel.querySelector('#gaveta-titulo');
  const descricao = painel.querySelector('#gaveta-descricao');
  const fechar = painel.querySelector('#gaveta-fechar');
  const busca = painel.querySelector('#gaveta-busca');
  const status = painel.querySelector('#gaveta-status');
  const lista = painel.querySelector('#gaveta-lista');
  let selecao;
  let produtos;

  function atualizarLista() {
    const termo = normalizarBusca(busca.value);
    const encontrados = produtos.filter(produto => normalizarBusca(produto.nome + ' ' + produto.marca).includes(termo));
    lista.replaceChildren(...encontrados.map(resumoProduto));

    if (encontrados.length === 0) {
      status.textContent = 'Nenhuma peça com esse nome. Tente outra busca.';
    } else {
      status.textContent = encontrados.length === 1 ? '1 opção' : encontrados.length + ' opções';
    }
  }

  function fecharPainel() {
    if (!selecao) return;
    const origem = selecao.origem;
    selecao = undefined;
    painel.hidden = true;
    delete painel.dataset.categoria;
    atualizarSelecao();
    origem.focus();
  }

  busca.addEventListener('input', atualizarLista);
  fechar.addEventListener('click', fecharPainel);
  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && !evento.defaultPrevented && selecao && !document.querySelector('dialog[open]')) {
      evento.preventDefault();
      fecharPainel();
    }
  });

  return async function abrir(categoria, origem, focarPainel = false) {
    if (selecao && painel.dataset.categoria === categoria) {
      selecao.origem = origem;
      if (focarPainel) fechar.focus();
      return;
    }

    const abertura = { origem };
    selecao = abertura;
    painel.dataset.categoria = categoria;
    titulo.textContent = categorias[categoria].titulo;
    descricao.textContent = categorias[categoria].descricao;
    produtos = [];
    busca.value = '';
    busca.disabled = true;
    lista.replaceChildren();
    status.textContent = 'Carregando opções…';
    painel.hidden = false;
    lista.scrollTop = 0;
    atualizarSelecao(categoria);
    if (focarPainel) fechar.focus();

    try {
      const catalogo = await carregarEstoque();
      if (selecao !== abertura) return;
      produtos = catalogo.filter(produto => mesmoGrupo(produto, categoria)).sort((a, b) => a.preco - b.preco);
      busca.disabled = false;
      atualizarLista();
    } catch {
      if (selecao !== abertura) return;
      status.textContent = 'Não foi possível carregar o catálogo. Feche as opções e tente novamente.';
    }
  };
}
