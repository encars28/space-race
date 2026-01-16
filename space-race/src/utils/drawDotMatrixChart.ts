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

// Each dot represents this many launches
const LAUNCHES_PER_DOT = 5;

function calculateDots(count: number): number {
  return Math.ceil(count / LAUNCHES_PER_DOT);
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

  // Calculate dots for each category
  const usaSuccessDots = calculateDots(data.usaSuccess);
  const usaFailureDots = calculateDots(data.usaFailure);
  const ussrSuccessDots = calculateDots(data.ussrSuccess);
  const ussrFailureDots = calculateDots(data.ussrFailure);

  // Calculate grid dimensions
  const dotsPerRow = Math.floor(chartWidth / dotSpacing);

  // Draw function for a grid of dots
  function drawDotGrid(
    container: d3.Selection<SVGGElement, unknown, null, undefined>,
    successCount: number,
    failureCount: number,
    successColor: string,
    offsetX: number
  ) {
    const totalDots = successCount + failureCount;
    const dots: { x: number; y: number; isSuccess: boolean }[] = [];

    for (let i = 0; i < totalDots; i++) {
      const col = i % dotsPerRow;
      const row = Math.floor(i / dotsPerRow);
      dots.push({
        x: offsetX + col * dotSpacing + dotRadius,
        y: row * dotSpacing + dotRadius,
        isSuccess: i < successCount, // First dots are successes
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
      .attr('r', dotRadius)
      .attr('fill', (d) => (d.isSuccess ? successColor : failureColor))
      .attr('opacity', (d) => (d.isSuccess ? 1 : 0.7))
      .style('filter', (d) =>
        d.isSuccess ? `drop-shadow(0 0 3px ${successColor})` : 'none'
      );
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

  drawDotGrid(usaGroup, usaSuccessDots, usaFailureDots, usaColor, 0);

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

  drawDotGrid(ussrGroup, ussrSuccessDots, ussrFailureDots, ussrColor, 0);

  // Legend at bottom
  const legendY = innerHeight + 30;
  const legendG = g.append('g').attr('transform', `translate(${innerWidth / 2}, ${legendY})`);

  // Success legend
  legendG
    .append('circle')
    .attr('cx', -120)
    .attr('cy', 0)
    .attr('r', 8)
    .attr('fill', '#fff');

  legendG
    .append('text')
    .attr('x', -105)
    .attr('y', 5)
    .attr('fill', '#fff')
    .attr('font-size', '14px')
    .text('Éxito');

  // Failure legend
  legendG
    .append('circle')
    .attr('cx', 20)
    .attr('cy', 0)
    .attr('r', 8)
    .attr('fill', failureColor)
    .attr('opacity', 0.7);

  legendG
    .append('text')
    .attr('x', 35)
    .attr('y', 5)
    .attr('fill', '#fff')
    .attr('font-size', '14px')
    .text('Fallo');

  // Note about dots representing multiple launches
  legendG
    .append('text')
    .attr('x', 0)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .attr('fill', '#888')
    .attr('font-size', '12px')
    .text(`Cada punto representa ${LAUNCHES_PER_DOT} lanzamientos`);

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
          <div style="text-align: center; margin-bottom: 6px;"><strong style="color: white">USA</strong></div>
          <div>✓ Éxitos: <strong>${data.usaSuccess}</strong></div>
          <div>✗ Fallos: <strong>${data.usaFailure}</strong></div>
          <div style="margin-top: 6px; color: #10b981;">Tasa: ${successRate}%</div>
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
          <div style="text-align: center; margin-bottom: 6px;"><strong style="color: white">URSS</strong></div>
          <div>✓ Éxitos: <strong>${data.ussrSuccess}</strong></div>
          <div>✗ Fallos: <strong>${data.ussrFailure}</strong></div>
          <div style="margin-top: 6px; color: #10b981;">Tasa: ${successRate}%</div>
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
