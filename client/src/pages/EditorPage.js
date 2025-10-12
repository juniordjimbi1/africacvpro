import React, { useState, useEffect, useCallback } from 'react';
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
import { cvAPI } from '../services/cvAPI';

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
    // Champs supplémentaires
    birthDate: '',
    birthPlace: '',
    driving: '',
    gender: '',
    nationality: '',
    civilStatus: '',
    website: '',
    linkedin: '',
    customFields: []
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

  // Auto-sauvegarde simulée (en attendant le backend)
  const { saveStatus, triggerSave } = useAutoSave(cvData, 1500);

  const updateCVData = useCallback((updates) => {
    setCvData(prev => {
      const newData = { ...prev, ...updates };
      triggerSave(newData);
      return newData;
    });
  }, [triggerSave]);

  const updateSection = useCallback((section, data) => {
    updateCVData({ [section]: data });
  }, [updateCVData]);

  const addItem = useCallback((section, item) => {
    const newItem = {
      ...item,
      id: Date.now() + Math.random(),
      orderIndex: cvData[section].length
    };
    
    updateCVData({
      [section]: [...cvData[section], newItem]
    });
  }, [cvData, updateCVData]);

  const updateItem = useCallback((section, itemId, updates) => {
    updateCVData({
      [section]: cvData[section].map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    });
  }, [cvData, updateCVData]);

  const removeItem = useCallback((section, itemId) => {
    updateCVData({
      [section]: cvData[section].filter(item => item.id !== itemId)
    });
  }, [cvData, updateCVData]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Fonction pour gérer l'import de fichier
  const handleFileImport = async (file) => {
    try {
      // Simulation d'import
      console.log('Import du fichier:', file.name);
      
      // Ici on appellerait l'API d'import
      // const result = await cvAPI.importCV(cvData.id, file);
      
      // Pour l'instant, on simule des données
      const mockData = {
        personal: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@email.com',
          phone: '+33 1 23 45 67 89'
        },
        education: [
          {
            id: Date.now(),
            degree: 'Master en Informatique',
            school: 'Université Paris-Saclay',
            city: 'Paris',
            startDate: '2020-09-01',
            endDate: '2022-06-30',
            description: 'Spécialisation en intelligence artificielle'
          }
        ]
      };
      
      // Fusionner avec les données existantes
      setCvData(prev => ({
        ...prev,
        personal: { ...prev.personal, ...mockData.personal },
        education: [...prev.education, ...mockData.education]
      }));
      
      alert('CV importé avec succès ! Les données ont été ajoutées à votre CV actuel.');
    } catch (error) {
      console.error('Erreur import:', error);
      alert('Erreur lors de l\'import du CV');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* En-tête avec statut sauvegarde */}
        <div className="py-4 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Éditeur de CV</h1>
            <div className="text-sm text-slate-500">
              {saveStatus}
            </div>
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid lg:grid-cols-2 gap-8 py-6">
          {/* Colonne gauche - Formulaire avec accordéons */}
          <div className="space-y-6">
            {/* Section Importation */}
            <ImportSection onFileImport={handleFileImport} />

            {/* Accordéons des sections */}
            <div className="space-y-4">
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

              {/* Sections personnalisées */}
              <CustomSections
                data={cvData.customSections}
                isExpanded={expandedSection === 'custom'}
                onToggle={() => toggleSection('custom')}
                onChange={(sections) => updateSection('customSections', sections)}
              />
            </div>

            {/* CTA Recevoir */}
            <motion.button
              onClick={() => setShowReceivePanel(true)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-colors text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📱 Recevoir mon CV
            </motion.button>
          </div>

          {/* Colonne droite - Aperçu A4 Sticky */}
          <div className="lg:sticky lg:top-24 h-fit">
            <PreviewPanel 
              cvData={cvData}
              settings={previewSettings}
            />
          </div>
        </div>
      </div>

      {/* Barre d'outils basse */}
      <BottomToolbar
        settings={previewSettings}
        onSettingsChange={setPreviewSettings}
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