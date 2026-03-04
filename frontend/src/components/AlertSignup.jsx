import React, { useState } from 'react'
import { Bell, CheckCircle, AlertCircle } from 'lucide-react'
import { signupSubscriber } from '../api/airquality'

export default function AlertSignup({ zipCode }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('Parent')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')

  const formatPhoneNumber = (value) => {
    const v = value.replace(/\D/g, '')
    if (v.length <= 3) return v
    if (v.length <= 6) return `(${v.slice(0, 3)}) ${v.slice(3)}`
    return `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6, 10)}`
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (!name.trim()) {
        throw new Error('Please enter your name')
      }
      if (!phone || phone.replace(/\D/g, '').length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number')
      }
      if (!zipCode) {
        throw new Error('Zip code is required')
      }

      await signupSubscriber(name.trim(), phone.replace(/\D/g, ''), zipCode, role)

      setStatus('success')
      setMessage('✅ You\'re subscribed! Check your phone for a welcome text.')
      setName('')
      setPhone('')
      setRole('Parent')
      setTimeout(() => {
        setStatus(null)
        setMessage('')
      }, 5000)
    } catch (error) {
      setStatus('error')
      setMessage(`❌ ${error.message || 'Failed to subscribe'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border-2 border-blue-300 rounded-lg p-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Subscribe to Alerts</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="(555) 123-4567"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Zip Code</label>
          <input
            type="text"
            value={zipCode}
            disabled={true}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            disabled={loading}
          >
            <option value="Parent">Parent</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">School Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition mt-6"
        >
          {loading ? 'Subscribing...' : 'Subscribe to Alerts'}
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-green-700 text-sm">{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{message}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6 text-center">
        Your number is only used for AirAware alerts. Never sold.
      </p>
    </div>
  )
}
