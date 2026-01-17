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
  onScrollNext: () => void;
  onScrollBack: () => void;
}

export default function SuccessFailureChart({
  missions,
  onScrollNext,
  onScrollBack,
}: SuccessFailureChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hasTransitionedRef = useRef(false);
  const scrollUpCountRef = useRef(0);

  // Handle scroll down to go to next chart
  useEffect(() => {
    const handleScroll = () => {
      if (hasTransitionedRef.current) return;

      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        hasTransitionedRef.current = true;
        onScrollNext();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScrollNext]);

  // Handle wheel event to detect scroll-up at top (for going back)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (hasTransitionedRef.current) return;
      
      // Check if we're at the top and trying to scroll up
      if (window.scrollY <= 0 && e.deltaY < 0) {
        scrollUpCountRef.current++;
        // Require multiple scroll-up attempts to prevent accidental triggers
        if (scrollUpCountRef.current >= 3) {
          hasTransitionedRef.current = true;
          onScrollBack();
        }
      } else {
        scrollUpCountRef.current = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [onScrollBack]);

  // Draw the chart
  useEffect(() => {
    if (!svgRef.current || missions.length === 0) return;

    const data = processSuccessFailureData(missions);
    drawDotMatrixChart(svgRef.current, data);
  }, [missions]);

  if (missions.length === 0) {
    // return <div className="loading">Loading data...</div>;
    return <div></div>;
  }

  return (
    <div className="success-failure-container">
      <div className="sf-chart-wrapper">
        <div className="sf-chart-content">
          <h2 className="sf-chart-title">Porcentaje de lanzamientos fallidos y con éxito</h2>
          <div className="sf-chart-subtitle">Cada punto es un 1%</div>
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
