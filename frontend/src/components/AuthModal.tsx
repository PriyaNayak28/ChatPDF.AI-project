import React, { useState, useRef, useEffect } from 'react'
import '../styles/AuthModal.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface AuthModalProps {
  onClose: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isSignup, setIsSignup] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const modalRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignup) {
        await axios.post(
          'https://chatpdf-ai-1.onrender.com/user/signup',
          formData
        )
        alert('User signed up successfully!')
        setIsSignup(false)
        setFormData({ name: '', email: '', password: '' })
        return
      }

      const res = await axios.post(
        'https://chatpdf-ai-1.onrender.com/user/login',
        {
          email: formData.email,
          password: formData.password,
        }
      )

      const token = res.data.token
      localStorage.setItem('token', token)
      alert('Logged in successfully!')
      onClose()
      navigate('/Hero')
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data?.message || 'Something went wrong')
      } else {
        alert('Something went wrong')
      }
    }
  }

  return (
    <div className="modal-overlay">
      <div
        ref={modalRef}
        className={`auth-modal ${isSignup ? 'signup-mode' : 'signin-mode'}`}
      >
        <h1 className="app-logo">
          ChatPdf<span className="white-text">.AI</span>
        </h1>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="glow-input"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="glow-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="glow-input"
          />
          <div className="button-row">
            <button
              type="submit"
              className={isSignup ? 'gradient-btn' : 'black-btn'}
            >
              Sign Up
            </button>
            <button
              type="submit"
              className={!isSignup ? 'gradient-btn' : 'black-btn'}
            >
              Sign In
            </button>
          </div>
        </form>

        <button className="switch-mode" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Sign In' : 'New user? Sign Up'}
        </button>
      </div>
    </div>
  )
}

export default AuthModal
