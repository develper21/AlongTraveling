import { useState, useEffect, useRef } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { getInitials } from '../lib/utils'
import useStore from '../store/useStore'

function ChatPanel({ tripId, messages, onSendMessage }) {
  const { currentUser } = useStore()
  const [newMessage, setNewMessage] = useState('')
  const messagesContainerRef = useRef(null)

  const scrollToBottom = (behavior = 'smooth') => {
    const container = messagesContainerRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight, behavior })
  }

  useEffect(() => {
    scrollToBottom(messages.length > 20 ? 'auto' : 'smooth')
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage('')
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="glass-card flex flex-col h-[640px] lg:h-[720px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Group Chat</h3>
        <p className="text-sm text-gray-500">Chat with trip participants</p>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            // Handle both backend and frontend message formats
            const senderId = msg.sender?._id || msg.sender || msg.userId
            const senderName = msg.sender?.name || msg.userName || 'Unknown'
            const messageContent = msg.content || msg.message
            const messageTime = msg.createdAt || msg.timestamp
            const messageId = msg._id || msg.id
            
            const isCurrentUser = senderId === currentUser._id
            
            return (
              <div
                key={messageId}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {getInitials(senderName)}
                  </div>

                  {/* Message Bubble */}
                  <div>
                    {!isCurrentUser && (
                      <p className="text-xs text-gray-600 mb-1 px-2">
                        {senderName}
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isCurrentUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{messageContent}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 px-2 ${isCurrentUser ? 'text-right' : ''}`}>
                      {formatTime(messageTime)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div aria-hidden="true" />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatPanel
