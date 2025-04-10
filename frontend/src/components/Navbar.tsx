import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
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
