import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';;


// Fonction pour récupérer le CSRF token depuis les cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Configuration axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le CSRF token à chaque requête
api.interceptors.request.use(
  (config) => {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirection vers login si non authentifié
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const authService = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  logout: () => api.post('/auth/logout/'),
  getUser: () => api.get('/auth/user/'),
  changePassword: (oldPassword, newPassword) => 
    api.post('/auth/change-password/', { 
      old_password: oldPassword, 
      new_password: newPassword 
    }),
  getCsrfToken: () => api.get('/auth/csrf/'),
};

// Products
export const productService = {
  getAll: (params = {}) => api.get('/products/products/', { params }),
  getById: (id) => api.get(`/products/products/${id}/`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/products/products/', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': getCookie('csrftoken')
      },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/products/products/${id}/`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': getCookie('csrftoken')
      },
    });
  },
  delete: (id) => api.delete(`/products/products/${id}/`),
  byCategory: (category) => api.get('/products/products/by_category/', { params: { category } }),
};

// Categories
export const categoryService = {
  getAll: () => api.get('/products/categories/'),
};

// Settings
export const settingsService = {
  get: () => api.get('/products/settings/'),
  update: (data) => api.put('/products/settings/1/', data),
};

export default api;