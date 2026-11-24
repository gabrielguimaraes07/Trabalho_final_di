const painel = `
  <dialog class="acessibilidade-dialogo" id="painel-acessibilidade" aria-labelledby="acessibilidade-titulo">
    <form class="acessibilidade-form">
      <header class="acessibilidade-cabecalho">
        <span class="acessibilidade-sinal" aria-hidden="true">
          <span class="icone-ui icone-acessibilidade" aria-hidden="true"></span>
        </span>
        <div>
          <h2 id="acessibilidade-titulo">Acessibilidade</h2>
          <p>Ajuste como você vê e usa o site.</p>
        </div>
        <button class="botao-contorno acessibilidade-fechar" type="button" aria-label="Fechar acessibilidade" autofocus>
          <span class="icone-simbolo" aria-hidden="true">×</span>
        </button>
      </header>

      <div class="acessibilidade-grade">
        <div class="acessibilidade-ajustes">
          <fieldset class="acessibilidade-cartao">
            <legend>Tema</legend>
            <div class="acessibilidade-opcoes acessibilidade-temas">
              <label><input type="radio" name="tema" value="dark" checked> Escuro</label>
              <label><input type="radio" name="tema" value="light"> Claro</label>
              <label><input type="radio" name="tema" value="auto" aria-describedby="tema-descricao"> Automático</label>
            </div>
            <p id="tema-descricao">O tema automático segue o seu dispositivo.</p>
          </fieldset>

          <fieldset class="acessibilidade-cartao">
            <legend>Tamanho do texto</legend>
            <div class="acessibilidade-opcoes acessibilidade-tamanhos">
              <label><input type="radio" name="tamanhoTexto" value="menor"><span>A− <small>90%</small></span></label>
              <label><input type="radio" name="tamanhoTexto" value="normal" checked><span>A <small>100%</small></span></label>
              <label><input type="radio" name="tamanhoTexto" value="maior"><span>A+ <small>115%</small></span></label>
              <label><input type="radio" name="tamanhoTexto" value="maximo"><span>A++ <small>130%</small></span></label>
            </div>
          </fieldset>

          <fieldset class="acessibilidade-cartao">
            <legend>Leitura e movimento</legend>
            <label class="acessibilidade-interruptor">
              <span><strong id="pref-contraste">Alto contraste</strong><span id="pref-contraste-texto">Bordas fortes e superfícies sólidas.</span></span>
              <input type="checkbox" role="switch" name="contraste" aria-labelledby="pref-contraste" aria-describedby="pref-contraste-texto">
            </label>
            <label class="acessibilidade-interruptor">
              <span><strong id="pref-espacamento">Espaçamento de texto</strong><span id="pref-espacamento-texto">Mais espaço entre letras, palavras e linhas.</span></span>
              <input type="checkbox" role="switch" name="espacamento" aria-labelledby="pref-espacamento" aria-describedby="pref-espacamento-texto">
            </label>
            <label class="acessibilidade-interruptor">
              <span><strong id="pref-links">Sublinhar links</strong><span id="pref-links-texto">Identifica os links pelo sublinhado.</span></span>
              <input type="checkbox" role="switch" name="sublinharLinks" aria-labelledby="pref-links" aria-describedby="pref-links-texto">
            </label>
            <label class="acessibilidade-interruptor">
              <span><strong id="pref-movimento">Reduzir movimento</strong><span id="pref-movimento-texto">Pausa o giro do PC e a troca automática de imagens.</span><span id="pref-movimento-sistema" hidden>O dispositivo também solicita menos movimento.</span></span>
              <input type="checkbox" role="switch" name="reduzirMovimento" aria-labelledby="pref-movimento" aria-describedby="pref-movimento-texto pref-movimento-sistema">
            </label>
            <label class="acessibilidade-interruptor">
              <span><strong id="pref-atalho">Desativar atalho de busca</strong><span id="pref-atalho-texto">Impede que a tecla / leve o foco à busca.</span></span>
              <input type="checkbox" role="switch" name="desativarAtalhoBusca" aria-labelledby="pref-atalho" aria-describedby="pref-atalho-texto">
            </label>
          </fieldset>
        </div>

        <aside class="acessibilidade-previa" aria-labelledby="acessibilidade-previa">
          <h3 id="acessibilidade-previa">Prévia</h3>
          <div class="acessibilidade-amostra">
            <p class="acessibilidade-amostra-titulo">Monte seu primeiro PC sem medo.</p>
            <p>Conheça as peças e veja o estoque.</p>
            <a href="./index.html#pecas">Explorar peças</a>
          </div>
        </aside>
      </div>

      <footer class="acessibilidade-rodape">
        <button class="botao-contorno" type="reset">Restaurar padrão</button>
        <p class="somente-leitores" role="status"></p>
      </footer>
    </form>
  </dialog>
`;

