import axiosInstance from './axiosInstance';

/**
 * Authentication & Profile
 */
export const donorLogin = (credentials) => axiosInstance.post('/auth/login', credentials);

// Updated to match the flattened backend controller and include the 'DONOR' role
// src/api/donorApi.js

export const donorRegister = (payload) => axiosInstance.post('/auth/register', payload);

export const getDonorProfile = () => axiosInstance.get('/donor/profile');

/**
 * Hospital & Broadcast Discovery
 */
// Fetches only verified hospitals for safe donation
export const getHospitals = () => axiosInstance.get('/donor/hospitals');

// Fetches emergency broadcasts from the blood_requests table
export const getEmergencyRequests = () => axiosInstance.get('/donor/emergency-requests');

/**
 * Appointments & History
 */
// Creates a record in the 'appointments' table
export const bookAppointment = (data) => axiosInstance.post('/donor/appointments', data);

// Fetches the donor's personalized history from the 'donations' table
export const getDonationHistory = () => axiosInstance.get('/donor/history');
export const getMyFeed = () => axiosInstance.get('/donor/feed');

// Add this new function to your API file
export const respondToRequest = async (requestId) => {
  return await axiosInstance.post('/donor/respond', { requestId });
};