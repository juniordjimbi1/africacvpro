import React from 'react';
import { motion } from 'framer-motion';

export function ReceivePanel({ cvData, onClose, onBackToEdit }) {
  const handleWhatsApp = () => {
    // Simuler l'envoi WhatsApp
    const message = `Bonjour, je souhaite recevoir mon CV "${cvData.title}" sur WhatsApp.`;
    const phoneNumber = '+221771234567'; // Numéro de test
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Recevoir mon CV</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* WhatsApp */}
            <div className="text-center">
              <motion.button
                onClick={handleWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-colors text-lg flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>📱</span>
                <span>Recevoir sur WhatsApp</span>
              </motion.button>
              <p className="text-sm text-slate-600 mt-2">
                Paiement et livraison via WhatsApp
              </p>
            </div>

            {/* Téléchargements (débloquer) */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-semibold text-slate-900 mb-4">Téléchargement</h3>
              <div className="space-y-3">
                <motion.button
                  disabled
                  className="w-full bg-slate-100 text-slate-400 font-medium py-3 px-4 rounded-lg flex items-center justify-between cursor-not-allowed"
                  whileHover={{ scale: 1.01 }}
                >
                  <span>📄 PDF (Débloquer)</span>
                  <span>🔒</span>
                </motion.button>
                
                <motion.button
                  disabled
                  className="w-full bg-slate-100 text-slate-400 font-medium py-3 px-4 rounded-lg flex items-center justify-between cursor-not-allowed"
                  whileHover={{ scale: 1.01 }}
                >
                  <span>📝 DOCX (Débloquer)</span>
                  <span>🔒</span>
                </motion.button>
              </div>
              
              <p className="text-xs text-slate-500 mt-3">
                Après déblocage, modifications et téléchargements illimités depuis Mes CV.
              </p>
            </div>

            {/* Retour à l'édition */}
            <motion.button
              onClick={onBackToEdit}
              className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Retour à l'édition
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}