export function iniciarCarrossel(carrossel) {
  const controles = carrossel.querySelector('.carrossel-controles');
  const rotacao = controles.querySelector('.carrossel-pausa');
  const slides = [...carrossel.querySelectorAll('.carrossel-slide')];
  const indicadores = [...controles.querySelectorAll('.carrossel-indicador')];
  const status = carrossel.querySelector('.carrossel-status');
  const preferencia = matchMedia('(prefers-reduced-motion: reduce)');
  let atual = 0;
  let pausado = false;
  let visivel = false;
  let ponteiroSobre = false;
  let temporizador;

  function programarRotacao() {
    clearTimeout(temporizador);
    const reduzido = preferencia.matches || document.documentElement.dataset.reduzirMovimento === 'true';
    rotacao.hidden = reduzido;
    rotacao.textContent = pausado ? 'Retomar carrossel' : 'Pausar carrossel';

    if (!reduzido && !pausado && visivel && !ponteiroSobre && !document.hidden) {
      temporizador = setTimeout(() => mostrar(atual + 1), 6500);
    }
  }

  function mostrar(indice, manual = false) {
    if (manual) pausado = true;
    const proximo = (indice + slides.length) % slides.length;

    if (proximo !== atual) {
      slides[atual].hidden = true;
      indicadores[atual].removeAttribute('aria-current');
      atual = proximo;
      slides[atual].hidden = false;
      indicadores[atual].setAttribute('aria-current', 'true');

      if (manual) {
        status.textContent = slides[atual].getAttribute('aria-label') + '. '
          + slides[atual].querySelector('h3').textContent + '.';
      }
    }

    programarRotacao();
  }

  rotacao.addEventListener('click', () => {
    pausado = !pausado;
    programarRotacao();
  });

  for (const botao of controles.querySelectorAll('[data-passo]')) {
    botao.addEventListener('click', () => mostrar(atual + Number(botao.dataset.passo), true));
  }

  for (const [indice, indicador] of indicadores.entries()) {
    indicador.addEventListener('click', () => mostrar(indice, true));
  }

  carrossel.addEventListener('keydown', evento => {
    if (evento.altKey || evento.ctrlKey || evento.metaKey || evento.shiftKey) return;
    if (evento.key === 'ArrowLeft' || evento.key === 'ArrowRight') {
      evento.preventDefault();
      mostrar(atual + (evento.key === 'ArrowLeft' ? -1 : 1), true);
    }
  });

  carrossel.addEventListener('focusin', evento => {
    if (carrossel.contains(evento.relatedTarget)) return;
    // Um clique no botão de pausa usa o estado que a pessoa viu antes do clique.
    if (evento.target === rotacao && !rotacao.matches(':focus-visible')) return;
    pausado = true;
    programarRotacao();
  });

  carrossel.addEventListener('pointerenter', evento => {
    ponteiroSobre = evento.pointerType !== 'touch';
    programarRotacao();
  });

  carrossel.addEventListener('pointerleave', () => {
    ponteiroSobre = false;
    programarRotacao();
  });

  const observadorTela = new IntersectionObserver(([entrada]) => {
    visivel = entrada.intersectionRatio >= .15;
    programarRotacao();
  }, { threshold: .15 });
  observadorTela.observe(carrossel);

  const observadorMovimento = new MutationObserver(programarRotacao);
  observadorMovimento.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-reduzir-movimento'],
  });

  preferencia.addEventListener('change', programarRotacao);
  document.addEventListener('visibilitychange', programarRotacao);
  programarRotacao();
  controles.hidden = false;
}
