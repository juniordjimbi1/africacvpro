import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SkillsAccordion({ data, isExpanded, onToggle, onAddItem, onUpdateItem, onRemoveItem }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 3
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      onUpdateItem(editingItem.id, formData);
    } else {
      onAddItem(formData);
    }
    
    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: '', level: 3 });
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const getLevelText = (level) => {
    switch(level) {
      case 1: return 'Débutant';
      case 2: return 'Intermédiaire';
      case 3: return 'Compétent';
      case 4: return 'Avancé';
      case 5: return 'Expert';
      default: return 'Compétent';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* En-tête */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🛠️</span>
          <div>
            <h3 className="font-semibold text-slate-900">Compétences</h3>
            <p className="text-sm text-slate-600">Compétences techniques et professionnelles</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-slate-400">▼</span>
        </motion.div>
      </button>

      {/* Contenu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 space-y-4 border-t border-slate-200">
              {/* Bouton ajouter */}
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-slate-900">Liste des compétences</h4>
                <motion.button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>+</span>
                  <span>Ajouter une compétence</span>
                </motion.button>
              </div>

              {/* Formulaire */}
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-50 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-slate-900 mb-4">
                    {editingItem ? 'Modifier la compétence' : 'Nouvelle compétence'}
                  </h4>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Compétence *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ex: React, Python, Gestion de projet..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Niveau
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setFormData({ ...formData, level })}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                  level <= formData.level
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-slate-200 text-slate-400'
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="text-center text-sm text-slate-600">
                          {getLevelText(formData.level)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {editingItem ? 'Modifier' : 'Ajouter'}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingItem(null);
                        }}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Annuler
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Liste des compétences */}
              <div className="grid gap-3">
                {data.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-900 mb-2">{item.name}</h5>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`w-3 h-3 rounded-full ${
                                  level <= item.level ? 'bg-primary-500' : 'bg-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-slate-600">
                            {getLevelText(item.level)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-slate-400 hover:text-primary-600 transition-colors p-1"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {data.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Aucune compétence ajoutée
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}