import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { projetorHotspots } from './hotspots.js';

const geometrias = {
  caixa: new THREE.BoxGeometry(1, 1, 1),
  disco: new THREE.CylinderGeometry(1, 1, 1, 32),
  aro: new THREE.TorusGeometry(1, .048, 10, 40),
};

const metal = (color, metalness = .36) => new THREE.MeshStandardMaterial({ color, metalness, roughness: .44 });
const materiais = {
  chassi: metal(0x282b33),
  lateral: metal(0x181b22),
  metal: metal(0x545d6d, .6),
  borda: metal(0x8392a6, .5),
  placa: metal(0x1c2c36, .15),
  trilha: metal(0x345367),
  preto: metal(0x0b0e16, .18),
  ventoinha: metal(0x344256),
  luz: new THREE.MeshStandardMaterial({
    color: 0x2997ff, emissive: 0x2997ff, emissiveIntensity: .86, roughness: .5,
  }),
  vidro: new THREE.MeshPhysicalMaterial({
    color: 0xa7c3eb, roughness: .19, opacity: .065, transparent: true, depthWrite: false,
  }),
};

function caixa(pai, material, largura, altura, fundo, x, y, z) {
  const malha = new THREE.Mesh(geometrias.caixa, material);
  malha.scale.set(largura, altura, fundo);
  malha.position.set(x, y, z);
  pai.add(malha);
  return malha;
}

function disco(pai, material, raio, espessura, z) {
  const malha = new THREE.Mesh(geometrias.disco, material);
  malha.scale.set(raio, espessura, raio);
  malha.rotation.x = Math.PI / 2;
  malha.position.z = z;
  pai.add(malha);
}

function ventoinha(pai, raio, x, y, z, rotacao = 0) {
  const grupo = new THREE.Group();
  grupo.position.set(x, y, z);
  grupo.rotation.y = rotacao;
  pai.add(grupo);

  disco(grupo, materiais.preto, raio, raio * .26, 0);
  const aro = new THREE.Mesh(geometrias.aro, materiais.luz);
  aro.scale.setScalar(raio * .94);
  aro.position.z = raio * .14;
  grupo.add(aro);
  for (let i = 0; i < 7; i++) {
    const angulo = i * Math.PI * 2 / 7;
    const pa = caixa(grupo, materiais.ventoinha, raio * .12, raio * .53, raio * .055,
      Math.sin(angulo) * raio * .55, Math.cos(angulo) * raio * .55, raio * .16);
    pa.rotation.z = .35 - angulo;
  }
  disco(grupo, materiais.metal, raio * .27, raio * .13, raio * .16);
  disco(grupo, materiais.preto, raio * .13, raio * .09, raio * .24);
}

