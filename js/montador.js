import { adicionarConfiguracaoAoCarrinho } from './carrinho.js';
import { carregarBuildsProntos, linkDaConfiguracao, prioridades, sugerirConfiguracao, usos } from './configuracoes.js';
import { categorias, mostrarPreco, mostrarSubtotal, precoEmReais } from './estoque.js';

const chaveMontador = 'ggtech-montador';

function ultimaConfiguracao(campo) {
  try {
    const respostas = JSON.parse(localStorage.getItem(chaveMontador));
    if (respostas && Object.hasOwn(usos, respostas.uso) && prioridades.includes(respostas.prioridade)
        && Number.isFinite(respostas.orcamento) && respostas.orcamento >= Number(campo.min)
        && respostas.orcamento <= Number(campo.max) && (respostas.orcamento - Number(campo.min)) % Number(campo.step) === 0) {
      return respostas;
    }
  } catch {
    // A página continua disponível quando o navegador não permite recuperar a escolha.
  }
}

function guardarRespostas(respostas) {
  try {
    localStorage.setItem(chaveMontador, JSON.stringify(respostas));
  } catch {
    // O resultado continua disponível até a página ser fechada.
  }
}

function linhaProduto(produto) {
  const linha = document.createElement('li');
  const dados = document.createElement('div');
  const categoria = document.createElement('span');
  categoria.className = 'montador-peca-categoria';
  categoria.textContent = categorias[produto.categoria].nome;
  const nome = document.createElement('strong');
  nome.textContent = produto.nome;
  const preco = document.createElement('span');
  preco.textContent = mostrarPreco(produto.preco);
  dados.append(categoria, nome);
  linha.append(dados, preco);
  return linha;
}

