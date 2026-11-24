import { normalizarBusca } from './estoque.js?v=1.0-final';

let glossario;

export function carregarGlossario() {
  glossario ??= fetch(new URL('../dados/glossario.json?v=1.0-final', import.meta.url))
    .then(resposta => {
      if (!resposta.ok) throw new Error('Glossário indisponível');
      return resposta.json();
    })
    .catch(erro => {
      glossario = undefined;
      throw erro;
    });
  return glossario;
}

export function escreverTermo(elemento, texto, termos) {
  const termo = termos.get(normalizarBusca(texto));
  if (!termo) {
    elemento.textContent = texto;
    return;
  }

  const link = document.createElement('a');
  link.className = 'glossario-termo';
  link.href = './glossario.html#termo-' + termo.id;
  link.dataset.dica = termo.id;
  link.setAttribute('aria-describedby', 'descricao-termo-' + termo.id);
  if (termo.sigla) {
    const abreviacao = document.createElement('abbr');
    abreviacao.textContent = texto;
    link.append(abreviacao);
  } else {
    link.textContent = texto;
  }
  elemento.append(link);
}

export function prepararDicas(raiz, glossario) {
  const termos = new Map();
  if (!glossario.length) return termos;
  const descricoes = document.createElement('div');
  descricoes.hidden = true;
  const dica = document.createElement('p');
  dica.className = 'glossario-dica';
  dica.hidden = true;
  dica.setAttribute('aria-hidden', 'true');
  const porId = new Map();

  for (const termo of glossario) {
    porId.set(termo.id, termo.descricao);
    for (const nome of [termo.termo, ...termo.apelidos]) termos.set(normalizarBusca(nome), termo);
    const texto = document.createElement('span');
    texto.id = 'descricao-termo-' + termo.id;
    texto.textContent = termo.descricao;
    descricoes.append(texto);
  }

  document.body.append(descricoes, dica);
  let ancora;
  let temporizador;

  function ocultar() {
    clearTimeout(temporizador);
    dica.hidden = true;
    ancora = undefined;
  }

  function posicionar() {
    if (!ancora) return;
    const posicao = ancora.getBoundingClientRect();
    if (!ancora.isConnected || posicao.bottom < 0 || posicao.top > innerHeight) {
      ocultar();
      return;
    }

    const largura = dica.offsetWidth;
    const altura = dica.offsetHeight;
    dica.style.left = Math.max(8, Math.min(posicao.left, innerWidth - largura - 8)) + 'px';
    dica.style.top = (posicao.bottom + altura + 8 <= innerHeight
      ? posicao.bottom + 4
      : Math.max(8, posicao.top - altura - 4)) + 'px';
  }

  function mostrar(link) {
    clearTimeout(temporizador);
    ancora = link;
    dica.textContent = porId.get(link.dataset.dica);
    dica.hidden = false;
    posicionar();
  }

  function agendarFechamento() {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      if (ancora && ancora !== document.activeElement && !ancora.matches(':hover') && !dica.matches(':hover')) ocultar();
    }, 120);
  }

  raiz.addEventListener('pointerover', evento => {
    const link = evento.target.closest('[data-dica]');
    if (link && evento.pointerType !== 'touch' && !link.contains(evento.relatedTarget)) mostrar(link);
  });
  raiz.addEventListener('pointerout', evento => {
    const link = evento.target.closest('[data-dica]');
    if (link && !link.contains(evento.relatedTarget)) agendarFechamento();
  });
  raiz.addEventListener('focusin', evento => {
    if (evento.target.matches('[data-dica]')) mostrar(evento.target);
  });
  raiz.addEventListener('focusout', agendarFechamento);
  dica.addEventListener('pointerenter', () => clearTimeout(temporizador));
  dica.addEventListener('pointerleave', agendarFechamento);
  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && !evento.defaultPrevented && !dica.hidden && !document.querySelector('dialog[open]')) {
      evento.preventDefault();
      ocultar();
    }
  });
  document.addEventListener('focusin', evento => {
    if (evento.target.closest('dialog')) ocultar();
  });
  window.addEventListener('resize', posicionar);
  window.addEventListener('scroll', posicionar, { passive: true });
  return termos;
}

function criarDefinicao(termo) {
  const bloco = document.createElement('li');
  bloco.className = 'glossario-definicao';
  const nome = document.createElement('h2');
  nome.id = 'termo-' + termo.id;
  nome.tabIndex = -1;
  nome.textContent = termo.termo;
  const explicacao = document.createElement('p');
  explicacao.textContent = termo.descricao;
  bloco.append(nome, explicacao);
  return bloco;
}

export async function iniciarPaginaGlossario(pagina) {
  const busca = pagina.querySelector('#glossario-busca');
  const lista = pagina.querySelector('.glossario-lista');
  const status = pagina.querySelector('.glossario-status');
  try {
    const dados = await carregarGlossario();
    const ordemAlfabetica = new Intl.Collator('pt-BR');
    const termos = [...dados].sort((a, b) => ordemAlfabetica.compare(a.termo, b.termo));
    function atualizar() {
      const termo = normalizarBusca(busca.value);
      const encontrados = termos.filter(item => normalizarBusca([item.termo, ...item.apelidos, item.descricao].join(' ')).includes(termo));
      lista.replaceChildren(...encontrados.map(criarDefinicao));
      status.textContent = encontrados.length === 0 ? 'Nenhum termo encontrado. Tente outra palavra.'
        : encontrados.length === 1 ? '1 termo encontrado.' : encontrados.length + ' termos encontrados.';
    }

    busca.parentElement.hidden = false;
    busca.addEventListener('input', atualizar);
    atualizar();
    const destino = termos.find(termo => location.hash === '#termo-' + termo.id);
    if (destino) {
      const titulo = document.getElementById('termo-' + destino.id);
      titulo.scrollIntoView();
      titulo.focus({ preventScroll: true });
    }
  } catch {
    status.textContent = 'Não foi possível carregar o glossário. Recarregue a página para tentar novamente.';
  }
}
