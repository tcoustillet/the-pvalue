async function loadCards() {
  const response = await fetch('cards.json');
  const cards = await response.json();
  const container = document.getElementById('cards-container');

  cards.forEach(card => {
    const el = document.createElement('site-card');
    el.setAttribute('href', card.href);
    el.setAttribute('thumbnail', card.thumbnail);
    el.setAttribute('title', card.title);
    el.setAttribute('description', card.description);
    container.appendChild(el);
  });
}

loadCards();