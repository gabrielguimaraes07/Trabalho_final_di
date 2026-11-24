export function validarEmail(campo) {
  if (!campo.value.trim()) return 'Informe um e-mail.';
  return campo.validity.typeMismatch ? 'Informe um e-mail válido, como nome@exemplo.com.' : '';
}

export function prepararFormulario(formulario, regras, confirmar) {
  const campos = [...formulario.querySelectorAll('[data-valida]')];
  const editados = new Set();

  function exibirErro(campo, mensagem) {
    const erro = formulario.querySelector('#' + campo.id + '-erro');
    if (erro.textContent !== mensagem) erro.textContent = mensagem;

    if (mensagem) campo.setAttribute('aria-invalid', 'true');
    else campo.removeAttribute('aria-invalid');
  }

  function validar(campo) {
    const mensagem = regras[campo.dataset.valida](campo);
    exibirErro(campo, mensagem);
    return !mensagem;
  }

  for (const campo of campos) {
    campo.addEventListener('blur', () => {
      editados.add(campo);
      validar(campo);
    });
    campo.addEventListener('input', () => {
      if (editados.has(campo) || campo.value || campo.checked) validar(campo);
    });
  }

  formulario.addEventListener('submit', evento => {
    evento.preventDefault();
    let primeiroErro;
    for (const campo of campos) {
      editados.add(campo);
      if (!validar(campo)) primeiroErro ??= campo;
    }
    if (primeiroErro) {
      primeiroErro.focus();
      return;
    }

    confirmar();
    formulario.reset();
    editados.clear();
    for (const campo of campos) exibirErro(campo, '');
  });
}

export function iniciarContato(pagina) {
  const formulario = pagina.querySelector('form');
  const resultado = pagina.querySelector('.contato-resultado');
  prepararFormulario(formulario, {
    nome: campo => campo.value.trim() ? '' : 'Informe seu nome.',
    email: validarEmail,
    assunto: campo => campo.value ? '' : 'Escolha um assunto.',
    mensagem: campo => campo.value.trim() ? '' : 'Escreva sua mensagem.',
    aceite: campo => campo.checked ? '' : 'Marque a confirmação para continuar.',
  }, () => {
    resultado.textContent = 'Mensagem validada com sucesso. O envio foi simulado.';
  });

  formulario.addEventListener('input', () => { resultado.textContent = ''; });
  formulario.hidden = false;
}
