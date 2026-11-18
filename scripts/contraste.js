const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const raiz = join(__dirname, '..');
const css = readFileSync(join(raiz, 'css', 'tokens.css'), 'utf8');
const numero = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

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
      cores[token] = { valor, canais: pares.map(par => parseInt(par, 16)), opacidade: 1 };
    } else if (rgba) {
      const [vermelho, verde, azul, opacidade] = rgba.slice(1).map(Number);
      cores[token] = { valor, canais: [vermelho, verde, azul], opacidade };
    }
  }
  return cores;
}

function luminancia({ canais, opacidade }, fundo) {
  // Compõe o vidro sobre o fundo antes de converter os canais sRGB.
  const [vermelho, verde, azul] = canais.map((canal, indice) => {
    const srgb = (canal * opacidade + fundo.canais[indice] * (1 - opacidade)) / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * vermelho + 0.7152 * verde + 0.0722 * azul;
}

function tabela(cores) {
  const fundo = cores['--bg'];
  const entradas = Object.entries(cores);
  const linhas = [
    '| Primeira cor | Segunda cor | Contraste | Critérios atingidos |',
    '|---|---|---:|---|',
  ];

  for (const [indice, [primeiroToken, primeiraCor]] of entradas.entries()) {
    for (const [segundoToken, segundaCor] of entradas.slice(indice + 1)) {
      const primeiraLuminancia = luminancia(primeiraCor, fundo);
      const segundaLuminancia = luminancia(segundaCor, fundo);
      const razao = (Math.max(primeiraLuminancia, segundaLuminancia) + 0.05)
        / (Math.min(primeiraLuminancia, segundaLuminancia) + 0.05);

      let criterios = 'Abaixo dos limites avaliados';
      if (razao >= 4.5) {
        criterios = 'Texto comum, texto grande e elementos visuais';
      } else if (razao >= 3) {
        criterios = 'Texto grande e elementos visuais';
      }

      linhas.push(
        '| `' + primeiroToken + '` (' + primeiraCor.valor + ')'
        + ' | `' + segundoToken + '` (' + segundaCor.valor + ')'
        + ' | ' + numero.format(razao) + ':1 | ' + criterios + ' |',
      );
    }
  }

  return linhas.join('\n');
}

const escuro = lerCores(/:root\s*\{([^}]+)\}/);
const claro = { ...escuro, ...lerCores(/:root\[data-theme="light"\]\s*\{([^}]+)\}/) };
const documento = [
  '# Contraste da paleta Titânio',
  '',
  'Gerado por `node scripts/contraste.js` a partir de `css/tokens.css`.',
  '',
  'A WCAG 2.2 nível AA exige pelo menos **4,5:1** para texto comum e **3:1** para texto grande. O limite de **3:1** também se aplica a ícones informativos e partes visuais necessárias para identificar componentes da interface.',
  '',
  'Cada par de cores aparece uma vez por tema. A razão é a mesma nos dois sentidos. A classificação usa o resultado antes do arredondamento.',
  '',
  'As linhas com `--glass` calculam a cor translúcida sobre o fundo `--bg` do mesmo tema. Com o vidro sobre imagens, a cor e o contraste variam de acordo com o que está atrás dele.',
  '',
  'Nos botões principais, a paleta usa `--btn-text` sobre `--btn-primary`. A cor `--accent` é usada em links, foco e destaques.',
  '',
  '## Tema escuro',
  '',
  tabela(escuro),
  '',
  '## Tema claro',
  '',
  tabela(claro),
  '',
  '[WCAG 2.2, contraste mínimo de texto](https://www.w3.org/TR/WCAG22/#contrast-minimum) · [WCAG 2.2, contraste de elementos não textuais](https://www.w3.org/TR/WCAG22/#non-text-contrast)',
  '',
].join('\n');

const destino = join(raiz, 'docs', 'wcag-contraste.md');
writeFileSync(destino, documento);
console.log('Tabela gerada em docs/wcag-contraste.md.');
