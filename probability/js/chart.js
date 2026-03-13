/**
 * Handles the D3.js rendering of the Gaussian distribution chart for test2.
 * Supports three probability types: less, greater, between.
 */
const GaussianChart = {
  /** @type {Object} D3 SVG selection */
  svg: null,

  /** @type {string} CSS selector of the container */
  selector: null,

  /** @type {Object} Chart dimensions and margins */
  dims: {
    height: 350,
    margin: { top: 20, right: 30, bottom: 40, left: 50 }
  },

  /** @type {Object} D3 scale functions */
  scales: {
    x: null,
    y: null
  },

  /** @type {Object} Fixed x-axis bounds */
  X_BOUNDS: { min: 140, max: 225 },

  /** @type {Object} Colors per probability type */
  COLORS: {
    less: '#e07b39',
    greater: '#2ca02c',
    between: '#9467bd'
  },

  /**
   * Initializes the SVG container and scales.
   * @param {string} selector - CSS selector of the container element.
   */
  init(selector) {
    this.selector = selector;
    const { height, margin } = this.dims;
    const width = document.querySelector(selector).clientWidth;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    this.svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.scales.x = d3.scaleLinear()
      .domain([this.X_BOUNDS.min, this.X_BOUNDS.max])
      .range([0, innerWidth]);

    this.scales.y = d3.scaleLinear()
      .range([innerHeight, 0]);

    this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`);

    this.svg.append('g')
      .attr('class', 'y-axis');

    this.svg.append('path').attr('class', 'curve');
    this.svg.append('path').attr('class', 'shaded-area');
    this.svg.append('line').attr('class', 'threshold-line-a');
    this.svg.append('line').attr('class', 'threshold-line-b');
    this.svg.append('text').attr('class', 'arrow-a');
    this.svg.append('text').attr('class', 'arrow-b');
    this.svg.append('text').attr('class', 'arrow-a2');
    this.svg.append('text').attr('class', 'arrow-b2');
    this.svg.append('rect').attr('class', 'probability-label-bg');
    this.svg.append('text').attr('class', 'probability-label');
  },

  /**
   * Updates the chart with new state.
   * @param {Object} state - Current controls state.
   * @param {string} state.probType - 'less', 'greater' or 'between'.
   * @param {number} state.mu - Mean of the distribution.
   * @param {number} state.sigma - Standard deviation.
   * @param {number|null} state.a - Lower threshold.
   * @param {number|null} state.b - Upper threshold.
   */
  update(state) {
    const { probType, mu, sigma, a, b } = state;
    const { height, margin } = this.dims;
    const innerHeight = height - margin.top - margin.bottom;
    const { x, y } = this.scales;
    const color = state.color;

    const points = d3.range(this.X_BOUNDS.min, this.X_BOUNDS.max, (this.X_BOUNDS.max - this.X_BOUNDS.min) / 300)
      .map(val => ({ x: val, y: Gaussian.pdf(val, mu, sigma) }));

    // Ensure exact threshold points are included
    if (a !== null) points.push({ x: a, y: Gaussian.pdf(a, mu, sigma) });
    if (b !== null) points.push({ x: b, y: Gaussian.pdf(b, mu, sigma) });
    points.sort((p1, p2) => p1.x - p2.x);

    y.domain([0, d3.max(points, d => d.y) * 1.1]);

    this.svg.select('.x-axis').call(d3.axisBottom(x));
    this.svg.select('.y-axis').call(d3.axisLeft(y));

    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y));

    this.svg.select('.curve')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2);

    // --- Shaded area ---
    const area = d3.area()
      .x(d => x(d.x))
      .y0(innerHeight)
      .y1(d => y(d.y));

    let shadedPoints = [];
    let prob = null;

    if (probType === 'less' && a !== null) {
      shadedPoints = points.filter(d => d.x <= a);
      prob = Gaussian.probabilityLessThan(a, mu, sigma);
    } else if (probType === 'greater' && a !== null) {
      shadedPoints = points.filter(d => d.x >= a);
      prob = Gaussian.probabilityGreaterThan(a, mu, sigma);
    } else if (probType === 'between' && a !== null && b !== null && a < b) {
      shadedPoints = points.filter(d => d.x >= a && d.x <= b);
      prob = Gaussian.cdf(b, mu, sigma) - Gaussian.cdf(a, mu, sigma);
    }

    this.svg.select('.shaded-area')
      .datum(shadedPoints)
      .attr('d', area)
      .attr('fill', color)
      .attr('opacity', 0.3);

    // --- Probability label and arrows ---
const arrowY = 16;
const arrowGap = 14;
const arrowLowY = y(0.004) + 4;

if (prob !== null) {
  let labelX;
  if (probType === 'less') {
    labelX = x(a) - 8;
  } else if (probType === 'greater') {
    labelX = x(a) + 30;
  } else if (probType === 'between') {
    labelX = (x(a) + x(b)) / 2;
  }
  
  this.svg.select('.probability-label')
    .attr('x', labelX)
    .attr('y', 20)
    .attr('text-anchor', probType === 'less' ? 'end' : 'middle')
    .attr('fill', color)
    .attr('font-size', '1rem')
    .text(`${(prob * 100).toFixed(1)}%`);
  
  const bbox = this.svg.select('.probability-label').node().getBBox();
  
  this.svg.select('.probability-label-bg')
    .attr('x', bbox.x - 3)
    .attr('y', bbox.y - 2)
    .attr('width', bbox.width + 6)
    .attr('height', bbox.height + 4)
    .attr('fill', '#fff8e7')
    .attr('opacity', 1)
    .attr('rx', 8)
    .attr('ry', 8);

  if (probType === 'less') {
    this._drawArrow('.arrow-a',  x(a) + arrowGap, arrowY + 4, 'start', color, '\u2190');
    this._drawArrow('.arrow-a2', x(a) + arrowGap, arrowLowY, 'start', color, '\u2190');
    this.svg.select('.arrow-b').text('');
    this.svg.select('.arrow-b2').text('');
  } else if (probType === 'greater') {
    this._drawArrow('.arrow-a',  x(a) - arrowGap, arrowY + 4, 'end', color, '\u2192');
    this._drawArrow('.arrow-a2', x(a) - arrowGap, arrowLowY, 'end', color, '\u2192');
    this.svg.select('.arrow-b').text('');
    this.svg.select('.arrow-b2').text('');
  } else if (probType === 'between' && b !== null) {
    this._drawArrow('.arrow-a',  x(a) - arrowGap, arrowY + 4, 'end', color, '\u2192');
    this._drawArrow('.arrow-a2', x(a) - arrowGap, arrowLowY, 'end', color, '\u2192');
    this._drawArrow('.arrow-b',  x(b) + arrowGap, arrowY + 4, 'start', color, '\u2190');
    this._drawArrow('.arrow-b2', x(b) + arrowGap, arrowLowY, 'start', color, '\u2190');
  }
} else {
  this.svg.select('.probability-label').text('');
  this.svg.select('.arrow-a').text('');
  this.svg.select('.arrow-b').text('');
}

    this._updateThresholdLine('.threshold-line-a', a, color, innerHeight, x);
    this._updateThresholdLine('.threshold-line-b', probType === 'between' ? b : null, color, innerHeight, x);

    return prob;
  },

  _updateThresholdLine(lineClass, value, color, innerHeight, x) {
    if (value === null) {
      this.svg.select(lineClass).attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', 0);
      return;
    }
    const xPos = x(value);
    this.svg.select(lineClass)
      .attr('x1', xPos).attr('x2', xPos)
      .attr('y1', 0).attr('y2', innerHeight)
      .attr('stroke', color)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '2,4');
  },

  _drawArrow(selector, xPos, yPos, anchor, color, char) {
    this.svg.select(selector)
      .attr('x', xPos)
      .attr('y', yPos)
      .attr('text-anchor', anchor)
      .attr('fill', color)
      .attr('font-size', '1rem')
      .text(char);
  },
};