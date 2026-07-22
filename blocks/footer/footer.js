/*
 * Footer Block - EDS
 */
export default function decorate(block) {
  // 1. Intentar capturar la imagen si viniera en el documento
  const rawPicture = block.querySelector('picture');
  const rawImg = block.querySelector('img');

  // Ruta a tu icono local dentro del proyecto
  const LOCAL_LOGO = '/icons/logo.png'; 

  // 2. Extraer enlaces legales existentes
  const rawLinks = [...block.querySelectorAll('a')];

  // 3. Extraer texto de Copyright
  let copyText = 'Real Madrid © 2026 Todos los derechos reservados';
  const paragraphs = [...block.querySelectorAll('p, div, span')];
  paragraphs.forEach((p) => {
    const txt = p.textContent?.trim();
    if (txt && (txt.includes('©') || txt.toLowerCase().includes('derechos'))) {
      copyText = txt;
    }
  });

  // --- RECONSTRUCCIÓN DEL DOM ---
  const container = document.createElement('div');
  container.className = 'footer-container';

  const brandGroup = document.createElement('div');
  brandGroup.className = 'footer-brand';

  const logoWrapper = document.createElement('div');
  logoWrapper.className = 'footer-logo';

  const img = document.createElement('img');

  if (rawPicture) {
    const picImg = rawPicture.querySelector('img');
    img.src = picImg ? picImg.src : LOCAL_LOGO;
  } else if (rawImg) {
    img.src = rawImg.src;
  } else {
    // Si la página en AEM/da.live no envía imagen, carga tu icono local
    img.src = LOCAL_LOGO;
  }

  img.alt = 'Real Madrid Logo';
  img.loading = 'eager';

  logoWrapper.appendChild(img);
  brandGroup.appendChild(logoWrapper);

  const copyright = document.createElement('span');
  copyright.className = 'footer-copyright';
  copyright.textContent = copyText;
  brandGroup.appendChild(copyright);

  // Lado derecho: Enlaces Legales
  const legalNav = document.createElement('nav');
  legalNav.className = 'footer-legal';

  const ul = document.createElement('ul');
  ul.className = 'footer-links';

  if (rawLinks.length > 0) {
    rawLinks.forEach((a) => {
      const li = document.createElement('li');
      li.className = 'footer-link-item';
      li.appendChild(a.cloneNode(true));
      ul.appendChild(li);
    });
  } else {
    const defaultLinks = [
      { text: 'Aviso legal', url: '#' },
      { text: 'Política de privacidad', url: '#' },
      { text: 'Política de cookies', url: '#' },
      { text: 'realmadrid.com', url: 'https://www.realmadrid.com' },
    ];
    defaultLinks.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'footer-link-item';
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.text;
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  legalNav.appendChild(ul);
  container.appendChild(brandGroup);
  container.appendChild(legalNav);

  block.replaceChildren(container);
}