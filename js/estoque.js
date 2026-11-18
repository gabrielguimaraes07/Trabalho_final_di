export const categorias = {
  gpu: {
    titulo: 'Placas de vídeo',
    nome: 'Placa de vídeo',
    descricao: 'A placa de vídeo desenha as imagens dos jogos e dos programas na tela.',
  },
  cpu: {
    titulo: 'Processadores',
    nome: 'Processador',
    descricao: 'O processador executa as instruções dos programas e coordena as outras peças.',
  },
  ram: {
    titulo: 'Memórias RAM',
    nome: 'Memória RAM',
    descricao: 'A memória RAM guarda temporariamente o que os programas estão usando.',
  },
  fonte: {
    titulo: 'Fontes',
    nome: 'Fonte',
    descricao: 'A fonte distribui a energia da tomada para as peças do computador.',
  },
  'placa-mae': {
    titulo: 'Placas-mãe',
    nome: 'Placa-mãe',
    descricao: 'A placa-mãe conecta as peças e permite que elas troquem informações.',
  },
  cooler: {
    titulo: 'Coolers',
    nome: 'Cooler',
    descricao: 'O cooler retira o calor do processador para manter a temperatura sob controle.',
  },
  armazenamento: {
    titulo: 'Armazenamento',
    nome: 'SSD',
    descricao: 'O SSD guarda jogos, programas e arquivos mesmo quando o computador está desligado.',
  },
  ventoinhas: {
    titulo: 'Ventoinhas',
    nome: 'Ventoinhas do gabinete',
    descricao: 'As ventoinhas puxam ar fresco para o gabinete e ajudam a expulsar o ar quente.',
  },
  gabinete: {
    titulo: 'Gabinetes',
    nome: 'Gabinete',
    descricao: 'O gabinete protege as peças e organiza o espaço para elas e para o ar circular.',
  },
};

export const precoEmReais = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

let catalogo;

export function carregarEstoque() {
  catalogo ??= fetch(new URL('../data/produtos.json', import.meta.url))
    .then(resposta => {
      if (!resposta.ok) throw new Error('Estoque indisponível');
      return resposta.json();
    })
    .catch(erro => {
      catalogo = undefined;
      throw erro;
    });
  return catalogo;
}

export function normalizarBusca(texto) {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}
