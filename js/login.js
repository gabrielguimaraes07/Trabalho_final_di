import { abaPorTecla } from './abas.js?v=1.0-final';
import { prepararFormulario, validarEmail } from './formularios.js?v=1.0-final';

const chave = 'ggtech-usuario';
let memoria;
let armazenamentoDisponivel = true;

function lerUsuario() {
  if (!armazenamentoDisponivel) return memoria;
  let salvo;
  try {
    salvo = localStorage.getItem(chave);
  } catch {
    armazenamentoDisponivel = false;
    return memoria;
  }

  try {
    const dados = JSON.parse(salvo);
    memoria = typeof dados?.nome === 'string' && typeof dados?.email === 'string' ? dados : undefined;
  } catch {
    memoria = undefined;
  }
  return memoria;
}

function salvarUsuario(usuario) {
  memoria = usuario;
  try {
    if (armazenamentoDisponivel) {
      if (usuario) localStorage.setItem(chave, JSON.stringify(usuario));
      else localStorage.removeItem(chave);
    }
  } catch {
    armazenamentoDisponivel = false;
  }
}

function nomeDoEmail(email) {
  const nome = email.split('@')[0].replace(/[._+-]+/g, ' ').trim();
  return nome ? nome[0].toLocaleUpperCase('pt-BR') + nome.slice(1) : 'Visitante';
}

export function iniciarAcesso(link, pagina) {
  function atualizarMenu() {
    link.textContent = lerUsuario() ? 'Minha conta' : 'Entrar';
  }

  atualizarMenu();
  if (!pagina) {
    window.addEventListener('storage', evento => {
      if (evento.key === chave || evento.key === null) atualizarMenu();
    });
    return;
  }

  const acesso = pagina.querySelector('.login-conteudo');
  const sessao = pagina.querySelector('.login-sessao');
  const tituloSessao = sessao.querySelector('h2');
  const status = pagina.querySelector('.login-status');
  const abas = [...acesso.querySelectorAll('[role="tab"]')];
  const formularios = [...acesso.querySelectorAll('form')];
  let abaAtual = abas[0];

  function exibirSessao() {
    const usuario = lerUsuario();
    atualizarMenu();
    acesso.hidden = !!usuario;
    sessao.hidden = !usuario;
    if (usuario) {
      sessao.querySelector('.login-usuario').textContent = 'Olá, ' + usuario.nome + '.';
      sessao.querySelector('.login-email').textContent = usuario.email;
    }
  }

  function alternarSenha(botao, visivel) {
    const campo = document.getElementById(botao.getAttribute('aria-controls'));
    campo.type = visivel ? 'text' : 'password';
    botao.textContent = visivel ? 'Ocultar senha' : 'Mostrar senha';
  }

  function selecionar(aba) {
    abaAtual = aba;
    for (const botao of abas) {
      const selecionado = botao === aba;
      botao.setAttribute('aria-selected', String(selecionado));
      botao.tabIndex = selecionado ? 0 : -1;
      document.getElementById(botao.getAttribute('aria-controls')).hidden = !selecionado;
    }

    for (const botao of acesso.querySelectorAll('[data-mostrar-senha]')) alternarSenha(botao, false);
  }

  for (const aba of abas) aba.addEventListener('click', () => selecionar(aba));
  acesso.querySelector('[role="tablist"]').addEventListener('keydown', evento => {
    const proxima = abaPorTecla(evento, abas);
    if (!proxima) return;
    selecionar(proxima);
    proxima.focus();
  });

  for (const botao of acesso.querySelectorAll('[data-mostrar-senha]')) {
    botao.addEventListener('click', () => {
      const campo = document.getElementById(botao.getAttribute('aria-controls'));
      alternarSenha(botao, campo.type === 'password');
    });
  }

  const regras = {
    nome: campo => campo.value.trim() ? '' : 'Informe seu nome.',
    email: validarEmail,
    senha: campo => campo.value.length >= 6 ? '' : 'Informe uma senha fictícia de pelo menos 6 caracteres.',
  };

  for (const formulario of formularios) {
    prepararFormulario(formulario, regras, () => {
      const email = formulario.querySelector('[data-valida="email"]').value.trim();
      const nome = formulario.querySelector('[data-valida="nome"]')?.value.trim() || nomeDoEmail(email);
      for (const campo of acesso.querySelectorAll('[data-valida="senha"]')) campo.value = '';
      salvarUsuario({ nome, email });
      exibirSessao();
      status.textContent = 'Acesso fictício confirmado.';
      tituloSessao.focus();
    });
  }

  sessao.querySelector('.login-sair').addEventListener('click', () => {
    salvarUsuario(undefined);
    selecionar(abas[0]);
    exibirSessao();
    status.textContent = 'Você saiu da conta fictícia.';
    abaAtual.focus();
  });
  window.addEventListener('storage', evento => {
    if (evento.key === chave || evento.key === null) exibirSessao();
  });

  exibirSessao();
}
