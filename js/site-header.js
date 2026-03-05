class SiteHeader extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title');
    const tagline = this.getAttribute('tagline');
    const showBack = this.hasAttribute('show-back');

    this.innerHTML = `
      <header class="header">
        <div class="container">
          ${showBack ? '<a href="../index.html" class="back-link">← Back</a>' : ''}
          <h1>${title}</h1>
          ${tagline ? `<p class="tagline">${tagline}</p>` : ''}
        </div>
      </header>
    `;
  }
}

customElements.define('site-header', SiteHeader);