import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const predefinedSections = [
  { id: 'stage', name: 'Stage', icon: '🎯' },
  { id: 'reference', name: 'Référence', icon: '⭐' },
  { id: 'certificat', name: 'Certificat', icon: '🏆' },
  { id: 'signature', name: 'Signature', icon: '✍️' },
  { id: 'projet', name: 'Projet', icon: '🚀' },
  { id: 'publication', name: 'Publication', icon: '📚' }
];

export function CustomSections({ data, isExpanded, onToggle, onChange }) {
  const [newSectionName, setNewSectionName] = useState('');

  const addPredefinedSection = (section) => {
    const newSection = {
      id: Date.now(),
      type: 'predefined',
      name: section.name,
      icon: section.icon,
      content: '',
      position: 'left' // gauche ou droite
    };
    onChange([...data, newSection]);
  };

  const addCustomSection = () => {
    if (!newSectionName.trim()) return;
    
    const newSection = {
      id: Date.now(),
      type: 'custom',
      name: newSectionName,
      icon: '➕',
      content: '',
      position: 'left'
    };
    onChange([...data, newSection]);
    setNewSectionName('');
  };

  const updateSection = (id, updates) => {
    const updatedSections = data.map(section =>
      section.id === id ? { ...section, ...updates } : section
    );
    onChange(updatedSections);
  };

  const removeSection = (id) => {
    const updatedSections = data.filter(section => section.id !== id);
    onChange(updatedSections);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* En-tête */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🔧</span>
          <div>
            <h3 className="font-semibold text-slate-900">Sections supplémentaires</h3>
            <p className="text-sm text-slate-600">Ajoutez des sections personnalisées à votre CV</p>
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
            <div className="px-6 pb-6 space-y-6 border-t border-slate-200">
              {/* Sections prédéfinies */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Sections prédéfinies</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {predefinedSections.map((section) => (
                    <motion.button
                      key={section.id}
                      onClick={() => addPredefinedSection(section)}
                      className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg">{section.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{section.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Section personnalisée */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Section personnalisée</h4>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="Nom de votre section personnalisée"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={addCustomSection}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              {/* Sections ajoutées */}
              {data.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Sections ajoutées</h4>
                  <div className="space-y-3">
                    {data.map((section) => (
                      <div key={section.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                        <span className="text-lg">{section.icon}</span>
                        <input
                          type="text"
                          value={section.name}
                          onChange={(e) => updateSection(section.id, { name: e.target.value })}
                          className="flex-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                        <select
                          value={section.position}
                          onChange={(e) => updateSection(section.id, { position: e.target.value })}
                          className="px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="left">Gauche</option>
                          <option value="right">Droite</option>
                        </select>
                        <button
                          onClick={() => removeSection(section.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}