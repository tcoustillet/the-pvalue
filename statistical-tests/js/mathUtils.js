/**
 * Computes the arithmetic mean of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 */
function mean(values) {
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

/**
 * Computes the (sample) variance of an array of numbers.
 * Uses n-1 in the denominator (Bessel's correction), the usual choice
 * when the data is treated as a sample rather than a full population.
 * @param {number[]} values
 * @returns {number}
 */
function variance(values) {
  const avg = mean(values);
  const squaredDiffs = values.map((v) => (v - avg) ** 2);
  return squaredDiffs.reduce((acc, d) => acc + d, 0) / (values.length - 1);
}

function standardDeviation(values) {
  return Math.sqrt(variance(values));
}

/**
 * Formats a number with a dot as decimal separator (standard JS behavior).
 * @param {number} value
 * @param {number} [decimals=1] decimals - number of decimal places
 * @returns {string}
 */
function formatNumberDot(value, decimals = 1) {
  return value.toFixed(decimals);
}

/**
 * Formats a number with a comma as decimal separator (for French language).
 * Reuses formatNumberDot and swaps the separator.
 * @param {number} value
 * @param {number} decimals - number of decimal places
 * @returns {string}
 */
function formatNumberComma(value, decimals) {
  return formatNumberDot(value, decimals).replace('.', ',');
}
