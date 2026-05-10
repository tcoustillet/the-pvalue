// Simplified dominant/recessive probability table
// Key: "parent1EyeColor-parent2EyeColor"
// Value: { brun, vert, bleu } probabilities (must sum to 1)
const PROBABILITY_DATA = {
  'brun-brun': { brun: 0.75, vert: 0.19, bleu: 0.06 },
  'brun-vert': { brun: 0.5, vert: 0.37, bleu: 0.13 },
  'brun-bleu': { brun: 0.5, vert: 0.01, bleu: 0.49 },
  'vert-brun': { brun: 0.5, vert: 0.37, bleu: 0.13 },
  'vert-vert': { brun: 0.01, vert: 0.75, bleu: 0.24 },
  'vert-bleu': { brun: 0.01, vert: 0.5, bleu: 0.49 },
  'bleu-brun': { brun: 0.5, vert: 0.01, bleu: 0.49 },
  'bleu-vert': { brun: 0.01, vert: 0.5, bleu: 0.49 },
  'bleu-bleu': { brun: 0.005, vert: 0.005, bleu: 0.99 },
};

const PROBABILITY_TABLE = Object.fromEntries(
  Object.entries(PROBABILITY_DATA).map(([key, probs]) => [
    key,
    { ...probs, ...LANG.buildHypothesis(key) },
  ])
);

// --- DOM Builder ---

function buildRadioGroup({ name, label }) {
  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('eyes__group');

  const legend = document.createElement('legend');
  legend.classList.add('eyes__legend');
  legend.textContent = label;
  fieldset.appendChild(legend);

  const optionsWrapper = document.createElement('div');
  optionsWrapper.classList.add('eyes__options');
  fieldset.appendChild(optionsWrapper);

  Object.keys(LANG.eyeColors).forEach((color) => {
    const labelEl = document.createElement('label');
    labelEl.classList.add('eyes__option');

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.value = color;
    input.addEventListener('change', onSelectionChange);

    const img = document.createElement('img');
    img.src = `${LANG.figuresPath}/oeil_${color}.png`;
    img.alt = `${LANG.eyeColorLabels[color]} eye`;
    img.classList.add('eyes__option-img');

    labelEl.append(` ${LANG.eyeColorLabels[color]}`);
    labelEl.appendChild(img);
    labelEl.appendChild(input);
    optionsWrapper.appendChild(labelEl);
  });

  return fieldset;
}

function buildUI() {
  const container = document.getElementById('eyes-groups');
  const parentsBox = document.getElementById('eyes-parents');

  // Convert parentsBox to fieldset behavior via legend
  const parentsLegend = document.createElement('legend');
  parentsLegend.classList.add('eyes__legend');
  parentsLegend.innerHTML = LANG.parentsLabelLatex;
  parentsBox.insertBefore(parentsLegend, parentsBox.firstChild);

  const parentsSubtitle = document.createElement('span');
  parentsSubtitle.classList.add('eyes__parents-subtitle');
  parentsSubtitle.textContent = LANG.parentsSubtitle;
  parentsBox.appendChild(parentsSubtitle);

  // Fieldsets
  const parentsFieldsets = document.createElement('div');
  parentsFieldsets.classList.add('eyes__parents-fieldsets');

  LANG.groups.forEach(({ name, label, parent }) => {
    const fieldset = buildRadioGroup({ name, label });
    if (parent) {
      parentsFieldsets.appendChild(fieldset);
    } else {
      container.insertBefore(fieldset, parentsBox);
    }
  });

  parentsBox.appendChild(parentsFieldsets);

  // KaTeX
  renderLatex(parentsLegend);

  document.getElementById('eyes-result').style.display = 'none';
}

// --- State Reader ---

function getSelection() {
  return LANG.groups.reduce((acc, { name }) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    acc[name] = checked ? checked.value : null;
    return acc;
  }, {});
}

// --- Result Updater ---

function updateResult({ child, parent1, parent2 }) {
  const h0 = document.getElementById('h0');
  const h1 = document.getElementById('h1');
  const probability = document.getElementById('result-probability');
  const resultContainer = document.getElementById('eyes-result');

  const els = [h0, h1, probability];

  if (!parent1 || !parent2 || !child) {
    els.forEach((el) => {
      el.innerHTML = '';
      el.style.display = 'none';
    });
    resultContainer.style.display = 'none';
    return;
  }

  const key = `${parent1}-${parent2}`;
  const probs = PROBABILITY_TABLE[key];
  const pct = parseFloat((probs[child] * 100).toFixed(1));

  h0.innerHTML = probs.h0;
  h1.innerHTML = probs.h1;
  probability.innerHTML = LANG.buildConclusion(child, probs.h0, probs.h1, pct);

  resultContainer.style.display = 'flex';
  els.forEach((el) => (el.style.display = 'block'));

  renderLatex(h0);
  renderLatex(h1);
  renderLatex(probability);
}

// --- Event Handler ---

function onSelectionChange() {
  const selection = getSelection();
  updateResult(selection);
}

// --- Utilities ---

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderLatex(el) {
  renderMathInElement(el, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
  });
}

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
  buildUI();
});
