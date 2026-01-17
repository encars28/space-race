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
  const hasDrawnRef = useRef(false);
  const isLockedRef = useRef(true);

  // Unlock scroll after a delay to prevent accidental skips
  useEffect(() => {
    // Lock for 1 second to ensure user sees the chart
    const timer = setTimeout(() => {
      isLockedRef.current = false;
      
      // Check if we are already past threshold (e.g. user scrolled during lock)
      if (window.scrollY > window.innerHeight * 0.3 && !hasTransitionedRef.current) {
        hasTransitionedRef.current = true;
        onScrollNext();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [onScrollNext]);

  // Handle scroll down to go to next chart
  useEffect(() => {
    const handleScroll = () => {
      if (hasTransitionedRef.current || isLockedRef.current) return;

      const scrollTop = window.scrollY;
      const threshold = window.innerHeight * 0.3; // Require scrolling 30% of the viewport height

      if (scrollTop > threshold) {
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
      if (hasTransitionedRef.current || isLockedRef.current) return;
      
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
    const svg = svgRef.current;
    if (!svg || missions.length === 0 || hasDrawnRef.current) return;

    const data = processSuccessFailureData(missions);

    // Small delay to ensure DOM is ready and React Strict Mode double-render is complete
    const timeoutId = setTimeout(() => {
      if (svgRef.current && !hasDrawnRef.current) {
        hasDrawnRef.current = true;
        drawDotMatrixChart(svgRef.current, data);
      }
    }, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [missions]);

  if (missions.length === 0) {
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
      </div>

      {/* Small scroll spacer to enable scroll detection */}
      <div className="sf-scroll-spacer" />
      
      <ScrollHintArrow />
    </div>
  );
}
