import * as d3 from 'd3';

export interface FailureData {
  year: number;
  usaFailures: number;
  ussrFailures: number;
}

/**
 * Process mission data to get failure counts per year
 */
export function processFailureData(
  missions: { Year: number; Superpower: string; Mission_Status: string }[]
): FailureData[] {
  // Get all years in range
  const years = Array.from({ length: 1975 - 1957 + 1 }, (_, i) => 1957 + i);

  return years.map((year) => {
    const yearMissions = missions.filter((m) => m.Year === year);
    const usaFailures = yearMissions.filter(
      (m) => m.Superpower === 'USA' && m.Mission_Status !== 'Success'
    ).length;
    const ussrFailures = yearMissions.filter(
      (m) => m.Superpower === 'USSR' && m.Mission_Status !== 'Success'
    ).length;

    return { year, usaFailures, ussrFailures };
  });
}

/**
 * Draw a density/area chart showing launch failures over time for USA and USSR
 */
export function drawFailureDensityChart(
  svgElement: SVGSVGElement,
  data: FailureData[],
  animationProgress: number = 1 // 0 to 1 for progressive reveal
): void {
  const svg = d3.select(svgElement);
  const width = 900;
  const height = 400;
  const margin = { top: 40, right: 120, bottom: 60, left: 60 };

  svg.attr('width', width).attr('height', height);

  // Clear previous content
  svg.selectAll('*').remove();

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Colors
  const usaColor = '#3b82f6';
  const ussrColor = '#ef4444';

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain([1957, 1975])
    .range([0, innerWidth]);

  const maxFailures = Math.max(
    d3.max(data, (d) => d.usaFailures) || 0,
    d3.max(data, (d) => d.ussrFailures) || 0
  );

  const yScale = d3
    .scaleLinear()
    .domain([0, maxFailures + 2])
    .range([innerHeight, 0]);

  // Create area generators with curve for density effect
  const areaUSA = d3
    .area<FailureData>()
    .x((d) => xScale(d.year))
    .y0(innerHeight)
    .y1((d) => yScale(d.usaFailures))
    .curve(d3.curveCatmullRom.alpha(0.5));

  const areaUSSR = d3
    .area<FailureData>()
    .x((d) => xScale(d.year))
    .y0(innerHeight)
    .y1((d) => yScale(d.ussrFailures))
    .curve(d3.curveCatmullRom.alpha(0.5));

  // Create line generators for the top edge
  const lineUSA = d3
    .line<FailureData>()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.usaFailures))
    .curve(d3.curveCatmullRom.alpha(0.5));

  const lineUSSR = d3
    .line<FailureData>()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.ussrFailures))
    .curve(d3.curveCatmullRom.alpha(0.5));

  // Calculate how much data to show based on animation progress
  const visibleDataCount = Math.ceil(data.length * animationProgress);
  const visibleData = data.slice(0, visibleDataCount);

  // Draw USSR area (behind USA for layering)
  const ussrGradient = svg
    .append('defs')
    .append('linearGradient')
    .attr('id', 'ussrGradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');

  ussrGradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', ussrColor)
    .attr('stop-opacity', 0.6);

  ussrGradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', ussrColor)
    .attr('stop-opacity', 0.1);

  g.append('path')
    .datum(visibleData)
    .attr('class', 'area-ussr')
    .attr('fill', 'url(#ussrGradient)')
    .attr('d', areaUSSR);

  g.append('path')
    .datum(visibleData)
    .attr('class', 'line-ussr')
    .attr('fill', 'none')
    .attr('stroke', ussrColor)
    .attr('stroke-width', 2.5)
    .attr('d', lineUSSR);

  // Draw USA area
  const usaGradient = svg
    .select('defs')
    .append('linearGradient')
    .attr('id', 'usaGradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');

  usaGradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', usaColor)
    .attr('stop-opacity', 0.6);

  usaGradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', usaColor)
    .attr('stop-opacity', 0.1);

  g.append('path')
    .datum(visibleData)
    .attr('class', 'area-usa')
    .attr('fill', 'url(#usaGradient)')
    .attr('d', areaUSA);

  g.append('path')
    .datum(visibleData)
    .attr('class', 'line-usa')
    .attr('fill', 'none')
    .attr('stroke', usaColor)
    .attr('stroke-width', 2.5)
    .attr('d', lineUSA);

  // Draw axes
  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat((d) => String(d))
    .ticks(10);

  const yAxis = d3.axisLeft(yScale).ticks(6);

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(xAxis)
    .selectAll('text')
    .style('fill', '#fff')
    .style('font-size', '14px');

  g.selectAll('.x-axis path, .x-axis line').style('stroke', '#52525b');

  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .selectAll('text')
    .style('fill', '#fff')
    .style('font-size', '14px');

  g.selectAll('.y-axis path, .y-axis line').style('stroke', '#52525b');

  // Add gridlines
  g.append('g')
    .attr('class', 'grid')
    .selectAll('line')
    .data(yScale.ticks(6))
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', (d) => yScale(d))
    .attr('y2', (d) => yScale(d))
    .attr('stroke', 'rgba(255, 255, 255, 0.23)')
    .attr('stroke-dasharray', '3,3');

  // Axis labels
  g.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 45)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '14px')
    .text('Año');

  g.append('text')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -45)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '14px')
    .text('Lanzamientos fallidos');

  // Legend
  const legend = g
    .append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${innerWidth + 20}, 20)`);

  // USA legend
  legend
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 20)
    .attr('height', 12)
    .attr('fill', usaColor)
    .attr('opacity', 0.7)
    .attr('rx', 2);

  legend
    .append('text')
    .attr('x', 28)
    .attr('y', 10)
    .attr('fill', '#fff')
    .attr('font-size', '14px')
    .text('EEUU');

  // USSR legend
  legend
    .append('rect')
    .attr('x', 0)
    .attr('y', 30)
    .attr('width', 20)
    .attr('height', 12)
    .attr('fill', ussrColor)
    .attr('opacity', 0.7)
    .attr('rx', 2);

  legend
    .append('text')
    .attr('x', 28)
    .attr('y', 40)
    .attr('fill', '#fff')
    .attr('font-size', '14px')
    .text('URSS');

  // Create tooltip
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
    .attr('fill', usaColor)
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .style('opacity', 0);

  const ussrDot = g
    .append('circle')
    .attr('r', 6)
    .attr('fill', ussrColor)
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .style('opacity', 0);

  // Invisible overlay for mouse events
  g.append('rect')
    .attr('class', 'overlay')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'transparent')
    .on('mousemove', function (event) {
      const [mouseX] = d3.pointer(event);
      const year = Math.round(xScale.invert(mouseX));

      // Find data for this year
      const yearData = data.find((d) => d.year === year);
      if (!yearData || year < 1957 || year > 1975) {
        tooltip.style('opacity', 0);
        hoverLine.style('opacity', 0);
        usaDot.style('opacity', 0);
        ussrDot.style('opacity', 0);
        return;
      }

      // Position hover line
      const xPos = xScale(year);
      hoverLine.attr('x1', xPos).attr('x2', xPos).style('opacity', 1);

      // Position dots
      usaDot
        .attr('cx', xPos)
        .attr('cy', yScale(yearData.usaFailures))
        .style('opacity', 1);

      ussrDot
        .attr('cx', xPos)
        .attr('cy', yScale(yearData.ussrFailures))
        .style('opacity', 1);

      // Update tooltip content and position
      tooltip
        .html(
          `<div style="font-weight: 600; margin-bottom: 6px; font-size: 14px;">${year}</div>
           <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
             <span style="width: 10px; height: 10px; background: ${usaColor}; border-radius: 2px;"></span>
             <span>EEUU: <strong>${yearData.usaFailures}</strong> ${yearData.usaFailures === 1 ? 'fallo' : 'fallos'}</span>
           </div>
           <div style="display: flex; align-items: center; gap: 8px;">
             <span style="width: 10px; height: 10px; background: ${ussrColor}; border-radius: 2px;"></span>
             <span>URSS: <strong>${yearData.ussrFailures}</strong> ${yearData.ussrFailures === 1 ? 'fallo' : 'fallos'}</span>
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
