const LANG = {
  eyeColors: { brun: 'brown', vert: 'green', bleu: 'blue' },
  eyeColorLabels: { brun: 'Brown', vert: 'Green', bleu: 'Blue' },
  groups: [
    { name: 'child', label: "Child's eye color", parent: false },
    { name: 'parent1', label: 'Parent 1', parent: true },
    { name: 'parent2', label: 'Parent 2', parent: true },
  ],
  parentsLabelLatex: 'Null hypothesis $H_0$',
  parentsSubtitle: "Parents' eye color",
  figuresPath: '../fr/figures',
  // Tree part
  controlTreeSentence: `$\\text{Tree height } H \\text{ (m)}:$`,
  chart: {
    xLabel: 'Tree height (m)',
    yLabel: 'Density',
    checkboxLabel: `Show rejection region of H\u2080`,
    criticalZoneLabel: `Rejection region of H\u2080`,
    extraordinaryLabel: 'Extraordinary result',
    criticalHeight: {
      before: 'Critical height ',
      variable: 'H',
      after: (x0) => `: ${x0.toFixed(2)} m`,
    },
  },
};

LANG.buildHypothesis = function (key) {
  const [p1, p2] = key.split('-');
  const c = LANG.eyeColors;
  if (p1 == p2)
    return {
      h0: `$H_0$: both parents have ${c[p1]} eyes.`,
      h1: `$H_1$: at least one parent does not have ${c[p1]} eyes.`,
    };
  const other = Object.keys(c).find((k) => k !== p1 && k !== p2);
  return {
    h0: `$H_0$: the couple consists of one parent with ${c[p1]} eyes and one with ${c[p2]} eyes.`,
    h1: `$H_1$: both parents have the same eye color, or at least one has ${c[other]} eyes.`,
  };
};

LANG.buildConclusion = function (child, h0, h1, pct) {
  const label = LANG.eyeColors[child];
  const h0_f = `${h0.slice(7, -1)}`;
  const h1_f = `${h1.slice(7, -1)}`;
  const decision =
    pct >= 5
      ? `Since p-value ≥ 5%, the result is <strong>not extraordinary</strong> in a world where $H_0$ is true. There is no good reason to reject $H_0$ and shift towards $H_1$. We can conclude: ${h0_f}.`
      : `Since p-value < 5%, the result is <strong>extraordinary</strong> in a world where $H_0$ is true. We have sufficient evidence to switch to $H_1$. We reject $H_0$ (${h0_f}) and conclude: ${h1_f}.`;
  return `The probability of the child having ${label} eyes, given that ${h0_f} is $${pct}\\%$ (Figure 1). This probability is exactly what we have called the p-value <u>within the context of this exercise</u>. ${decision}`;
};

LANG.treeConclusion = {
  conclusionOrdinary: (threshold) =>
    `Since p-value ≥ 0.0500, this result is ordinary in a world where $H_0$ is true: the fact that an oak tree measures ${threshold} m is not extraordinary, observing this result or a more extreme one is not unlikely. There is not enough evidence to switch to $H_1$: Eve cannot reject $H_0$ and conclude the tree is a beech; she must conclude it is an oak.`,
  conclusionExtraordinary: (threshold) =>
    `Since p-value < 0.0500, this result is extraordinary in a world where $H_0$ is true: if the tree was truly an oak, observing this result (measuring ${threshold} m) or something as extreme would have been too unlikely. We consider that sufficient evidence has been reached to reject $H_0$ and switch to $H_1$: Eve can conclude the tree is a beech.`,
  formula: (threshold, pct) =>
    `$\\text{p-value} \\coloneqq P(H \\geq ${threshold} \\mid \\text{the tree is an oak}) = {\\color{green}\\boldsymbol{${pct}\\%}}$`,
  descriptionText: (threshold, pct, raw, conclusion) =>
    `The probability that a tree measures more than ${threshold} m, assuming it is an oak, is ${pct}%. This probability is precisely the definition of the p-value: here p = ${raw}. This means that the area under the curve between ${threshold} and + &infin; represents ${pct}% of the total area, which encompasses all possible heights (the sample space). ${conclusion}`,
};
