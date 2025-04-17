import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/MainPage.css'
import chatpdf from '../assets/chatpdfimg.png'
import AuthModal from '../components/AuthModal'

const MainPage: React.FC = () => {
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const sectionId =
      location.pathname === '/' ? 'home' : location.pathname.slice(1)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === 'application/pdf') {
      // Handle PDF upload
      console.log('PDF file dropped:', files[0])
    }
  }

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
              <span style={{ color: '#FF007A' }}>personal AI</span> <br />
              that reads your documents for you.
            </h3>

            <div className="marquee-container">
              <div className="marquee-track">
                <div className="custom-card">
                  <i className="fas fa-flask"></i>
                  <h4>For Researchers</h4>
                  <p>
                    Explore scientific papers, academic articles, and books to
                    get the information you need for your research.
                  </p>
                </div>

                <div className="custom-card">
                  <i className="fas fa-user-graduate"></i>
                  <h4>For Students</h4>
                  <p>
                    Study for exams, get help with homework, and answer multiple
                    choice questions faster than your classmates.
                  </p>
                </div>

                <div className="custom-card">
                  <i className="fas fa-briefcase"></i>
                  <h4>For Professionals</h4>
                  <p>
                    Navigate legal contracts, financial reports, manuals, and
                    training material. Ask questions to any PDF to stay ahead.
                  </p>
                </div>

                <div className="custom-card">
                  <i className="fas fa-link"></i>
                  <h4>Cited Sources</h4>
                  <p>
                    Built-in citations anchor responses to PDF references. No
                    more page-by-page searching.
                  </p>
                </div>

                {/* Duplicate cards for seamless loop */}
                <div className="custom-card">
                  <i className="fas fa-flask"></i>
                  <h4>For Researchers</h4>
                  <p>
                    Explore scientific papers, academic articles, and books to
                    get the information you need for your research.
                  </p>
                </div>

                <div className="custom-card">
                  <i className="fas fa-user-graduate"></i>
                  <h4>For Students</h4>
                  <p>
                    Study for exams, get help with homework, and answer multiple
                    choice questions faster than your classmates.
                  </p>
                </div>

                <div className="custom-card">
                  <i className="fas fa-briefcase"></i>
                  <h4>For Professionals</h4>
                  <p>
                    Navigate legal contracts, financial reports, manuals, and
                    training material. Ask questions to any PDF to stay ahead.
                  </p>
                </div>

                <div className="custom-card">
                  <i className="fas fa-link"></i>
                  <h4>Cited Sources</h4>
                  <p>
                    Built-in citations anchor responses to PDF references. No
                    more page-by-page searching.
                  </p>
                </div>
              </div>
            </div>

            <div className="upload-section">
              <div
                className={`upload-box ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="upload-icon">
                  <i className="fas fa-file-upload"></i>
                </div>
                <h3>Click to upload, or drag PDF here</h3>
                <button className="upload-btn">
                  <i className="fas fa-arrow-up"></i> Upload PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="contact" className="contact-section">
        <div className="contact-wrapper">
          <div className="contact-header">
            <h2 className="brand-title">
              Chat<span>PDF</span>.AI
            </h2>
            <p className="contact-description">
              ChatPDF brings ChatGPT-style intelligence and PDF AI technology
              together for smarter document understanding. Summarize, chat,
              analyze - start now.
            </p>
            <div className="rating">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <span className="rating-text">4.9</span>
            </div>
          </div>

          <div className="contact-grid">
            <div className="contact-column">
              <h3>Features</h3>
              <ul className="animate-list">
                <li>
                  <i className="fas fa-comments"></i>Chat with PDF
                </li>
                <li>
                  <i className="fas fa-file-alt"></i>PDF Summary
                </li>
                <li>
                  <i className="fas fa-graduation-cap"></i>AI Scholar
                </li>
                <li>
                  <i className="fas fa-robot"></i>PDF AI
                </li>
              </ul>
            </div>

            <div className="contact-column">
              <h3>Company</h3>
              <ul className="animate-list">
                <li>
                  <i className="fas fa-handshake"></i>Affiliates
                </li>
                <li>
                  <i className="fas fa-envelope"></i>Contact
                </li>
                <li>
                  <i className="fas fa-code"></i>API Docs
                </li>
              </ul>
            </div>

            <div className="contact-column">
              <h3>Legal</h3>
              <ul className="animate-list">
                <li>
                  <i className="fas fa-shield-alt"></i>Privacy Policy
                </li>
                <li>
                  <i className="fas fa-gavel"></i>Terms & Conditions
                </li>
                <li>
                  <i className="fas fa-info-circle"></i>Imprint
                </li>
              </ul>
            </div>
          </div>

          <div className="contact-footer">
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-github"></i>
              </a>
            </div>
            <p className="copyright">© 2024 ChatPDF.AI - All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainPage
