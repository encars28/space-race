import * as d3 from 'd3';

export interface YearlyData {
  year: number;
  USA: number;
  USSR: number;
}

export function drawAcumLaunchesBarChart(
  svgElement: SVGSVGElement,
  currentData: YearlyData,
  allData: YearlyData[]
): void {
  const svg = d3.select(svgElement);
  const width = 600;
  const height = 500;
  const margin = { top: 60, right: 40, bottom: 60, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg.attr('width', width).attr('height', height);

  // Clear previous content
  svg.selectAll('*').remove();

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Get the maximum value across all years for consistent scale
  const maxValue = d3.max(allData, (d) => Math.max(d.USA, d.USSR)) || 100;

  // Scales
  const xScale = d3
    .scaleBand()
    .domain(['USA', 'USSR'])
    .range([0, innerWidth])
    .padding(0.4);

  const yScale = d3.scaleLinear().domain([0, maxValue]).range([innerHeight, 0]);

  // Color scale
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(['USA', 'USSR'])
    .range(['#3b82f6', '#ef4444']);

  // Draw bars
  const barData = [
    { country: 'USA', value: currentData.USA },
    { country: 'USSR', value: currentData.USSR },
  ];

  g.selectAll('.bar')
    .data(barData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => xScale(d.country) || 0)
    .attr('y', (d) => yScale(d.value))
    .attr('width', xScale.bandwidth())
    .attr('height', (d) => innerHeight - yScale(d.value))
    .attr('fill', (d) => colorScale(d.country))
    .attr('rx', 4);

  // Add value labels on bars
  g.selectAll('.value-label')
    .data(barData)
    .enter()
    .append('text')
    .attr('class', 'value-label')
    .attr('x', (d) => (xScale(d.country) || 0) + xScale.bandwidth() / 2)
    .attr('y', (d) => yScale(d.value) - 10)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '18px')
    .attr('font-weight', 'bold')
    .text((d) => d.value);

  // X axis
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('fill', '#fff')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold');

  g.selectAll('.x-axis path, .x-axis line').attr('stroke', '#666');

  // Y axis
  g.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale).ticks(10))
    .selectAll('text')
    .attr('fill', '#fff')
    .attr('font-size', '14px');

  g.selectAll('.y-axis path, .y-axis line').attr('stroke', '#666');

  // Y axis label
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -60)
    .attr('x', -innerHeight / 2)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '16px')
    .text('Lanzamientos totales');
}
