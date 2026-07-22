/*
 * CTA Final Block - EDS
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Extraemos exactamente cada fila de la tabla de da.live
  const [bgRow, titleRow, descRow, btnRow] = rows;

  // 1. Imagen de fondo
  const bgPicture = bgRow?.querySelector('picture') || bgRow?.querySelector('img');

  // 2. Título (mantiene los saltos de línea de la celda)
  const titleText = titleRow?.innerHTML?.trim() || 'Únete a la Leyenda';

  // 3. Subtítulo / Descripción
  const descText = descRow?.textContent?.trim() || '';

  // 4. Botón
  const btnAnchor = btnRow?.querySelector('a');
  const btnText = btnAnchor ? btnAnchor.textContent.trim() : (btnRow?.textContent?.trim() || 'Hazte Madridista');
  const btnLink = btnAnchor ? btnAnchor.href : '#';

  // --- Construimos la estructura HTML limpia ---
  const container = document.createElement('div');
  container.className = 'cta-final-content';

  const heading = document.createElement('h2');
  heading.className = 'cta-final-title';
  heading.innerHTML = titleText; // Permite <br> si en el documento metes salto de línea

  const desc = document.createElement('p');
  desc.className = 'cta-final-description';
  desc.textContent = descText;

  const button = document.createElement('a');
  button.className = 'cta-final-btn';
  button.href = btnLink;
  button.textContent = btnText;

  container.append(heading, desc, button);

  // Limpiamos la tabla original y montamos el componente
  block.innerHTML = '';
  if (bgPicture) {
    bgPicture.className = 'cta-final-bg';
    block.append(bgPicture);
  }
  block.append(container);

  // Animación Entrada Escalonada (whileInView)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        container.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(block);
}