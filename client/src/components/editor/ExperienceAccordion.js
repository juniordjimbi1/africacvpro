import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ExperienceAccordion({ data, isExpanded, onToggle, onAddItem, onUpdateItem, onRemoveItem, dateFormat }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [draftId, setDraftId] = useState(null);

  const initialForm = {
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
  };
  const [formData, setFormData] = useState(initialForm);

  // ⬇️ focus sur le 1er champ quand on ouvre le formulaire (nouvel item ou edition)
  const firstInputRef = useRef(null);
  useEffect(() => {
    if (showForm && firstInputRef.current) {
      // petit délai pour laisser l’animation ouvrir le panel
      const t = setTimeout(() => firstInputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [showForm]);

  const months = [
    'Janvier','Février','Mars','Avril','Mai','Juin',
    'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
  ];
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const computeDates = (fd) => {
    const startDate = fd.startYear && fd.startMonth && fd.startDay
      ? `${fd.startYear}-${String(fd.startMonth).padStart(2,'0')}-${String(fd.startDay).padStart(2,'0')}`
      : '';
    const endDateRaw = fd.endYear && fd.endMonth && fd.endDay
      ? `${fd.endYear}-${String(fd.endMonth).padStart(2,'0')}-${String(fd.endDay).padStart(2,'0')}`
      : '';
    const endDate = fd.current ? '' : endDateRaw;
    return { startDate, endDate };
  };

  const ensureDraft = (nextFormData) => {
    if (editingItem?.id) return editingItem.id;
    if (draftId) return draftId;
    const id = Date.now() + Math.random();
    const { startDate, endDate } = computeDates(nextFormData);
    onAddItem({
      id,
      title: nextFormData.title || '',
      company: nextFormData.company || '',
      city: nextFormData.city || '',
      startDate,
      endDate,
      description: nextFormData.description || ''
    });
    setDraftId(id);
    setEditingItem({ id });
    return id;
  };

  const liveUpdate = (partial) => {
    const next = { ...formData, ...partial };
    setFormData(next);
    const id = ensureDraft(next);
    const { startDate, endDate } = computeDates(next);
    onUpdateItem(id, {
      title: next.title || '',
      company: next.company || '',
      city: next.city || '',
      startDate,
      endDate,
      description: next.description || ''
    });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setDraftId(null);
    setFormData(initialForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // tout est déjà live → on ferme juste proprement
    resetForm();
  };

  const startEdit = (item) => {
    const startParts = item.startDate ? item.startDate.split('-') : ['', '', ''];
    const endParts = item.endDate ? item.endDate.split('-') : ['', '', ''];
    setEditingItem(item);
    setDraftId(item.id);
    setShowForm(true);
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
  };

  const removeSection = () => {
    [...data].forEach(it => onRemoveItem(it.id));
    resetForm();
  };

  const startNew = () => {
    // nouvel item → formulaire vierge + focus + pas de draft tant qu’on n’a pas tapé
    setShowForm(true);
    setEditingItem(null);
    setDraftId(null);
    setFormData(initialForm);
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
            <p className="text-sm text-slate-600">Postes occupés, missions, réalisations</p>
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
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <motion.button
                  type="button"
                  onClick={startNew}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>+</span>
                  <span>Ajouter une expérience</span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={removeSection}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Supprimer la section
                </motion.button>
              </div>

              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-50 rounded-lg p-4 mb-6"
                >
                  <h4 className="font-semibold text-slate-900 mb-4">
                    {editingItem ? 'Modifier l’expérience' : 'Nouvelle expérience'}
                  </h4>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Poste</label>
                        <input
                          ref={firstInputRef}
                          type="text"
                          value={formData.title}
                          onChange={(e) => liveUpdate({ title: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ex: Développeur Frontend"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Entreprise</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => liveUpdate({ company: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ex: Tech Africa"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ville</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => liveUpdate({ city: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ex: Dakar"
                        />
                      </div>
                    </div>

                    {/* Date de début */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date de début</label>
                      <div className="flex items-center gap-2">
                        <select
                          value={formData.startDay}
                          onChange={(e) => liveUpdate({ startDay: e.target.value })}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Jour</option>
                          {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select
                          value={formData.startMonth}
                          onChange={(e) => liveUpdate({ startMonth: e.target.value })}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Mois</option>
                          {months.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                        </select>
                        <select
                          value={formData.startYear}
                          onChange={(e) => liveUpdate({ startYear: e.target.value })}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Année</option>
                          {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Date de fin */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date de fin</label>
                      <div className="space-y-3">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.current}
                            onChange={(e) => liveUpdate({ current: e.target.checked })}
                          />
                          <span>En cours</span>
                        </label>

                        {!formData.current && (
                          <div className="flex items-center gap-2">
                            <select
                              value={formData.endDay}
                              onChange={(e) => liveUpdate({ endDay: e.target.value })}
                              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Jour</option>
                              {days.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select
                              value={formData.endMonth}
                              onChange={(e) => liveUpdate({ endMonth: e.target.value })}
                              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Mois</option>
                              {months.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                            </select>
                            <select
                              value={formData.endYear}
                              onChange={(e) => liveUpdate({ endYear: e.target.value })}
                              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Année</option>
                              {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Tâches / Réalisations</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => liveUpdate({ description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="Une ligne = une puce (ex: Gestion du stock…)"
                      />
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {editingItem ? 'Terminer' : 'Ajouter'}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={resetForm}
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
              <div className="space-y-3">
                {data.map(item => (
                  <div key={item.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{item.title}</div>
                        <div className="text-sm text-slate-600">{item.company}{item.city ? ` • ${item.city}` : ''}</div>
                      </div>
                      <div className="text-sm text-slate-600">
                        {item.startDate || item.endDate ? `${item.startDate || ''}${item.endDate ? ' — ' + item.endDate : ''}` : ''}
                      </div>
                    </div>

                    {item.description && (
                      <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
                        {item.description.split(/\r?\n/).filter(Boolean).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      <motion.button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Modifier
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Supprimer
                      </motion.button>
                    </div>
                  </div>
                ))}

                {data.length === 0 && !showForm && (
                  <div className="text-center py-8 text-slate-500">
                    Aucune expérience ajoutée pour le moment
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
