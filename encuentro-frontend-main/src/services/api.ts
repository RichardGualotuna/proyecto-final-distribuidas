import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener el token del localStorage
const getToken = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsedStorage = JSON.parse(authStorage);
      return parsedStorage.state?.token || null;
    }
  } catch (error) {
    console.error('Error al obtener token:', error);
  }
  return null;
};

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar el localStorage si el token es inválido
      localStorage.removeItem('auth-storage');
      // Redirigir al login si es necesario
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;