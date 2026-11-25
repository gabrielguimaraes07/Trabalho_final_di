import { carregarEstoque, categorias, mesmoGrupo } from './estoque.js?v=interfaces-4';
import { iniciarGaveta } from './gaveta.js?v=interfaces-16';
import { iniciarCarrossel } from './carrossel.js?v=1.0-final';
import { iniciarAcessibilidade } from './acessibilidade.js?v=interfaces-11';
import { iniciarCarrinho } from './carrinho.js?v=interfaces-11';
import { iniciarPaginaEstoque } from './pagina-estoque.js?v=interfaces-12';
import { iniciarMontador } from './montador.js?v=interfaces-5';
import { iniciarBuildsProntos } from './configuracoes-prontas.js?v=interfaces-5';
import { iniciarPaginaGlossario } from './glossario.js?v=1.0-final';
import { iniciarAcesso } from './login.js?v=1.0-final';
import { iniciarContato } from './formularios.js?v=1.0-final';
import { iniciarRevelacaoDeTitulos } from './animacoes.js?v=interfaces-11';

import { iniciarNavegacao } from './navegacao.js?v=interfaces-5';

const cabecalho = document.querySelector('.site-header');
if (cabecalho) iniciarNavegacao(cabecalho);

const titulosAnimados = document.querySelectorAll('[data-revelar-titulo]');
if (titulosAnimados.length) iniciarRevelacaoDeTitulos(titulosAnimados);

const buscaRapida = document.querySelector('[data-busca-rapida]');
if (buscaRapida) {
  const raiz = document.documentElement;
  const atualizarAtalho = () => {
    if (raiz.dataset.desativarAtalhoBusca === 'true') buscaRapida.removeAttribute('aria-keyshortcuts');
    else buscaRapida.setAttribute('aria-keyshortcuts', '/');
  };
  new MutationObserver(atualizarAtalho)
    .observe(raiz, { attributes: true, attributeFilter: ['data-desativar-atalho-busca'] });
  atualizarAtalho();

  document.addEventListener('keydown', evento => {
    if (evento.key !== '/' || evento.defaultPrevented || evento.altKey || evento.ctrlKey || evento.metaKey) return;
    if (raiz.dataset.desativarAtalhoBusca === 'true' || document.querySelector('dialog[open]')) return;
    if (evento.target.closest('input, textarea, select, [contenteditable], dialog') || !buscaRapida.getClientRects().length) return;
    evento.preventDefault();
    buscaRapida.focus();
  });
}

const linkConta = document.querySelector('[data-conta]');
if (linkConta) iniciarAcesso(linkConta, document.querySelector('[data-pagina-login]'));

const paginaContato = document.querySelector('[data-pagina-contato]');
if (paginaContato) iniciarContato(paginaContato);

const paginaGlossario = document.querySelector('[data-pagina-glossario]');
if (paginaGlossario) iniciarPaginaGlossario(paginaGlossario);

const botaoCarrinho = document.querySelector('[data-carrinho]');
if (botaoCarrinho) iniciarCarrinho(botaoCarrinho);

const paginaEstoque = document.querySelector('[data-pagina-estoque]');
if (paginaEstoque) iniciarPaginaEstoque(paginaEstoque);

const paginaMontador = document.querySelector('[data-montador]');
if (paginaMontador) iniciarMontador(paginaMontador);

const buildsProntos = document.querySelector('[data-builds-prontos]');
if (buildsProntos) iniciarBuildsProntos(buildsProntos);

const botaoAcessibilidade = document.querySelector('[data-acessibilidade]');
if (botaoAcessibilidade) iniciarAcessibilidade(botaoAcessibilidade);

const carrosselSetups = document.querySelector('#carrossel-setups');
if (carrosselSetups) iniciarCarrossel(carrosselSetups);

const visualizador = document.querySelector('.visualizador');
const secaoExplodida = document.querySelector('#por-dentro');

