import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { projetorHotspots } from './pontos-interativos.js?v=1.0-final';
import { ajustarRenderizador, CAMERA_PC, criarComputador, iluminar } from './modelo-pc.js?v=1.0-final';

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
  controles.minDistance = 7.55;
  controles.maxDistance = 13.75;
  controles.minPolarAngle = .76;
  controles.maxPolarAngle = 1.53;
  controles.minAzimuthAngle = -1.04;
  controles.maxAzimuthAngle = 1.04;
  controles.enablePan = false;
  controles.enableDamping = true;
  controles.zoomSpeed = .55;
  controles.target.copy(alvoInicial);
  controles.update();
  canvas.style.touchAction = 'pan-y';

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
    camera.position.copy(alvo).add(deslocamento.setFromSpherical(orbita));
    camera.lookAt(alvo);
  }

  function quadro(tempo) {
    quadroPendente = undefined;
    if (!ativo || (!visivel && !pecaFocada) || document.hidden) {
      tempoAnterior = undefined;
      return;
    }

    const angulo = controles.getAzimuthalAngle();
    if (angulo < controles.minAzimuthAngle + .035) sentido = -1;
    if (angulo > controles.maxAzimuthAngle - .035) sentido = 1;
    controles.autoRotateSpeed = .56 * sentido;
    const emAproximacao = !!voo || !!pecaFocada;
    let cameraMoveu = false;
    const intervalo = Math.min((tempo - (tempoAnterior ?? tempo - 1000 / 60)) / 1000, .05);
    tempoAnterior = tempo;
    if (voo) {
      voo.decorrido += Math.min(64, tempo - (voo.quadroAnterior ?? tempo));
      voo.quadroAnterior = tempo;
      const progresso = Math.min(1, voo.decorrido / voo.duracao);
      const passo = THREE.MathUtils.smootherstep(progresso, 0, 1);
      const { origem, destino } = voo;
      orbita.set(
        origem.radius * Math.pow(destino.radius / origem.radius, passo),
        THREE.MathUtils.lerp(origem.phi, destino.phi, passo),
        THREE.MathUtils.lerp(origem.theta, destino.theta, passo),
      );
      voo.alvoAtual.lerpVectors(voo.alvoInicial, voo.alvo, passo);
      posicionarCamera(voo.alvoAtual);
      cameraMoveu = true;
      if (progresso === 1) {
        voo = undefined;
        controles.enabled = !pecaFocada;
      }
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
      luz.emissiveIntensity = .86 + Math.sin(tempoPecas * 1.9) * .12;
    }

    if (moveu || cameraMoveu || precisaRenderizar || animarPecas) {
      for (const [categoria, botao] of botoes) {
        pecas.get(categoria).userData.contorno.visible = categoria === pecaFocada || botao.hasAttribute('data-destaque');
      }
      renderer.render(mundo, camera);
      if (!pecaFocada) projetar();
      precisaRenderizar = false;
    }

    if (voo || (pecaFocada && cameraMoveu) || animarPecas || moveu) agendar();
    else tempoAnterior = undefined;
  }

  function redimensionar() {
    const largura = cena.clientWidth;
    const altura = cena.clientHeight;
    const escala = Math.min(window.devicePixelRatio || 1, 2);
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

  function aproximar(categoria) {
    voo = undefined;
    vistaFoco = undefined;
    pecaFocada = categoria;
    controles.enabled = false;
    controles.autoRotate = false;
    const origem = new THREE.Spherical().setFromVector3(deslocamento.copy(camera.position).sub(controles.target));
    let alvo = alvoInicial;
    let destino = orbitaInicial;

    if (categoria) {
      const peca = pecas.get(categoria);
      alvo = peca.userData.contorno.getWorldPosition(new THREE.Vector3());
      const distancia = Math.max(2, peca.userData.tamanho * 1.54 + .4);
      const base = new THREE.Spherical(
        distancia,
        THREE.MathUtils.lerp(origem.phi, 1.32, .25),
        THREE.MathUtils.clamp(origem.theta + .09, -.72, .72),
      );
      destino = base.clone();
      vistaFoco = { alvo, base, destino };
    }
    redimensionar();

    if (movimentoReduzido()) {
      orbita.copy(destino);
      posicionarCamera(alvo);
      controles.enabled = !categoria;
    } else {
      voo = {
        decorrido: 0,
        duracao: categoria ? 1180 : 820,
        origem,
        alvoInicial: controles.target.clone(),
        alvoAtual: new THREE.Vector3(),
        destino,
        alvo,
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
      marcar();
    }
    pausa.hidden = reduzido || !!pecaFocada;
    pausa.textContent = pausado ? 'Retomar giro' : 'Pausar giro';
    agendar();
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
    inicio = evento.isPrimary && evento.button === 0
      ? { x: evento.clientX, y: evento.clientY, id: evento.pointerId }
      : undefined;
  }, { signal });
  canvas.addEventListener('pointerup', evento => {
    if (inicio?.id !== evento.pointerId) return;
    const distancia = Math.hypot(evento.clientX - inicio.x, evento.clientY - inicio.y);
    inicio = undefined;
    if (distancia > 6) return;
    const categoria = pecaSobPonteiro(evento);
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
  return { marcar, aproximar, ajustarVista };
}
