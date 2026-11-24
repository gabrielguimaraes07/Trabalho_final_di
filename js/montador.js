import { levarMontagemAoCarrinho } from './carrinho.js?v=interfaces-4a';
import { carregarBuildsProntos, linkDaConfiguracao, menorPrecoConfiguracao, prioridades, sugerirConfiguracao, usos } from './configuracoes.js?v=interfaces-5';
import { categorias, mostrarPreco, mostrarSubtotal, precoEmReais, somarItens } from './estoque.js?v=interfaces-4';
import { separarItens } from './montagem.js?v=interfaces-4';

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
  preco.className = 'montador-peca-preco';
  preco.textContent = mostrarPreco(produto.preco);
  dados.append(categoria, nome);
  if (produto.imagem) {
    const foto = document.createElement('img');
    foto.src = produto.imagem;
    foto.alt = '';
    foto.width = 80;
    foto.height = 60;
    foto.loading = 'lazy';
    linha.append(foto);
  }
  linha.append(dados, preco);
  return linha;
}

function avisoSemConfiguracao(minimo) {
  return 'Não encontramos uma configuração pronta para esse valor. A opção mais econômica deste catálogo para esse uso custa '
    + precoEmReais.format(minimo) + '.';
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
  const contextoOrcamento = form.querySelector('#montador-orcamento-contexto');
  const valor = form.querySelector('output');
  const status = pagina.querySelector('.montador-status');
  const retomar = pagina.querySelector('.montador-retomar');
  const resultado = pagina.querySelector('.montador-resultado');
  const titulo = resultado.querySelector('h2');
  const explicacao = resultado.querySelector('.montador-explicacao');
  const preco = resultado.querySelector('.montador-preco');
  const grupos = resultado.querySelector('.montador-grupos');
  const totais = resultado.querySelector('.montador-totais');
  const saldo = resultado.querySelector('.montador-saldo');
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
    if (!valido) contextoOrcamento.hidden = true;
    return valido;
  }

  function atualizarOrcamento() {
    valor.textContent = precoEmReais.format(orcamento.valueAsNumber);
    orcamento.setAttribute('aria-valuetext', valor.textContent);
    if (etapa !== 1) return;
    const piso = menorPrecoConfiguracao(catalogo, form.elements.uso.value);
    contextoOrcamento.hidden = !digitado.validity.valid || piso === null || orcamento.valueAsNumber >= piso;
    const aviso = contextoOrcamento.querySelector('[role="status"]');
    const mensagem = contextoOrcamento.hidden ? '' : avisoSemConfiguracao(piso);
    if (aviso.textContent !== mensagem) aviso.textContent = mensagem;
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
    preco.hidden = grupos.hidden = totais.hidden = !atual;
    if (atual) {
      preco.textContent = 'Total de referência · ' + mostrarSubtotal(atual.cotacao);
      const { internos, acessorios } = separarItens(atual.produtos.map(produto => ({ produto, quantidade: 1 })));
      for (const [id, itens] of [['pc', internos], ['perifericos', acessorios]]) {
        resultado.querySelector('#montador-subtotal-' + id).textContent = mostrarSubtotal(somarItens(itens));
        const lista = resultado.querySelector('#montador-lista-' + id);
        lista.replaceChildren(...itens.map(({ produto }) => linhaProduto(produto)));
        lista.closest('section').hidden = !itens.length;
      }
      saldo.hidden = limite === undefined;
      if (limite !== undefined) {
        const diferenca = Math.round((limite - atual.cotacao.valor) * 100) / 100;
        const valorDiferenca = precoEmReais.format(Math.abs(diferenca));
        const situacao = atual.cotacao.faltam ? 'Confira os preços pendentes para calcular a diferença.'
          : diferenca < 0 ? 'Excede em ' + valorDiferenca + '.'
            : diferenca > 0 ? 'Sobram ' + valorDiferenca + '.' : 'O total bate com o orçamento.';
        saldo.textContent = 'Orçamento de ' + precoEmReais.format(limite) + '. ' + situacao;
        saldo.toggleAttribute('data-excedido', !atual.cotacao.faltam && diferenca < 0);
      }
    }
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
        avisoSemConfiguracao(minimo) + ' Faltam ' + precoEmReais.format(minimo - orcamento) + ' para essa opção.',
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
