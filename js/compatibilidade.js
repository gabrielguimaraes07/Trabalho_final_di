export const categoriasMultiplas = new Set(['ram', 'ssd-sata', 'ssd-nvme', 'hd', 'ventoinhas']);
export const perifericos = new Set(['monitor', 'teclado', 'mouse', 'mousepad', 'headset', 'caixas-som', 'webcam']);
export const rotulosCompatibilidade = {
  ok: 'Compatível', aviso: 'Atenção', erro: 'Incompatível', pendente: 'A verificar',
};

export function estimarConsumo(itens) {
  if (!itens.some(({ produto }) => ['cpu', 'gpu'].includes(produto.categoria))) return null;
  return Math.ceil(45 + itens.reduce((soma, { produto, quantidade }) => {
    const { tdp = 0, sata, nvme } = produto.compat;
    const watts = produto.categoria === 'cpu' ? tdp * 1.35 : tdp || (['ssd-sata', 'hd'].includes(produto.categoria) && sata ? 10 : nvme && produto.categoria === 'ssd-nvme' ? 6 : 0);
    return soma + watts * quantidade;
  }, 0));
}

function acomodarVentoinhas(posicoes, pequenas, grandes) {
  if (!pequenas && !grandes) return true;
  if (!posicoes.length) return false;
  const [[capacidade120, capacidade140], ...resto] = posicoes;
  return acomodarVentoinhas(resto, Math.max(0, pequenas - capacidade120), grandes)
    || acomodarVentoinhas(resto, pequenas, Math.max(0, grandes - capacidade140));
}

