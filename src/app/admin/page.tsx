'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FiMessageSquare, 
  FiEdit, 
  FiUsers, 
  FiSettings,
  FiAlertTriangle
} from 'react-icons/fi';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const router = useRouter();
  
  // Check for authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      setAuthenticated(true);
      checkMaintenanceMode();
    }
  }, []);
  
  const checkMaintenanceMode = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setMaintenanceMode(data.settings.maintenanceMode);
      }
    } catch (err) {
      console.error('Error checking maintenance mode:', err);
    }
  };
  
  // Simple authentication check
  const correctPassword = 'shihab123'; // Simple password for demonstration
  
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      checkMaintenanceMode();
    } else {
      setError('Incorrect password');
    }
  };
  
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };
  
  if (!authenticated) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 bg-gray-900 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <h1 className="text-2xl font-bold mb-6 text-center text-white">Admin Access</h1>
              
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md border border-red-700">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleAuthenticate}>
                <div className="mb-4">
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all"
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
      <main className="pt-24 pb-16 bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
                  Admin Dashboard
                </span>
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your website content and settings
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-all"
            >
              Logout
            </button>
          </div>
          
          {maintenanceMode && (
            <div className="mb-8 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg flex items-start gap-3">
              <FiAlertTriangle className="text-yellow-300 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-yellow-200">Maintenance Mode is Active</h3>
                <p className="text-yellow-100/90 mt-1">
                  Your website is currently in maintenance mode. Visitors will see a maintenance message.
                </p>
                <Link 
                  href="/admin/settings" 
                  className="inline-block mt-2 text-yellow-200 hover:text-yellow-100 underline"
                >
                  Manage Maintenance Mode
                </Link>
              </div>
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Messages Card */}
            <Link
              href="/admin/messages"
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-900/30 rounded-lg text-blue-400 group-hover:bg-blue-900/50 group-hover:text-blue-300 transition-all">
                  <FiMessageSquare size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Messages</h2>
              </div>
              <p className="text-gray-400 mb-4">
                View and manage messages from your visitors
              </p>
              <div className="text-blue-400 group-hover:text-blue-300 transition-all">
                View Messages →
              </div>
            </Link>
            
            {/* Content Editor Card */}
            <Link
              href="/admin/content"
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-900/30 rounded-lg text-purple-400 group-hover:bg-purple-900/50 group-hover:text-purple-300 transition-all">
                  <FiEdit size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Content Editor</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Edit your website content and portfolio projects
              </p>
              <div className="text-purple-400 group-hover:text-purple-300 transition-all">
                Edit Content →
              </div>
            </Link>
            
            {/* Social Media Card */}
            <Link
              href="/admin/social-media"
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-pink-900/30 rounded-lg text-pink-400 group-hover:bg-pink-900/50 group-hover:text-pink-300 transition-all">
                  <FiUsers size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Social Media</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Manage your social media accounts and links
              </p>
              <div className="text-pink-400 group-hover:text-pink-300 transition-all">
                Manage Social Media →
              </div>
            </Link>
            
            {/* Website Settings Card */}
            <Link
              href="/admin/settings"
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-all group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-900/30 rounded-lg text-green-400 group-hover:bg-green-900/50 group-hover:text-green-300 transition-all">
                  <FiSettings size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Website Settings</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Manage website settings, password, and maintenance mode
              </p>
              <div className="text-green-400 group-hover:text-green-300 transition-all">
                Manage Settings →
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 