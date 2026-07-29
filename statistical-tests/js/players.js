// Player heights - France vs Sweden, Round of 16, 2026 World Cup (June 30, New York)

const franceHeights = [
  { name: 'M. Maignan', height: 191 },
  { name: 'J. Koundé', height: 180 },
  { name: 'D. Upamecano', height: 185 },
  { name: 'W. Saliba', height: 192 },
  { name: 'L. Digne', height: 178 },
  { name: 'A. Tchouaméni', height: 185 },
  { name: 'A. Rabiot', height: 188 },
  { name: 'O. Dembélé', height: 178 },
  { name: 'M. Olise', height: 178 },
  { name: 'B. Barcola', height: 182 },
  { name: 'K. Mbappé', height: 178 },
];

const swedenHeights = [
  { name: 'J. Widell Zetterström', height: 197 },
  { name: 'D. Svensson', height: 183 },
  { name: 'G. Lagerbielke', height: 193 },
  { name: 'V. Lindelöf', height: 187 },
  { name: 'G. Gudmundsson', height: 181 },
  { name: 'A. Elanga', height: 178 },
  { name: 'L. Bergvall', height: 187 },
  { name: 'Y. Ayari', height: 172 },
  { name: 'E. Stroud', height: 185 },
  { name: 'V. Gyökeres', height: 189 },
  { name: 'A. Isak', height: 190 },
];

/**
 * Computes the arithmetic mean of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 */
function mean(values) {
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

/**
 * Computes the (sample) standard deviation of an array of numbers.
 * Uses n-1 in the denominator (Bessel's correction), the usual choice
 * when the data is treated as a sample rather than a full population.
 * @param {number[]} values
 * @returns {number}
 */
function standardDeviation(values) {
  const avg = mean(values);
  const squaredDiffs = values.map((v) => (v - avg) ** 2);
  const variance = squaredDiffs.reduce((acc, d) => acc + d, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/**
 * Builds the HTML for a table of players, with a final summary row
 * showing the mean and standard deviation of their heights.
 * @param {Array<{name: string, height: number}>} players
 * @param {string} teamLabel - e.g. "France"
 * @returns {string} HTML markup for the table
 */
function buildPlayerTableHTML(players, teamLabel) {
  const heights = players.map((p) => p.height);
  const avg = mean(heights);
  const stdDev = standardDeviation(heights);

  const rows = players.map((p) => `    <tr><td>${p.name}</td><td>${p.height}</td></tr>`).join('\n');
  const flag = teamLabel === 'France' ? '&#x1F1EB;&#x1F1F7;' : '&#x1F1F8;&#x1F1EA;';
  const title =
    teamLabel === 'France'
      ? "Tableau 1a : Taille moyenne des 11 titulaires de l'équipe de France lors du match du 30 juin 2026."
      : "Tableau 1b : Taille moyenne des 11 titulaires de l'équipe de Suède lors du match du 30 juin 2026.";

  return `<table>
  <caption>${title}</caption>
  <thead>
    <tr><th>${teamLabel}</th><th>Taille (cm)</th></tr>
  </thead>
  <tbody>
${rows}
    <tr class="summary-row">
      <td>Moyenne ($\\bar{x}_{{}_\\text{\\scriptsize ${flag}}}$)</td>
      <td>${avg.toFixed(1).replace('.', ',')}</td>
    </tr>
    <tr class="summary-row">
      <td>Écart-type ($s_{{}_\\text{\\scriptsize ${flag}}}$)</td>
      <td>${stdDev.toFixed(1).replace('.', ',')}</td>
    </tr>
  </tbody>
</table>`;
}

/**
 * Renders both team tables (France, Sweden) into a container element.
 * @param {string} elementId - id of the DOM element to render into
 */
function renderPlayerTables(elementId) {
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Element #${elementId} not found`);
    return;
  }
  container.innerHTML =
    buildPlayerTableHTML(franceHeights, 'France') +
    '\n' +
    buildPlayerTableHTML(swedenHeights, 'Suède');

  // Re-render KaTeX since this content was injected after the initial page load
  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
    });
  }
}
