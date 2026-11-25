import * as THREE from 'three';
import { categorias } from './estoque.js?v=1.0-final';

export const CAMERA_PC = { fov: 33, posicao: [4.75, 2.32, 8.44], alvo: [0, -.02, 0] };

const perfil = new THREE.Shape();
perfil.moveTo(-.45, -.45);
perfil.lineTo(.45, -.45);
perfil.lineTo(.45, .45);
perfil.lineTo(-.45, .45);
perfil.closePath();
const carenagem = new THREE.ExtrudeGeometry(perfil, {
  depth: .9, bevelSize: .05, bevelThickness: .05, bevelSegments: 2, curveSegments: 2,
});
carenagem.center();

const pasPerfil = new THREE.Shape();
pasPerfil.moveTo(-.1, .08);
pasPerfil.bezierCurveTo(-.32, .22, -.3, .56, .02, .86);
pasPerfil.bezierCurveTo(.21, .98, .38, .76, .28, .6);
pasPerfil.quadraticCurveTo(.04, .36, .11, .12);
pasPerfil.closePath();
const paCurva = new THREE.ExtrudeGeometry(pasPerfil, {
  depth: .038, bevelEnabled: false, curveSegments: 5,
});

const geometrias = {
  caixa: new THREE.BoxGeometry(1, 1, 1),
  disco: new THREE.CylinderGeometry(1, 1, 1, 32),
  aro: new THREE.TorusGeometry(1, .035, 8, 36),
};

const metal = (color, metalness = .36, roughness = .46) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
const materiais = {
  chassi: metal(0x252f3b, .48),
  lateral: metal(0x151e2a),
  metal: metal(0x606e81, .6, .32),
  borda: metal(0x8499b2, .5, .31),
  placa: metal(0x1c2c36, .15),
  trilha: metal(0x345367),
  contato: metal(0x8c754b, .56, .37),
  preto: metal(0x0b0e16, .18),
  ventoinha: metal(0x425671, .26, .37),
  luz: new THREE.MeshStandardMaterial({
    color: 0x2997ff, emissive: 0x2997ff, emissiveIntensity: .72, roughness: .38,
  }),
  vidro: new THREE.MeshPhysicalMaterial({
    color: 0xa7c3eb, roughness: .16, opacity: .075, transparent: true, depthWrite: false,
  }),
};

function caixa(pai, material, largura, altura, fundo, x, y, z, geometria = geometrias.caixa) {
  const malha = new THREE.Mesh(geometria, material);
  malha.scale.set(largura, altura, fundo);
  malha.position.set(x, y, z);
  pai.add(malha);
  return malha;
}

function disco(pai, material, raio, espessura, z, x = 0, y = 0) {
  const malha = new THREE.Mesh(geometrias.disco, material);
  malha.scale.set(raio, espessura, raio);
  malha.rotation.x = Math.PI / 2;
  malha.position.set(x, y, z);
  pai.add(malha);
}

function ventoinha(pai, luz, raio, x, y, z, rotacao = 0) {
  const grupo = new THREE.Group();
  grupo.position.set(x, y, z);
  grupo.rotation.y = rotacao;
  pai.add(grupo);

  disco(grupo, materiais.preto, raio, raio * .23, 0);
  const aro = new THREE.Mesh(geometrias.aro, luz);
  aro.scale.setScalar(raio * .94);
  aro.position.z = raio * .14;
  grupo.add(aro);
  const rotor = new THREE.Group();
  grupo.add(rotor);
  const pas = new THREE.InstancedMesh(paCurva, materiais.ventoinha, 7);
  const pa = new THREE.Object3D();
  pa.scale.setScalar(raio);
  pa.position.z = raio * .16;
  for (let i = 0; i < 7; i++) {
    const angulo = i * Math.PI * 2 / 7;
    pa.rotation.z = angulo;
    pa.updateMatrix();
    pas.setMatrixAt(i, pa.matrix);
  }
  rotor.add(pas);
  disco(grupo, materiais.metal, raio * .27, raio * .13, raio * .16);
  disco(grupo, materiais.preto, raio * .13, raio * .09, raio * .24);
  return rotor;
}

