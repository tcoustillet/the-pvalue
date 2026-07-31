// Player heights - France vs Sweden, Round of 16, 2026 World Cup (June 30, New York)

const franceHeights = [
  { name: 'M. Maignan', height: 191, pos: 'GB' },
  { name: 'J. Koundé', height: 180, pos: 'DD' },
  { name: 'D. Upamecano', height: 185, pos: 'DC' },
  { name: 'W. Saliba', height: 192, pos: 'DC' },
  { name: 'L. Digne', height: 178, pos: 'DG' },
  { name: 'A. Tchouaméni', height: 185, pos: 'MC' },
  { name: 'A. Rabiot', height: 188, pos: 'MC' },
  { name: 'O. Dembélé', height: 178, pos: 'AD' },
  { name: 'M. Olise', height: 178, pos: 'AT' },
  { name: 'B. Barcola', height: 182, pos: 'AG' },
  { name: 'K. Mbappé', height: 178, pos: 'BU' },
];

const swedenHeights = [
  { name: 'J. Widell Zetterström', height: 197, pos: 'GB' },
  { name: 'D. Svensson', height: 183, pos: 'DD' },
  { name: 'G. Lagerbielke', height: 193, pos: 'DC' },
  { name: 'V. Lindelöf', height: 187, pos: 'DC' },
  { name: 'G. Gudmundsson', height: 181, pos: 'DG' },
  { name: 'A. Elanga', height: 178, pos: 'AD' },
  { name: 'L. Bergvall', height: 187, pos: 'MC' },
  { name: 'Y. Ayari', height: 172, pos: 'MC' },
  { name: 'E. Stroud', height: 185, pos: 'AG' },
  { name: 'V. Gyökeres', height: 189, pos: 'BU' },
  { name: 'A. Isak', height: 190, pos: 'AT' },
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
  const flag = teamLabel === 'France' ? 'fr' : 'se';
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
      <td>Moyenne ($\\sub${flag}{\\bar{x}}$)</td>
      <td>${avg.toFixed(1).replace('.', ',')}</td>
    </tr>
    <tr class="summary-row">
      <td>Écart-type ($\\sub${flag}{s}$)</td>
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

/* Position order in the rendered table */
const posOrder = ['GB', 'DD', 'DC', 'DG', 'MC', 'AD', 'AG', 'AT', 'BU'];

function sortByPosition(players) {
  return [...players].sort((a, b) => {
    return posOrder.indexOf(a.pos) - posOrder.indexOf(b.pos);
  });
}

/**
 * Builds the HTML for a table of players (position column first),
 * with a final summary row showing mean and standard deviation of heights.
 * @param {Array<{name: string, height: number, pos: string}>} players
 * @param {string} teamLabel - e.g. "France"
 * @returns {string} HTML markup for the table
 */
function buildPlayerTableWithPosHTML(players, teamLabel) {
  const sortedPlayers = sortByPosition(players);
  const heights = players.map((p) => p.height);
  const avg = mean(heights);
  const stdDev = standardDeviation(heights);

  const rows = sortedPlayers
    .map((p) => `    <tr><td>${p.pos}</td><td>${p.name}</td><td>${p.height}</td></tr>`)
    .join('\n');
  const flag = teamLabel === 'France' ? 'fr' : 'se';
  const title =
    teamLabel === 'France'
      ? "Tableau 2a : Taille et poste des 11 titulaires de l'équipe de France lors du match du 30 juin 2026."
      : "Tableau 2b : Taille et poste des 11 titulaires de l'équipe de Suède lors du match du 30 juin 2026.";

  return `<table>
  <caption>${title}</caption>
  <thead>
    <tr><th>Poste</th><th>${teamLabel}</th><th>Taille (cm)</th></tr>
  </thead>
  <tbody>
${rows}
    <tr class="summary-row">
      <td colspan="2">Moyenne ($\\sub${flag}{\\bar{x}}$)</td>
      <td>${avg.toFixed(1).replace('.', ',')}</td>
    </tr>
    <tr class="summary-row">
      <td colspan="2">Écart-type ($\\sub${flag}{s}$)</td>
      <td>${stdDev.toFixed(1).replace('.', ',')}</td>
    </tr>
  </tbody>
</table>`;
}

/* Arrows to visually link the two tables (paired data) */
const ARROW_SHAFT_WIDTH = 180;

/**
 * Draws 11 double arrows between the matching rows of the two tables
 * (one arrow per player, aligned to that player's actual rendered row).
 * @param {HTMLElement} container
 */
function addPositionArrows(container) {
  container.querySelectorAll('.player-arrow').forEach((el) => el.remove());

  const [table1, table2] = container.querySelectorAll('table');
  if (!table1 || !table2) return;

  const rows1 = table1.querySelectorAll('tbody tr:not(.summary-row)');
  const rows2 = table2.querySelectorAll('tbody tr:not(.summary-row)');

  const containerRect = container.getBoundingClientRect();
  const rect1 = table1.getBoundingClientRect();
  const rect2 = table2.getBoundingClientRect();

  // if the tables wrap onto separate lines (narrow screen), skip drawing arrows
  if (rect2.left <= rect1.right) return;

  const arrowLeft = (rect1.right + rect2.left) / 2 - containerRect.left;

  rows1.forEach((row1, i) => {
    const row2 = rows2[i];
    if (!row2) return;

    const r1 = row1.getBoundingClientRect();
    const r2 = row2.getBoundingClientRect();
    const top = ((r1.top + r1.bottom) / 2 + (r2.top + r2.bottom) / 2) / 2 - containerRect.top;

    const arrow = document.createElement('span');
    arrow.className = 'player-arrow';
    arrow.style.left = `${arrowLeft}px`;
    arrow.style.top = `${top}px`;
    arrow.style.transform = 'translate(-50%, -50%)';
    arrow.innerHTML = `
      <span class="head head-left"></span>
      <span class="shaft" style="width: ${ARROW_SHAFT_WIDTH}px;"></span>
      <span class="head head-right"></span>
    `;
    container.appendChild(arrow);
  });
}

/**
 * Renders both team tables (with position column first) into a container element.
 * @param {string} elementId - id of the DOM element to render into
 */
function renderPlayerTablesWithPos(elementId) {
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Element #${elementId} not found`);
    return;
  }
  container.innerHTML =
    buildPlayerTableWithPosHTML(franceHeights, 'France') +
    '\n' +
    buildPlayerTableWithPosHTML(swedenHeights, 'Suède');

  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
    });
  }
  requestAnimationFrame(() => addPositionArrows(container));
}

