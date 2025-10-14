import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InterestsAccordion({ data, isExpanded, onToggle, onAddItem, onUpdateItem, onRemoveItem }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  const ensureDraft = (next) => {
    if (editingItem?.id) return editingItem.id;
    if (draftId) return draftId;
    const id = Date.now() + Math.random();
    onAddItem({ id, name: next.name || '' });
    setDraftId(id);
    setEditingItem({ id });
    return id;
  };

  const liveUpdate = (partial) => {
    const next = { ...formData, ...partial };
    setFormData(next);
    const id = ensureDraft(next);
    onUpdateItem(id, { name: next.name || '' });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setDraftId(null);
    setFormData({ name: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetForm();
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setDraftId(item.id);
    setShowForm(true);
    setFormData({ name: item.name || '' });
  };

  const removeSection = () => {
    [...data].forEach(it => onRemoveItem(it.id));
    resetForm();
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🎯</span>
          <div>
            <h3 className="font-semibold text-slate-900">Centres d’intérêt</h3>
            <p className="text-sm text-slate-600">Hobbies et passions</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
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
                  onClick={() => { setShowForm(true); setEditingItem(null); setDraftId(null); }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  <span>+</span>
                  <span>Ajouter un intérêt</span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={removeSection}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  Supprimer la section
                </motion.button>
              </div>

              {showForm && (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-50 rounded-lg p-4 mb-6 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Intérêt</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => liveUpdate({ name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: Football, Lecture, Voyage…"
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      {editingItem ? 'Terminer' : 'Ajouter'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={resetForm}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      Annuler
                    </motion.button>
                  </div>
                </motion.form>
              )}

              <div className="flex flex-wrap gap-2">
                {data.map(item => (
                  <span key={item.id} className="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center gap-2">
                    {item.name}
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-slate-500 hover:text-slate-700"
                      title="Modifier"
                    >✎</button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Supprimer"
                    >×</button>
                  </span>
                ))}
                {data.length === 0 && !showForm && (
                  <div className="text-slate-500 text-sm">Aucun centre d’intérêt ajouté</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
