import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProfileAccordion({ data, isExpanded, onToggle, onChange }) {
  const textareaRef = useRef();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const applyFormat = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = data.summary.substring(start, end);
    
    if (!selectedText) return;

    let formattedText = selectedText;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `_${selectedText}_`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      default:
        return;
    }

    const newText = data.summary.substring(0, start) + formattedText + data.summary.substring(end);
    onChange({ ...data, summary: newText });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* En-tête */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📝</span>
          <div>
            <h3 className="font-semibold text-slate-900">Profil / Résumé</h3>
            <p className="text-sm text-slate-600">Présentation et objectifs professionnels</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-slate-400">▼</span>
        </motion.div>
      </button>

      {/* Contenu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 space-y-4 border-t border-slate-200">
              {/* Barre d'outils de formatage */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600 mr-2">Formatage:</span>
                <button
                  onClick={() => applyFormat('bold')}
                  className={`p-2 rounded ${isBold ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <strong>B</strong>
                </button>
                <button
                  onClick={() => applyFormat('italic')}
                  className={`p-2 rounded ${isItalic ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <em>I</em>
                </button>
                <button
                  onClick={() => applyFormat('underline')}
                  className={`p-2 rounded ${isUnderline ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200'}`}
                >
                  <u>U</u>
                </button>
              </div>

              {/* Zone de texte */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Résumé professionnel
                </label>
                <textarea
                  ref={textareaRef}
                  value={data.summary}
                  onChange={(e) => onChange({ ...data, summary: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Décrivez votre profil professionnel, vos compétences clés et vos objectifs de carrière..."
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Recommandé: 150-300 caractères</span>
                  <span>{data.summary.length} caractères</span>
                </div>
              </div>

              {/* Suggestions IA (placeholder) */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <span>🤖</span>
                  Suggestions de l'IA
                </h4>
                <p className="text-sm text-blue-700">
                  Cette fonctionnalité sera disponible prochainement pour vous aider à améliorer votre profil.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}