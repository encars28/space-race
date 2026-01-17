import * as d3 from 'd3';

export interface DataPoint {
  year: number;
  USA: number;
  USSR: number;
}

export function drawCumulativeLineChart(
  svgElement: SVGSVGElement,
  data: DataPoint[],
  animationProgress: number = 1
): void {
  const svg = d3.select(svgElement);
  
  // Clear previous content
  svg.selectAll('*').remove();

  // Setup dimensions
  const width = 800;
  const height = 500;
  const margin = { top: 60, right: 100, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('width', '100%')
    .style('height', 'auto')
    .style('max-height', '70vh');

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  const years = data.map(d => d.year);
  const maxLaunches = Math.max(
    ...data.map(d => Math.max(d.USA, d.USSR))
  );

  const xScale = d3.scaleLinear()
    .domain([d3.min(years) || 1957, d3.max(years) || 1975])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, maxLaunches * 1.1]) // 10% padding
    .range([innerHeight, 0]);

  // Axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d => String(d))
    .ticks(10);
  
  const yAxis = d3.axisLeft(yScale)
    .ticks(5);

  // Add grid lines
  g.append('g')
    .attr('class', 'grid-lines')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(
      d3.axisBottom(xScale)
        .ticks(10)
        .tickSize(-innerHeight)
        .tickFormat(() => '')
    )
    .attr('stroke-opacity', 0.1);

  g.append('g')
    .attr('class', 'grid-lines')
    .call(
      d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
    )
    .attr('stroke-opacity', 0.1);

  // Style axis lines
  g.selectAll('.grid-lines line')
    .attr('stroke', 'rgba(255,255,255,0.1)');
  g.selectAll('.grid-lines path')
    .attr('display', 'none');

  // Draw axes
  const xAxisGroup = g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis);

  const yAxisGroup = g.append('g')
    .call(yAxis);

  // Style axes text
  xAxisGroup.selectAll('text')
    .attr('fill', '#ffffff')
    .attr('font-size', '12px');
  yAxisGroup.selectAll('text')
    .attr('fill', '#ffffff')
    .attr('font-size', '12px');
  
  xAxisGroup.select('.domain').attr('stroke', '#ffffff');
  yAxisGroup.select('.domain').attr('stroke', '#ffffff');

  // Line generators
  const lineGeneratorUSA = d3.line<DataPoint>()
    .x(d => xScale(d.year))
    .y(d => yScale(d.USA))
    .curve(d3.curveMonotoneX);

  const lineGeneratorUSSR = d3.line<DataPoint>()
    .x(d => xScale(d.year))
    .y(d => yScale(d.USSR))
    .curve(d3.curveMonotoneX);

  // Draw lines
  // Create clipping path for animation
//   const clipWidth = innerWidth * animationProgress;
  
//   const clipPath = g.append('clipPath')
//     .attr('id', 'chart-clip')
//     .append('rect')
//     .attr('width', clipWidth)
//     .attr('height', height) // Cover full height including margins effectively, but starting at 0,0 relative to g
//     .attr('x', 0)
//     .attr('y', -margin.top);

  const linesGroup = g.append('g')
    .attr('clip-path', 'url(#chart-clip)');

  // USA Line
  linesGroup.append('path')
    .datum(data)
    .attr('d', lineGeneratorUSA)
    .attr('fill', 'none')
    .attr('stroke', '#3b82f6') // Blue
    .attr('stroke-width', 4)
    .attr('stroke-linecap', 'round');

  // USSR Line
  linesGroup.append('path')
    .datum(data)
    .attr('d', lineGeneratorUSSR)
    .attr('fill', 'none')
    .attr('stroke', '#ef4444') // Red
    .attr('stroke-width', 4)
    .attr('stroke-linecap', 'round');

  // Add final dots if animation is complete or near complete
  if (animationProgress > 0.99) {
    const lastPoint = data[data.length - 1];
    
    // USA Dot
    g.append('circle')
      .attr('cx', xScale(lastPoint.year))
      .attr('cy', yScale(lastPoint.USA))
      .attr('r', 6)
      .attr('fill', '#3b82f6');

    // USSR Dot
    g.append('circle')
      .attr('cx', xScale(lastPoint.year))
      .attr('cy', yScale(lastPoint.USSR))
      .attr('r', 6)
      .attr('fill', '#ef4444');
  }

  // Titles
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .attr('font-size', '20px')
    .attr('font-weight', 'bold')
    .text('Lanzamientos durante la carrera espacial');

  // Legend
