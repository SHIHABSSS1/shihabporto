'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiSave, FiRefreshCw, FiLogOut, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';

interface SiteSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  adminPassword?: string;
  darkMode: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  
  // Default admin password
  const defaultPassword = 'shihab123';
  
  // Check for authentication on component mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      setAuthenticated(true);
      fetchSettings();
    } else {
      router.push('/admin');
    }
  }, [router]);
  
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      setSettings(data.settings);
      setError('');
    } catch (err) {
      setError('Error fetching settings. Please try again.');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };
  
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings) return;
    
    // Use default password if the current password field is empty
    const passwordToUse = currentPassword || defaultPassword;
    
    // Validate input if changing password
    if (newPassword) {
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
    }
    
    setSaving(true);
    setError('');
    
    try {
      const updates: Partial<SiteSettings> & { adminPassword?: string } = {
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
      };
      
      // Only include password in updates if it's being changed
      if (newPassword) {
        updates.adminPassword = newPassword;
      }
      
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordToUse,
          updates,
        }),
      });
      
      // Handle both successful and error responses
      const data = await response.json();
      
      if (!response.ok) {
        // Server returned an error
        throw new Error(data.error || 'Failed to update settings');
      }
      
      // Update UI even if server storage failed - the in-memory settings are updated
      // This lets us handle Vercel's file system limitations
      
      // Update local state with the desired settings (regardless of server state)
      // This ensures that the UI reflects what the user intended to set
      const updatedSettings: SiteSettings = {
        ...settings,
        ...updates,
      };
      
      // Update local state (remove adminPassword from local state)
      const { adminPassword, ...publicSettings } = updatedSettings;
      setSettings(publicSettings as SiteSettings);
      
      // Set maintenance mode cookie in the browser to ensure it works
      // even if server-side cookies failed
      document.cookie = `maintenance_mode=${String(updates.maintenanceMode)}; path=/; max-age=${60 * 60 * 24 * 30}`;
      
      if (updates.maintenanceMessage) {
        document.cookie = `maintenance_message=${encodeURIComponent(updates.maintenanceMessage)}; path=/; max-age=${60 * 60 * 24 * 30}`;
      }
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setSuccess('Settings updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error('Error updating settings:', err);
      setError(err.message || 'Error updating settings. Please try again.');
      
      // Even if there's an error with the API, we can still update the UI for maintenance mode
      // This helps work around Vercel's stateless environment
      try {
        // Set maintenance mode cookie in the browser directly
        document.cookie = `maintenance_mode=${String(settings.maintenanceMode)}; path=/; max-age=${60 * 60 * 24 * 30}`;
        
        if (settings.maintenanceMessage) {
          document.cookie = `maintenance_message=${encodeURIComponent(settings.maintenanceMessage)}; path=/; max-age=${60 * 60 * 24 * 30}`;
        }
        
        // Inform the user that it might still work
        setSuccess('Maintenance mode might still work through cookies!');
      } catch (cookieErr) {
        console.error('Failed to set cookies directly:', cookieErr);
      }
    } finally {
      setSaving(false);
    }
  };
  
  if (!authenticated) {
    return null; // Will redirect to login in useEffect
  }
  
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
                  Website Settings
                </span>
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your website settings and security
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={fetchSettings}
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
              <FiAlertTriangle />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-900/50 text-green-200 rounded-md flex items-center gap-2 border border-green-700">
              <FiSave />
              <span>{success}</span>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-2"></div>
              <p className="text-gray-400">Loading settings...</p>
            </div>
          ) : settings ? (
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-6 text-white">Maintenance Mode</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenance-mode"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({
                        ...settings,
                        maintenanceMode: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="maintenance-mode" className="ml-3 text-gray-300">
                      Enable maintenance mode
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Maintenance Message
                    </label>
                    <textarea
                      value={settings.maintenanceMessage}
                      onChange={(e) => setSettings({
                        ...settings,
                        maintenanceMessage: e.target.value
                      })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      rows={3}
                      placeholder="Message to display during maintenance mode"
                    />
                  </div>
                  
                  {settings.maintenanceMode && (
                    <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-md text-yellow-200 text-sm">
                      <div className="flex items-start gap-2">
                        <FiAlertTriangle className="text-yellow-300 mt-0.5" />
                        <div>
                          <p className="font-medium">Maintenance Mode is currently ACTIVE</p>
                          <p className="mt-1">Your site visitors will see the maintenance message instead of your website content.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-6 text-white">Change Admin Password</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Current Password (optional - default is shihab123)
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white pr-10"
                        placeholder="Enter your current password"
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      You can leave this blank if you're using the default password.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      New Password (leave blank to keep current)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white pr-10"
                        placeholder="Enter new password"
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                <h2 className="text-xl font-bold mb-6 text-white">Appearance Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="dark-mode"
                      checked={settings.darkMode}
                      onChange={(e) => setSettings({
                        ...settings,
                        darkMode: e.target.checked
                      })}
                      className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="dark-mode" className="ml-3 text-gray-300">
                      Enable dark mode by default
                    </label>
                  </div>
                  
                  <p className="text-gray-400 text-sm">
                    This setting will determine the default theme for new visitors. Users can still toggle the theme using the theme switch button.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg">
              <p className="text-gray-400">No settings found. Try refreshing.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 