if (secaoExplodida) {
  const observador = new IntersectionObserver(([entrada]) => {
    if (!entrada.isIntersecting) return;
    observador.disconnect();
    import('./vista-explodida.js?v=interfaces-13')
      .then(({ iniciarVistaExplodida }) => iniciarVistaExplodida(secaoExplodida))
      .catch(() => {});
  }, { rootMargin: '320px 0px' });
  observador.observe(secaoExplodida);
}

if (visualizador) {
  const hero = visualizador.closest('.hero');
  const introducao = hero.querySelector('.hero-copy');
  const areaCena = visualizador.querySelector('.cena-pc-area');
  const cena = visualizador.querySelector('.cena-pc');
  const canvas = cena.querySelector('canvas');
  const imagem = cena.querySelector('img');
  const rotulo = cena.querySelector('#rotulo-peca');
  const pausa = visualizador.querySelector('#pausar-giro');
  const instrucao = visualizador.querySelector('#instrucao-pc');
  const botoes = new Map([...cena.querySelectorAll('.hotspot')].map(botao => [botao.dataset.categoria, botao]));
  const acionadores = visualizador.querySelectorAll('button[data-categoria]');
  const painel = document.querySelector('#gaveta-estoque');
  let categoriaDestacada;
  let contagem;
  let cena3D;

  function atualizarInstrucao() {
    instrucao.textContent = painel.open
      ? 'Feche o catálogo pra voltar ao gabinete.'
      : cena3D ? 'Arraste o PC e escolha uma peça.' : 'Escolha uma peça pra ver as opções.';
  }

  function enquadrarCena() {
    if (!painel.open) return;
    const origem = areaCena.getBoundingClientRect();
    if (!origem.width) return;

    const margem = 16;
    const larguraTela = document.documentElement.clientWidth;
    const gavetaEmbaixo = painel.offsetWidth >= larguraTela - 1;
    const direita = larguraTela - (gavetaEmbaixo ? 0 : painel.offsetWidth) - margem;
    const fundo = innerHeight - (gavetaEmbaixo ? painel.offsetHeight : 0) - margem;
    const topo = Math.max(0, cabecalho?.getBoundingClientRect().bottom ?? 0) + margem;
    const espacoIntroducao = direita - Math.min(400, origem.width) - margem - introducao.getBoundingClientRect().left;
    const cabeAoLado = !gavetaEmbaixo && espacoIntroducao >= 280;
    if (cabeAoLado) introducao.style.setProperty('max-inline-size', espacoIntroducao + 'px');
    else introducao.style.removeProperty('max-inline-size');
    const limitesIntroducao = introducao.getBoundingClientRect();
    const esquerda = cabeAoLado ? limitesIntroducao.right + margem : margem;
    const tamanho = Math.max(1, Math.min(origem.width, direita - esquerda, fundo - topo));
    const x = Math.max(esquerda, Math.min(origem.left, direita - tamanho));
    const y = Math.max(topo, Math.min(origem.top + (origem.height - tamanho) / 2, fundo - tamanho));
    const cobreIntroducao = x < limitesIntroducao.right && x + tamanho > limitesIntroducao.left
      && y < limitesIntroducao.bottom && y + tamanho > limitesIntroducao.top;
    introducao.toggleAttribute('data-coberta', cobreIntroducao);
    cena.style.setProperty('--cena-x', x - origem.left + 'px');
    cena.style.setProperty('--cena-y', y - origem.top + 'px');
    cena.style.setProperty('--cena-escala', tamanho / origem.width);
  }

  window.addEventListener('resize', enquadrarCena);
  const observarArea = new ResizeObserver(enquadrarCena);
  observarArea.observe(areaCena);

  const abrir = iniciarGaveta(painel, categoria => {
    cena.toggleAttribute('data-aproximado', !!categoria);
    for (const botao of acionadores) {
      botao.setAttribute('aria-expanded', String(botao.dataset.categoria === categoria));
    }
    for (const [chave, botao] of botoes) {
      botao.toggleAttribute('data-selecionado', chave === categoria);
    }

    if (categoria) {
      const ponto = botoes.get(categoria);
      imagem.style.setProperty('--zoom-x', ponto.style.getPropertyValue('--x'));
      imagem.style.setProperty('--zoom-y', ponto.style.getPropertyValue('--y'));
      enquadrarCena();
    } else {
      introducao.removeAttribute('data-coberta');
      introducao.style.removeProperty('max-inline-size');
      for (const propriedade of ['--cena-x', '--cena-y', '--cena-escala']) {
        cena.style.removeProperty(propriedade);
      }
    }

    cena3D?.aproximar(categoria);
    atualizarInstrucao();
  });

  function destacar(categoria) {
    if (categoriaDestacada) botoes.get(categoriaDestacada).removeAttribute('data-destaque');
    categoriaDestacada = categoria;
    rotulo.hidden = !categoria;
    cena3D?.marcar();
    if (!categoria) return;

    botoes.get(categoria).setAttribute('data-destaque', '');
    const total = contagem?.get(categoria);
    const opcoes = total === undefined ? '' : ' — ver ' + total + (total === 1 ? ' opção' : ' opções');
    rotulo.textContent = categorias[categoria].nome + opcoes;
  }

  visualizador.addEventListener('click', evento => {
    const botao = evento.target.closest('button[data-categoria]');
    if (botao) abrir(botao.dataset.categoria, botao);
  });

  for (const [categoria, botao] of botoes) {
    botao.addEventListener('pointerenter', () => destacar(categoria));
    botao.addEventListener('pointerleave', () => destacar());
    botao.addEventListener('focus', () => destacar(categoria));
    botao.addEventListener('blur', () => destacar());
  }

  carregarEstoque().then(produtos => {
    contagem = new Map();
    for (const categoria of botoes.keys()) {
      contagem.set(categoria, produtos.filter(produto => mesmoGrupo(produto, categoria)).length);
    }
    if (categoriaDestacada) destacar(categoriaDestacada);
  }).catch(() => {});

  function usarImagem() {
    cena3D = undefined;
    canvas.hidden = true;
    imagem.hidden = false;
    pausa.hidden = true;
    atualizarInstrucao();
    for (const botao of botoes.values()) {
      botao.style.removeProperty('left');
      botao.style.removeProperty('top');
      botao.removeAttribute('data-fora');
    }
  }

  import('./cena3d.js?v=interfaces-16').then(({ iniciarCena }) => {
    cena3D = iniciarCena({ cena, canvas, botoes, destacar, abrir, usarImagem, pausa });
    if (!cena3D) return;
    canvas.hidden = false;
    imagem.hidden = true;
    if (painel.open) cena3D.aproximar(painel.dataset.categoria);
    atualizarInstrucao();
  }).catch(usarImagem);
}

