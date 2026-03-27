/**
 * Controls for the interactive binomial figure.
 * Manages the n slider, the mode radio buttons, and the k input field.
 */
const Controls = {
  N_MIN: 2,
  N_MAX: 100,
  N_DEFAULT: 20,

  P_DEFAULT: 0.5,

  K_DEFAULT: 15,

  MODE_EQ: 'eq',
  MODE_GTE: 'gte',
  MODE_DEFAULT: 'eq',

  /**
   * Initializes the controls and binds event listeners.
   * @param {string} selector - CSS selector of the controls container.
   * @param {Function} onChange - Callback called with state on any change.
   * @returns {Object} Initial state { n, p, k, mode }.
   */
  init(selector, onChange) {
    const container = document.querySelector(selector);
    container.innerHTML = this._template();

    const sliderN    = container.querySelector('.n-slider');
    const sliderNVal = container.querySelector('.n-value');
    const sliderK    = container.querySelector('.k-slider');
    const inputK     = container.querySelector('.k-input');
    const radios     = container.querySelectorAll('.mode-radio');

    const getState = () => {
      const n    = parseInt(sliderN.value);
      const raw  = parseInt(inputK.value);
      const k    = !isNaN(raw) && raw >= 0 && raw <= n ? raw : null;
      const mode = container.querySelector('.mode-radio:checked').value;
      return { n, p: this.P_DEFAULT, k, mode };
    };

    sliderN.addEventListener('input', () => {
      const n = parseInt(sliderN.value);
      sliderNVal.textContent = n;
      sliderK.max = n;
      inputK.max  = n;
      if (parseInt(inputK.value) > n) {
        inputK.value  = n;
        sliderK.value = n;
      }
      onChange(getState());
    });

    sliderK.addEventListener('input', () => {
      inputK.value = sliderK.value;
      onChange(getState());
    });

    inputK.addEventListener('input', () => {
      const raw = parseInt(inputK.value);
      const n   = parseInt(sliderN.value);
      if (!isNaN(raw) && raw >= 0 && raw <= n) sliderK.value = raw;
      onChange(getState());
    });

    radios.forEach(r => r.addEventListener('change', () => onChange(getState())));

    return getState();
  },

  /**
   * Returns the HTML template for the controls.
   * @returns {string} HTML string.
   * @private
   */
  _template() {
    return `
      <div class="controls-grid">
        <div class="controls-col">
          <label>Nombre de lancers : <span class="n-value">${this.N_DEFAULT}</span></label>
          <input type="range" class="n-slider" min="${this.N_MIN}" max="${this.N_MAX}" value="${this.N_DEFAULT}">
        </div>
        <div class="controls-col">
          <div class="mode-radios">
            <label>
              <input type="radio" class="mode-radio" name="mode" value="${this.MODE_EQ}" checked>
              ${katex.renderToString('\\mathbb{P}(F = k)', { throwOnError: false })}
            </label>
            <label>
              <input type="radio" class="mode-radio" name="mode" value="${this.MODE_GTE}">
              ${katex.renderToString('\\mathbb{P}(F \\geq k)', { throwOnError: false })}
            </label>
          </div>
          <div class="k-input-row">
            <input type="range" class="k-slider" min="0" max="${this.N_DEFAULT}" value="${this.K_DEFAULT}">
            ${katex.renderToString('k =', { throwOnError: false })}
            <input type="number" class="k-input" min="0" max="${this.N_DEFAULT}" value="${this.K_DEFAULT}">
          </div>
        </div>
      </div>
    `;
  }
};