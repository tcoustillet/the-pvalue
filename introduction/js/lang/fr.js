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
  buildHypothesis(key) {
    const [p1, p2] = key.split('-');
    const c = this.eyeColors;
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
  },
  buildConclusion(child, h0, h1, pct) {
    const label = this.eyeColors[child];
    const h0_f = `l${h0.slice(9, -1)}`;
    const h1_f = `l${h1.slice(9, -1)}`;
    const decision =
      pct >= 5
        ? `Ainsi, comme p ≥ 5%, alors le résultat n'est pas extraordianire dans le monde où $H_0$ est vraie. Il n'y a pas de bonnes raisons de rejetter $H_0$ et basculer vers $H_1$. On pourra conclure : ${h0_f}.`
        : `Ainsi, comme p < 5%, alors le résultat est extraordianire dans le monde où $H_0$ est vraie. Nous avons suffisamment de preuves pour basculer vers $H_1$. On rejette $H_0$ (${h0_f}) et on concluera : ${h1_f}.`;
    return `La probabilité que l'enfant ait les yeux ${label}, sachant que ${h0_f} est de $${pct}\\%$ (Figure 1). Cette probabilité est exactement ce qu'on a appelé p-value <u>dans le cadre de cet exercice</u>. ${decision}`;
  },
};
