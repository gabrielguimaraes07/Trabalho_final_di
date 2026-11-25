export function iniciarNavegacao(cabecalho) {
  const botao = cabecalho.querySelector('.nav-toggle');
  const painel = document.querySelector('#nav-painel');
  const recolher = painel.querySelector('.nav-recolher');
  const desktop = matchMedia('(min-width: 60rem)');
  const compacto = matchMedia('(max-width: 75rem)');
  const barra = document.querySelector('[data-barra-fixa]');
  const raiz = document.documentElement;
  const dica = document.createElement('span');
  dica.className = 'nav-dica';
  dica.hidden = true;
  dica.setAttribute('aria-hidden', 'true');
  document.body.append(dica);
  raiz.setAttribute('data-nav-pronta', '');
  let aberto = false;
  let preferencia;
  let fecharDica;
  try {
    const valor = localStorage.getItem('ggtech-menu-recolhido');
    if (valor !== null) preferencia = valor === 'true';
  } catch {}

  function medir() {
    raiz.style.setProperty('--cabecalho-altura', cabecalho.getBoundingClientRect().height + 'px');
    raiz.style.setProperty('--barra-altura', (barra?.getBoundingClientRect().height ?? 0) + 'px');
  }

  function atualizar() {
    const recolhida = desktop.matches && (preferencia ?? compacto.matches);
    raiz.dataset.navRecolhida = String(recolhida);
    botao.hidden = desktop.matches;
    painel.hidden = !desktop.matches && !aberto;
    recolher.hidden = !desktop.matches;
    recolher.setAttribute('aria-expanded', String(!recolhida));
    const rotulo = recolhida ? 'Expandir menu lateral' : 'Recolher menu lateral';
    recolher.setAttribute('aria-label', rotulo);
    recolher.querySelector('.nav-texto').textContent = rotulo;
    botao.setAttribute('aria-expanded', String(!desktop.matches && aberto));
    dica.hidden = true;
    medir();
  }

  function fechar(devolverFoco = false) {
    aberto = false;
    atualizar();
    if (devolverFoco) botao.focus();
  }

  botao.addEventListener('click', () => {
    if (aberto) fechar(true);
    else {
      aberto = true;
      atualizar();
      (painel.querySelector('[aria-current="page"]') ?? painel.querySelector('a')).focus();
    }
  });

  recolher.addEventListener('click', () => {
    preferencia = raiz.dataset.navRecolhida !== 'true';
    try { localStorage.setItem('ggtech-menu-recolhido', String(preferencia)); } catch {}
    atualizar();
    mostrarDica(recolher);
  });

  function mostrarDica(controle) {
    if (!controle || raiz.dataset.navRecolhida !== 'true') return;
    clearTimeout(fecharDica);
    const limites = controle.getBoundingClientRect();
    dica.textContent = controle.querySelector('.nav-texto').textContent;
    dica.style.left = limites.right + 10 + 'px';
    dica.style.top = limites.top + 5 + 'px';
    dica.hidden = false;
  }

  function agendarFechamentoDaDica() {
    clearTimeout(fecharDica);
    fecharDica = setTimeout(() => { dica.hidden = true; }, 140);
  }

  painel.addEventListener('pointerover', ({ target, pointerType }) => {
    if (pointerType !== 'touch') mostrarDica(target.closest('a, button'));
  });
  painel.addEventListener('pointerleave', agendarFechamentoDaDica);
  dica.addEventListener('pointerenter', () => clearTimeout(fecharDica));
  dica.addEventListener('pointerleave', agendarFechamentoDaDica);
  painel.addEventListener('focusin', ({ target }) => mostrarDica(target.closest('a, button')));
  painel.addEventListener('focusout', () => { dica.hidden = true; });
  painel.addEventListener('scroll', () => { dica.hidden = true; }, { passive: true });

  document.addEventListener('keydown', evento => {
    if (evento.key !== 'Escape' || evento.defaultPrevented || document.querySelector('dialog[open]')) return;
    if (aberto) {
      evento.preventDefault();
      fechar(true);
    } else if (!dica.hidden) dica.hidden = true;
  });

  document.addEventListener('click', ({ target }) => {
    if (aberto && !painel.contains(target) && !botao.contains(target) && !target.closest('dialog')) fechar(painel.contains(document.activeElement));
  });
  desktop.addEventListener('change', () => {
    const foco = document.activeElement;
    fechar(!desktop.matches && painel.contains(foco));
    if (desktop.matches && foco === botao) (painel.querySelector('[aria-current="page"]') ?? painel.querySelector('a')).focus();
  });
  compacto.addEventListener('change', atualizar);

  document.addEventListener('focusin', ({ target }) => {
    if (aberto && !painel.contains(target) && target !== botao) fechar();
    if (!target.closest('main, footer') || target.closest('dialog')) return;
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
