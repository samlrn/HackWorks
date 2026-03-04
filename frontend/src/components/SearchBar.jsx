import React, { useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ onSearch, placeholder = "Enter ZIP code" }) {
  const [zipCode, setZipCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!zipCode.trim()) {
      setError('Please enter a ZIP code')
      return
    }

    if (!/^\d{5}$/.test(zipCode.trim())) {
      setError('Please enter a valid 5-digit ZIP code')
      return
    }

    onSearch(zipCode.trim())
    setZipCode('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder={placeholder}
            className={`w-full px-6 py-4 text-lg border-2 rounded-lg focus:outline-none focus:border-blue-600 transition ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            maxLength="5"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Search size={24} />
          </button>
        </div>
        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      </div>
    </form>
  )
}
