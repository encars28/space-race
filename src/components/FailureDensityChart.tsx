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
  onScrollNext: () => void;
  onScrollBack: () => void;
}

export default function FailureDensityChart({
  missions,
  onScrollNext,
  onScrollBack,
}: FailureDensityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTransitionedRef = useRef(false);
  const scrollUpCountRef = useRef(0);
  const [animationProgress, setAnimationProgress] = useState(0);
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

  // Handle scroll down to go to next chart
  useEffect(() => {
    const handleScroll = () => {
      if (hasTransitionedRef.current || isLockedRef.current) return;

      const scrollTop = window.scrollY;
      const threshold = window.innerHeight * 0.3; // Require scrolling 30% of the viewport height (approx 300px on desktop)
      
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
    if (!svgRef.current || missions.length === 0) return;

    const data = processFailureData(missions);
    drawFailureDensityChart(svgRef.current, data, animationProgress);
  }, [missions, animationProgress]);

  if (missions.length === 0) {
    // return <div className="loading">Cargando datos...</div>;
    return <div></div>;
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
