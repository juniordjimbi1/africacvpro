import React from 'react';
import { motion } from 'framer-motion';

export function Section({ title, hint, children }) {
  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-baseline gap-3 mb-3">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
        {hint && <span className="text-sm text-slate-500">{hint}</span>}
      </div>
      <div className="h-1 w-16 bg-primary-500 rounded mb-4" />
      {children}
    </motion.div>
  );
}