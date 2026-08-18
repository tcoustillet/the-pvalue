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
  const title = teamLabel === 'France' ? LANG.student.title_1a : LANG.student.title_1b;

  return `<table>
  <caption>${title}</caption>
  <thead>
    <tr><th>${teamLabel}</th><th>${LANG.student.height}</th></tr>
  </thead>
  <tbody>
${rows}
    <tr class="summary-row">
      <td>${LANG.mean} ($\\sub${flag}{\\bar{x}}$)</td>
      <td>${LANG.formatNumber(avg)}</td>
    </tr>
    <tr class="summary-row">
      <td>${LANG.std} ($\\sub${flag}{s}$)</td>
      <td>${LANG.formatNumber(stdDev)}</td>
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
    buildPlayerTableHTML(swedenHeights, LANG.sweden);

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
  const title = teamLabel === 'France' ? LANG.student.title_2a : LANG.student.title_2b;

  return `<table>
  <caption>${title}</caption>
  <thead>
    <tr><th>${LANG.student.pos}</th><th>${teamLabel}</th><th>${LANG.student.height}</th></tr>
  </thead>
  <tbody>
${rows}
    <tr class="summary-row">
      <td colspan="2">${LANG.mean} ($\\sub${flag}{\\bar{x}}$)</td>
      <td>${LANG.formatNumber(avg)}</td>
    </tr>
    <tr class="summary-row">
      <td colspan="2">${LANG.std} ($\\sub${flag}{s}$)</td>
      <td>${LANG.formatNumber(stdDev)}</td>
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
    buildPlayerTableWithPosHTML(swedenHeights, LANG.sweden);

  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
    });
  }

  if (!container._arrowObserver) {
    container._arrowObserver = new ResizeObserver(() => {
      addPositionArrows(container);
    });
    container._arrowObserver.observe(container);
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

  const title = LANG.student.title_3;

  return `<table "class=difference-table">
  <caption>${title}</caption>
  <thead>
    <tr><th>${LANG.student.pos}</th><th>${LANG.student.diff}</th></tr>
  </thead>
  <tbody>
${rows}
    <tr class="summary-row">
      <td>${LANG.mean} ($\\bar{d}$)</td>
      <td>${LANG.formatNumber(Math.trunc(avgDiff * 10) / 10)}</td>
    </tr>
    <tr class="summary-row">
      <td>${LANG.std} ($s_d$)</td>
      <td>${LANG.formatNumber(stdDevDiff)}</td>
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
