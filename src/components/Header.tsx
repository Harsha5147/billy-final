import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 via-gray-900 to-black/70 backdrop-blur-md border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield size={32} className="text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-indigo-500 text-transparent bg-clip-text">
              Billy
            </span>
          </Link>

          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-cyan-300 transition-colors"
                >
                  Home
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li>
                    <Link
                      to="/chatbot"
                      className="text-gray-300 hover:text-cyan-300 transition-colors"
                    >
                      Chatbot
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/report"
                      className="text-gray-300 hover:text-cyan-300 transition-colors"
                    >
                      Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/community"
                      className="text-gray-300 hover:text-cyan-300 transition-colors"
                    >
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/statistics"
                      className="text-gray-300 hover:text-cyan-300 transition-colors"
                    >
                      Statistics
                    </Link>
                  </li>
                  {userType === 'admin' ? (
                    <li>
                      <Link
                        to="/admin"
                        className="text-gray-300 hover:text-cyan-300 transition-colors"
                      >
                        Admin
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link
                        to="/dashboard"
                        className="text-gray-300 hover:text-cyan-300 transition-colors"
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              )}
              {!isLoggedIn && (
                <li>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
