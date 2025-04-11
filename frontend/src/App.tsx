import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'

const App: React.FC = () => {
  return (
    <>
      <Router>
        <div style={{ position: 'absolute', zIndex: 2, padding: '1rem' }}>
          <h2 style={{ color: 'white' }}>
            Chat<span style={{ color: '#FF007A' }}>PDF</span>.AI
          </h2>
        </div>

        <Navbar />
        <div className="fade-top" />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<div>About Page</div>} />
          <Route path="/features" element={<div>Features Page</div>} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App
