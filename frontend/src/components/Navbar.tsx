import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/Navbar.css'

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
      
      // Get all sections
      const sections = ['home', 'about', 'features']
      const scrollPosition = window.scrollY + window.innerHeight / 2 // Center of viewport

      // Find the section in view
      let currentSection = 'home'
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop) {
            currentSection = section
          }
        }
      }
      setActiveSection(currentSection)
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <NavLink
        to="/"
        className={activeSection === 'home' ? 'nav-btn active' : 'nav-btn'}
        onClick={() => {
          document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={activeSection === 'about' ? 'nav-btn active' : 'nav-btn'}
        onClick={() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        About
      </NavLink>
      <NavLink
        to="/features"
        className={activeSection === 'features' ? 'nav-btn active' : 'nav-btn'}
        onClick={() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        Features
      </NavLink>
    </nav>
  )
}

export default Navbar
