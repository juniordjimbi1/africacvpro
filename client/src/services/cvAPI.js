const API_BASE_URL = 'http://localhost:5000/api';

// Helper pour les appels API
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      // Si une route n’existe pas encore, on simule une réponse OK pour dev
      if (response.status === 404) {
        console.log(`Route ${endpoint} non implémentée - Simulation réussie`);
        return { success: true, data: { id: Date.now(), ...(config.body ? JSON.parse(config.body) : {}) } };
      }
      let data = null;
      try { data = await response.json(); } catch (_) {}
      throw new Error(data?.error || 'Erreur API');
    }

    // 204 ?
    if (response.status === 204) return { success: true };

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);

    // Simulation temporaire pour dev hors-ligne / route manquante
    if (error.message.includes('Failed to fetch') || error.message.includes('404')) {
      console.log(`Simulation de succès pour ${endpoint}`);
      return { success: true, data: { id: Date.now(), ...(config.body ? JSON.parse(config.body) : {}) } };
    }

    throw error;
  }
};

// === Service des CV ===
export const cvAPI = {
  // Charger un CV (éditeur)
  get: (cvId) => apiCall(`/cv/${cvId}`, { method: 'GET' }),

  // Sauvegarder un CV (create ou update en fonction de la présence de id)
  save: (cv) => {
    if (cv?.id) {
      return apiCall(`/cv/${cv.id}`, {
        method: 'PUT',
        body: cv, // { title?, dataJson?, templateId? }
      });
    }
    return apiCall('/cv', {
      method: 'POST',
      body: cv, // { title?, template? }
    });
  },

  // (Optionnel DEV) import fictif pour tests UI
  importCV: (_cvId, _file) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            extracted: {
              personal: {
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.dupont@email.com',
              },
            },
            warnings: [],
          },
        });
      }, 1000);
    }),
};
