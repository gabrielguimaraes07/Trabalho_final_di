import { verificarCompatibilidade } from './compatibilidade.js?v=interfaces-4';
import { carregarEstoque, somarItens } from './estoque.js?v=interfaces-4';

export const usos = {
  jogar: { titulo: 'Seu PC para jogar', explicacao: 'A sugestão considera a placa de vídeo e a memória.' },
  estudar: { titulo: 'Seu PC para estudar', explicacao: 'Uma base para aulas, navegação e documentos.' },
  trabalhar: { titulo: 'Seu PC para trabalhar', explicacao: 'A sugestão considera memória e multitarefas.' },
  criar: { titulo: 'Seu PC para criar conteúdo', explicacao: 'A sugestão considera núcleos, memória e placa de vídeo.' },
};
export const prioridades = ['economia', 'desempenho', 'rgb'];
let buildsProntos;

export function carregarBuildsProntos() {
  buildsProntos ??= Promise.all([
    carregarEstoque(),
    fetch(new URL('../data/builds.json?v=montagem-3', import.meta.url)).then(resposta => {
      if (!resposta.ok) throw new Error('Configurações indisponíveis');
      return resposta.json();
    }),
  ]).then(([catalogo, builds]) => {
    const porId = new Map(catalogo.map(produto => [produto.id, produto]));
    return builds.flatMap(build => {
      const produtos = build.produtos.map(id => porId.get(id));
      if (produtos.some(produto => !produto)) return [];
      const itens = produtos.map(produto => ({ produto, quantidade: 1 }));
      if (verificarCompatibilidade(itens).some(regra => regra.estado === 'erro')) return [];
      const cotacao = somarItens(itens);
      return [{ ...build, produtos, cotacao, nome: build.titulo, preco: cotacao.faltam ? null : cotacao.valor }];
    });
  }).catch(erro => {
    buildsProntos = undefined;
    throw erro;
  });
  return buildsProntos;
}

function capacidade(build, uso) {
  const cpu = build.produtos.find(produto => produto.categoria === 'cpu')?.compat.nucleos ?? 0;
  const placaDeVideo = build.produtos.find(produto => produto.categoria === 'gpu');
  const gpu = placaDeVideo?.compat.classe ?? 0;
  const ram = build.produtos.filter(produto => produto.categoria === 'ram').reduce((soma, produto) => soma + produto.compat.gb, 0);
  const criterios = { jogar: [gpu, ram, cpu], criar: [cpu, gpu, ram], estudar: [ram, cpu], trabalhar: [ram, cpu] };
  const video = (uso === 'jogar' || uso === 'criar') && placaDeVideo ? ', além da ' + placaDeVideo.nome : '';
  return { ordem: criterios[uso], detalhe: cpu + ' núcleos e ' + ram + ' GB de memória' + video };
}

export function menorPrecoConfiguracao(builds, uso) {
  const minimo = Math.min(...builds.filter(build => build.uso === uso && Number.isFinite(build.preco)).map(build => build.preco));
  return Number.isFinite(minimo) ? minimo : null;
}

export function sugerirConfiguracao(builds, { uso, prioridade, orcamento }) {
  const candidatas = builds.filter(build => build.uso === uso).sort((a, b) => a.cotacao.valor - b.cotacao.valor);
  const minimo = menorPrecoConfiguracao(candidatas, uso);
  const dentro = candidatas.filter(build => build.preco !== null && build.preco <= orcamento);
  let perfil = dentro[0];
  let motivo = 'É a configuração completa de menor custo para esse uso.';
  if (dentro.length && prioridade === 'desempenho') {
    const classificadas = dentro.map(build => ({ build, ...capacidade(build, uso) }));
    classificadas.sort((a, b) => a.ordem.map((valor, i) => b.ordem[i] - valor).find(diferenca => diferenca) ?? 0);
    perfil = classificadas[0].build;
    motivo = 'Entre as opções no orçamento, esta ficou à frente pelos critérios do seu uso, com ' + classificadas[0].detalhe + '.';
  } else if (dentro.length && prioridade === 'rgb') {
    const ilumina = build => build.produtos.find(produto => produto.compat.iluminacao === 'ARGB' || produto.compat.iluminacao === 'RGB');
    const rgb = dentro.find(ilumina);
    if (rgb) perfil = rgb;
    motivo = rgb ? ilumina(rgb).nome + ' traz iluminação ' + ilumina(rgb).compat.iluminacao + ' informada na ficha.'
      : 'Nenhuma opção desse uso com RGB coube no orçamento. Esta é a alternativa de menor custo.';
  }
  const alternativa = candidatas.find(build => build.cotacao.faltam && build.cotacao.valor <= orcamento);
  return { configuracao: perfil ?? alternativa ?? null, minimo,
    motivo: perfil ? motivo : 'Há peças com preço pendente. Confira o valor completo antes de decidir.' };
}

export function linkDaConfiguracao(produtos) {
  const parametros = new URLSearchParams({ pecas: produtos.map(produto => produto.id + ':1').join(',') });
  return './simulador.html?' + parametros;
}
