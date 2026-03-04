import React, { useState } from 'react'
import { Brain, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { triggerAlert } from '../api/airquality'

export default function RecommendationBox({ data, zipCode, demoMode }) {
  const [alertTriggered, setAlertTriggered] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertLoading, setAlertLoading] = useState(false)
  const [recipientCount, setRecipientCount] = useState(0)

  if (!data) return null

  const getActionIcon = () => {
    if (data.ai_action_color === 'green') {
      return <CheckCircle size={32} className="text-green-600" />
    }
    if (data.ai_action_color === 'yellow') {
      return <AlertTriangle size={32} className="text-yellow-600" />
    }
    return <XCircle size={32} className="text-red-600" />
  }

  const getActionBgColor = () => {
    if (data.ai_action_color === 'green') return 'bg-green-50 border-green-200'
    if (data.ai_action_color === 'yellow') return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getActionTextColor = () => {
    if (data.ai_action_color === 'green') return 'text-green-700'
    if (data.ai_action_color === 'yellow') return 'text-yellow-700'
    return 'text-red-700'
  }

  const handleTriggerAlert = async () => {
    setAlertLoading(true)
    setAlertMessage('')
    try {
      const result = await triggerAlert(zipCode, demoMode ? 145 : null)
      setRecipientCount(result.recipients_count)
      setAlertMessage(`✅ Alert sent to ${result.recipients_count} subscribers`)
      setAlertTriggered(true)
      setTimeout(() => {
        setAlertTriggered(false)
        setAlertMessage('')
      }, 5000)
    } catch (error) {
      setAlertMessage(`❌ ${error.message || 'Failed to send alert'}`)
      setAlertTriggered(false)
    } finally {
      setAlertLoading(false)
    }
  }

  return (
    <div className="w-full animate-fadeIn">
      <div className={`border-l-4 p-6 rounded-lg ${getActionBgColor()}`}
        style={{ borderLeftColor: data.ai_action_color === 'green' ? '#16a34a' : data.ai_action_color === 'yellow' ? '#eab308' : '#dc2626' }}>
        <div className="flex items-start gap-4">
          <Brain size={28} className="text-gray-700 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">AI Recommendation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              {data.ai_recommendation}
            </p>

            <div className={`flex items-center gap-3 p-4 rounded-lg font-bold text-lg ${getActionBgColor()}`}>
              {getActionIcon()}
              <span className={getActionTextColor()}>
                {data.ai_action}
              </span>
            </div>

            {demoMode && (
              <button
                onClick={handleTriggerAlert}
                disabled={alertLoading}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {alertLoading ? 'Sending...' : '📱 Demo: Trigger SMS Alert'}
              </button>
            )}

            {alertMessage && (
              <div className="mt-3 p-3 bg-white rounded border border-gray-200 text-sm font-medium text-center">
                {alertMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
