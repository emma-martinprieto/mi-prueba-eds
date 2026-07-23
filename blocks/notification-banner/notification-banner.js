export default function decorate(block) {
  // 1. Extraer los elementos (texto y botón)
  const rows = [...block.children];
  const textRow = rows[0]?.firstElementChild;
  const buttonRow = rows[1]?.firstElementChild;

  if (textRow) textRow.classList.add('notification-banner-text');
  if (buttonRow) buttonRow.classList.add('notification-banner-button');

  // 2. Lógica de visibilidad en Scroll (Sticky CTA)
  const handleScroll = () => {
    const hero = document.querySelector('.hero-wrapper') || document.querySelector('.hero');
    const finalCta = document.querySelector('.pricing-wrapper') || document.body; // Ajustar según el selector del CTA final

    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;

    // Calcular límites de aparición y ocultación
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 300;
    const finalCtaTop = finalCta ? finalCta.offsetTop : document.body.scrollHeight;

    const isAfterHero = scrollY > heroBottom;
    const isBeforeFinalCta = (scrollY + windowHeight) < (finalCtaTop + 80);

    // Activar o desactivar visibilidad
    if (isAfterHero && isBeforeFinalCta) {
      block.classList.add('is-visible');
    } else {
      block.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}