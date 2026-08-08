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

/**
 * Tukey HSD test data, filled in manually.
 */
const hsdResults = [
  {
    comparaison: 'France \u{1F1EB}\u{1F1F7} – Suède \u{1F1F8}\u{1F1EA}',
    difference: 2.4,
    qObs: 1.27,
    pValAdj: 0.806,
  },
  {
    comparaison: 'France \u{1F1EB}\u{1F1F7} – Norvège \u{1F1F3}\u{1F1F4}',
    difference: 4.9,
    qObs: 2.59,
    pValAdj: 0.274,
  },
  {
    comparaison: 'France \u{1F1EB}\u{1F1F7} – Cap-Vert \u{1F1E8}\u{1F1FB}',
    difference: 2.7,
    qObs: 1.43,
    pValAdj: 0.744,
  },
  {
    comparaison: 'Suède \u{1F1F8}\u{1F1EA} – Norvège \u{1F1F3}\u{1F1F4}',
    difference: 2.5,
    qObs: 1.32,
    pValAdj: 0.787,
  },
  {
    comparaison: 'Suède \u{1F1F8}\u{1F1EA} – Cap-Vert \u{1F1E8}\u{1F1FB}',
    difference: 5.1,
    qObs: 2.69,
    pValAdj: 0.243,
  },
  {
    comparaison: 'Norvège \u{1F1F3}\u{1F1F4} – Cap-Vert \u{1F1E8}\u{1F1FB}',
    difference: 7.6,
    qObs: 4.02,
    pValAdj: 0.034,
  },
];

/**
 * Significance threshold for the adjusted p-value.
 */
const SIGNIFICANCE_THRESHOLD = 0.05;

/**
 * Builds the HTML table summarizing the Tukey HSD procedure.
 *
 * @param {Array<{comparaison: string, difference: number, qObs: number, pValAdj: number, significatif: boolean}>} results
 * @param {string} [caption] - Table caption
 * @returns {string} Table HTML
 */
function buildHSDTableHTML(results, caption) {
  const bodyRows = results
    .map((r) => {
      const diffFmt = r.difference.toFixed(1).replace('.', ',');
      const qFmt = r.qObs.toFixed(2).replace('.', ',');
      const pFmt = r.pValAdj.toFixed(3).replace('.', ',');

      const isSignificant = r.pValAdj < SIGNIFICANCE_THRESHOLD;
      const sigLabel = isSignificant ? 'Oui 😏' : 'Non';
      const sigClass = isSignificant ? 'sig-yes' : 'sig-no';
      const rowClass = isSignificant ? ' class="sig-row"' : '';

      return `    <tr${rowClass}>
      <td>${r.comparaison}</td>
      <td>${diffFmt}</td>
      <td>${qFmt}</td>
      <td>${pFmt}</td>
      <td class="${sigClass}">${sigLabel}</td>
    </tr>`;
    })
    .join('\n');

  return `<table>
  <caption>${caption}</caption>
  <thead>
    <tr>
      <th>Comparaison</th>
      <th>Différence brute (cm)</th>
      <th>$q_{\\text{observé}}$</th>
      <th>p ajustée</th>
      <th>Significatif ?</th>
    </tr>
  </thead>
  <tbody>
${bodyRows}
  </tbody>
</table>`;
}

/**
 * Renders the HSD summary table into a DOM element.
 * Uses the global hsdResults array, filled in manually.
 * @param {string} elementId - id of the container element
 */
function renderHSDTable(elementId) {
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Element #${elementId} not found`);
    return;
  }

  container.innerHTML = buildHSDTableHTML(
    hsdResults,
    'Tableau 5 : Récapitulatif de la procédure HSD de Tukey'
  );

  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
    });
  }
}
