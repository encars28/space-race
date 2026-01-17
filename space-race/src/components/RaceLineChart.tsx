import { useEffect, useRef, useState, useMemo } from 'react';
import { drawCumulativeLineChart } from '../utils/drawAcumLaunchesLineChart';
import type { DataPoint } from '../utils/drawAcumLaunchesLineChart';
import type { MissionData } from '../utils/drawDotMatrixChart';
import './RaceLineChart.css';

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
    if (!svgRef.current || chartData.length === 0) return;
    drawCumulativeLineChart(svgRef.current, chartData);
  }, [chartData]);

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
          <p className="highlight">
            Más allá de la política, esta competencia aceleró avances científicos que hoy damos por sentados, desde las telecomunicaciones hasta la observación terrestre.
          </p>
          
          <div className='footer-buttons'>
            <button className="restart-button" onClick={onScrollBack}>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
