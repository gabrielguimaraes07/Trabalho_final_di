export function iniciarTema(opcoes) {
  const raiz = document.documentElement;
  const acionador = opcoes.querySelector('summary');
  const escolhas = opcoes.querySelectorAll('input[name="tema"]');

  for (const escolha of escolhas) {
    escolha.checked = escolha.value === (raiz.dataset.theme || 'dark');
    escolha.addEventListener('change', () => {
      raiz.dataset.theme = escolha.value;
      try {
        localStorage.setItem('ggtech-tema', escolha.value);
      } catch {
        // A página ainda aplica a escolha quando o navegador impede salvá-la.
      }
    });
  }

  opcoes.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && opcoes.open) {
      evento.preventDefault();
      opcoes.open = false;
      acionador.focus();
    }
  });

  document.addEventListener('click', evento => {
    if (opcoes.open && !opcoes.contains(evento.target)) opcoes.open = false;
  });

  opcoes.hidden = false;
}
