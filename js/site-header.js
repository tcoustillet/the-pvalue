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
    const lang = this.getAttribute('lang') || 'en';
    const isSubpage = this.hasAttribute('is-subpage');

    const enHref = isSubpage ? '../en/index.html' : '?lang=en';
    const frHref = isSubpage ? '../fr/index.html' : '?lang=fr';

    this.innerHTML = `
      <header class="header">
        <div class="container">
          <div class="header-top">
            ${showBack ? `<a href="../../index.html" class="back-link">← ${lang === 'fr' ? 'Retour' : 'Back'}</a>` : '<div></div>'}
            <div class="lang-switcher">
              <a href="${enHref}" class="${lang === 'en' ? 'active' : ''}">🇬🇧 <span>EN</span></a>
              <a href="${frHref}" class="${lang === 'fr' ? 'active' : ''}">🇫🇷 <span>FR</span></a>
            </div>
          </div>
          ${title ? `<h1>${title}</h1>` : ''}
          ${tagline ? `<p class="tagline">${tagline}</p>` : ''}
        </div>
      </header>
    `;
  }
}

customElements.define('site-header', SiteHeader);