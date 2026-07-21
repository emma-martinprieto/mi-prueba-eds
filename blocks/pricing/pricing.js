/*
 * Pricing block - EDS
 * Contenido esperado:
 * Fila 1: Eyebrow (ej. "Elige tu Membresía")
 * Fila 2: Título (ej. "Planes para cada Madridista")
 * Fila 3: Descripción
 * Fila 4: Texto enlace "Comparar planes"
 * Filas siguientes (una por card): Imagen | Badge superior (opcional, ej "El más elegido") |
 *   Precio (ej "13€/mes") | Subprecio (ej "o desde 149,90€/año") | Nombre plan | Descripción |
 *   Features (separadas por "|") | Texto botón CTA | Destacada (poner "si" o dejar vacío)
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [eyebrowRow, titleRow, descRow, compareRow, ...cardRows] = rows;

  const header = document.createElement('div');
  header.className = 'pricing-header';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'pricing-eyebrow';
  eyebrow.textContent = eyebrowRow?.textContent.trim() || '';
  const h2 = document.createElement('h2');
  h2.innerHTML = titleRow?.innerHTML || '';
  const desc = document.createElement('p');
  desc.textContent = descRow?.textContent.trim() || '';
  header.append(eyebrow, h2, desc);

  const cardsWrap = document.createElement('div');
  cardsWrap.className = 'pricing-cards';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const [imgCell, badgeCell, priceCell, subpriceCell, nameCell, descCell, featuresCell, ctaCell, highlightCell] = cells;
    const img = imgCell?.querySelector('img');
    const badgeText = badgeCell?.textContent.trim();
    const priceText = priceCell?.textContent.trim() || '';
    const [amount, period] = priceText.split('/');
    const isHighlighted = highlightCell?.textContent.trim().toLowerCase() === 'si';

    const card = document.createElement('div');
    card.className = `pricing-card${isHighlighted ? ' is-highlighted' : ''}`;

    if (badgeText) {
      const badge = document.createElement('span');
      badge.className = 'card-badge';
      badge.textContent = badgeText;
      card.append(badge);
    }

    const imgWrap = document.createElement('div');
    imgWrap.className = 'card-image';
    if (img) imgWrap.append(img);
    card.append(imgWrap);

    const body = document.createElement('div');
    body.className = 'card-body';

    const eyebrowText = document.createElement('p');
    eyebrowText.className = 'card-eyebrow';
    eyebrowText.textContent = 'Menos de';

    const priceWrap = document.createElement('div');
    priceWrap.className = 'card-price';
    priceWrap.innerHTML = `<span class="amount">${amount || priceText}</span>${period ? `<span class="period">/${period}</span>` : ''}`;

    const subprice = document.createElement('p');
    subprice.className = 'card-subprice';
    subprice.textContent = subpriceCell?.textContent.trim() || '';

    const name = document.createElement('p');
    name.className = 'card-title';
    name.textContent = nameCell?.textContent.trim() || '';

    const cardDesc = document.createElement('p');
    cardDesc.className = 'card-desc';
    cardDesc.textContent = descCell?.textContent.trim() || '';

    const featuresList = document.createElement('ul');
    featuresList.className = 'card-features';
    const features = (featuresCell?.textContent || '').split('|').map((f) => f.trim()).filter(Boolean);
    features.forEach((f) => {
      const li = document.createElement('li');
      li.textContent = f;
      featuresList.append(li);
    });

    body.append(eyebrowText, priceWrap, subprice, name, cardDesc, featuresList);

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    const seeAll = document.createElement('a');
    seeAll.className = 'card-see-all';
    seeAll.href = '#';
    seeAll.textContent = 'Ver todos los beneficios';
    const ctaBtn = document.createElement('button');
    ctaBtn.className = 'card-cta';
    ctaBtn.type = 'button';
    ctaBtn.textContent = ctaCell?.textContent.trim() || 'Únete';
    footer.append(seeAll, ctaBtn);

    card.append(body, footer);
    cardsWrap.append(card);
  });

  block.innerHTML = '';
  block.classList.add('pricing');
  block.append(header, cardsWrap);

  if (compareRow?.textContent.trim()) {
    const compareBtn = document.createElement('button');
    compareBtn.className = 'compare-plans';
    compareBtn.type = 'button';
    compareBtn.textContent = compareRow.textContent.trim();
    block.append(compareBtn);
  }
}