'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiCheck, FiTrash, FiRefreshCw, FiLogOut, FiInfo } from 'react-icons/fi';

interface Message {
  id: number;
  name: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  // Check for authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      setAuthenticated(true);
      fetchMessages();
    }
  }, []);
  
  // Simple authentication check - in a real app you would use proper authentication
  const correctPassword = 'shihab123'; // Simple password for demonstration
  
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      fetchMessages();
    } else {
      setError('Incorrect password');
    }
  };
  
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };
  
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
      setError('');
    } catch (err) {
      setError('Error fetching messages. Please try again.');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (id: number) => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
      
      // Update the message in the local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === id ? { ...msg, read: true } : msg
        )
      );
    } catch (err) {
      setError('Error marking message as read. Please try again.');
      console.error('Error marking message as read:', err);
    } finally {
      setActionLoading(null);
    }
  };
  
  const deleteMessage = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    setActionLoading(id);
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
      
      // Remove the message from the local state
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== id)
      );
    } catch (err) {
      setError('Error deleting message. Please try again.');
      console.error('Error deleting message:', err);
    } finally {
      setActionLoading(null);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!authenticated) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleAuthenticate}>
                <div className="mb-4">
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Messages from Visitors</h1>
            
            <div className="flex items-center gap-2">
              <button
                onClick={fetchMessages}
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <FiRefreshCw size={16} />
                )}
                Refresh
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
              <p className="text-gray-600">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No messages yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`p-4 rounded-lg shadow ${message.read ? 'bg-gray-50' : 'bg-white border-l-4 border-blue-500'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-orange-600">{message.name}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                  
                  <p className="mb-4 text-gray-700 whitespace-pre-wrap">
                    {message.message}
                  </p>
                  
                  <div className="flex justify-end gap-2">
                    {!message.read && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        disabled={actionLoading === message.id}
                        className="flex items-center gap-1 text-xs text-gray-600 hover:text-green-600 px-2 py-1 rounded-md border border-gray-300 hover:border-green-300 disabled:opacity-50"
                      >
                        {actionLoading === message.id ? (
                          <span className="inline-block animate-spin h-3 w-3 border-2 border-green-500 border-t-transparent rounded-full"></span>
                        ) : (
                          <FiCheck size={14} />
                        )}
                        Mark as Read
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteMessage(message.id)}
                      disabled={actionLoading === message.id}
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 px-2 py-1 rounded-md border border-gray-300 hover:border-red-300 disabled:opacity-50"
                    >
                      {actionLoading === message.id ? (
                        <span className="inline-block animate-spin h-3 w-3 border-2 border-red-500 border-t-transparent rounded-full"></span>
                      ) : (
                        <FiTrash size={14} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 