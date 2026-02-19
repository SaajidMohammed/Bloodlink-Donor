import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Security
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import FindHospitals from './pages/FindHospitals';
import MyAppointments from './pages/MyAppointments';
import Profile from './pages/Profile';

/**
 * Main Application Component
 * Handles routing and layout wrapping for the Donor Network.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected Donor Routes --- */}
        {/* All routes inside this group are wrapped in MainLayout and ProtectedRoute */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect from root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hospitals" element={<FindHospitals />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* --- 404 Catch-all --- */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <h1 className="text-6xl font-black text-slate-200 mb-4">404</h1>
              <p className="text-slate-500 font-medium mb-6">Oops! This page doesn't exist.</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="text-red-600 font-bold hover:underline"
              >
                Go back home
              </button>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;