const PRESET = { mu: 18, sigma: 4 };

/** @type {number} Minimum allowed input value */
const INPUT_MIN = 18;

/** @type {number} Maximum allowed input value */
const INPUT_MAX = 32;

/** @type {number} Default threshold value */
const INPUT_DEFAULT = 25;

const Controls = {
  init(selector, onChange) {
    const container = document.querySelector(selector);

    // --- Wrapper ---
    const wrapper = document.createElement('div');
    wrapper.classList.add('controls__wrapper');

    const inner = document.createElement('div');
    inner.classList.add('controls__inner');

    // --- Number input ---
    const numberInput = document.createElement('input');
    numberInput.type = 'number';
    numberInput.min = INPUT_MIN;
    numberInput.max = INPUT_MAX;
    numberInput.step = 0.1;
    numberInput.value = INPUT_DEFAULT;
    numberInput.classList.add('threshold-input');

    // --- Slider ---
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = INPUT_MIN;
    slider.max = INPUT_MAX;
    slider.step = 0.1;
    slider.value = INPUT_DEFAULT;
    slider.classList.add('controls__slider');

    // --- Box ---
    const box = document.createElement('div');
    box.classList.add('controls__box');

    // Row : sentence + value display
    const row = document.createElement('div');
    row.classList.add('controls__row');

    const sentenceEl = document.createElement('span');
    sentenceEl.classList.add('controls__sentence');
    sentenceEl.innerHTML = LANG.controlTreeSentence;

    renderMathInElement(sentenceEl, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
    });

    const valueDisplay = document.createElement('span');
    valueDisplay.classList.add('controls__value-display');
    valueDisplay.textContent = INPUT_DEFAULT;

    row.appendChild(sentenceEl);
    row.appendChild(valueDisplay);

    // Slider row : slider + number input
    const sliderRow = document.createElement('div');
    sliderRow.classList.add('controls__slider-row');
    sliderRow.appendChild(slider);
    sliderRow.appendChild(numberInput);

    box.appendChild(row);
    box.appendChild(sliderRow);

    inner.appendChild(box);
    wrapper.appendChild(inner);
    container.appendChild(wrapper);

    // --- Value updater ---
    const updateValue = () => {
      const raw = parseFloat(numberInput.value);
      const threshold = !isNaN(raw) && raw >= INPUT_MIN && raw <= INPUT_MAX ? raw : null;
      valueDisplay.textContent = threshold !== null ? threshold : '–';
      return { mu: PRESET.mu, sigma: PRESET.sigma, threshold };
    };

    // --- Sync slider <-> input ---
    slider.addEventListener('input', () => {
      numberInput.value = slider.value;
      onChange(...Object.values(updateValue()));
    });

    numberInput.addEventListener('input', () => {
      const raw = parseFloat(numberInput.value);
      if (!isNaN(raw) && raw >= INPUT_MIN && raw <= INPUT_MAX) {
        slider.value = raw;
      }
      onChange(...Object.values(updateValue()));
    });

    return updateValue();
  },
};
