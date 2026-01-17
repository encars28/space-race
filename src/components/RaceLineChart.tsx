import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { drawCumulativeLineChart } from '../utils/drawAcumLaunchesLineChart';
import type { DataPoint } from '../utils/drawAcumLaunchesLineChart';
import type { MissionData } from '../utils/drawDotMatrixChart';
import './RaceLineChart.css';

interface CumulativeLineChartProps {
  missions: MissionData[];
  onBackToHome: () => void;
  onBackToCumulative: () => void;
}

export default function CumulativeLineChart({
  missions,
  onBackToHome,
  onBackToCumulative,
}: CumulativeLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hasTransitionedRef = useRef(false);
  const scrollUpCountRef = useRef(0);
  const hasDrawnRef = useRef(false);

  // Process data
  const chartData = useMemo(() => {
    if (missions.length === 0) return [];

    const years = [...new Set(missions.map((m) => m.Year))].sort((a, b) => a - b);
    const data: DataPoint[] = [];
    
    let cumulativeUSA = 0;
    let cumulativeUSSR = 0;

    years.forEach(year => {
      const yearMissions = missions.filter(m => m.Year === year);
      cumulativeUSA += yearMissions.filter(m => m.Superpower === 'USA').length;
      cumulativeUSSR += yearMissions.filter(m => m.Superpower === 'USSR').length;
      
      data.push({
        year,
        USA: cumulativeUSA,
        USSR: cumulativeUSSR
      });
    });

    return data;
  }, [missions]);

  // Handle drawing
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || chartData.length === 0 || hasDrawnRef.current) return;

    // Clean any existing tooltip before drawing
    d3.select('body').selectAll('.fd-tooltip').remove();

    // Small delay to ensure DOM is ready and React Strict Mode double-render is complete
    const timeoutId = setTimeout(() => {
      if (svgRef.current && !hasDrawnRef.current) {
        hasDrawnRef.current = true;
        drawCumulativeLineChart(svgRef.current, chartData);
      }
    }, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [chartData]);

  // Handle scroll back (scrolling up will navigate back to the cumulative chart)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (hasTransitionedRef.current) return;
      
      if (window.scrollY <= 0 && e.deltaY < 0) {
        scrollUpCountRef.current++;
        if (scrollUpCountRef.current >= 3) {
          hasTransitionedRef.current = true;
          onBackToCumulative();
        }
      } else {
        scrollUpCountRef.current = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [onBackToCumulative]);



  return (
    <div className="cumulative-chart-container">
      <div className='cumulative-chart-content'>
      <div className="cumulative-chart-grid">
        <div className="cumulative-chart-viz">
           <svg ref={svgRef}></svg>
        </div>
        <div className="cumulative-conclusions">
          <h2>¿Quién fue el ganador?</h2>
          <p>
            La carrera espacial no tuvo un ganador definitivo. Estados Unidos ganó la carrera lunar en 1969, lo que en su momento se vio por el público general como una victoria decisiva.
          </p>
          <p>
            Sin embargo, la Unión Soviética logró varios hitos importantes sin los que este aterrizaje no habría sido posible.
          </p>
          <p>
            Más allá de la política, muchas ramas del conocimiento se vieron reforzadas, por ejemplo, la medicina, computación y ciencia de materiales.
          </p>
          
          <div className='footer-buttons'>
            <button className="restart-button" onClick={onBackToHome}>
              Volver al inicio
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