/**
 * Builds the HTML for a table showing, for each position, the height
 * difference (France - Sweden), plus mean and standard deviation of
 * the differences (used for the paired-samples t-test).
 * @returns {string} HTML markup for the table
 */
function buildDifferenceTableHTML() {
  const franceSorted = sortByPosition(franceHeights);
  const swedenSorted = sortByPosition(swedenHeights);

  const differences = franceSorted.map((p, i) => p.height - swedenSorted[i].height);
  const avgDiff = mean(differences);
  const stdDevDiff = standardDeviation(differences);

  const rows = franceSorted
    .map((p, i) => {
      const diff = differences[i];
      const sign = diff > 0 ? '+' : '';
      return `    <tr><td>${p.pos}</td><td>${sign}${diff}</td></tr>`;
    })
    .join('\n');

  const title =
    'Tableau 3 : Différence de taille (France − Suède) par poste, titulaires du match du 30 juin 2026.';

  return `<table "class=difference-table">
  <caption>${title}</caption>
  <thead>
    <tr><th>Poste</th><th>Différence (cm)</th></tr>
  </thead>
  <tbody>
${rows}
    <tr class="summary-row">
      <td>Moyenne ($\\bar{d}$)</td>
      <td>${(Math.trunc(avgDiff * 10) / 10).toFixed(1).replace('.', ',')}</td>
    </tr>
    <tr class="summary-row">
      <td>Écart-type ($s_d$)</td>
      <td>${stdDevDiff.toFixed(1).replace('.', ',')}</td>
    </tr>
  </tbody>
</table>`;
}

/**
 * Renders the difference table into a container element.
 * @param {string} elementId - id of the DOM element to render into
 */
function renderDifferenceTable(elementId) {
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Element #${elementId} not found`);
    return;
  }
  container.innerHTML = buildDifferenceTableHTML();

  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
    });
  }
}
