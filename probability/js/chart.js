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
    const color = this.COLORS[probType];

    const points = d3.range(this.X_BOUNDS.min, this.X_BOUNDS.max, (this.X_BOUNDS.max - this.X_BOUNDS.min) / 300)
      .map(val => ({ x: val, y: Gaussian.pdf(val, mu, sigma) }));

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
      .attr('stroke', '#011993')
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

    // --- Probability label on chart ---
    if (prob !== null) {
      const labelX = probType === 'less' ? x(a) - 40 : x(a) + 8;
      this.svg.select('.probability-label')
        .attr('x', labelX)
        .attr('y', 20)
        .attr('fill', color)
        .attr('font-size', '0.9rem')
        .text(`${(prob * 100).toFixed(1)}%`);
    } else {
      this.svg.select('.probability-label').text('');
    }

    return prob;
  }
};