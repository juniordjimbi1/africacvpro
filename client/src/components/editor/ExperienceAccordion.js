import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ExperienceAccordion({ data, isExpanded, onToggle, onAddItem, onUpdateItem, onRemoveItem, dateFormat }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    city: '',
    startDay: '',
    startMonth: '',
    startYear: '',
    endDay: '',
    endMonth: '',
    endYear: '',
    current: false,
    description: ''
  });

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const startDate = formData.startYear && formData.startMonth && formData.startDay 
      ? `${formData.startYear}-${String(formData.startMonth).padStart(2, '0')}-${String(formData.startDay).padStart(2, '0')}`
      : '';
    
    const endDate = formData.current || !formData.endYear ? '' 
      : `${formData.endYear}-${String(formData.endMonth).padStart(2, '0')}-${String(formData.endDay).padStart(2, '0')}`;

    const itemData = {
      ...formData,
      startDate,
      endDate: formData.current ? '' : endDate
    };

    if (editingItem) {
      onUpdateItem(editingItem.id, itemData);
    } else {
      onAddItem(itemData);
    }
    
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      title: '',
      company: '',
      city: '',
      startDay: '',
      startMonth: '',
      startYear: '',
      endDay: '',
      endMonth: '',
      endYear: '',
      current: false,
      description: ''
    });
  };

  const startEdit = (item) => {
    const startParts = item.startDate ? item.startDate.split('-') : ['', '', ''];
    const endParts = item.endDate ? item.endDate.split('-') : ['', '', ''];
    
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      company: item.company || '',
      city: item.city || '',
      startDay: startParts[2] || '',
      startMonth: startParts[1] || '',
      startYear: startParts[0] || '',
      endDay: endParts[2] || '',
      endMonth: endParts[1] || '',
      endYear: endParts[0] || '',
      current: !item.endDate && !!item.startDate,
      description: item.description || ''
    });
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">💼</span>
          <div>
            <h3 className="font-semibold text-slate-900">Expérience Professionnelle</h3>
            <p className="text-sm text-slate-600">Postes occupés et responsabilités</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-slate-400">▼</span>
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 border-t border-slate-200">
              {/* Bouton d'ajout */}
              <div className="flex justify-between items-center py-4">
                <h4 className="font-medium text-slate-900">Expériences</h4>
                <motion.button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>+</span>
                  <span>Ajouter une expérience</span>
                </motion.button>
              </div>

              {/* Formulaire */}
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-50 rounded-lg p-4 mb-6"
                >
                  <h4 className="font-semibold text-slate-900 mb-4">
                    {editingItem ? 'Modifier l\'expérience' : 'Nouvelle expérience'}
                  </h4>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Poste *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ex: Développeur Full-Stack"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Entreprise *
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ex: Google, Microsoft..."
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ex: Paris, Dakar..."
                      />
                    </div>

                    {/* Date de début */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de début *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <select
                          value={formData.startDay}
                          onChange={(e) => setFormData({ ...formData, startDay: e.target.value })}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Jour</option>
                          {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <select
                          value={formData.startMonth}
                          onChange={(e) => setFormData({ ...formData, startMonth: e.target.value })}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Mois</option>
                          {months.map((month, index) => (
                            <option key={month} value={index + 1}>{month}</option>
                          ))}
                        </select>
                        <select
                          value={formData.startYear}
                          onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="">Année</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Date de fin */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de fin
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="currentExperience"
                            checked={formData.current}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              current: e.target.checked,
                              endDay: '',
                              endMonth: '',
                              endYear: ''
                            })}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <label htmlFor="currentExperience" className="text-sm text-slate-700">
                            Poste actuel
                          </label>
                        </div>
                        
                        {!formData.current && (
                          <div className="grid grid-cols-3 gap-3">
                            <select
                              value={formData.endDay}
                              onChange={(e) => setFormData({ ...formData, endDay: e.target.value })}
                              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Jour</option>
                              {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                            <select
                              value={formData.endMonth}
                              onChange={(e) => setFormData({ ...formData, endMonth: e.target.value })}
                              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Mois</option>
                              {months.map((month, index) => (
                                <option key={month} value={index + 1}>{month}</option>
                              ))}
                            </select>
                            <select
                              value={formData.endYear}
                              onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Année</option>
                              {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Décrivez vos responsabilités, réalisations et compétences développées..."
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

              {/* Liste des expériences */}
              <div className="space-y-4">
                {data.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{item.title}</h4>
                        <p className="text-slate-700">{item.company}</p>
                        {item.city && <p className="text-slate-600">{item.city}</p>}
                        <p className="text-sm text-slate-500 mt-1">
                          {item.startDate} {item.endDate ? `- ${item.endDate}` : '- Présent'}
                        </p>
                        {item.description && (
                          <p className="text-slate-600 mt-2 whitespace-pre-line">{item.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-slate-400 hover:text-primary-600 transition-colors"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {data.length === 0 && !showForm && (
                  <div className="text-center py-8 text-slate-500">
                    Aucune expérience professionnelle ajoutée
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