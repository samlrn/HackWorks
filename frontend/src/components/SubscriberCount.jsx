import React from 'react'
import { Users } from 'lucide-react'

export default function SubscriberCount({ count, zipCode }) {
  if (count === undefined || count === null) return null

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <Users size={32} className="text-blue-600" />
        <div>
          <p className="text-gray-600 text-sm font-semibold">Active Subscribers</p>
          <p className="text-3xl font-bold text-blue-600">{count}</p>
          <p className="text-xs text-gray-500 mt-1">Currently receiving alerts for {zipCode}</p>
        </div>
      </div>
    </div>
  )
}
