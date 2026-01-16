import { useState, useEffect } from 'react'
import * as d3 from 'd3'
import SpaceRaceChart from './components/SpaceRaceChart'
import SuccessFailureChart from './components/SuccessFailureChart'
import HomePage from './components/HomePage'
import { StarsBackground } from './components/animate-ui/components/backgrounds/stars'
import type { MissionData } from './utils/drawDotMatrixChart'
import './App.css'

// Visualization phases
type Phase = 'home' | 'success-failure' | 'cumulative'

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
      setPhase('success-failure')
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
      
      {phase === 'success-failure' && (
        <div className={`page-content ${fadeOut ? 'page-fade-out' : ''}`}>
          <SuccessFailureChart 
            missions={missions} 
            onScrollStart={handleScrollToCumulative} 
          />
        </div>
      )}
      
      {phase === 'cumulative' && (
        <SpaceRaceChart missions={missions} />
      )}
    </div>
  )
}

export default App