export function criarComputador() {
  const pc = new THREE.Group();
  const pecas = new Map();
  const rotores = [];
  const luz = materiais.luz.clone();
  const volumes = new THREE.LineBasicMaterial({ color: 0x2997ff, transparent: true, opacity: .9 });

  function peca(categoria, posicao, ponto, tamanho, centro = [0, 0, 0]) {
    const grupo = new THREE.Group();
    grupo.name = categorias[categoria].nome;
    grupo.position.fromArray(posicao);
    grupo.userData.categoria = categoria;
    grupo.userData.ponto = new THREE.Vector3(...ponto);
    grupo.userData.tamanho = Math.max(...tamanho);
    const volume = new THREE.BoxGeometry(...tamanho);
    const contorno = new THREE.LineSegments(new THREE.EdgesGeometry(volume), volumes);
    volume.dispose();
    contorno.position.fromArray(centro);
    contorno.visible = false;
    grupo.userData.contorno = contorno;
    grupo.add(contorno);
    pc.add(grupo);
    pecas.set(categoria, grupo);
    return grupo;
  }

  function adicionarVentoinha(pai, ...medidas) {
    rotores.push(ventoinha(pai, luz, ...medidas));
  }

  const chassi = peca('gabinete', [0, 0, 0], [1.15, 2.24, .72], [3.9, 4.6, 2.2]);
  caixa(chassi, materiais.chassi, 3.8, .16, 2.14, 0, 2.14, 0, carenagem);
  caixa(chassi, materiais.metal, 3.56, .035, 1.95, 0, 2.23, -.012);
  caixa(chassi, materiais.chassi, 3.8, .15, 2.15, 0, -2.13, 0, carenagem);
  caixa(chassi, materiais.lateral, 3.57, 4.14, .1, 0, 0, -1.03);
  caixa(chassi, materiais.lateral, .1, 4.15, 1.92, -1.84, 0, -.025);
  caixa(chassi, materiais.preto, .11, 4.12, 1.89, 1.84, 0, -.032);
  for (const x of [-1.82, 1.82]) {
    for (const z of [-.99, 1.017]) {
      caixa(chassi, materiais.chassi, .16, 4.22, .13, x, .01, z);
      caixa(chassi, materiais.preto, .37, .16, .3, x * .86, -2.28, z * .82);
    }
    caixa(chassi, materiais.borda, .035, 4.14, .025, x * .96, .03, 1.084);
    for (const y of [-1.97, 1.97]) disco(chassi, materiais.metal, .035, .025, 1.097, x * .95, y);
  }
  caixa(chassi, materiais.borda, 3.59, .022, .035, 0, 2.044, 1.067);
  caixa(chassi, materiais.borda, 3.59, .022, .035, 0, -2.044, 1.067);
  caixa(chassi, materiais.metal, 3.47, .032, .05, 0, -1.99, 1.02);

  for (let i = 0; i < 13; i++) {
    caixa(chassi, materiais.preto, .08, .022, .66, .22 + i * .1, 2.251, -.22);
  }
  caixa(chassi, luz, .24, .024, .055, 1.43, 2.254, .7);
  caixa(chassi, materiais.preto, .12, .025, .077, 1.12, 2.253, .7);

  const fans = peca('ventoinhas', [0, 0, 0], [2.04, .35, -.006], [.3, 3.5, 1.2], [1.96, .02, 0]);
  for (const y of [1.21, .02, -1.17]) {
    adicionarVentoinha(fans, .52, 1.91, y, -.022, Math.PI / 2);
  }
  adicionarVentoinha(fans, .36, -1.74, 1.32, -.33, Math.PI / 2);

  const placa = peca('placa-mae', [0, 0, 0], [-.33, 1.72, -.61], [2.5, 2.84, .3], [-.49, .34, -.77]);
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

  const cpu = peca('cpu', [-1.13, .32, -.63], [-.23, -.21, .22], [.77, .77, .3]);
  caixa(cpu, materiais.trilha, .74, .74, .14, 0, 0, .01);
  caixa(cpu, materiais.borda, .57, .56, .11, 0, 0, .14);
  caixa(cpu, materiais.metal, .49, .48, .044, 0, 0, .207, carenagem);
  caixa(cpu, materiais.contato, .58, .043, .035, 0, -.31, .106);
  caixa(cpu, luz, .35, .018, .022, 0, -.23, .193);

  const cooler = peca('cooler', [-.69, .94, -.23], [.07, .16, .53], [.84, .84, 1.03]);
  caixa(cooler, materiais.chassi, .77, .76, .55, 0, 0, .005);
  for (let i = 0; i < 9; i++) {
    caixa(cooler, materiais.metal, .8, .024, .62, 0, -.32 + i * .08, .015);
  }
  caixa(cooler, materiais.preto, .78, .78, .11, 0, 0, .37);
  adicionarVentoinha(cooler, .353, 0, 0, .451);

  const ram = peca('ram', [.41, .86, -.48], [.1, .28, .46], [.62, 1.49, .63]);
  for (const x of [-.18, -.06, .06, .18]) {
    caixa(ram, materiais.preto, .077, 1.31, .48, x, 0, 0);
    caixa(ram, materiais.metal, .081, 1.21, .26, x, -.004, .192, carenagem);
    caixa(ram, materiais.contato, .051, .18, .16, x, -.63, .078);
    caixa(ram, luz, .074, 1.06, .055, x, .048, .339);
  }

  const ssd = peca('armazenamento', [.36, -.08, -.54], [.18, .02, .15], [1.07, .26, .27]);
  caixa(ssd, materiais.trilha, 1.02, .21, .095, 0, 0, 0);
  caixa(ssd, materiais.chassi, .93, .165, .09, .008, 0, .081, carenagem);
  disco(ssd, materiais.metal, .033, .018, .13, -.47, 0);
  caixa(ssd, materiais.borda, .095, .16, .025, .48, 0, .106);
  caixa(ssd, luz, .64, .018, .025, -.02, .05, .131);

  const gpu = peca('gpu', [-.27, -.57, .299], [.08, .05, .44], [2.95, .63, .95]);
  caixa(gpu, materiais.trilha, 2.78, .08, .76, 0, .235, -.029);
  caixa(gpu, materiais.chassi, 2.85, .53, .77, 0, 0, 0, carenagem);
  caixa(gpu, materiais.metal, 2.88, .048, .69, 0, .261, -.024);
  caixa(gpu, luz, 2.57, .038, .035, .009, .219, .394);
  caixa(gpu, materiais.borda, .105, .47, .43, -1.39, 0, .164);
  for (const x of [-.88, 0, .88]) {
    adicionarVentoinha(gpu, .211, x, -.005, .4);
    for (const y of [-.22, .22]) disco(gpu, materiais.metal, .023, .012, .399, x + .32, y);
  }

  const fonte = peca('fonte', [-.84, -1.6, .37], [0, -.012, .48], [1.71, .8, 1]);
  caixa(fonte, materiais.lateral, 1.63, .72, .94, 0, 0, 0, carenagem);
  caixa(fonte, materiais.chassi, 1.51, .584, .032, 0, 0, .476);
  caixa(fonte, materiais.metal, 1.49, .019, .017, 0, .31, .488);
  caixa(fonte, materiais.borda, .05, .43, .013, -.635, 0, .493);
  for (let i = 0; i < 9; i++) {
    caixa(fonte, materiais.preto, .033, .266, .017, -.394 + i * .086, .01, .496);
  }
  caixa(chassi, materiais.chassi, .89, .31, .85, .925, -1.75, -.235);

  const vidro = caixa(chassi, materiais.vidro, 3.57, 4.04, .009, 0, 0, 1.067);
  vidro.renderOrder = 2;
  vidro.userData.ignorarSelecao = true;
  return { pc, pecas, rotores, luz };
}

export function iluminar(cena) {
  const ambiente = new THREE.HemisphereLight(0xddeaff, 0x3e4d68, 2.36);
  const principal = new THREE.DirectionalLight(0xf5f8ff, 3.15);
  principal.position.set(-3.8, 6.3, 6.5);
  const lateral = new THREE.DirectionalLight(0x88bdff, 2.22);
  lateral.position.set(4.1, 2.3, -2.5);
  cena.add(ambiente, principal, lateral);
}

export function ajustarRenderizador(renderer) {
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.13;
}
