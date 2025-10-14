import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeEditorHTML } from '../../utils/richText';

export function ProfileAccordion({ data, isExpanded, onToggle, onChange }) {
  const contentRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Hydrate l'éditeur quand data.summary change (ex: chargement CV)
  useEffect(() => {
    if (!contentRef.current) return;
    const html = data?.summary || '';
    // On met le HTML tel quel (avec styles) dans l’éditeur
    contentRef.current.innerHTML = html || '';
    // Met à jour l'état des boutons selon la sélection courante
    updateToolbarStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.summary]);

  // Applique format; si pas de sélection → sélectionne tout
  const applyCommand = (cmd) => {
    const el = contentRef.current;
    if (!el) return;

    el.focus();
    const sel = window.getSelection();
    const hasSelection = sel && sel.rangeCount > 0 && !sel.isCollapsed && el.contains(sel.anchorNode);

    if (!hasSelection) {
      // Sélectionne tout le contenu puis toggle
      const range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    document.execCommand(cmd, false, null);
    syncFromDom();
    updateToolbarStates();
  };

  const updateToolbarStates = () => {
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
    } catch (e) {
      // queryCommandState peut échouer si pas de focus, on ignore.
    }
  };

  const syncFromDom = () => {
    const el = contentRef.current;
    if (!el) return;
    const raw = el.innerHTML;
    const normalized = normalizeEditorHTML(raw);
    onChange({ ...data, summary: normalized });
  };

  // Écoute les changements de sélection pour mettre les boutons à jour
  useEffect(() => {
    const handler = () => {
      if (!contentRef.current) return;
      if (!document.activeElement || !contentRef.current.contains(document.activeElement) && document.activeElement !== contentRef.current) {
        return;
      }
      updateToolbarStates();
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  // Saisie dans le contenteditable → on normalise et on remonte
  const onInput = () => {
    syncFromDom();
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
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
            <div className="px-6 py-4 space-y-4">
              {/* Éditeur WYSIWYG */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Résumé professionnel
                </label>
                <div
                  ref={contentRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={onInput}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[144px] leading-relaxed"
                  style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                  placeholder="Décrivez vos objectifs et vos points forts..."
                />
              </div>

              {/* Toolbar sous la zone de texte */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyCommand('bold')}
                  className={`px-3 py-1 rounded border ${isBold ? 'bg-slate-200' : ''}`}
                  title="Gras"
                >
                  <b>B</b>
                </button>
                <button
                  type="button"
                  onClick={() => applyCommand('italic')}
                  className={`px-3 py-1 rounded border ${isItalic ? 'bg-slate-200' : ''}`}
                  title="Italique"
                >
                  <i>I</i>
                </button>
                <button
                  type="button"
                  onClick={() => applyCommand('underline')}
                  className={`px-3 py-1 rounded border ${isUnderline ? 'bg-slate-200' : ''}`}
                  title="Souligné"
                >
                  <u>U</u>
                </button>
                <span className="text-xs text-slate-500 ml-2">
                  Astuce&nbsp;: sans sélection, B/I/U s’appliquent à tout le texte. Re-cliquer retire le style.
                </span>
              </div>

              {/* Bloc IA — inchangé si présent */}
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
