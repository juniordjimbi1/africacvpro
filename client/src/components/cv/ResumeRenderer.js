// src/components/cv/ResumeRenderer.js
import React from 'react';
import { TemplateClassic } from './TemplateClassic';

/**
 * Moteur de rendu des templates CV.
 * Pour l’instant, un seul template: "classic".
 * Plus tard: modern, executive, etc.
 */
export function ResumeRenderer({ cvData, templateKey }) {
  const key = templateKey || (cvData && cvData.template) || 'classic';

  switch (key) {
    case 'classic':
    default:
      return <TemplateClassic cvData={cvData} />;
  }
}
