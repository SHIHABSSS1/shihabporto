'use client';

import { useState } from 'react';
import { FiSend, FiMessageCircle, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function MessageContact() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Send the message to the server API endpoint instead of WhatsApp
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Reset form and show success message
      setName('');
      setMessage('');
      setIsSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <FiMessageCircle className="text-primary-600" size={24} />
        <h3 className="text-xl font-bold">Send me a message</h3>
      </div>
      
      {isSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-green-50 text-green-800 rounded-md flex items-center gap-2"
        >
          <FiCheck />
          <span>Message sent successfully! I'll get back to you soon.</span>
        </motion.div>
      )}
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-red-50 text-red-800 rounded-md"
        >
          {error}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800"
            placeholder="Your name"
            required
          />
        </div>
        
        <div>
          <label 
            htmlFor="message" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800"
            placeholder="Your message"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              Sending...
            </>
          ) : (
            <>
              <FiSend />
              Send Message
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          Your message will be sent directly to my inbox. I'll respond as soon as possible.
        </p>
      </form>
    </div>
  );
} 