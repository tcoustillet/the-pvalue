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
    if (pct >= 1) return pct.toFixed(2);
    return parseFloat(pct.toPrecision(2)).toString();
  },

  formatProbRaw(prob) {
    if (prob >= 0.01) return prob.toFixed(4);
    return parseFloat(prob.toPrecision(2)).toString();
  },

  /**
   * Finds x0 such that P(X > x0 | mu, sigma) = targetProb
   * Uses binary search on the CDF.
   * @param {number} targetProb - Target probability (e.g. 0.05)
   * @param {number} mu
   * @param {number} sigma
   * @param {number} [tol=1e-6] - Tolerance
   * @returns {number}
   */
  quantile(targetProb, mu, sigma, tol = 1e-6) {
    let lo = mu - 10 * sigma;
    let hi = mu + 10 * sigma;
    while (hi - lo > tol) {
      const mid = (lo + hi) / 2;
      Gaussian.probabilityGreaterThan(mid, mu, sigma) > targetProb ? (lo = mid) : (hi = mid);
    }
    return (lo + hi) / 2;
  },
};
