import { verificarCompatibilidade } from './compatibilidade.js?v=interfaces-4';
import { configurarGaveta } from './dialogo.js?v=1.0-final';
import { mesmaMontagem } from './montagem.js?v=interfaces-4';
import { carregarEstoque, mostrarSubtotal, precoEmReais, somarItens } from './estoque.js?v=interfaces-4';

const chave = 'ggtech-carrinho-real';
const eventoCarrinho = 'ggtech:carrinho';
const orcamentoPadrao = 4000;
const estadosCompatibilidade = {
  ok: '✓ Compatível',
  aviso: 'Atenção',
  erro: 'Incompatível',
  pendente: '— Falta conferir',
};
let memoria = { orcamento: orcamentoPadrao, itens: [] };
let armazenamentoDisponivel = true;

function lerCarrinho() {
  if (!armazenamentoDisponivel) return memoria;
  let valorSalvo;
  try {
    valorSalvo = localStorage.getItem(chave);
  } catch {
    armazenamentoDisponivel = false;
    return memoria;
  }

  let dados;
  try {
    dados = JSON.parse(valorSalvo);
  } catch {
    // Um valor inválido pode ser substituído na próxima alteração.
  }
  const itens = Array.isArray(dados?.itens) ? dados.itens.filter(item =>
    typeof item?.id === 'string' && Number.isSafeInteger(item.quantidade) && item.quantidade > 0).map(item => ({
      id: item.id, quantidade: item.quantidade, preco: Number.isFinite(item.preco) && item.preco >= 0 ? item.preco : undefined,
    })) : [];
  const orcamento = Number.isFinite(dados?.orcamento) && dados.orcamento > 0 ? dados.orcamento : orcamentoPadrao;
  memoria = { orcamento, itens };
  return memoria;
}

function salvarCarrinho(dados) {
  memoria = dados;
  try {
    if (armazenamentoDisponivel) localStorage.setItem(chave, JSON.stringify(dados));
  } catch {
    armazenamentoDisponivel = false;
  }
  window.dispatchEvent(new Event(eventoCarrinho));
}

function modificarQuantidade(produto, acao) {
  if (acao === 'aumentar') return adicionarAoCarrinho(produto);
  const carrinho = lerCarrinho();
  const item = carrinho.itens.find(item => item.id === produto.id);
  if (!item) return false;
  if (acao === 'remover' || item.quantidade === 1) carrinho.itens = carrinho.itens.filter(item => item.id !== produto.id);
  else item.quantidade--;
  salvarCarrinho(carrinho);
  return true;
}

export function adicionarAoCarrinho(produto) {
  return adicionarConfiguracaoAoCarrinho([produto]).ok;
}

export function adicionarConfiguracaoAoCarrinho(produtos, orcamento) {
  const carrinho = lerCarrinho();
  const quantidades = new Map(carrinho.itens.map(({ id, quantidade }) => [id, quantidade]));
  const cotacoes = new Map(carrinho.itens.map(({ id, preco }) => [id, preco]));
  for (const produto of produtos) {
    const quantidade = (quantidades.get(produto.id) ?? 0) + 1;
    if (quantidade > produto.estoque) return { ok: false, produto };
    quantidades.set(produto.id, quantidade);
  }

  salvarCarrinho({
    orcamento: orcamento ?? carrinho.orcamento,
    itens: [...quantidades].map(([id, quantidade]) => ({ id, quantidade, preco: cotacoes.get(id) })),
  });
  return { ok: true };
}

export function levarMontagemAoCarrinho(itens, orcamento) {
  if (!itens.length) return false;
  const carrinho = lerCarrinho();
  const selecao = itens.map(({ produto, quantidade, preco }) => ({ id: produto.id, quantidade, preco }));
  if (carrinho.itens.length && !mesmaMontagem(selecao, carrinho.itens) &&
      !confirm('Usar as peças desta montagem no lugar dos itens do carrinho?')) return false;
  salvarCarrinho({ orcamento: orcamento ?? carrinho.orcamento, itens: selecao });
  return true;
}

