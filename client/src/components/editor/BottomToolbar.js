// src/components/editor/BottomToolbar.js
import React from 'react';
import { motion } from 'framer-motion';

// Valeurs par défaut si rien n'est passé en props
const DEFAULT_SETTINGS = {
  template: 'classic',
  fontFamily: 'inter',
  fontSize: 'medium',     // 'small' | 'medium' | 'large' pour coller à PreviewPanel
  lineHeight: 1.25,
  dateFormat: 'DMY_LONG',
};

export function BottomToolbar({ settings, onSettingsChange }) {
  // On merge les settings reçus avec les valeurs par défaut
  const safeSettings = { ...DEFAULT_SETTINGS, ...(settings || {}) };

  const updateSettings = (patch) => {
    const next = { ...safeSettings, ...patch };
    if (typeof onSettingsChange === 'function') {
      onSettingsChange(next);
    }
  };

  const FONT_SIZES = [
    { key: 'small', label: 'S' },
    { key: 'medium', label: 'M' },
    { key: 'large', label: 'L' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Modèles */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Modèle:</span>
            <select
              value={safeSettings.template}
              onChange={(e) => updateSettings({ template: e.target.value })}
              className="text-sm border border-slate-300 rounded px-2 py-1"
            >
              <option value="classic">Classique</option>
              <option value="modern">Moderne</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          {/* Police */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Police:</span>
            <select
              value={safeSettings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value })}
              className="text-sm border border-slate-300 rounded px-2 py-1"
            >
              <option value="inter">Inter</option>
              <option value="arial">Arial</option>
              <option value="georgia">Georgia</option>
            </select>
          </div>

          {/* Taille */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Taille:</span>
            <div className="flex gap-1">
              {FONT_SIZES.map((fs) => (
                <button
                  key={fs.key}
                  onClick={() => updateSettings({ fontSize: fs.key })}
                  className={`w-8 h-8 rounded text-sm ${
                    safeSettings.fontSize === fs.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {fs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interligne */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Interligne:</span>
            <div className="flex gap-1">
              {[
                { value: 1.15, label: '1.15' },
                { value: 1.25, label: '1.25' },
                { value: 1.5, label: '1.5' },
              ].map((lh) => (
                <button
                  key={lh.value}
                  onClick={() => updateSettings({ lineHeight: lh.value })}
                  className={`w-8 h-8 rounded text-sm ${
                    safeSettings.lineHeight === lh.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {lh.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Format dates */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Dates:</span>
            <select
              value={safeSettings.dateFormat}
              onChange={(e) => updateSettings({ dateFormat: e.target.value })}
              className="text-sm border border-slate-300 rounded px-2 py-1"
            >
              <option value="DMY_NUM">JJ/MM/AAAA</option>
              <option value="DMY_SHORT">JJ Mois AAAA</option>
              <option value="DMY_LONG">JJ Mois AAAA</option>
              <option value="MY_SHORT">Mois AAAA</option>
              <option value="MY_LONG">Mois AAAA</option>
            </select>
          </div>

          {/* Plein écran (à brancher plus tard) */}
          <button className="text-slate-600 hover:text-primary-600 transition-colors">
            ⛶ Plein écran
          </button>
        </div>
      </div>
    </motion.div>
  );
}
