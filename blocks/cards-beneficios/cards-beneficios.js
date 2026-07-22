/*
 * Cards Beneficios block - EDS
 * Contenido esperado:
 * Fila 1: Título de sección (ej. "Todo lo que<br>te espera")
 * Fila 2: Descripción de sección
 * Filas siguientes (una por card): Imagen | Badge (categoría) | Título | Descripción
 *
 * Animaciones (anotación Figma):
 * - Entrada de sección: opacity 0->1, y 48px->0, 0.8s, al entrar en viewport
 * - Entrada de cards: opacity 0->1, y 32px->0, scale 0.97->1, stagger 80ms (máx ~560ms)
 * - Hover de card: imagen escala 1->1.06, 0.45s cubic-bezier(0.22,1,0.36,1) (CSS)
 * - Carrusel: arrastre manual (drag) o flechas para navegar
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [titleRow, descRow, ...cardRows] = rows;

  const header = document.createElement('div');
  header.className = 'section-header';

  if (titleRow) {
    const h2 = document.createElement('h2');
    h2.innerHTML = titleRow.innerHTML || '';
    header.append(h2);
  }

  if (descRow) {
    const p = document.createElement('p');
    p.className = 'section-desc';
    p.textContent = descRow.textContent.trim() || '';
    header.append(p);
  }

  const ul = document.createElement('ul');
  ul.className = 'cards-list';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const [imgCell, badgeCell, titleCell, textCell] = cells;
    const picture = imgCell?.querySelector('picture');
    if (!picture) return;

    const li = document.createElement('li');
    li.className = 'card-item';
    li.append(picture);

    const content = document.createElement('div');
    content.className = 'card-content';

    if (badgeCell?.textContent.trim()) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = badgeCell.textContent.trim();
      content.append(badge);
    }

    if (titleCell?.textContent.trim()) {
      const cardTitle = document.createElement('h3');
      cardTitle.className = 'card-title';
      cardTitle.textContent = titleCell.textContent.trim();
      content.append(cardTitle);
    }

    if (textCell?.textContent.trim()) {
      const cardText = document.createElement('p');
      cardText.className = 'card-text';
      cardText.textContent = textCell.textContent.trim();
      content.append(cardText);
    }

    li.append(content);
    ul.append(li);
  });

  const carouselWrap = document.createElement('div');
  carouselWrap.className = 'carousel-wrap';
  carouselWrap.append(ul);

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav prev';
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Anterior');
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  prevBtn.disabled = true;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav next';
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Siguiente');
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  carouselWrap.append(prevBtn, nextBtn);

  block.innerHTML = '';
  block.classList.add('cards-beneficios');
  block.append(header, carouselWrap);

  setupCarousel(ul, prevBtn, nextBtn);
  setupScrollAnimations(header, ul);
}

function setupCarousel(list, prevBtn, nextBtn) {
  const scrollAmount = () => (list.querySelector('.card-item')?.offsetWidth || 380) + 32;

  const updateNavState = () => {
    const maxScroll = list.scrollWidth - list.clientWidth - 4;
    prevBtn.disabled = list.scrollLeft <= 4;
    nextBtn.disabled = list.scrollLeft >= maxScroll;
  };

  prevBtn.addEventListener('click', () => {
    list.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    list.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  list.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateNavState);
  });

  // Arrastre manual (drag) con ratón
  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  list.addEventListener('mousedown', (e) => {
    isDown = true;
    list.classList.add('is-dragging');
    startX = e.pageX;
    startScroll = list.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    list.classList.remove('is-dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    list.scrollLeft = startScroll - dx;
  });

  updateNavState();
  window.addEventListener('resize', updateNavState);
}

function setupScrollAnimations(header, list) {
  const cards = [...list.querySelectorAll('.card-item')];

  const headerObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      header.classList.add('is-visible');
      obs.disconnect();
    });
  }, { threshold: 0.2 });
  headerObserver.observe(header);

  const cardsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      cards.forEach((card, i) => {
        const delay = Math.min(i * 80, 560);
        card.style.transitionDelay = `${delay}ms`;
        card.classList.add('is-visible');
      });
      obs.disconnect();
    });
  }, { threshold: 0.15 });
  cardsObserver.observe(list);
}