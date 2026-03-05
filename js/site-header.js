class SiteHeader extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'tagline'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || '';
    const tagline = this.getAttribute('tagline') || '';
    const showBack = this.hasAttribute('show-back');

    this.innerHTML = `
      <header class="header">
        <div class="container">
          ${showBack ? '<a href="../index.html" class="back-link">← Back</a>' : ''}
          ${title ? `<h1>${title}</h1>` : ''}
          ${tagline ? `<p class="tagline">${tagline}</p>` : ''}
        </div>
      </header>
    `;
  }
}

customElements.define('site-header', SiteHeader);