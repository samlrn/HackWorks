import React from 'react'
import { AlertTriangle } from 'lucide-react'

export default function AQIDisplay({ data, lastUpdated }) {
  if (!data) return null

  const getBackgroundColor = () => {
    const aqi = data.aqi
    if (aqi <= 50) return 'bg-green-50'
    if (aqi <= 100) return 'bg-yellow-50'
    if (aqi <= 150) return 'bg-orange-50'
    if (aqi <= 200) return 'bg-red-50'
    return 'bg-purple-50'
  }

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Just now'
    const date = new Date(lastUpdated)
    const now = new Date()
    const minutes = Math.floor((now - date) / 60000)
    if (minutes === 0) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleString()
  }

  return (
    <div className={`${getBackgroundColor()} border-4 rounded-xl p-8 md:p-12 aqi-color-transition animate-fadeIn`}
      style={{ borderColor: data.color }}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider">Current AQI for {data.zip_code}</p>
          <div className="aqi-display-huge text-black mt-4" style={{ color: data.color }}>
            {data.aqi}
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{data.category}</p>

          <div className="mt-6 space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Main Pollutant:</span> {data.main_pollutant}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {data.pollutant_description}
            </p>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Last updated: {formatLastUpdated()}
          </p>
        </div>

        {data.is_dangerous_for_asthma && (
          <div className="flex-shrink-0 pt-4">
            <div className="pulse-warning">
              <AlertTriangle size={48} className="text-red-600" />
            </div>
            <p className="text-red-600 font-bold text-xs mt-2 text-center">DANGER FOR<br/>CHILDREN WITH<br/>ASTHMA</p>
          </div>
        )}
      </div>
    </div>
  )
}