const painel = `
  <dialog class="gaveta carrinho-gaveta" id="gaveta-carrinho" aria-labelledby="carrinho-titulo">
    <div class="gaveta-conteudo">
      <header class="gaveta-cabecalho">
        <h2 id="carrinho-titulo">Seu carrinho</h2>
        <button class="botao-contorno gaveta-fechar" type="button" aria-label="Fechar carrinho" autofocus>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="m18 6-12 12M6 6l12 12"></path>
          </svg>
        </button>
      </header>

      <div class="carrinho-conteudo">
        <section class="carrinho-orcamento" aria-labelledby="orcamento-titulo">
          <h3 id="orcamento-titulo">Orçamento</h3>
          <p class="carrinho-total" role="status"></p>
          <progress class="carrinho-progresso" value="0" max="4000" aria-label="Orçamento utilizado"></progress>
          <p class="carrinho-limite"></p>
          <form class="carrinho-form-orcamento">
            <div class="estoque-campo">
              <label for="orcamento-carrinho">Meu orçamento em reais</label>
              <input id="orcamento-carrinho" type="number" min="0.01" step="0.01" inputmode="decimal" required>
            </div>
            <button class="botao-contorno" type="submit">Salvar</button>
          </form>
        </section>

        <button class="botao-primario carrinho-simular" type="button" hidden>Simular compra</button>
        <p class="carrinho-status" role="status"></p>
        <ul class="gaveta-lista carrinho-lista"></ul>
        <a class="gaveta-link-estoque" href="./estoque.html">Explorar o estoque</a>

        <section class="carrinho-compatibilidade" aria-labelledby="compatibilidade-titulo" hidden>
          <h3 id="compatibilidade-titulo">Compatibilidade</h3>
          <ul></ul>
        </section>
      </div>
      <section class="carrinho-compra" aria-labelledby="compra-titulo" hidden>
        <h3 id="compra-titulo" tabindex="-1">Revisar compra simulada</h3>
        <p>Esta é uma demonstração. O total usa os preços de referência do carrinho.</p>
        <ul class="compra-itens"></ul>
        <p class="compra-total"></p>
        <p class="compra-alerta" hidden></p>
        <p class="compra-confirmacao" role="status"></p>
        <div class="compra-acoes">
          <button class="botao-primario compra-confirmar" type="button">Confirmar simulação</button>
          <button class="botao-contorno compra-voltar" type="button">Voltar ao carrinho</button>
        </div>
      </section>
    </div>
  </dialog>
`;

function botaoQuantidade(acao, produto, texto, rotulo, desativado = false) {
  const botao = document.createElement('button');
  botao.className = acao === 'remover' ? 'botao-texto' : 'botao-contorno carrinho-controle';
  botao.type = 'button';
  botao.dataset.acao = acao;
  botao.dataset.id = produto.id;
  botao.textContent = texto;
  botao.setAttribute('aria-label', rotulo + ' ' + produto.nome);
  botao.disabled = desativado;
  return botao;
}

function criarItem({ produto, quantidade, preco }) {
  const item = document.createElement('li');
  item.className = 'carrinho-item';
  const titulo = document.createElement('h3');
  titulo.textContent = produto.nome;
  const subtotal = document.createElement('p');
  subtotal.textContent = mostrarSubtotal(somarItens([{ produto, quantidade, preco }]));
  if (produto.imagem) {
    const imagem = document.createElement('img');
    imagem.src = produto.imagem;
    imagem.alt = '';
    imagem.width = 80;
    imagem.height = 60;
    item.append(imagem);
  }
  const dados = document.createElement('div');
  const controles = document.createElement('div');
  controles.className = 'carrinho-quantidade';
  const valor = document.createElement('span');
  valor.textContent = quantidade;
  controles.append(
    botaoQuantidade('diminuir', produto, '−', 'Diminuir quantidade de', quantidade === 1),
    valor,
    botaoQuantidade('aumentar', produto, '+', 'Aumentar quantidade de', quantidade >= produto.estoque),
    botaoQuantidade('remover', produto, 'Remover', 'Remover'),
  );
  dados.append(titulo, subtotal, controles);
  item.append(dados);
  return item;
}

function criarResultado({ titulo, estado, mensagem }) {
  const item = document.createElement('li');
  item.dataset.estado = estado;
  const legenda = document.createElement('strong');
  legenda.textContent = titulo + ' · ' + estadosCompatibilidade[estado];
  const explicacao = document.createElement('p');
  explicacao.textContent = mensagem;
  item.append(legenda, explicacao);
  return item;
}

