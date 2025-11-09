import React from 'react';
import { motion } from 'framer-motion';

export function SectionTitle({ title, hint = '', icon = null, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="inline-flex items-center gap-3"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-50 to-sky-50 text-primary-700 px-3 py-1 text-xs font-medium ring-1 ring-primary-100">
          {icon ? <span className="w-3.5 h-3.5">{icon}</span> : null}
          {hint || 'Section'}
        </span>
      </motion.div>

      <div className="mt-3">
        <motion.h2
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-700 to-sky-600">
            {title}
          </span>
        </motion.h2>
      </div>

      <div className="mt-2 h-1 w-24 bg-gradient-to-r from-primary-500 to-sky-500 rounded-full" />
    </div>
  );
}
