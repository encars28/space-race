import { useState, useEffect } from 'react'
import * as d3 from 'd3'
import SpaceRaceChart from './components/SpaceRaceChart'
import CumulativeLineChart from './components/RaceLineChart'
import SuccessFailureChart from './components/SuccessFailureChart'
import FailureDensityChart from './components/FailureDensityChart'
import LaunchOverviewChart from './components/LaunchOverviewChart'
import HomePage from './components/HomePage'
import { StarsBackground } from './components/animate-ui/components/backgrounds/stars'
import type { MissionData } from './utils/drawDotMatrixChart'
import './App.css'

// Visualization phases
type Phase = 'home' | 'launch-overview' | 'success-failure' | 'failure-density' | 'cumulative' | 'conclusions'

function App() {
  const [phase, setPhase] = useState<Phase>('home')
  const [fadeOut, setFadeOut] = useState(false)
  const [missions, setMissions] = useState<MissionData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data once for all visualizations
  useEffect(() => {
    d3.csv('/space_race_missions.csv').then((rawData) => {
      const parsedMissions = rawData
        .filter((d) => d.Superpower === 'USA' || d.Superpower === 'USSR')
        .map((d) => ({
          Year: Math.floor(parseFloat(d.Year || '0')),
          Superpower: d.Superpower as string,
          Mission_Status: d.Mission_Status as string,
        }))
        .filter((d) => !isNaN(d.Year) && d.Year >= 1957)

      setMissions(parsedMissions)
      setIsLoading(false)
    })
  }, [])

  const handleStart = () => {
    setFadeOut(true)
    setTimeout(() => {
      setPhase('launch-overview')
      setFadeOut(false)
      window.scrollTo({ top: 0 })
    }, 600)
  }

  const handleScrollToSuccessFailure = () => {
    setFadeOut(true)
    setTimeout(() => {
      setPhase('success-failure')
      setFadeOut(false)
      window.scrollTo({ top: 0 })
    }, 600)
  }

  const handleScrollToFailureDensity = () => {
    setFadeOut(true)
    setTimeout(() => {
      setPhase('failure-density')
      setFadeOut(false)
      window.scrollTo({ top: 0 })
    }, 600)
  }

  const handleScrollToCumulative = () => {
    setFadeOut(true)
    setTimeout(() => {
      setPhase('cumulative')
      setFadeOut(false)
      window.scrollTo({ top: 0 })
    }, 600)
  }

  const handleScrollToConclusions = () => {
    setFadeOut(true)
    setTimeout(() => {
      setPhase('conclusions')
      setFadeOut(false)
      window.scrollTo({ top: 0 })
    }, 600)
  }

  const handleBackToHome = () => {
    setFadeOut(true)
    setTimeout(() => {
      setPhase('home')
      setFadeOut(false)
      window.scrollTo({ top: 0 })
    }, 600)
  }

  const handleBackToLaunchOverview = () => {
    setFadeOut(true)
    setTimeout(() => {
      setPhase('launch-overview')
      setFadeOut(false)
      window.scrollTo({ top: 0 })
    }, 600)
  }

  const handleBackToSuccessFailure = () => {
    setFadeOut(true)
    setTimeout(() => {
      setPhase('success-failure')
      setFadeOut(false)
      window.scrollTo({ top: 0 })
    }, 600)
  }

  const handleBackToFailureDensity = () => {
    setFadeOut(true)
    setTimeout(() => {
      setPhase('failure-density')
      setFadeOut(false)
      window.scrollTo({ top: 0 })
    }, 600)
  }

  if (isLoading) {
    return (
      <div className="app">
        <StarsBackground className="!fixed inset-0 -z-10 !h-screen !w-screen" />
        <div className="loading-screen">Cargando datos...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <StarsBackground className="!fixed inset-0 -z-10 !h-screen !w-screen" />
      
      {phase === 'home' && (
        <div className={`page-content ${fadeOut ? 'page-fade-out' : ''}`}>
          <HomePage onStart={handleStart} />
        </div>
      )}
      
      {phase === 'launch-overview' && (
        <div className={`page-content ${fadeOut ? 'page-fade-out' : ''}`}>
          <LaunchOverviewChart 
            onScrollNext={handleScrollToSuccessFailure}
            onScrollBack={handleBackToHome}
          />
        </div>
      )}
      
      {phase === 'success-failure' && (
        <div className={`page-content ${fadeOut ? 'page-fade-out' : ''}`}>
          <SuccessFailureChart 
            missions={missions} 
            onScrollNext={handleScrollToFailureDensity}
            onScrollBack={handleBackToLaunchOverview}
          />
        </div>
      )}
      
      {phase === 'failure-density' && (
        <div className={`page-content ${fadeOut ? 'page-fade-out' : ''}`}>
          <FailureDensityChart 
            missions={missions} 
            onScrollNext={handleScrollToCumulative}
            onScrollBack={handleBackToSuccessFailure}
          />
        </div>
      )}
      
      {phase === 'cumulative' && (
        <div className={`page-content ${fadeOut ? 'page-fade-out' : ''}`}>
          <SpaceRaceChart 
            missions={missions}
            onScrollNext={handleScrollToConclusions}
            onScrollBack={handleBackToFailureDensity}
          />
        </div>
      )}

      {phase === 'conclusions' && (
        <div className={`page-content ${fadeOut ? 'page-fade-out' : ''}`}>
          <CumulativeLineChart 
            missions={missions}
            onScrollBack={handleBackToHome}
          />
        </div>
      )}
    </div>
  )
}

export default App
