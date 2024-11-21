import React from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, FileText, Users, BarChart2 } from 'lucide-react'
import ChatWidget from '../components/ChatWidget'

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6 text-white">Welcome to Billy</h1>
      <p className="text-xl mb-8 text-gray-300">Your buddy against cyber bullying</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/chatbot" className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
          <MessageCircle size={48} className="mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-semibold mb-2 text-white">Chat with Billy</h2>
          <p className="text-gray-300">Get instant help and comfort</p>
        </Link>
        <Link to="/report" className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
          <FileText size={48} className="mx-auto mb-4 text-green-500" />
          <h2 className="text-xl font-semibold mb-2 text-white">Report Incident</h2>
          <p className="text-gray-300">Anonymously report cyberbullying</p>
        </Link>
        <Link to="/community" className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
          <Users size={48} className="mx-auto mb-4 text-purple-500" />
          <h2 className="text-xl font-semibold mb-2 text-white">Join Community</h2>
          <p className="text-gray-300">Share experiences and support others</p>
        </Link>
        <Link to="/statistics" className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
          <BarChart2 size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2 text-white">View Statistics</h2>
          <p className="text-gray-300">See cybercrime data and hotspots</p>
        </Link>
      </div>

      {/* Hero section with image */}
      <div className="mt-16 mb-12">
        <img
          src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=1200&h=600"
          alt="Cyberbullying Prevention"
          className="rounded-xl shadow-2xl mx-auto max-w-4xl w-full object-cover"
        />
      </div>

      {/* Quick tips section */}
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white/10 backdrop-blur-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Quick Tips to Stay Safe Online</h2>
        <ul className="text-left space-y-3 text-gray-300">
          <li>• Never share personal information with strangers</li>
          <li>• Keep your social media profiles private</li>
          <li>• Save evidence of any harassment</li>
          <li>• Talk to a trusted adult if you feel threatened</li>
          <li>• Use strong, unique passwords for all accounts</li>
        </ul>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default Home