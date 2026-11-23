import { carregarEstoque, categorias, mesmoGrupo, mostrarPreco, normalizarBusca } from './estoque.js?v=1.0-final';
import { configurarGaveta } from './dialogo.js?v=1.0-final';

function resumoProduto(produto) {
  const item = document.createElement('li');
  item.className = 'produto-resumo';

  const imagem = document.createElement('img');
  if (produto.imagem) imagem.src = produto.imagem;
  imagem.alt = produto.alt ?? '';
  imagem.hidden = !produto.imagem;
  imagem.width = 56;
  imagem.height = 56;
  imagem.decoding = 'async';

  const conteudo = document.createElement('div');
  const nome = document.createElement('h3');
  nome.textContent = produto.nome;
  const preco = document.createElement('p');
  preco.textContent = mostrarPreco(produto.preco);
  const situacao = document.createElement('p');
  situacao.className = 'estoque-situacao';
  situacao.textContent = 'Ficha no catálogo';
  conteudo.append(nome, preco, situacao);
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
      produtos = catalogo.filter(produto => mesmoGrupo(produto, categoria));
      busca.disabled = false;
      atualizarLista();
    } catch {
      if (selecao !== abertura || !dialogo.open) return;
      status.textContent = 'Não foi possível carregar o estoque. Feche a gaveta e tente novamente.';
    }
  };
}
