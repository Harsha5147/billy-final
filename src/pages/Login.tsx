import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, AlertCircle } from 'lucide-react';
import { addUser, getUser } from '../utils/db';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        if (username === 'admin') {
          setError('Username "admin" is reserved');
          return;
        }

        const existingUser = await getUser(username);
        if (existingUser) {
          setError('Username already exists');
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        const userId = await addUser({
          username,
          password,
          fullName,
          userType: 'user'
        });

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'user');
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('fullName', fullName);
        navigate('/dashboard');
      } else {
        const user = await getUser(username);
        
        if (!user || user.password !== password) {
          setError('Invalid username or password');
          return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', user.userType);
        localStorage.setItem('userId', user.id!.toString());
        localStorage.setItem('fullName', user.fullName);
        
        if (user.userType === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-md w-full">
        <div className="glass-effect p-8 rounded-xl shadow-2xl backdrop-blur-lg bg-white/10">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
              {isSignUp ? (
                <User className="text-white" size={28} />
              ) : (
                <Shield className="text-white" size={28} />
              )}
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setUsername('');
                setPassword('');
                setFullName('');
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;