import React from 'react'
import { Cloud, Droplets, Wind } from 'lucide-react'

export default function WeatherPanel({ weather }) {
  if (!weather) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-gray-600 text-sm font-semibold mb-2">Temperature</p>
        <p className="text-2xl font-bold text-blue-600">{weather.temperature}°F</p>
        <p className="text-xs text-gray-500 mt-1">Feels like {weather.feels_like}°F</p>
      </div>

      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Humidity</p>
            <p className="text-2xl font-bold text-cyan-600">{weather.humidity}%</p>
          </div>
          <Droplets className="text-cyan-500" size={24} />
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Wind Speed</p>
            <p className="text-2xl font-bold text-purple-600">{weather.wind_speed} mph</p>
            <p className="text-xs text-gray-500 mt-1">{weather.wind_direction}</p>
          </div>
          <Wind className="text-purple-500" size={24} />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-2">Conditions</p>
            <p className="text-lg font-bold text-yellow-700">{weather.description}</p>
          </div>
          <Cloud className="text-yellow-500" size={24} />
        </div>
      </div>
    </div>
  )
}
