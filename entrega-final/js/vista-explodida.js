import * as THREE from 'three';
import { categorias } from './estoque.js?v=1.0-final';
import { ajustarRenderizador, CAMERA_PC, criarComputador, iluminar } from './modelo-pc.js?v=1.0-final';

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

export function iniciarVistaExplodida(secao) {
  const percurso = secao.querySelector('.vista-explodida-percurso');
  const palco = secao.querySelector('.vista-explodida-palco');
  const area = secao.querySelector('.vista-explodida-imagem');
  const canvas = area.querySelector('canvas');
  const imagem = area.querySelector('img');
  const quadros = area.querySelector('.vista-explodida-quadros');
  const controle = secao.querySelector('.vista-explodida-controle');
  const texto = secao.querySelector('.vista-explodida-texto');
  const nome = texto.querySelector('.vista-explodida-nome');
  const descricao = texto.querySelector('.vista-explodida-descricao');
  const cabecalho = document.querySelector('.site-header');
  const preferencia = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  let vista;
  let tentouWebGL = false;
  let preparandoQuadros;
  let quadrosProntos = false;
  let animacaoAtiva = false;
  let animarNestaVista = false;
  let fixado = false;
  let emTela = false;
  let topo;
  let quadroPendente;
  let progressoAnterior;
  let categoriaAtual;

  function movimentoReduzido() {
    return preferencia.matches || document.documentElement.dataset.reduzirMovimento === 'true';
  }

  function agendar() {
    if (animacaoAtiva && emTela && quadroPendente === undefined) {
      quadroPendente = requestAnimationFrame(desenhar);
    }
  }

  function desenhar() {
    quadroPendente = undefined;
    if (!animacaoAtiva || !emTela) return;
    const limites = percurso.getBoundingClientRect();
    const posicao = fixado
      ? (topo - limites.top) / Math.max(1, limites.height - palco.offsetHeight)
      : (innerHeight * .82 - limites.top) / (limites.height + innerHeight * .56);
    const progresso = THREE.MathUtils.clamp(posicao, 0, 1);
    if (progresso === progressoAnterior) return;
    progressoAnterior = progresso;

    const indice = Math.min(ordem.length - 1, Math.floor(progresso * ordem.length));
    const categoria = ordem[indice];
    if (renderer) {
      vista.atualizar(progresso, categoria);
      renderer.render(vista.mundo, vista.camera);
    } else {
      const colunas = 6;
      const linhas = 3;
      const indiceQuadro = Math.round(progresso * (colunas * linhas - 1));
      const x = indiceQuadro % colunas * 100 / (colunas - 1);
      const y = Math.floor(indiceQuadro / colunas) * 100 / (linhas - 1);
      quadros.style.backgroundPosition = x + '% ' + y + '%';
    }

    if (categoria !== categoriaAtual) {
      categoriaAtual = categoria;
      nome.textContent = categorias[categoria].nome;
      descricao.textContent = categorias[categoria].descricao;
    }
  }

  function redimensionar() {
    if (!animacaoAtiva) return;
    topo = (cabecalho?.offsetHeight ?? 0) + 16;
    fixado = palco.offsetHeight + topo + 8 <= innerHeight;
    percurso.toggleAttribute('data-fixado', fixado);
    percurso.style.setProperty('--vista-topo', topo + 'px');

    const largura = area.clientWidth;
    const altura = area.clientHeight;
    if (renderer && largura && altura) {
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setSize(largura, altura, false);
      vista.camera.aspect = largura / altura;
      vista.camera.updateProjectionMatrix();
    }
    progressoAnterior = undefined;
    agendar();
  }

  function aplicarPreferencia() {
    const reduzido = movimentoReduzido();
    const permiteAnimar = !reduzido || animarNestaVista;
    controle.hidden = !reduzido;
    controle.setAttribute('aria-pressed', String(animarNestaVista));

    if (permiteAnimar && !tentouWebGL) {
      tentouWebGL = true;
      try {
        const contexto = canvas.getContext('webgl2', { alpha: true, antialias: true });
        if (contexto) {
          vista = criarVistaExplodida();
          renderer = new THREE.WebGLRenderer({ canvas, context: contexto, alpha: true, antialias: true });
          ajustarRenderizador(renderer);
        }
      } catch {
        renderer?.dispose();
        renderer = undefined;
      }
    }

    if (permiteAnimar && !renderer && !preparandoQuadros) {
      const folha = new Image();
      folha.src = new URL('../recursos/img/pc-explodido-quadros.webp', import.meta.url).href;
      preparandoQuadros = folha.decode().then(() => {
        quadros.style.backgroundImage = 'url("' + folha.src + '")';
        quadrosProntos = true;
        aplicarPreferencia();
      }).catch(() => {});
    }

    animacaoAtiva = permiteAnimar && (!!renderer || quadrosProntos);
    canvas.hidden = !(animacaoAtiva && renderer);
    quadros.hidden = !animacaoAtiva || !!renderer;
    imagem.hidden = animacaoAtiva;
    texto.hidden = !animacaoAtiva;
    secao.toggleAttribute('data-vista-animada', animacaoAtiva);
    if (animacaoAtiva) redimensionar();
    else percurso.removeAttribute('data-fixado');
  }

  function atualizarPreferencia() {
    animarNestaVista = false;
    aplicarPreferencia();
  }

  const visibilidade = new IntersectionObserver(([entrada]) => {
    emTela = entrada.isIntersecting;
    agendar();
  }, { rootMargin: '100px 0px' });
  visibilidade.observe(percurso);

  const tamanho = new ResizeObserver(redimensionar);
  tamanho.observe(palco);
  if (cabecalho) tamanho.observe(cabecalho);
  window.addEventListener('resize', redimensionar);
  window.addEventListener('scroll', agendar, { passive: true });

  controle.addEventListener('click', () => {
    animarNestaVista = !animarNestaVista;
    aplicarPreferencia();
  });
  const movimento = new MutationObserver(atualizarPreferencia);
  movimento.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduzir-movimento'] });
  preferencia.addEventListener('change', atualizarPreferencia);
  canvas.addEventListener('webglcontextlost', () => {
    renderer?.dispose();
    renderer = undefined;
    aplicarPreferencia();
  }, { once: true });

  aplicarPreferencia();
}
