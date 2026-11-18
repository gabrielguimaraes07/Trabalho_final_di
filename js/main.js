import { carregarEstoque, categorias } from './estoque.js';
import { iniciarGaveta } from './gaveta.js';
import { iniciarCarrossel } from './carrossel.js';
import { iniciarAcessibilidade } from './acessibilidade.js';
import { iniciarCarrinho } from './carrinho.js';
import { iniciarPaginaEstoque } from './pagina-estoque.js';
import { iniciarMontador } from './montador.js';
import { iniciarBuildsProntos } from './builds-prontos.js';
import { iniciarPaginaGlossario } from './glossario.js';
import { iniciarAcesso } from './login.js';
import { iniciarContato } from './formularios.js';
import { iniciarRevelacaoDeTitulos } from './animacoes.js';

const cabecalho = document.querySelector('.site-header');
if (cabecalho) {
  document.addEventListener('focusin', ({ target }) => {
    if (!target.closest('main, footer') || target.closest('dialog')) return;
    requestAnimationFrame(() => {
      if (document.activeElement !== target) return;
      const limite = cabecalho.getBoundingClientRect().bottom + 8;
      const topo = target.getBoundingClientRect().top;
      if (topo < limite) window.scrollBy({ top: topo - limite, behavior: 'instant' });
    });
  });
}

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
    import('./vista-explodida.js')
      .then(({ iniciarVistaExplodida }) => iniciarVistaExplodida(secaoExplodida))
      .catch(() => {
        // A ilustração e a lista de peças continuam disponíveis.
      });
  }, { rootMargin: '320px 0px' });
  observador.observe(secaoExplodida);
}

if (visualizador) {
  const cena = visualizador.querySelector('.cena-pc');
  const canvas = cena.querySelector('canvas');
  const imagem = cena.querySelector('img');
  const rotulo = cena.querySelector('#rotulo-peca');
  const pausa = visualizador.querySelector('#pausar-giro');
  const instrucao = visualizador.querySelector('#instrucao-pc');
  const botoes = new Map([...cena.querySelectorAll('.hotspot')].map(botao => [botao.dataset.categoria, botao]));
  const dialogo = document.querySelector('#gaveta-estoque');
  const abrir = iniciarGaveta(dialogo);
  let categoriaDestacada;
  let contagem;
  let atualizarCena;

  function destacar(categoria) {
    if (categoriaDestacada) botoes.get(categoriaDestacada).removeAttribute('data-destaque');
    categoriaDestacada = categoria;
    rotulo.hidden = !categoria;
    atualizarCena?.();
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
    for (const produto of produtos) {
      contagem.set(produto.categoria, (contagem.get(produto.categoria) ?? 0) + 1);
    }
    if (categoriaDestacada) destacar(categoriaDestacada);
  }).catch(() => {
    // A gaveta tenta carregar o estoque novamente quando uma peça é escolhida.
  });

  function usarImagem() {
    atualizarCena = undefined;
    canvas.hidden = true;
    imagem.hidden = false;
    pausa.hidden = true;
    instrucao.textContent = 'Escolha uma peça para ver o estoque.';
    for (const botao of botoes.values()) {
      botao.style.removeProperty('left');
      botao.style.removeProperty('top');
      botao.removeAttribute('data-fora');
    }
  }

  import('./cena3d.js').then(({ iniciarCena }) => {
    const ativa = iniciarCena({
      cena, canvas, botoes, dialogo, destacar, abrir, usarImagem, pausa,
    });
    if (!ativa) return;
    atualizarCena = ativa;
    canvas.hidden = false;
    imagem.hidden = true;
    instrucao.textContent = 'Arraste o PC e escolha uma peça.';
  }).catch(usarImagem);
}
