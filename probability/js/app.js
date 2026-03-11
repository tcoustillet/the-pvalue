/**
 * Entry point for the interactive Gaussian figure on test2.
 * Wires together the chart and the controls.
 */
document.addEventListener('DOMContentLoaded', () => {
  GaussianChart.init('#chart-container');

  const initialState = Controls.init('#controls-container', (state) => {
    const prob = GaussianChart.update(state);
    updateDescription(state, prob);
  });

  renderMathInElement(document.getElementById('controls-container'), {
    delimiters: [
      { left: '$', right: '$', display: false }
    ]
  });

  const prob = GaussianChart.update(initialState);
  updateDescription(initialState, prob);
});

/**
 * Updates the dynamic description paragraph below the chart.
 * @param {Object} state - Current controls state.
 * @param {number|null} prob - Computed probability.
 */
function updateDescription(state, prob) {
  const description = document.querySelector('#chart-description');
  if (!description) return;

  if (prob === null) {
    description.textContent = '';
    return;
  }

  const { probType, mu, sigma, a, b } = state;
  const probPercent = `${(prob * 100).toFixed(1)}`;
  const preset = Controls.PRESETS.find(p => p.mu === mu && p.sigma === sigma);
  const emoji = preset ? preset.label : '';

  const probTexts = {
    less: `\\mathbb{P}(T < ${a} \\mid ${emoji}) = ${probPercent}\\%`,
    greater: `\\mathbb{P}(T > ${a} \\mid ${emoji}) = ${probPercent}\\%`,
    between: `\\mathbb{P}(${a} < T < ${b} \\mid ${emoji}) = ${probPercent}\\%`
  };

  const renderedMath = katex.renderToString(probTexts[probType], { throwOnError: false });

  const naturalTexts = {
    less: `La probabilité qu'une personne tirée au hasard mesure moins de ${a} cm, sachant ${preset.name}, est de ${probPercent}%. 
    Autrement dit, ${probPercent}% des ${preset.name_2} mesurent moins de ${a} cm.`,
    greater: `La probabilité qu'une personne tirée au hasard mesure plus de ${a} cm, sachant ${preset.name}, est de ${probPercent}%. 
    Autrement dit, ${probPercent}% des ${preset.name_2} mesurent plus de ${a} cm.`,
    between: `La probabilité qu'une personne tirée au hasard mesure entre ${a} cm et ${b} cm, sachant ${preset.name}, est de ${probPercent}%.
    Autrement dit, ${probPercent}% des ${preset.name_2} mesurent entre ${a} cm et ${b} cm.`
  };

  description.innerHTML = `
    <p style="text-align: center;">${renderedMath}</p>
    <p>${naturalTexts[probType]}</p>
  `;
}

init();