/*
 * Hero block - EDS
 * Contenido esperado (fila por fila en el documento):
 * Fila 1: Imagen de fondo
 * Fila 2: Título (ej. "Únete<br>a la pasión" - usa <br> o dos párrafos para las 2 líneas)
 * Fila 3: Descripción
 * Fila 4: Botón (texto + enlace)
 * Fila 5 (opcional): Estadísticas separadas por " | " ej. "21M+ Forman Parte | 150+ Países | +1.5M Beneficios Disfrutados por año"
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [imgRow, titleRow, descRow, ctaRow, statsRow] = rows;

  const picture = imgRow?.querySelector('picture');
  const titleHTML = titleRow?.innerHTML || '';
  const desc = descRow?.textContent.trim() || '';
  const cta = ctaRow?.querySelector('a');
  const statsText = statsRow?.textContent.trim();

  block.innerHTML = '';
  block.classList.add('hero');
  if (picture) block.append(picture);

  const content = document.createElement('div');
  content.className = 'hero-content';

  const h1 = document.createElement('h1');
  h1.innerHTML = titleHTML;

  const p = document.createElement('p');
  p.textContent = desc;

  content.append(h1, p);

  if (cta) {
    const btnWrap = document.createElement('p');
    btnWrap.className = 'button-container';
    btnWrap.append(cta);
    content.append(btnWrap);
  }

  if (statsText) {
    const statsWrap = document.createElement('div');
    statsWrap.className = 'hero-stats';
    const parts = statsText.split('|').map((s) => s.trim());
    parts.forEach((part, i) => {
      const match = part.match(/^(\S+)\s+(.*)$/);
      const stat = document.createElement('div');
      stat.className = 'stat';
      if (match) {
        stat.innerHTML = `<strong>${match[1]}</strong><span>${match[2]}</span>`;
      } else {
        stat.innerHTML = `<span>${part}</span>`;
      }
      statsWrap.append(stat);
      if (i < parts.length - 1) {
        const divider = document.createElement('div');
        divider.className = 'divider';
        statsWrap.append(divider);
      }
    });
    content.append(statsWrap);
  }

  block.append(content);
}