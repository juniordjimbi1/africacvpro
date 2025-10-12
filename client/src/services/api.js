const API_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) || 'http://localhost:5000/api';

// Helper pour les appels API (JSON & FormData)
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    method: 'GET',
    ...options,
    headers,
  };

  // Si body est un objet → JSON ; si c'est un FormData → ne pas définir Content-Type
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();

    if (!res.ok) {
      const msg = data && data.error ? data.error : `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Service d'authentification
export const authAPI = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: { email, password }
    }),

  register: (email, password) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: { email, password }
    }),

  getMe: () =>
    apiCall('/auth/me')
};

// Service des templates
export const templatesAPI = {
  getAll: () =>
    apiCall('/templates')
};

// Service des statistiques
export const statsAPI = {
  getStats: () =>
    apiCall('/stats')
};

// Uploads (photo & import CV)
export const apiUpload = {
  uploadPhoto: async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    // serveur: POST /api/upload/photo → { url }
    return apiCall('/upload/photo', { method: 'POST', body: fd });
  },

  importParse: async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    // serveur: POST /api/upload/parse → { parsed }
    return apiCall('/upload/parse', { method: 'POST', body: fd });
  }
};
