import * as THREE from 'three';
import { carregarScrollTrigger } from './animacoes.js';
import { categorias } from './estoque.js';
import { ajustarRenderizador, CAMERA_PC, criarComputador, iluminar } from './modelo-pc.js';

const ordem = ['gabinete', 'ventoinhas', 'placa-mae', 'cpu', 'cooler', 'ram', 'armazenamento', 'gpu', 'fonte'];
const deslocamentos = {
  gabinete: [-1.25, -.15, -1.6],
  ventoinhas: [2.35, .25, -.6],
  'placa-mae': [-1.28, .85, .55],
  cpu: [-1.3, .2, 2.35],
  cooler: [-.55, 1.8, 2.55],
  ram: [1.15, 1.45, 1.45],
  armazenamento: [1.65, .12, 1.92],
  gpu: [.18, -.77, 2.85],
  fonte: [-.72, -1.17, 1.25],
};

export function criarVistaExplodida() {
  const mundo = new THREE.Scene();
  const { pc, pecas } = criarComputador();
  mundo.add(pc);
  iluminar(mundo);

  const camera = new THREE.PerspectiveCamera(CAMERA_PC.fov, 1, .1, 45);
  const inicio = new THREE.Vector3(...CAMERA_PC.posicao);
  const final = new THREE.Vector3(5.2, 3.1, 15.5);
  const partes = [...pecas].map(([categoria, peca]) => ({
    categoria,
    peca,
    origem: peca.position.clone(),
    deslocamento: new THREE.Vector3(...deslocamentos[categoria]),
  }));

  function atualizar(progresso, categoria) {
    const proporcao = THREE.MathUtils.smoothstep(progresso, 0, 1);
    camera.position.lerpVectors(inicio, final, proporcao);
    camera.lookAt(0, 0, 0);

    for (const parte of partes) {
      parte.peca.position.copy(parte.origem).addScaledVector(parte.deslocamento, proporcao);
      parte.peca.userData.contorno.visible = categoria === parte.categoria;
    }
    pecas.get('ventoinhas').rotation.y = -.66 * proporcao;
  }

  return { mundo, camera, atualizar };
}

export async function iniciarVistaExplodida(secao) {
  const ScrollTrigger = await carregarScrollTrigger();
  if (!ScrollTrigger) return;

  const palco = secao.querySelector('.vista-explodida-palco');
  const area = secao.querySelector('.vista-explodida-imagem');
  const canvas = area.querySelector('canvas');
  const imagem = area.querySelector('img');
  const texto = secao.querySelector('.vista-explodida-texto');
  const nome = texto.querySelector('.vista-explodida-nome');
  const descricao = texto.querySelector('.vista-explodida-descricao');
  const cabecalho = document.querySelector('.site-header');
  const preferencia = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  let vista;
  let gatilho;
  let fixado;
  let emTela = false;
  let progresso = 0;
  let categoriaAtual;

  function desenhar() {
    if (!emTela || !gatilho) return;
    const indice = Math.min(ordem.length - 1, Math.floor(progresso * ordem.length));
    const categoria = ordem[indice];
    vista.atualizar(progresso, categoria);
    renderer.render(vista.mundo, vista.camera);

    if (categoria !== categoriaAtual) {
      categoriaAtual = categoria;
      nome.textContent = categorias[categoria].nome;
      descricao.textContent = categorias[categoria].descricao;
    }
  }

  function atualizarPercurso(estado) {
    progresso = estado.progress;
    desenhar();
  }

  function redimensionar() {
    if (!gatilho) return;
    const largura = area.clientWidth;
    const altura = area.clientHeight;
    if (!largura || !altura) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(largura, altura, false);
    vista.camera.aspect = largura / altura;
    vista.camera.updateProjectionMatrix();
    desenhar();
  }

  function prepararPercurso() {
    if (!renderer || canvas.hidden) return;
    const alturaCabecalho = cabecalho?.offsetHeight ?? 0;
    const cabeNaTela = palco.offsetHeight + alturaCabecalho + 24 <= innerHeight;
    if (gatilho && fixado === cabeNaTela) return;

    gatilho?.kill();
    fixado = cabeNaTela;
    gatilho = ScrollTrigger.create({
      trigger: palco,
      pin: fixado,
      start: fixado ? () => 'top ' + ((cabecalho?.offsetHeight ?? 0) + 16) + 'px' : 'top 82%',
      end: fixado ? () => '+=' + Math.max(1200, innerHeight * 1.5) : 'bottom 26%',
      scrub: true,
      onUpdate: atualizarPercurso,
      onRefresh: atualizarPercurso,
    });
    atualizarPercurso(gatilho);
    redimensionar();
  }

  function usarIlustracao() {
    gatilho?.kill();
    gatilho = undefined;
    canvas.hidden = true;
    imagem.hidden = false;
    texto.hidden = true;
    secao.removeAttribute('data-vista-animada');
  }

  function aplicarPreferencia() {
    if (preferencia.matches || document.documentElement.dataset.reduzirMovimento === 'true') {
      usarIlustracao();
      return;
    }

    if (!renderer) {
      const contexto = canvas.getContext('webgl2', { alpha: true, antialias: true });
      if (!contexto) return;
      renderer = new THREE.WebGLRenderer({ canvas, context: contexto, alpha: true, antialias: true });
      ajustarRenderizador(renderer);
      vista = criarVistaExplodida();
    }

    canvas.hidden = false;
    imagem.hidden = true;
    texto.hidden = false;
    secao.setAttribute('data-vista-animada', '');
    prepararPercurso();
  }

  const visibilidade = new IntersectionObserver(([entrada]) => {
    emTela = entrada.isIntersecting;
    desenhar();
  });
  visibilidade.observe(area);

  const tamanho = new ResizeObserver(() => {
    prepararPercurso();
    redimensionar();
  });
  tamanho.observe(area);
  if (cabecalho) tamanho.observe(cabecalho);
  window.addEventListener('resize', prepararPercurso);

  const movimento = new MutationObserver(aplicarPreferencia);
  movimento.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduzir-movimento'] });
  preferencia.addEventListener('change', aplicarPreferencia);
  canvas.addEventListener('webglcontextlost', () => {
    usarIlustracao();
    visibilidade.disconnect();
    tamanho.disconnect();
    movimento.disconnect();
    preferencia.removeEventListener('change', aplicarPreferencia);
    window.removeEventListener('resize', prepararPercurso);
    renderer.dispose();
  }, { once: true });

  aplicarPreferencia();
}
