'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-navy/90 transition-colors duration-300 border-b border-taupe/20 dark:border-lavender/20">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/home" className="text-xl font-bold font-heading text-navy dark:text-sand">
          CineSky
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1">
          <div className="flex space-x-1">
            <Link href="/home" className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20">
              Dashboard
            </Link>
            <Link href="/search" className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20">
              Search
            </Link>
            <Link href="/golden-hour" className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20">
              Golden Hour
            </Link>
            <Link href="/timeline" className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20">
              Timeline
            </Link>
            <Link href="/mapview" className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20">
              Locations
            </Link>
            <Link href="/about" className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20">
              About
            </Link>
            <Link href="/contact" className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20">
              Contact
            </Link>
          </div>

          <div className="flex items-center ml-4 space-x-2">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {currentUser ? (
              <button 
                onClick={handleLogout} 
                className="btn-primary"
              >
                Sign Out
              </button>
            ) : (
              <Link href="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20 focus:outline-none"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-taupe/20 dark:border-lavender/20">
          <div className="flex flex-col space-y-1 px-2 pb-3 pt-2">
            <Link 
              href="/home" 
              className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/search" 
              className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20"
              onClick={() => setIsOpen(false)}
            >
              Search
            </Link>
            <Link 
              href="/golden-hour" 
              className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20"
              onClick={() => setIsOpen(false)}
            >
              Golden Hour
            </Link>
            <Link 
              href="/timeline" 
              className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20"
              onClick={() => setIsOpen(false)}
            >
              Timeline
            </Link>
            <Link 
              href="/mapview" 
              className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20"
              onClick={() => setIsOpen(false)}
            >
              Locations
            </Link>
            <Link 
              href="/about" 
              className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            {currentUser && (
              <button 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }} 
                className="text-left px-3 py-2 rounded-md text-navy dark:text-sand hover:bg-sand/20 dark:hover:bg-lavender/20"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 