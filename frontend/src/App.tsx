import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom'
import Navbar from './components/Navbar'
import MainPage from './components/MainPage'
import Hero from './components/Hero'
import * as pdfjsLib from 'pdfjs-dist'
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
import PdfChat from './components/PdfChat'

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const token = localStorage.getItem('token')
  return token ? element : <Navigate to="/" replace />
}

const AppContent: React.FC = () => {
  const location = useLocation()

  return (
    <>
      {/* <div style={{ position: 'absolute', zIndex: 2, padding: '1rem' }}> */}
      <div
        style={{
          position: 'fixed',
          zIndex: 1001,
          padding: '1rem',
          left: '50px',
        }}
      >
        <h2 style={{ color: 'white' }}>
          Chat<span style={{ color: '#FF007A' }}>PDF</span>.AI
        </h2>
      </div>

      {location.pathname !== '/Hero' && <Navbar />}

      <div className="fade-top" />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Hero" element={<PrivateRoute element={<Hero />} />} />
        <Route
          path="/chat/:pdfId"
          element={<PrivateRoute element={<PdfChat />} />}
        />
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
