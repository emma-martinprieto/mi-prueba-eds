/*
 * Header Block - EDS
 */
export default function decorate(block) {
  // Ruta a tu imagen local del header
  const LOGO_SRC = '/icons/logo_header.png';

  // 1. Contenedor nav principal
  const nav = document.createElement('nav');
  nav.className = 'nav-wrapper';

  // 2. Izquierda: Logo
  const brandSection = document.createElement('div');
  brandSection.className = 'nav-brand';

  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.ariaLabel = 'Inicio';

  const logoImg = document.createElement('img');
  logoImg.src = LOGO_SRC;
  logoImg.alt = 'Logo';
  logoImg.loading = 'eager';

  logoLink.appendChild(logoImg);
  brandSection.appendChild(logoLink);

  // 3. Derecha: Selector de Idioma (ES)
  const toolsSection = document.createElement('div');
  toolsSection.className = 'nav-tools';

  const langSelector = document.createElement('div');
  langSelector.className = 'nav-lang-btn';
  langSelector.innerHTML = `
    <span>ES</span>
    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L6 6L11 1" stroke="#EDEBFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  toolsSection.appendChild(langSelector);

  // 4. Montar estructura
  nav.appendChild(brandSection);
  nav.appendChild(toolsSection);

  // Reemplazar todo lo que viniera por defecto en el HTML por esta estructura
  block.replaceChildren(nav);
}