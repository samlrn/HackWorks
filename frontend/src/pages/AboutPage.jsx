import React from 'react'
import { CheckCircle, Target, Lightbulb, Zap, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  const roadmapItems = [
    {
      icon: Zap,
      title: 'IoT Sensor Network',
      description: 'Deploy real-time air quality sensors at NC schools for hyperlocal monitoring.'
    },
    {
      icon: TrendingUp,
      title: 'School Nurse Integration',
      description: 'Direct API integration with existing school health systems and nurse dashboards.'
    },
    {
      icon: Target,
      title: 'District-Wide Dashboards',
      description: 'Comprehensive administrative dashboards for school district decision-makers.'
    },
    {
      icon: Lightbulb,
      title: 'IBM Watson AI',
      description: 'Integration with IBM watsonx for advanced predictive modeling and trending.'
    },
    {
      icon: CheckCircle,
      title: 'National Expansion',
      description: 'Scale AirAware to all 50 states to protect millions of children with asthma.'
    }
  ]

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Mission */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About AirAware</h1>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <p className="text-lg text-gray-800 font-semibold mb-2">Our Mission</p>
            <p className="text-gray-700 leading-relaxed">
              To protect children with asthma in North Carolina schools by providing real-time, 
              AI-powered air quality information that enables parents and educators to make informed 
              decisions about outdoor activities.
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem</h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>1 in 11 children in North Carolina have asthma</strong> — making our state one of 
              the top 15 states for asthma-related hospitalizations. Yet most schools lack real-time 
              air quality monitoring, forcing administrators to make critical decisions about outdoor 
              activities without current data.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              The average cost of childhood asthma is <strong>$3,200 per child annually</strong>, 
              including medical visits, prescriptions, and lost school days. An asthma attack during 
              physical education class or outdoor recess can have serious, lasting consequences.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>Today, zero North Carolina schools have integrated real-time air quality monitoring.</strong>
            </p>
          </div>
        </section>

        {/* The Solution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time EPA Data</h3>
              <p className="text-gray-700">
                We pull live air quality indices from the EPA's AirNow API, combining AQI readings 
                with weather forecasts to provide schools with the most current information.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Recommendations</h3>
              <p className="text-gray-700">
                Using Groq's Llama3 model, we analyze complex air quality and weather data to generate 
                clear, actionable recommendations tailored to schools' needs.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant SMS Alerts</h3>
              <p className="text-gray-700">
                Parents and administrators receive real-time text message alerts when air quality 
                becomes dangerous for children with asthma.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">Frontend</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>React 18 with Vite</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Tailwind CSS for styling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Recharts for data visualization</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">Backend</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Python 3.11+ with FastAPI</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Groq AI for recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Supabase (PostgreSQL) for data</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">APIs</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>EPA AirNow (air quality)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>OpenWeatherMap (forecasts)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Twilio (SMS distribution)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">Open Source & Future</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Open-source commitment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span>IBM watsonx AI enhancement</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Future Roadmap */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Future Roadmap</h2>
          <div className="space-y-4">
            {roadmapItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <Icon className="text-blue-600 flex-shrink-0" size={32} />
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-gray-700 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 p-8 bg-blue-600 text-white rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Join Us in Protecting NC Children</h2>
          <p className="mb-6">AirAware is an open-source project built by developers passionate about public health.</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-blue-50 transition"
          >
            View on GitHub
          </a>
        </section>
      </div>
    </div>
  )
}
