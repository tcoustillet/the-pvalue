/**
 * Handles the D3.js rendering of the Gaussian distribution chart.
 * Draws the curve, the vertical threshold line and the shaded area.
 */
const GaussianChart = {
  svg: null,
  dims: {
    height: 350,
    margin: { top: 20, right: 30, bottom: 60, left: 60 },
  },
  scales: {
    x: null,
    y: null,
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

    this.svg = d3
      .select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.scales.x = d3.scaleLinear().range([0, innerWidth]);
    this.scales.x.domain([2, 34]);
    this.scales.y = d3.scaleLinear().range([innerHeight, 0]);

    this.svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${innerHeight})`);

    this.svg.append('g').attr('class', 'y-axis');

    this.svg.append('path').attr('class', 'curve');
    this.svg.append('path').attr('class', 'shaded-area');
    this.svg.append('line').attr('class', 'threshold-line');
    this.svg.append('text').attr('class', 'probability-label');
    this.svg.append('text').attr('class', 'arrow-top');
    this.svg.append('text').attr('class', 'arrow-bottom');

    // X axis label
    this.svg
      .append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'middle')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 20)
      .text("Taille de l'arbre (m)");

    // Y axis label
    this.svg
      .append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90)`)
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 10)
      .text('Densité');
  },

  /**
   * Updates the chart with new distribution parameters and threshold.
   * @param {number} mu - The mean of the distribution.
   * @param {number} sigma - The standard deviation of the distribution.
   * @param {number|null} threshold - The user threshold value (or null if not set).
   */
  update(mu, sigma, threshold) {
    const { height, margin } = this.dims;
    const innerHeight = height - margin.top - margin.bottom;
    const { x, y } = this.scales;

    const xMin = mu - 4 * sigma;
    const xMax = mu + 4 * sigma;
    const points = d3
      .range(xMin, xMax, (xMax - xMin) / 200)
      .map((val) => ({ x: val, y: Gaussian.pdf(val, mu, sigma) }));

    y.domain([0, d3.max(points, (d) => d.y) * 1.1]);

    this.svg.select('.x-axis').call(d3.axisBottom(x));
    this.svg.select('.y-axis').call(d3.axisLeft(y));

    this.svg
      .selectAll('.tick text, .x-label, .y-label')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif')
      .style('fill', '#000');

    const line = d3
      .line()
      .x((d) => x(d.x))
      .y((d) => y(d.y));

    this.svg
      .select('.curve')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#2ca02c')
      .attr('stroke-width', 2);

    if (threshold !== null) {
      const area = d3
        .area()
        .x((d) => x(d.x))
        .y0(innerHeight)
        .y1((d) => y(d.y));

      const shadedPoints = [
        { x: threshold, y: Gaussian.pdf(threshold, mu, sigma) },
        ...points.filter((d) => d.x > threshold),
      ];

      this.svg
        .select('.shaded-area')
        .datum(shadedPoints)
        .attr('d', area)
        .attr('fill', '#2ca02c')
        .attr('opacity', 0.4);

      this.svg
        .select('.threshold-line')
        .attr('x1', x(threshold))
        .attr('x2', x(threshold))
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#2ca02c')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '2,4');

      const arrowGap = 14;
      const arrowLowY = y(0.004) + 4;

      this._drawArrow('.arrow-top', x(threshold) - arrowGap, 20, '#2ca02c', '→');
      this._drawArrow('.arrow-bottom', x(threshold) - arrowGap, arrowLowY, '#2ca02c', '→');

      const prob = Gaussian.probabilityGreaterThan(threshold, mu, sigma);

      this.svg
        .select('.probability-label')
        .attr('x', x(threshold) + 8)
        .attr('y', 20)
        .attr('fill', '#2ca02c')
        .attr('font-size', '1rem')
        .text(`${Gaussian.formatProb(prob)}%`);
    } else {
      this.svg.select('.shaded-area').attr('d', null);
      this.svg.select('.threshold-line').attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', 0);
      this.svg.select('.probability-label').text('');
      this.svg.select('.arrow-top').text('');
      this.svg.select('.arrow-bottom').text('');
    }
  },

  _drawArrow(selector, xPos, yPos, color, char) {
    this.svg
      .select(selector)
      .attr('x', xPos)
      .attr('y', yPos)
      .attr('text-anchor', 'end')
      .attr('fill', color)
      .attr('font-size', '1rem')
      .text(char);
  },
};
