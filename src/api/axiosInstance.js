import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://bloodlink-server-g6ee.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('donorToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;