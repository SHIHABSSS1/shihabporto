'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-primary-600 mb-4">Shihab</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              A showcase of my creative work, skills, and achievements. Feel free to browse
              through my projects and get in touch if you're interested in collaborating.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/portfolio"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link 
                  href="/gallery"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400">
                shihabhossain596@gmail.com
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                +8801745368299
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                Dhaka, Bangladesh
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {currentYear} Shihab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 