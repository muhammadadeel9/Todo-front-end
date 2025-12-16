import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // ✅ Make sure this matches your backend URL
  // baseURL: 'https://todo-back-end-five.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If using cookies
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      document.cookie = 'token=; path=/; max-age=0'; // Clear cookie
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;