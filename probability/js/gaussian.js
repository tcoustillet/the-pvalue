/**
 * Gaussian distribution utility functions.
 * Provides PDF, CDF and probability calculations for a normal distribution.
 */
const Gaussian = {
  /**
   * Probability Density Function (PDF) of a normal distribution.
   * @param {number} x - The point at which to evaluate the PDF.
   * @param {number} mu - The mean of the distribution.
   * @param {number} sigma - The standard deviation of the distribution.
   * @returns {number} The probability density at x.
   */
  pdf(x, mu, sigma) {
    const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -0.5 * ((x - mu) / sigma) ** 2;
    return coeff * Math.exp(exponent);
  },

  /**
   * Cumulative Distribution Function (CDF) of a normal distribution.
   * @param {number} x - The point at which to evaluate the CDF.
   * @param {number} mu - The mean of the distribution.
   * @param {number} sigma - The standard deviation of the distribution.
   * @returns {number} The cumulative probability P(X <= x).
   */
  cdf(x, mu, sigma) {
    return 0.5 * (1 + Gaussian.erf((x - mu) / (sigma * Math.sqrt(2))));
  },

  /**
   * Approximation of the error function (erf) using Horner's method.
   * Based on Abramowitz and Stegun formula 7.1.26.
   * Maximum error: 1.5e-7.
   * @param {number} x - The input value.
   * @returns {number} The approximate value of erf(x).
   */
  erf(x) {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const poly =
      t *
      (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
    const result = 1 - poly * Math.exp(-x * x);
    return x >= 0 ? result : -result;
  },

  /**
   * Computes P(X < x).
   * @param {number} x - The threshold value.
   * @param {number} mu - The mean of the distribution.
   * @param {number} sigma - The standard deviation of the distribution.
   * @returns {number} The probability P(X < x).
   */
  probabilityLessThan(x, mu, sigma) {
    return Gaussian.cdf(x, mu, sigma);
  },

  /**
   * Computes P(X > x).
   * @param {number} x - The threshold value.
   * @param {number} mu - The mean of the distribution.
   * @param {number} sigma - The standard deviation of the distribution.
   * @returns {number} The probability P(X > x).
   */
  probabilityGreaterThan(x, mu, sigma) {
    return 1 - Gaussian.cdf(x, mu, sigma);
  },

  /**
   * Computes P(A < X < B).
   * @param {number} a - The lower bound.
   * @param {number} b - The upper bound.
   * @param {number} mu - The mean of the distribution.
   * @param {number} sigma - The standard deviation of the distribution.
   * @returns {number} The probability P(A < X < B).
   */
  probabilityBetween(a, b, mu, sigma) {
    return Gaussian.cdf(b, mu, sigma) - Gaussian.cdf(a, mu, sigma);
  },
};
