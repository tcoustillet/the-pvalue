const LANG = {
  eyeColors: { brun: 'bruns', vert: 'verts', bleu: 'bleus' },
  eyeColorLabels: { brun: 'Brun', vert: 'Vert', bleu: 'Bleu' },
  groups: [
    { name: 'child', label: "Couleur des yeux de l'enfant", parent: false },
    { name: 'parent1', label: 'Parent 1', parent: true },
    { name: 'parent2', label: 'Parent 2', parent: true },
  ],
  parentsLabelLatex: 'Hypothèse nulle $H_0$',
  parentsSubtitle: 'Couleur des yeux des parents',
  figuresPath: '../fr/figures',
  // Tree part
  controlTreeSentence: `$\\text{Hauteur } H \\text{ de l'arbre (m)}:$`,
  chart: {
    xLabel: "Taille de l'arbre (m)",
    yLabel: 'Densité',
    checkboxLabel: `Afficher la zone de rejet de H\u2080`,
    criticalZoneLabel: `Zone de rejet de H\u2080`,
    extraordinaryLabel: 'Résultat extraordinaire',
    criticalHeight: {
      before: 'Hauteur ',
      variable: 'H',
      after: (x0) => ` critique : ${x0.toFixed(2)} m`,
    },
  },
};

LANG.buildHypothesis = function (key) {
  const [p1, p2] = key.split('-');
  const c = LANG.eyeColors;
  if (p1 == p2)
    return {
      h0: `$H_0$ : Les deux parents ont les yeux ${c[p1]}.`,
      h1: `$H_1$ : L'un des deux parents au moins n'a pas les yeux ${c[p1]}.`,
    };
  const other = Object.keys(c).find((k) => k !== p1 && k !== p2);
  return {
    h0: `$H_0$ : Le couple est composé d'un parent aux yeux ${c[p1]} et d'un parent aux yeux ${c[p2]}.`,
    h1: `$H_1$ : Les deux parents ont les yeux de la même couleur, ou bien au moins l'un des deux a les yeux ${c[other]}.`,
  };
};

LANG.buildConclusion = function (child, h0, h1, pct) {
  const label = LANG.eyeColors[child];
  const h0_f = `l${h0.slice(9, -1)}`;
  const h1_f = `l${h1.slice(9, -1)}`;
  const decision =
    pct >= 5
      ? `Ainsi, comme p ≥ 5%, alors le résultat n'est pas extraordianire dans le monde où $H_0$ est vraie. Il n'y a pas de bonnes raisons de rejetter $H_0$ et basculer vers $H_1$. On pourra conclure : ${h0_f}.`
      : `Ainsi, comme p < 5%, alors le résultat est extraordianire dans le monde où $H_0$ est vraie. Nous avons suffisamment de preuves pour basculer vers $H_1$. On rejette $H_0$ (${h0_f}) et on concluera : ${h1_f}.`;
  return `La probabilité que l'enfant ait les yeux ${label}, sachant que ${h0_f} est de $${pct}\\%$ (Figure 1). Cette probabilité est exactement ce qu'on a appelé p-value <u>dans le cadre de cet exercice</u>. ${decision}`;
};

LANG.treeConclusion = {
  conclusionOrdinary: (threshold) =>
    `Comme p ≥ 0.0500, ce résultat est alors ordinaire dans le monde où $H_0$ est vraie : le fait qu'un chêne mesure ${threshold} m n'est pas un fait extraordinaire, observer ce résultat ou un résultat plus extrême n'est pas improbable. Il n'y a pas assez de preuves pour basculer vers $H_1$ : Eve ne peut pas rejetter $H_0$ et conclure que l'arbre est un hêtre, elle doit se résigner à conclure que l'arbre est un chêne.`,
  conclusionExtraordinary: (threshold) =>
    `Comme p < 0.0500, ce résultat est alors extraordinaire dans le monde où $H_0$ est vraie : si l'arbre était vraiment un chêne, observer ce résultat (mesurer ${threshold} m) ou un résultat aussi extrême aurait été trop peu probable. On considère qu'on a atteint un niveau de preuves suffisant pour rejetter $H_0$ et basculer vers $H_1$: Eve pourra conclure que l'arbre est un hêtre.`,
  formula: (threshold, pct) =>
    `$\\text{p-value} \\coloneqq P(H \\geq ${threshold} \\mid \\text{l'arbre est un chêne}) = {\\color{green}\\boldsymbol{${pct}\\%}}$`,
  descriptionText: (threshold, pct, raw, conclusion) =>
    `La probabilité qu'un arbre mesure plus de ${threshold} m, sachant (en croyant) que c'est un chêne, est de ${pct}%. Cette probabilité est précisément la définition de la p-value : ici donc p = ${raw}. ${conclusion}`,
};
