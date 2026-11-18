import { carregarBuildsProntos } from './configuracoes.js';
import { precoEmReais } from './estoque.js';

function criarCartao(build) {
  const item = document.createElement('li');
  item.className = 'builds-cartao';
  const titulo = document.createElement('h3');
  titulo.textContent = build.nome;
  const descricao = document.createElement('p');
  descricao.textContent = build.descricao;
  const preco = document.createElement('strong');
  preco.textContent = precoEmReais.format(build.preco);
  const link = document.createElement('a');
  link.className = 'builds-link';
  link.href = './montador.html?build=' + encodeURIComponent(build.id);
  link.textContent = 'Ver peças';
  link.setAttribute('aria-label', 'Ver peças de ' + build.nome);
  item.append(titulo, descricao, preco, link);
  return item;
}

export async function iniciarBuildsProntos(secao) {
  const status = secao.querySelector('.builds-status');
  try {
    const builds = await carregarBuildsProntos();
    secao.querySelector('.builds-grade').replaceChildren(...builds.map(criarCartao));
    if (builds.length) status.hidden = true;
    else status.textContent = 'Use o montador para sugerir uma configuração com as peças disponíveis.';
  } catch {
    status.textContent = 'As configurações prontas estão indisponíveis. Você pode abrir o montador.';
  }
}
