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
    .domain(['USA', 'URSS'])
    .range([0, innerWidth])
    .padding(0.4);

  const yScale = d3.scaleLinear().domain([0, maxValue]).range([innerHeight, 0]);

  // Color scale
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(['USA', 'URSS'])
    .range(['#3b82f6', '#ef4444']);

  const alternateColorScale = d3
    .scaleOrdinal<string>()
    .domain(['USA', 'URSS'])
    .range(['#60a5fa', '#f87171']);

  // Calculate previous and new launches
  const currentIndex = allData.findIndex(d => d.year === currentData.year);
  const prevData = currentIndex > 0 ? allData[currentIndex - 1] : { year: 0, USA: 0, USSR: 0 };

  const barData = [
    { 
      country: 'USA', 
      prev: prevData.USA, 
      new: currentData.USA - prevData.USA, 
      total: currentData.USA 
    },
    { 
      country: 'URSS', 
      prev: prevData.USSR, 
      new: currentData.USSR - prevData.USSR, 
      total: currentData.USSR 
    },
  ];

  // Create tooltip
  let tooltip = d3.select('body').select<HTMLDivElement>('.chart-tooltip');
  if (tooltip.empty()) {
    tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('position', 'absolute')
      .style('padding', '8px 12px')
      .style('background', 'rgba(0, 0, 0, 0.85)')
      .style('color', '#fff')
      .style('border-radius', '6px')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .style('opacity', '0')
      .style('transition', 'opacity 0.2s ease')
      .style('z-index', '1000')
      .style('border', '1px solid rgba(255, 255, 255, 0.2)');
  }

  const groups = g.selectAll('.country-group')
    .data(barData)
    .enter()
    .append('g')
    .attr('class', 'country-group')
    .attr('transform', d => `translate(${xScale(d.country) || 0}, 0)`);

  // Draw Previous Total (Bottom part)
  groups.append('rect')
    .attr('class', 'bar-prev')
    .attr('y', d => yScale(d.prev))
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerHeight - yScale(d.prev))
    .attr('fill', d => colorScale(d.country))
    .style('opacity', 1); // Solid for history

  // Draw New Launches (Top part)
  groups.append('path')
    .attr('class', 'bar-new')
    .attr('d', d => {
      const x = 0;
      const y = yScale(d.total);
      const w = xScale.bandwidth();
      const h = Math.max(0, yScale(d.prev) - yScale(d.total));
      const r = 4;
      const effR = Math.min(r, h, w / 2);

      if (h <= 0) return '';

      // Path with rounded top corners and square bottom corners
      return `
        M ${x} ${y + h}
        L ${x} ${y + effR}
        Q ${x} ${y} ${x + effR} ${y}
        L ${x + w - effR} ${y}
        Q ${x + w} ${y} ${x + w} ${y + effR}
        L ${x + w} ${y + h}
        Z
      `;
    })
    .attr('fill', d => alternateColorScale(d.country))
    .style('opacity', 1); // Faded for new launches

  // Add invisible rect for tooltip interaction covering the whole bar space
  groups.append('rect')
    .attr('class', 'interaction-layer')
    .attr('y', d => yScale(d.total)) // Top of the stack
    .attr('width', xScale.bandwidth())
    .attr('height', d => innerHeight - yScale(d.total))
    .attr('fill', 'transparent')
    .style('cursor', 'pointer')
    .on('mouseover', function (_, d) {
      tooltip
        .style('opacity', '1')
        .html(`
          <span style="color: ${colorScale(d.country)}">${d.country}</span><br/>
          Total: ${d.total}<br/>
          Este año: ${d.new}
        `);
    })
    .on('mousemove', function (event) {
      tooltip
        .style('left', event.pageX + 15 + 'px')
        .style('top', event.pageY - 10 + 'px');
    })
    .on('mouseout', function () {
      tooltip.style('opacity', '0');
    });

  // X axis
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('fill', '#fff')
    .attr('font-size', '18px')
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

  // Add crown on USA bar from 1969 onwards (Moon landing year)
  if (currentData.year >= 1969) {
    const crownSize = 80;
    const usaBarX = xScale('USA') || 0;
    const usaBarY = yScale(currentData.USA);
    
    g.append('image')
      .attr('class', 'usa-crown')
      .attr('href', '/crown.png')
      .attr('x', usaBarX + xScale.bandwidth() / 2 - crownSize / 2)
      .attr('y', usaBarY - crownSize + 15)
      .attr('width', crownSize)
      .attr('height', crownSize);
  }
}
