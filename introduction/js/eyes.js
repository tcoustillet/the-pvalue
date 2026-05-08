// --- Data ---

const EYE_COLORS = {
  brun: 'bruns',
  vert: 'verts',
  bleu: 'bleus',
};

const GROUPS = [
  { name: 'child', label: "Couleur des yeux de l'enfant", parent: false },
  { name: 'parent1', label: 'Parent 1', parent: true },
  { name: 'parent2', label: 'Parent 2', parent: true },
];

function buildHypothesis(key) {
  const [p1, p2] = key.split('-');
  if (p1 === p2) {
    return {
      h0: `$H_0$ : Les deux parents ont les yeux ${EYE_COLORS[p1]}.`,
      h1: `$H_1$ : L'un des deux parents au moins n'a pas les yeux ${EYE_COLORS[p1]}.`,
    };
  }
  const other = Object.keys(EYE_COLORS).find((c) => c !== p1 && c !== p2);
  return {
    h0: `$H_0$ : Le couple est composé d'un parent aux yeux ${EYE_COLORS[p1]} et d'un parent aux yeux ${EYE_COLORS[p2]}.`,
    h1: `$H_1$ : Les deux parents ont les yeux de la même couleur, ou bien au moins l'un des deux a les yeux ${EYE_COLORS[other]}.`,
  };
}

function buildConclusion(child, h0, h1, pct) {
  const label = EYE_COLORS[child];
  const h0_f = `l${h0.slice(9, -1)}`;
  const h1_f = `l${h1.slice(9, -1)}`;
  const decision =
    pct >= 5
      ? `Ainsi, comme p ≥ 5%, alors le résultat n'est pas extraordianire dans le monde où $H_0$ est vraie. Il n'y a pas de raisons de rejetter $H_0$ et basculer vers $H_1$. On pourra conclure : ${h0_f}.`
      : `Ainsi, comme p < 5%, alors le résultat est extraordianire dans le monde où $H_0$ est vraie. Nous avons suffisamment de preuves pour basculer vers $H_1$. On rejette $H_0$ (${h0_f}) et on concluera : ${h1_f}.`;
  return `La probabilité que l'enfant ait les yeux ${label}, sachant que ${h0_f} est de $${pct}\\%$ (Figure 1). Cette probabilité est exactement ce qu'on a appelé p-value dans le cadre de cet exercice. ${decision}`;
}

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
    { ...probs, ...buildHypothesis(key) },
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

  Object.keys(EYE_COLORS).forEach((color) => {
    const labelEl = document.createElement('label');
    labelEl.classList.add('eyes__option');

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.value = color;
    input.addEventListener('change', onSelectionChange);

    const img = document.createElement('img');
    img.src = `../fr/figures/oeil_${color}.png`;
    img.alt = `${capitalize(color)} eye`;
    img.classList.add('eyes__option-img');

    labelEl.append(` ${capitalize(color)}`);
    labelEl.appendChild(img);
    labelEl.appendChild(input);
    optionsWrapper.appendChild(labelEl);
  });

  return fieldset;
}

const PARENTS_LABEL_LATEX = 'Hypothèse nulle $H_0$';
const PARENTS_SUBTITLE = 'Couleur des yeux des parents';

function buildUI() {
  const container = document.getElementById('eyes-groups');
  const parentsBox = document.getElementById('eyes-parents');

  // Convert parentsBox to fieldset behavior via legend
  const parentsLegend = document.createElement('legend');
  parentsLegend.classList.add('eyes__legend');
  parentsLegend.innerHTML = PARENTS_LABEL_LATEX;
  parentsBox.insertBefore(parentsLegend, parentsBox.firstChild);

  const parentsSubtitle = document.createElement('span');
  parentsSubtitle.classList.add('eyes__parents-subtitle');
  parentsSubtitle.textContent = PARENTS_SUBTITLE;
  parentsBox.appendChild(parentsSubtitle);

  // Fieldsets
  const parentsFieldsets = document.createElement('div');
  parentsFieldsets.classList.add('eyes__parents-fieldsets');

  GROUPS.forEach(({ name, label, parent }) => {
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
  return GROUPS.reduce((acc, { name }) => {
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
  probability.innerHTML = buildConclusion(child, probs.h0, probs.h1, pct);

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
