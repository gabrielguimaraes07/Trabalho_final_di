import { encaixeCompativel, gabineteCompativel, memoriaCompativel, verificarCompatibilidade } from './compatibilidade.js';
import { carregarEstoque } from './estoque.js';

export const usos = {
  jogar: {
    titulo: 'Seu PC para jogar',
    explicacao: 'Para jogos, a sugestão dá mais peso à placa de vídeo.',
    pesos: [2, 5, .45, .003],
  },
  estudar: {
    titulo: 'Seu PC para estudar',
    explicacao: 'Para estudar, a sugestão busca uma base para aulas, navegação e atividades.',
    pesos: [3, 0, 1.6, .009],
    limites: [4, 0, 16, 500],
  },
  trabalhar: {
    titulo: 'Seu PC para trabalhar',
    explicacao: 'Para trabalhar, a sugestão dá mais peso ao processador e à memória para usar vários programas.',
    pesos: [4, .5, 1.1, .005],
    limites: [8, 8, 32, 1000],
  },
  criar: {
    titulo: 'Seu PC para criar conteúdo',
    explicacao: 'Para criação de conteúdo, a sugestão dá mais peso à memória, ao processador e ao espaço para arquivos.',
    pesos: [4, 2, 1.1, .008],
  },
};

export const prioridades = ['silencio', 'desempenho', 'rgb'];
const essenciais = ['cpu', 'placa-mae', 'ram', 'gabinete', 'gpu', 'fonte', 'cooler', 'armazenamento'];
let buildsProntos;

const centavos = valor => Math.round(valor * 100);

export function somarPrecos(produtos) {
  return produtos.reduce((total, produto) => total + centavos(produto.preco), 0) / 100;
}

function coolerCompativel(cpu, cooler) {
  return cooler.compat.sockets.includes(cpu.compat.socket) && cooler.compat.dissipacao >= cpu.compat.tdp;
}

function completo(produtos) {
  const porCategoria = new Map(produtos.map(produto => [produto.categoria, produto]));
  return essenciais.every(categoria => porCategoria.has(categoria))
    && verificarCompatibilidade(produtos.map(produto => ({ produto, quantidade: 1 }))).every(regra => regra.estado === 'ok')
    && coolerCompativel(porCategoria.get('cpu'), porCategoria.get('cooler'));
}

export function carregarBuildsProntos() {
  buildsProntos ??= Promise.all([
    carregarEstoque(),
    fetch(new URL('../data/builds.json', import.meta.url)).then(resposta => {
      if (!resposta.ok) throw new Error('Configurações indisponíveis');
      return resposta.json();
    }),
  ]).then(([catalogo, builds]) => {
    const porId = new Map(catalogo.map(produto => [produto.id, produto]));
    return builds.flatMap(build => {
      const produtos = build.produtos.map(id => porId.get(id));
      return produtos.every(produto => produto?.estoque > 0) && completo(produtos)
        ? [{ ...build, produtos, preco: somarPrecos(produtos) }]
        : [];
    });
  }).catch(erro => {
    buildsProntos = undefined;
    throw erro;
  });
  return buildsProntos;
}

function capacidade(produto) {
  const capacidade = produto.specs.Capacidade ?? '';
  const numeros = capacidade.match(/\d+/g) ?? [];
  return numeros.reduce((valor, numero) => valor * Number(numero), capacidade.includes('TB') ? 1000 : 1);
}

export function sugerirConfiguracao(catalogo, { uso, prioridade, orcamento }) {
  const perfil = usos[uso];
  const limite = centavos(orcamento);
  const disponiveis = catalogo.filter(produto => produto.estoque > 0);
  const porCategoria = new Map(essenciais.map(categoria => [
    categoria, disponiveis.filter(produto => produto.categoria === categoria),
  ]));
  const rgb = disponiveis.filter(produto => produto.categoria === 'ventoinhas' && produto.specs.Iluminação === 'RGB')
    .sort((a, b) => a.preco - b.preco)[0];
  const capacidades = new Map(disponiveis.filter(produto => produto.specs.Capacidade)
    .map(produto => [produto.id, capacidade(produto)]));
  const selecionados = {};
  const regras = {
    'placa-mae': placa => encaixeCompativel(selecionados.cpu, placa),
    ram: ram => memoriaCompativel(ram, selecionados['placa-mae']),
    gabinete: gabinete => gabineteCompativel(selecionados['placa-mae'], gabinete),
    fonte: fonte => fonte.compat.potencia >= selecionados.cpu.compat.tdp + selecionados.gpu.compat.tdp,
    cooler: cooler => coolerCompativel(selecionados.cpu, cooler),
  };
  let menorPreco = Infinity;
  let melhor;

  function avaliar(total) {
    menorPreco = Math.min(menorPreco, total);
    if (total > limite) return;

    const { cpu, gpu, ram, armazenamento, cooler, gabinete } = selecionados;
    const vidro = gabinete.specs.Lateral === 'Vidro';
    const incluirRGB = prioridade === 'rgb' && vidro && rgb && total + centavos(rgb.preco) <= limite;
    const valores = [Number(cpu.specs.Núcleos), parseInt(gpu.specs.VRAM, 10), capacidades.get(ram.id), capacidades.get(armazenamento.id)];
    let pontuacao = valores.reduce((soma, valor, indice) =>
      soma + Math.min(valor, perfil.limites?.[indice] ?? Infinity) * perfil.pesos[indice], 0);

    if (prioridade === 'silencio') {
      pontuacao -= (cpu.compat.tdp + gpu.compat.tdp) * .07;
      if (cooler.id === 'cooler-polar-labs-sereno-140') pontuacao += 12;
    } else if (prioridade === 'rgb') {
      if (vidro) pontuacao += 4;
      if (incluirRGB) pontuacao += 14;
    } else {
      pontuacao += valores[0] + valores[1] * 1.5 + valores[2] / 8 + valores[3] / 500;
    }

    const preco = incluirRGB ? total + centavos(rgb.preco) : total;
    if (melhor) {
      if (prioridade === 'rgb' && !!incluirRGB !== melhor.rgb) {
        if (!incluirRGB) return;
      } else if (pontuacao < melhor.pontuacao || (pontuacao === melhor.pontuacao && preco >= melhor.preco)) {
        return;
      }
    }
    const produtos = essenciais.map(categoria => selecionados[categoria]);
    if (incluirRGB) produtos.push(rgb);
    melhor = { produtos, preco, pontuacao, rgb: !!incluirRGB };
  }

  function combinar(indice, subtotal) {
    if (subtotal > limite && subtotal >= menorPreco) return;
    if (indice === essenciais.length) {
      avaliar(subtotal);
      return;
    }
    const categoria = essenciais[indice];
    for (const produto of porCategoria.get(categoria)) {
      if (regras[categoria] && !regras[categoria](produto)) continue;
      selecionados[categoria] = produto;
      combinar(indice + 1, subtotal + centavos(produto.preco));
    }
  }

  combinar(0, 0);
  return {
    minimo: Number.isFinite(menorPreco) ? menorPreco / 100 : null,
    configuracao: melhor ? { produtos: melhor.produtos, preco: melhor.preco / 100, rgb: melhor.rgb } : null,
  };
}
