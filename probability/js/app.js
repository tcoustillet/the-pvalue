/**
 * Entry point for the interactive Gaussian figure on test2.
 * Wires together the chart and the controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  window.katexReady.then(() => {
    GaussianChart.init('#chart-container');

    const initialState = Controls.init(
      '#controls-container',
      (state) => {
        const prob = GaussianChart.update(state);
        updateDescription(state, prob, LANG);
      },
      LANG
    );

    renderMathInElement(document.getElementById('controls-container'), {
      delimiters: [{ left: '$', right: '$', display: false }],
    });

    const prob = GaussianChart.update(initialState);
    updateDescription(initialState, prob, LANG);
  });
});

/**
 * Updates the dynamic description paragraph below the chart.
 * @param {Object} state - Current controls state.
 * @param {number|null} prob - Computed probability.
 * @param {Object} LANG
 * @param {Function} LANG.textLess
 * @param {Function} LANG.textGreater
 * @param {Function} LANG.textBetween
 */
function updateDescription(state, prob, LANG) {
  const description = document.querySelector('#chart-description');
  if (!description) return;

  if (prob === null) {
    description.textContent = '';
    return;
  }

  const { probType, mu, sigma, a, b, condition, groupLabel } = state;
  const randomVar = LANG.randomVarLabel;
  const probPercent = `${(prob * 100).toFixed(1)}`;
  const preset = Controls.PRESETS.find((p) => p.mu === mu && p.sigma === sigma);
  const emoji = preset ? preset.label : '';

  const probTexts = {
    less: `\\mathbb{P}(${randomVar} \\leq ${a} \\mid ${emoji}) = ${probPercent}\\%`,
    greater: `\\mathbb{P}(${randomVar} \\geq ${a} \\mid ${emoji}) = ${probPercent}\\%`,
    between: `\\mathbb{P}(${a} \\leq ${randomVar} \\leq ${b} \\mid ${emoji}) = ${probPercent}\\%`,
  };

  const renderedMath = katex.renderToString(probTexts[probType], { throwOnError: false });

  const naturalTexts = {
    less: LANG.textLess(a, condition, groupLabel, probPercent),
    greater: LANG.textGreater(a, condition, groupLabel, probPercent),
    between: LANG.textBetween(a, b, condition, groupLabel, probPercent),
  };

  description.innerHTML = `
    <p style="text-align: center;">${renderedMath}</p>
    <p>${naturalTexts[probType]}</p>
  `;
}
