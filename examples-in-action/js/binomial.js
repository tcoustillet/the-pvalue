/**
 * Binomial distribution utility functions.
 * Provides PMF and probability calculations for a binomial distribution.
 */
const Binomial = {

  /**
   * Computes the binomial coefficient C(n, k).
   * @param {number} n - Number of trials.
   * @param {number} k - Number of successes.
   * @returns {number} The binomial coefficient.
   */
  coefficient(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    let result = 1;
    for (let i = 0; i < k; i++) {
      result *= (n - i) / (i + 1);
    }
    return result;
  },

  /**
   * Probability Mass Function (PMF) of a binomial distribution.
   * @param {number} k - Number of successes.
   * @param {number} n - Number of trials.
   * @param {number} p - Probability of success (between 0 and 1).
   * @returns {number} The probability P(X = k).
   */
  pmf(k, n, p) {
    return this.coefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  },

  /**
   * Computes P(X > a).
   * @param {number} a - The threshold value.
   * @param {number} n - Number of trials.
   * @param {number} p - Probability of success (between 0 and 1).
   * @returns {number} The probability P(X > a).
   */
  probabilityGreaterThan(a, n, p) {
    let prob = 0;
    for (let k = a + 1; k <= n; k++) {
      prob += this.pmf(k, n, p);
    }
    return prob;
  }
};