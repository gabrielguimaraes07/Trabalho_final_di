import { carregarEstoque, categorias, mesmoGrupo, mostrarPreco, normalizarBusca, rotuloCotacao } from './estoque.js?v=interfaces-4';
import { configurarGaveta } from './dialogo.js?v=1.0-final';

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
  const verTodas = painel.querySelector('#gaveta-link-estoque');
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

  busca.addEventListener('input', atualizarLista);
  function limparSelecao() {
    selecao = undefined;
    painel.removeAttribute('data-preparando');
    delete painel.dataset.categoria;
    atualizarSelecao();
  }

  const abrirCatalogo = configurarGaveta(painel, fechar, limparSelecao);
  document.addEventListener('keydown', evento => {
    if (evento.key !== 'Escape' || evento.defaultPrevented || !selecao || selecao.revelada) return;
    evento.preventDefault();
    const origem = selecao.origem;
    limparSelecao();
    origem.focus({ preventScroll: true });
  });

  return async function abrir(categoria, origem) {
    if (painel.open) return;
    if (selecao?.revelada) {
      await new Promise(resolver => painel.addEventListener('close', resolver, { once: true }));
    }
    if (selecao) return;
    const abertura = { origem };
    selecao = abertura;
    painel.dataset.categoria = categoria;
    titulo.textContent = categorias[categoria].titulo;
    descricao.textContent = categorias[categoria].descricao;
    verTodas.href = './estoque.html?cat=' + encodeURIComponent(categoria);
    produtos = [];
    busca.value = '';
    busca.disabled = true;
    lista.replaceChildren();
    status.textContent = 'Carregando opções…';
    painel.setAttribute('data-preparando', '');
    atualizarSelecao(categoria, () => {
      if (selecao !== abertura) return;
      if (document.querySelector('dialog[open]')) {
        limparSelecao();
        return;
      }
      painel.removeAttribute('data-preparando');
      abrirCatalogo(origem);
      abertura.revelada = true;
    });

    try {
      const catalogo = await carregarEstoque();
      if (selecao !== abertura) return;
      produtos = catalogo.filter(produto => mesmoGrupo(produto, categoria)).sort((a, b) => a.preco - b.preco);
      busca.disabled = false;
      atualizarLista();
    } catch {
      if (selecao !== abertura) return;
      status.textContent = 'Não foi possível carregar o catálogo. Feche a gaveta e tente novamente.';
    }
  };
}
