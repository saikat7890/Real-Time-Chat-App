import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://real-time-chat-app-backend-kob0.onrender.com', // Backend URL
  timeout: 10000, // Optional: Set a timeout for requests (10 seconds)
  headers: {
    'Content-Type': 'application/json', // Default headers for JSON
  },
});

// // Optional: Add interceptors for requests and responses
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Example: Add an authorization token if needed
//     const token = localStorage.getItem('token'); // Adjust token retrieval as per your app
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Example: Handle unauthorized errors globally
//     if (error.response && error.response.status === 401) {
//       console.error('Unauthorized! Redirecting to login...');
//       window.location.href = '/login'; // Adjust path as necessary
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
