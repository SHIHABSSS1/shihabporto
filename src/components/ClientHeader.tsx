'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMessageSquare, FiUsers, FiMenu, FiX, FiSettings, FiMoon, FiSun } from 'react-icons/fi';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

export default function ClientHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const adminRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check dark mode preference
    const isDarkMode = document.cookie.includes('darkMode=true') || 
                      localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    
    // Apply dark mode class to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Set cookie and local storage
    document.cookie = `darkMode=${newDarkMode}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
    localStorage.setItem('darkMode', String(newDarkMode));
    
    // Apply dark mode class to html element
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Check for admin authentication
  useEffect(() => {
    const checkAdmin = () => {
      const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
      setIsAdmin(isAuthenticated);
    };
    
    // Check on mount
    checkAdmin();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkAdmin);
    
    // Also check periodically in case localStorage was updated in another component
    const interval = setInterval(checkAdmin, 5000);
    
    return () => {
      window.removeEventListener('storage', checkAdmin);
      clearInterval(interval);
    };
  }, []);

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-sm'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary-600">
          Shihab
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`transition-colors hover:text-primary-600 ${
                pathname === item.href
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200 hover:scale-110"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          
          {/* Admin dropdown menu */}
          {isAdmin && (
            <div className="relative" ref={adminRef}>
              <button
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  pathname?.startsWith('/admin')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                Admin
              </button>
              
              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1">
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/messages"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiMessageSquare className="mr-2" />
                    Messages
                  </Link>
                  <Link
                    href="/admin/social-media"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiUsers className="mr-2" />
                    Social Media
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiSettings className="mr-2" />
                    Settings
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Elements */}
        <div className="flex items-center space-x-4 md:hidden">
          {/* Theme Toggle Button (Mobile) */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          
          {/* Mobile Menu Button */}
          <button
            className="block md:hidden text-gray-800 dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-50 pt-20 bg-white dark:bg-gray-900 flex flex-col md:hidden">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-xl text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {isAdmin && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-3">Admin</h3>
                  <div className="space-y-3">
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/admin/messages"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiMessageSquare className="mr-2" />
                      Messages
                    </Link>
                    <Link
                      href="/admin/social-media"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiUsers className="mr-2" />
                      Social Media
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiSettings className="mr-2" />
                      Settings
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 