// Carregado no cabeçalho para aplicar as preferências antes da primeira pintura.
(() => {
  const raiz = document.documentElement;
  const temaDoSistema = matchMedia('(prefers-color-scheme: light)');
  let preferencias = {};
  let temaAnterior;

  try {
    temaAnterior = localStorage.getItem('ggtech-tema');
    preferencias = JSON.parse(localStorage.getItem('ggtech-acessibilidade')) ?? {};
  } catch {
    // O site usa as preferências padrão enquanto o armazenamento estiver indisponível.
  }

  const tema = preferencias.tema ?? temaAnterior;
  raiz.dataset.tema = ['dark', 'light', 'auto'].includes(tema) ? tema : 'dark';
  const tamanho = preferencias.tamanhoTexto;
  if (['menor', 'normal', 'maior', 'maximo'].includes(tamanho)) raiz.dataset.tamanhoTexto = tamanho;

  for (const chave of ['contraste', 'espacamento', 'fonteLeitura', 'sublinharLinks', 'reduzirMovimento']) {
    if (preferencias[chave] === true) raiz.dataset[chave] = 'true';
  }

  function atualizarTema() {
    const claro = raiz.dataset.tema === 'light' || (raiz.dataset.tema === 'auto' && temaDoSistema.matches);
    raiz.dataset.theme = claro ? 'light' : 'dark';
  }

  atualizarTema();
  const observadorTema = new MutationObserver(atualizarTema);
  observadorTema.observe(raiz, { attributes: true, attributeFilter: ['data-tema'] });
  temaDoSistema.addEventListener('change', atualizarTema);
})();