export function verificarCompatibilidade(itens) {
  const selecionar = categoria => itens.filter(item => item.produto.categoria === categoria);
  const pegar = categoria => selecionar(categoria)[0]?.produto.compat;
  const soma = (linhas, campo) => linhas.reduce((n, { produto, quantidade }) => n + (produto.compat[campo] ?? 0) * quantidade, 0);
  const cpu = pegar('cpu');
  const placa = pegar('placa-mae');
  const gabinete = pegar('gabinete');
  const psu = pegar('fonte');
  const gpu = pegar('gpu');
  const monitor = pegar('monitor');
  const air = pegar('air-cooler');
  const agua = pegar('water-cooler');
  const memoria = selecionar('ram');
  const fans = selecionar('ventoinhas');
  const slots = soma(memoria, 'slots');
  const ram = soma(memoria, 'gb');
  const sata = soma(itens.filter(({ produto }) => ['ssd-sata', 'hd'].includes(produto.categoria)), 'sata');
  const nvme = soma(selecionar('ssd-nvme'), 'nvme');
  const baias25 = soma(selecionar('ssd-sata'), 'baia25');
  const baias35 = soma(selecionar('hd'), 'baia35');
  const pequenas = fans.reduce((n, item) => n + (item.produto.compat.mm === 120 ? item.quantidade : 0), 0);
  const grandes = fans.reduce((n, item) => n + (item.produto.compat.mm === 140 ? item.quantidade : 0), 0);
  const radiadores = agua && gabinete
    ? Object.keys(gabinete.radiadores).filter(posicao => gabinete.radiadores[posicao].includes(agua.radiador))
    : [];
  const posicoes = gabinete ? Object.entries(gabinete.fans) : [];
  const encaixes = agua ? radiadores : [''];
  const consumo = estimarConsumo(itens);
  const recomendacao = Math.max(gpu?.recomenda ?? 0, Math.ceil((consumo ?? 0) / .8));
  const saidas = gpu?.video ?? (cpu?.video ? placa?.video : []);
  const alimentacaoGpu = (gpu?.pcie16 && psu?.pcie16) || (psu?.pcie8 >= (gpu?.pcie8 ?? 0)
    && psu?.cabosPcie >= (gpu?.cabosPcie ?? 0));
  const resultado = (titulo, estado, mensagem) => ({ titulo, estado, mensagem });
  function conferir(titulo, pronto, compativel, certo, errado) {
    if (!pronto) return resultado(titulo, 'pendente', 'Selecione as peças relacionadas para conferir.');
    return resultado(titulo, compativel ? 'ok' : 'erro', compativel ? certo : errado);
  }
  const regras = [
    conferir('Socket', cpu && placa, cpu?.socket === placa?.socket, 'Processador e placa-mãe usam o mesmo socket.',
      'Escolha uma placa-mãe ' + (cpu?.socket ?? '') + ' ou troque o processador. Confira também a lista de CPUs e a versão de BIOS.'),
    conferir('Memória e slots', placa && memoria.length, memoria.every(({ produto }) => produto.compat.ddr === placa?.ddr)
        && slots <= placa?.slotsRam && ram <= placa?.limiteRam,
      slots + ' de ' + (placa?.slotsRam ?? '') + ' slots ocupados.',
      'Use ' + (placa?.ddr ?? '') + ' e reduza a quantidade para caber nos slots e na capacidade da placa.'),
    conferir('Formato da placa-mãe', gabinete && placa, gabinete?.formatosAceitos.includes(placa?.formato),
      'O gabinete aceita o formato da placa.', 'Troque por um gabinete que aceite ' + (placa?.formato ?? '') + '.'),
    conferir('Espaço para a placa de vídeo', gabinete && gpu, gpu?.mm <= gabinete?.gpu,
      'Comprimento dentro da folga nominal do gabinete.', 'Escolha uma GPU de até ' + (gabinete?.gpu ?? '') + ' mm ou um gabinete maior.'),
    conferir('Fonte e conectores', psu && cpu && placa, psu?.potencia >= recomendacao
      && psu.eps >= (placa?.eps ?? 0) && alimentacaoGpu && psu.sata >= sata
      && (!gabinete || gabinete.fontes.includes(psu.formato)),
      'Potência e conectores atendem aos requisitos informados.',
      'Confira formato, EPS, SATA e cabos PCIe. A referência de potência é de ' + recomendacao + ' W.'),
    conferir('Cooler do processador', cpu && gabinete && (air || agua),
      !(air && agua) && (air ?? agua)?.sockets.includes(cpu?.socket)
        && (air ? air.altura <= gabinete?.altura : radiadores.length > 0),
      'Socket e folga nominal atendidos.', 'Use um único cooler com suporte ao socket e espaço para a torre ou radiador.'),
    conferir('Portas de armazenamento', placa && (sata || nvme), sata <= placa?.sata && nvme <= placa?.nvme,
      sata + ' portas SATA e ' + nvme + ' slots M.2 em uso.', 'Reduza as unidades ou escolha uma placa com mais portas SATA ou slots M.2.'),
    conferir('Baias de armazenamento', gabinete && sata, baias25 <= gabinete?.baias25 && baias35 <= gabinete?.baias35,
      'As unidades SATA cabem nas baias dedicadas.', 'Reduza as unidades de 2,5 ou 3,5 polegadas ou escolha um gabinete com mais baias.'),
    conferir('Ventoinhas e montagem', gabinete && fans.length, encaixes.some(radiador =>
      acomodarVentoinhas(posicoes.filter(([posicao]) => posicao !== radiador).map(([, capacidades]) => capacidades), pequenas, grandes)),
      'Diâmetros e quantidades cabem nas posições disponíveis.',
      'Reduza as ventoinhas ou ajuste seu tamanho. O radiador reserva uma posição do gabinete.'),
    conferir('Conexão do monitor', monitor && (gpu || (cpu && placa)), monitor?.video.some(entrada => saidas?.includes(entrada)),
      'Há uma conexão em comum. Confira cabo, resolução e frequência.', 'Use um monitor com entrada correspondente ou uma placa de vídeo dedicada.'),
  ];
  if (cpu && !cpu.video && !gpu) regras.push(resultado('Saída de vídeo', 'aviso', 'Este processador precisa de uma placa de vídeo dedicada.'));
  if (agua && gpu && gabinete && radiadores.includes('frente') && gpu.mm + agua.espessura > gabinete.gpu) {
    regras.push(resultado('Radiador frontal', 'aviso', 'A espessura do conjunto pode reduzir a folga. Confira outra posição e o desenho do gabinete.'));
  }
  if (agua && radiadores.length) regras.push(resultado('Folga do radiador', 'aviso', 'Confirme a folga da RAM, dos dissipadores e do radiador no manual do gabinete.'));
  if (placa && fans.length && pequenas + grandes + (gabinete?.incluidos ?? 0) > placa.fans) {
    regras.push(resultado('Conectores de ventoinha', 'aviso', 'Avalie um hub ou encadeamento PWM e respeite a corrente máxima por conector.'));
  }
  if (placa && selecionar('ssd-nvme').some(({ produto }) => produto.compat.pcie >
      (placa.pcieNvme ?? (placa.socket === 'AM4' && (cpu?.pcie === 3 || nvme > 1) ? 3 : 4)))) {
    regras.push(resultado('Velocidade do SSD', 'aviso', 'Um SSD pode operar na geração PCIe inferior do slot disponível.'));
  }
  return regras;
}
