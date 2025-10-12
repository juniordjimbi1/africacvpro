import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './layouts/Header';
import { Footer } from './layouts/Footer';
import { Toolbar } from './layouts/Toolbar';
import { HomePage } from './pages/HomePage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PricingPage } from './pages/PricingPage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { EditorPage } from './pages/EditorPage';

const PAGES = {
  "Accueil": <HomePage />,
  "Modèles": <TemplatesPage />,
  "Tarifs": <PricingPage />,
  "Comment ça marche": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Comment ça marche - En construction</h2></div>,
  "Éditeur CV": <EditorPage />, // CHANGÉ ICI
  "Lettre": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Lettre de motivation - En construction</h2></div>,
  "Paiement & Livraison": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Paiement & Livraison - En construction</h2></div>,
  "Tableau de bord": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Tableau de bord - En construction</h2></div>,
  "Aide / FAQ": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Aide / FAQ - En construction</h2></div>,
  "À propos": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">À propos - En construction</h2></div>,
  "Juridique": <div className="py-8"><h2 className="text-2xl font-bold text-slate-900">Juridique - En construction</h2></div>,
};

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const { user } = useAuth();

  // Fermer automatiquement le modal quand l'utilisateur est connecté
  useEffect(() => {
    if (isOpen && user) {
      const timer = setTimeout(() => {
        onClose();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-md w-full mx-4 relative"
      >
        {/* Bouton de fermeture en haut à droite - PROPRE maintenant */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {mode === 'login' ? (
          <LoginForm 
            onSwitchToRegister={() => setMode('register')}
            onSuccess={onClose}
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={() => setMode('login')}
            onSuccess={onClose}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState("Accueil");
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const { user, logout } = useAuth();

  const openAuthModal = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <Header 
        user={user} 
        onLogin={() => openAuthModal('login')}
        onRegister={() => openAuthModal('register')}
        onLogout={logout}
      />
      <Toolbar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="mx-auto max-w-7xl px-4">
        <div className="py-4">
          <motion.h2 
            className="text-lg font-semibold text-slate-500 mb-2"
            key={currentPage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            Wireframe: <span className="text-primary-600">{currentPage}</span>
            {user && (
              <span className="ml-4 text-sm text-slate-400">
                • Connecté en tant que {user.email}
              </span>
            )}
          </motion.h2>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {PAGES[currentPage]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {authModal.isOpen && (
          <AuthModal 
            isOpen={authModal.isOpen}
            onClose={closeAuthModal}
            initialMode={authModal.mode}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;