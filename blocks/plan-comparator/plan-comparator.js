export default function decorate(block) {
  // 1. Obtener todas las filas de la tabla nativa de AEM
  const rows = [...block.children];
  if (!rows.length) return;

  // Contenedor principal de la tabla
  const table = document.createElement('table');
  table.className = 'plan-comparator-table';

  const tbody = document.createElement('tbody');
  let currentCategoryRows = [];

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const firstCellText = cells[0]?.textContent.trim();

    // Comprobar si es la fila de encabezado del bloque
    if (index === 0 && firstCellText.toLowerCase() === 'plan-comparator') {
      return; // Omitir la primera fila de título de bloque AEM
    }

    // Título y Subtítulo de la sección
    if (index === 1 || index === 2) {
      // Procesado opcional para colocar el título fuera de la tabla si viene en las primeras filas
      return;
    }

    const tr = document.createElement('tr');

    // Detectar si es una fila de categoría/acordeón (solo tiene texto en la 1ª celda o está marcada en negrita)
    const isCategoryHeader = cells.length > 1 && cells.slice(1).every(c => c.textContent.trim() === '');

    if (isCategoryHeader) {
      tr.className = 'plan-comparator-category-row';
      const td = document.createElement('td');
      td.colSpan = cells.length;
      td.innerHTML = `
        <div class="accordion-toggle">
          <span>${firstCellText}</span>
          <span class="arrow-icon"></span>
        </div>
      `;

      // Evento Click para colapsar / desplegar grupo
      td.addEventListener('click', () => {
        tr.classList.toggle('collapsed');
        let nextRow = tr.nextElementSibling;
        while (nextRow && !nextRow.classList.contains('plan-comparator-category-row') && !nextRow.classList.contains('plan-comparator-footer-row')) {
          nextRow.classList.toggle('is-hidden');
          nextRow = nextRow.nextElementSibling;
        }
      });

      tr.appendChild(td);
    } else {
      // Detectar si es la última fila de botones de compra
      const isFooterRow = cells.some(c => c.querySelector('a'));
      if (isFooterRow) {
        tr.className = 'plan-comparator-footer-row';
      } else {
        tr.className = 'plan-comparator-row';
      }

      // Procesar cada celda
      cells.forEach((cell, cellIndex) => {
        const cellTag = (index === 3) ? 'th' : 'td'; // La fila 3 suele ser la cabecera de precios
        const td = document.createElement(cellTag);
        let content = cell.innerHTML.trim();

        // Reemplazar marcas de texto por iconos semánticos
        if (content === '✓' || content === 'v') {
          content = '<span class="icon-check" aria-label="Incluido"></span>';
        } else if (content === '×' || content === 'x') {
          content = '<span class="icon-cross" aria-label="No incluido">×</span>';
        }

        // Aplicar clases a los enlaces/botones del final
        if (isFooterRow && cellIndex > 0) {
          const link = cell.querySelector('a');
          if (link) {
            link.className = 'btn-plan';
            if (cellIndex === 2) {
              link.classList.add('btn-plan-primary'); // Destacar el plan Premium
            } else if (cellIndex === 4) {
              link.classList.add('btn-plan-ghost');
            } else {
              link.classList.add('btn-plan-outline');
            }
          }
        }

        td.innerHTML = content;
        tr.appendChild(td);
      });
    }

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  // Reemplazar la estructura original de AEM por la nueva tabla limpia
  block.innerHTML = '';
  block.appendChild(table);
}