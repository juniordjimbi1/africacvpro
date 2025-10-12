import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUpload } from '../../services/api';

export function PersonalAccordion({ data, isExpanded, onToggle, onChange }) {
  const [customFields, setCustomFields] = useState(data.customFields || []);
  const [photoBusy, setPhotoBusy] = useState(false);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const addCustomField = () => {
    const newField = {
      id: Date.now(),
      label: 'Nouveau champ',
      value: ''
    };
    const updatedFields = [...customFields, newField];
    setCustomFields(updatedFields);
    onChange({ ...data, customFields: updatedFields });
  };

  const updateCustomField = (id, updates) => {
    const updatedFields = customFields.map(field =>
      field.id === id ? { ...field, ...updates } : field
    );
    setCustomFields(updatedFields);
    onChange({ ...data, customFields: updatedFields });
  };

  const removeCustomField = (id) => {
    const updatedFields = customFields.filter(field => field.id !== id);
    setCustomFields(updatedFields);
    onChange({ ...data, customFields: updatedFields });
  };

  const handlePhoto = async (file) => {
    if (!file) return;
    setPhotoBusy(true);
    try {
      // Upload vers l'API → renvoie { url }
      const { url } = await apiUpload.uploadPhoto(file);
      handleChange('photoUrl', url);
    } catch (e) {
      console.error(e);
      alert("Échec de l'upload de la photo");
    } finally {
      setPhotoBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* En-tête de l'accordéon */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">👤</span>
          <div>
            <h3 className="font-semibold text-slate-900">Informations personnelles</h3>
            <p className="text-sm text-slate-600">Prénom, nom, coordonnées...</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-slate-400">▼</span>
        </motion.div>
      </button>

      {/* Contenu de l'accordéon */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 space-y-6 border-t border-slate-200">
              {/* Photo */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {data.photoUrl ? (
                    <img
                      src={data.photoUrl}
                      alt="Photo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl text-slate-400">📷</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Photo de profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={photoBusy}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
                    onChange={(e) => handlePhoto(e.target.files?.[0])}
                  />
                  {data.photoUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange('photoUrl', '')}
                      className="mt-2 text-xs text-red-600 hover:underline"
                      disabled={photoBusy}
                    >
                      Supprimer la photo
                    </button>
                  )}
                </div>
              </div>

              {/* Prénom et Nom */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={data.firstName || ''}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={data.lastName || ''}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              {/* Emploi recherché */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emploi recherché
                </label>
                <input
                  type="text"
                  value={data.jobTitle || ''}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: Développeur Full-Stack"
                />
              </div>

              {/* Email et Téléphone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={data.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>
              </div>

              {/* Adresse et Ville */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={data.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Votre adresse"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={data.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ville"
                  />
                </div>
              </div>

              {/* Champs supplémentaires */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={data.birthDate || ''}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lieu de naissance
                  </label>
                  <input
                    type="text"
                    value={data.birthPlace || ''}
                    onChange={(e) => handleChange('birthPlace', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Permis
                  </label>
                  <input
                    type="text"
                    value={data.driving || ''}
                    onChange={(e) => handleChange('driving', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ex: B, A, C..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nationalité
                  </label>
                  <input
                    type="text"
                    value={data.nationality || ''}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sites web */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Site internet
                  </label>
                  <input
                    type="url"
                    value={data.website || ''}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={data.linkedin || ''}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              {/* Champs personnalisés */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Champs personnalisés
                  </label>
                  <button
                    onClick={addCustomField}
                    className="text-sm bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded transition-colors"
                  >
                    + Ajouter
                  </button>
                </div>

                <div className="space-y-3">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex gap-3 items-start">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Nom du champ"
                      />
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Valeur"
                      />
                      <button
                        onClick={() => removeCustomField(field.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
