import { useState } from 'react'
import SpaceRaceChart from './components/SpaceRaceChart'
import HomePage from './components/HomePage'
import { StarsBackground } from './components/animate-ui/components/backgrounds/stars'
import './App.css'

function App() {
  const [started, setStarted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  const handleStart = () => {
    setFadeOut(true)
    setTimeout(() => {
      setStarted(true)
      window.scrollTo({ top: 0 })
    }, 600)
  }

  return (
    <div className="app">
      <StarsBackground className="!fixed inset-0 -z-10 !h-screen !w-screen" />
      
      {!started && (
        <div className={`page-content ${fadeOut ? 'page-fade-out' : ''}`}>
          <HomePage onStart={handleStart} />
        </div>
      )}
      
      {started && (
        <SpaceRaceChart />
      )}
    </div>
  )
}

export default App
