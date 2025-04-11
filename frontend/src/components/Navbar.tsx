import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
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
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'nav-btn active' : 'nav-btn')}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? 'nav-btn active' : 'nav-btn')}
      >
        About
      </NavLink>
      <NavLink
        to="/features"
        className={({ isActive }) => (isActive ? 'nav-btn active' : 'nav-btn')}
      >
        Features
      </NavLink>
    </nav>
  )
}

export default Navbar
