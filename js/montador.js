import { levarMontagemAoCarrinho } from './carrinho.js?v=interfaces-4a';
import { carregarBuildsProntos, linkDaConfiguracao, prioridades, sugerirConfiguracao, usos } from './configuracoes.js?v=interfaces-4';
import { categorias, mostrarPreco, mostrarSubtotal, precoEmReais } from './estoque.js?v=interfaces-4';

const chaveMontador = 'ggtech-montador';

function ultimaConfiguracao(campo) {
  try {
    const respostas = JSON.parse(localStorage.getItem(chaveMontador));
    if (respostas?.prioridade === 'silencio') respostas.prioridade = 'economia';
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
  const digitado = form.querySelector('#montador-orcamento-numero');
  const avisoOrcamento = form.querySelector('#montador-orcamento-erro');
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
  let revisarOrcamento;
  let salvas = ultimaConfiguracao(orcamento);
  for (const atributo of ['min', 'max', 'step']) digitado[atributo] = orcamento[atributo];
  const [minimo, maximo] = form.querySelectorAll('.montador-faixa span');
  minimo.textContent = precoEmReais.format(Number(orcamento.min));
  maximo.textContent = precoEmReais.format(Number(orcamento.max));

  function validarOrcamento() {
    const valido = digitado.validity.valid;
    digitado.setAttribute('aria-invalid', String(!valido));
    avisoOrcamento.hidden = valido;
    avisoOrcamento.textContent = valido ? '' : 'Digite um valor inteiro entre ' + minimo.textContent + ' e ' + maximo.textContent + '.';
    return valido;
  }

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
    explicacao.textContent = texto;
    revisarOrcamento = !atual && menorPreco !== null;
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
    editar.textContent = revisarOrcamento ? 'Rever orçamento' : 'Editar respostas';
    feedback.textContent = '';
    if (moverFoco) titulo.focus();
  }

  function recomendar(respostas) {
    const { uso, orcamento } = respostas;
    const { configuracao, minimo, motivo } = sugerirConfiguracao(catalogo, respostas);
    if (configuracao) {
      salvas = respostas;
      guardarRespostas(respostas);
      mostrarResultado(usos[uso].titulo, configuracao.titulo + '. ' + motivo,
        configuracao, orcamento);
    } else if (minimo !== null) {
      mostrarResultado('O orçamento precisa de um ajuste',
        'Seu limite de ' + precoEmReais.format(orcamento) + ' está abaixo do preço das peças necessárias para um PC completo.',
        null, orcamento, minimo);
    } else {
      mostrarResultado('Configuração completa indisponível',
        'O catálogo ainda não tem uma configuração completa e compatível para esse uso.', null, orcamento);
    }
  }

  function definirRespostas(respostas) {
    form.elements.uso.value = respostas.uso;
    form.elements.prioridade.value = respostas.prioridade;
    orcamento.value = respostas.orcamento;
    digitado.value = orcamento.value;
    validarOrcamento();
  }

  orcamento.addEventListener('input', () => {
    digitado.value = orcamento.value;
    validarOrcamento();
    atualizarOrcamento();
  });
  digitado.addEventListener('input', () => {
    if (!validarOrcamento()) return;
    orcamento.value = digitado.value;
    atualizarOrcamento();
  });
  digitado.addEventListener('invalid', validarOrcamento);
  voltar.addEventListener('click', () => mostrarEtapa(etapa - 1));
  form.addEventListener('submit', evento => {
    evento.preventDefault();
    if (etapa < etapas.length - 1) {
      if (etapa === 1 && !validarOrcamento()) {
        digitado.reportValidity();
        return;
      }
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
    mostrarEtapa(revisarOrcamento ? 1 : 0);
    if (revisarOrcamento) digitado.focus();
  });
  adicionar.addEventListener('click', () => {
    if (!atual) return;
    const itens = atual.produtos.map(produto => ({ produto, quantidade: 1 }));
    if (!levarMontagemAoCarrinho(itens, atual.limite)) {
      feedback.textContent = 'O carrinho continua com os itens anteriores.';
      return;
    }
    feedback.textContent = 'Configuração pronta para conferir no carrinho.';
    window.dispatchEvent(new CustomEvent('ggtech:abrir-carrinho', { detail: adicionar }));
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
        definirRespostas({ uso: build.uso, prioridade: 'desempenho', orcamento: Math.max(Number(orcamento.min), Math.ceil(build.cotacao.valor)) });
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
