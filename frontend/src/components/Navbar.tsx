import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-btn">
        Home
      </Link>
      <Link to="/about" className="nav-btn">
        About
      </Link>
      <Link to="/features" className="nav-btn">
        Features
      </Link>
    </nav>
  )
}

export default Navbar
