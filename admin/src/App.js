import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AdminHeader } from './layouts/AdminHeader';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';

const PAGES = {
  "Dashboard": <DashboardPage />,
  "Utilisateurs": <UsersPage />,
  "Sessions actives": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Sessions actives - En construction</h2></div>,
  "Commandes / WhatsApp": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Commandes WhatsApp - En construction</h2></div>,
  "Modèles de CV": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Modèles CV - En construction</h2></div>,
  "Générateur de CV": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Générateur CV - En construction</h2></div>,
  "Delivery Vault": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Delivery Vault - En construction</h2></div>,
  "Analytics & Trafic": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Analytics - En construction</h2></div>,
  "Contenu (FAQ/Pages)": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Contenu - En construction</h2></div>,
  "Paramètres": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Paramètres - En construction</h2></div>,
  "Intégrations IA": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Intégrations IA - En construction</h2></div>,
  "Rôles & Permissions": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Rôles - En construction</h2></div>,
  "Logs / Audit": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Logs - En construction</h2></div>,
};

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3
};

function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <AdminHeader currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="mx-auto max-w-7xl px-4 py-6">
        <motion.h2 
          className="text-lg font-semibold text-slate-500 mb-4"
          key={currentPage}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Admin • <span className="text-primary-600">{currentPage}</span>
        </motion.h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {PAGES[currentPage]}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-10 border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-slate-400 text-center">
          © 2024 Africacvpro — Panel d'administration
        </div>
      </footer>
    </div>
  );
}

export default App;