export function criarComputador() {
  const pc = new THREE.Group();
  const pecas = new Map();
  const volumes = new THREE.LineBasicMaterial({ color: 0x2997ff, transparent: true, opacity: .9 });

  function peca(categoria, nome, posicao, ponto, tamanho) {
    const grupo = new THREE.Group();
    grupo.name = nome;
    grupo.position.fromArray(posicao);
    grupo.userData.categoria = categoria;
    grupo.userData.ponto = new THREE.Vector3(...ponto);
    const volume = new THREE.BoxGeometry(...tamanho);
    const contorno = new THREE.LineSegments(new THREE.EdgesGeometry(volume), volumes);
    volume.dispose();
    contorno.visible = false;
    grupo.userData.contorno = contorno;
    grupo.add(contorno);
    pc.add(grupo);
    pecas.set(categoria, grupo);
    return grupo;
  }

  const chassi = new THREE.Group();
  chassi.name = 'Gabinete';
  pc.add(chassi);
  caixa(chassi, materiais.chassi, 3.8, .16, 2.14, 0, 2.14, 0);
  caixa(chassi, materiais.metal, 3.56, .035, 1.95, 0, 2.23, -.012);
  caixa(chassi, materiais.chassi, 3.8, .15, 2.15, 0, -2.13, 0);
  caixa(chassi, materiais.lateral, 3.57, 4.14, .1, 0, 0, -1.03);
  caixa(chassi, materiais.lateral, .1, 4.15, 1.92, -1.84, 0, -.025);
  caixa(chassi, materiais.preto, .11, 4.12, 1.89, 1.84, 0, -.032);
  for (const x of [-1.82, 1.82]) {
    for (const z of [-.99, 1.017]) {
      caixa(chassi, materiais.chassi, .16, 4.22, .13, x, .01, z);
      caixa(chassi, materiais.preto, .37, .16, .3, x * .86, -2.28, z * .82);
    }
    caixa(chassi, materiais.borda, .035, 4.14, .025, x * .96, .03, 1.084);
  }
  caixa(chassi, materiais.borda, 3.59, .022, .035, 0, 2.044, 1.067);
  caixa(chassi, materiais.borda, 3.59, .022, .035, 0, -2.044, 1.067);

  for (let i = 0; i < 13; i++) {
    caixa(chassi, materiais.preto, .08, .022, .66, .22 + i * .1, 2.251, -.22);
  }
  caixa(chassi, materiais.luz, .24, .024, .055, 1.43, 2.254, .7);
  caixa(chassi, materiais.preto, .12, .025, .077, 1.12, 2.253, .7);

  const fans = new THREE.Group();
  fans.name = 'Ventoinhas do gabinete';
  pc.add(fans);
  for (const y of [1.21, .02, -1.17]) {
    ventoinha(fans, .52, 1.91, y, -.022, Math.PI / 2);
  }
  ventoinha(fans, .36, -1.74, 1.32, -.33, Math.PI / 2);

  const placa = new THREE.Group();
  placa.name = 'Placa-mãe';
  pc.add(placa);
  caixa(placa, materiais.placa, 2.42, 2.74, .095, -.49, .34, -.846);
  caixa(placa, materiais.chassi, .42, 1.46, .18, -1.43, 1.01, -.712);
  caixa(placa, materiais.metal, .91, .3, .16, -.58, 1.43, -.713);
  caixa(placa, materiais.metal, .44, .42, .13, .26, -.35, -.719);
  for (let i = 0; i < 7; i++) {
    caixa(placa, materiais.trilha, .98, .012, .014, -.43, -.09 - .07 * i, -.789);
    caixa(placa, materiais.trilha, .014, .84, .014, .34 + .037 * i, .85, -.789);
  }
  for (let i = 0; i < 4; i++) {
    caixa(placa, materiais.metal, .09, .13, .085, -1.05 + i * .17, 1.63, -.704);
  }
  caixa(placa, materiais.preto, 1.14, .16, .065, -.49, -.898, -.752);
  caixa(placa, materiais.metal, .82, .075, .028, -.42, -.898, -.7);

  const cpu = peca('cpu', 'Processador', [-.82, .79, -.23], [0, .1, .5], [.92, .93, 1]);
  caixa(cpu, materiais.trilha, .88, .89, .14, 0, 0, -.42);
  caixa(cpu, materiais.metal, .56, .55, .105, 0, 0, -.3);
  caixa(cpu, materiais.chassi, .77, .76, .55, 0, 0, .005);
  for (let i = 0; i < 9; i++) {
    caixa(cpu, materiais.metal, .8, .024, .62, 0, -.32 + i * .08, .015);
  }
  caixa(cpu, materiais.preto, .78, .78, .11, 0, 0, .37);
  ventoinha(cpu, .353, 0, 0, .451);

  const ram = peca('ram', 'Memória RAM', [.41, .86, -.48], [.1, .28, .46], [.62, 1.49, .63]);
  for (const x of [-.18, -.06, .06, .18]) {
    caixa(ram, materiais.preto, .077, 1.31, .48, x, 0, 0);
    caixa(ram, materiais.metal, .081, 1.21, .26, x, -.004, .192);
    caixa(ram, materiais.luz, .074, 1.06, .055, x, .048, .339);
  }

  const gpu = peca('gpu', 'Placa de vídeo', [-.27, -.57, .299], [.08, .05, .44], [2.95, .63, .95]);
  caixa(gpu, materiais.trilha, 2.78, .08, .76, 0, .235, -.029);
  caixa(gpu, materiais.chassi, 2.85, .47, .77, 0, 0, 0);
  caixa(gpu, materiais.metal, 2.88, .048, .69, 0, .261, -.024);
  caixa(gpu, materiais.luz, 2.57, .038, .035, .009, .219, .394);
  caixa(gpu, materiais.borda, .105, .47, .43, -1.39, 0, .164);
  for (const x of [-.88, 0, .88]) {
    ventoinha(gpu, .211, x, -.005, .4);
  }

  const fonte = peca('fonte', 'Fonte', [-.84, -1.6, .37], [0, -.012, .48], [1.71, .8, 1]);
  caixa(fonte, materiais.lateral, 1.63, .72, .94, 0, 0, 0);
  caixa(fonte, materiais.chassi, 1.51, .584, .032, 0, 0, .476);
  caixa(fonte, materiais.metal, 1.49, .019, .017, 0, .31, .488);
  caixa(fonte, materiais.borda, .05, .43, .013, -.635, 0, .493);
  for (let i = 0; i < 9; i++) {
    caixa(fonte, materiais.preto, .033, .266, .017, -.394 + i * .086, .01, .496);
  }
  caixa(chassi, materiais.chassi, .89, .31, .85, .925, -1.75, -.235);

  const vidro = caixa(chassi, materiais.vidro, 3.57, 4.04, .009, 0, 0, 1.067);
  vidro.renderOrder = 2;
  return { pc, pecas };
}

