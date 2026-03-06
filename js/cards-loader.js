async function loadPage() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang') || (navigator.language.startsWith('fr') ? 'fr' : 'en');

  const [siteRes, cardsRes] = await Promise.all([
    fetch('content/site.json'),
    fetch('content/cards.json')
  ]);

  const site = await siteRes.json();
  const cards = await cardsRes.json();

  const header = document.querySelector('site-header');
  header.setAttribute('lang', lang);
  header.setAttribute('title', site.title[lang]);
  header.setAttribute('tagline', site.tagline[lang]);

  const container = document.getElementById('cards-container');
  cards.forEach(card => {
    const el = document.createElement('site-card');
    el.setAttribute('href', `${card.href}${lang}/`);
    el.setAttribute('thumbnail', card.thumbnail);
    el.setAttribute('title', card.title[lang]);
    el.setAttribute('description', card.description[lang]);
    container.appendChild(el);
  });
}

loadPage();