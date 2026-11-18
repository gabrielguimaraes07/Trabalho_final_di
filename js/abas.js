export function abaPorTecla(evento, abas) {
  const indice = abas.indexOf(evento.target);
  if (indice < 0) return;

  const destinos = {
    ArrowLeft: (indice - 1 + abas.length) % abas.length,
    ArrowRight: (indice + 1) % abas.length,
    Home: 0,
    End: abas.length - 1,
  };
  const aba = abas[destinos[evento.key]];
  if (!aba) return;
  evento.preventDefault();
  return aba;
}
