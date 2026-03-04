import React from 'react'
import { Activity, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={24} className="text-blue-400" />
              <p className="font-bold text-white text-lg">AirAware</p>
            </div>
            <p className="text-sm text-gray-400">
              Protecting children with asthma, one breath at a time.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-blue-400 transition">Home</a></li>
              <li><a href="/about" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="/dashboard" className="hover:text-blue-400 transition">Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Data Sources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.epa.gov/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">EPA Air Quality</a></li>
              <li><a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Weather Data</a></li>
              <li><a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">Groq AI</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <p className="text-sm text-gray-400 mb-2">
              Have questions or want to partner with AirAware?
            </p>
            <p className="text-sm">
              <a href="mailto:info@airaware.nc" className="text-blue-400 hover:text-blue-300">
                info@airaware.nc
              </a>
            </p>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p className="flex items-center gap-1">
            Made with <Heart size={16} className="text-red-500" /> for NC children
          </p>
          <p>© {currentYear} AirAware. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