export function iluminar(cena) {
  const ambiente = new THREE.HemisphereLight(0xcfe4ff, 0x303b53, 2.16);
  const principal = new THREE.DirectionalLight(0xf5f8ff, 3.1);
  principal.position.set(-3.8, 6.3, 6.5);
  const lateral = new THREE.DirectionalLight(0x99c7ff, 2.18);
  lateral.position.set(4.1, 2.3, -2.5);
  cena.add(ambiente, principal, lateral);
}

export function ajustarRenderizador(renderer) {
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.13;
}

export function iniciarCena({ cena, canvas, botoes, dialogo, destacar, abrir, usarImagem, pausa }) {
  const contexto = canvas.getContext('webgl2', { alpha: true, antialias: true });
  if (!contexto) return;

  const renderer = new THREE.WebGLRenderer({ canvas, context: contexto, alpha: true, antialias: true });
  ajustarRenderizador(renderer);
  const mundo = new THREE.Scene();
  const { pc, pecas } = criarComputador();
  mundo.add(pc);
  iluminar(mundo);

  const camera = new THREE.PerspectiveCamera(33, 1, .1, 40);
  const posicaoInicial = new THREE.Vector3(4.75, 2.32, 8.44);
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
  controles.target.set(0, -.02, 0);
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

  function movimentoReduzido() {
    return preferencia.matches || document.documentElement.dataset.reduzirMovimento === 'true';
  }

  function agendar() {
    if (ativo && visivel && !document.hidden && quadroPendente === undefined) {
      quadroPendente = requestAnimationFrame(quadro);
    }
  }

  function marcar() {
    precisaRenderizar = true;
    agendar();
  }

  function quadro(tempo) {
    quadroPendente = undefined;
    if (!ativo || !visivel || document.hidden) {
      tempoAnterior = undefined;
      return;
    }

    const angulo = controles.getAzimuthalAngle();
    if (angulo < controles.minAzimuthAngle + .035) sentido = -1;
    if (angulo > controles.maxAzimuthAngle - .035) sentido = 1;
    controles.autoRotateSpeed = .56 * sentido;
    controles.autoRotate = !pausado && !movimentoReduzido() && !ponteiroNaCena
      && !cena.contains(document.activeElement) && !dialogo.open;
    const intervalo = Math.min((tempo - (tempoAnterior ?? tempo)) / 1000, .05);
    tempoAnterior = tempo;
    const moveu = controles.update(intervalo);

    if (moveu || precisaRenderizar) {
      for (const [categoria, botao] of botoes) {
        pecas.get(categoria).userData.contorno.visible = botao.hasAttribute('data-destaque');
      }
      renderer.render(mundo, camera);
      projetar();
      precisaRenderizar = false;
    }

    if (controles.autoRotate || moveu) agendar();
    else tempoAnterior = undefined;
  }

  function redimensionar() {
    const largura = cena.clientWidth;
    const altura = cena.clientHeight;
    if (!largura || !altura) return;
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(largura, altura, false);
    marcar();
  }

  function atualizarPausa() {
    const reduzido = movimentoReduzido();
    controles.enableDamping = !reduzido;
    pausa.hidden = reduzido;
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
  const observadorGaveta = new MutationObserver(agendar);
  observadorGaveta.observe(dialogo, { attributes: true, attributeFilter: ['open'] });

  controles.addEventListener('change', marcar);
  cena.addEventListener('pointerenter', evento => {
    ponteiroNaCena = evento.pointerType !== 'touch';
  }, { signal });
  cena.addEventListener('pointerleave', () => {
    ponteiroNaCena = false;
    agendar();
  }, { signal });
  cena.addEventListener('focusin', evento => {
    if (evento.target.hasAttribute('data-fora')) {
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
  const areas = [...pecas.values()].flatMap(peca => peca.children.filter(filho => filho.isMesh || filho.isGroup));
  function pecaSobPonteiro(evento) {
    const retangulo = canvas.getBoundingClientRect();
    ponteiro.set(
      (evento.clientX - retangulo.left) * 2 / retangulo.width - 1,
      1 - (evento.clientY - retangulo.top) * 2 / retangulo.height,
    );
    raio.setFromCamera(ponteiro, camera);
    let objeto = raio.intersectObjects(areas, true)[0]?.object;
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
  atualizarPausa();
  return marcar;
}
