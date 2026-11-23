import { carregarBuildsProntos, linkDaConfiguracao } from './configuracoes.js?v=1.0-final';
import { mostrarSubtotal } from './estoque.js?v=1.0-final';

function criarCartao(build, completo) {
  const item = document.createElement('li');
  item.className = 'builds-cartao';
  const titulo = document.createElement(completo ? 'h2' : 'h3');
  titulo.textContent = build.titulo;
  const descricao = document.createElement('p');
  descricao.textContent = build.descricao;
  const preco = document.createElement('strong');
  preco.textContent = mostrarSubtotal(build.cotacao);
  const link = document.createElement('a');
  link.className = 'builds-link';
  link.href = linkDaConfiguracao(build.produtos);
  link.textContent = 'Personalizar montagem';
  link.setAttribute('aria-label', 'Personalizar montagem ' + build.titulo);
  if (completo && build.imagem) {
    const imagem = document.createElement('img');
    imagem.src = build.imagem;
    imagem.alt = 'Referência de ambiente para o setup ' + build.titulo;
    imagem.loading = 'lazy';
    imagem.width = 480;
    imagem.height = 270;
    item.append(imagem);
  }
  item.append(titulo, descricao, preco);
  if (completo) {
    const detalhes = document.createElement('details');
    const resumo = document.createElement('summary');
    resumo.textContent = 'Ver lista de peças';
    detalhes.append(resumo);
    const lista = document.createElement('ul');
    for (const produto of build.produtos) {
      const linha = document.createElement('li');
      linha.textContent = produto.nome + ' · ' + Object.values(produto.specs).slice(0, 2).join(' · ');
      lista.append(linha);
    }
    detalhes.append(lista);
    item.append(detalhes);
  }
  item.append(link);
  return item;
}

export async function iniciarBuildsProntos(secao) {
  const status = secao.querySelector('.builds-status');
  const grade = secao.querySelector('.builds-grade');
  const completo = grade.classList.contains('builds-completos');
  try {
    const builds = await carregarBuildsProntos();
    const visiveis = completo ? builds : [builds[0], builds[4], builds[6]].filter(Boolean);
    grade.replaceChildren(...visiveis.map(build => criarCartao(build, completo)));
    status.hidden = visiveis.length > 0;
    if (!visiveis.length) status.textContent = 'Nenhuma configuração disponível.';
  } catch {
    status.textContent = 'Não foi possível carregar as configurações. Recarregue a página para tentar novamente.';
  }
}
