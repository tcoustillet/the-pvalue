class SiteCard extends HTMLElement {
  connectedCallback() {
    const href = this.getAttribute('href');
    const thumbnail = this.getAttribute('thumbnail');
    const title = this.getAttribute('title');
    const description = this.getAttribute('description');

    this.innerHTML = `
      <div class="card">
        <a href="${href}">
          <img src="${thumbnail}">
          <h2>${title}</h2>
          <p>${description}</p>
        </a>
      </div>
    `;
  }
}

customElements.define('site-card', SiteCard);