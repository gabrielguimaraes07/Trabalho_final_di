export function iniciarNavegacao(cabecalho) {
  const botao = cabecalho.querySelector('.nav-toggle');
  const painel = cabecalho.querySelector('.nav-painel');
  const estreito = matchMedia('(max-width: 64rem)');
  const barra = document.querySelector('#sim-barra');
  const raiz = document.documentElement;
  let aberto = false;

  function medir() {
    raiz.style.setProperty('--cabecalho-altura', cabecalho.getBoundingClientRect().height + 'px');
    raiz.style.setProperty('--barra-altura', (barra?.getBoundingClientRect().height ?? 0) + 'px');
  }

  function atualizar() {
    botao.hidden = !estreito.matches;
    painel.hidden = estreito.matches && !aberto;
    botao.setAttribute('aria-expanded', String(estreito.matches && aberto));
    medir();
  }

  function fechar(devolverFoco = false) {
    aberto = false;
    atualizar();
    if (devolverFoco) botao.focus();
  }

  botao.addEventListener('click', () => {
    aberto = !aberto;
    atualizar();
  });
  cabecalho.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && aberto) {
      evento.preventDefault();
      fechar(true);
    }
  });
  document.addEventListener('click', ({ target }) => {
    if (aberto && !cabecalho.contains(target) && !target.closest('dialog')) fechar(painel.contains(document.activeElement));
  });
  estreito.addEventListener('change', () => {
    const foco = document.activeElement;
    fechar(estreito.matches && painel.contains(foco));
    if (!estreito.matches && foco === botao) painel.querySelector('[aria-current="page"], a').focus();
  });

  document.addEventListener('focusin', ({ target }) => {
    if (!target.closest('main, footer') || target.closest('dialog')) return;
    if (aberto) fechar();
    requestAnimationFrame(() => {
      if (document.activeElement !== target) return;
      const fimCabecalho = cabecalho.getBoundingClientRect().bottom;
      const posicaoBarra = barra?.getBoundingClientRect();
      const barraFixa = posicaoBarra?.height && posicaoBarra.top <= fimCabecalho + 2;
      const limite = (barraFixa && !barra.contains(target) ? Math.max(fimCabecalho, posicaoBarra.bottom) : fimCabecalho) + 8;
      const topo = target.getBoundingClientRect().top;
      if (topo < limite) window.scrollBy({ top: topo - limite, behavior: 'instant' });
    });
  });

  atualizar();
  const observador = new ResizeObserver(medir);
  observador.observe(cabecalho);
  if (barra) observador.observe(barra);
}
