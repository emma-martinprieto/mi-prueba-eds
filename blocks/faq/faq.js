/*
 * FAQ block - EDS
 * Contenido esperado:
 * Fila 1: Eyebrow (ej. "Preguntas frecuentes")
 * Fila 2: Título (ej. "Resolvemos tus dudas")
 * Fila 3: Descripción
 * Filas siguientes (una por pregunta): Pregunta | Respuesta
 * Última fila (opcional): Texto footer | Texto botón + enlace ("Ver todas...")
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [eyebrowRow, titleRow, descRow, ...rest] = rows;

  // Modificado: Si la última fila tiene un enlace, la separamos como footer
  const footerRow = rest[rest.length - 1];
  const hasFooter = footerRow && footerRow.querySelector('a');
  const faqRows = hasFooter ? rest.slice(0, -1) : rest;

  const header = document.createElement('div');
  header.className = 'faq-header';
  
  const eyebrow = document.createElement('p');
  eyebrow.className = 'faq-eyebrow';
  eyebrow.textContent = eyebrowRow?.textContent.trim() || '';
  
  const h2 = document.createElement('h2');
  h2.textContent = titleRow?.textContent.trim() || '';
  
  const desc = document.createElement('p');
  desc.textContent = descRow?.textContent.trim() || '';
  
  header.append(eyebrow, h2, desc);

  const list = document.createElement('div');
  list.className = 'faq-list';

  faqRows.forEach((row) => {
    const [qCell, aCell] = [...row.children];
    const question = qCell?.textContent.trim();
    if (!question) return;

    const item = document.createElement('div');
    item.className = 'faq-row';

    const btn = document.createElement('button');
    btn.className = 'faq-question';
    btn.type = 'button';
    btn.textContent = question;

    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    
    // Usamos innerHTML en lugar de textContent por si la respuesta tiene enlaces o negritas en el documento
    const p = document.createElement('p');
    p.innerHTML = aCell?.innerHTML || '';
    answer.append(p);

    // CONTROL DINÁMICO DE ALTURA
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      if (isOpen) {
        item.classList.remove('is-open');
        answer.style.maxHeight = null; // Cierra la respuesta
      } else {
        item.classList.add('is-open');
        // Asigna la altura real exacta del contenido interno
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });

    item.append(btn, answer);
    list.append(item);
  });

  block.innerHTML = '';
  block.classList.add('faq');
  block.append(header, list);

  // Renderizar el footer correctamente fuera de la lista
  if (hasFooter) {
    const footer = document.createElement('div');
    footer.className = 'faq-footer';
    
    // Obtenemos el texto limpio quitando el texto que contiene el enlace para que no se repita
    const link = footerRow.querySelector('a');
    
    // Clonamos la celda para manipular su texto de forma segura sin romper el enlace original
    const cellClone = footerRow.firstElementChild.cloneNode(true);
    const linkInClone = cellClone.querySelector('a');
    if (linkInClone) linkInClone.remove(); // Quitamos el enlace del clon para quedarnos solo con el texto superior
    
    const p = document.createElement('p');
    p.textContent = cellClone.textContent.replace('->', '').trim();
    
    // Le añadimos la clase botón clásica de EDS al enlace por si acaso
    if (link) link.classList.add('button');

    footer.append(p, link);
    block.append(footer);
  }
}