function conferirPares(primeiras, segundas, combinar, mensagem) {
  for (const primeira of primeiras) {
    for (const segunda of segundas) {
      if (!combinar(primeira, segunda)) return mensagem(primeira, segunda);
    }
  }
}

export function encaixeCompativel(cpu, placa) {
  return cpu.compat.socket === placa.compat.socket;
}

export function memoriaCompativel(ram, placa) {
  return ram.compat.ddr === placa.compat.ddr;
}

export function gabineteCompativel(placa, gabinete) {
  return (gabinete.compat.formatosAceitos ?? [gabinete.compat.formato]).includes(placa.compat.formato);
}

export function verificarCompatibilidade(itens) {
  const pecas = categoria => itens.filter(({ produto }) => produto.categoria === categoria).map(({ produto }) => produto);
  const cpus = pecas('cpu');
  const placas = pecas('placa-mae');
  const memorias = pecas('ram');
  const gabinetes = pecas('gabinete');
  const fontes = pecas('fonte');
  const tdp = itens.reduce((soma, { produto, quantidade }) => soma + (produto.compat?.tdp ?? 0) * quantidade, 0);

  function resultado(titulo, pronto, erro, sucesso, pendencia) {
    if (!pronto) return { titulo, estado: 'pendente', mensagem: pendencia };
    if (erro) return { titulo, estado: 'aviso', mensagem: erro };
    return { titulo, estado: 'ok', mensagem: sucesso };
  }

  const socket = conferirPares(cpus, placas,
    encaixeCompativel,
    (cpu, placa) => cpu.nome + ' usa o encaixe ' + cpu.compat.socket + '. A placa ' + placa.nome
      + ' usa ' + placa.compat.socket + '. Escolha peças com o mesmo encaixe.');
  const memoria = conferirPares(memorias, placas,
    memoriaCompativel,
    (ram, placa) => ram.nome + ' usa ' + ram.compat.ddr + '. A placa ' + placa.nome
      + ' aceita ' + placa.compat.ddr + '.');
  const formato = conferirPares(placas, gabinetes,
    gabineteCompativel,
    (placa, gabinete) => 'A placa ' + placa.nome + ' é ' + placa.compat.formato
      + ' e não cabe no gabinete ' + gabinete.nome + '.');
  const fonteFraca = fontes.find(fonte => fonte.compat.potencia < tdp);

  return [
    resultado('Encaixe do processador', cpus.length && placas.length, socket,
      'O processador e a placa-mãe usam o mesmo encaixe.',
      'Adicione processador e placa-mãe para conferir o encaixe.'),
    resultado('Tipo de memória', memorias.length && placas.length, memoria,
      'A placa-mãe aceita o tipo de memória selecionado.',
      'Adicione memória e placa-mãe para conferir o tipo DDR.'),
    resultado('Espaço no gabinete', placas.length && gabinetes.length, formato,
      'O gabinete comporta o formato da placa-mãe.',
      'Adicione um gabinete e uma placa-mãe para conferir o tamanho.'),
    resultado('Potência da fonte', fontes.length && tdp > 0,
      fonteFraca && 'A fonte ' + fonteFraca.nome + ' fornece ' + fonteFraca.compat.potencia
        + ' W. O processador e a placa de vídeo selecionados somam ' + tdp + ' W.',
      'A fonte cobre os ' + tdp + ' W estimados para processador e placa de vídeo.',
      'Adicione uma fonte e peças com consumo indicado para conferir a potência.'),
  ];
}
