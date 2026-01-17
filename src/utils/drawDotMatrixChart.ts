import * as d3 from 'd3';

export interface MissionData {
  Year: number;
  Superpower: string;
  Mission_Status: string;
}

export interface DotMatrixData {
  usaSuccess: number;
  usaFailure: number;
  ussrSuccess: number;
  ussrFailure: number;
}

// Total dots per chart (representing 100%)
const TOTAL_DOTS = 100;

function calculatePercentageDots(success: number, failure: number): { successDots: number, failureDots: number } {
  const total = success + failure;
  if (total === 0) return { successDots: 0, failureDots: 0 };
  
  const successRate = success / total;
  const successDots = Math.round(successRate * TOTAL_DOTS);
  const failureDots = TOTAL_DOTS - successDots;
  
  return { successDots, failureDots };
}

export function drawDotMatrixChart(
  svgElement: SVGSVGElement,
  data: DotMatrixData
): void {
  const svg = d3.select(svgElement);
  const width = 800;
  const height = 450;
  const margin = { top: 60, right: 40, bottom: 80, left: 40 };

  svg.attr('width', width).attr('height', height);

  // Clear previous content
  svg.selectAll('*').remove();

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Split the space between USA and USSR
  const chartWidth = (innerWidth - 60) / 2; // 60px gap between charts

  // Colors
  const usaColor = '#3b82f6';
  const ussrColor = '#ef4444';
  const failureColor = '#6b7280'; // gray-500

  // Dot settings
  const dotRadius = 8;
  const dotSpacing = 22;

  // Calculate dots for each category (based on percentage)
  const usaDots = calculatePercentageDots(data.usaSuccess, data.usaFailure);
  const ussrDots = calculatePercentageDots(data.ussrSuccess, data.ussrFailure);

  // Calculate grid dimensions
  const dotsPerRow = 10; // Fixed 10x10 grid for 100 dots

  // Center the grid within the chart width
  const gridWidth = dotsPerRow * dotSpacing;
  const gridOffsetX = (chartWidth - gridWidth) / 2;

  // Draw function for a grid of dots with animation
  function drawDotGrid(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    successCount: number,
    failureCount: number,
    successColor: string,
    offsetX: number,
    animationDelay: number = 0 // Base delay for staggering between USA and USSR
  ) {
    const totalDots = successCount + failureCount;
    const dots: { x: number; y: number; isSuccess: boolean; index: number }[] = [];

    for (let i = 0; i < totalDots; i++) {
      const col = i % dotsPerRow;
      const row = Math.floor(i / dotsPerRow);
      dots.push({
        x: offsetX + gridOffsetX + col * dotSpacing + dotRadius,
        y: row * dotSpacing + dotRadius,
        isSuccess: i < successCount, // First dots are successes
        index: i,
      });
    }

    container
      .selectAll('.dot')
      .data(dots)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 0) // Start with radius 0
      .attr('fill', (d) => (d.isSuccess ? successColor : failureColor))
      .attr('opacity', 0) // Start invisible
      .style('filter', (d) =>
        d.isSuccess ? `drop-shadow(0 0 3px ${successColor})` : 'none'
      )
      .transition()
      .duration(150)
      .delay((d) => animationDelay + d.index * 5) // Stagger each dot by 5ms
      .ease(d3.easeBackOut.overshoot(1.5))
      .attr('r', dotRadius)
      .attr('opacity', (d) => (d.isSuccess ? 1 : 0.7));
  }

  // USA section
  const usaGroup = g.append('g').attr('class', 'usa-section');

  // USA title
  usaGroup
    .append('text')
    .attr('x', chartWidth / 2)
    .attr('y', -25)
    .attr('text-anchor', 'middle')
    .attr('fill', "#fff")
    .attr('font-size', '22px')
    // .attr('font-weight', 'bold')
    .text('USA');

  drawDotGrid(usaGroup, usaDots.successDots, usaDots.failureDots, usaColor, 0, 0);

  // USSR section
  const ussrGroup = g
    .append('g')
    .attr('class', 'ussr-section')
    .attr('transform', `translate(${chartWidth + 60}, 0)`);

  // USSR title
  ussrGroup
    .append('text')
    .attr('x', chartWidth / 2)
    .attr('y', -25)
    .attr('text-anchor', 'middle')
    .attr('fill', "#fff")
    .attr('font-size', '22px')
    // .attr('font-weight', 'bold')
    .text('URSS');

  drawDotGrid(ussrGroup, ussrDots.successDots, ussrDots.failureDots, ussrColor, 0, 100);

  // Define gradient for success legend
  const defs = svg.append('defs');
  const gradient = defs.append('linearGradient')
    .attr('id', 'success-gradient')
    .attr('x1', '0%')
    .attr('x2', '100%')
    .attr('y1', '0%')
    .attr('y2', '0%');
  
  gradient.append('stop')
    .attr('offset', '50%')
    .attr('stop-color', usaColor);
  
  gradient.append('stop')
    .attr('offset', '50%')
    .attr('stop-color', ussrColor);

  // Legend at bottom (centered, tighter spacing)
  const legendY = innerHeight - 10; // pull slightly closer to chart
  const legendG = g.append('g').attr('transform', `translate(${innerWidth / 2}, ${legendY})`);

  // Success group
  const successGroup = legendG.append('g').attr('class', 'legend-success').attr('transform', 'translate(-36, 0)');
  successGroup
    .append('circle')
    .attr('cx', -40)
    .attr('cy', 0)
    .attr('r', 8)
    .attr('fill', 'url(#success-gradient)');

  successGroup
    .append('text')
    .attr('x', -20)
    .attr('y', 5)
    .attr('fill', '#fff')
    .attr('font-size', '14px')
    .text('Éxito');

  // Failure group
  const failureGroup = legendG.append('g').attr('class', 'legend-failure').attr('transform', 'translate(36, 0)');
  failureGroup
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 8)
    .attr('fill', failureColor)
    .attr('opacity', 0.7);

  failureGroup
    .append('text')
    .attr('x', 14)
    .attr('y', 5)
    .attr('fill', '#fff')
    .attr('font-size', '14px')
    .text('Fallo');

  // Create tooltip
  let tooltip = d3.select('body').select<HTMLDivElement>('.dot-matrix-tooltip');
  if (tooltip.empty()) {
    tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'dot-matrix-tooltip')
      .style('position', 'absolute')
      .style('padding', '10px 14px')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', '#fff')
      .style('border-radius', '8px')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('opacity', '0')
      .style('transition', 'opacity 0.2s ease')
      .style('z-index', '1000')
      .style('border', '1px solid rgba(255, 255, 255, 0.2)');
  }

  // Add stats on hover for each section
  usaGroup
    .append('rect')
    .attr('x', 0)
    .attr('y', -40)
    .attr('width', chartWidth)
    .attr('height', innerHeight + 40)
    .attr('fill', 'transparent')
    .style('cursor', 'pointer')
    .on('mouseover', function () {
      const successRate = ((data.usaSuccess / (data.usaSuccess + data.usaFailure)) * 100).toFixed(1);
      tooltip
        .style('opacity', '1')
        .html(`
          <div style="text-align: center; margin-bottom: 6px;"><strong style="color: ${usaColor}">USA</strong></div>
          <div><strong>Éxitos:</strong> ${data.usaSuccess}</div>
          <div><strong>Fallos:</strong> ${data.usaFailure}</div>
          <div style="margin-top: 6px; color: #10b981;">Porcentaje de éxito: ${successRate}%</div>
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

  ussrGroup
    .append('rect')
    .attr('x', 0)
    .attr('y', -40)
    .attr('width', chartWidth)
    .attr('height', innerHeight + 40)
    .attr('fill', 'transparent')
    .style('cursor', 'pointer')
    .on('mouseover', function () {
      const successRate = ((data.ussrSuccess / (data.ussrSuccess + data.ussrFailure)) * 100).toFixed(1);
      tooltip
        .style('opacity', '1')
        .html(`
          <div style="text-align: center; margin-bottom: 6px;"><strong style="color: ${ussrColor}">URSS</strong></div>
          <div><strong>Éxitos:</strong> ${data.ussrSuccess}</div>
          <div><strong>Fallos:</strong> ${data.ussrFailure}</div>
          <div style="margin-top: 6px; color: #10b981;">Porcentaje de éxito: ${successRate}%</div>
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
}

export function processSuccessFailureData(missions: MissionData[]): DotMatrixData {
  const usaMissions = missions.filter((m) => m.Superpower === 'USA');
  const ussrMissions = missions.filter((m) => m.Superpower === 'USSR');

  // Count successes and failures (Partial Failure, Prelaunch Failure count as failures)
  const usaSuccess = usaMissions.filter((m) => m.Mission_Status === 'Success').length;
  const usaFailure = usaMissions.filter((m) => m.Mission_Status !== 'Success').length;
  const ussrSuccess = ussrMissions.filter((m) => m.Mission_Status === 'Success').length;
  const ussrFailure = ussrMissions.filter((m) => m.Mission_Status !== 'Success').length;

  return {
    usaSuccess,
    usaFailure,
    ussrSuccess,
    ussrFailure,
  };
}
