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
