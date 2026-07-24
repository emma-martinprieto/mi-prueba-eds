/*
 * Plan Comparator block - EDS
 * Contenido esperado:
 * Fila 1: Título (ej. "Planes a tu medida")
 * Fila 2: Subtítulo/descripción
 * Fila 3: Cabecera de precios — 1 celda vacía + una celda por plan
 *         (nombre en negrita + "desde 149,90€/año" + subtexto opcional "o desde 12,90€/mes")
 * Filas de categoría: 1 celda con el nombre de la categoría (ej. "Membresía"), resto vacías
 * Filas de beneficio: nombre del beneficio | valor por plan (✓ · × · texto tipo "Digital")
 * Última fila: vacía | un enlace (texto+URL) por plan, para el botón de cada plan
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [titleRow, subtitleRow, priceHeaderRow, ...restRows] = rows;

  const wrapper = document.createElement('div');
  wrapper.className = 'plan-comparator-container';

  const header = document.createElement('div');
  header.className = 'plan-comparator-header';
  if (titleRow?.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.className = 'plan-comparator-title';
    h2.textContent = titleRow.textContent.trim();
    header.append(h2);
  }
  if (subtitleRow?.textContent.trim()) {
    const p = document.createElement('p');
    p.className = 'plan-comparator-subtitle';
    p.textContent = subtitleRow.textContent.trim();
    header.append(p);
  }

  const tableWrap = document.createElement('div');
  tableWrap.className = 'plan-comparator-table-wrap';

  const table = document.createElement('table');
  table.className = 'plan-comparator-table';

  // Cabecera de precios
  const thead = document.createElement('thead');
  const headTr = document.createElement('tr');
  const priceCells = [...(priceHeaderRow?.children || [])];
  priceCells.forEach((cell, i) => {
    const th = document.createElement('th');
    if (i === 0) {
      th.className = 'row-label-col';
    } else {
      const lines = cell.innerHTML.split(/<br\s*\/?>/i).map((l) => l.trim()).filter(Boolean);
      th.innerHTML = lines.map((line, li) => (li === 0 ? `<strong>${line}</strong>` : `<small>${line}</small>`)).join('');
    }
    headTr.append(th);
  });
  thead.append(headTr);
  table.append(thead);

  const tbody = document.createElement('tbody');
  const footerRowEl = restRows[restRows.length - 1];
  const isFooter = (row) => [...row.children].some((c) => c.querySelector('a'));
  const bodyRows = isFooter(footerRowEl) ? restRows.slice(0, -1) : restRows;

  bodyRows.forEach((row) => {
    const cells = [...row.children];
    const firstCellText = cells[0]?.textContent.trim() || '';
    const isCategory = cells.length > 1 && cells.slice(1).every((c) => c.textContent.trim() === '');

    const tr = document.createElement('tr');

    if (isCategory) {
      tr.className = 'plan-comparator-category-row';
      const td = document.createElement('td');
      td.colSpan = cells.length;
      td.innerHTML = `<div class="accordion-toggle"><span>${firstCellText}</span>
        <svg class="arrow-icon" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="#5E6A83" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg></div>`;
      td.addEventListener('click', () => {
        const collapsed = tr.classList.toggle('collapsed');
        let next = tr.nextElementSibling;
        while (next && !next.classList.contains('plan-comparator-category-row')) {
          next.classList.toggle('is-hidden', collapsed);
          next = next.nextElementSibling;
        }
      });
      tr.append(td);
    } else {
      tr.className = 'plan-comparator-row';
      cells.forEach((cell, i) => {
        const td = document.createElement('td');
        if (i === 0) td.className = 'row-label-col';
        let content = cell.innerHTML.trim();
        const plain = cell.textContent.trim();
        if (plain === '✓' || plain.toLowerCase() === 'v' || plain.toLowerCase() === 'si') {
          content = '<span class="icon-check" aria-label="Incluido"></span>';
        } else if (plain === '×' || plain.toLowerCase() === 'x' || plain === '-') {
          content = '<span class="icon-cross" aria-label="No incluido">×</span>';
        }
        td.innerHTML = content;
        tr.append(td);
      });
    }
    tbody.append(tr);
  });
  table.append(tbody);

  // Fila de botones (fuera del <tbody> con scroll, para que quede fija visualmente al final)
  if (footerRowEl && isFooter(footerRowEl)) {
    const footTr = document.createElement('tr');
    footTr.className = 'plan-comparator-footer-row';
    [...footerRowEl.children].forEach((cell, i) => {
      const td = document.createElement('td');
      if (i === 0) td.className = 'row-label-col';
      const link = cell.querySelector('a');
      if (link) {
        link.className = 'btn-plan';
        if (i === 2) link.classList.add('btn-plan-primary');
        else if (i === priceCells.length - 1) link.classList.add('btn-plan-ghost');
        else link.classList.add('btn-plan-outline');
        td.append(link);
      }
      footTr.append(td);
    });
    const tfoot = document.createElement('tfoot');
    tfoot.append(footTr);
    table.append(tfoot);
  }

  tableWrap.append(table);

  const navBtn = document.createElement('button');
  navBtn.className = 'plan-comparator-nav';
  navBtn.type = 'button';
  navBtn.setAttribute('aria-label', 'Ver más planes');
  navBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  navBtn.addEventListener('click', () => {
    tableWrap.scrollBy({ left: 140, behavior: 'smooth' });
  });

  const tableOuter = document.createElement('div');
  tableOuter.className = 'plan-comparator-table-outer';
  tableOuter.append(tableWrap, navBtn);

  block.innerHTML = '';
  block.classList.add('plan-comparator');
  wrapper.append(header, tableOuter);
  block.append(wrapper);

  const updateNav = () => {
    const maxScroll = tableWrap.scrollWidth - tableWrap.clientWidth - 4;
    navBtn.style.display = maxScroll > 4 ? 'flex' : 'none';
    navBtn.style.opacity = tableWrap.scrollLeft >= maxScroll ? '0' : '1';
  };
  tableWrap.addEventListener('scroll', () => window.requestAnimationFrame(updateNav));
  window.addEventListener('resize', updateNav);
  updateNav();

  // Mostrar/ocultar este bloque al pulsar "Comparar planes" en Pricing.
  // Usamos el wrapper (el div padre que EDS genera automáticamente con la
  // clase "plan-comparator-wrapper"), no el propio `block`, para poder
  // ocultar/mostrar toda la sección incluido su padding.
  const container = block.closest('.plan-comparator-wrapper') || block.parentElement;
  container.classList.add('is-hidden');

  document.addEventListener('toggle-plan-comparator', () => {
    container.classList.remove('is-hidden');
    container.classList.add('is-visible');
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}