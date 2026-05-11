document.addEventListener('DOMContentLoaded', () => {
  BinomialChart.init('#chart-container');

  const initialState = Controls.init('#controls-container', (state) => {
    const prob = BinomialChart.update(state);
    updateDescription(state, prob);
  });

  const prob = BinomialChart.update(initialState);
  updateDescription(initialState, prob);
});

function updateDescription(state, prob) {
  const description = document.querySelector('#chart-description');
  if (!description) return;

  if (prob === null) {
    description.textContent = '';
    return;
  }

  const { n, p, k, mode } = state;
  const getPercent = (prob) => {
    const val = prob * 100;
    if (val === 0) return '0';
    if (val >= 0.1) return val.toFixed(1);
    const decimals = Math.ceil(-Math.log10(val)) + 1;
    return val.toFixed(decimals);
  };

  const getFormatted = (val) => {
    if (val === 0) return '0';
    if (val >= 0.001) return val.toFixed(3);
    const decimals = Math.ceil(-Math.log10(val)) + 1;
    return val.toFixed(decimals);
  };

  const probPercent = getPercent(prob);
  const probDecimal = getFormatted(prob);

  const formula =
    mode === 'eq'
      ? `\\mathbb{P}(${LANG.randomVar} = ${k} \\mid \\text{${LANG.fairCoin}}) = ${probPercent}\\%`
      : `\\mathbb{P}(${LANG.randomVar} \\geq ${k} \\mid \\text{${LANG.fairCoin}}) = ${probPercent}\\%`;

  const renderedMath = katex.renderToString(formula, { throwOnError: false });

  const faces = LANG.faces(k);

  const H0 = katex.renderToString(`H_0`, { throwOnError: false });
  const H1 = katex.renderToString(`H_1`, { throwOnError: false });
  const pGte = katex.renderToString(`p \\geq 0.05`, { throwOnError: false });
  const pLt = katex.renderToString(`p \\lt 0.05`, { throwOnError: false });

  const sentence =
    mode === 'eq'
      ? LANG.sentenceEq(n, k, faces, probPercent)
      : LANG.sentenceGte(n, k, faces, probPercent, probDecimal);

  const pvalue = prob >= 0.05 ? LANG.pvalueHigh(H0, H1, pGte) : LANG.pvalueLow(H0, H1, pLt);

  description.innerHTML = `
    <p style="text-align: center;">${renderedMath}</p>
    <p>${sentence}</p>
    ${mode === 'gte' ? `<p>${pvalue}</p>` : ''}
  `;
}
