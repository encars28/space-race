import SpaceRaceChart from './components/SpaceRaceChart'
import { StarsBackground } from './components/animate-ui/components/backgrounds/stars'
import './App.css'

function App() {
  return (
    <div className="app">
      <StarsBackground className="!fixed inset-0 -z-10 !h-screen !w-screen" />
      <SpaceRaceChart />
    </div>
  )
}

export default App
