export default function decorate(block) {
  // 1. Asignar clases estructurales al texto y botón
  const rows = [...block.children];
  if (rows[0]?.firstElementChild) rows[0].firstElementChild.classList.add('notification-banner-text');
  if (rows[1]?.firstElementChild) rows[1].firstElementChild.classList.add('notification-banner-button');

  // 2. Control dinámico de visibilidad en Scroll
  const checkScroll = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || 0;
    const windowHeight = window.innerHeight;

    // A) Entrada: justo al pasar la primera sección (Hero)
    const firstSection = document.querySelector('.section');
    const triggerOffset = firstSection ? (firstSection.offsetTop + firstSection.offsetHeight) : 200;
    const isAfterHero = scrollPosition > triggerOffset;

    // B) Salida: al acercarse al CTA final / última sección
    const sections = document.querySelectorAll('.section');
    const lastSection = sections.length > 1 ? sections[sections.length - 1] : null;
    
    let isBeforeFinalCta = true;
    if (lastSection) {
      const finalCtaTop = lastSection.offsetTop;
      // Se oculta si el final de la ventana sobrepasa el top del CTA final + 80px
      isBeforeFinalCta = (scrollPosition + windowHeight) < (finalCtaTop + 80);
    }

    // 3. Aplicar estado final
    if (isAfterHero && isBeforeFinalCta) {
      block.classList.add('is-visible');
    } else {
      block.classList.remove('is-visible');
    }
  };

  // Escuchar eventos de scroll
  window.addEventListener('scroll', checkScroll, { passive: true });
  document.addEventListener('scroll', checkScroll, { passive: true });
  
  // Ejecutar verificación inicial
  checkScroll();
}