const Gaussian = {
  pdf(x, mu, sigma) {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -0.5 * ((x - mu) / sigma) ** 2;
    return coeff * Math.exp(exponent);
  },

  cdf(x, mu, sigma) {
    return 0.5 * (1 + Gaussian.erf((x - mu) / (sigma * Math.sqrt(2))));
  },

  erf(x) {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const poly =
      t *
      (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
    const result = 1 - poly * Math.exp(-x * x);
    return x >= 0 ? result : -result;
  },

  probabilityGreaterThan(x, mu, sigma) {
    return 1 - Gaussian.cdf(x, mu, sigma);
  },

  formatProb(prob) {
    const pct = prob * 100;
    if (pct >= 1) return pct.toFixed(1);
    return parseFloat(pct.toPrecision(1)).toString();
  },

  formatProbRaw(prob) {
    if (prob >= 0.01) return prob.toFixed(3);
    return parseFloat(prob.toPrecision(1)).toString();
  },
};