export function iniciarCarrinho(acionador) {
  document.body.insertAdjacentHTML('beforeend', painel);
  const dialogo = document.querySelector('#gaveta-carrinho');
  const fechar = dialogo.querySelector('.gaveta-fechar');
  const conteudo = dialogo.querySelector('.carrinho-conteudo');
  const simular = dialogo.querySelector('.carrinho-simular');
  const compra = dialogo.querySelector('.carrinho-compra');
  const tituloCompra = compra.querySelector('h3');
  const linhaCompra = compra.querySelector('.compra-itens');
  const totalCompra = compra.querySelector('.compra-total');
  const alertaCompra = compra.querySelector('.compra-alerta');
  const confirmacaoCompra = compra.querySelector('.compra-confirmacao');
  const confirmar = compra.querySelector('.compra-confirmar');
  const voltar = compra.querySelector('.compra-voltar');
  function voltarAoCarrinho() {
    compra.hidden = true;
    conteudo.hidden = false;
    confirmacaoCompra.textContent = '';
  }
  const abrir = configurarGaveta(dialogo, fechar, voltarAoCarrinho);
  const contador = acionador.querySelector('.carrinho-contador');
  const lista = dialogo.querySelector('.carrinho-lista');
  const mensagem = dialogo.querySelector('.carrinho-status');
  const total = dialogo.querySelector('.carrinho-total');
  const limite = dialogo.querySelector('.carrinho-limite');
  const progresso = dialogo.querySelector('progress');
  const formulario = dialogo.querySelector('form');
  const campoOrcamento = formulario.querySelector('input');
  const compatibilidade = dialogo.querySelector('.carrinho-compatibilidade');
  const resultados = compatibilidade.querySelector('ul');
  let produtos;
  let falha = false;

  function atualizar() {
    const carrinho = lerCarrinho();
    const unidades = carrinho.itens.reduce((soma, item) => soma + item.quantidade, 0);
    contador.textContent = unidades;
    acionador.setAttribute('aria-label', 'Carrinho, ' + unidades + (unidades === 1 ? ' item' : ' itens'));
    if (!dialogo.open) return;

    if (document.activeElement !== campoOrcamento) campoOrcamento.value = carrinho.orcamento;
    const itens = produtos ? carrinho.itens.filter(item => produtos.has(item.id))
      .map(item => ({ ...item, produto: produtos.get(item.id) })) : [];
    const cotacao = somarItens(itens);
    const soma = cotacao.valor;
    const excedente = Math.round((soma - carrinho.orcamento) * 100) / 100;
    total.textContent = mostrarSubtotal(cotacao) + ' de ' + precoEmReais.format(carrinho.orcamento);
    limite.textContent = excedente > 0
      ? 'Acima do orçamento em ' + precoEmReais.format(excedente) + '.'
      : cotacao.faltam ? 'Complete as cotações para conferir o orçamento.' : 'Dentro do orçamento.';
    progresso.max = carrinho.orcamento;
    progresso.value = Math.min(soma, carrinho.orcamento);
    progresso.toggleAttribute('data-excedido', excedente > 0);

    const temItens = itens.length > 0;
    mensagem.textContent = temItens ? '' : falha
      ? 'Não foi possível carregar as peças. Feche o carrinho e tente novamente.'
      : unidades && !produtos ? 'Carregando suas peças…' : 'Seu carrinho está vazio.';
    mensagem.hidden = temItens;
    const foco = lista.contains(document.activeElement) ? document.activeElement : null;
    lista.replaceChildren(...itens.map(criarItem));
    simular.hidden = !temItens;
    compatibilidade.hidden = !temItens;
    const regras = temItens ? verificarCompatibilidade(itens) : [];
    resultados.replaceChildren(...regras.map(criarResultado));
    if (!compra.hidden) {
      linhaCompra.replaceChildren(...itens.map(({ produto, quantidade, preco }) => {
        const linha = document.createElement('li');
        linha.textContent = quantidade + ' × ' + produto.nome + ' · ' + mostrarSubtotal(somarItens([{ produto, quantidade, preco }]));
        return linha;
      }));
      totalCompra.textContent = 'Total sem frete · ' + mostrarSubtotal(cotacao);
      alertaCompra.hidden = !regras.some(regra => regra.estado === 'erro');
      alertaCompra.textContent = 'Há incompatibilidades entre as peças. Confira os alertas no carrinho.';
      confirmar.disabled = !temItens || !!confirmacaoCompra.textContent;
    }
    if (foco) {
      const linha = lista.querySelectorAll('button:not(:disabled)');
      const mesmoProduto = [...linha].filter(botao => botao.dataset.id === foco.dataset.id);
      (mesmoProduto.find(botao => botao.dataset.acao === foco.dataset.acao) ?? mesmoProduto[0] ?? linha[0] ?? fechar)
        .focus({ preventScroll: true });
    }
  }

  async function mostrarCarrinho(origem) {
    if (dialogo.open) return;
    falha = false;
    abrir(origem);
    atualizar();
    if (produtos) return;
    try {
      const catalogo = await carregarEstoque();
      produtos = new Map(catalogo.map(produto => [produto.id, produto]));
    } catch {
      falha = true;
    }
    atualizar();
  }
  acionador.addEventListener('click', () => mostrarCarrinho(acionador));
  window.addEventListener('ggtech:abrir-carrinho', evento => mostrarCarrinho(evento.detail));
  simular.addEventListener('click', () => {
    conteudo.hidden = true;
    compra.hidden = false;
    atualizar();
    tituloCompra.focus();
  });
  voltar.addEventListener('click', () => {
    voltarAoCarrinho();
    (simular.hidden ? fechar : simular).focus();
  });
  confirmar.addEventListener('click', () => {
    confirmacaoCompra.textContent = 'Simulação concluída. As peças continuam no seu carrinho.';
    confirmar.disabled = true;
    voltar.focus();
  });
  lista.addEventListener('click', evento => {
    const botao = evento.target.closest('button[data-acao]');
    if (botao) modificarQuantidade(produtos.get(botao.dataset.id), botao.dataset.acao);
  });
  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    salvarCarrinho({ ...lerCarrinho(), orcamento: campoOrcamento.valueAsNumber });
  });
  window.addEventListener(eventoCarrinho, atualizar);
  window.addEventListener('storage', evento => {
    if (evento.key === chave || evento.key === null) atualizar();
  });

  acionador.setAttribute('aria-controls', dialogo.id);
  acionador.hidden = false;
  atualizar();
}
