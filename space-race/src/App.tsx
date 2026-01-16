import { useState } from 'react'
import SpaceRaceChart from './components/SpaceRaceChart'
import HomePage from './components/HomePage'
import { StarsBackground } from './components/animate-ui/components/backgrounds/stars'
import './App.css'

function App() {
  const [showChart, setShowChart] = useState(false)

  const handleStart = () => {
    setShowChart(true)
    // Scroll to top when starting the visualization
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <StarsBackground className="!fixed inset-0 -z-10 !h-screen !w-screen" />
      {showChart ? (
        <SpaceRaceChart />
      ) : (
        <HomePage onStart={handleStart} />
      )}
    </div>
  )
}

export default App
