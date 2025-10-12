import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/ui/Skeleton';

export function Header({ user, onLogin, onRegister, onLogout }) {
  return (
    <div className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">ACV</span>
          </div>
          <span className="font-bold text-xl text-slate-900">Africacvpro</span>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <a href="#modeles" className="hover:text-primary-600 transition-colors">Modèles</a>
          <a href="#tarifs" className="hover:text-primary-600 transition-colors">Tarifs</a>
          <a href="#comment-ca-marche" className="hover:text-primary-600 transition-colors">Comment ça marche</a>
          <a href="#a-propos" className="hover:text-primary-600 transition-colors">À propos</a>
          <a href="#aide" className="hover:text-primary-600 transition-colors">Aide</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden md:block text-sm text-slate-600">
                Bonjour, {user.email}
              </span>
              <motion.button 
                onClick={onLogout}
                className="hidden md:block border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Déconnexion
              </motion.button>
            </>
          ) : (
            <>
              <motion.button 
                onClick={onLogin}
                className="hidden md:block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Connexion
              </motion.button>
              <motion.button 
                onClick={onRegister}
                className="hidden md:block border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Inscription
              </motion.button>
            </>
          )}
          <motion.button 
            className="md:hidden w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-5 h-5 bg-slate-400 rounded" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}