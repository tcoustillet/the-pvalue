class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <p>&copy; 2026 &middot; Thibaut Coustillet &middot; All rights reserved</p>
    </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);