export function iniciarAcessibilidade(acionador) {
  document.body.insertAdjacentHTML('beforeend', painel);
  const raiz = document.documentElement;
  const dialogo = document.querySelector('#painel-acessibilidade');
  const formulario = dialogo.querySelector('form');
  const fechar = formulario.querySelector('.acessibilidade-fechar');
  const restaurar = formulario.querySelector('[type="reset"]');
  const previaLink = formulario.querySelector('.acessibilidade-amostra a');
  const status = formulario.querySelector('[role="status"]');
  const movimentoDoSistema = matchMedia('(prefers-reduced-motion: reduce)');
  const textoMovimentoDoSistema = formulario.querySelector('#pref-movimento-sistema');
  const entradaMovimento = formulario.elements.reduzirMovimento;
  const interruptores = formulario.querySelectorAll('input[type="checkbox"]');

  formulario.elements.tema.value = raiz.dataset.tema || 'dark';
  formulario.elements.tamanhoTexto.value = raiz.dataset.tamanhoTexto || 'normal';
  for (const interruptor of interruptores) {
    interruptor.checked = raiz.dataset[interruptor.name] === 'true';
  }

  function salvarPreferencias() {
    const preferencias = {
      tema: formulario.elements.tema.value,
      tamanhoTexto: formulario.elements.tamanhoTexto.value,
    };
    raiz.dataset.tema = preferencias.tema;
    raiz.dataset.tamanhoTexto = preferencias.tamanhoTexto;

    for (const interruptor of interruptores) {
      const { name, checked } = interruptor;
      preferencias[name] = checked;
      if (checked) raiz.dataset[name] = 'true';
      else delete raiz.dataset[name];
    }

    try {
      localStorage.setItem('ggtech-acessibilidade', JSON.stringify(preferencias));
    } catch {}
  }

  function atualizarAvisoMovimento() {
    const reduzido = movimentoDoSistema.matches;
    textoMovimentoDoSistema.hidden = !reduzido;
    entradaMovimento.setAttribute('aria-describedby', reduzido
      ? 'pref-movimento-texto pref-movimento-sistema'
      : 'pref-movimento-texto');
  }

  function fecharPainel() {
    dialogo.close();
    acionador.focus({ preventScroll: true });
  }

  formulario.addEventListener('change', () => {
    salvarPreferencias();
    status.textContent = '';
  });
  formulario.addEventListener('reset', evento => {
    evento.preventDefault();
    formulario.elements.tema.value = 'dark';
    formulario.elements.tamanhoTexto.value = 'normal';
    for (const interruptor of interruptores) interruptor.checked = false;
    salvarPreferencias();
    status.textContent = 'Preferências restauradas.';
  });
  formulario.addEventListener('submit', evento => evento.preventDefault());

  acionador.addEventListener('click', () => {
    status.textContent = '';
    dialogo.showModal();
    dialogo.scrollTop = 0;
    fechar.focus();
  });
  fechar.addEventListener('click', fecharPainel);
  previaLink.addEventListener('click', evento => {
    if (!evento.metaKey && !evento.ctrlKey && !evento.shiftKey && !evento.altKey) dialogo.close();
  });
  dialogo.addEventListener('click', evento => {
    if (evento.target !== dialogo) return;
    const limites = dialogo.getBoundingClientRect();
    if (evento.clientX < limites.left || evento.clientX > limites.right
        || evento.clientY < limites.top || evento.clientY > limites.bottom) fecharPainel();
  });
  dialogo.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') {
      evento.preventDefault();
      fecharPainel();
    } else if (evento.key === 'Tab' && evento.shiftKey && document.activeElement === fechar) {
      evento.preventDefault();
      restaurar.focus();
    } else if (evento.key === 'Tab' && !evento.shiftKey && document.activeElement === restaurar) {
      evento.preventDefault();
      fechar.focus();
    }
  });

  movimentoDoSistema.addEventListener('change', atualizarAvisoMovimento);
  atualizarAvisoMovimento();
  acionador.setAttribute('aria-controls', dialogo.id);
  acionador.hidden = false;
}
