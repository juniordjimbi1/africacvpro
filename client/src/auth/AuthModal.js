// client/src/components/auth/AuthModal.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../../services/api';

const Backdrop = ({ onClose, children }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/40 z-40"
    onClick={onClose}
  >
    <div className="min-h-full grid place-items-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  </motion.div>
);

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const fn = mode === 'login' ? authAPI.login : authAPI.register;
      const { token } = await fn(email, password);
      if (!token) throw new Error('Token manquant');
      localStorage.setItem('token', token);
      onSuccess?.({ email });
      onClose?.();
    } catch (err) {
      setError(err.message || 'Erreur');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {mode === 'login' ? 'Se connecter' : "Créer un compte"}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {mode === 'login'
                ? 'Connectez-vous pour sauvegarder et recevoir votre CV.'
                : 'Créez un compte pour sauvegarder et recevoir votre CV.'}
            </p>

            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="vous@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="••••••••"
                />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2 rounded-lg bg-gray-900 text-white hover:opacity-90 disabled:opacity-50 transition"
              >
                {busy ? 'Veuillez patienter…' : (mode === 'login' ? 'Se connecter' : 'Créer le compte')}
              </button>
            </form>

            <div className="text-sm text-center text-slate-600 mt-3">
              {mode === 'login' ? (
                <>
                  Pas encore de compte ?{' '}
                  <button className="text-primary-600 hover:underline" onClick={() => setMode('register')}>
                    Créer un compte
                  </button>
                </>
              ) : (
                <>
                  Vous avez déjà un compte ?{' '}
                  <button className="text-primary-600 hover:underline" onClick={() => setMode('login')}>
                    Se connecter
                  </button>
                </>
              )}
            </div>
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
