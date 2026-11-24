import { verificarCompatibilidade } from './compatibilidade.js?v=montagem-3';
import { carregarEstoque, somarItens } from './estoque.js?v=montagem-3';

export const usos = {
  jogar: { titulo: 'Seu PC para jogar', explicacao: 'A sugestão considera a placa de vídeo e a memória.' },
  estudar: { titulo: 'Seu PC para estudar', explicacao: 'Uma base para aulas, navegação e documentos.' },
  trabalhar: { titulo: 'Seu PC para trabalhar', explicacao: 'A sugestão considera memória e multitarefas.' },
  criar: { titulo: 'Seu PC para criar conteúdo', explicacao: 'A sugestão considera núcleos, memória e placa de vídeo.' },
};
export const prioridades = ['silencio', 'desempenho', 'rgb'];
const niveis = ['entrada', 'intermediario', 'avancado', 'premium'];
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

export function sugerirConfiguracao(builds, { uso, prioridade, orcamento }) {
  const candidatas = builds.filter(build => build.uso === uso).sort((a, b) =>
    niveis.indexOf(a.nivel) - niveis.indexOf(b.nivel) || a.cotacao.valor - b.cotacao.valor);
  const minimo = Math.min(...candidatas.filter(build => build.preco !== null).map(build => build.preco));
  const dentro = candidatas.filter(build => build.cotacao.valor <= orcamento);
  const perfil = prioridade === 'desempenho' ? dentro.at(-1) : prioridade === 'rgb'
    ? dentro.findLast(build => build.uso === 'jogar') ?? dentro[0] : dentro[0];
  const alternativa = candidatas.find(build => build.cotacao.faltam);
  return { configuracao: perfil ?? alternativa ?? null, minimo: Number.isFinite(minimo) ? minimo : null };
}

export function linkDaConfiguracao(produtos) {
  const parametros = new URLSearchParams({ pecas: produtos.map(produto => produto.id + ':1').join(',') });
  return './simulador.html?' + parametros;
}
