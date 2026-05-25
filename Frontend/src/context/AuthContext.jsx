import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure interceptor to attach JWT token to all requests automatically
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await axios.post('/api/auth/login', { usernameOrEmail, password });
      const { accessToken, id, username, email } = response.data;
      
      const userData = { id, username, email };
      setUser(userData);
      setToken(accessToken);
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('/api/auth/register', { username, email, password });
      return { success: true };
    } catch (error) {
      console.error('Registration error', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try a different username/email.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
