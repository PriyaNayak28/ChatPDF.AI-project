import React, { useState } from 'react'
import '../styles/Hero.css'

const Hero: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [chats, setChats] = useState<string[]>([])
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

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
      setChats([...chats, files[0].name])
    }
  }

  return (
    <div className="hero-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">💬</div>

        <div className="sidebar-actions">
          <button className="new-chat-btn">
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
          <button className="premium-btn">
            <i className="fas fa-crown"></i> Unlock Premium
          </button>
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
            <button className="upload-btn">
              <i className="fas fa-arrow-up"></i> Upload PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
