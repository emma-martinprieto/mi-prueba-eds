/*
 * Cards Welcome Pack block - EDS
 * Contenido esperado:
 * Fila 1: Título de sección (ej. "Un Welcome Pack<br>a tu altura.")
 * Fila 2: Descripción de sección
 * Filas siguientes (una por card): Imagen | Título | Descripción (usa saltos de línea para las líneas) | Clara (poner "si" para fondo claro, dejar vacío para oscuro)
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [titleRow, descRow, ...cardRows] = rows;

  const header = document.createElement('div');
  header.className = 'section-header';
  const h2 = document.createElement('h2');
  h2.innerHTML = titleRow?.innerHTML || '';
  const p = document.createElement('p');
  p.textContent = descRow?.textContent.trim() || '';
  header.append(h2, p);

  const ul = document.createElement('ul');

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const [imgCell, titleCell, textCell, lightCell] = cells;
    const img = imgCell?.querySelector('img');
    const isLight = lightCell?.textContent.trim().toLowerCase() === 'si';

    const li = document.createElement('li');
    if (isLight) li.classList.add('is-light');

    const textWrap = document.createElement('div');
    textWrap.className = 'card-text';
    const h3 = document.createElement('h3');
    h3.textContent = titleCell?.textContent.trim() || '';
    const desc = document.createElement('p');
    desc.textContent = textCell?.textContent.trim() || '';
    textWrap.append(h3, desc);

    li.append(textWrap);
    if (img) {
      img.className = 'card-img';
      li.append(img);
    }
    ul.append(li);
  });

  block.innerHTML = '';
  block.classList.add('cards-welcome-pack');
  block.append(header, ul);
}