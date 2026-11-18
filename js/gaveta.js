import { carregarEstoque, categorias, precoEmReais } from './estoque.js';

function normalizar(texto) {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

function resumoProduto(produto) {
  const item = document.createElement('li');
  item.className = 'produto-resumo';

  const imagem = document.createElement('img');
  imagem.src = produto.imagem;
  imagem.alt = produto.alt;
  imagem.width = 56;
  imagem.height = 56;
  imagem.decoding = 'async';

  const conteudo = document.createElement('div');
  const nome = document.createElement('h3');
  nome.textContent = produto.nome;
  const preco = document.createElement('p');
  preco.textContent = precoEmReais.format(produto.preco);
  const situacao = document.createElement('p');
  situacao.className = 'estoque-situacao';
  situacao.textContent = produto.estoque > 0 ? '✓ Em estoque' : '– Sem estoque';
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
  let selecao;
  let produtos;

  function atualizarLista() {
    const termo = normalizar(busca.value);
    const encontrados = produtos.filter(produto => normalizar(produto.nome + ' ' + produto.marca).includes(termo));
    lista.replaceChildren(...encontrados.map(resumoProduto));

    if (encontrados.length === 0) {
      status.textContent = 'Nenhuma peça com esse nome. Tente outra busca.';
    } else {
      status.textContent = encontrados.length === 1 ? '1 opção' : encontrados.length + ' opções';
    }
  }

  fechar.addEventListener('click', () => dialogo.close());
  busca.addEventListener('input', atualizarLista);

  dialogo.addEventListener('click', evento => {
    if (evento.target !== dialogo) return;
    const limites = dialogo.getBoundingClientRect();
    if (evento.clientX < limites.left || evento.clientX > limites.right) dialogo.close();
  });

  dialogo.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') {
      evento.preventDefault();
      dialogo.close();
      return;
    }
    if (evento.key !== 'Tab') return;
    const controles = [...dialogo.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href]')];
    const [primeiro] = controles;
    const ultimo = controles.at(-1);
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  });

  dialogo.addEventListener('close', () => {
    if (dialogo.open) return;
    delete dialogo.dataset.categoria;
    selecao?.origem.focus({ preventScroll: true });
    selecao = undefined;
  });

  return async function abrir(categoria, origem) {
    if (dialogo.open) return;
    const abertura = { origem };
    selecao = abertura;
    dialogo.dataset.categoria = categoria;
    titulo.textContent = categorias[categoria].titulo;
    descricao.textContent = categorias[categoria].descricao;
    produtos = [];
    busca.value = '';
    busca.disabled = true;
    lista.replaceChildren();
    status.textContent = 'Carregando opções…';
    dialogo.showModal();
    dialogo.scrollTop = 0;
    fechar.focus();

    try {
      const catalogo = await carregarEstoque();
      if (selecao !== abertura || !dialogo.open) return;
      produtos = catalogo.filter(produto => produto.categoria === categoria);
      busca.disabled = false;
      atualizarLista();
    } catch {
      if (selecao !== abertura || !dialogo.open) return;
      status.textContent = 'Não foi possível carregar o estoque. Feche a gaveta e tente novamente.';
    }
  };
}
