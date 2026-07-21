/*
 * Cards Beneficios block - EDS
 * Contenido esperado:
 * Fila 1: Título de sección (ej. "Todo lo que<br>te espera")
 * Fila 2: Descripción de sección
 * Filas siguientes (una por card): Imagen | Badge (categoría) | Título | Descripción
 */
/*
 * Cards Beneficios block - EDS
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [titleRow, descRow, ...cardRows] = rows;

  // 1. Creamos la cabecera del bloque (Título + Descripción superior)
  const header = document.createElement('div');
  header.className = 'section-header';

  if (titleRow) {
    const h2 = document.createElement('h2');
    h2.innerHTML = titleRow.innerHTML || '';
    header.append(h2);
  }

  if (descRow) {
    const p = document.createElement('p');
    p.textContent = descRow.textContent.trim() || '';
    header.append(p);
  }

  // 2. Creamos la lista que contendrá las tarjetas
  const ul = document.createElement('ul');
  ul.className = 'cards-list';

  // 3. Recorremos cada fila de tarjeta
  cardRows.forEach((row) => {
    const cells = [...row.children];
    const [imgCell, badgeCell, titleCell, textCell] = cells;

    // Buscamos 'picture' en lugar de 'img' porque EDS lo genera así
    const picture = imgCell?.querySelector('picture'); 
    if (!picture) return; // Si no hay imagen, saltamos esta tarjeta por seguridad

    const li = document.createElement('li');
    li.className = 'card-item';
    li.append(picture);

    // Contenedor para los textos de la tarjeta
    const content = document.createElement('div');
    content.className = 'card-content';

    // Badge / Categoría
    if (badgeCell && badgeCell.textContent.trim()) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.innerHTML = badgeCell.innerHTML;
      content.append(badge);
    }

    // Título de la tarjeta
    if (titleCell && titleCell.textContent.trim()) {
      const cardTitle = document.createElement('h3');
      cardTitle.className = 'card-title';
      cardTitle.innerHTML = titleCell.innerHTML;
      content.append(cardTitle);
    }

    // Descripción de la tarjeta
    if (textCell && textCell.textContent.trim()) {
      const cardText = document.createElement('p');
      cardText.className = 'card-text';
      cardText.textContent = textCell.textContent.trim();
      content.append(cardText);
    }

    li.append(content);
    ul.append(li);
  });

  // 4. Limpiamos el bloque original de la tabla y añadimos la estructura limpia
  block.innerHTML = '';
  block.append(header, ul);
}