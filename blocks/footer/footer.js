/*
 * Footer block - EDS
 * Contenido esperado:
 * Fila 1: Logo (imagen) + texto copyright (dos celdas)
 * Filas siguientes: enlaces legales (texto + link cada uno), ej: "Aviso legal" -> #, etc.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [brandRow, ...linkRows] = rows;

  const [logoCell, copyrightCell] = [...(brandRow?.children || [])];
  const logo = logoCell?.querySelector('img');
  const copyrightText = copyrightCell?.textContent.trim() || '';

  block.innerHTML = '';
  block.classList.add('footer');

  const brand = document.createElement('div');
  brand.className = 'footer-brand';
  if (logo) brand.append(logo);
  const p = document.createElement('p');
  p.textContent = copyrightText;
  brand.append(p);

  const legal = document.createElement('nav');
  legal.className = 'footer-legal';

  linkRows.forEach((row, i) => {
    const link = row.querySelector('a');
    const text = row.textContent.trim();
    const a = link || document.createElement('a');
    if (!link) {
      a.href = '#';
      a.textContent = text;
    }
    if (i > 0) {
      const divider = document.createElement('span');
      divider.className = 'divider';
      divider.textContent = '•';
      legal.append(divider);
    }
    legal.append(a);
  });

  block.append(brand, legal);
}