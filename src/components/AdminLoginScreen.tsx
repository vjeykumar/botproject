import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield, Diamond, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLoginScreenProps {
  onLogin: () => void;
  onBackToUser: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onLogin, onBackToUser }) => {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Admin login attempt:', formData.email);
    // Check admin code first
    if (formData.adminCode !== 'ADMIN2025') {
      setError('Invalid admin access code');
      setAttempts(prev => prev + 1);
      setIsLoading(false);
      return;
    }

    // Check for too many attempts
    if (attempts >= maxAttempts) {
      setError('Too many failed attempts. Please try again later.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting admin login...');
      await login({
        email: formData.email,
        password: formData.password
      });
      
      console.log('Admin login successful');
      onLogin();
    } catch (error: any) {
      console.error('Admin login error:', error);
      setAttempts(prev => prev + 1);
      
      if (error.message.includes('Unable to connect to server')) {
        setError('Cannot connect to server. Please ensure the backend is running.');
      } else if (error.message.includes('HTTP error')) {
        const statusMatch = error.message.match(/status: (\d+)/);
        if (statusMatch && statusMatch[1] === '401') {
          setError('Invalid admin credentials. Please check your email and password.');
        } else {
          setError('Server error. Please try again.');
        }
      } else {
        setError(error.message || 'Admin authentication failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isBlocked = attempts >= maxAttempts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-center relative">
          <div className="absolute top-4 left-4">
            <button
              onClick={onBackToUser}
              className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-1"
            >
              <User className="h-4 w-4" />
              <span>User Login</span>
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="relative">
              <Shield className="h-8 w-8 text-red-400" />
              <Diamond className="h-4 w-4 text-red-200 absolute top-0 right-0" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          </div>
          <p className="text-gray-300">Secure Administrative Access</p>
          
          {/* Security Badge */}
          <div className="mt-4 inline-flex items-center space-x-2 bg-red-900/30 px-3 py-1 rounded-full">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-red-200 text-sm">Restricted Access</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {isBlocked && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 font-medium">Account Temporarily Locked</p>
              </div>
              <p className="text-red-600 text-sm mt-1">
                Too many failed login attempts. Please contact system administrator.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Access Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Access Code *
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleInputChange}
                  required
                  disabled={isBlocked}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:bg-gray-100"
                  placeholder="Enter admin access code"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isBlocked}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:bg-gray-100"
                  placeholder="admin@edgecraftglass.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isBlocked}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:bg-gray-100"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium text-sm">Security Notice</p>
                  <p className="text-yellow-700 text-xs mt-1">
                    All admin activities are logged and monitored. Unauthorized access attempts will be reported.
                  </p>
                </div>
              </div>
            </div>

            {/* Attempt Counter */}
            {attempts > 0 && (
              <div className="text-center">
                <p className="text-sm text-red-600">
                  Failed attempts: {attempts}/{maxAttempts}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loading || isBlocked}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading || loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Access Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Admin Credentials:</h4>
            <p className="text-xs text-gray-600">Access Code: ADMIN2025</p>
            <p className="text-xs text-gray-600">Email: admin@edgecraftglass.com</p>
            <p className="text-xs text-gray-600">Password: admin123</p>
          </div>

          {/* Security Features */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>2FA Ready</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="h-3 w-3" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Activity Logged</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>Monitored</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};