let biblioteca;

export function carregarGSAP() {
  biblioteca ??= import('gsap').then(modulo => modulo.gsap).catch(() => null);
  return biblioteca;
}

export async function carregarScrollTrigger() {
  const gsap = await carregarGSAP();
  if (!gsap) return;
  const { ScrollTrigger } = await import('gsap/gatilho-rolagem');
  gsap.registerPlugin(ScrollTrigger);
  return ScrollTrigger;
}

export function iniciarRevelacaoDeTitulos(titulos) {
  const preferencia = matchMedia('(prefers-reduced-motion: reduce)');
  const gatilhos = new Map();
  const divisoes = new Map();
  const revelados = new WeakSet();
  let dependencias;

  function movimentoReduzido() {
    return preferencia.matches || document.documentElement.dataset.reduzirMovimento === 'true';
  }

  function restaurarTitulo(titulo) {
    divisoes.get(titulo)?.revert();
    divisoes.delete(titulo);
  }

  async function atualizar() {
    if (movimentoReduzido()) {
      for (const gatilho of gatilhos.values()) gatilho.kill();
      gatilhos.clear();
      for (const titulo of divisoes.keys()) restaurarTitulo(titulo);
      return;
    }

    dependencias ??= Promise.all([carregarGSAP(), carregarScrollTrigger(), import('gsap/divisor-texto')])
      .catch(() => []);
    const [gsap, ScrollTrigger, modulo] = await dependencias;
    if (movimentoReduzido() || !gsap || !ScrollTrigger || !modulo) return;
    const { SplitText } = modulo;
    gsap.registerPlugin(SplitText);

    for (const titulo of titulos) {
      if (revelados.has(titulo) || gatilhos.has(titulo)) continue;
      if (titulo.getBoundingClientRect().top < innerHeight) {
        revelados.add(titulo);
        continue;
      }
      const gatilho = ScrollTrigger.create({
        trigger: titulo,
        start: 'top bottom',
        onEnter(gatilhoAtivo) {
          queueMicrotask(() => {
            gatilhoAtivo.kill();
            gatilhos.delete(titulo);
          });
          if (movimentoReduzido()) return;
          revelados.add(titulo);
          const divisao = SplitText.create(titulo, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            aria: 'auto',
            onSplit: partes => gsap.from(partes.lines, {
              autoAlpha: 0,
              yPercent: 24,
              duration: .58,
              stagger: .08,
              ease: 'power2.out',
              onComplete: () => queueMicrotask(() => restaurarTitulo(titulo)),
            }),
          });
          divisoes.set(titulo, divisao);
        },
      });
      gatilhos.set(titulo, gatilho);
    }
  }

  const observador = new MutationObserver(atualizar);
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduzir-movimento'] });
  preferencia.addEventListener('change', atualizar);
  atualizar();
}
