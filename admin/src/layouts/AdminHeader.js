import React from 'react';
import { motion } from 'framer-motion';
import { Sk } from '../components/ui/Sk';

const PAGES = [
  "Dashboard",
  "Utilisateurs",
  "Sessions actives",
  "Commandes / WhatsApp",
  "Modèles de CV",
  "Générateur de CV",
  "Delivery Vault",
  "Analytics & Trafic",
  "Contenu (FAQ/Pages)",
  "Paramètres",
  "Intégrations IA",
  "Rôles & Permissions",
  "Logs / Audit",
];

export function AdminHeader({ currentPage, onPageChange }) {
  return (
    <motion.div 
      className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Bar */}
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Admin • Africacvpro</div>
            <div className="text-xs text-slate-500">Panel d'administration</div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sk w={120} h={32} />
          <motion.div 
            className="w-8 h-8 bg-slate-200 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="border-t bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="flex flex-wrap gap-1">
            {PAGES.map((page, index) => (
              <motion.button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {page}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}