import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/MainPage.css'
import chatpdf from '../assets/chatpdfimg.png'
import AuthModal from '../components/AuthModal'

const MainPage: React.FC = () => {
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const sectionId =
      location.pathname === '/' ? 'home' : location.pathname.slice(1)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  return (
    <>
      <div id="home" className="home-container">
        <h1 className="home-title">AI-Powered PDF Chat.</h1>
        <p className="home-subtitle">
          No more skimming through pages. Just upload your file and start
          chatting
          <br />— your smart AI assistant finds what matters most.
        </p>
        <button className="cta-button" onClick={() => setShowModal(true)}>
          Try It Now
        </button>
        <img src={chatpdf} alt="img" className="chatpdf" />
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </div>

      <div id="about" className="about-section">
        <div className="features-wrapper">
          <div className="features-border">
            <h3 className="features-title">
              Like having a{' '}
              <span style={{ color: '#FF007A' }}>personal AI </span> <br />
              that reads your documents for you.
            </h3>

            <div className="marquee-track">
              <div className="marquee-item custom-card">
                <i
                  className="fas fa-flask fa-2x"
                  style={{ color: '#FF007A' }}
                ></i>
                <h4>For Researchers</h4>
                <p>
                  Explore scientific papers, academic articles, and books to get
                  the information you need for your research.
                </p>
              </div>

              <div className="marquee-item custom-card">
                <i
                  className="fas fa-user-graduate fa-2x"
                  style={{ color: '#FF007A' }}
                ></i>
                <h4>For Students</h4>
                <p>
                  Study for exams, get help with homework, and answer multiple
                  choice questions faster than your classmates.
                </p>
              </div>

              <div className="marquee-item custom-card">
                <i
                  className="fas fa-briefcase fa-2x"
                  style={{ color: '#FF007A' }}
                ></i>
                <h4>For Professionals</h4>
                <p>
                  Navigate legal contracts, financial reports, manuals, and
                  training material. Ask questions to any PDF to stay ahead.
                </p>
              </div>

              <div className="marquee-item custom-card">
                <i
                  className="fas fa-link fa-2x"
                  style={{ color: '#FF007A' }}
                ></i>
                <h4>Cited Sources</h4>
                <p>
                  Built-in citations anchor responses to PDF references. No more
                  page-by-page searching.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="features-wrapper">
        <div className="features-border">
          <h3>Features</h3>
          {/* ... */}
        </div>
      </div>
    </>
  )
}

export default MainPage
