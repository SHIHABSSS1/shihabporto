'use client';

import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiCheck } from 'react-icons/fi';

export default function FloatingMessageButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [serverMessage, setServerMessage] = useState('');

  // Close chat when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsChatOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setSuccess(false);
      setError('');
      setServerMessage('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!name.trim() || !message.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Sending message to API from mobile check:', { name, message: message.substring(0, 20) + '...' });
      
      // More reliable fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      // Send message directly to server
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, message }),
        signal: controller.signal,
        cache: 'no-store',
      }).catch(fetchError => {
        console.error('Fetch error:', fetchError);
        throw new Error(`Network error: ${fetchError.message}`);
      });
      
      clearTimeout(timeoutId);
      
      // For debugging
      console.log('Response status:', response.status);
      // Log headers safely
      console.log('Response headers received');
      
      let result;
      try {
        result = await response.json();
        console.log('API response:', result);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('Could not parse server response');
      }
      
      if (!response.ok) {
        throw new Error(result.error || `Server error (${response.status})`);
      }
      
      setSuccess(true);
      setName('');
      setMessage('');
      setError('');
      setServerMessage('Message saved! I will see it when I check my messages.');
      
      // Close the dialog after a few seconds
      setTimeout(() => {
        setIsChatOpen(false);
        setServerMessage('');
      }, 5000);
    } catch (err: any) {
      console.error('Error saving message:', err);
      
      // More user friendly error message
      if (err.name === 'AbortError') {
        setError('Connection timed out. Please try again or contact me directly.');
      } else if (err.message && err.message.includes('Network error')) {
        setError('Network connection issue. Please check your internet connection and try again.');
      } else {
        setError('Could not send message. Please try again or contact me directly.');
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors duration-300 ${
          isChatOpen ? 'bg-red-500' : 'bg-green-500'
        }`}
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
      >
        {isChatOpen ? (
          <FiX className="text-white" size={24} />
        ) : (
          <FiMessageSquare className="text-white" size={24} />
        )}
      </button>
      
      {/* Chat window */}
      {isChatOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300">
          {/* Header */}
          <div className="bg-green-500 px-4 py-3">
            <h3 className="text-white font-medium">Send a Message</h3>
          </div>
          
          {/* Server Message */}
          {serverMessage && (
            <div className="p-4 bg-green-50 text-green-800 text-sm">
              <div className="flex items-center gap-2">
                <FiCheck className="text-green-500" size={16} />
                <p>{serverMessage}</p>
              </div>
            </div>
          )}

          {/* Chat content */}
          <div className="p-4">
            {success ? (
              <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 flex items-center gap-2">
                <FiCheck className="flex-shrink-0" />
                <span>
                  {serverMessage || "Message sent successfully!"}
                </span>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            ) : (
              <p className="text-gray-600 text-sm mb-4">
                Hi there! Send me a message and I'll get back to you soon.
              </p>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-black"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-black"
                  placeholder="Type your message here"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || success}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors ${
                  (isLoading || success) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    {success ? 'Sent Successfully' : 'Send Message'}
                  </>
                )}
              </button>
              
              {success && (
                <div className="text-center mt-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setName('');
                      setMessage('');
                      setServerMessage('');
                    }}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 