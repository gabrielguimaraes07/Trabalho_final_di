const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const raiz = join(__dirname, '..');
const css = readFileSync(join(raiz, 'css', 'tokens.css'), 'utf8');
const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function lerCores(seletor) {
  const bloco = css.match(seletor)?.[1];
  if (bloco === undefined) {
    throw new Error('Bloco de tema ausente em css/tokens.css.');
  }

  const cores = {};
  for (const [, token, valor] of bloco.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const hex = valor.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
    const rgba = valor.trim().match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*\.?\d+)\s*\)$/);

    if (hex) {
      const pares = hex.length === 3
        ? [...hex].map(digito => digito.repeat(2))
        : hex.match(/.{2}/g);
      cores[token] = { canais: pares.map(par => parseInt(par, 16)), opacidade: 1 };
    } else if (rgba) {
      const [vermelho, verde, azul, opacidade] = rgba.slice(1).map(Number);
      cores[token] = { canais: [vermelho, verde, azul], opacidade };
    }
  }
  return cores;
}

function compor({ canais, opacidade }, fundo) {
  return canais.map((canal, indice) => canal * opacidade + fundo[indice] * (1 - opacidade));
}

function luminancia(canais) {
  const [vermelho, verde, azul] = canais.map(canal => {
    const srgb = canal / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * vermelho + 0.7152 * verde + 0.0722 * azul;
}

function contraste(primeira, segunda) {
  const a = luminancia(primeira);
  const b = luminancia(segunda);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function resumo(cores, corAtrasDoVidro) {
  const fundos = [
    cores['--bg'].canais,
    cores['--surface'].canais,
    compor(cores['--glass'], corAtrasDoVidro),
  ];
  const verificacoes = [
    ['Texto principal', '--text', fundos, 4.5],
    ['Texto secundário', '--text-2', fundos, 4.5],
    ['Links', '--accent', fundos, 4.5],
    ['Mensagens de confirmação', '--success', fundos, 4.5],
    ['Mensagens de erro', '--danger', fundos, 4.5],
    ['Texto branco no botão principal', '--btn-text', [cores['--btn-primary'].canais], 4.5],
    ['Contorno de foco', '--accent', fundos, 3],
    ['Botão principal em relação ao fundo', '--btn-primary', fundos, 3],
  ];

  return verificacoes.map(([uso, token, fundosDoUso, minimo]) => {
    const razao = Math.min(...fundosDoUso.map(fundo => contraste(cores[token].canais, fundo)));
    if (razao < minimo) {
      console.error(uso + ' abaixo de ' + numero.format(minimo) + ':1.');
      process.exitCode = 1;
    }
    return '- **' + uso + '.** ' + numero.format(razao) + ':1.';
  }).join('\n');
}

const escuro = lerCores(/:root\s*\{([^}]+)\}/);
const claro = { ...escuro, ...lerCores(/:root\[data-theme="light"\]\s*\{([^}]+)\}/) };
const documento = [
  '# Contraste do GGTECH',
  '',
  'A WCAG 2.2 pede **4,5:1** para texto comum e **3:1** para texto grande e para os elementos visuais necessários para identificar controles ou estados.',
  '',
  'O cálculo compara o fundo da página, o dos cartões e o das áreas translúcidas. O resultado mostra o menor valor. Para ver o efeito da transparência, o fundo escuro fica sobre branco e o claro fica sobre preto. O texto do botão é comparado com o próprio azul do botão.',
  '',
  '## Tema escuro',
  '',
  resumo(escuro, [255, 255, 255]),
  '',
  '## Tema claro',
  '',
  resumo(claro, [0, 0, 0]),
  '',
  'Para refazer o cálculo, rode `node scripts/contraste.js`. O script lê as cores de `css/tokens.css`.',
  '',
  '[Testes no Adobe Color](contraste-adobe.md) · [Contraste de texto na WCAG 2.2](https://www.w3.org/TR/WCAG22/#contrast-minimum) · [Contraste de componentes](https://www.w3.org/TR/WCAG22/#non-text-contrast)',
  '',
].join('\n');

writeFileSync(join(raiz, 'docs', 'wcag-contraste.md'), documento);
console.log('Relatório atualizado em docs/wcag-contraste.md.');
