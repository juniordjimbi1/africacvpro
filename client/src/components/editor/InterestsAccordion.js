import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InterestsAccordion({ data, isExpanded, onToggle, onAddItem, onUpdateItem, onRemoveItem }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: ''
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
    setFormData({ name: '' });
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* En-tête */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">⚽</span>
          <div>
            <h3 className="font-semibold text-slate-900">Centres d'intérêt</h3>
            <p className="text-sm text-slate-600">Loisirs, passions et activités</p>
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
                <h4 className="font-medium text-slate-900">Liste des centres d'intérêt</h4>
                <motion.button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>+</span>
                  <span>Ajouter un centre d'intérêt</span>
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
                    {editingItem ? 'Modifier le centre d\'intérêt' : 'Nouveau centre d\'intérêt'}
                  </h4>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Centre d'intérêt *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ex: Football, Lecture, Voyages, Musique..."
                        required
                      />
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

              {/* Liste des centres d'intérêt */}
              <div className="flex flex-wrap gap-2">
                {data.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <div className="bg-primary-100 text-primary-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <span>{item.name}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {data.length === 0 && (
                  <div className="w-full text-center py-8 text-slate-500">
                    Aucun centre d'intérêt ajouté
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