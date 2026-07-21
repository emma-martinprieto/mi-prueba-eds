export default function decorate(block) {
  console.log('HEADER DECORATE EJECUTADO');

  block.innerHTML = `
    <div class="nav-brand">
      <span>LOGO</span>
    </div>

    <div class="nav-actions">
      <div class="nav-lang">ES</div>
    </div>
  `;
}