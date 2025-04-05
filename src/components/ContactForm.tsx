'use client';

import { useState, FormEvent } from 'react';
import { FiSend, FiCheck, FiAlertTriangle } from 'react-icons/fi';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      
      const data = await response.json();
      
      // Check if the response has success property (regardless of HTTP status)
      if (data.success === false || !response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      // If we get here, we know it succeeded - either because data.success is true
      // or because response.ok is true and data.success isn't false
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err: any) {
      console.error('Contact form error:', err);
      setError(err.message || 'An error occurred while sending your message');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all">
      <h2 className="text-2xl font-bold mb-6">Send Me a Message</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-md flex items-center gap-2">
          <FiAlertTriangle />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded-md flex items-center gap-2">
          <FiCheck />
          <span>Your message has been sent successfully!</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter your message"
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Sending...
              </>
            ) : (
              <>
                <FiSend />
                Send Message
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 