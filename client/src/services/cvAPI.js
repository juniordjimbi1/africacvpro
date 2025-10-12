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
      // Si la route n'existe pas encore, on simule une réponse réussie
      if (response.status === 404) {
        console.log(`Route ${endpoint} non implémentée - Simulation réussie`);
        return { success: true, data: { id: Date.now(), ...config.body } };
      }
      
      const data = await response.json();
      throw new Error(data.error || 'Erreur API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    
    // Simulation temporaire pour le développement
    if (error.message.includes('Failed to fetch') || error.message.includes('404')) {
      console.log(`Simulation de succès pour ${endpoint}`);
      return { success: true, data: { id: Date.now(), ...(config.body ? JSON.parse(config.body) : {}) } };
    }
    
    throw error;
  }
};

// Service des CV
export const cvAPI = {
  // Récupérer un CV
  get: (cvId) => apiCall(`/cv/${cvId}`),

  // Sauvegarder un CV (auto-save)
  save: (cvData) => {
    if (cvData.id) {
      return apiCall(`/cv/${cvData.id}`, {
        method: 'PUT',
        body: cvData
      });
    } else {
      return apiCall('/cv', {
        method: 'POST',
        body: cvData
      });
    }
  },

  // Import (simulation)
  importCV: (cvId, file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            extracted: {
              personal: {
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.dupont@email.com'
              }
            },
            warnings: []
          }
        });
      }, 1000);
    });
  }
};