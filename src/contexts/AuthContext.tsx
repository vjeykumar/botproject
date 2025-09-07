import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await apiService.login(credentials);
      if (response.user) {
        // Ensure compatibility with components expecting a `uid` property
        if (!response.user.uid) {
          response.user.uid = response.user.id;
        }

        // Check if user is admin based on email or explicit role
        if (response.user.email.toLowerCase().includes('admin') || response.user.role === 'admin') {
          response.user.role = 'admin';
        } else {
          response.user.role = 'user';
        }
      }
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('access_token', response.access_token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await apiService.register(userData);
      if (response.user) {
        // New registrations are regular users
        response.user.role = 'user';

        // Provide a uid field for components built with Firebase-style auth
        if (!response.user.uid) {
          response.user.uid = response.user.id;
        }
      }
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('access_token', response.access_token);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  // Check for existing user on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('access_token');
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && !parsedUser.uid && parsedUser.id) {
          parsedUser.uid = parsedUser.id;
        }
        setUser(parsedUser);
      } catch {
        // Ignore parsing errors and clear invalid data
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};