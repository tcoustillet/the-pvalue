class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="container">
          <p>&copy; 2026 &middot; Thibaut Coustillet &middot; All rights reserved</p>
        </div>
    </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);