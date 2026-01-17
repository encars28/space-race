import { useEffect, useRef, useState } from 'react';
import { drawAcumLaunchesBarChart } from '../utils/drawAcumLaunchesBarChart';
import type { YearlyData } from '../utils/drawAcumLaunchesBarChart';
import type { MissionData } from '../utils/drawDotMatrixChart';
import { getEventsForYear } from '../utils/timelineData';
import type { TimelineEvent } from '../utils/timelineData';
import ScrollHintArrow from './ScrollHintArrow';
import crownImg from '../assets/crown.png';
import './SpaceRaceChart.css';

const SCROLL_SPEED = 8;
const VISIBLE_YEARS = 6;

interface SpaceRaceChartProps {
  missions: MissionData[];
  onScrollBack: () => void;
  onScrollNext?: () => void;
}

export default function SpaceRaceChart({ missions, onScrollBack, onScrollNext }: SpaceRaceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<YearlyData[]>([]);
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [years, setYears] = useState<number[]>([]);
  const [currentEvents, setCurrentEvents] = useState<TimelineEvent[]>([]);
  const hasTransitionedRef = useRef(false);
  const scrollUpCountRef = useRef(0);
  const scrollDownCountRef = useRef(0);

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

  // Handle scroll for scrollytelling 
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

  // Handle wheel event to detect scroll-up at top (for going back) or scroll-down at bottom (for next)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (hasTransitionedRef.current) return;
      
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;

      // Check if we're at the top and trying to scroll up (at first year)
      if (scrollTop <= 0 && e.deltaY < 0 && currentYearIndex === 0) {
        scrollUpCountRef.current++;
        // Require multiple scroll-up attempts to prevent accidental triggers
        if (scrollUpCountRef.current >= 3) {
          hasTransitionedRef.current = true;
          onScrollBack();
        }
      } else {
        scrollUpCountRef.current = 0;
      }

      // Check if we're at the bottom and trying to scroll down (at last year)
      const atBottom = docHeight - scrollTop < 10;
      if (atBottom && e.deltaY > 0 && currentYearIndex === years.length - 1 && onScrollNext) {
        scrollDownCountRef.current++;
        if (scrollDownCountRef.current >= 3) {
            hasTransitionedRef.current = true;
            onScrollNext();
        }
      } else {
        scrollDownCountRef.current = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [onScrollBack, onScrollNext, currentYearIndex, years.length]);

  // Draw the chart
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const currentData = data[currentYearIndex];
    if (!currentData) return;

    drawAcumLaunchesBarChart(svgRef.current, currentData, data);
  }, [data, currentYearIndex]);

  // Update current events when year changes
  useEffect(() => {
    if (years.length === 0) return;
    const currentYear = years[currentYearIndex];
    const events = getEventsForYear(currentYear);
    setCurrentEvents(events);
  }, [years, currentYearIndex]);

  if (data.length === 0) {
    return <div></div>;
  }
  // Calculate visible years window
  const halfWindow = Math.floor(VISIBLE_YEARS / 2);
  
  // Calculate start index, keeping current year as centered as possible
  let startIndex = Math.max(0, currentYearIndex - halfWindow);
  let endIndex = startIndex + VISIBLE_YEARS;
  
  // Adjust if we're near the end
  if (endIndex > years.length) {
    endIndex = years.length;
    startIndex = Math.max(0, endIndex - VISIBLE_YEARS);
  }
  
  const visibleStartIndex = startIndex;

  return (
    <div className="space-race-container">
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
      <div className="wrapper">
        <div className="chart-wrapper">
        <div className="chart-content">
          <h2 className="chart-title">{years[currentYearIndex]}</h2>
          <svg ref={svgRef}></svg>
        </div>
      </div>

      {/* Events panel between timeline and chart */}
      <div className="events-container">
        {currentEvents.length > 0 && (
          <div className="events-panel" key={years[currentYearIndex]}>
            {currentEvents.map((event, index) => (
              <div key={index} className={`event-card ${event.country === 'USA' ? 'event-usa' : event.country === 'URSS' ? 'event-ussr' : 'event-both'}`}>
                {/* Crown for the Moon Landing event */}
                {event.title === 'Aterrizaje en la Luna' && (
                  <img src={crownImg} alt="Crown" className="event-crown" />
                )}

                <div className="event-header">
                  <span className="event-date">{event.date}</span>
                </div>
                <h3 className={`event-title ${event.country === 'USA' ? 'event-usa' : event.country === 'URSS' ? 'event-ussr' : 'event-both'}`}>{event.title}</h3>
                <p className="event-description">{event.description}</p>
              </div>
            ))}
          </div>
        )}
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
