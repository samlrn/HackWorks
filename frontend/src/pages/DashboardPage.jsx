import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import AQIDisplay from '../components/AQIDisplay'
import RecommendationBox from '../components/RecommendationBox'
import WeatherPanel from '../components/WeatherPanel'
import ForecastChart from '../components/ForecastChart'
import AlertSignup from '../components/AlertSignup'
import SubscriberCount from '../components/SubscriberCount'
import { getAirQuality } from '../api/airquality'
import { AlertCircle } from 'lucide-react'

export default function DashboardPage({ demoMode }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialZip = searchParams.get('zip') || ''

  const [zipCode, setZipCode] = useState(initialZip)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoModeActive] = useState(demoMode)

  const suggestedZipCodes = ['27601', '27606', '27609', '27513', '28201']

  useEffect(() => {
    if (initialZip) {
      fetchAirQuality(initialZip)
    }
  }, [initialZip])

  const fetchAirQuality = async (zip) => {
    if (!zip || zip.length !== 5) {
      setError('Please enter a valid 5-digit ZIP code')
      return
    }

    setLoading(true)
    setError('')
    setData(null)

    try {
      const result = await getAirQuality(zip)
      setData(result)
      setZipCode(zip)
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch air quality data'
      setError(errorMsg)
      setZipCode('')

      if (err.message.includes('No air quality data found')) {
        setError(
          `No data available for ${zip}. Try these NC zip codes: ${suggestedZipCodes.join(', ')}`
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (zip) => {
    navigate(`/dashboard?zip=${zip}`)
    fetchAirQuality(zip)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {demoModeActive && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-bold text-yellow-900">Demo Mode Active</p>
              <p className="text-sm text-yellow-800">Showing simulated dangerous AQI for testing purposes.</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} placeholder="Enter ZIP code to check air quality" />
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="spinner mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading air quality data...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <p className="font-bold text-red-900">Error</p>
              <p className="text-red-800 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-8">
            <AQIDisplay data={data} lastUpdated={data.last_updated} />

            <RecommendationBox data={data} zipCode={data.zip_code} demoMode={demoModeActive} />

            <WeatherPanel weather={data.weather} />

            <ForecastChart forecast={data.forecast} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AlertSignup zipCode={data.zip_code} />
              </div>
              <div>
                <SubscriberCount count={data.subscriber_count} zipCode={data.zip_code} />
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !data && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">Enter a ZIP code to view air quality data and get started with alerts.</p>
            <p className="text-sm text-gray-500">Popular NC zip codes: {suggestedZipCodes.join(' • ')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
