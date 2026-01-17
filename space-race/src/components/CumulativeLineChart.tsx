import { useEffect, useRef, useState, useMemo } from 'react';
import { drawCumulativeLineChart } from '../utils/drawCumulativeLineChart';
import type { DataPoint } from '../utils/drawCumulativeLineChart';
import type { MissionData } from '../utils/drawDotMatrixChart';
import './CumulativeLineChart.css';

interface CumulativeLineChartProps {
  missions: MissionData[];
  onScrollBack: () => void;
}

export default function CumulativeLineChart({
  missions,
  onScrollBack,
}: CumulativeLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hasTransitionedRef = useRef(false);
  const scrollUpCountRef = useRef(0);
  const [animationProgress, setAnimationProgress] = useState(0);

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

  // Animate on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      setAnimationProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Handle drawing
  useEffect(() => {
    if (!svgRef.current || chartData.length === 0) return;
    drawCumulativeLineChart(svgRef.current, chartData, animationProgress);
  }, [chartData, animationProgress]);

  // Handle scroll back
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

  return (
    <div className="cumulative-chart-container">
      <div className="cumulative-chart-grid">
        <div className="cumulative-chart-viz">
           <svg ref={svgRef}></svg>
        </div>
        
        <div className="cumulative-conclusions">
          <h2>Conclusiones</h2>
          <p>
            <strong>¿Quién ganó la Carrera Espacial?</strong>
          </p>
          <p>
            Aunque la <strong>URSS</strong> tomó la delantera inicial con el Sputnik y el primer humano en el espacio (Yuri Gagarin), <strong>EE. UU.</strong> logró el hito definitivo al llevar humanos a la Luna en 1969.
          </p>
          <p>
            Sin embargo, como muestran los datos, la URSS mantuvo un ritmo de lanzamientos superior y constante durante casi toda la era, demostrando una capacidad industrial inmensa.
          </p>
          <p className="highlight">
            Más allá de la política, esta competencia aceleró avances científicos que hoy damos por sentados, desde las telecomunicaciones hasta la observación terrestre.
          </p>
          
          <div className='footer-buttons'>
            <button className="restart-button" onClick={onScrollBack}>
              Volver atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
