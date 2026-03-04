import React from 'react'
import { TrendingUp, AlertCircle, DollarSign, Zap } from 'lucide-react'

export default function ImpactStats() {
  const stats = [
    {
      icon: AlertCircle,
      number: '1 in 11',
      label: 'NC Children with Asthma',
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      icon: TrendingUp,
      number: '200,000+',
      label: 'NC Kids at Risk Daily',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      icon: DollarSign,
      number: '$3,200',
      label: 'Avg Annual Asthma Cost Per Child',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      icon: Zap,
      number: '0',
      label: 'Schools with Real-Time Air Monitoring',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">The Challenge</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Asthma affects an alarming number of North Carolina children. AirAware is here to change that.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className={`${stat.bg} border border-gray-200 rounded-lg p-6 text-center transition hover:shadow-lg`}>
                <Icon className={`${stat.color} mx-auto mb-4`} size={40} />
                <p className={`${stat.color} text-3xl font-bold mb-2`}>
                  {stat.number}
                </p>
                <p className="text-gray-700 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
