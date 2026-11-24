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
  const situacao = document.createElement('a');
  situacao.className = 'estoque-situacao';
  situacao.textContent = rotuloCotacao(produto);
  situacao.href = produto.fontePreco;
  situacao.setAttribute('aria-label', rotuloCotacao(produto) + ' de ' + produto.nome);
  const montar = document.createElement('a');
  montar.href = './simulador.html?adicionar=' + encodeURIComponent(produto.id);
  montar.textContent = 'Usar na montagem manual';
  montar.setAttribute('aria-label', 'Usar ' + produto.nome + ' na montagem');
  conteudo.append(nome, preco, situacao, montar);
  item.append(imagem, conteudo);
  return item;
}

export function iniciarGaveta(dialogo) {
  const titulo = dialogo.querySelector('#gaveta-titulo');
  const descricao = dialogo.querySelector('#gaveta-descricao');
  const fechar = dialogo.querySelector('#gaveta-fechar');
  const busca = dialogo.querySelector('#gaveta-busca');
  const status = dialogo.querySelector('#gaveta-status');
  const lista = dialogo.querySelector('#gaveta-lista');
  const verTodas = dialogo.querySelector('#gaveta-link-estoque');
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
  const abrirGaveta = configurarGaveta(dialogo, fechar, () => {
    delete dialogo.dataset.categoria;
    selecao = undefined;
  });

  return async function abrir(categoria, origem) {
    if (dialogo.open) return;
    const abertura = {};
    selecao = abertura;
    dialogo.dataset.categoria = categoria;
    titulo.textContent = categorias[categoria].titulo;
    descricao.textContent = categorias[categoria].descricao;
    verTodas.href = './estoque.html?cat=' + encodeURIComponent(categoria);
    produtos = [];
    busca.value = '';
    busca.disabled = true;
    lista.replaceChildren();
    status.textContent = 'Carregando opções…';
    abrirGaveta(origem);

    try {
      const catalogo = await carregarEstoque();
      if (selecao !== abertura || !dialogo.open) return;
      produtos = catalogo.filter(produto => mesmoGrupo(produto, categoria)).sort((a, b) => a.preco - b.preco);
      busca.disabled = false;
      atualizarLista();
    } catch {
      if (selecao !== abertura || !dialogo.open) return;
      status.textContent = 'Não foi possível carregar o estoque. Feche a gaveta e tente novamente.';
    }
  };
}
