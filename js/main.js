import { carregarEstoque, categorias } from './estoque.js';
import { iniciarGaveta } from './gaveta.js';
import { iniciarCarrossel } from './carrossel.js';
import { iniciarTema } from './tema.js';

const opcoesAcessibilidade = document.querySelector('#opcoes-acessibilidade');
if (opcoesAcessibilidade) iniciarTema(opcoesAcessibilidade);

const carrosselSetups = document.querySelector('#carrossel-setups');
if (carrosselSetups) iniciarCarrossel(carrosselSetups);

const visualizador = document.querySelector('.visualizador');

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
