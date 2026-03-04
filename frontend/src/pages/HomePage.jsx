import React from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ImpactStats from '../components/ImpactStats'
import HowItWorks from '../components/HowItWorks'

export default function HomePage() {
  const navigate = useNavigate()

  const handleSearch = (zipCode) => {
    navigate(`/dashboard?zip=${zipCode}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Real-time Air Quality Alerts for NC Schools
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Protecting children with asthma, one breath at a time.
          </p>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Enter your ZIP code (e.g., 27606)"
            />
          </div>

          <p className="text-sm text-gray-600">
            Popular NC zip codes: 27606 (Raleigh) • 27601 (Raleigh) • 28201 (Charlotte)
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <ImpactStats />

      {/* How It Works */}
      <HowItWorks />

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Protect Our Kids?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Subscribe to AirAware and get instant SMS alerts when air quality becomes dangerous for children with asthma.
          </p>
          <button
            onClick={() => navigate('/dashboard?zip=27606')}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition text-lg"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  )
}
