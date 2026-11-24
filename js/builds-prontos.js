import { carregarBuildsProntos, linkDaConfiguracao } from './configuracoes.js?v=setups-2';
import { mostrarPreco, mostrarSubtotal } from './estoque.js?v=1.0-final';

const ocasioes = {
  jogos: 'Jogos',
  estudos: 'Estudos',
  programacao: 'Programação',
  edicao: 'Edição de vídeo',
  produtividade: 'Produtividade',
};

function elemento(tag, texto, classe) {
  const no = document.createElement(tag);
  if (texto) no.textContent = texto;
  if (classe) no.className = classe;
  return no;
}

function criarCartao(build, completo) {
  const item = elemento('li', '', 'builds-cartao');
  const conteudo = elemento('div', '', 'builds-cartao-conteudo');
  const titulo = elemento('h3', build.titulo);
  const preco = elemento('strong', mostrarSubtotal(build.cotacao));
  const link = elemento('a', 'Personalizar montagem', 'builds-link');
  link.href = linkDaConfiguracao(build.produtos);
  link.setAttribute('aria-label', 'Personalizar montagem: ' + build.titulo);
  if (build.imagem) {
    const foto = elemento('img', '', 'builds-foto');
    foto.src = build.imagem;
    foto.alt = build.alt;
    foto.loading = 'lazy';
    foto.decoding = 'async';
    foto.width = 960;
    foto.height = 540;
    item.append(foto);
  }
  conteudo.append(titulo, elemento('p', build.descricao, 'builds-descricao'), preco);
  if (completo) {
    const detalhes = elemento('details');
    detalhes.append(elemento('summary', 'Ver lista de peças'));
    const lista = elemento('ul', '', 'builds-pecas');
    for (const produto of build.produtos) {
      const linha = elemento('li');
      linha.append(elemento('span', produto.nome), elemento('span', mostrarPreco(produto.preco)));
      lista.append(linha);
    }
    detalhes.append(lista);
    conteudo.append(detalhes);
  }
  conteudo.append(link);
  item.append(conteudo);
  return item;
}

function mostrarPorOcasiao(grupos, navegacao, secoes) {
  for (const [id, titulo, builds] of grupos) {
    const secao = elemento('section', '', 'builds-ocasiao');
    secao.id = id;
    const cabecalho = elemento('h2', titulo);
    cabecalho.id = id + '-titulo';
    secao.setAttribute('aria-labelledby', cabecalho.id);
    const grade = elemento('ul', '', 'builds-grade builds-completos');
    grade.append(...builds.map(build => criarCartao(build, true)));
    secao.append(cabecalho, grade);
    secoes.append(secao);
    const atalho = elemento('a', titulo);
    atalho.href = '#' + id;
    navegacao.append(atalho);
  }
  navegacao.hidden = false;
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

export async function iniciarBuildsProntos(secao) {
  const status = secao.querySelector('.builds-status');
  const navegacao = secao.querySelector('.builds-navegacao');
  try {
    const builds = await carregarBuildsProntos();
    const grupos = Object.entries(ocasioes).map(([id, titulo]) =>
      [id, titulo, builds.filter(build => build.ocasiao === id)]).filter(([, , itens]) => itens.length);
    if (!grupos.length) {
      status.textContent = 'Nenhuma configuração disponível.';
      return;
    }
    if (navegacao) {
      mostrarPorOcasiao(grupos, navegacao, secao.querySelector('.builds-secoes'));
    } else {
      const grade = secao.querySelector('.builds-grade');
      grade.replaceChildren(...grupos.map(([, , itens]) => criarCartao(itens[0], false)));
    }
    status.hidden = true;
  } catch {
    status.textContent = 'Não foi possível carregar as configurações. Recarregue a página para tentar novamente.';
  }
}
