import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDonorProfile } from '../api/donorApi';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to sync donor profile from PostgreSQL
  const fetchProfile = async () => {
    try {
      const { data } = await getDonorProfile();
      setUser(data);
      localStorage.setItem('donorUser', JSON.stringify(data));
    } catch (error) {
      console.error("Session expired or invalid");
      logout(); // Clean up if profile fetch fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('donorToken');
    const storedUser = localStorage.getItem('donorUser');
    
    // Immediate load from local storage for better UX
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('donorToken', token);
    localStorage.setItem('donorUser', JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome back, ${userData.name || 'Donor'}!`);
  };

  const logout = () => {
    localStorage.removeItem('donorToken');
    localStorage.removeItem('donorUser');
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);