export function configurarGaveta(dialogo, fechar, aoFechar) {
  let origem;

  fechar.addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('click', evento => {
    if (evento.target !== dialogo) return;
    const limites = dialogo.getBoundingClientRect();
    if (evento.clientX < limites.left || evento.clientX > limites.right
        || evento.clientY < limites.top || evento.clientY > limites.bottom) dialogo.close();
  });

  dialogo.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') {
      evento.preventDefault();
      dialogo.close();
      return;
    }
    if (evento.key !== 'Tab') return;
    const controles = [...dialogo.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href], select:not(:disabled)')]
      .filter(controle => controle.tabIndex >= 0 && controle.getClientRects().length);
    const [primeiro] = controles;
    const ultimo = controles.at(-1);
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  });

  dialogo.addEventListener('close', () => {
    if (dialogo.open) return;
    origem?.focus({ preventScroll: true });
    origem = undefined;
    aoFechar?.();
  });

  return function abrir(acionador) {
    origem = acionador;
    dialogo.showModal();
    dialogo.scrollTop = 0;
    fechar.focus();
  };
}
