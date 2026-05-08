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
      ? `Comme p ≥ 0.0500, ce résultat est alors ordinaire dans le monde où $H_0$ est vraie : le fait qu'un chêne mesure ${threshold} m n'est pas un fait extraordinaire, observer ce résultat ou un résultat plus extrême n'est pas improbable. Il n'y a pas assez de preuves pour basculer vers $H_1$ : Grace ne peut pas rejetter $H_0$ et conclure que l'arbre est un hêtre, elle doit se résigner à conclure que l'arbre est un chêne.`
      : `Comme p < 0.0500, ce résultat est alors extraordinaire dans le monde où $H_0$ est vraie : si l'arbre était vraiment un chêne, observer ce résultat (mesurer ${threshold} m) ou un résultat aussi extrême aurait été trop peu probable. On considère qu'on a atteint un niveau de preuves suffisant pour rejetter $H_0$ et basculer vers $H_1$: Grace pourra conclure que l'arbre est un hêtre.`;

  description.innerHTML = `
    <span class="chart-description__formula">$\\text{p-value} \\coloneqq P(H \\geq ${threshold} \\mid \\text{l'arbre est un chêne}) = {\\color{green}\\boldsymbol{${pct}\\%}}$</span>
    <span class="chart-description__text">La probabilité qu'un arbre mesure plus de ${threshold} m, sachant (en croyant) que c'est un chêne, est de ${pct}%. Cette probabilité est précisément la définition de la p-value : ici donc p = ${raw}. ${conclusion}</span>
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
