import React from 'react'
import '../styles/Home.css'
import chatpdf from '../assets/chatpdfimg.png'

const Home: React.FC = () => {
  return (
    <>
      <div className="home-container">
        <h1 className="home-title">AI-Powered PDF Chat.</h1>
        <p className="home-subtitle">
          No more skimming through pages. Just upload your file and start
          chatting
          <br />— your smart AI assistant finds what matters most.
        </p>
        <button className="cta-button">Try It Now</button>
        <img src={chatpdf} alt="img" className="chatpdf" />

        {/* New Features Section */}
        <div className="features-wrapper">
          <div className="features-border">
            <h3 className="features-title">
              Like having a{' '}
              <span style={{ color: '#FF007A' }}>personal AI </span> <br />
              that reads your documents for you.
            </h3>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
