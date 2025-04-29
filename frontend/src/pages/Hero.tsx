import React, { useState, useEffect } from 'react'
import '../styles/Hero.css'
import axios from 'axios'

interface User {
  name: string
  isPremium: boolean
}

const Hero: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [chats, setChats] = useState<string[]>([])
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [showPremiumTooltip, setShowPremiumTooltip] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === 'application/pdf') {
      const file = files[0]
      setChats([...chats, file.name])
      await uploadPdf(file)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      setChats([...chats, file.name])
      await uploadPdf(file)
    }
  }

  const uploadPdf = async (file: File) => {
    const formData = new FormData()
    formData.append('pdf', file)

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Upload response:', res.data)
    } catch (err) {
      console.error('Error uploading PDF:', err)
    }
  }

  const handleNewChat = () => {
    setChats([...chats, `Chat ${chats.length + 1}`])
  }

  const handlePremiumPurchase = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        'http://localhost:5000/premium/premiummembership',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const { order, key_id } = response.data

      const options = {
        key: key_id,
        amount: order.amount,
        currency: 'INR',
        name: 'ChatPDF Premium',
        description: 'Premium Membership',
        order_id: order.id,
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
        }) => {
          try {
            await axios.post(
              'http://localhost:5000/premium/updatetransactionstatus',
              {
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            setUser((prev) => (prev ? { ...prev, isPremium: true } : null))
          } catch (error) {
            console.error('Error updating transaction status:', error)
          }
        },
        prefill: {
          name: user?.name || 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#FF007A',
        },
      }

      interface RazorpayOptions {
        key: string
        amount: number
        currency: string
        name: string
        description: string
        order_id: string
        handler: (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
        }) => void
        prefill: { name: string; email: string }
        theme: { color: string }
      }

      interface Razorpay {
        open: () => void
      }

      interface ExtendedWindow extends Window {
        Razorpay: new (options: RazorpayOptions) => Razorpay
      }

      const RazorpayConstructor = (window as unknown as ExtendedWindow).Razorpay
      const razorpay = new RazorpayConstructor(options)
      razorpay.open()
    } catch (error) {
      console.error('Error initiating premium purchase:', error)
    }
  }

  return (
    <div className="hero-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div
            className="user-name-container"
            onMouseEnter={() => setShowPremiumTooltip(true)}
            onMouseLeave={() => setShowPremiumTooltip(false)}
          >
            <span className="user-name">
              {user?.name || 'User'}
              {user?.isPremium && <i className="fas fa-star premium-star"></i>}
            </span>
            {showPremiumTooltip && user?.isPremium && (
              <div className="premium-tooltip">
                <i className="fas fa-crown"></i> Premium Member
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-actions">
          <button className="new-chat-btn" onClick={handleNewChat}>
            <i className="fas fa-plus"></i> New Chat
          </button>
          <button
            className="new-folder-btn"
            onClick={() => setShowNewFolderInput(true)}
          >
            <i className="fas fa-folder-plus"></i> New Folder
          </button>
        </div>

        {showNewFolderInput && (
          <div className="new-folder-input">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button
              onClick={() => {
                setShowNewFolderInput(false)
                setNewFolderName('')
              }}
            >
              <i className="fas fa-check"></i>
            </button>
          </div>
        )}

        <div className="chats-list">
          {chats.map((chat, index) => (
            <div key={index} className="chat-item">
              <i className="fas fa-file-pdf"></i>
              <span>{chat}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-settings"></div>
          {!user?.isPremium && (
            <button className="premium-btn" onClick={handlePremiumPurchase}>
              <i className="fas fa-crown"></i> Unlock Premium
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <div className="upload-icon">
              <i className="fas fa-file-upload"></i>
            </div>
            <h2>Click to upload, or drag PDF here</h2>
            <label className="upload-btn">
              <i className="fas fa-arrow-up"></i> Upload PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
