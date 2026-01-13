import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Créer l'instance axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction pour obtenir le cookie CSRF
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

// Intercepteur pour ajouter le token CSRF à chaque requête
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

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si erreur 403 et pas déjà retenté
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Récupérer un nouveau CSRF token
        await api.get('/auth/csrf/');
        
        // Réessayer la requête avec le nouveau token
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) {
          originalRequest.headers['X-CSRFToken'] = csrftoken;
        }
        
        return api(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    
    // Si erreur 401, rediriger vers login
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Services API
export const authService = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  logout: () => api.post('/auth/logout/'),
  getUser: () => api.get('/auth/user/'),
  getCsrfToken: () => api.get('/auth/csrf/'),
};

export const productService = {
  getAll: () => api.get('/products/products/'),
  
  create: async (formData) => {
    // S'assurer d'avoir le token CSRF
    const csrftoken = getCookie('csrftoken');
    
    return api.post('/products/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken,
      },
    });
  },
  
  update: async (id, formData) => {
    // S'assurer d'avoir le token CSRF
    const csrftoken = getCookie('csrftoken');
    
    return api.put(`/products/products/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrftoken,
      },
    });
  },
  
  delete: (id) => api.delete(`/products/products/${id}/`),
};

export const categoryService = {
  getAll: () => api.get('/products/categories/'),
};

export const settingsService = {
  get: () => api.get('/products/settings/'),
  update: (id, data) => api.put(`/products/settings/${id}/`, data),
};

export default api;