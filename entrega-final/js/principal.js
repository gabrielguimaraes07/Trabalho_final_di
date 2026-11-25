import { carregarEstoque, categorias, mesmoGrupo } from './estoque.js?v=interfaces-4';
import { iniciarGaveta } from './gaveta.js?v=interfaces-18';
import { iniciarCarrossel } from './carrossel.js?v=1.0-final';
import { iniciarAcessibilidade } from './acessibilidade.js?v=interfaces-11';
import { iniciarCarrinho } from './carrinho.js?v=inicio-1';
import { iniciarPaginaEstoque } from './pagina-estoque.js?v=lateral-1';
import { iniciarMontador } from './montador.js?v=interfaces-5';
import { iniciarBuildsProntos } from './configuracoes-prontas.js?v=inicio-1';
import { iniciarPaginaGlossario } from './glossario.js?v=lateral-1';
import { iniciarAcesso } from './login.js?v=1.0-final';
import { iniciarContato } from './formularios.js?v=1.0-final';
import { iniciarRevelacaoDeTitulos } from './animacoes.js?v=interfaces-11';

import { iniciarNavegacao } from './navegacao.js?v=lateral-1';

const cabecalho = document.querySelector('.site-header');
if (cabecalho) iniciarNavegacao(cabecalho);

const titulosAnimados = document.querySelectorAll('[data-revelar-titulo]');
if (titulosAnimados.length) iniciarRevelacaoDeTitulos(titulosAnimados);

