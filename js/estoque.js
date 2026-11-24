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
  catalogo ??= fetch(new URL('../data/produtos.json?v=montagem-3', import.meta.url))
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

const novasCategorias = {
  'ssd-sata': ['SSD SATA', 'Unidade de 2,5 polegadas que usa cabo de dados e energia.'],
  'ssd-nvme': ['SSD NVMe', 'Unidade compacta que usa as pistas PCIe do slot M.2.'],
  hd: ['HD', 'Unidade mecânica para guardar arquivos e cópias locais.'],
  'air-cooler': ['Air cooler', 'Dissipador com ventoinha para resfriar o processador.'],
  'water-cooler': ['Water cooler', 'Sistema com bomba e radiador para resfriar o processador.'],
  monitor: ['Monitor', 'Tela que recebe a imagem do computador.'],
  teclado: ['Teclado', 'Controle para digitar e usar atalhos.'],
  mouse: ['Mouse', 'Controle do ponteiro e das ações na tela.'],
  mousepad: ['Mousepad', 'Superfície que facilita o deslizamento e a leitura do sensor.'],
  headset: ['Headset', 'Fones com microfone para jogos, reuniões e aulas.'],
  'caixas-som': ['Caixas de som', 'Alto-falantes para ouvir o áudio do computador.'],
  webcam: ['Webcam', 'Câmera para chamadas, aulas e gravações.'],
};
for (const [id, [nome, descricao]] of Object.entries(novasCategorias)) {
  categorias[id] = { titulo: nome, nome, descricao };
}

export const grupos3d = {
  armazenamento: ['ssd-sata', 'ssd-nvme', 'hd'],
  cooler: ['air-cooler', 'water-cooler'],
};
export const ordemCatalogo = ['cpu', 'placa-mae', 'gpu', 'ram', 'ssd-sata', 'ssd-nvme', 'hd',
  'fonte', 'gabinete', 'ventoinhas', 'water-cooler', 'air-cooler', ...Object.keys(novasCategorias).slice(5)];

export function mesmoGrupo(produto, categoria) {
  return produto.categoria === categoria || grupos3d[categoria]?.includes(produto.categoria);
}

export function mostrarPreco(valor) {
  return Number.isFinite(valor) ? precoEmReais.format(valor) : 'Preço indisponível';
}

export function resumoEspecificacoes(produto, limite) {
  return Object.entries(produto.specs).slice(0, limite).map(([chave, valor]) => {
    if (chave === 'Socket') return 'Socket ' + valor;
    if (chave === 'Núcleos' || chave === 'Threads') return valor + ' ' + chave.toLocaleLowerCase('pt-BR');
    return valor;
  }).join(' · ');
}

export function avisoDeVideo(produto) {
  if (produto.categoria !== 'cpu') return '';
  return produto.compat.video ? 'Tem vídeo integrado.' : 'Precisa de uma placa de vídeo dedicada.';
}

export function rotuloCotacao(produto) {
  return produto.tipoPreco === 'Histórico'
    ? 'Preço histórico' : produto.tipoPreco === 'Comparador'
      ? 'Preço de referência' : 'Preço anunciado';
}

export function somarItens(itens) {
  const conhecidos = itens.filter(({ produto, preco }) => Number.isFinite(preco ?? produto.preco));
  const valor = conhecidos.reduce((soma, { produto, quantidade, preco }) =>
    soma + Math.round((preco ?? produto.preco) * 100) * quantidade, 0) / 100;
  return { valor, faltam: itens.length - conhecidos.length };
}

export function mostrarSubtotal({ valor, faltam }) {
  if (!faltam) return precoEmReais.format(valor);
  return valor > 0 ? precoEmReais.format(valor) + ' cotados · ' + faltam + ' sem preço' : 'Sem cotação · ' + faltam + ' sem preço';
}
