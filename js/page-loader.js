async function loadPageHeader() {
  const response = await fetch('../cards.json');
  const cards = await response.json();

  const currentPath = window.location.pathname;
  const card = cards.find(c => currentPath.includes(c.href.replace('/', '')));

  if (!card) return;

  const header = document.querySelector('site-header');
  header.setAttribute('title', card.title);
  header.setAttribute('tagline', card.description);

  const container = document.querySelector('main .container');
  if (!container.querySelector('*')) {
    container.innerHTML = `
      <div class="coming-soon">
        <p>🛠️ Work in progress... Stay tuned, this page is coming soon! 🌱</p>
        <blockquote>
          <p><em>"I was taught that the way of progress was neither swift nor easy."</em></p>
          <cite>— Marie Curie</cite>
        </blockquote>
      </div>
    `;
  }
}

loadPageHeader();