//   const legend = svg.append('g')
//     .attr('transform', `translate(${width - margin.right - 50}, ${margin.top + 20})`);

//   // USA Legend
//   legend.append('rect')
//     .attr('x', 0)
//     .attr('y', 0)
//     .attr('width', 15)
//     .attr('height', 15)
//     .attr('fill', '#3b82f6');
  
//   legend.append('text')
//     .attr('x', 20)
//     .attr('y', 12)
//     .text('USA')
//     .attr('fill', 'white')
//     .attr('font-size', '14px');

//   // USSR Legend
//   legend.append('rect')
//     .attr('x', 0)
//     .attr('y', 25)
//     .attr('width', 15)
//     .attr('height', 15)
//     .attr('fill', '#ef4444');
  
//   legend.append('text')
//     .attr('x', 20)
//     .attr('y', 37)
//     .text('URSS')
//     .attr('fill', 'white')
//     .attr('font-size', '14px');

  // Tooltip interaction (only when animation is finished)
  if (animationProgress > 0.99) {
    // Use a body-attached tooltip like the failure density chart for consistent appearance
    const tooltip = d3
      .select('body')
      .selectAll('.fd-tooltip')
      .data([null])
      .join('div')
      .attr('class', 'fd-tooltip')
      .style('position', 'fixed')
      .style('pointer-events', 'none')
      .style('background', 'rgba(15, 15, 20, 0.95)')
      .style('border', '1px solid rgba(255, 255, 255, 0.2)')
      .style('border-radius', '8px')
      .style('padding', '10px 14px')
      .style('font-size', '13px')
      .style('color', '#fff')
      .style('box-shadow', '0 4px 14px rgba(0, 0, 0, 0.4)')
      .style('opacity', 0)
      .style('z-index', 1000);

    // Vertical hover line
    const hoverLine = g
      .append('line')
      .attr('class', 'hover-line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', 'rgba(255, 255, 255, 0.3)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .style('opacity', 0);

    // Hover dots
    const usaDot = g
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#3b82f6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('opacity', 0);

    const ussrDot = g
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#ef4444')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('opacity', 0);

    // Invisible overlay for mouse events
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event);
        const x0 = xScale.invert(mx);

        // Find closest data point
        const index = d3.bisector((d: DataPoint) => d.year).center(data, x0);
        const d = data[index];

        if (!d) {
          tooltip.style('opacity', 0);
          hoverLine.style('opacity', 0);
          usaDot.style('opacity', 0);
          ussrDot.style('opacity', 0);
          return;
        }

        // Position hover line
        const xPos = xScale(d.year);
        hoverLine.attr('x1', xPos).attr('x2', xPos).style('opacity', 1);

        // Position dots
        usaDot
          .attr('cx', xPos)
          .attr('cy', yScale(d.USA))
          .style('opacity', 1);

        ussrDot
          .attr('cx', xPos)
          .attr('cy', yScale(d.USSR))
          .style('opacity', 1);

        // Update tooltip content and position
        tooltip
          .html(
            `<div style="font-weight: 600; margin-bottom: 6px; font-size: 14px;">${d.year}</div>
             <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
               <span style="width: 10px; height: 10px; background: #3b82f6; border-radius: 2px;"></span>
               <span>USA: <strong>${d.USA}</strong></span>
             </div>
             <div style="display: flex; align-items: center; gap: 8px;">
               <span style="width: 10px; height: 10px; background: #ef4444; border-radius: 2px;"></span>
               <span>URSS: <strong>${d.USSR}</strong></span>
             </div>`
          )
          .style('left', `${event.clientX + 15}px`)
          .style('top', `${event.clientY - 10}px`)
          .style('opacity', 1);
      })
      .on('mouseleave', function () {
        tooltip.style('opacity', 0);
        hoverLine.style('opacity', 0);
        usaDot.style('opacity', 0);
        ussrDot.style('opacity', 0);
      });
  }
}
