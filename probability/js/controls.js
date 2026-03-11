/**
 * Controls for the interactive Gaussian figure.
 * Manages probability type selection, distribution selection and input values.
 */
const Controls = {
  /** @type {Array} Available distribution presets */
  PRESETS: [
    { label: '🇫🇷', name: 'qu\'elle est de nationalité française', name_2: 'français', mu: 170, sigma: 6 },
    { label: '🇫🇷 ♀', name: 'qu\'il s\'agit d\'une femme française', name_2: 'françaises',  mu: 164, sigma: 6 },
    { label: '🇫🇷 ♂︎', name: 'qu\'il s\'agit d\'un homme français', name_2: 'hommes français', mu: 176, sigma: 6 },
    { label: '🇸🇪 ', name: 'qu\'elle est de nationalité suédoise', name_2: 'suédois', mu: 174, sigma: 6 },
    { label: '🇸🇪 ♀', name: 'qu\'il s\'agit d\'une femme suédoise', name_2: 'suédoises', mu: 167, sigma: 6 },
    { label: '🇸🇪 ♂︎', name: 'qu\'il s\'agit d\'homme suédois', name_2: 'hommes suédois', mu: 181, sigma: 6 },
    { label: '🇺🇸 ♂︎ 🏀', name: 'qu\'il s\'agit d\'un basketteur américain', name_2: 'basketteurs américains', mu: 199, sigma: 6 }
  ],

  /** @type {number} Default value for input A */
  DEFAULT_A: 172,

  /** @type {number} Default value for input B */
  DEFAULT_B: 184,

  /** @type {number} Minimum allowed input value */
  INPUT_MIN: 140,

  /** @type {number} Maximum allowed input value */
  INPUT_MAX: 225,

  /**
   * Creates a number input field.
   * @param {string} name - Input name attribute.
   * @param {number} defaultValue - Default value.
   * @returns {HTMLInputElement}
   */
  createInput(name, defaultValue) {
    const input = document.createElement('input');
    input.type = 'number';
    input.name = name;
    input.min = this.INPUT_MIN;
    input.max = this.INPUT_MAX;
    input.value = defaultValue;
    input.classList.add('threshold-input');
    return input;
  },

  /**
   * Initializes the controls and binds event listeners.
   * @param {string} selector - CSS selector of the controls container.
   * @param {Function} onChange - Callback called with state on any change.
   * @returns {Object} Initial state.
   */
  init(selector, onChange) {
    const container = document.querySelector(selector);
    container.classList.add('controls-grid');

    const inputA1 = this.createInput('a1', this.DEFAULT_A);
    const inputA2 = this.createInput('a2', this.DEFAULT_A);
    const inputA3 = this.createInput('a3', this.DEFAULT_A);
    const inputB3 = this.createInput('b3', this.DEFAULT_B);

    // --- Left column: probability type ---
    const leftCol = document.createElement('div');
    leftCol.classList.add('controls-col', 'controls-col--left');

    const probTypes = [
      { value: 'less',    node: this._buildLabel('prob-type', 'less',    [' $\\mathbb{P}(T < \\;$', inputA1, '$\\;)$']) },
      { value: 'greater', node: this._buildLabel('prob-type', 'greater', [' $\\mathbb{P}(T > \\;$', inputA2, '$\\;)$']) },
      { value: 'between', node: this._buildLabel('prob-type', 'between', [' $\\mathbb{P}($', inputA3, '$\\; < T < \\;$', inputB3, '$)$']) }
    ];

    probTypes.forEach(({ node }, index) => {
      if (index === 0) node.querySelector('input[type="radio"]').checked = true;
      leftCol.appendChild(node);
    });

    // --- Middle column: "sachant" ---
    const middleCol = document.createElement('div');
    middleCol.classList.add('controls-col', 'controls-col--middle');

    ['sachant', 'sachant', 'sachant'].forEach(text => {
      const span = document.createElement('span');
      span.textContent = text;
      span.style.display = 'block';
      middleCol.appendChild(span);
    });

    // --- Right column 1: first 3 distributions ---
    const rightCol1 = document.createElement('div');
    rightCol1.classList.add('controls-col', 'controls-col--right');

    // --- Right column 2: next 3 distributions ---
    const rightCol2 = document.createElement('div');
    rightCol2.classList.add('controls-col', 'controls-col--right');

    // --- Right column 3: last distribution ---
    const rightCol3 = document.createElement('div');
    rightCol3.classList.add('controls-col', 'controls-col--right');

    this.PRESETS.forEach((preset, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'distribution';
      input.value = index;
      if (index === 0) input.checked = true;
      label.appendChild(input);
      label.appendChild(document.createTextNode(` ${preset.label}`));

      if (index < 3) rightCol1.appendChild(label);
      else if (index < 6) rightCol2.appendChild(label);
      else rightCol3.appendChild(label);
    });

    container.appendChild(leftCol);
    container.appendChild(middleCol);
    container.appendChild(rightCol1);
    container.appendChild(rightCol2);
    container.appendChild(rightCol3);

    // --- Get current state ---
    const getState = () => {
      const probType = container.querySelector('input[name="prob-type"]:checked').value;
      const presetIndex = container.querySelector('input[name="distribution"]:checked').value;
      const preset = this.PRESETS[presetIndex];

      const rawA = probType === 'less' ? inputA1 : probType === 'greater' ? inputA2 : inputA3;
      const a = parseFloat(rawA.value);
      const b = parseFloat(inputB3.value);

      return {
        probType,
        mu: preset.mu,
        sigma: preset.sigma,
        a: !isNaN(a) && a >= this.INPUT_MIN && a <= this.INPUT_MAX ? a : null,
        b: !isNaN(b) && b >= this.INPUT_MIN && b <= this.INPUT_MAX ? b : null
      };
    };

    // --- Event listeners ---
    container.addEventListener('change', () => onChange(getState()));
    [inputA1, inputA2, inputA3, inputB3].forEach(input => {
      input.addEventListener('input', () => onChange(getState()));
    });

    return getState();
  },

  /**
   * Builds a radio label with mixed text and input nodes.
   * @param {string} name - Radio group name.
   * @param {string} value - Radio value.
   * @param {Array} children - Array of strings or HTMLElements.
   * @returns {HTMLLabelElement}
   */
  _buildLabel(name, value, children) {
    const label = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = name;
    radio.value = value;
    label.appendChild(radio);
    children.forEach(child => {
      if (typeof child === 'string') {
        label.appendChild(document.createTextNode(child));
      } else {
        label.appendChild(child);
      }
    });
    return label;
  }
};