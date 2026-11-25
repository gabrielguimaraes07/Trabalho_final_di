import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { projetorHotspots } from './pontos-interativos.js?v=1.0-final';
import { ajustarRenderizador, CAMERA_PC, criarComputador, iluminar } from './modelo-pc.js?v=1.0-final';

export function iniciarCena({ cena, canvas, imagem, botoes, dialogo, destacar, abrir, usarImagem, pausa }) {
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
  const previa = dialogo.querySelector('.gaveta-previa');
  const previaImagem = previa.querySelector('img');
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
  let voo;
  let larguraAnterior;
  let alturaAnterior;
  let escalaAnterior;

  function movimentoReduzido() {
    return preferencia.matches || document.documentElement.dataset.reduzirMovimento === 'true';
  }

  function agendar() {
    if (ativo && (visivel || dialogo.open) && !document.hidden && quadroPendente === undefined) {
      quadroPendente = requestAnimationFrame(quadro);
    }
  }

  function marcar() {
    precisaRenderizar = true;
    agendar();
  }

  function quadro(tempo) {
    quadroPendente = undefined;
    if (!ativo || (!visivel && !dialogo.open) || document.hidden) {
      tempoAnterior = undefined;
      return;
    }

    const angulo = controles.getAzimuthalAngle();
    if (angulo < controles.minAzimuthAngle + .035) sentido = -1;
    if (angulo > controles.maxAzimuthAngle - .035) sentido = 1;
    controles.autoRotateSpeed = .56 * sentido;
    const emAproximacao = !!voo || !!pecaFocada;
    const cameraMoveu = !!voo;
    if (voo) {
      const progresso = THREE.MathUtils.clamp((tempo - voo.inicio) / voo.duracao, 0, 1);
      const passo = THREE.MathUtils.smoothstep(progresso, 0, 1);
      camera.position.lerpVectors(voo.posicaoInicial, voo.destino, passo);
      controles.target.lerpVectors(voo.alvoInicial, voo.alvo, passo);
      if (progresso === 1) {
        voo = undefined;
        controles.enabled = !pecaFocada;
      }
    }
    const animarPecas = !pausado && !movimentoReduzido() && !dialogo.open;
    controles.autoRotate = animarPecas && !emAproximacao && !ponteiroNaCena
      && !cena.contains(document.activeElement);
    const intervalo = Math.min((tempo - (tempoAnterior ?? tempo)) / 1000, .05);
    tempoAnterior = tempo;
    if (emAproximacao) camera.lookAt(controles.target);
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
      if (!dialogo.open) projetar();
      precisaRenderizar = false;
    }

    if (voo || animarPecas || moveu) agendar();
    else tempoAnterior = undefined;
  }

  function redimensionar() {
    const area = canvas.parentElement;
    const largura = area.clientWidth;
    const altura = area.clientHeight;
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
    pecaFocada = categoria;
    cena.toggleAttribute('data-aproximado', !!categoria);
    for (const [chave, botao] of botoes) botao.toggleAttribute('data-selecionado', chave === categoria);
    controles.enabled = false;
    controles.autoRotate = false;
    let alvo = alvoInicial;
    let destino = posicaoInicial;

    if (categoria) {
      const peca = pecas.get(categoria);
      alvo = peca.userData.contorno.getWorldPosition(new THREE.Vector3());
      const distancia = Math.max(2, peca.userData.tamanho * 1.54 + .4);
      const direcao = camera.position.clone().sub(controles.target).normalize();
      destino = alvo.clone().addScaledVector(direcao, distancia);
      if (canvas.parentElement !== previa) {
        previaImagem.hidden = true;
        imagem.hidden = false;
        previa.append(canvas);
      }
    } else if (canvas.parentElement !== cena) {
      imagem.after(canvas);
      imagem.hidden = true;
    }
    redimensionar();

    if (movimentoReduzido()) {
      camera.position.copy(destino);
      controles.target.copy(alvo);
      camera.lookAt(alvo);
      controles.enabled = !categoria;
    } else {
      voo = {
        inicio: performance.now(),
        duracao: categoria ? 880 : 620,
        posicaoInicial: camera.position.clone(),
        alvoInicial: controles.target.clone(),
        destino,
        alvo,
      };
    }
    marcar();
  }

  function atualizarPausa() {
    const reduzido = movimentoReduzido();
    controles.enableDamping = !reduzido;
    if (reduzido && voo) aproximar(pecaFocada);
    pausa.hidden = reduzido;
    pausa.textContent = pausado ? 'Retomar giro' : 'Pausar giro';
    agendar();
  }

  const observadorTamanho = new ResizeObserver(redimensionar);
  observadorTamanho.observe(cena);
  observadorTamanho.observe(previa);
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
  const observadorGaveta = new MutationObserver(() => aproximar(dialogo.open ? dialogo.dataset.categoria : undefined));
  observadorGaveta.observe(dialogo, { attributes: true, attributeFilter: ['open'] });

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
    observadorGaveta.disconnect();
    renderer.dispose();
    usarImagem();
  }, { once: true });

  redimensionar();
  if (dialogo.open) aproximar(dialogo.dataset.categoria);
  atualizarPausa();
  return marcar;
}
