import { useEffect, useRef, useState } from 'react';
import { drawAcumLaunchesBarChart } from '../utils/drawAcumLaunchesBarChart';
import type { YearlyData } from '../utils/drawAcumLaunchesBarChart';
import type { MissionData } from '../utils/drawDotMatrixChart';
import ScrollHintArrow from './ScrollHintArrow';
import './SpaceRaceChart.css';

// Controls how much scrolling is needed to go through all years
// Lower values = faster scrolling, higher values = slower scrolling
// 1 = minimal scroll, 5 = moderate scroll, 10 = lots of scrolling
const SCROLL_SPEED = 5;
const VISIBLE_YEARS = 6;

interface SpaceRaceChartProps {
  missions: MissionData[];
}

export default function SpaceRaceChart({ missions }: SpaceRaceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<YearlyData[]>([]);
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [years, setYears] = useState<number[]>([]);

  // Process missions data into cumulative yearly data
  useEffect(() => {
    if (missions.length === 0) return;

    // Get unique years sorted
    const uniqueYears = [...new Set(missions.map((d) => d.Year))].sort(
      (a, b) => a - b
    );
    setYears(uniqueYears);

    // Calculate cumulative launches per year
    const yearlyData: YearlyData[] = [];
    let cumulativeUSA = 0;
    let cumulativeUSSR = 0;

    uniqueYears.forEach((year) => {
      const yearMissions = missions.filter((m) => m.Year === year);
      cumulativeUSA += yearMissions.filter(
        (m) => m.Superpower === 'USA'
      ).length;
      cumulativeUSSR += yearMissions.filter(
        (m) => m.Superpower === 'USSR'
      ).length;

      yearlyData.push({
        year,
        USA: cumulativeUSA,
        USSR: cumulativeUSSR,
      });
    });

    setData(yearlyData);
  }, [missions]);

  // Handle scroll for scrollytelling (reduced scroll distance)
  useEffect(() => {
    if (years.length === 0) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollTop / docHeight, 1);

      const newIndex = Math.min(
        Math.floor(scrollProgress * years.length),
        years.length - 1
      );
      setCurrentYearIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [years]);

  // Draw the chart using external function
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const currentData = data[currentYearIndex];
    if (!currentData) return;

    drawAcumLaunchesBarChart(svgRef.current, currentData, data);
  }, [data, currentYearIndex]);

  if (data.length === 0) {
    return <div className="loading">Loading data...</div>;
  }

  // const currentData = data[currentYearIndex];

  // Calculate visible years window (10 years centered on current)
  const halfWindow = Math.floor(VISIBLE_YEARS / 2);
  
  // Calculate start index, keeping current year as centered as possible
  let startIndex = Math.max(0, currentYearIndex - halfWindow);
  let endIndex = startIndex + VISIBLE_YEARS;
  
  // Adjust if we're near the end
  if (endIndex > years.length) {
    endIndex = years.length;
    startIndex = Math.max(0, endIndex - VISIBLE_YEARS);
  }
  
  // const visibleYears = years.slice(startIndex, endIndex);
  const visibleStartIndex = startIndex;

  return (
    <div className="space-race-container">
      {/* Vertical timeline on the left */}
      <div className="timeline-container">
        <div className="timeline"
          style={{
            height: `${(years.length / VISIBLE_YEARS) * 100}%`,
            transform: `translateY(${-visibleStartIndex * (100 / years.length)}%)`,
          }}
        >
          <div className="timeline-track">
            <div
              className="timeline-progress-bar"
              style={{
                height: `${((currentYearIndex + 0.5) / (years.length - 1)) * 100}%`,
              }}
            />
          </div>
          {years.map((year, index) => (
            <div
              key={year}
              className={`timeline-year ${index === currentYearIndex ? 'active' : ''} ${index < currentYearIndex ? 'passed' : ''}`}
            >
              <div className="timeline-dot" />
              <span className="timeline-label">{year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Centered chart and info */}
      <div className="chart-wrapper">
        <div className="chart-content">
          <svg ref={svgRef}></svg>
          {/* <div className="chart-info">
            <div className="stats">
              <div className="stat usa">
                <span className="flag">🇺🇸</span>
                <span className="count">{currentData?.USA || 0}</span>
                <span className="label">USA launches</span>
              </div>
              <div className="stat ussr">
                <span className="flag">☭</span>
                <span className="count">{currentData?.USSR || 0}</span>
                <span className="label">USSR launches</span>
              </div>
            </div>
          </div> */}
          {/* <div className="scroll-hint">
            <span>↓ Scroll to advance through time ↓</span>
          </div> */}
        </div>
      </div>

      {/* Scroll spacer - height controlled by SCROLL_SPEED */}
      <div
        className="scroll-spacer"
        style={{ height: `${SCROLL_SPEED * 100}vh` }}
      />
      
      <ScrollHintArrow />
    </div>
  );
}
