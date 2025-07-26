import { useState } from 'react'
import Header from './components/Header'
import EffortsDashboard from './components/EffortsDashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />

    <Router>
      <Routes>
        <Route path="/" element={<EffortsDashboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
