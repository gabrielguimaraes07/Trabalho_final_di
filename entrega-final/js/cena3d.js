import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { projetorHotspots } from './pontos-interativos.js?v=1.0-final';
import { ajustarRenderizador, CAMERA_PC, criarComputador, iluminar } from './modelo-pc.js?v=lateral-1';

export function iniciarCena({ cena, canvas, botoes, destacar, abrir, usarImagem, pausa }) {
  const contexto = canvas.getContext('webgl2', { alpha: true, antialias: true });
  if (!contexto) return;

  const renderer = new THREE.WebGLRenderer({ canvas, context: contexto, alpha: true, antialias: true });
  ajustarRenderizador(renderer);
  const mundo = new THREE.Scene();
  const { pc, pecas, rotores, luz } = criarComputador();
  mundo.add(pc);
  iluminar(mundo);

  const camera = new THREE.PerspectiveCamera(CAMERA_PC.fov, 1, .1, 40);
  const posicaoInicial = new THREE.Vector3(...CAMERA_PC.posicao);
  const alvoInicial = new THREE.Vector3(...CAMERA_PC.alvo);
  const orbitaInicial = new THREE.Spherical().setFromVector3(posicaoInicial.clone().sub(alvoInicial));
  const orbita = new THREE.Spherical();
  const deslocamento = new THREE.Vector3();
  camera.position.copy(posicaoInicial);
  const controles = new OrbitControls(camera, canvas);
  controles.minDistance = 8;
  controles.maxDistance = 14.8;
  controles.minPolarAngle = .38;
  controles.maxPolarAngle = 1.84;
  controles.enablePan = false;
  controles.enableDamping = true;
  controles.dampingFactor = .075;
  controles.rotateSpeed = .66;
  controles.zoomSpeed = .55;
  controles.target.copy(alvoInicial);
  controles.update();
  canvas.style.touchAction = 'none';

  const projetar = projetorHotspots(botoes, pecas, camera);
  const preferencia = matchMedia('(prefers-reduced-motion: reduce)');
  const ouvintes = new AbortController();
  const { signal } = ouvintes;
  let pausado = false;
  let ponteiroNaCena = false;
  let visivel = true;
  let ativo = true;
  let quadroPendente;
  let tempoAnterior;
  let precisaRenderizar = true;
  let sentido = 1;
  let tempoPecas = 0;
  let pecaFocada;
  let vistaFoco;
  let vistaGeral;
  let vistaLivre;
  let voo;
  let larguraAnterior;
  let alturaAnterior;
  let escalaAnterior;

  function movimentoReduzido() {
    return preferencia.matches || document.documentElement.dataset.reduzirMovimento === 'true';
  }

  function agendar() {
    if (ativo && (visivel || pecaFocada) && !document.hidden && quadroPendente === undefined) {
      quadroPendente = requestAnimationFrame(quadro);
    }
  }

  function marcar() {
    precisaRenderizar = true;
    agendar();
  }

  function posicionarCamera(alvo) {
    controles.target.copy(alvo);
    deslocamento.setFromSpherical(orbita);
    if (voo || pecaFocada) {
      const eixoX = (Math.sign(deslocamento.x) * 2.14 - alvo.x) / deslocamento.x;
      const eixoY = (Math.sign(deslocamento.y) * 2.45 - alvo.y) / deslocamento.y;
      const eixoZ = (Math.sign(deslocamento.z) * 1.28 - alvo.z) / deslocamento.z;
      const saida = Math.min(...[eixoX, eixoY, eixoZ].filter(distancia => distancia >= 0));
      if (Number.isFinite(saida)) deslocamento.multiplyScalar(Math.max(1, saida * 1.1));
    }
    camera.position.copy(alvo).add(deslocamento);
    camera.lookAt(alvo);
  }

  function moverVista(angulo = 0, inclinacao = 0, escala = 1) {
    if (pecaFocada) return;
    if (voo) {
      voo = undefined;
      vistaGeral = undefined;
      controles.enabled = true;
    }
    if (!vistaLivre) vistaLivre = new THREE.Spherical().setFromVector3(deslocamento.copy(camera.position).sub(controles.target));
    vistaLivre.theta += angulo;
    vistaLivre.phi = THREE.MathUtils.clamp(vistaLivre.phi + inclinacao, controles.minPolarAngle, controles.maxPolarAngle);
    vistaLivre.radius = THREE.MathUtils.clamp(vistaLivre.radius * escala, controles.minDistance, controles.maxDistance);
    pausado = true;
    atualizarPausa();
  }

  function reposicionarVista(intervalo) {
    orbita.setFromVector3(deslocamento.copy(camera.position).sub(controles.target));
    const alvo = vistaLivre;
    const angulo = THREE.MathUtils.euclideanModulo(alvo.theta - orbita.theta + Math.PI, 2 * Math.PI) - Math.PI;
    const chegou = Math.abs(angulo) < .002 && Math.abs(orbita.phi - alvo.phi) < .002 && Math.abs(orbita.radius - alvo.radius) < .012;
    if (chegou || movimentoReduzido()) {
      orbita.copy(alvo);
      vistaLivre = undefined;
    } else {
      const passo = 1 - Math.exp(-14 * intervalo);
      orbita.theta += angulo * passo;
      orbita.phi = THREE.MathUtils.lerp(orbita.phi, alvo.phi, passo);
      orbita.radius = THREE.MathUtils.lerp(orbita.radius, alvo.radius, passo);
    }
    posicionarCamera(controles.target);
  }

  function corrigirProjecao() {
    const larguraVisivel = cena.getBoundingClientRect().width;
    if (!larguraVisivel || !larguraAnterior) return;
    const zoom = THREE.MathUtils.clamp(larguraAnterior / larguraVisivel, 1, 1.55);
    if (zoom === camera.zoom) return;
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }

  function quadro(tempo) {
    quadroPendente = undefined;
    if (!ativo || (!visivel && !pecaFocada) || document.hidden) {
      tempoAnterior = undefined;
      return;
    }

    const angulo = controles.getAzimuthalAngle();
    if (angulo < .04) sentido = -1;
    if (angulo > .76) sentido = 1;
    controles.autoRotateSpeed = .42 * sentido;
    const emAproximacao = !!voo || !!pecaFocada;
    let cameraMoveu = false;
    let aoChegar;
    const intervalo = Math.min((tempo - (tempoAnterior ?? tempo - 1000 / 60)) / 1000, .05);
    tempoAnterior = tempo;
    if (voo) {
      voo.decorrido += THREE.MathUtils.clamp(tempo - voo.quadroAnterior, 0, 100);
      voo.quadroAnterior = tempo;
      const progresso = Math.min(1, voo.decorrido / voo.duracao);
      const passo = THREE.MathUtils.smootherstep(progresso, 0, 1);
      const { origem, destino } = voo;
      orbita.set(
        origem.radius * Math.pow(destino.radius / origem.radius, passo),
        THREE.MathUtils.lerp(origem.phi, destino.phi, passo),
        origem.theta + voo.giro * passo,
      );
      voo.alvoAtual.lerpVectors(voo.alvoInicial, voo.alvo, passo);
      posicionarCamera(voo.alvoAtual);
      cameraMoveu = true;
      if (progresso === 1) {
        orbita.copy(destino);
        aoChegar = voo.aoChegar;
        voo = undefined;
        controles.enabled = !pecaFocada;
        if (!pecaFocada) vistaGeral = undefined;
      }
    } else if (vistaLivre) {
      reposicionarVista(intervalo);
      cameraMoveu = true;
    } else if (vistaFoco) {
      const { alvo, destino } = vistaFoco;
      if (orbita.theta !== destino.theta || orbita.radius !== destino.radius) {
        orbita.theta = Math.abs(orbita.theta - destino.theta) < .001 ? destino.theta
          : THREE.MathUtils.damp(orbita.theta, destino.theta, 16, intervalo);
        orbita.radius = Math.abs(orbita.radius - destino.radius) < .005 ? destino.radius
          : THREE.MathUtils.damp(orbita.radius, destino.radius, 16, intervalo);
        posicionarCamera(alvo);
        cameraMoveu = true;
      }
    }
    const animarPecas = !pausado && !movimentoReduzido() && !pecaFocada;
    controles.autoRotate = animarPecas && !emAproximacao && !ponteiroNaCena
      && !cena.contains(document.activeElement);
    const moveu = !emAproximacao && controles.update(intervalo);

    if (animarPecas) {
      tempoPecas += intervalo;
      for (const rotor of rotores) rotor.rotation.z = -tempoPecas * 4.2;
      luz.emissiveIntensity = .72 + Math.sin(tempoPecas * 1.9) * .08;
    }

    if (moveu || cameraMoveu || precisaRenderizar || animarPecas) {
      if (emAproximacao || camera.zoom !== 1) corrigirProjecao();
      for (const [categoria, botao] of botoes) {
        pecas.get(categoria).userData.contorno.visible = categoria === pecaFocada || botao.hasAttribute('data-destaque');
      }
      renderer.render(mundo, camera);
      if (!pecaFocada) projetar();
      precisaRenderizar = false;
    }

    aoChegar?.();
    if (voo || vistaLivre || (pecaFocada && cameraMoveu) || animarPecas || moveu) agendar();
    else tempoAnterior = undefined;
  }

  function redimensionar() {
    const largura = cena.clientWidth;
    const altura = cena.clientHeight;
    const escala = Math.min(window.devicePixelRatio || 1, 1.75);
    if (!largura || !altura) return;
    if (largura === larguraAnterior && altura === alturaAnterior && escala === escalaAnterior) return;
    larguraAnterior = largura;
    alturaAnterior = altura;
    escalaAnterior = escala;
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(escala);
    renderer.setSize(largura, altura, false);
    marcar();
  }

  function aproximar(categoria, duracao = 760, aoChegar) {
    voo = undefined;
    vistaLivre = undefined;
    vistaFoco = undefined;
    pecaFocada = categoria;
    controles.enabled = false;
    controles.autoRotate = false;
    const origem = new THREE.Spherical().setFromVector3(deslocamento.copy(camera.position).sub(controles.target));
    let alvo = vistaGeral?.alvo ?? alvoInicial;
    let destino = vistaGeral?.orbita ?? orbitaInicial;

    if (categoria) {
      vistaGeral ??= { alvo: controles.target.clone(), orbita: origem.clone() };
      const peca = pecas.get(categoria);
      alvo = peca.userData.contorno.getWorldPosition(new THREE.Vector3());
      const distancia = categoria === 'gabinete' ? Math.max(8.75, origem.radius * .87)
        : Math.max(2.85, peca.userData.tamanho * 1.85 + .38);
      const base = new THREE.Spherical(
        distancia,
        THREE.MathUtils.lerp(origem.phi, 1.32, .18),
        Math.abs(origem.theta) > 1.15 && categoria !== 'gabinete'
          ? Math.sign(origem.theta) * .74 : origem.theta + .055,
      );
      destino = base.clone();
      vistaFoco = { alvo, base, destino };
    }
    redimensionar();

    if (movimentoReduzido()) {
      orbita.copy(destino);
      posicionarCamera(alvo);
      controles.enabled = !categoria;
      if (!categoria) vistaGeral = undefined;
      aoChegar?.();
    } else {
      voo = {
        decorrido: 0,
        quadroAnterior: performance.now(),
        duracao,
        origem,
        giro: THREE.MathUtils.euclideanModulo(destino.theta - origem.theta + Math.PI, 2 * Math.PI) - Math.PI,
        alvoInicial: controles.target.clone(),
        alvoAtual: new THREE.Vector3(),
        destino,
        alvo,
        aoChegar,
      };
    }
    pausa.hidden = movimentoReduzido() || !!categoria;
    marcar();
  }

  function ajustarVista(angulo, zoom) {
    if (!vistaFoco) return;
    const { alvo, base, destino } = vistaFoco;
    destino.theta = base.theta + THREE.MathUtils.degToRad(angulo);
    destino.radius = base.radius * 100 / zoom;
    if (movimentoReduzido()) {
      orbita.copy(destino);
      posicionarCamera(alvo);
      marcar();
    } else {
      agendar();
    }
  }

  function atualizarPausa() {
    const reduzido = movimentoReduzido();
    controles.enableDamping = !reduzido;
    const enquadramento = voo ?? vistaFoco;
    if (reduzido && enquadramento) {
      voo = undefined;
      orbita.copy(enquadramento.destino);
      posicionarCamera(enquadramento.alvo);
      controles.enabled = !pecaFocada;
      if (!pecaFocada) vistaGeral = undefined;
      marcar();
      enquadramento.aoChegar?.();
    }
    pausa.hidden = reduzido || !!pecaFocada;
    pausa.textContent = pausado ? 'Retomar giro' : 'Pausar giro';
    agendar();
  }

  function restaurar() {
    if (pecaFocada) return;
    vistaGeral = undefined;
    aproximar(undefined, 620);
  }

  const observadorTamanho = new ResizeObserver(redimensionar);
  observadorTamanho.observe(cena);
  const observadorTela = new IntersectionObserver(([entrada]) => {
    visivel = entrada.isIntersecting;
    tempoAnterior = undefined;
    agendar();
  });
  observadorTela.observe(cena);
  const observadorMovimento = new MutationObserver(atualizarPausa);
  observadorMovimento.observe(document.documentElement, {
    attributes: true, attributeFilter: ['data-reduzir-movimento'],
  });
  controles.addEventListener('change', marcar);
  controles.addEventListener('start', () => {
    vistaLivre = undefined;
    pausado = true;
    atualizarPausa();
  });
  cena.addEventListener('transitionend', ({ propertyName, target }) => {
    if (target === cena && propertyName === 'transform') marcar();
  }, { signal });
  window.addEventListener('resize', redimensionar, { signal });
  cena.addEventListener('pointerenter', evento => {
    ponteiroNaCena = evento.pointerType !== 'touch';
  }, { signal });
  cena.addEventListener('pointerleave', () => {
    ponteiroNaCena = false;
    agendar();
  }, { signal });
  cena.addEventListener('focusin', evento => {
    if (evento.target.hasAttribute('data-fora') && !voo && !pecaFocada) {
      controles.autoRotate = false;
      camera.position.copy(posicaoInicial);
      controles.update();
    }
    marcar();
  }, { signal });
  cena.addEventListener('focusout', agendar, { signal });
  preferencia.addEventListener('change', atualizarPausa, { signal });
  document.addEventListener('visibilitychange', agendar, { signal });
  pausa.addEventListener('click', () => {
    pausado = !pausado;
    atualizarPausa();
  }, { signal });

  canvas.addEventListener('wheel', evento => {
    if (!controles.enabled || evento.ctrlKey || evento.metaKey) return;
    evento.preventDefault();
    evento.stopImmediatePropagation();
    const unidade = evento.deltaMode === 1 ? 16 : evento.deltaMode === 2 ? canvas.clientHeight : 1;
    const passo = THREE.MathUtils.clamp(evento.deltaY * unidade * .0015, -.35, .35);
    moverVista(0, 0, Math.exp(passo));
  }, { capture: true, passive: false, signal });

  const teclasDaVista = {
    ArrowLeft: [-.27, 0], ArrowRight: [.27, 0], ArrowUp: [0, -.16], ArrowDown: [0, .16],
    '+': [0, 0, .87], '=': [0, 0, .87], '-': [0, 0, 1 / .87],
  };
  canvas.addEventListener('keydown', evento => {
    if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
    const movimento = teclasDaVista[evento.key];
    if (!movimento) return;
    evento.preventDefault();
    moverVista(...movimento);
  }, { signal });

  const raio = new THREE.Raycaster();
  const ponteiro = new THREE.Vector2();
  const areas = [];
  pc.traverse(objeto => {
    if (objeto.isMesh && !objeto.userData.ignorarSelecao) areas.push(objeto);
  });
  function pecaSobPonteiro(evento) {
    const retangulo = canvas.getBoundingClientRect();
    ponteiro.set(
      (evento.clientX - retangulo.left) * 2 / retangulo.width - 1,
      1 - (evento.clientY - retangulo.top) * 2 / retangulo.height,
    );
    raio.setFromCamera(ponteiro, camera);
    let objeto = raio.intersectObjects(areas, false)[0]?.object;
    while (objeto && !objeto.userData.categoria) objeto = objeto.parent;
    return objeto?.userData.categoria;
  }

  let inicio;
  canvas.addEventListener('pointermove', evento => {
    if (pecaFocada) return;
    if (inicio?.id === evento.pointerId && Math.hypot(evento.clientX - inicio.x, evento.clientY - inicio.y) > 6) {
      inicio = undefined;
    }
    const categoria = evento.pointerType === 'mouse' && !evento.buttons ? pecaSobPonteiro(evento) : undefined;
    canvas.toggleAttribute('data-peca', !!categoria);
    destacar(categoria);
  }, { signal });
  canvas.addEventListener('pointerleave', () => {
    canvas.removeAttribute('data-peca');
    destacar();
  }, { signal });

  canvas.addEventListener('pointerdown', evento => {
    inicio = !pecaFocada && evento.isPrimary && evento.button === 0
      ? { x: evento.clientX, y: evento.clientY, id: evento.pointerId, categoria: pecaSobPonteiro(evento) }
      : undefined;
  }, { signal });
  canvas.addEventListener('pointerup', evento => {
    if (inicio?.id !== evento.pointerId) return;
    const { x, y, categoria } = inicio;
    inicio = undefined;
    if (Math.hypot(evento.clientX - x, evento.clientY - y) > 6) return;
    if (categoria) abrir(categoria, botoes.get(categoria));
  }, { signal });
  canvas.addEventListener('pointercancel', () => {
    inicio = undefined;
  }, { signal });

  canvas.addEventListener('webglcontextlost', () => {
    ativo = false;
    ouvintes.abort();
    controles.dispose();
    observadorTamanho.disconnect();
    observadorTela.disconnect();
    observadorMovimento.disconnect();
    renderer.dispose();
    usarImagem();
  }, { once: true });

  redimensionar();
  atualizarPausa();
  return { marcar, aproximar, ajustarVista, moverVista, restaurar };
}
