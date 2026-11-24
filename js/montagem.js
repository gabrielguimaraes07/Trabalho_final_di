import { categoriasMultiplas, perifericos, verificarCompatibilidade } from './compatibilidade.js?v=interfaces-4';

const chave = 'ggtech-montagem';
const chaveSalvas = 'ggtech-montagens-salvas';
export const limiteMontagensSalvas = 12;
export const eventoMontagem = 'ggtech:montagem';

function ler(chave, reserva) {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? reserva;
  } catch {
    return reserva;
  }
}

function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

export function normalizarMontagem(linhas, catalogo) {
  if (!Array.isArray(linhas)) return [];
  const porId = new Map(catalogo.map(produto => [produto.id, produto]));
  const limpas = [];
  for (const linha of linhas.slice(0, catalogo.length)) {
    const produto = porId.get(linha?.id);
    if (!produto || limpas.some(item => item.id === produto.id)) continue;
    if (!categoriasMultiplas.has(produto.categoria)
        && limpas.some(item => porId.get(item.id).categoria === produto.categoria)) continue;
    const quantidade = categoriasMultiplas.has(produto.categoria)
      ? Math.min(20, Math.max(1, Math.trunc(Number(linha.quantidade) || 1))) : 1;
    const preco = typeof linha.preco === 'number' && linha.preco >= 0 && linha.preco <= 1000000
      ? Math.round(linha.preco * 100) / 100 : undefined;
    limpas.push({ id: produto.id, quantidade, preco });
  }
  return limpas;
}

export function itensDaMontagem(linhas, catalogo) {
  return normalizarMontagem(linhas, catalogo)
    .map(linha => ({ ...linha, produto: catalogo.find(produto => produto.id === linha.id) }));
}

export function lerMontagem(catalogo) {
  return normalizarMontagem(ler(chave, []), catalogo);
}

export function gravarMontagem(linhas) {
  const ok = gravar(chave, linhas);
  window.dispatchEvent(new Event(eventoMontagem));
  return ok;
}

export function incluirPeca(linhas, produto, catalogo) {
  const atuais = itensDaMontagem(linhas, catalogo);
  const existente = atuais.find(item => item.id === produto.id);
  if (existente && categoriasMultiplas.has(produto.categoria)) {
    return normalizarMontagem(atuais.map(item => item.id === produto.id
      ? { ...item, quantidade: item.quantidade + 1 } : item), catalogo);
  }
  if (existente) return normalizarMontagem(atuais, catalogo);
  const eCooler = categoria => ['air-cooler', 'water-cooler'].includes(categoria);
  const mantidos = atuais.filter(item => categoriasMultiplas.has(produto.categoria)
    || (item.produto.categoria !== produto.categoria && !(eCooler(produto.categoria) && eCooler(item.produto.categoria))));
  return normalizarMontagem([...mantidos, { id: produto.id, quantidade: 1 }], catalogo);
}

export function mesmaMontagem(a, b) {
  return a.length === b.length && a.every(peca => b.some(outra =>
    peca.id === outra.id && peca.quantidade === outra.quantidade && peca.preco === outra.preco));
}

export function conflitosDaPeca(linhas, produto, catalogo) {
  const erros = itens => verificarCompatibilidade(itensDaMontagem(itens, catalogo))
    .filter(regra => regra.estado === 'erro');
  const anteriores = new Set(erros(linhas).map(regra => regra.titulo));
  const relacionadas = {
    cpu: ['Socket', 'Fonte e conectores', 'Cooler do processador', 'Conexão do monitor'],
    'placa-mae': ['Socket', 'Memória e slots', 'Formato da placa-mãe', 'Fonte e conectores', 'Portas de armazenamento', 'Conexão do monitor'],
    gpu: ['Espaço para a placa de vídeo', 'Fonte e conectores', 'Conexão do monitor'],
    ram: ['Memória e slots'],
    fonte: ['Fonte e conectores'],
    gabinete: ['Formato da placa-mãe', 'Espaço para a placa de vídeo', 'Fonte e conectores', 'Cooler do processador',
      'Baias de armazenamento', 'Ventoinhas e montagem'],
    'ssd-sata': ['Portas de armazenamento', 'Baias de armazenamento', 'Fonte e conectores'],
    'ssd-nvme': ['Portas de armazenamento'],
    hd: ['Portas de armazenamento', 'Baias de armazenamento', 'Fonte e conectores'],
    'air-cooler': ['Cooler do processador'],
    'water-cooler': ['Cooler do processador', 'Ventoinhas e montagem'],
    ventoinhas: ['Ventoinhas e montagem'],
    monitor: ['Conexão do monitor'],
  };
  return erros(incluirPeca(linhas, produto, catalogo)).filter(({ titulo }) =>
    relacionadas[produto.categoria]?.includes(titulo) || !anteriores.has(titulo));
}

export function lerSalvas(catalogo) {
  const registros = ler(chaveSalvas, []);
  if (!Array.isArray(registros)) return [];
  return registros.filter(item => item && typeof item.nome === 'string')
    .slice(0, limiteMontagensSalvas).map(item => ({ nome: item.nome.slice(0, 60), linhas: normalizarMontagem(item.linhas, catalogo) }));
}

export function salvarComNome(nome, linhas, catalogo) {
  const registros = lerSalvas(catalogo);
  const atualizadas = registros.filter(item => item.nome !== nome);
  if (atualizadas.length >= limiteMontagensSalvas) return false;
  return gravar(chaveSalvas, [{ nome, linhas }, ...atualizadas]);
}

export function excluirSalva(nome, catalogo) {
  return gravar(chaveSalvas, lerSalvas(catalogo).filter(item => item.nome !== nome));
}

export function separarItens(itens) {
  return {
    internos: itens.filter(({ produto }) => !perifericos.has(produto.categoria)),
    acessorios: itens.filter(({ produto }) => perifericos.has(produto.categoria)),
  };
}
