/*
 * CTA Final block - EDS
 * Contenido esperado:
 * Fila 1: Imagen de fondo
 * Fila 2: Título (ej. "Únete<br>a la Leyenda")
 * Fila 3: Descripción
 * Fila 4: Botón (texto + enlace)
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [imgRow, titleRow, descRow, ctaRow] = rows;

  const picture = imgRow?.querySelector('picture');
  const cta = ctaRow?.querySelector('a');

  block.innerHTML = '';
  block.classList.add('cta-final');
  if (picture) block.append(picture);

  const content = document.createElement('div');
  content.className = 'cta-content';

  const h2 = document.createElement('h2');
  h2.innerHTML = titleRow?.innerHTML || '';

  const p = document.createElement('p');
  p.textContent = descRow?.textContent.trim() || '';

  content.append(h2, p);

  if (cta) {
    const btnWrap = document.createElement('p');
    btnWrap.className = 'button-container';
    btnWrap.append(cta);
    content.append(btnWrap);
  }

  block.append(content);
}