// src/pages/EditorPage.js
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';

import { ResumeRenderer } from '../components/cv/ResumeRenderer';
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
import { buildWhatsappUrl } from '../utils/whatsapp';

const initialCVData = {
  id: null,
  title: 'Mon CV',
  template: 'classic',
  personal: {
    firstName: '',
    lastName: '',
    fullName: '',
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
    photoUrl: '',
    photo: '',
    customFields: []
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

function mapTemplateIdToKey(templateId) {
  switch (templateId) {
    case 'template-1':
      return 'classic';
    case 'template-2':
      return 'modern';
    case 'template-3':
      return 'executive';
    default:
      return 'classic';
  }
}

function EditorPage() {
  const [cvData, setCvData] = useState(initialCVData);
  const [expandedSection, setExpandedSection] = useState('personal');
  const [showReceivePanel, setShowReceivePanel] = useState(false);

  const [previewSettings] = useState({
    fontSize: 'medium',
    lineHeight: 1.25,
    colorScheme: 'blue',
    dateFormat: 'DMY_LONG'
  });

  const { saveStatus, triggerSave } = useAutoSave(cvData, 1500);

  useEffect(() => {
    document.body.classList.add('editor-focus-mode');
    return () => document.body.classList.remove('editor-focus-mode');
  }, []);

  useEffect(() => {
    setCvData(prev => ({
      ...prev,
      customSections: Array.isArray(prev.customSections) ? prev.customSections : [],
      sectionMeta: prev.sectionMeta || {}
    }));
  }, []);

  useEffect(() => {
    const tplId = localStorage.getItem('africacv_template_id');
    if (!tplId) return;
    const key = mapTemplateIdToKey(tplId);
    setCvData(prev => ({
      ...prev,
      template: key || prev.template || 'classic'
    }));
  }, []);

  const updateCVData = useCallback((updates) => {
    setCvData(prev => {
      const next = { ...prev, ...updates };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  const updateSection = useCallback((section, data) => {
    setCvData(prev => {
      const next = {
        ...prev,
        [section]: { ...(prev[section] || {}), ...(data || {}) }
      };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

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
      const next = {
        ...prev,
        [section]: (prev[section] || []).filter(it => it.id !== itemId)
      };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  // 🔴 PONT SIMPLE POUR LES INFOS PERSONNELLES
  const handlePersonalChange = useCallback((fieldOrPatch, maybeValue) => {
    setCvData(prev => {
      const prevPersonal = prev.personal || {};
      let nextPersonal;

      if (typeof fieldOrPatch === 'string') {
        nextPersonal = { ...prevPersonal, [fieldOrPatch]: maybeValue };
      } else if (
        fieldOrPatch &&
        typeof fieldOrPatch === 'object' &&
        !Array.isArray(fieldOrPatch)
      ) {
        nextPersonal = { ...prevPersonal, ...fieldOrPatch };
      } else {
        return prev;
      }

      const fn = (nextPersonal.firstName || '').toString().trim();
      const ln = (nextPersonal.lastName || '').toString().trim();
      const full = `${fn} ${ln}`.trim();

      let merged = { ...nextPersonal, fullName: full };

      // garder photo / photoUrl synchro
      let photoUrl = merged.photoUrl || merged.photo || '';
      let photo = merged.photo || merged.photoUrl || '';
      if (photoUrl && !photo) photo = photoUrl;
      if (photo && !photoUrl) photoUrl = photo;
      merged = { ...merged, photoUrl, photo };

      const next = {
        ...prev,
        personal: merged,
        personalInfo: merged,
        firstName: fn,
        lastName: ln,
        fullName: full,
        jobTitle: merged.jobTitle || prev.jobTitle || '',
        email: merged.email || prev.email || '',
        phone: merged.phone || prev.phone || '',
        address: merged.address || prev.address || '',
        city: merged.city || prev.city || '',
        website: merged.website || prev.website || '',
        linkedin: merged.linkedin || prev.linkedin || '',
        photoUrl,
        photo
      };

      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  const fullName = [
    cvData.personal?.firstName,
    cvData.personal?.lastName
  ].filter(Boolean).join(' ').trim();

  const docTitle = (fullName || cvData.title || 'Mon CV') + '.pdf';

  const [locale, setLocale] = useState('fr');

  const handleReceiveOnWhatsApp = useCallback(() => {
    const offerUi = localStorage.getItem('africacv_offer');
    const offer = offerUi === 'pro' ? 'human' : (offerUi || 'auto');

    const resumeId  = localStorage.getItem('africacv_resume_id') || '';
    const templateId = localStorage.getItem('africacv_template_id') || '';
    const email     = localStorage.getItem('user_email') || '';
    const title     = docTitle;

    if (!resumeId) {
      alert("Brouillon introuvable. Reviens depuis Modèles/Offres et relance la création.");
      return;
    }

    const url = buildWhatsappUrl(
      { offer, templateId, resumeId, email, title },
      { phone: '221770914220' }
    );
    window.open(url, '_blank');
  }, [docTitle]);

  const handleBack = () => {
    try {
      const page = localStorage.getItem('africacv_return_page') || 'Accueil';
      window.dispatchEvent(
        new CustomEvent('editor:navigate', { detail: { page } })
      );
    } catch (e) {
      window.location.assign('/');
    }
  };

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

  const cvDataForPreview = useMemo(() => {
    const p = cvData.personal || {};
    return {
      ...cvData,
      personal: p,
      personalInfo: p,
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      fullName:
        (p.fullName && p.fullName.trim()) ||
        [p.firstName, p.lastName].filter(Boolean).join(' ').trim(),
      jobTitle: p.jobTitle || cvData.jobTitle || '',
      email: p.email || cvData.email || '',
      phone: p.phone || cvData.phone || '',
      address: p.address || cvData.address || '',
      city: p.city || cvData.city || '',
      birthDate: p.birthDate || cvData.birthDate || '',
      birthPlace: p.birthPlace || cvData.birthPlace || '',
      nationality: p.nationality || cvData.nationality || '',
      driving: p.driving || cvData.driving || '',
      website: p.website || cvData.website || '',
      linkedin: p.linkedin || cvData.linkedin || '',
      photoUrl: p.photoUrl || p.photo || cvData.photoUrl || cvData.photo || '',
      photo: p.photo || p.photoUrl || cvData.photo || cvData.photoUrl || ''
    };
  }, [cvData]);

  return (
    <div className="fixed inset-0 z-[999] bg-slate-50 flex flex-col">
      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm h-14">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
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

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 mr-2">
              {['fr','en','es'].map(l => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2 py-1 rounded text-sm border ${
                    locale === l
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
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
              onClick={handleReceiveOnWhatsApp}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!localStorage.getItem('africacv_resume_id')}
            >
              Recevoir sur WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[45%_55%] gap-4 md:gap-5 px-4 md:px-6 py-3">
        {/* FORMULAIRE */}
        <div
          className="rounded-lg border border-slate-200 shadow-sm xl:ml-4"
          style={{
            height: 'calc(100vh - 56px - 16px)',
            overflowY: 'auto',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="p-4 md:p-6 space-y-4">
            <ImportSection
              onParsed={(partial) => {
                updateCVData(partial);
              }}
            />

            <PersonalAccordion
              data={cvData.personal || {}}
              isExpanded={expandedSection === 'personal'}
              onToggle={() =>
                setExpandedSection(
                  expandedSection === 'personal' ? '' : 'personal'
                )
              }
              onChange={handlePersonalChange}
            />

            <ProfileAccordion
              data={cvData.profile}
              isExpanded={expandedSection === 'profile'}
              onToggle={() =>
                setExpandedSection(
                  expandedSection === 'profile' ? '' : 'profile'
                )
              }
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
              onToggle={() =>
                setExpandedSection(
                  expandedSection === 'experience' ? '' : 'experience'
                )
              }
              onAddItem={(item) => addItem('experience', item)}
              onUpdateItem={(id, upd) => updateItem('experience', id, upd)}
              onRemoveItem={(id) => removeItem('experience', id)}
              meta={cvData.sectionMeta?.experience || {}}
              onMetaChange={(m) => setSectionMeta('experience', m)}
            />

            <EducationAccordion
              data={cvData.education}
              isExpanded={expandedSection === 'education'}
              onToggle={() =>
                setExpandedSection(
                  expandedSection === 'education' ? '' : 'education'
                )
              }
              onAddItem={(item) => addItem('education', item)}
              onUpdateItem={(id, upd) => updateItem('education', id, upd)}
              onRemoveItem={(id) => removeItem('education', id)}
              meta={cvData.sectionMeta?.education || {}}
              onMetaChange={(m) => setSectionMeta('education', m)}
            />

            <SkillsAccordion
              data={cvData.skills}
              isExpanded={expandedSection === 'skills'}
              onToggle={() =>
                setExpandedSection(
                  expandedSection === 'skills' ? '' : 'skills'
                )
              }
              onAddItem={(item) => addItem('skills', item)}
              onUpdateItem={(id, upd) => updateItem('skills', id, upd)}
              onRemoveItem={(id) => removeItem('skills', id)}
              meta={cvData.sectionMeta?.skills || {}}
              onMetaChange={(m) => setSectionMeta('skills', m)}
            />

            <LanguagesAccordion
              data={cvData.languages}
              isExpanded={expandedSection === 'languages'}
              onToggle={() =>
                setExpandedSection(
                  expandedSection === 'languages' ? '' : 'languages'
                )
              }
              onAddItem={(item) => addItem('languages', item)}
              onUpdateItem={(id, upd) => updateItem('languages', id, upd)}
              onRemoveItem={(id) => removeItem('languages', id)}
              meta={cvData.sectionMeta?.languages || {}}
              onMetaChange={(m) => setSectionMeta('languages', m)}
            />

            <InterestsAccordion
              data={cvData.interests}
              isExpanded={expandedSection === 'interests'}
              onToggle={() =>
                setExpandedSection(
                  expandedSection === 'interests' ? '' : 'interests'
                )
              }
              onAddItem={(item) => addItem('interests', item)}
              onUpdateItem={(id, upd) => updateItem('interests', id, upd)}
              onRemoveItem={(id) => removeItem('interests', id)}
              meta={cvData.sectionMeta?.interests || {}}
              onMetaChange={(m) => setSectionMeta('interests', m)}
            />

            <CustomSections
              data={cvData.customSections}
              isExpanded={expandedSection === 'custom'}
              onToggle={() =>
                setExpandedSection(
                  expandedSection === 'custom' ? '' : 'custom'
                )
              }
              onChange={(next) => updateCVData({ customSections: next })}
            />

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReceiveOnWhatsApp}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!localStorage.getItem('africacv_resume_id')}
                title="Envoi du CV final sur WhatsApp après validation"
              >
                Recevoir sur WhatsApp
              </button>

              <div className="mt-2 text-xs text-slate-500">{saveStatus}</div>
            </div>
          </div>
        </div>

        {/* APERÇU TEMPLATE */}
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
              <ResumeRenderer
                cvData={cvDataForPreview}
                templateKey={cvData.template || 'classic'}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showReceivePanel && (
          <ReceivePanel onClose={() => setShowReceivePanel(false)} cvData={cvData} />
        )}
      </AnimatePresence>

      {/* BottomToolbar reste si tu l'utilises */}
      <BottomToolbar cvData={cvData} />
    </div>
  );
}

export default EditorPage;
export { EditorPage };
