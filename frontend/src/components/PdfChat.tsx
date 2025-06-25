import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { zoomPlugin } from '@react-pdf-viewer/zoom'
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import '@react-pdf-viewer/zoom/lib/styles/index.css'
import '@react-pdf-viewer/page-navigation/lib/styles/index.css'
import '../styles/PdfChat.css'

interface Message {
  question: string
  answer: string
}

const PdfChat: React.FC = () => {
  const { pdfId } = useParams<{ pdfId: string }>()
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    toolbarPlugin: {
      fullScreenPlugin: {
        onEnterFullScreen: () => {},
        onExitFullScreen: () => {},
      },
    },
  })
  const zoomPluginInstance = zoomPlugin()
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const navigate = useNavigate()

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(true)
  const [pdfError, setPdfError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setPdfLoading(true)
        setPdfError(null)

        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Authentication token not found')
        }

        console.log('Making request for PDF ID:', pdfId)
        const res = await axios.get(`http://localhost:5000/pdf/${pdfId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log('Response from server:', res.data)
        console.log('Response data object:', res.data.data)
        console.log('Response data type:', typeof res.data.data)
        console.log('Response data keys:', res.data.data ? Object.keys(res.data.data) : 'data is undefined')
        
        // Try to get the URL from different possible locations
        const pdfUrl = res.data.data?.url || res.data.data?.pdfUrl || res.data.url || res.data.pdfUrl
        console.log('PDF URL from response:', pdfUrl)

        if (!res.data.success || !pdfUrl) {
          console.log('Validation failed - success:', res.data.success, 'url exists:', !!pdfUrl)
          throw new Error('Failed to load PDF. PDF URL is missing.')
        }

        setPdfUrl(pdfUrl)
      } catch (error: unknown) {
        console.error('Error fetching PDF:', error)

        let errorMessage = 'Something went wrong while loading the PDF.'
        if (error instanceof Error) {
          errorMessage = error.message
        }

        setPdfError(errorMessage)
      } finally {
        setPdfLoading(false)
      }
    }

    if (pdfId) {
      fetchPdf()
    }
  }, [pdfId])

  const handleSendQuery = async () => {
    if (!query.trim()) return
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await axios.post(
        'http://localhost:5000/groq/prompt',
        {
          pdfId: pdfId,
          question: query,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log('Response from server:', res.data)

      if (!res.data.success) {
        throw new Error(res.data.message || 'Failed to get response')
      }

      const answer = res.data.data.answer
      if (!answer) {
        throw new Error('Received empty response from server')
      }

      setMessages((prev) => [...prev, { question: query, answer }])
      setQuery('')
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to get response. Please try again.'
      setMessages((prev) => [
        ...prev,
        {
          question: query,
          answer: `Error: ${message}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendQuery()
    }
  }

  const handleBack = () => {
    navigate('/Hero')
  }

  const handleSignOut = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="pdf-chat-container">
      <div className="custom-header">
        <button className="back-button" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <h2>
          Chat<span style={{ color: '#FF007A' }}>PDF</span>.AI
        </h2>
        <button className="sign-out-button" onClick={handleSignOut}>
          <i className="fas fa-sign-out-alt"></i> Sign Out
        </button>
      </div>

      <div className="content">
        <div className="pdf-viewer-section">
          {pdfLoading ? (
            <div className="loading-pdf">Loading PDF...</div>
          ) : pdfError ? (
            <div className="error-pdf">{pdfError}</div>
          ) : pdfUrl ? (
            <div className="pdf-viewer-wrapper">
              <Viewer
                fileUrl={pdfUrl}
                plugins={[
                  defaultLayoutPluginInstance,
                  zoomPluginInstance,
                  pageNavigationPluginInstance,
                ]}
                defaultScale={1.0}
              />
            </div>
          ) : (
            <div className="loading-pdf">No PDF available</div>
          )}
        </div>

        <div className="chat-section">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="message-container">
                <div className="user-message">
                  <div className="message-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="message-content">
                    <p>{msg.question}</p>
                  </div>
                </div>
                <div className="ai-message">
                  <div className="message-icon">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="message-content">
                    <p>{msg.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              placeholder="As   \k a question about the PDF..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="chat-input"
            />
            <button
              onClick={handleSendQuery}
              disabled={loading || !query.trim()}
              className="send-button"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PdfChat
