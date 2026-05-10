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
      .text(LANG.chart.xLabel);

    // Y axis label
    this.svg
      .append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90)`)
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 10)
      .text(LANG.chart.yLabel);

    this.svg.append('line').attr('class', 'critical-line');
    this.svg.append('rect').attr('class', 'critical-area');
    this.svg.append('text').attr('class', 'critical-label');

    // Checkbox in top-left corner
    const foreignObject = this.svg
      .append('foreignObject')
      .attr('x', 14)
      .attr('y', 0)
      .attr('width', 210)
      .attr('height', 30);

    const checkboxWrapper = foreignObject
      .append('xhtml:label')
      .style('font-size', '0.9rem')
      .style('cursor', 'pointer')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('gap', '4px');

    const checkbox = checkboxWrapper
      .append('xhtml:input')
      .attr('type', 'checkbox')
      .attr('id', 'toggle-critical');

    checkboxWrapper.append('xhtml:span').text(LANG.chart.checkboxLabel);

    checkbox.on('change', () => this._lastUpdate && this.update(...this._lastUpdate));
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

    this._lastUpdate = [mu, sigma, threshold];

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

    const showCritical = document.getElementById('toggle-critical')?.checked ?? false;
    this._updateCriticalRegion(showCritical, mu, sigma);
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

  _updateCriticalRegion(show, mu, sigma) {
    const { height, margin } = this.dims;
    const innerHeight = height - margin.top - margin.bottom;
    const { x, y } = this.scales;

    if (!show) {
      this.svg.select('.critical-line').attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('y2', 0);
      this.svg.select('.critical-area').attr('width', 0);
      this.svg.select('.critical-label').text('');
      this.svg.selectAll('.critical-box').remove();
      return;
    }

    const x0 = Gaussian.quantile(0.05, mu, sigma);
    const xPos = x(x0);
    const innerWidth = xPos;

    // Shaded critical region
    this.svg
      .select('.critical-area')
      .attr('x', xPos)
      .attr('y', 0)
      .attr('width', x(mu + 4 * sigma) - xPos)
      .attr('height', innerHeight)
      .attr('fill', '#d62728')
      .attr('opacity', 0.15);

    // Vertical line
    this.svg
      .select('.critical-line')
      .attr('x1', xPos)
      .attr('x2', xPos)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#d62728')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '2,4');

    // Label box
    this.svg.select('.critical-label').remove();

    const zoneWidth = x(mu + 4 * sigma) - xPos;
    const boxX = xPos + zoneWidth / 2;
    const boxY = innerHeight / 4;
    const boxW = 140;
    const boxH = 40;

    this.svg.selectAll('.critical-box').remove();

    const g = this.svg.append('g').attr('class', 'critical-box');

    g.append('rect')
      .attr('x', boxX - boxW / 2)
      .attr('y', boxY)
      .attr('width', boxW)
      .attr('height', boxH)
      .attr('fill', 'white')
      .attr('stroke', '#d62728')
      .attr('stroke-width', 1)
      .attr('rx', 6);

    g.append('text')
      .attr('x', boxX)
      .attr('y', boxY + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#d62728')
      .attr('font-size', '0.75rem')
      .attr('font-weight', '600')
      .text(LANG.chart.criticalZoneLabel);

    g.append('text')
      .attr('x', boxX)
      .attr('y', boxY + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#d62728')
      .attr('font-size', '0.75rem')
      .text('p-value < 0.05');

    const box2Y = boxY + boxH + 30;
    const box2H = 40;
    const box2W = 180;

    const g2 = this.svg.append('g').attr('class', 'critical-box');

    g2.append('rect')
      .attr('x', boxX - box2W / 2)
      .attr('y', box2Y)
      .attr('width', box2W)
      .attr('height', box2H)
      .attr('fill', 'white')
      .attr('stroke', '#d62728')
      .attr('stroke-width', 1)
      .attr('rx', 6);

    g2.append('text')
      .attr('x', boxX)
      .attr('y', box2Y + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#d62728')
      .attr('font-size', '0.75rem')
      .attr('font-weight', '600')
      .text(LANG.chart.extraordinaryLabel);

    const line2 = g2
      .append('text')
      .attr('x', boxX)
      .attr('y', box2Y + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#d62728')
      .attr('font-size', '0.75rem');

    const ch = LANG.chart.criticalHeight;
    line2.append('tspan').text(ch.before);
    line2.append('tspan').attr('font-weight', '600').text(ch.variable);
    line2.append('tspan').text(ch.after(x0));
  },
};
