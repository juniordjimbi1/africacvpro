import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Helper local **/
const safeLines = (s = '') => String(s).split(/\r?\n/).filter(Boolean);

const TYPES = [
  { key: 'internship',   label: 'Stage',                  icon: '🧑‍💼' }, // Expérience-like
  { key: 'certificate',  label: 'Certificat',             icon: '📜'   }, // Formation-like
  { key: 'reference',    label: 'Références',             icon: '👥'   },
  { key: 'project',      label: 'Projet',                 icon: '🧩'   },
  { key: 'publication',  label: 'Publication',            icon: '📚'   },
  { key: 'custom',       label: 'Section personnalisée',  icon: '🧾'   },
  { key: 'signature',    label: 'Signature',              icon: '✍️'   },
];

const months = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];
const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const newSection = (typeKey) => ({
  id: Date.now() + Math.random(),
  type: typeKey,
  title: TYPES.find(t => t.key === typeKey)?.label || 'Section',
  items: [],
  meta: {}
});

export function CustomSections({ data = [], isExpanded, onToggle, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const setSections = (next) => onChange(next);

  const addSection = (typeKey) => {
    const s = newSection(typeKey);
    setSections([...(data || []), s]);
    setShowPicker(false);
  };

  const removeSection = (id) => {
    setSections((data || []).filter(s => s.id !== id));
  };

  const updateSection = (id, updates) => {
    setSections((data || []).map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const addItem = (sid, item) => {
    const section = (data || []).find(s => s.id === sid);
    if (!section) return;
    const next = (data || []).map(s =>
      s.id === sid ? { ...s, items: [...(s.items || []), item] } : s
    );
    setSections(next);
  };

  const updateItem = (sid, iid, updates) => {
    const section = (data || []).find(s => s.id === sid);
    if (!section) return;
    const next = (data || []).map(s => {
      if (s.id !== sid) return s;
      const nextItems = (s.items || []).map(it => (it.id === iid ? { ...it, ...updates } : it));
      return { ...s, items: nextItems };
    });
    setSections(next);
  };

  const removeItem = (sid, iid) => {
    const section = (data || []).find(s => s.id === sid);
    if (!section) return;
    const next = (data || []).map(s => {
      if (s.id !== sid) return s;
      return { ...s, items: (s.items || []).filter(it => it.id !== iid) };
    });
    setSections(next);
  };

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

  const SectionHeader = ({ icon, title, onRemove }) => (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h4 className="font-semibold text-slate-900">{title}</h4>
      </div>
      <motion.button
        type="button"
        onClick={onRemove}
        className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      >
        Supprimer la section
      </motion.button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">➕</span>
          <div>
            <h3 className="font-semibold text-slate-900">Sections supplémentaires</h3>
            <p className="text-sm text-slate-600">
              Ajoutez Stage, Références, Certificat, Projet, Publication, Section personnalisée, Signature
            </p>
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
            <div className="px-6 py-4 space-y-6">
              {/* Picker */}
              <div>
                <motion.button
                  type="button"
                  onClick={() => setShowPicker(!showPicker)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  Ajouter une section
                </motion.button>
                <AnimatePresence>
                  {showPicker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex flex-wrap gap-2"
                    >
                      {TYPES.map(t => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => addSection(t.key)}
                          className="px-3 py-1 rounded-full border border-slate-300 hover:bg-slate-50 text-sm"
                          title={t.label}
                        >
                          <span className="mr-1">{t.icon}</span>{t.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sections */}
              {(data || []).map((section) => {
                const type = section.type;
                if (type === 'internship') {
                  return (
                    <div key={section.id} className="p-4 border border-slate-200 rounded-lg">
                      <SectionHeader icon="🧑‍💼" title={section.title} onRemove={() => removeSection(section.id)} />
                      <InternshipForm
                        items={section.items}
                        onAdd={(item) => addItem(section.id, item)}
                        onUpdate={(iid, upd) => updateItem(section.id, iid, upd)}
                        onRemove={(iid) => removeItem(section.id, iid)}
                        computeDates={computeDates}
                      />
                    </div>
                  );
                }
                if (type === 'certificate') {
                  return (
                    <div key={section.id} className="p-4 border border-slate-200 rounded-lg">
                      <SectionHeader icon="📜" title={section.title} onRemove={() => removeSection(section.id)} />
                      <CertificateForm
                        items={section.items}
                        onAdd={(item) => addItem(section.id, item)}
                        onUpdate={(iid, upd) => updateItem(section.id, iid, upd)}
                        onRemove={(iid) => removeItem(section.id, iid)}
                        computeDates={computeDates}
                      />
                    </div>
                  );
                }
                if (type === 'reference') {
                  return (
                    <div key={section.id} className="p-4 border border-slate-200 rounded-lg">
                      <SectionHeader icon="👥" title={section.title} onRemove={() => removeSection(section.id)} />
                      <ReferencesForm
                        items={section.items}
                        onAdd={(item) => addItem(section.id, item)}
                        onUpdate={(iid, upd) => updateItem(section.id, iid, upd)}
                        onRemove={(iid) => removeItem(section.id, iid)}
                      />
                    </div>
                  );
                }
                if (type === 'project') {
                  return (
                    <div key={section.id} className="p-4 border border-slate-200 rounded-lg">
                      <SectionHeader icon="🧩" title={section.title} onRemove={() => removeSection(section.id)} />
                      <ProjectsForm
                        items={section.items}
                        onAdd={(item) => addItem(section.id, item)}
                        onUpdate={(iid, upd) => updateItem(section.id, iid, upd)}
                        onRemove={(iid) => removeItem(section.id, iid)}
                      />
                    </div>
                  );
                }
                if (type === 'publication') {
                  return (
                    <div key={section.id} className="p-4 border border-slate-200 rounded-lg">
                      <SectionHeader icon="📚" title={section.title} onRemove={() => removeSection(section.id)} />
                      <PublicationsForm
                        items={section.items}
                        onAdd={(item) => addItem(section.id, item)}
                        onUpdate={(iid, upd) => updateItem(section.id, iid, upd)}
                        onRemove={(iid) => removeItem(section.id, iid)}
                      />
                    </div>
                  );
                }
                if (type === 'custom') {
                  return (
                    <div key={section.id} className="p-4 border border-slate-200 rounded-lg">
                      <SectionHeader icon="🧾" title={section.title} onRemove={() => removeSection(section.id)} />
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Titre de la section</label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, { title: e.target.value || 'Section personnalisée' })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ex: Réalisations, Bénévolat…"
                        />
                      </div>
                      <CustomFreeForm
                        items={section.items}
                        onAdd={(item) => addItem(section.id, item)}
                        onUpdate={(iid, upd) => updateItem(section.id, iid, upd)}
                        onRemove={(iid) => removeItem(section.id, iid)}
                      />
                    </div>
                  );
                }
                if (type === 'signature') {
                  return (
                    <div key={section.id} className="p-4 border border-slate-200 rounded-lg">
                      <SectionHeader icon="✍️" title={section.title} onRemove={() => removeSection(section.id)} />
                      <SignatureForm
                        value={section.meta || {}}
                        onChange={(meta) => updateSection(section.id, { meta })}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ====== Sous-formulaires ====== */

// Stage
function InternshipForm({ items = [], onAdd, onUpdate, onRemove, computeDates }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [form, setForm] = useState({
    title: '', company: '', city: '',
    startDay: '', startMonth: '', startYear: '',
    endDay: '', endMonth: '', endYear: '',
    current: false, description: ''
  });

  const firstRef = useRef(null);
  useEffect(() => {
    if (showForm && firstRef.current) {
      const t = setTimeout(() => firstRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [showForm]);

  const ensureDraft = (next) => {
    if (editingId) return { id: editingId, created: false };
    if (draftId)  return { id: draftId,  created: false };
    const id = Date.now() + Math.random();
    const { startDate, endDate } = computeDates(next);
    onAdd({
      id,
      title: next.title || '',
      company: next.company || '',
      city: next.city || '',
      startDate, endDate,
      description: next.description || ''
    });
    setDraftId(id);
    setEditingId(id);
    return { id, created: true };
  };

  const live = (partial) => {
    const next = { ...form, ...partial };
    setForm(next);
    const { id, created } = ensureDraft(next);
    if (!created) {
      const { startDate, endDate } = computeDates(next);
      onUpdate(id, {
        title: next.title || '',
        company: next.company || '',
        city: next.city || '',
        startDate, endDate,
        description: next.description || ''
      });
    }
  };

  const reset = () => {
    setShowForm(false); setEditingId(null); setDraftId(null);
    setForm({
      title: '', company: '', city: '',
      startDay: '', startMonth: '', startYear: '',
      endDay: '', endMonth: '', endYear: '',
      current: false, description: ''
    });
  };

  const submit = (e) => { e.preventDefault(); reset(); };

  const edit = (it) => {
    const s = it.startDate ? it.startDate.split('-') : ['', '', ''];
    const e = it.endDate ? it.endDate.split('-') : ['', '', ''];
    setShowForm(true); setEditingId(it.id); setDraftId(it.id);
    setForm({
      title: it.title || '', company: it.company || '', city: it.city || '',
      startDay: s[2] || '', startMonth: s[1] || '', startYear: s[0] || '',
      endDay: e[2] || '', endMonth: e[1] || '', endYear: e[0] || '',
      current: !it.endDate && !!it.startDate,
      description: it.description || ''
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <motion.button
          type="button"
          onClick={() => { setShowForm(true); setEditingId(null); setDraftId(null); }}
          className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        >
          Ajouter un stage
        </motion.button>
      </div>

      {showForm && (
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-50 rounded-lg p-4 mb-4 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Poste</label>
              <input
                ref={firstRef}
                type="text"
                value={form.title}
                onChange={(e) => live({ title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Stagiaire Assistant RH"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Entreprise</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => live({ company: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Entreprise X"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ville</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => live({ city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Dakar"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date de début</label>
            <div className="flex items-center gap-2">
              <select value={form.startDay} onChange={(e)=>live({startDay:e.target.value})} className="px-3 py-2 border rounded-lg"><option value="">Jour</option>{days.map(d => <option key={d} value={d}>{d}</option>)}</select>
              <select value={form.startMonth} onChange={(e)=>live({startMonth:e.target.value})} className="px-3 py-2 border rounded-lg"><option value="">Mois</option>{months.map((m,i) => <option key={m} value={i+1}>{m}</option>)}</select>
              <select value={form.startYear} onChange={(e)=>live({startYear:e.target.value})} className="px-3 py-2 border rounded-lg"><option value="">Année</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date de fin</label>
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.current} onChange={(e)=>live({current:e.target.checked})} />
                <span>En cours</span>
              </label>
              {!form.current && (
                <div className="flex items-center gap-2">
                  <select value={form.endDay} onChange={(e)=>live({endDay:e.target.value})} className="px-3 py-2 border rounded-lg"><option value="">Jour</option>{days.map(d => <option key={d} value={d}>{d}</option>)}</select>
                  <select value={form.endMonth} onChange={(e)=>live({endMonth:e.target.value})} className="px-3 py-2 border rounded-lg"><option value="">Mois</option>{months.map((m,i) => <option key={m} value={i+1}>{m}</option>)}</select>
                  <select value={form.endYear} onChange={(e)=>live({endYear:e.target.value})} className="px-3 py-2 border rounded-lg"><option value="">Année</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tâches / Réalisations</label>
            <textarea
              value={form.description}
              onChange={(e)=>live({description:e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Une ligne = une puce"
            />
          </div>

          <div className="flex gap-3">
            <motion.button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Terminer</motion.button>
            <motion.button type="button" onClick={reset} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Annuler</motion.button>
          </div>
        </motion.form>
      )}

      {/* Liste */}
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-3 border border-slate-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-900">{it.title}</div>
                <div className="text-sm text-slate-600">
                  {it.company}{it.city ? ` • ${it.city}` : ''}
                </div>
              </div>
              <div className="text-sm text-slate-600">
                {[(it.startDate || ''), (it.endDate ? `— ${it.endDate}` : '')].filter(Boolean).join(' ')}
              </div>
            </div>
            {it.description && (
              <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
                {safeLines(it.description).map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            )}
            <div className="mt-2 flex items-center gap-2">
              <button type="button" onClick={() => onRemove(it.id)} className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">Supprimer</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && (
          <div className="text-slate-500 text-sm">Aucun stage ajouté</div>
        )}
      </div>
    </div>
  );
}

// Certificat
function CertificateForm({ items = [], onAdd, onUpdate, onRemove, computeDates }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [form, setForm] = useState({
    degree: '', school: '', field: '',
    startDay: '', startMonth: '', startYear: '',
    endDay: '', endMonth: '', endYear: '',
    current: false, description: ''
  });

  const firstRef = useRef(null);
  useEffect(() => {
    if (showForm && firstRef.current) {
      const t = setTimeout(() => firstRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [showForm]);

  const ensureDraft = (next) => {
    if (editingId) return { id: editingId, created: false };
    if (draftId)  return { id: draftId,  created: false };
    const id = Date.now() + Math.random();
    const { startDate } = computeDates(next);
    onAdd({
      id,
      degree: next.degree || '',
      school: next.school || '',
      field: next.field || '',
      startDate,
      description: next.description || ''
    });
    setDraftId(id);
    setEditingId(id);
    return { id, created: true };
  };

  const live = (partial) => {
    const next = { ...form, ...partial };
    setForm(next);
    const { id, created } = ensureDraft(next);
    if (!created) {
      const { startDate } = computeDates(next);
      onUpdate(id, {
        degree: next.degree || '',
        school: next.school || '',
        field: next.field || '',
        startDate,
        description: next.description || ''
      });
    }
  };

  const reset = () => {
    setShowForm(false); setEditingId(null); setDraftId(null);
    setForm({
      degree: '', school: '', field: '',
      startDay: '', startMonth: '', startYear: '',
      endDay: '', endMonth: '', endYear: '',
      current: false, description: ''
    });
  };

  const submit = (e) => { e.preventDefault(); reset(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <motion.button
          type="button"
          onClick={() => { setShowForm(true); setEditingId(null); setDraftId(null); }}
          className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        >
          Ajouter un certificat
        </motion.button>
      </div>

      {showForm && (
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-50 rounded-lg p-4 mb-4 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Intitulé</label>
              <input
                ref={firstRef}
                type="text"
                value={form.degree}
                onChange={(e) => live({ degree: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Certificat AWS Cloud Practitioner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Organisme</label>
              <input
                type="text"
                value={form.school}
                onChange={(e) => live({ school: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: AWS / Amazon"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Domaine</label>
              <input
                type="text"
                value={form.field}
                onChange={(e) => live({ field: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Cloud / Réseaux"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <div className="flex items-center gap-2">
              <select value={form.startDay} onChange={(e)=>live({startDay:e.target.value})} className="px-3 py-2 border rounded-lg"><option value="">Jour</option>{days.map(d => <option key={d} value={d}>{d}</option>)}</select>
              <select value={form.startMonth} onChange={(e)=>live({startMonth:e.target.value})} className="px-3 py-2 border rounded-lg"><option value="">Mois</option>{months.map((m,i) => <option key={m} value={i+1}>{m}</option>)}</select>
              <select value={form.startYear} onChange={(e)=>live({startYear:e.target.value})} className="px-3 py-2 border rounded-lg"><option value="">Année</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e)=>live({description:e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Une ligne = une puce"
            />
          </div>

          <div className="flex gap-3">
            <motion.button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Terminer</motion.button>
            <motion.button type="button" onClick={reset} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Annuler</motion.button>
          </div>
        </motion.form>
      )}

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-3 border border-slate-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-900">
                  {it.degree}{it.field ? ` — ${it.field}` : ''}
                </div>
                <div className="text-sm text-slate-600">{it.school}</div>
              </div>
              <div className="text-sm text-slate-600">
                {it.startDate || ''}
              </div>
            </div>
            {it.description && (
              <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
                {safeLines(it.description).map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            )}
            <div className="mt-2 flex items-center gap-2">
              <button type="button" onClick={() => onRemove(it.id)} className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">Supprimer</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && <div className="text-slate-500 text-sm">Aucun certificat ajouté</div>}
      </div>
    </div>
  );
}

// Références
function ReferencesForm({ items = [], onAdd, onUpdate, onRemove }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [form, setForm] = useState({
    name: '', role: '', company: '', email: '', phone: '', authorized: true
  });

  const firstRef = useRef(null);
  useEffect(() => {
    if (showForm && firstRef.current) {
      const t = setTimeout(() => firstRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [showForm]);

  const ensureDraft = (next) => {
    if (editingId) return { id: editingId, created: false };
    if (draftId)  return { id: draftId,  created: false };
    const id = Date.now() + Math.random();
    onAdd({ id, ...next });
    setDraftId(id); setEditingId(id);
    return { id, created: true };
  };

  const live = (partial) => {
    const next = { ...form, ...partial };
    setForm(next);
    const { id, created } = ensureDraft(next);
    if (!created) {
      onUpdate(id, next);
    }
  };

  const reset = () => {
    setShowForm(false); setEditingId(null); setDraftId(null);
    setForm({ name:'', role:'', company:'', email:'', phone:'', authorized:true });
  };

  const submit = (e) => { e.preventDefault(); reset(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <motion.button
          type="button"
          onClick={() => { setShowForm(true); setEditingId(null); setDraftId(null); }}
          className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        >
          Ajouter une référence
        </motion.button>
      </div>

      {showForm && (
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-50 rounded-lg p-4 mb-4 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
              <input
                ref={firstRef}
                type="text"
                value={form.name}
                onChange={(e)=>live({name:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: A. Diallo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fonction</label>
              <input
                type="text"
                value={form.role}
                onChange={(e)=>live({role:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: DRH"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Entreprise</label>
              <input
                type="text"
                value={form.company}
                onChange={(e)=>live({company:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Tech Africa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e)=>live({email:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="ref@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e)=>live({phone:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="+221 ..."
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={form.authorized} onChange={(e)=>live({authorized:e.target.checked})} />
            <span>Autorisation de contact</span>
          </label>

          <div className="flex gap-3">
            <motion.button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Terminer</motion.button>
            <motion.button type="button" onClick={reset} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Annuler</motion.button>
          </div>
        </motion.form>
      )}

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-3 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-semibold text-slate-900">{it.name}</span> — {it.role}
                {it.company ? ` @ ${it.company}` : ''}
                <div className="text-slate-700">
                  {it.email}{it.phone ? ` • ${it.phone}` : ''}{it.authorized ? ' • OK pour contact' : ''}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onRemove(it.id)} className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && <div className="text-slate-500 text-sm">Aucune référence ajoutée</div>}
      </div>
    </div>
  );
}

// Projets
function ProjectsForm({ items = [], onAdd, onUpdate, onRemove }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [form, setForm] = useState({ title:'', role:'', company:'', city:'', link:'', description:'' });

  const firstRef = useRef(null);
  useEffect(() => {
    if (showForm && firstRef.current) {
      const t = setTimeout(() => firstRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [showForm]);

  const ensureDraft = (next) => {
    if (editingId) return { id: editingId, created: false };
    if (draftId)  return { id: draftId,  created: false };
    const id = Date.now() + Math.random();
    onAdd({ id, ...next });
    setDraftId(id); setEditingId(id);
    return { id, created: true };
  };

  const live = (partial) => {
    const next = { ...form, ...partial };
    setForm(next);
    const { id, created } = ensureDraft(next);
    if (!created) {
      onUpdate(id, next);
    }
  };

  const reset = () => {
    setShowForm(false); setEditingId(null); setDraftId(null);
    setForm({ title:'', role:'', company:'', city:'', link:'', description:'' });
  };

  const submit = (e) => { e.preventDefault(); reset(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <motion.button
          type="button"
          onClick={() => { setShowForm(true); setEditingId(null); setDraftId(null); }}
          className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        >
          Ajouter un projet
        </motion.button>
      </div>

      {showForm && (
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-50 rounded-lg p-4 mb-4 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titre</label>
              <input
                ref={firstRef}
                type="text"
                value={form.title}
                onChange={(e)=>live({title:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Plateforme e-commerce"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rôle</label>
              <input
                type="text"
                value={form.role}
                onChange={(e)=>live({role:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Chef de projet"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Entreprise</label>
              <input
                type="text"
                value={form.company}
                onChange={(e)=>live({company:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Tech Africa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ville</label>
              <input
                type="text"
                value={form.city}
                onChange={(e)=>live({city:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Dakar"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Lien</label>
            <input
              type="text"
              value={form.link}
              onChange={(e)=>live({link:e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e)=>live({description:e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Une ligne = une puce"
            />
          </div>

          <div className="flex gap-3">
            <motion.button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Terminer</motion.button>
            <motion.button type="button" onClick={reset} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Annuler</motion.button>
          </div>
        </motion.form>
      )}

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-3 border border-slate-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="text-sm">
                <div className="font-semibold text-slate-900">{it.title}</div>
                <div className="text-slate-700">
                  {it.role}{it.company ? ` — ${it.company}` : ''}{it.city ? ` • ${it.city}` : ''}
                  {it.link ? <> — <span className="text-primary-700 underline break-all">{it.link}</span></> : ''}
                </div>
              </div>
              <div className="text-sm text-slate-600">
                {[(it.startDate || ''), (it.endDate ? `— ${it.endDate}` : '')].filter(Boolean).join(' ')}
              </div>
            </div>
            {it.description && (
              <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
                {safeLines(it.description).map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            )}
            <div className="mt-2 flex items-center gap-2">
              <button type="button" onClick={() => onRemove(it.id)} className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">Supprimer</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && <div className="text-slate-500 text-sm">Aucun projet ajouté</div>}
      </div>
    </div>
  );
}

// Publications
function PublicationsForm({ items = [], onAdd, onUpdate, onRemove }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [form, setForm] = useState({ title:'', publisher:'', date:'', link:'', description:'' });

  const firstRef = useRef(null);
  useEffect(() => {
    if (showForm && firstRef.current) {
      const t = setTimeout(() => firstRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [showForm]);

  const ensureDraft = (next) => {
    if (editingId) return { id: editingId, created: false };
    if (draftId)  return { id: draftId,  created: false };
    const id = Date.now() + Math.random();
    onAdd({ id, ...next });
    setDraftId(id); setEditingId(id);
    return { id, created: true };
  };

  const live = (partial) => {
    const next = { ...form, ...partial };
    setForm(next);
    const { id, created } = ensureDraft(next);
    if (!created) {
      onUpdate(id, next);
    }
  };

  const reset = () => {
    setShowForm(false); setEditingId(null); setDraftId(null);
    setForm({ title:'', publisher:'', date:'', link:'', description:'' });
  };

  const submit = (e) => { e.preventDefault(); reset(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <motion.button
          type="button"
          onClick={() => { setShowForm(true); setEditingId(null); setDraftId(null); }}
          className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        >
          Ajouter une publication
        </motion.button>
      </div>

      {showForm && (
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-50 rounded-lg p-4 mb-4 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titre</label>
              <input
                ref={firstRef}
                type="text"
                value={form.title}
                onChange={(e)=>live({title:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Article scientifique"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Éditeur / Journal</label>
              <input
                type="text"
                value={form.publisher}
                onChange={(e)=>live({publisher:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: IEEE, Elsevier..."
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="text"
                value={form.date}
                onChange={(e)=>live({date:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="YYYY-MM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Lien</label>
              <input
                type="text"
                value={form.link}
                onChange={(e)=>live({link:e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e)=>live({description:e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Une ligne = une puce"
            />
          </div>

          <div className="flex gap-3">
            <motion.button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Terminer</motion.button>
            <motion.button type="button" onClick={reset} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Annuler</motion.button>
          </div>
        </motion.form>
      )}

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-3 border border-slate-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="text-sm">
                <div className="font-semibold text-slate-900">{it.title}</div>
                <div className="text-slate-700">
                  {it.publisher}{it.date ? ` — ${it.date}` : ''}{it.link ? ` — ${it.link}` : ''}
                </div>
              </div>
            </div>
            {it.description && (
              <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
                {safeLines(it.description).map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            )}
            <div className="mt-2 flex items-center gap-2">
              <button type="button" onClick={() => onRemove(it.id)} className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">Supprimer</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && <div className="text-slate-500 text-sm">Aucune publication ajoutée</div>}
      </div>
    </div>
  );
}

// Section personnalisée
function CustomFreeForm({ items = [], onAdd, onUpdate, onRemove }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [form, setForm] = useState({ label:'', description:'' });

  const firstRef = useRef(null);
  useEffect(() => {
    if (showForm && firstRef.current) {
      const t = setTimeout(() => firstRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [showForm]);

  const ensureDraft = (next) => {
    if (editingId) return { id: editingId, created: false };
    if (draftId)  return { id: draftId,  created: false };
    const id = Date.now() + Math.random();
    onAdd({ id, label: next.label || '', description: next.description || '' });
    setDraftId(id); setEditingId(id);
    return { id, created: true };
  };

  const live = (partial) => {
    const next = { ...form, ...partial };
    setForm(next);
    const { id, created } = ensureDraft(next);
    if (!created) {
      onUpdate(id, { label: next.label || '', description: next.description || '' });
    }
  };

  const reset = () => {
    setShowForm(false); setEditingId(null); setDraftId(null);
    setForm({ label:'', description:'' });
  };

  const submit = (e) => { e.preventDefault(); reset(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <motion.button
          type="button"
          onClick={() => { setShowForm(true); setEditingId(null); setDraftId(null); }}
          className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        >
          Ajouter un élément
        </motion.button>
      </div>

      {showForm && (
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-50 rounded-lg p-4 mb-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Libellé</label>
            <input
              ref={firstRef}
              type="text"
              value={form.label}
              onChange={(e)=>live({label:e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Activités, Réalisations marquantes…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Détails</label>
            <textarea
              value={form.description}
              onChange={(e)=>live({description:e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Une ligne = une puce"
            />
          </div>

          <div className="flex gap-3">
            <motion.button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Terminer</motion.button>
            <motion.button type="button" onClick={reset} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Annuler</motion.button>
          </div>
        </motion.form>
      )}

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-3 border border-slate-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="text-sm">
                <div className="font-semibold text-slate-900">{it.label}</div>
              </div>
            </div>
            {it.description && (
              <ul className="list-disc ml-5 mt-2 text-sm text-slate-700 space-y-1">
                {safeLines(it.description).map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            )}
            <div className="mt-2 flex items-center gap-2">
              <button type="button" onClick={() => onRemove(it.id)} className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">Supprimer</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && <div className="text-slate-500 text-sm">Aucun élément ajouté</div>}
      </div>
    </div>
  );
}

// Signature
function SignatureForm({ value = {}, onChange }) {
  const meta = { align: value.align || 'right', includeDate: value.includeDate !== false };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Alignement</label>
          <select
            value={meta.align}
            onChange={(e)=>onChange({ ...meta, align: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="left">Gauche</option>
            <option value="center">Centre</option>
            <option value="right">Droite</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="sig-date"
            type="checkbox"
            checked={meta.includeDate}
            onChange={(e)=>onChange({ ...meta, includeDate: e.target.checked })}
          />
          <label htmlFor="sig-date" className="text-sm">Afficher la date du jour</label>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        La signature s’affichera en bas du CV avec la date (optionnel) et le nom du candidat, avec un espace pour signer.
      </p>
    </div>
  );
}
