import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import Navbar from './components/Navbar'
import MainPage from './pages/MainPage'
import Hero from './pages/Hero'

const AppContent: React.FC = () => {
  const location = useLocation()

  return (
    <>
      <div style={{ position: 'absolute', zIndex: 2, padding: '1rem' }}>
        <h2 style={{ color: 'white' }}>
          Chat<span style={{ color: '#FF007A' }}>PDF</span>.AI
        </h2>
      </div>

      {/* Conditionally render Navbar */}
      {location.pathname !== '/Hero' && <Navbar />}

      <div className="fade-top" />

      <Routes>
        <Route path="/*" element={<MainPage />} />
        <Route path="/Hero" element={<Hero />} />
      </Routes>
    </>
  )
}

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App
