import React from 'react';
import { motion } from 'framer-motion';

export function ProfileForm({ data, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Profil / Résumé</h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Résumé professionnel
        </label>
        <textarea
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

      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-medium text-slate-700 mb-2">💡 Conseil</h4>
        <p className="text-sm text-slate-600">
          Votre résumé est la première chose que les recruteurs lisent. 
          Soyez concis et mettez en avant vos compétences principales et votre valeur ajoutée.
        </p>
      </div>
    </motion.div>
  );
}