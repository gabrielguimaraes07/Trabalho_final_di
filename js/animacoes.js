let biblioteca;

export function carregarGSAP() {
  biblioteca ??= import('gsap').then(modulo => modulo.gsap).catch(() => null);
  return biblioteca;
}

export async function carregarScrollTrigger() {
  const gsap = await carregarGSAP();
  if (!gsap) return;
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  return ScrollTrigger;
}
