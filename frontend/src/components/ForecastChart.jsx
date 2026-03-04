import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts'

export default function ForecastChart({ forecast }) {
  if (!forecast || forecast.length === 0) return null

  const getBarColor = (aqi) => {
    if (aqi <= 50) return '#00E400'
    if (aqi <= 100) return '#FFFF00'
    if (aqi <= 150) return '#FF7E00'
    if (aqi <= 200) return '#FF0000'
    return '#8F3F97'
  }

  const colors = forecast.map(item => getBarColor(item.aqi_estimate))

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-800 mb-4">24-Hour AQI Forecast</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={forecast}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 200]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }}
            formatter={(value, name) => {
              if (name === 'aqi_estimate') return [value, 'AQI']
              if (name === 'temperature') return [value + '°F', 'Temp']
              return value
            }}
          />
          <Legend />
          <ReferenceLine y={100} stroke="#FF0000" strokeDasharray="5 5" label={{ value: 'Asthma Danger Zone', position: 'right', fill: '#FF0000' }} />
          <Bar dataKey="aqi_estimate" name="AQI" radius={[8, 8, 0, 0]}>
            {forecast.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="aqi_estimate" fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {forecast.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <p className="text-gray-700">{item.time}: <span className="font-bold">{item.temperature}°F</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}
