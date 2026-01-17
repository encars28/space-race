import { useEffect, useRef, useState } from 'react';
import {
  drawTotalLaunches,
  drawPieChart,
  processLaunchOverviewData,
} from '../utils/drawLaunchOverviewChart';
import type { MissionDataWithCountry } from '../utils/drawLaunchOverviewChart';
import ScrollHintArrow from './ScrollHintArrow';
import './LaunchOverviewChart.css';

interface LaunchOverviewChartProps {
  missions: MissionDataWithCountry[];
  onScrollNext: () => void;
  onScrollBack: () => void;
}

interface TooltipData {
  label: string;
  value: number;
  color: string;
  details?: string;
  x: number;
  y: number;
}

export default function LaunchOverviewChart({
  missions,
  onScrollNext,
  onScrollBack,
}: LaunchOverviewChartProps) {
  const pictogramRef = useRef<SVGSVGElement>(null);
  const pieRef = useRef<SVGSVGElement>(null);
  const hasTransitionedRef = useRef(false);
  const scrollUpCountRef = useRef(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [data, setData] = useState<ReturnType<
    typeof processLaunchOverviewData
  > | null>(null);

  // Process data from props
  useEffect(() => {
    if (missions && missions.length > 0) {
      const processedData = processLaunchOverviewData(missions);
      setData(processedData);
    }
  }, [missions]);

  // Animate the chart on mount
  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
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

      if (window.scrollY <= 0 && e.deltaY < 0) {
        scrollUpCountRef.current++;
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

  // Handle tooltip
  const handlePieHover = (
    segment: { label: string; value: number; color: string; details?: string } | null,
    event?: MouseEvent
  ) => {
    if (segment && event) {
      setTooltip({
        label: segment.label,
        value: segment.value,
        color: segment.color,
        details: segment.details,
        x: event.clientX,
        y: event.clientY,
      });
    } else {
      setTooltip(null);
    }
  };

  // Draw charts
  useEffect(() => {
    if (!pictogramRef.current || !pieRef.current || !data) return;

    drawTotalLaunches(pictogramRef.current, data, animationProgress);
    drawPieChart(pieRef.current, data, animationProgress, handlePieHover);
  }, [data, animationProgress]);

  if (!data) {
    // return <div className="loading">Cargando datos...</div>;
    return <div></div>
  }

  return (
    <div className="launch-overview-container">
      <div className="lo-chart-wrapper">
        <div className="lo-chart-content">
          <div className="lo-charts-row">
            <svg ref={pictogramRef}></svg>
            <svg ref={pieRef}></svg>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="lo-tooltip"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y - 10,
          }}
        >
          <div className="lo-tooltip-header">
            <span className="lo-tooltip-label" style={{ color: tooltip.color }}>{tooltip.label}</span>
            <span className="lo-tooltip-value">{tooltip.value} lanzamientos</span>
          </div>
          {tooltip.details && (
            <div className="lo-tooltip-details">
              {tooltip.details.split('\n').map((line, i) => (
                <div key={i} className="lo-tooltip-detail-line">
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scroll spacer */}
      <div className="lo-scroll-spacer" />

      <ScrollHintArrow />
    </div>
  );
}
