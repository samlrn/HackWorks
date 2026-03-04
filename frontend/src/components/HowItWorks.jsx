import React from 'react'
import { Satellite, Brain, Bell } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Satellite,
      title: 'We Monitor',
      description: 'Real-time EPA air quality data for your community, updated hourly.'
    },
    {
      icon: Brain,
      title: 'AI Analyzes',
      description: 'Advanced AI combines air quality, weather, and health data to generate actionable insights.'
    },
    {
      icon: Bell,
      title: 'You Act',
      description: 'Instant SMS alerts keep parents and schools informed and ready to protect children.'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">How AirAware Works</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Three simple steps to protect children with asthma in North Carolina schools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Icon className="text-blue-600" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {idx + 1}. {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 p-8 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-gray-700 font-medium">
            🎯 <span className="font-bold">Our Goal:</span> Zero asthma attacks at North Carolina schools through real-time, data-driven decision making.
          </p>
        </div>
      </div>
    </section>
  )
}
