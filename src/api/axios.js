import axios from 'axios';

// Buat instance axios dengan konfigurasi default
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'https://dompetku-production.up.railway.app', // Gunakan variabel lingkungan untuk base URL
  timeout: 5000, // Timeout default
});



// Tambahkan interceptor request untuk menambahkan token JWT
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Tangani error saat membuat request
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Tambahkan interceptor response untuk menangani error global
instance.interceptors.response.use(
  (response) => {
    return response; // Jika respons berhasil
  },
  (error) => {
    if (error.response) {
      // Error dari server (status code 4xx atau 5xx)
      console.error('Response Error:', error.response.data);
      if (error.response.status === 401) {
        // Jika token tidak valid atau kedaluwarsa
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/signin'; // Redirect ke halaman login
      }
    } else if (error.request) {
      // Error saat tidak mendapatkan respons
      console.error('No Response:', error.request);
      alert('Unable to connect to the server. Please try again later.');
    } else {
      // Error lainnya
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
