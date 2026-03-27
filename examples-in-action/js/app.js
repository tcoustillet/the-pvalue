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

  const formula = mode === 'eq'
    ? `\\mathbb{P}(F = ${k} \\mid \\text{pièce équilibrée}) = ${probPercent}\\%`
    : `\\mathbb{P}(F \\geq ${k} \\mid \\text{pièce équilibrée}) = ${probPercent}\\%`;

  const renderedMath = katex.renderToString(formula, { throwOnError: false });

  const faces = k > 1
    ? "faces"
    : "face"

  const sentence = mode === 'eq'
    ? `Lorsqu'on lance ${n} fois une pièce équilibrée, la probabilité d'obtenir exactement ${k} ${faces} est de ${probPercent}%.`
    : `Lorsqu'on lance ${n} fois une pièce équilibrée, la probabilité d'obtenir ${k} ${faces} ou plus est de ${probPercent}%. 
     Dans cette expérience et ces conditions particulières, vous obtenez p-value = ${probDecimal}.`;

  const pvalue = prob >= 0.05
    ? "Étant donné que " + katex.renderToString(`p \\geq 0.05`, { throwOnError: false }) + " : le résultat obtenu n'est pas extraordinaire dans le monde de " + katex.renderToString(`H_0`, { throwOnError: false }) + ". Nous n'avons pas amassé suffisament de preuves pour basculer vers " + katex.renderToString(`H_1`, { throwOnError: false }) + " et conclure que la pièce est truquée : nous devons rester dans " + katex.renderToString(`H_0`, { throwOnError: false }) + ". Soit notre pièce n'est pas truquée en faveur du côté face, soit elle l'est mais nous n'en avons pas la preuve."
    : "Étant donné que " + katex.renderToString(`p \\lt 0.05`, { throwOnError: false }) + " : le résultat obtenu est extraordinaire dans le monde de " + katex.renderToString(`H_0`, { throwOnError: false }) + ". Si la pièce était vraiment équilibrée, observer ce résultat aurait été trop peu probable. Avec un niveau de preuve suffisant, on bascule vers " + katex.renderToString(`H_1`, { throwOnError: false }) + " : on peut raisonnablement croire que notre est pièce est truquée en faveur du côté face.";

  description.innerHTML = `
    <p style="text-align: center;">${renderedMath}</p>
    <p>${sentence}</p>
    ${mode === 'gte' ? `<p>${pvalue}</p>` : ''}
  `;
}