import { useEffect, useRef, useState } from 'react';
import {
  drawFailureDensityChart,
  processFailureData,
} from '../utils/drawFailureDensityChart';
import type { MissionData } from '../utils/drawDotMatrixChart';
import ScrollHintArrow from './ScrollHintArrow';
import './FailureDensityChart.css';

interface FailureDensityChartProps {
  missions: MissionData[];
  onScrollStart: () => void;
}

export default function FailureDensityChart({
  missions,
  onScrollStart,
}: FailureDensityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animate the chart on mount
  useEffect(() => {
    const duration = 1500; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

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

    const data = processFailureData(missions);
    drawFailureDensityChart(svgRef.current, data, animationProgress);
  }, [missions, animationProgress]);

  if (missions.length === 0) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="failure-density-container" ref={containerRef}>
      <div className="fd-chart-wrapper">
        <div className="fd-chart-content">
          <h2 className="fd-chart-title">
            Lanzamientos fallidos por año
          </h2>
          <svg ref={svgRef}></svg>
        </div>
      </div>

      {/* Small scroll spacer to enable scroll detection */}
      <div className="fd-scroll-spacer" />

      <ScrollHintArrow />
    </div>
  );
}