export async function iniciarMontador(pagina) {
  const form = pagina.querySelector('.montador-form');
  const etapas = [...form.querySelectorAll('fieldset')];
  const progresso = form.querySelector('progress');
  const etapaAtual = form.querySelector('.montador-etapa-atual');
  const voltar = form.querySelector('.montador-voltar');
  const continuar = form.querySelector('.montador-continuar');
  const orcamento = form.elements.orcamento;
  const valor = form.querySelector('output');
  const status = pagina.querySelector('.montador-status');
  const retomar = pagina.querySelector('.montador-retomar');
  const resultado = pagina.querySelector('.montador-resultado');
  const titulo = resultado.querySelector('h2');
  const explicacao = resultado.querySelector('.montador-explicacao');
  const preco = resultado.querySelector('.montador-preco');
  const pecas = resultado.querySelector('.montador-pecas');
  const editar = resultado.querySelector('.montador-editar');
  const adicionar = resultado.querySelector('.montador-adicionar');
  const feedback = resultado.querySelector('.montador-feedback');
  const buildId = new URL(location.href).searchParams.get('build');
  let etapa = 0;
  let catalogo;
  let atual;
  let salvas = ultimaConfiguracao(orcamento);

  function atualizarOrcamento() {
    valor.textContent = precoEmReais.format(orcamento.valueAsNumber);
    orcamento.setAttribute('aria-valuetext', valor.textContent);
  }

  function mostrarEtapa(indice, moverFoco = true) {
    etapa = indice;
    resultado.hidden = true;
    form.hidden = false;
    retomar.hidden = !salvas || etapa > 0;
    for (const [posicao, campo] of etapas.entries()) {
      campo.hidden = campo.disabled = posicao !== etapa;
    }
    voltar.hidden = etapa === 0;
    continuar.textContent = etapa === etapas.length - 1 ? 'Mostrar configuração' : 'Continuar';
    etapaAtual.textContent = 'Etapa ' + (etapa + 1) + ' de ' + etapas.length;
    progresso.value = etapa + 1;
    atualizarOrcamento();
    if (moverFoco) etapas[etapa].focus();
  }

  function mostrarResultado(nome, texto, configuracao, limite, menorPreco = null, moverFoco = true) {
    atual = configuracao ? { ...configuracao, limite } : null;
    form.hidden = true;
    retomar.hidden = true;
    resultado.hidden = false;
    titulo.textContent = nome;
    explicacao.textContent = atual ? 'Confira as peças e as ressalvas no simulador. ' + texto : texto;
    preco.hidden = !atual && menorPreco === null;
    if (atual) {
      preco.textContent = mostrarSubtotal(atual.cotacao)
        + (limite === undefined ? '' : ' · orçamento de ' + precoEmReais.format(limite));
    } else {
      preco.textContent = menorPreco === null ? '' : 'Configuração completa a partir de ' + precoEmReais.format(menorPreco);
    }
    pecas.replaceChildren(...(atual?.produtos ?? []).map(linhaProduto));
    pecas.hidden = !atual;
    const personalizar = resultado.querySelector('[data-personalizar]');
    personalizar.hidden = !atual;
    if (atual) personalizar.href = linkDaConfiguracao(atual.produtos);
    adicionar.hidden = !atual;
    editar.textContent = !atual && menorPreco !== null ? 'Rever orçamento' : 'Editar respostas';
    feedback.textContent = '';
    if (moverFoco) titulo.focus();
  }

  function recomendar(respostas) {
    const { uso, prioridade, orcamento } = respostas;
    const { configuracao, minimo } = sugerirConfiguracao(catalogo, respostas);
    if (configuracao) {
      salvas = respostas;
      guardarRespostas(respostas);
      mostrarResultado(usos[uso].titulo, usos[uso].explicacao + (configuracao.cotacao.faltam ? ' Complete as cotações para conferir o orçamento.' : ''),
        configuracao, orcamento);
    } else if (minimo !== null) {
      mostrarResultado('O orçamento precisa de um ajuste',
        'Seu limite de ' + precoEmReais.format(orcamento) + ' está abaixo do preço das peças necessárias para um PC completo.',
        null, orcamento, minimo);
    } else {
      mostrarResultado('Configuração completa indisponível',
        'O estoque atual não tem todas as peças necessárias para uma combinação compatível.', null, orcamento);
    }
  }

  function definirRespostas(respostas) {
    form.elements.uso.value = respostas.uso;
    form.elements.prioridade.value = respostas.prioridade;
    orcamento.value = respostas.orcamento;
  }

  orcamento.addEventListener('input', atualizarOrcamento);
  voltar.addEventListener('click', () => mostrarEtapa(etapa - 1));
  form.addEventListener('submit', evento => {
    evento.preventDefault();
    if (etapa < etapas.length - 1) {
      mostrarEtapa(etapa + 1);
    } else {
      recomendar({
        uso: form.elements.uso.value,
        prioridade: form.elements.prioridade.value,
        orcamento: orcamento.valueAsNumber,
      });
    }
  });
  retomar.addEventListener('click', () => {
    definirRespostas(salvas);
    recomendar(salvas);
  });
  editar.addEventListener('click', () => {
    const endereco = new URL(location.href);
    if (endereco.searchParams.has('build')) {
      endereco.searchParams.delete('build');
      history.replaceState(null, '', endereco);
    }
    mostrarEtapa(!atual && !preco.hidden ? 1 : 0);
  });
  adicionar.addEventListener('click', () => {
    if (!atual) return;
    const envio = adicionarConfiguracaoAoCarrinho(atual.produtos, atual.limite);
    const orcamentoSalvo = atual.limite === undefined ? ''
      : ' O carrinho usa o orçamento de ' + precoEmReais.format(atual.limite) + '.';
    feedback.textContent = envio.ok
      ? atual.produtos.length + ' peças adicionadas.' + orcamentoSalvo
      : 'O carrinho já tem todas as unidades disponíveis de ' + envio.produto.nome
        + '. Ajuste a quantidade no carrinho e tente de novo.';
  });

  try {
    catalogo = await carregarBuildsProntos();
  } catch {
    status.textContent = 'Não foi possível carregar as peças. Recarregue a página para tentar novamente.';
    return;
  }

  status.hidden = true;
  if (buildId) {
    try {
      const builds = await carregarBuildsProntos();
      const build = builds.find(item => item.id === buildId);
      if (build) {
        definirRespostas({ uso: build.uso, prioridade: 'desempenho', orcamento: Math.max(Number(orcamento.min), Math.ceil(build.cotacao.valor / 100) * 100) });
        mostrarResultado(build.nome, build.descricao, build, undefined, null, false);
        return;
      }
    } catch {
      // O quiz ainda pode sugerir uma configuração usando o catálogo.
    }
    status.textContent = 'Essa configuração pronta está indisponível. Use o montador para encontrar outra.';
    status.hidden = false;
  }
  mostrarEtapa(0, false);
}
