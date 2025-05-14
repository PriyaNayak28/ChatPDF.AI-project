import React, { useState } from 'react'
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

  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isSignup) {
        // await axios.post('http://localhost:5000/user/signup', formData)
        await axios.post(
          'https://chatpdf-ai-5.onrender.com/user/signup',
          formData
        )
        alert('User signed up successfully!')
        setIsSignup(false)
        setFormData({ name: '', email: '', password: '' })
        return
      }

      const res = await axios.post(
        'http://chatpdf-ai-5.onrender.com/user/login',
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
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>{isSignup ? 'Sign Up' : 'Sign In'}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isSignup ? 'Sign Up' : 'Sign In'}</button>
        </form>
        <button className="switch-mode" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Sign In' : 'New user? Sign Up'}
        </button>
        <hr />
      </div>
    </div>
  )
}

export default AuthModal
