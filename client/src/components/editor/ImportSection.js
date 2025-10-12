import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { apiUpload } from '../../services/api';

const uid = (p='id') => `${p}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

const splitNameLevel = (s) => {
  if (!s || typeof s !== 'string') return { name: '', level: '' };
  const parts = s.split(/[-–:|]/).map(p => p.trim()).filter(Boolean);
  if (parts.length >= 2) return { name: parts[0], level: parts.slice(1).join(' - ') };
  return { name: s.trim(), level: '' };
};

const normalizeParsedToEditorSchema = (parsed) => {
  const safe = parsed || {};
  const personal = {
    photoUrl: '',
    firstName: (safe.personal?.firstName || '').trim(),
    lastName:  (safe.personal?.lastName  || '').trim(),
    jobTitle:  (safe.personal?.jobTitle  || safe.profile?.title || '').trim(),
    email:     (safe.personal?.email     || '').trim(),
    phone:     (safe.personal?.phone     || '').trim(),
    address:   (safe.personal?.address   || '').trim(),
    city:      (safe.personal?.city      || '').trim(),
    website:   (safe.personal?.website   || '').trim(),
    linkedin:  (safe.personal?.linkedin  || '').trim(),
    nationality:(safe.personal?.nationality||'').trim(),
    birthDate: (safe.personal?.birthDate || '').trim(),
    birthPlace:(safe.personal?.birthPlace|| '').trim(),
    driving:   (safe.personal?.driving   || '').trim(),
    customFields: Array.isArray(safe.personal?.customFields)
      ? safe.personal.customFields.map(f => ({
          id: f.id || uid('cf'),
          label: (f.label || '').trim(),
          value: (f.value || '').trim(),
        }))
      : []
  };
  const profile = { summary: (safe.profile?.summary || '').toString().trim() };

  const educationNorm = (Array.isArray(safe.education) ? safe.education : [])
    .map((e,i)=>({
      id: e.id || uid(`edu${i}`),
      degree: (e.degree || e.title || '').toString().trim(),
      school: (e.school || e.institution || '').toString().trim(),
      field:  (e.field || '').toString().trim(),
      city:   (e.city || '').toString().trim(),
      startDate: (e.startDate || '').toString().trim(),
      endDate:   (e.endDate || '').toString().trim(),
      description: (e.description || '').toString().trim()
    }))
    .filter(e => e.degree || e.school || e.field);

  const experienceNorm = (Array.isArray(safe.experience) ? safe.experience : [])
    .map((x,i)=>({
      id: x.id || uid(`exp${i}`),
      title: (x.title || x.jobTitle || '').toString().trim(),
      company: (x.company || '').toString().trim(),
      city: (x.city || '').toString().trim(),
      startDate: (x.startDate || '').toString().trim(),
      endDate:   (x.endDate   || '').toString().trim(),
      description: (x.description || (Array.isArray(x.tasks) ? x.tasks.join(' • ') : '') || '').toString().trim()
    }))
    .filter(x => x.title || x.company || x.description);

  const skillsNorm = (Array.isArray(safe.skills) ? safe.skills : [])
    .map((s,i)=>{
      if (typeof s === 'string') {
        const pair = splitNameLevel(s);
        return { id: uid(`sk${i}`), name: pair.name, level: pair.level ? 3 : undefined };
      }
      return { id: s.id || uid(`sk${i}`), name: (s.name || '').trim(), level: s.level };
    })
    .filter(s => s.name);

  const languagesNorm = (Array.isArray(safe.languages) ? safe.languages : [])
    .map((lg,i)=>{
      if (typeof lg === 'string') {
        const pair = splitNameLevel(lg);
        return { id: uid(`lg${i}`), name: pair.name, level: pair.level || 'Intermédiaire' };
      }
      return { id: lg.id || uid(`lg${i}`), name: (lg.name || '').trim(), level: (lg.level || '').trim() || 'Intermédiaire' };
    })
    .filter(lg => lg.name);

  const interestsNorm = (Array.isArray(safe.interests) ? safe.interests : [])
    .map((it,i)=>({ id: it.id || uid(`it${i}`), name: (it.name || it || '').toString().trim() }))
    .filter(it => it.name);

  return {
    personal,
    profile,
    education: educationNorm,
    experience: experienceNorm,
    skills: skillsNorm,
    languages: languagesNorm,
    interests: interestsNorm
  };
};

const deepMerge = (a, b) => {
  if (Array.isArray(a) && Array.isArray(b)) return b.length ? b : a;
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    const out = { ...a };
    Object.keys(b).forEach(k => { out[k] = deepMerge(a[k], b[k]); });
    return out;
  }
  return b !== undefined ? b : a;
};

export function ImportSection({ cvData, setCvData, onParsed }) {
  const fileInputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { parsed } = await apiUpload.importParse(file);
      const normalized = normalizeParsedToEditorSchema(parsed);
      if (onParsed) onParsed(normalized);
      if (setCvData) setCvData(prev => deepMerge(prev || {}, normalized));
    } catch (err) {
      console.error(err);
      alert("Échec de l'extraction. Formats acceptés : PDF, DOCX, TXT, JPG/PNG (OCR).");
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-slate-200 p-6"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Importer vos informations</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            busy ? 'border-slate-200 opacity-70 cursor-wait' : 'border-slate-300 hover:border-primary-400'
          }`}
          onClick={() => !busy && fileInputRef.current?.click()}
        >
          <div className="text-3xl mb-2">📄</div>
          <h3 className="font-semibold text-slate-900 mb-1">Importer votre ancien CV</h3>
          <p className="text-sm text-slate-600">
            PDF, Word (.docx), Texte ou <span className="font-medium">JPG/PNG (OCR)</span> — remplissage automatique
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
            disabled={busy}
          />
          {busy && <div className="mt-2 text-xs text-slate-500">Analyse en cours…</div>}
        </motion.div>

        {/* Placeholder LinkedIn (inchangé) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-400 transition-colors"
        >
          <div className="text-3xl mb-2">🔗</div>
          <h3 className="font-semibold text-slate-900 mb-1">Importer votre profil LinkedIn</h3>
          <p className="text-sm text-slate-600">Connexion sécurisée — Données synchronisées</p>
        </motion.div>
      </div>

      <p className="text-xs text-slate-500 mt-3 text-center">
        💡 Si vous n'avez pas d'ancien CV, saisissez directement vos informations ci-dessous
      </p>
    </motion.div>
  );
}
