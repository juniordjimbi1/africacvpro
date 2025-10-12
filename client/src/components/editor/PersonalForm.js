import React from 'react';
import { motion } from 'framer-motion';

export function PersonalForm({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Informations personnelles</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Prénom *
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Votre prénom"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Votre nom"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="+33 X XX XX XX XX"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Adresse
        </label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Votre adresse"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Photo de profil
        </label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
          <div className="text-slate-400 mb-2">
            <span className="text-2xl">📷</span>
          </div>
          <p className="text-sm text-slate-500">
            Glissez-déposez une photo ou{' '}
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              parcourir
            </button>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            JPG, PNG • Max 2MB • 1:1 recommandé
          </p>
        </div>
      </div>
    </motion.div>
  );
}