/**
 * Entry point for the interactive Gaussian figure.
 * Wires together the chart and the controls.
 */
function init() {
  GaussianChart.init('#chart-container');

  const { mu, sigma, threshold } = Controls.init('#controls-container', (mu, sigma, threshold) => {
    GaussianChart.update(mu, sigma, threshold);
    updateDescription(mu, sigma, threshold);
  });

  GaussianChart.update(mu, sigma, threshold);
  updateDescription(mu, sigma, threshold);
}

/**
 * Updates the dynamic description paragraph below the chart.
 * @param {number} mu - The mean of the distribution.
 * @param {number} sigma - The standard deviation of the distribution.
 * @param {number|null} threshold - The user threshold value.
 */
function updateDescription(mu, sigma, threshold) {
  const description = document.querySelector('#chart-description');
  if (!description) return;

  if (threshold === null) {
    description.innerHTML = '';
    return;
  }

  const prob = Gaussian.probabilityGreaterThan(threshold, mu, sigma);
  const pct = Gaussian.formatProb(prob);
  const raw = Gaussian.formatProbRaw(prob);

  const conclusion =
    raw >= 0.05
      ? LANG.treeConclusion.conclusionOrdinary(threshold)
      : LANG.treeConclusion.conclusionExtraordinary(threshold);

  description.innerHTML = `
    <span class="chart-description__formula">${LANG.treeConclusion.formula(threshold, pct)}</span>
    <span class="chart-description__text">${LANG.treeConclusion.descriptionText(threshold, pct, raw, conclusion)}</span>
  `;

  renderMathInElement(description, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});
