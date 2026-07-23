/*
 * Pricing block - EDS
 * Contenido esperado:
 * Fila 1: Eyebrow (ej. "Elige tu Membresía")
 * Fila 2: Título (ej. "Planes para cada Madridista")
 * Fila 3: Descripción
 * Fila 4: Texto enlace "Comparar planes"
 * Filas siguientes (una por card): Imagen | Badge superior (opcional, ej "El más elegido") |
 *   Precio (ej "13€/mes") | Subprecio (ej "o desde 149,90€/año") | Nombre plan | Descripción |
 *   TODOS los beneficios separados por "|" (el bloque muestra los 4 primeros y el resto
 *   se oculta tras el desplegable "Ver todos los beneficios" si hay más de 4) |
 *   Texto botón CTA | Destacada (poner "si" o dejar vacío)
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

  const tierSelector = document.createElement('div');
  tierSelector.className = 'tier-selector';

  const cardsWrap = document.createElement('div');
  cardsWrap.className = 'pricing-cards';

  const cardEls = [];

  cardRows.forEach((row, index) => {
    const cells = [...row.children];
    const [imgCell, badgeCell, priceCell, subpriceCell, nameCell, descCell, featuresCell, ctaCell, highlightCell] = cells;
    const img = imgCell?.querySelector('img');
    const badgeText = badgeCell?.textContent.trim();
    const priceText = priceCell?.textContent.trim() || '';
    const [amount, period] = priceText.split('/');
    const isHighlighted = highlightCell?.textContent.trim().toLowerCase() === 'si';
    const planName = nameCell?.textContent.trim() || '';

    const card = document.createElement('div');
    card.className = `pricing-card${isHighlighted ? ' is-highlighted' : ''}`;
    card.dataset.tierIndex = index;

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
    eyebrowText.innerHTML = amount && amount.toLowerCase() !== 'gratis' ? 'Menos de' : '&nbsp;';

    const priceWrap = document.createElement('div');
    priceWrap.className = 'card-price';
    priceWrap.innerHTML = `<span class="amount">${amount || priceText}</span>${period ? `<span class="period">/${period}</span>` : ''}`;

    const subprice = document.createElement('p');
    subprice.className = 'card-subprice';
    subprice.textContent = subpriceCell?.textContent.trim() || '';

    const name = document.createElement('p');
    name.className = 'card-title';
    name.textContent = planName;

    const cardDesc = document.createElement('p');
    cardDesc.className = 'card-desc';
    cardDesc.textContent = descCell?.textContent.trim() || '';

    const featureParagraphs = [...(featuresCell?.querySelectorAll('p') || [])]
      .map((p) => p.textContent.trim())
      .filter(Boolean);
    const allFeatures = featureParagraphs.length > 1
      ? featureParagraphs
      : (featuresCell?.textContent || '').split('|').map((f) => f.trim()).filter(Boolean);
    const shortFeatures = allFeatures.slice(0, 4);
    const extraFeatures = allFeatures.slice(4);

    const featuresList = document.createElement('ul');
    featuresList.className = 'card-features';
    shortFeatures.forEach((f) => {
      const li = document.createElement('li');
      li.textContent = f;
      featuresList.append(li);
    });

    body.append(eyebrowText, priceWrap, subprice, name, cardDesc, featuresList);

    // Desplegable de beneficios adicionales (solo si hay más de 4)
    if (extraFeatures.length > 0) {
      const extraWrap = document.createElement('div');
      extraWrap.className = 'features-extra-wrap';
      const extraInner = document.createElement('div');
      extraInner.className = 'features-extra-inner';
      const extraList = document.createElement('ul');
      extraList.className = 'card-features';
      extraFeatures.forEach((f) => {
        const li = document.createElement('li');
        li.textContent = f;
        extraList.append(li);
      });
      extraInner.append(extraList);
      extraWrap.append(extraInner);
      body.append(extraWrap);

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'toggle-benefits';
      toggleBtn.type = 'button';
      toggleBtn.innerHTML = '<span class="toggle-label">Ver todos los beneficios</span><svg viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      toggleBtn.addEventListener('click', () => {
        const isOpen = extraWrap.classList.toggle('is-open');
        toggleBtn.classList.toggle('is-open', isOpen);
        toggleBtn.querySelector('.toggle-label').textContent = isOpen ? 'Ver menos' : 'Ver todos los beneficios';
      });
      body.append(toggleBtn);
    }

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    const ctaBtn = document.createElement('button');
    ctaBtn.className = 'card-cta';
    ctaBtn.type = 'button';
    ctaBtn.textContent = ctaCell?.textContent.trim() || 'Únete';
    footer.append(ctaBtn);

    card.append(body, footer);
    cardsWrap.append(card);
    cardEls.push(card);

    // Pestaña del selector de tier (una por card, en el mismo orden)
    const shortLabel = planName.replace(/^Madridista\s*/i, '') || `Plan ${index + 1}`;
    const tierBtn = document.createElement('button');
    tierBtn.type = 'button';
    tierBtn.textContent = shortLabel;
    if (isHighlighted) tierBtn.classList.add('is-active');
    tierBtn.addEventListener('click', () => {
      [...tierSelector.children].forEach((b) => b.classList.remove('is-active'));
      tierBtn.classList.add('is-active');
      cardEls.forEach((c) => c.classList.remove('is-highlighted'));
      card.classList.add('is-highlighted');
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    tierSelector.append(tierBtn);
  });

  // Por defecto, la segunda tarjeta (índice 1) aparece destacada y su pestaña activa
  const defaultIndex = cardEls.length > 1 ? 1 : 0;
  cardEls.forEach((c, i) => c.classList.toggle('is-highlighted', i === defaultIndex));
  [...tierSelector.children].forEach((b, i) => b.classList.toggle('is-active', i === defaultIndex));

  const cardsWrapOuter = document.createElement('div');
  cardsWrapOuter.className = 'pricing-cards-wrap';
  cardsWrapOuter.append(cardsWrap);

  const prevNav = document.createElement('button');
  prevNav.className = 'pricing-nav prev';
  prevNav.type = 'button';
  prevNav.setAttribute('aria-label', 'Plan anterior');
  prevNav.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  prevNav.style.left = '8px';
  prevNav.style.right = 'auto';

  const nextNav = document.createElement('button');
  nextNav.className = 'pricing-nav next';
  nextNav.type = 'button';
  nextNav.setAttribute('aria-label', 'Siguiente plan');
  nextNav.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  nextNav.addEventListener('click', () => {
    const cardWidth = cardEls[0]?.getBoundingClientRect().width || 300;
    cardsWrap.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
  });
  prevNav.addEventListener('click', () => {
    const cardWidth = cardEls[0]?.getBoundingClientRect().width || 300;
    cardsWrap.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
  });

  cardsWrapOuter.append(prevNav, nextNav);

  block.innerHTML = '';
  block.classList.add('pricing');
  block.append(header, tierSelector, cardsWrapOuter);

  if (compareRow?.textContent.trim()) {
    const compareBtn = document.createElement('button');
    compareBtn.className = 'compare-plans';
    compareBtn.type = 'button';
    compareBtn.textContent = compareRow.textContent.trim();
    block.append(compareBtn);
  }

  // En el carrusel móvil, resalta la pestaña de la card que está centrada al hacer scroll manual
  const observer = new IntersectionObserver((entries) => {
    if (!window.matchMedia('(width <= 1100px)').matches) return;
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        const idx = entry.target.dataset.tierIndex;
        [...tierSelector.children].forEach((b, i) => {
          b.classList.toggle('is-active', String(i) === idx);
        });
        cardEls.forEach((c, i) => {
          c.classList.toggle('is-highlighted', String(i) === idx);
        });
      }
    });
  }, { root: cardsWrap, threshold: [0.6] });
  cardEls.forEach((c) => observer.observe(c));
}