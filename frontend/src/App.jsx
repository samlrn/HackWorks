import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  const [demoMode, setDemoMode] = useState(false)

  const toggleDemoMode = () => {
    setDemoMode(!demoMode)
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header demoMode={demoMode} toggleDemoMode={toggleDemoMode} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage demoMode={demoMode} />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
