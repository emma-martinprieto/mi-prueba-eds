export default function decorate(block) {
  const rows = [...block.children];

  // Estructura según tu tabla de AEM:
  // Fila 0: Título principal
  // Fila 1: Subtítulo/Descripción
  // Filas 2, 3, 4: Packs (Badge | Título Pack | Descripción Pack)
  // Fila 5: Imagen destacada
  const titleRow = rows[0];
  const descRow = rows[1];
  const packRows = rows.slice(2, -1);
  const imgRow = rows[rows.length - 1];

  // Contenedor Columna Izquierda (Información)
  const infoCol = document.createElement('div');
  infoCol.className = 'welcome-pack-info';

  // Cabecera
  const h2 = document.createElement('h2');
  h2.className = 'welcome-pack-title';
  h2.innerHTML = titleRow?.children[0]?.innerHTML.trim() || '';

  const pDesc = document.createElement('p');
  pDesc.className = 'welcome-pack-subtitle';
  pDesc.textContent = descRow?.children[0]?.textContent.trim() || '';

  infoCol.append(h2, pDesc);

  // Lista de Packs
  const packsList = document.createElement('ul');
  packsList.className = 'welcome-pack-list';

  packRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 3) return;

    const badgeText = cells[0]?.textContent.trim() || '';
    const packTitle = cells[1]?.textContent.trim() || '';
    const packDesc = cells[2]?.textContent.trim() || '';

    const li = document.createElement('li');
    li.className = 'pack-item';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'pack-header';

    const badgeSpan = document.createElement('span');
    badgeSpan.className = `pack-badge ${badgeText.toLowerCase() === 'opcional' ? 'is-optional' : 'is-included'}`;
    badgeSpan.textContent = badgeText;

    const h3 = document.createElement('h3');
    h3.className = 'pack-name';
    h3.textContent = packTitle;

    headerDiv.append(badgeSpan, h3);

    const descP = document.createElement('p');
    descP.className = 'pack-desc';
    descP.textContent = packDesc;

    li.append(headerDiv, descP);
    packsList.append(li);
  });

  infoCol.append(packsList);

// Contenedor Columna Derecha (Imagen)
  const imgCol = document.createElement('div');
  imgCol.className = 'welcome-pack-media';
  
  // Extraemos el picture o img directamente
  const pictureOrImg = imgRow?.querySelector('picture') || imgRow?.querySelector('img');
  if (pictureOrImg) {
    imgCol.append(pictureOrImg);
  }

  // Limpiar y estructurar bloque final
  block.innerHTML = '';
  block.classList.add('cards-welcome-pack');
  block.append(infoCol, imgCol);
}