class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <p>
        &copy; 2026 &middot; Thibaut Coustillet
        <a href="https://github.com/tcoustillet/" target="_blank" rel="noopener noreferrer" class="footer-github-link">
        <img src="assets/GitHub_Invertocat_White.svg" alt="Github" width="16" height="16">
        </a>
        &middot; All rights reserved
        </p>
    </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);
