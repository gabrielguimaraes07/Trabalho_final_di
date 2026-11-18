import { Vector3 } from 'three';

export function projetorHotspots(botoes, pecas, camera) {
  const ponto = new Vector3();

  return function projetar() {
    camera.updateMatrixWorld();
    for (const [categoria, botao] of botoes) {
      const peca = pecas.get(categoria);
      ponto.copy(peca.userData.ponto).applyMatrix4(peca.matrixWorld).project(camera);
      const fora = Math.abs(ponto.x) > .95 || Math.abs(ponto.y) > .95 || ponto.z > 1;
      botao.toggleAttribute('data-fora', fora);
      botao.style.left = (ponto.x * 50 + 50) + '%';
      botao.style.top = (50 - ponto.y * 50) + '%';
    }
  };
}
