import { carregarEstoque, categorias, mostrarPreco, ordemCatalogo, resumoEspecificacoes, rotuloCotacao } from './estoque.js?v=interfaces-4';

const dicas = {
  cpu: 'Compare núcleos e a geração. Confira o socket, a versão da BIOS e se o modelo tem vídeo integrado.',
  'placa-mae': 'O chipset determina parte das conexões. Confira o formato, os slots DDR, as portas SATA e M.2 e a lista de processadores.',
  gpu: 'Compare VRAM, saídas de vídeo e desempenho no seu uso. Meça o espaço do gabinete e confirme os cabos da fonte.',
  ram: 'Capacidade ajuda a manter mais programas abertos. Compare kits pela quantidade de módulos e confira DDR4 ou DDR5.',
  'ssd-sata': 'Compare capacidade e resistência de gravação. Reserve porta SATA, cabo de energia e uma baia livre.',
  'ssd-nvme': 'Compare capacidade, formato M.2 e geração PCIe. Um SSD pode funcionar com velocidade menor em um slot mais antigo.',
  hd: 'Boa opção para guardar muitos arquivos. Compare capacidade e ruído e reserve uma baia de 3,5 polegadas.',
  fonte: 'Confira potência, formato, conectores e a recomendação da placa de vídeo. Certificação de eficiência e potência medem coisas diferentes.',
  gabinete: 'Verifique o formato da placa, a altura do cooler e a folga da GPU. Radiadores podem ocupar parte do espaço.',
  ventoinhas: 'Compare diâmetro, conector e pressão do ar. A quantidade útil depende de posição, tamanho e conectores disponíveis.',
  'water-cooler': 'Confira o socket e as posições de radiador. A espessura da bomba, do radiador e das ventoinhas pode limitar a montagem.',
  'air-cooler': 'Compare a altura da torre e a folga dos módulos de RAM. Confira o suporte de montagem na embalagem.',
  monitor: 'Compare resolução e frequência conforme o uso. Cabo, placa de vídeo e entrada precisam suportar o modo desejado.',
  teclado: 'Compare tamanho, leiaute e conexão. Para digitar em português, procure a opção ABNT2.',
  mouse: 'Priorize conforto e peso. Sensor e botões importam de forma diferente para jogos e para trabalho.',
  mousepad: 'Confira se o tamanho cabe na mesa. Superfícies de tecido costumam oferecer controle e conforto.',
  headset: 'Compare conforto, tipo de conector e microfone. O mesmo headset pode ter versões USB e sem fio.',
  'caixas-som': 'Confira entrada de áudio, alimentação e espaço. Potência RMS indica uma referência de potência contínua.',
  webcam: 'Compare resolução, taxa de quadros e foco. A iluminação muda bastante a qualidade em chamadas.',
};

function texto(tag, conteudo) {
  const elemento = document.createElement(tag);
  elemento.textContent = conteudo;
  return elemento;
}

export async function iniciarGuia(raiz) {
  const lista = raiz.querySelector('#guia-lista');
  const status = raiz.querySelector('#guia-status');
  try {
    const catalogo = await carregarEstoque();
    lista.replaceChildren(...ordemCatalogo.map(id => {
      const familia = categorias[id];
      const bloco = document.createElement('details');
      bloco.id = id;
      bloco.open = location.hash === '#' + id;
      bloco.append(texto('summary', familia.nome), texto('p', familia.descricao), texto('p', dicas[id]));
      const exemplos = document.createElement('ul');
      exemplos.className = 'guia-exemplos';
      for (const produto of catalogo.filter(item => item.categoria === id)) {
        const linha = document.createElement('li');
        if (produto.imagem) {
          const foto = document.createElement('img');
          foto.src = produto.imagem;
          foto.alt = produto.alt;
          foto.loading = 'lazy';
          foto.decoding = 'async';
          foto.width = 720;
          foto.height = 540;
          linha.append(foto);
        }
        const preco = texto('strong', mostrarPreco(produto.preco));
        const cotacao = texto('a', rotuloCotacao(produto));
        cotacao.href = produto.fontePreco;
        cotacao.setAttribute('aria-label', rotuloCotacao(produto) + ' de ' + produto.nome);
        const ficha = texto('a', 'Ficha do fabricante');
        ficha.href = produto.fonte;
        ficha.setAttribute('aria-label', 'Ficha do fabricante de ' + produto.nome);
        const valores = document.createElement('div');
        valores.className = 'guia-preco';
        valores.append(preco, cotacao);
        const dados = document.createElement('div');
        dados.className = 'guia-produto-dados';
        dados.append(texto('h3', produto.nome), valores, texto('p', produto.descricao),
          texto('p', resumoEspecificacoes(produto)), ficha);
        linha.append(dados);
        exemplos.append(linha);
      }
      const catalogoLink = texto('a', 'Explorar esta categoria no catálogo');
      catalogoLink.href = './estoque.html?cat=' + encodeURIComponent(id);
      bloco.append(exemplos, catalogoLink);
      return bloco;
    }));
    status.hidden = true;
  } catch {
    status.textContent = 'O guia não carregou. Recarregue a página para tentar novamente.';
  }
}
