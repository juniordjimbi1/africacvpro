// src/pages/EditorPage.js
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';

// Chemins corrects depuis src/pages/
import { PreviewPanel } from '../components/editor/PreviewPanel';
import { PersonalAccordion } from '../components/editor/PersonalAccordion';
import { ProfileAccordion } from '../components/editor/ProfileAccordion';
import { EducationAccordion } from '../components/editor/EducationAccordion';
import { ExperienceAccordion } from '../components/editor/ExperienceAccordion';
import { SkillsAccordion } from '../components/editor/SkillsAccordion';
import { LanguagesAccordion } from '../components/editor/LanguagesAccordion';
import { InterestsAccordion } from '../components/editor/InterestsAccordion';
import { CustomSections } from '../components/editor/CustomSections';
import { BottomToolbar } from '../components/editor/BottomToolbar';
import { ReceivePanel } from '../components/editor/ReceivePanel';
import { ImportSection } from '../components/editor/ImportSection';
import { useAutoSave } from '../hooks/useAutoSave';

// === État initial (inchangé) ===
const initialCVData = {
  id: null,
  title: 'Mon CV',
  template: 'classic',
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    jobTitle: '',
    birthDate: '',
    birthPlace: '',
    nationality: '',
    driving: '',
    website: '',
    linkedin: '',
    photoUrl: ''
  },
  profile: { summary: '' },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  interests: [],
  customSections: [],
  sectionMeta: {}
};

