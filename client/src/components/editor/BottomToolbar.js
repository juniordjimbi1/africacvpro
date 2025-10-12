import React from 'react';
import { motion } from 'framer-motion';

export function BottomToolbar({ settings, onSettingsChange }) {
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
              value={settings.template}
              onChange={(e) => onSettingsChange({ ...settings, template: e.target.value })}
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
              value={settings.fontFamily}
              onChange={(e) => onSettingsChange({ ...settings, fontFamily: e.target.value })}
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
              {['S', 'M', 'L'].map((size) => (
                <button
                  key={size}
                  onClick={() => onSettingsChange({ ...settings, fontSize: size.toLowerCase() })}
                  className={`w-8 h-8 rounded text-sm ${
                    settings.fontSize === size.toLowerCase()
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {size}
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
                { value: 1.5, label: '1.5' }
              ].map((lineHeight) => (
                <button
                  key={lineHeight.value}
                  onClick={() => onSettingsChange({ ...settings, lineHeight: lineHeight.value })}
                  className={`w-8 h-8 rounded text-sm ${
                    settings.lineHeight === lineHeight.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {lineHeight.label}
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
              value={settings.dateFormat}
              onChange={(e) => onSettingsChange({ ...settings, dateFormat: e.target.value })}
              className="text-sm border border-slate-300 rounded px-2 py-1"
            >
              <option value="DMY_NUM">JJ/MM/AAAA</option>
              <option value="DMY_SHORT">JJ Mois AAAA</option>
              <option value="DMY_LONG">JJ Mois AAAA</option>
              <option value="MY_SHORT">Mois AAAA</option>
              <option value="MY_LONG">Mois AAAA</option>
            </select>
          </div>

          {/* Plein écran */}
          <button className="text-slate-600 hover:text-primary-600 transition-colors">
            ⛶ Plein écran
          </button>
        </div>
      </div>
    </motion.div>
  );
}