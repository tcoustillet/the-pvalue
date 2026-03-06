async function loadPageHeader() {
  const lang = window.location.pathname.includes('/fr/') ? 'fr' : 'en';

  const [siteRes, cardsRes] = await Promise.all([
    fetch('../../content/site.json'),
    fetch('../../content/cards.json')
  ]);

  const site = await siteRes.json();
  const cards = await cardsRes.json();

  const currentPath = window.location.pathname;
  const card = cards.find(c => currentPath.includes(c.href.replace('/', '')));

  if (!card) return;

  const header = document.querySelector('site-header');
  header.setAttribute('title', card.title[lang]);
  header.setAttribute('tagline', card.description[lang]);

  const container = document.querySelector('main .container');
  if (!container.querySelector('*')) {
    const content = site.comingSoon[lang];
    container.innerHTML = `
      <div class="coming-soon">
        <p>${content.message}</p>
        <blockquote>
          <p><em>${content.quote}</em></p>
          <cite>${content.author}</cite>
        </blockquote>
      </div>
    `;
  }
}

loadPageHeader();