const buscaRapida = document.querySelector('[data-busca-rapida]');
if (buscaRapida) {
  const raiz = document.documentElement;
  const filtros = buscaRapida.closest('.estoque-filtros-painel');
  const atualizarAtalho = () => {
    if (raiz.dataset.desativarAtalhoBusca === 'true') buscaRapida.removeAttribute('aria-keyshortcuts');
    else buscaRapida.setAttribute('aria-keyshortcuts', '/ Control+K Meta+K');
  };
  new MutationObserver(atualizarAtalho)
    .observe(raiz, { attributes: true, attributeFilter: ['data-desativar-atalho-busca'] });
  atualizarAtalho();

  document.addEventListener('keydown', evento => {
    const modificador = evento.ctrlKey || evento.metaKey;
    const atalho = modificador ? evento.key.toLowerCase() === 'k' : evento.key === '/';
    if (!atalho || evento.defaultPrevented || evento.altKey || evento.repeat) return;
    if (raiz.dataset.desativarAtalhoBusca === 'true' || document.querySelector('dialog[open]')) return;
    if (evento.target.closest('input, textarea, select, [contenteditable], dialog')) return;
    evento.preventDefault();
    if (filtros) filtros.open = true;
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
    import('./vista-explodida.js?v=lateral-1')
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
  const controlesVista = visualizador.querySelector('.visualizador-vista');
  const instrucao = visualizador.querySelector('#instrucao-pc');
  const botoes = new Map([...cena.querySelectorAll('.hotspot')].map(botao => [botao.dataset.categoria, botao]));
  const acionadores = visualizador.querySelectorAll('button[data-categoria]');
  const painel = document.querySelector('#gaveta-estoque');
  const ajustes = painel.querySelector('.gaveta-camera');
  const angulo = painel.querySelector('#gaveta-angulo');
  const zoom = painel.querySelector('#gaveta-zoom');
  const movimentoDoSistema = matchMedia('(prefers-reduced-motion: reduce)');
  const duracaoAproximacao = 980;
  cena.style.setProperty('--duracao-aproximacao', duracaoAproximacao + 'ms');
  const regioesDaImagem = [
    ['ventoinhas', .76, .19, .89, .85],
    ['cooler', .30, .24, .51, .41],
    ['cpu', .31, .41, .47, .47],
    ['ram', .53, .23, .64, .46],
    ['armazenamento', .48, .47, .68, .55],
    ['gpu', .20, .52, .70, .69],
    ['fonte', .20, .69, .51, .86],
    ['placa-mae', .28, .18, .69, .53],
    ['gabinete', .12, .10, .89, .95],
  ];
  let categoriaDestacada;
  let categoriaSelecionada;
  let contagem;
  let cena3D;
  let mostrarCatalogo;
  let tempoCatalogo;

  function atualizarInstrucao() {
    instrucao.textContent = painel.open
      ? 'Feche o catálogo para voltar ao gabinete.'
      : cena3D ? 'Clique numa peça para aproximar. Arraste para girar.' : 'Clique numa peça para aproximar.';
  }

  function atualizarVista() {
    angulo.setAttribute('aria-valuetext', angulo.value + ' graus');
    zoom.setAttribute('aria-valuetext', zoom.value + '%');
    cena3D?.ajustarVista(Number(angulo.value), Number(zoom.value));
  }

  function restaurarVista() {
    angulo.value = angulo.defaultValue;
    zoom.value = zoom.defaultValue;
    atualizarVista();
  }

  angulo.addEventListener('input', atualizarVista);
  zoom.addEventListener('input', atualizarVista);
  painel.querySelector('#gaveta-restaurar-vista').addEventListener('click', restaurarVista);
  controlesVista.addEventListener('click', evento => {
    const acao = evento.target.closest('button')?.dataset.vistaPc;
    if (acao === 'restaurar') cena3D?.restaurar();
    else if (acao) cena3D?.moverVista(0, 0, acao === 'aproximar' ? .87 : 1 / .87);
  });

  function enquadrarCena() {
    if (!painel.open && !mostrarCatalogo) return;
    const origem = areaCena.getBoundingClientRect();
    if (!origem.width) return;

    const margem = 16;
    const larguraTela = document.documentElement.clientWidth;
    const gavetaEmbaixo = painel.offsetWidth >= larguraTela - 1;
    const limitesIntroducao = introducao.getBoundingClientRect();
    const introducaoAoLado = origem.left >= limitesIntroducao.right;
    const topoDaPagina = Math.max(0, cabecalho?.getBoundingClientRect().bottom ?? 0) + margem;
    const topo = introducaoAoLado ? topoDaPagina : Math.max(topoDaPagina, limitesIntroducao.bottom + margem);
    if (gavetaEmbaixo) {
      const inicioGaveta = Math.max(limitesIntroducao.bottom + margem, topo + Math.min(160, origem.width * .4));
      const altura = Math.max(innerHeight * .28, innerHeight - inicioGaveta);
      painel.style.setProperty('--altura-gaveta', altura + 'px');
    } else {
      painel.style.removeProperty('--altura-gaveta');
    }
    const direita = larguraTela - (gavetaEmbaixo ? 0 : painel.offsetWidth) - margem;
    const fundo = innerHeight - (gavetaEmbaixo ? painel.offsetHeight : 0) - margem;
    const lateral = document.querySelector('#nav-painel');
    const borda = matchMedia('(min-width: 60rem)').matches && lateral
      ? lateral.getBoundingClientRect().right + margem : margem;
    const esquerda = introducaoAoLado ? Math.max(borda, limitesIntroducao.right + margem) : borda;
    const tamanho = Math.min(origem.width, direita - esquerda, fundo - topo);
    if (tamanho <= 0) {
      cena.style.setProperty('--cena-x', '0px');
      cena.style.setProperty('--cena-y', '0px');
      cena.style.setProperty('--cena-escala', '1');
      return;
    }
    const x = Math.max(esquerda, Math.min(origem.left, direita - tamanho));
    const y = Math.max(topo, Math.min(origem.top + (origem.height - tamanho) / 2, fundo - tamanho));
    cena.style.setProperty('--cena-x', x - origem.left + 'px');
    cena.style.setProperty('--cena-y', y - origem.top + 'px');
    cena.style.setProperty('--cena-escala', tamanho / origem.width);
  }

  window.addEventListener('resize', enquadrarCena);
  const observarArea = new ResizeObserver(enquadrarCena);
  observarArea.observe(areaCena);

  function atualizarExpansao(categoria) {
    for (const botao of acionadores) {
      botao.setAttribute('aria-expanded', String(botao.dataset.categoria === categoria));
    }
  }

  function revelarCatalogo() {
    if (!mostrarCatalogo) return;
    const mostrar = mostrarCatalogo;
    mostrarCatalogo = undefined;
    mostrar();
    if (painel.open) atualizarExpansao(painel.dataset.categoria);
    atualizarInstrucao();
  }

  function prepararCatalogoComImagem() {
    clearTimeout(tempoCatalogo);
    if (movimentoDoSistema.matches || document.documentElement.dataset.reduzirMovimento === 'true') {
      revelarCatalogo();
      return;
    }
    tempoCatalogo = setTimeout(revelarCatalogo, duracaoAproximacao);
  }

  const abrir = iniciarGaveta(painel, (categoria, revelar) => {
    clearTimeout(tempoCatalogo);
    mostrarCatalogo = revelar;
    categoriaSelecionada = categoria;
    cena.toggleAttribute('data-aproximado', !!categoria);
    for (const [chave, botao] of botoes) {
      botao.toggleAttribute('data-selecionado', chave === categoria);
    }
    destacar(categoria);

    if (categoria) {
      const ponto = botoes.get(categoria);
      imagem.style.setProperty('--zoom-x', ponto.style.getPropertyValue('--x'));
      imagem.style.setProperty('--zoom-y', ponto.style.getPropertyValue('--y'));
      enquadrarCena();
      if (cena3D) cena3D.aproximar(categoria, duracaoAproximacao, revelarCatalogo);
      else prepararCatalogoComImagem();
    } else {
      atualizarExpansao();
      painel.style.removeProperty('--altura-gaveta');
      for (const propriedade of ['--cena-x', '--cena-y', '--cena-escala']) {
        cena.style.removeProperty(propriedade);
      }
      cena3D?.aproximar();
    }

    ajustes.hidden = !categoria || !cena3D;
    if (categoria) restaurarVista();
    atualizarInstrucao();
  });

  function destacar(categoria) {
    categoria = categoriaSelecionada ?? categoria;
    if (categoriaDestacada) botoes.get(categoriaDestacada).removeAttribute('data-destaque');
    categoriaDestacada = categoria;
    rotulo.hidden = !categoria;
    cena3D?.marcar();
    if (!categoria) return;

    botoes.get(categoria).setAttribute('data-destaque', '');
    const total = contagem?.get(categoria);
    const opcoes = categoriaSelecionada || total === undefined ? '' : ' — ver ' + total + (total === 1 ? ' opção' : ' opções');
    rotulo.textContent = categorias[categoria].nome + opcoes;
  }

  visualizador.addEventListener('click', evento => {
    const botao = evento.target.closest('button[data-categoria]');
    if (botao) abrir(botao.dataset.categoria, botao);
  });

  function pecaNaImagem(evento) {
    if (categoriaSelecionada) return;
    const limites = imagem.getBoundingClientRect();
    const x = (evento.clientX - limites.left) / limites.width;
    const y = (evento.clientY - limites.top) / limites.height;
    return regioesDaImagem.find(([, esquerda, topo, direita, fundo]) =>
      x >= esquerda && x <= direita && y >= topo && y <= fundo)?.[0];
  }

  imagem.addEventListener('pointermove', evento => {
    const categoria = pecaNaImagem(evento);
    imagem.toggleAttribute('data-peca', !!categoria);
    destacar(categoria);
  });
  imagem.addEventListener('pointerleave', () => destacar());
  imagem.addEventListener('click', evento => {
    const categoria = pecaNaImagem(evento);
    if (categoria) abrir(categoria, botoes.get(categoria));
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
    controlesVista.hidden = true;
    if (ajustes.contains(document.activeElement)) painel.querySelector('#gaveta-fechar').focus();
    ajustes.hidden = true;
    atualizarInstrucao();
    for (const botao of botoes.values()) {
      botao.style.removeProperty('left');
      botao.style.removeProperty('top');
      botao.removeAttribute('data-fora');
    }
    if (mostrarCatalogo) prepararCatalogoComImagem();
  }

  import('./cena3d.js?v=inicio-1').then(({ iniciarCena }) => {
    cena3D = iniciarCena({ cena, canvas, botoes, destacar, abrir, usarImagem, pausa });
    if (!cena3D) return;
    canvas.hidden = false;
    imagem.hidden = true;
    controlesVista.hidden = false;
    if (painel.open || mostrarCatalogo) {
      clearTimeout(tempoCatalogo);
      cena3D.aproximar(painel.dataset.categoria, duracaoAproximacao, revelarCatalogo);
      ajustes.hidden = false;
    }
    atualizarInstrucao();
  }).catch(usarImagem);
}

const simulador = document.querySelector('[data-simulador]');
if (simulador) import('./simulador.js?v=montagem-1').then(({ iniciarSimulador }) => iniciarSimulador(simulador));

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
