/**
 * Builds an HTML table with one column per nation, one row per starting player (1 to 11),
 * followed by two summary rows: mean and variance.
 *
 * @param {Array<{label: string, flag: string, players: Array<{name: string, height: number, pos?: string}>}>} teams
 *        List of teams, e.g.: [{ label: 'France', flag: 'fr', players: franceHeights }, ...]
 * @param {string} [caption] - Table caption
 * @returns {string} Table HTML
 */
function buildNationsTableHTML(teams, caption) {
  const rowCount = Math.max(...teams.map((t) => t.players.length));

  // Header: 1 column per nation (no row-label column)
  const headerCols = teams.map((t) => `<th>${t.label}</th>`).join('');

  // Rows for the 11 starting players
  let bodyRows = '';
  for (let i = 0; i < rowCount; i++) {
    const cells = teams
      .map((t) => {
        const p = t.players[i];
        return `<td>${p ? p.height : '—'}</td>`;
      })
      .join('');
    bodyRows += `    <tr><td></td>${cells}</tr>\n`;
  }

  // Mean and variance per nation
  const stats = teams.map((t) => {
    const heights = t.players.map((p) => p.height);
    return {
      flag: t.flag,
      avg: mean(heights),
      var: variance(heights),
    };
  });

  const meanRow = stats
    .map((s) => `<td>$\\sub${s.flag}{\\bar{x}}$ = ${s.avg.toFixed(1).replace('.', ',')}</td>`)
    .join('');
  const varRow = stats
    .map((s) => `<td>$\\sub${s.flag}{s}^2$ = ${s.var.toFixed(1).replace('.', ',')}</td>`)
    .join('');

  return `<table>
  <caption>${caption}</caption>
  <thead>
    <tr><th></th>${headerCols}</tr>
  </thead>
  <tbody>
    ${bodyRows}    
    <tr class="summary-row">
      <td>Moyenne</td>${meanRow}
    </tr>
    <tr class="summary-row">
      <td>Variance</td>${varRow}
    </tr>
  </tbody>
</table>`;
}

/**
 * Renders the multi-nation table into a DOM element.
 * Uses the global height arrays (franceHeights, swedenHeights, norwayHeights,
 * spainHeights), just like renderPlayerTables does — so it only needs an elementId.
 * @param {string} elementId - id of the container element
 */
function renderNationsTable(elementId) {
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Element #${elementId} not found`);
    return;
  }

  const teams = [
    { label: 'France', flag: 'fr', players: franceHeights },
    { label: 'Suède', flag: 'se', players: swedenHeights },
    { label: 'Norvège', flag: 'no', players: norwayHeights },
    { label: 'Cap-Vert', flag: 'cv', players: CapeVerdeHeights },
  ];

  container.innerHTML = buildNationsTableHTML(
    teams,
    'Tableau 4 : Taille des 11 principaux titulaires par équipe (phase finale mondial 2026)'
  );

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