const simulador = document.querySelector('[data-simulador]');
if (simulador) import('./simulador.js?v=interfaces-6').then(({ iniciarSimulador }) => iniciarSimulador(simulador));

const guia = document.querySelector('[data-guia]');
if (guia) import('./guia.js?v=interfaces-6').then(({ iniciarGuia }) => iniciarGuia(guia));

const videoNotebook = document.querySelector('[data-video-notebook]');
if (videoNotebook) {
  const botao = document.querySelector('[data-controle-notebook]');
  const sistema = matchMedia('(prefers-reduced-motion: reduce)');
  const raiz = document.documentElement;
  let pausado = false;
  async function atualizarVideo() {
    const reduzir = sistema.matches || raiz.dataset.reduzirMovimento === 'true';
    if (pausado || reduzir || document.hidden) videoNotebook.pause();
    else await videoNotebook.play().catch(() => {});
    botao.hidden = reduzir;
    botao.textContent = videoNotebook.paused ? 'Reproduzir vídeo da tela' : 'Pausar vídeo da tela';
  }
  botao.addEventListener('click', () => {
    pausado = !videoNotebook.paused;
    atualizarVideo();
  });
  sistema.addEventListener('change', atualizarVideo);
  document.addEventListener('visibilitychange', atualizarVideo);
  new MutationObserver(atualizarVideo)
    .observe(raiz, { attributes: true, attributeFilter: ['data-reduzir-movimento'] });
  atualizarVideo();
}
