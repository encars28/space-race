import { useEffect, useRef } from 'react';
import {
  drawDotMatrixChart,
  processSuccessFailureData,
} from '../utils/drawDotMatrixChart';
import type { MissionData } from '../utils/drawDotMatrixChart';
import ScrollHintArrow from './ScrollHintArrow';
import './SuccessFailureChart.css';

interface SuccessFailureChartProps {
  missions: MissionData[];
  onScrollStart: () => void;
}

export default function SuccessFailureChart({
  missions,
  onScrollStart,
}: SuccessFailureChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hasScrolledRef = useRef(false);

  // Handle scroll to trigger transition to next chart
  useEffect(() => {
    const handleScroll = () => {
      if (hasScrolledRef.current) return;

      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        hasScrolledRef.current = true;
        onScrollStart();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScrollStart]);

  // Draw the chart
  useEffect(() => {
    if (!svgRef.current || missions.length === 0) return;

    const data = processSuccessFailureData(missions);
    drawDotMatrixChart(svgRef.current, data);
  }, [missions]);

  if (missions.length === 0) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="success-failure-container">
      <div className="sf-chart-wrapper">
        <div className="sf-chart-content">
          <h2 className="sf-chart-title">Número de lanzamientos fallidos y con éxito</h2>
          <svg ref={svgRef}></svg>
        </div>
        {/* <div className="scroll-hint-sf">
          <span>↓ Scroll para continuar ↓</span>
        </div> */}
      </div>

      {/* Small scroll spacer to enable scroll detection */}
      <div className="sf-scroll-spacer" />
      
      <ScrollHintArrow />
    </div>
  );
}
