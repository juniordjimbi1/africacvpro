import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeEditorHTML } from '../../utils/richText';

export function ProfileAccordion({ data, isExpanded, onToggle, onChange }) {
  const contentRef = useRef(null);

  // 🔒 Garde le contenu à travers les (un)mounts de l'accordéon
  const [summaryLocal, setSummaryLocal] = useState(
    typeof data?.summary === 'string' ? data.summary : ''
  );

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Quand la prop change réellement (ex: chargement, autosave externe), on resynchronise le local
  useEffect(() => {
    if (typeof data?.summary !== 'string') return;
    if (data.summary !== summaryLocal) {
      setSummaryLocal(data.summary);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.summary]);

  // À l'ouverture : hydrate le DOM depuis le local (évite l'effet "zone vide" au re-open)
  useEffect(() => {
    if (!isExpanded || !contentRef.current) return;
    if (contentRef.current.innerHTML !== summaryLocal) {
      contentRef.current.innerHTML = summaryLocal || '';
    }
    // focus doux
    setTimeout(() => contentRef.current?.focus(), 0);
  }, [isExpanded, summaryLocal]);

  const updateToolbarStates = () => {
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
    } catch {}
  };

  // Détermine si le HTML est "vraiment vide"
  const isTrulyEmpty = (html) => {
    if (!html) return true;
    const stripped = html
      .replace(/<br\s*\/?>/gi, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .trim();
    return stripped.length === 0;
  };

  // Pousse vers parent + garde local en phase
  const pushChange = (html) => {
    const normalized = normalizeEditorHTML(html || '');
    const value = isTrulyEmpty(normalized) ? '' : normalized;
    setSummaryLocal(value);
    if (typeof onChange === 'function') {
      onChange('summary', value);
    }
  };

  const syncFromDom = () => {
    const el = contentRef.current;
    if (!el) return;
    pushChange(el.innerHTML);
  };

  const applyCommand = (cmd) => {
    const el = contentRef.current;
    if (!el) return;
    el.focus();

    const sel = window.getSelection();
    const hasSelection =
      sel && sel.rangeCount > 0 && !sel.isCollapsed && el.contains(sel.anchorNode);

    // Sans sélection -> applique au contenu entier (comportement Word-like)
    if (!hasSelection) {
      const range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    document.execCommand(cmd, false, null);
    syncFromDom();
    updateToolbarStates();
  };

  useEffect(() => {
    const handler = () => {
      const active = document.activeElement;
      if (!contentRef.current || !active) return;
      if (!contentRef.current.contains(active) && active !== contentRef.current) return;
      updateToolbarStates();
    };
    document.addEventListener('selectionchange', handler);
    return () => document.removeEventListener('selectionchange', handler);
  }, []);

  const onInput = () => syncFromDom();
  const onBlur = () => {
    syncFromDom();
    updateToolbarStates();
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Résumé professionnel
                </label>

                <div
                  ref={contentRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={onInput}
                  onBlur={onBlur}
                  dir="ltr"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[144px] leading-relaxed"
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    direction: 'ltr',
                    unicodeBidi: 'plaintext',
                    textAlign: 'left',
                  }}
                  // placeholder visuel possible via CSS si nécessaire
                />
              </div>

              {/* Toolbar SOUS la zone de texte (comme demandé) */}
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
                  Astuce : sans sélection, B/I/U s’appliquent à tout le texte. Re-cliquer retire le style.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
