'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FiRefreshCw, 
  FiLogOut, 
  FiSave, 
  FiEye, 
  FiEyeOff, 
  FiCheck, 
  FiAlertCircle 
} from 'react-icons/fi';
import { 
  FaInstagram, 
  FaFacebook, 
  FaTelegram, 
  FaWhatsapp, 
  FaTiktok 
} from 'react-icons/fa';
import { SiSignal } from 'react-icons/si';

// Define interface for social media account
interface SocialMediaAccount {
  platform: string;
  username: string;
  displayName: string;
  url: string;
  icon: string;
  color: string;
}

export default function SocialMediaAdminPage() {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  
  // Simple authentication check
  const correctPassword = 'shihab123'; // Simple password for demonstration
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      setAuthenticated(true);
      fetchSocialMediaAccounts();
    }
  }, []);
  
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      fetchSocialMediaAccounts();
    } else {
      setError('Incorrect password');
    }
  };
  
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };
  
  const fetchSocialMediaAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/social-media');
      
      if (!response.ok) {
        throw new Error('Failed to fetch social media accounts');
      }
      
      const data = await response.json();
      setAccounts(data.accounts || []);
      setError('');
    } catch (err) {
      setError('Error fetching social media accounts. Please try again.');
      console.error('Error fetching social media accounts:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const updateAccount = async (platform: string, updates: Partial<SocialMediaAccount>) => {
    setSaving(platform);
    try {
      const response = await fetch('/api/social-media', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform, updates }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update social media account');
      }
      
      const data = await response.json();
      
      // Update the account in the local state
      setAccounts(prevAccounts => 
        prevAccounts.map(account => 
          account.platform === platform ? { ...account, ...updates } : account
        )
      );
      
      setSuccess(`${platform.charAt(0).toUpperCase() + platform.slice(1)} account updated successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(`Error updating ${platform} account. Please try again.`);
      console.error(`Error updating ${platform} account:`, err);
    } finally {
      setSaving(null);
    }
  };
  
  // Get icon component based on platform
  const getIconComponent = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <FaInstagram className="text-white text-xl" />;
      case 'facebook':
        return <FaFacebook className="text-white text-xl" />;
      case 'telegram':
        return <FaTelegram className="text-white text-xl" />;
      case 'signal':
        return <SiSignal className="text-white text-xl" />;
      case 'whatsapp':
        return <FaWhatsapp className="text-white text-xl" />;
      case 'tiktok':
        return <FaTiktok className="text-white text-xl" />;
      default:
        return null;
    }
  };
  
  // Helper function to convert bg color to text color
  const getTextColorClass = (colorClass: string) => {
    if (colorClass.includes('gradient')) {
      return 'text-transparent bg-clip-text ' + colorClass;
    }
    
    if (colorClass === 'bg-black') {
      return 'text-black';
    }
    
    // For solid colors, just replace bg- with text-
    return colorClass.replace('bg-', 'text-');
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Social Media Accounts
              </span>
            </h1>
            
            <div className="flex items-center gap-2">
              <button
                onClick={fetchSocialMediaAccounts}
                className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all"
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
                className="flex items-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-all"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md flex items-center gap-2 border border-red-700">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-900/50 text-green-200 rounded-md flex items-center gap-2 border border-green-700">
              <FiCheck />
              <span>{success}</span>
            </div>
          )}
          
          <p className="text-gray-400 mb-6">
            Manage your social media account usernames and URLs. These settings control the links on your website.
          </p>
          
          {loading && !accounts.length ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
              <p className="text-gray-400">Loading social media accounts...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {accounts.map((account) => (
                <div 
                  key={account.platform}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`${account.color} rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-glow`}>
                      {getIconComponent(account.platform)}
                    </div>
                    <h2 className={`text-xl font-semibold ${getTextColorClass(account.color)}`}>{account.displayName}</h2>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label 
                        htmlFor={`username-${account.platform}`}
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Username
                      </label>
                      <input
                        id={`username-${account.platform}`}
                        type="text"
                        value={account.username}
                        onChange={(e) => setAccounts(prevAccounts => 
                          prevAccounts.map(a => 
                            a.platform === account.platform ? { ...a, username: e.target.value } : a
                          )
                        )}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label 
                        htmlFor={`url-${account.platform}`}
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Profile URL
                      </label>
                      <input
                        id={`url-${account.platform}`}
                        type="url"
                        value={account.url}
                        onChange={(e) => setAccounts(prevAccounts => 
                          prevAccounts.map(a => 
                            a.platform === account.platform ? { ...a, url: e.target.value } : a
                          )
                        )}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => updateAccount(account.platform, { 
                        username: account.username,
                        url: account.url
                      })}
                      disabled={saving === account.platform}
                      className={`flex items-center gap-2 py-2 px-4 rounded-md transition-all ${
                        account.color.includes('gradient') 
                          ? account.color.replace('bg-', 'bg-') + ' text-white hover:opacity-90' 
                          : account.color + ' text-white hover:opacity-90'
                      }`}
                    >
                      {saving === account.platform ? (
                        <>
                          <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave size={16} />
                          Save Changes
                        </>
                      )}
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