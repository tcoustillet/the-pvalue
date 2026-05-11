/**
 * Handles the D3.js rendering of the binomial distribution histogram.
 * Highlights bars corresponding to P(X = k) or P(X >= k) depending on mode.
 */
const BinomialChart = {
  svg: null,

  dims: {
    margin: { top: 20, right: 30, bottom: 40, left: 60 },
  },

  FIXED_WIDTH: 800,
  FIXED_HEIGHT: 350,

  COLOR_DEFAULT: '#1f77b4',
  COLOR_HIGHLIGHT: '#ff7f0e',

  /**
   * Initializes the SVG container and axes groups.
   * @param {string} selector - CSS selector of the container element.
   */
  init(selector) {
    const { margin } = this.dims;
    const innerWidth = this.FIXED_WIDTH - margin.left - margin.right;
    const innerHeight = this.FIXED_HEIGHT - margin.top - margin.bottom;

    this.svg = d3
      .select(selector)
      .append('svg')
      .attr('viewBox', `0 0 ${this.FIXED_WIDTH} ${this.FIXED_HEIGHT}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${innerHeight})`);
    this.svg.append('g').attr('class', 'y-axis');
    this.svg.append('g').attr('class', 'grid');
    this.svg.append('g').attr('class', 'band');
    this.svg.append('g').attr('class', 'bars');

    // X axis label
    this.svg
      .append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'middle')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 5)
      .text(LANG.xAxisLabel);

    // Y axis label
    this.svg
      .append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90)`)
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 10)
      .text(LANG.yAxisLabel);
  },

  /**
   * Returns true if a bar at position barK should be highlighted.
   * @param {number} barK - The bar's k value.
   * @param {number|null} k - The selected threshold.
   * @param {string} mode - 'eq' or 'gte'.
   * @returns {boolean}
   * @private
   */
  _isHighlighted(barK, k, mode) {
    if (k === null) return false;
    return mode === 'eq' ? barK === k : barK >= k;
  },

  /**
   * Updates the histogram with new state.
   * @param {Object} state - Current controls state.
   * @param {number} state.n - Number of trials.
   * @param {number} state.p - Probability of success.
   * @param {number|null} state.k - Selected value.
   * @param {string} state.mode - 'eq' or 'gte'.
   * @returns {number|null} The computed probability.
   */
  update(state) {
    const { margin } = this.dims;
    const innerWidth = this.FIXED_WIDTH - margin.left - margin.right;
    const innerHeight = this.FIXED_HEIGHT - margin.top - margin.bottom;

    const { n, p, k, mode } = state;

    const data = d3.range(0, n + 1).map((barK) => ({
      k: barK,
      prob: Binomial.pmf(barK, n, p),
    }));

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.k))
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.prob) * 1.1])
      .range([innerHeight, 0]);

    this.svg
      .select('.grid')
      .call(d3.axisLeft(y).ticks(6).tickSize(-innerWidth).tickFormat(''))
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .attr('stroke', '#514e4e86')
          .attr('stroke-width', 0.5)
          .attr('stroke-dasharray', '2')
      );

    this.svg
      .selectAll('.tick text, .x-label, .y-label')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif')
      .style('fill', '#000');

    const bandData =
      k !== null ? [{ start: mode === 'eq' ? k : k, end: mode === 'eq' ? k : n }] : [];

    const band = this.svg.select('.band').selectAll('rect').data(bandData);

    band
      .enter()
      .append('rect')
      .merge(band)
      .attr('x', (d) => x(d.start))
      .attr('y', 0)
      .attr('width', (d) => (mode === 'eq' ? x.bandwidth() : x(d.end) + x.bandwidth() - x(d.start)))
      .attr('height', innerHeight)
      .attr('fill', '#ff7f0e')
      .attr('opacity', 0.4);

    band.exit().remove();

    this.svg
      .select('.x-axis')
      .call(
        d3
          .axisBottom(x)
          .tickValues(
            data.map((d) => d.k).filter((barK) => n <= 20 || barK % Math.ceil(n / 20) === 0)
          )
      );
    this.svg.select('.y-axis').call(d3.axisLeft(y).ticks(6));

    const bars = this.svg
      .select('.bars')
      .selectAll('rect')
      .data(data, (d) => d.k);

    bars
      .enter()
      .append('rect')
      .merge(bars)
      .attr('x', (d) => x(d.k))
      .attr('y', (d) => y(d.prob))
      .attr('width', x.bandwidth())
      .attr('height', (d) => innerHeight - y(d.prob))
      .attr('fill', (d) =>
        this._isHighlighted(d.k, k, mode) ? this.COLOR_HIGHLIGHT : this.COLOR_DEFAULT
      )
      .attr('stroke', '#000000')
      .attr('stroke-width', 0.5);

    bars.exit().remove();

    if (k === null) return null;
    return mode === 'eq' ? Binomial.pmf(k, n, p) : Binomial.probabilityGreaterThan(k - 1, n, p);
  },
};
