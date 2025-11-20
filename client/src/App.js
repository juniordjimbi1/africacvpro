import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './layouts/Header';
import { Footer } from './layouts/Footer';
// import { Toolbar } from './layouts/Toolbar'; // ❌ supprimé

import { HomePage } from './pages/HomePage';
import { TemplatesPage } from './pages/TemplatesPage';
 import { OffersPage } from './pages/OffersPage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { EditorPage } from './pages/EditorPage';
import { cvAPI } from './services/cvAPI';
import { cvStorage } from './services/cvStorage';

// Contenu
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PaymentPage } from './pages/PaymentPage';
import { DashboardPage } from './pages/DashboardPage';
import { LetterPage } from './pages/LetterPage';

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [user, isOpen, onClose]);

  if (!isOpen) return null;


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-md w-full mx-4 relative">
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => setMode('register')} onSuccess={onClose} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setMode('login')} onSuccess={onClose} />
        )}
      </motion.div>
    </motion.div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState('Accueil');
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [pendingStart, setPendingStart] = useState(null);
  const { user, logout } = useAuth();

  const hasDraftResume = !!cvStorage.getResumeId();

  const handleGoEditorSmart = () => {
    const resumeId = cvStorage.getResumeId();
    if (resumeId) {
      // Brouillon existant → on ouvre directement l’éditeur
      localStorage.setItem('africacv_return_page', currentPage);
      setCurrentPage('Éditeur CV');
    } else {
      // Pas de brouillon → on repart sur le flow standard Modèles → Offres → Éditeur
      localStorage.removeItem('africacv_template_id');
      localStorage.removeItem('africacv_offer');
      sessionStorage.removeItem('africacv_open_offer_on_templates');
      setCurrentPage('Modèles');
    }
  };


   useEffect(() => {
    const handler = (e) => {
      if (e && e.detail && e.detail.page) {
        setCurrentPage(e.detail.page);
      }
    };
    window.addEventListener('app:navigate', handler);
    return () => window.removeEventListener('app:navigate', handler);
  }, []);

  const openAuthModal = (mode = 'login') => setAuthModal({ isOpen: true, mode });
  const closeAuthModal = () => setAuthModal({ isOpen: false, mode: 'login' });

  // Écoute nav globale (Header/Footer/Pages)
  useEffect(() => {
    const onAppNavigate = (e) => {
      const target = e?.detail?.page;
      if (target) setCurrentPage(target);
    };
    window.addEventListener('app:navigate', onAppNavigate);
    return () => window.removeEventListener('app:navigate', onAppNavigate);
  }, []);

  // Écoute nav venant de l’éditeur (flèche retour)
  useEffect(() => {
    const onEditorNavigate = (e) => {
      const target = e?.detail?.page || localStorage.getItem('africacv_return_page') || 'Accueil';
      setCurrentPage(target);
      localStorage.removeItem('africacv_return_page');
    };
    window.addEventListener('editor:navigate', onEditorNavigate);
    return () => window.removeEventListener('editor:navigate', onEditorNavigate);
  }, []);

  // Démarrer un service → create CV → Éditeur
  const handleStartService = async (serviceType = 'AUTO', templateId = 'classic') => {
    localStorage.setItem('africacv_return_page', currentPage);
    if (!user) {
      setPendingStart({ serviceType, templateId });
      openAuthModal('login');
      return;
    }
    try {
      const res = await cvAPI.createCV({ title: 'Mon CV', template: templateId });
      const newId = res?.data?.id || res?.id;
      if (newId) {
        cvStorage.setResumeId(newId);
        setCurrentPage('Éditeur CV');
      }
    } catch (e) {
      console.error('Erreur création CV:', e);
    }
  };

  // Reprise post-login
  useEffect(() => {
    if (user && pendingStart) {
      (async () => {
        try {
          if (!localStorage.getItem('africacv_return_page')) {
            localStorage.setItem('africacv_return_page', currentPage);
          }
          const res = await cvAPI.createCV({ title: 'Mon CV', template: pendingStart.templateId || 'classic' });
          const newId = res?.data?.id || res?.id;
          if (newId) {
            cvStorage.setResumeId(newId);
            setCurrentPage('Éditeur CV');
          }
        } catch (e) {
          console.error('Erreur création CV (post-login):', e);
        } finally {
          setPendingStart(null);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const renderPage = () => {
    switch (currentPage) {
      case 'Accueil':
        return <HomePage />;
      case 'Modèles':
        return <TemplatesPage onStart={(tplId) => handleStartService('AUTO', tplId || 'classic')}  />;
      case 'Offres':
        return <OffersPage onStart={(service) => handleStartService(service, 'classic')} />;
      case 'Comment ça marche':
        return <HowItWorksPage onStart={() => handleStartService('AUTO', 'classic')} />;
      case 'Éditeur CV':
        return <EditorPage />;
      case 'Lettre':
        return <LetterPage onStartLetter={() => alert('MVP : génération lettre bientôt. Passez par Modèles/Tarifs pour le CV.')} />;
      case 'Paiement & Livraison':
        return <PaymentPage />;
      case 'Tableau de bord':
        return <DashboardPage onGoModels={() => setCurrentPage('Modèles')} onGoPricing={() => setCurrentPage('Tarifs')} />;
      case 'Aide / FAQ':
        return <FAQPage />;
      case 'À propos':
        return <AboutPage />;
      case 'Juridique':
        return <TermsPage />;
      case 'Confidentialité':
        return <PrivacyPage />;
      case 'Contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <Header
        user={user}
        onLogin={() => openAuthModal('login')}
        onRegister={() => openAuthModal('register')}
        onLogout={logout}
        currentPage={currentPage}
        hasDraft={hasDraftResume}
        onGoEditorSmart={handleGoEditorSmart}
      />


      {/* Toolbar retirée */}
      {/* <Toolbar currentPage={currentPage} onPageChange={setCurrentPage} /> */}

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
              <span className="ml-4 text-sm text-slate-400">• Connecté en tant que {user.email}</span>
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
              {renderPage()}
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