function EditorPage() {
  // ---------------- Core states ----------------
  const [cvData, setCvData] = useState(initialCVData);
  const [expandedSection, setExpandedSection] = useState('personal');
  const [showReceivePanel, setShowReceivePanel] = useState(false);

  // Préférences d’aperçu (inchangées)
  const [previewSettings] = useState({
    fontSize: 'medium',
    lineHeight: 1.25,
    colorScheme: 'blue',
    dateFormat: 'DMY_LONG'
  });

  // Auto-save (debounce)
  const { saveStatus, triggerSave } = useAutoSave(cvData, 1500);

  // Focus mode: masquer navbar/footer globaux + lock scroll body
  useEffect(() => {
    document.body.classList.add('editor-focus-mode');
    return () => document.body.classList.remove('editor-focus-mode');
  }, []);

  // Normalisation sûre au montage
  useEffect(() => {
    setCvData(prev => ({
      ...prev,
      customSections: Array.isArray(prev.customSections) ? prev.customSections : [],
      sectionMeta: prev.sectionMeta || {}
    }));
  }, []);

  // ---------------- Helpers de mise à jour ----------------
  const updateCVData = useCallback((updates) => {
    setCvData(prev => {
      const next = { ...prev, ...updates };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  const updateSection = useCallback((section, data) => {
    // ⚠️ MERGE sûr (accepte objet partiel)
    setCvData(prev => {
      const next = {
        ...prev,
        [section]: { ...(prev[section] || {}), ...(data || {}) }
      };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  // NEW: accepte onChange(field, value) ou onChange(partialObject)
  const mergeSectionField = useCallback((section, field, value) => {
    setCvData(prev => {
      const curr = { ...(prev[section] || {}) };
      if (typeof field === 'string') {
        curr[field] = value;
      } else if (field && typeof field === 'object') {
        Object.assign(curr, field);
      }
      const next = { ...prev, [section]: curr };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  const setSectionMeta = useCallback((key, updates) => {
    setCvData(prev => {
      const next = {
        ...prev,
        sectionMeta: {
          ...(prev.sectionMeta || {}),
          [key]: {
            ...(prev.sectionMeta?.[key] || {}),
            ...updates
          }
        }
      };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  // Items CRUD (pour toutes les sections listées)
  const addItem = useCallback((section, item) => {
    setCvData(prev => {
      const newItem = {
        ...item,
        id: item?.id ?? (Date.now() + Math.random()),
        orderIndex: (prev[section]?.length ?? 0)
      };
      const next = { ...prev, [section]: [...(prev[section] || []), newItem] };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  const updateItem = useCallback((section, itemId, updates) => {
    setCvData(prev => {
      const list = prev[section] || [];
      const nextList = list.map(it => it.id === itemId ? { ...it, ...updates } : it);
      const next = { ...prev, [section]: nextList };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  const removeItem = useCallback((section, itemId) => {
    setCvData(prev => {
      const next = { ...prev, [section]: (prev[section] || []).filter(it => it.id !== itemId) };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  // ---------------- Focus mode : barre du haut + layout plein écran ----------------

  // Document title dynamique <Nom>.pdf
  const fullName = [cvData.personal?.firstName, cvData.personal?.lastName].filter(Boolean).join(' ').trim();
  const docTitle = (fullName || cvData.title || 'Mon CV') + '.pdf';

  // Langue active (placeholder)
  const [locale, setLocale] = useState('fr');

  const openReceive = () => setShowReceivePanel(true);

  const handleDocRename = () => {
    const current = cvData.title || 'Mon CV';
    const next = window.prompt('Renommer le document', current);
    if (typeof next === 'string' && next.trim()) {
      updateCVData({ title: next.trim() });
    }
  };

  const duplicateDoc = () => {
    const cloned = JSON.parse(JSON.stringify(cvData));
    delete cloned.id;
    cloned.title = (cloned.title || 'Mon CV') + ' (copie)';
    setCvData(cloned);
  };

  // Retour : si pas d’historique, fallback vers /
  // Retour : revenir à la page d’origine mémorisée (Modèles, Tarifs, etc.)
const handleBack = () => {
  try {
    const page = localStorage.getItem('africacv_return_page') || 'Accueil';
    window.dispatchEvent(new CustomEvent('editor:navigate', { detail: { page } }));
    // (optionnel) clean
    // localStorage.removeItem('africacv_return_page');
  } catch (e) {
    // Fallback très sûr
    window.location.assign('/');
  }
};


  // ---------- ✅ BRIDGE ULTRA-ROBUSTE pour "Informations personnelles" ----------
  // (exactement ta version, inséré au même niveau que setCvData/cvData)
  const applyPersonalPatch = (updater) => {
    setCvData(prev => {
      const prevPersonal = prev?.personal || {};
      let nextPersonal = typeof updater === 'function'
        ? updater(prevPersonal)
        : { ...prevPersonal, ...(updater || {}) };

      // Toujours recalculer fullName à partir de firstName/lastName pour éviter les
      // décalages entre différentes signatures d'appel. Cela garantit que
      // nextPersonal.fullName reste synchronisé même lorsque l'appelant envoie
      // un patch partiel sans gérer fullName manuellement.
      {
        const fn = (nextPersonal.firstName || '').toString().trim();
        const ln = (nextPersonal.lastName || '').toString().trim();
        const full = `${fn} ${ln}`.trim();
        nextPersonal = { ...nextPersonal, fullName: full };
      }

      // Harmoniser les clés photo/photoUrl au sein de l'objet personal : si l'une est
      // définie mais pas l'autre, répercuter la valeur. Ceci évite que l'aperçu
      // n'affiche pas la photo selon la clé utilisée.
      if (nextPersonal.photoUrl && !nextPersonal.photo) {
        nextPersonal = { ...nextPersonal, photo: nextPersonal.photoUrl };
      } else if (nextPersonal.photo && !nextPersonal.photoUrl) {
        nextPersonal = { ...nextPersonal, photoUrl: nextPersonal.photo };
      }

      // Miroirs de compat (facultatif mais utile pour l’existant)
      const mirrorRoot = {};
      [
        'firstName','lastName','jobTitle','email','phone','city',
        'website','linkedin','photoUrl','photo','fullName'
      ].forEach(k => {
        if (k in nextPersonal) mirrorRoot[k] = nextPersonal[k];
      });

      const nextCv = {
        ...prev,
        personal: nextPersonal,     // source de vérité pour PreviewPanel
        personalInfo: nextPersonal, // compat éventuelle
        ...mirrorRoot               // compat legacy racine
      };

      triggerSave(nextCv);
      return nextCv;
    });
  };

  const onPersonalBridge = (...args) => {
    // 1) (field, value)
    if (typeof args[0] === 'string' && args.length === 2 && typeof args[1] !== 'object') {
      const [field, value] = args;
      if (field === 'firstName' || field === 'lastName') {
        applyPersonalPatch(prev => {
          const draft = { ...prev, [field]: value };
          const fn = draft.firstName || '';
          const ln = draft.lastName || '';
          draft.fullName = `${fn} ${ln}`.trim();
          return draft;
        });
      } else if (field === 'photoUrl' || field === 'photo') {
        applyPersonalPatch(prev => ({
          ...prev,
          photoUrl: field === 'photoUrl' ? value : (prev.photoUrl || value),
          photo:    field === 'photo'    ? value : (prev.photo || value)
        }));
      } else {
        applyPersonalPatch({ [field]: value });
      }
      return;
    }

    // 2) (section, field, value)
    if (typeof args[0] === 'string' && args.length === 3) {
      const [section, field, value] = args;
      if (section === 'personal') {
        return onPersonalBridge(field, value);
      }
      return;
    }

    // 3) (patchObject) ou (section, patchObject)
    if (typeof args[0] === 'object' && args[0]) {
      const patch = args[0];
      if ('personal' in patch && typeof patch.personal === 'object') {
        applyPersonalPatch(patch.personal);
      } else {
        applyPersonalPatch(patch);
      }
      return;
    }

    if (typeof args[0] === 'string' && typeof args[1] === 'object') {
      const [section, patch] = args;
      if (section === 'personal') {
        applyPersonalPatch(patch);
      }
    }
  };

  // ---------- Pont de compatibilité pour le Preview ----------
  const cvDataForPreview = useMemo(() => {
    const p = cvData.personal || {};
    const flat = {
      ...cvData,
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      fullName:
        (p.fullName && p.fullName.trim()) ||
        [p.firstName, p.lastName].filter(Boolean).join(' ').trim(),
      jobTitle: p.jobTitle || cvData.jobTitle || '',
      email: p.email || '',
      phone: p.phone || '',
      address: p.address || '',
      city: p.city || '',
      birthDate: p.birthDate || '',
      birthPlace: p.birthPlace || '',
      nationality: p.nationality || '',
      driving: p.driving || '',
      website: p.website || '',
      linkedin: p.linkedin || '',
      photo: p.photoUrl || p.photo || ''
    };
    return flat;
  }, [cvData]);

  // ---------------- Rendu ----------------
  return (
    <div className="fixed inset-0 z-[999] bg-slate-50 flex flex-col">
      {/* Top bar compacte (sticky) */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm h-14">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          {/* Retour gauche */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-300 hover:bg-slate-50"
              title="Retour"
            >
              ←
            </button>
            <div className="text-sm md:text-base font-medium text-slate-700 truncate max-w-[40vw]">
              {docTitle}
            </div>
          </div>

          {/* Actions droites : Langue | Kebab doc | Recevoir */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 mr-2">
              {['fr','en','es'].map(l => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2 py-1 rounded text-sm border ${locale === l ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                  title={l.toUpperCase()}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="relative">
              <details className="group">
                <summary
                  onClick={(e) => { e.preventDefault(); }}
                  onMouseDown={(e) => { e.stopPropagation(); }}
                  className="list-none inline-flex items-center justify-center h-9 w-9 rounded-md border border-slate-300 hover:bg-slate-50 cursor-pointer select-none"
                  aria-haspopup="menu"
                  aria-expanded="false"
                >
                  ⋮
                </summary>
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg p-1 z-50"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={handleDocRename}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 text-sm"
                    role="menuitem"
                  >
                    Renommer
                  </button>
                  <button
                    type="button"
                    disabled
                    className="w-full text-left px-3 py-2 rounded text-slate-400 cursor-not-allowed text-sm"
                    role="menuitem"
                    title="Bientôt disponible"
                  >
                    Partager
                  </button>
                  <button
                    type="button"
                    onClick={duplicateDoc}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 text-sm"
                    role="menuitem"
                  >
                    Dupliquer
                  </button>
                </div>
              </details>
            </div>

            <button
              type="button"
              onClick={openReceive}
              className="ml-2 inline-flex items-center gap-2 px-4 h-9 rounded-md bg-primary-600 text-white hover:bg-primary-700"
            >
              Recevoir mon CV
            </button>
          </div>
        </div>
      </div>

      {/* Grille 2 colonnes sous la top bar (focus mode) */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[45%_55%] gap-4 md:gap-5 px-4 md:px-6 py-3">
        {/* Colonne Formulaire */}
        <div
          className="rounded-lg border border-slate-200 shadow-sm xl:ml-4"
          style={{ height: 'calc(100vh - 56px - 16px)', overflowY: 'auto', overscrollBehavior: 'contain' }}
        >
          <div className="p-4 md:p-6 space-y-4">
            <ImportSection
              onParsed={(partial) => {
                updateCVData(partial);
              }}
            />

            {/* ⇩⇩⇩ Branchements demandés */}
            <PersonalAccordion
              data={cvData?.personal || {}}
              isExpanded={expandedSection === 'personal'}
              onToggle={() => setExpandedSection(expandedSection === 'personal' ? '' : 'personal')}
              onChange={onPersonalBridge}
              onPersonalChange={onPersonalBridge}
              onSectionChange={onPersonalBridge}
            />

            <ProfileAccordion
              data={cvData.profile}
              isExpanded={expandedSection === 'profile'}
              onToggle={() => setExpandedSection(expandedSection === 'profile' ? '' : 'profile')}
              onChange={(payload, value) =>
                typeof payload === 'string'
                  ? mergeSectionField('profile', payload, value)
                  : updateSection('profile', payload)
              }
              meta={cvData.sectionMeta?.profile || {}}
              onMetaChange={(m) => setSectionMeta('profile', m)}
            />

            <ExperienceAccordion
              data={cvData.experience}
              isExpanded={expandedSection === 'experience'}
              onToggle={() => setExpandedSection(expandedSection === 'experience' ? '' : 'experience')}
              onAddItem={(item) => addItem('experience', item)}
              onUpdateItem={(id, upd) => updateItem('experience', id, upd)}
              onRemoveItem={(id) => removeItem('experience', id)}
              meta={cvData.sectionMeta?.experience || {}}
              onMetaChange={(m) => setSectionMeta('experience', m)}
            />

            <EducationAccordion
              data={cvData.education}
              isExpanded={expandedSection === 'education'}
              onToggle={() => setExpandedSection(expandedSection === 'education' ? '' : 'education')}
              onAddItem={(item) => addItem('education', item)}
              onUpdateItem={(id, upd) => updateItem('education', id, upd)}
              onRemoveItem={(id) => removeItem('education', id)}
              meta={cvData.sectionMeta?.education || {}}
              onMetaChange={(m) => setSectionMeta('education', m)}
            />

            <SkillsAccordion
              data={cvData.skills}
              isExpanded={expandedSection === 'skills'}
              onToggle={() => setExpandedSection(expandedSection === 'skills' ? '' : 'skills')}
              onAddItem={(item) => addItem('skills', item)}
              onUpdateItem={(id, upd) => updateItem('skills', id, upd)}
              onRemoveItem={(id) => removeItem('skills', id)}
              meta={cvData.sectionMeta?.skills || {}}
              onMetaChange={(m) => setSectionMeta('skills', m)}
            />

            <LanguagesAccordion
              data={cvData.languages}
              isExpanded={expandedSection === 'languages'}
              onToggle={() => setExpandedSection(expandedSection === 'languages' ? '' : 'languages')}
              onAddItem={(item) => addItem('languages', item)}
              onUpdateItem={(id, upd) => updateItem('languages', id, upd)}
              onRemoveItem={(id) => removeItem('languages', id)}
              meta={cvData.sectionMeta?.languages || {}}
              onMetaChange={(m) => setSectionMeta('languages', m)}
            />

            <InterestsAccordion
              data={cvData.interests}
              isExpanded={expandedSection === 'interests'}
              onToggle={() => setExpandedSection(expandedSection === 'interests' ? '' : 'interests')}
              onAddItem={(item) => addItem('interests', item)}
              onUpdateItem={(id, upd) => updateItem('interests', id, upd)}
              onRemoveItem={(id) => removeItem('interests', id)}
              meta={cvData.sectionMeta?.interests || {}}
              onMetaChange={(m) => setSectionMeta('interests', m)}
            />

            <CustomSections
              data={cvData.customSections}
              isExpanded={expandedSection === 'custom'}
              onToggle={() => setExpandedSection(expandedSection === 'custom' ? '' : 'custom')}
              onChange={(next) => updateCVData({ customSections: next })}
            />

            {/* CTA bas */}
            <div className="pt-2">
              <button
                type="button"
                onClick={openReceive}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-primary-600 text-white hover:bg-primary-700"
              >
                Recevoir mon CV
              </button>
              <div className="mt-2 text-xs text-slate-500">{saveStatus}</div>
            </div>
          </div>
        </div>

        {/* Colonne Aperçu (scroll indépendant, sans scroll horizontal) */}
        <div
          className="rounded-lg border border-slate-200 shadow-sm xl:mr-2"
          style={{
            height: 'calc(100vh - 56px - 16px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="p-4 md:p-6">
            <div className="flex justify-center">
              <PreviewPanel cvData={cvDataForPreview} settings={previewSettings} />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReceivePanel && (
          <ReceivePanel onClose={() => setShowReceivePanel(false)} cvData={cvData} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Export par défaut + export nommé (compat App.js)
export default EditorPage;
export { EditorPage };
