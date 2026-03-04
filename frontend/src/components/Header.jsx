import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'

export default function Header({ demoMode, toggleDemoMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600 hover:text-blue-700">
          <Activity size={32} />
          AirAware
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
            About
          </Link>
          <button
            onClick={toggleDemoMode}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              demoMode
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            {demoMode ? '⚡ Demo Mode' : 'Demo Mode'}
          </button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t px-6 py-4">
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">
              About
            </Link>
            <button
              onClick={toggleDemoMode}
              className={`px-4 py-2 rounded-lg font-medium transition text-left ${
                demoMode
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {demoMode ? '⚡ Demo Mode' : 'Demo Mode'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
