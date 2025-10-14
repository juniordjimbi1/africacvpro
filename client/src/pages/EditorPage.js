import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PreviewPanel } from '../components/editor/PreviewPanel';
import { ImportSection } from '../components/editor/ImportSection';
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
import { useAutoSave } from '../hooks/useAutoSave';

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
  profile: {
    summary: ''
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  interests: [],
  customSections: []
};

export function EditorPage() {
  const [cvData, setCvData] = useState(initialCVData);
  const [expandedSection, setExpandedSection] = useState('personal');
  const [showReceivePanel, setShowReceivePanel] = useState(false);
  const [previewSettings, setPreviewSettings] = useState({
    fontSize: 'medium',
    lineHeight: 1.25,
    colorScheme: 'blue',
    dateFormat: 'DMY_LONG'
  });

  // Auto-sauvegarde (debounce) branchée sur cvData
  const { saveStatus, triggerSave } = useAutoSave(cvData, 1500);

  // Normalisation sûre au montage (évite undefined → [])
  useEffect(() => {
    setCvData(prev => ({
      ...prev,
      customSections: Array.isArray(prev.customSections) ? prev.customSections : []
    }));
  }, []);

  /** Setter fonctionnel: évite stale state, déclenche autosave */
  const updateCVData = useCallback((updates) => {
    setCvData(prev => {
      const next = { ...prev, ...updates };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  const updateSection = useCallback((section, data) => {
    updateCVData({ [section]: data });
  }, [updateCVData]);

  /** ALWAYS functional setState inside: add / update / remove */
  const addItem = useCallback((section, item) => {
    setCvData(prev => {
      const newItem = {
        ...item,
        id: item?.id ?? (Date.now() + Math.random()),
        orderIndex: (prev[section]?.length ?? 0)
      };
      const next = {
        ...prev,
        [section]: [...(prev[section] || []), newItem]
      };
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
      const list = prev[section] || [];
      const nextList = list.filter(it => it.id !== itemId);
      const next = { ...prev, [section]: nextList };
      triggerSave(next);
      return next;
    });
  }, [triggerSave]);

  const toggleSection = (section) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  // Import (branché sur ta section existante)
  const handleFileImport = async (file) => {
    try {
      console.log('Import du fichier:', file.name);
      // … ton flux existant (upload → parse) reste ici
    } catch (error) {
      console.error('Erreur import:', error);
      alert("Échec de l'import du CV.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        {/* Top bar compacte */}
        <div className="py-4 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Éditeur de CV</h1>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-500">{saveStatus}</div>
              <motion.button
                onClick={() => setShowReceivePanel(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Recevoir mon CV
              </motion.button>
            </div>
          </div>
        </div>

        {/* Layout principal : 1fr | 820px */}
        <div className="grid lg:[grid-template-columns:minmax(0,1fr)_820px] gap-8 py-6">
          {/* Colonne gauche - Formulaire (scroll indépendant) */}
          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            <ImportSection
              cvData={cvData}
              setCvData={setCvData}
              onImportFile={handleFileImport}
            />

            <PersonalAccordion
              data={cvData.personal}
              isExpanded={expandedSection === 'personal'}
              onToggle={() => toggleSection('personal')}
              onChange={(data) => updateSection('personal', data)}
            />

            <ProfileAccordion
              data={cvData.profile}
              isExpanded={expandedSection === 'profile'}
              onToggle={() => toggleSection('profile')}
              onChange={(data) => updateSection('profile', data)}
            />

            <EducationAccordion
              data={cvData.education}
              isExpanded={expandedSection === 'education'}
              onToggle={() => toggleSection('education')}
              onAddItem={(item) => addItem('education', item)}
              onUpdateItem={(itemId, updates) => updateItem('education', itemId, updates)}
              onRemoveItem={(itemId) => removeItem('education', itemId)}
              dateFormat={previewSettings.dateFormat}
            />

            <ExperienceAccordion
              data={cvData.experience}
              isExpanded={expandedSection === 'experience'}
              onToggle={() => toggleSection('experience')}
              onAddItem={(item) => addItem('experience', item)}
              onUpdateItem={(itemId, updates) => updateItem('experience', itemId, updates)}
              onRemoveItem={(itemId) => removeItem('experience', itemId)}
              dateFormat={previewSettings.dateFormat}
            />

            <SkillsAccordion
              data={cvData.skills}
              isExpanded={expandedSection === 'skills'}
              onToggle={() => toggleSection('skills')}
              onAddItem={(item) => addItem('skills', item)}
              onUpdateItem={(itemId, updates) => updateItem('skills', itemId, updates)}
              onRemoveItem={(itemId) => removeItem('skills', itemId)}
            />

            <LanguagesAccordion
              data={cvData.languages}
              isExpanded={expandedSection === 'languages'}
              onToggle={() => toggleSection('languages')}
              onAddItem={(item) => addItem('languages', item)}
              onUpdateItem={(itemId, updates) => updateItem('languages', itemId, updates)}
              onRemoveItem={(itemId) => removeItem('languages', itemId)}
            />

            <InterestsAccordion
              data={cvData.interests}
              isExpanded={expandedSection === 'interests'}
              onToggle={() => toggleSection('interests')}
              onAddItem={(item) => addItem('interests', item)}
              onUpdateItem={(itemId, updates) => updateItem('interests', itemId, updates)}
              onRemoveItem={(itemId) => removeItem('interests', itemId)}
            />

            {/* Sections personnalisées (branchées en live sur le parent) */}
            <CustomSections
              data={cvData.customSections}
              isExpanded={expandedSection === 'custom'}
              onToggle={() => toggleSection('custom')}
              onChange={(sections) => updateSection('customSections', sections)}
            />

            {/* CTA Recevoir (bas de formulaire) */}
            <motion.button
              onClick={() => setShowReceivePanel(true)}
              className="w-full mt-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Recevoir mon CV
            </motion.button>
          </div>

          {/* Colonne droite - Aperçu A4 (scroll indépendant + sticky) */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto pl-2">
            <div className="lg:sticky lg:top-4">
              <PreviewPanel cvData={cvData} settings={previewSettings} />
            </div>
          </div>
        </div>
      </div>

      {/* Barre du bas */}
      <BottomToolbar
        settings={previewSettings}
        onSettingsChange={(s) => setPreviewSettings(s)}
        onReceiveClick={() => setShowReceivePanel(true)}
      />

      {/* Panel Recevoir */}
      <AnimatePresence>
        {showReceivePanel && (
          <ReceivePanel
            cvData={cvData}
            onClose={() => setShowReceivePanel(false)}
            onBackToEdit={() => setShowReceivePanel(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
