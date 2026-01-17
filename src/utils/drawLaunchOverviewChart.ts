import * as d3 from 'd3';

export interface LaunchOverviewData {
  usa: number;
  ussr: number;
  other: number;
  otherCountries: { country: string; count: number }[];
  total: number;
}

export interface MissionDataWithCountry {
  Year: number;
  Superpower: string;
  Mission_Status: string;
  Country?: string;
}

export function processLaunchOverviewData(
  missions: MissionDataWithCountry[]
): LaunchOverviewData {
  const usa = missions.filter((m) => m.Superpower === 'USA').length;
  const ussr = missions.filter((m) => m.Superpower === 'USSR').length;
  const otherMissions = missions.filter((m) => m.Superpower === 'Other');
  const other = otherMissions.length;

  // Group other missions by country
  const countryMap = new Map<string, number>();
  otherMissions.forEach((m) => {
    const country = m.Country || 'Unknown';
    countryMap.set(country, (countryMap.get(country) || 0) + 1);
  });

  const otherCountries = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  return {
    usa,
    ussr,
    other,
    otherCountries,
    total: usa + ussr + other,
  };
}

export function drawTotalLaunches(
  svgElement: SVGSVGElement,
  data: LaunchOverviewData,
  animationProgress: number = 1
): void {
  const svg = d3.select(svgElement);
  const width = 300;
  const height = 200;

  svg.attr('width', width).attr('height', height);
  svg.selectAll('*').remove();

  // Title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .text('Total de lanzamientos');

  // Big number with animation
  const displayTotal = Math.round(data.total * animationProgress);
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', height / 2 + 35)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '72px')
    .attr('font-weight', 'bold')
    .text(displayTotal.toLocaleString());
}

export function drawPieChart(
  svgElement: SVGSVGElement,
  data: LaunchOverviewData,
  animationProgress: number = 1,
  onHover: (
    segment: { label: string; value: number; color: string; details?: string } | null,
    event?: MouseEvent
  ) => void
): void {
  const svg = d3.select(svgElement);
  const width = 400;
  const height = 350;
  const radius = Math.min(width, height) / 2 - 50;

  svg.attr('width', width).attr('height', height);
  svg.selectAll('*').remove();

  const g = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2 + 20})`);

  // Title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .text('Distribución de lanzamientos');

  const pieData = [
    { label: 'EEUU', value: data.usa, color: '#3b82f6' },
    { label: 'USSR', value: data.ussr, color: '#ef4444' },
    { label: 'Otros', value: data.other, color: '#9ca3af' },
  ].filter((d) => d.value > 0);

  const pie = d3
    .pie<{ label: string; value: number; color: string }>()
    .value((d) => d.value)
    .sort(null);

  const arc = d3
    .arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
    .innerRadius(0)
    .outerRadius(radius);

  const hoverArc = d3
    .arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
    .innerRadius(0)
    .outerRadius(radius + 10);

  const labelArc = d3
    .arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 0.6);

  // Create animated arcs
  const animatedArc = d3
    .arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
    .innerRadius(0)
    .outerRadius(radius)
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.startAngle + (d.endAngle - d.startAngle) * animationProgress);

  const arcs = g
    .selectAll('.arc')
    .data(pie(pieData))
    .enter()
    .append('g')
    .attr('class', 'arc');

  arcs
    .append('path')
    .attr('d', animatedArc)
    .attr('fill', (d) => d.data.color)
    .attr('stroke', '#1a1a2e')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .on('mouseenter', function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('d', hoverArc(d) as string);

      let details: string | undefined;
      if (d.data.label === 'Otros' && data.otherCountries.length > 0) {
        details = data.otherCountries
          .map((c) => `${c.country}: ${c.count}`)
          .join('\n');
      }

      onHover(
        { label: d.data.label, value: d.data.value, color: d.data.color, details },
        event as unknown as MouseEvent
      );
    })
    .on('mouseleave', function (_, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('d', arc(d) as string);
      onHover(null);
    });

  // Labels with percentages (only show when animation is mostly complete)
  if (animationProgress > 0.8) {
    const labelOpacity = (animationProgress - 0.8) / 0.2;

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .style('opacity', labelOpacity)
      .style('pointer-events', 'none')
      .text((d) => {
        const percent = ((d.data.value / data.total) * 100).toFixed(1);
        return `${percent}%`;
      });
  }

  // Legend
  const legendY = height / 2 + radius + 30;
  const legendSpacing = 100;
  const legendStartX = width / 2 - legendSpacing;

  pieData.forEach((item, i) => {
    const x = legendStartX + i * legendSpacing;

    svg
      .append('rect')
      .attr('x', x - 40)
      .attr('y', legendY)
      .attr('width', 16)
      .attr('height', 16)
      .attr('fill', item.color)
      .attr('rx', 3);

    svg
      .append('text')
      .attr('x', x - 20)
      .attr('y', legendY + 12)
      .attr('fill', '#fff')
      .attr('font-size', '13px')
      .text(item.label);
  });
}
