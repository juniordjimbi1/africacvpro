import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header({ user, onLogin, onRegister, onLogout, currentPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = useMemo(
    () => ([
      { label: 'Accueil', page: 'Accueil' },
      { label: 'Modèles', page: 'Modèles' },
      { label: 'Tarifs', page: 'Tarifs' },
      { label: 'Éditeur CV', page: 'Éditeur CV' },
      { label: 'Lettre', page: 'Lettre' },
      { label: 'Tableau de bord', page: 'Tableau de bord' },
    ]),
    []
  );

  const go = (page) => {
    window.dispatchEvent(new CustomEvent('app:navigate', { detail: { page } }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileOpen(false);
    setMenuOpen(false);
  };

  const userInitial = (user?.email || user?.name || 'A')[0]?.toUpperCase?.() || 'A';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm shadow-slate-900/5">
      {/* bandeau d’accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary-500 via-sky-500 to-indigo-500" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Brand avec logo ACV */}
          <button
            onClick={() => go('Accueil')}
            className="flex items-center gap-2.5 md:gap-3 group"
            aria-label="Aller à l’accueil"
          >
            <span className="inline-flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl bg-sky-600 text-white text-[11px] md:text-xs font-extrabold tracking-wide shadow-sm shadow-sky-900/20">
              ACV
            </span>
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-slate-950 transition-colors">
              Africacvpro
            </span>
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 ring-1 ring-primary-100">
              MVP
            </span>
          </button>

          {/* Nav desktop — pills/carrés avec highlight animé */}
          <nav className="hidden md:flex items-center gap-2">
            {nav.map((item) => {
              const active = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => go(item.page)}
                  className={[
                    'relative group px-3.5 py-2 rounded-xl text-sm transition-all ring-1',
                    active
                      ? 'text-white ring-transparent'
                      : 'text-slate-600 hover:text-slate-900 ring-transparent hover:ring-slate-200 hover:bg-slate-50'
                  ].join(' ')}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        layoutId="navPill"
                        className="absolute inset-0 rounded-xl"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>

                  <span className={['relative z-10', active ? 'text-white' : 'text-inherit'].join(' ')}>
                    {item.label}
                  </span>

                  {active && (
                    <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600 to-sky-600" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <button
                  onClick={onLogin}
                  className="px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Se connecter
                </button>
                <button
                  onClick={onRegister}
                  className="px-3 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                >
                  Créer un compte
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white text-sm">
                    {userInitial}
                  </span>
                  <span className="hidden lg:block text-sm text-slate-700 max-w-[180px] truncate">
                    {user.email || 'Utilisateur'}
                  </span>
                  <svg className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                  </svg>
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
                    role="menu"
                  >
                    <button
                      onClick={() => go('Tableau de bord')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                      role="menuitem"
                    >
                      Tableau de bord
                    </button>
                    <button
                      onClick={() => go('Éditeur CV')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                      role="menuitem"
                    >
                      Éditeur CV
                    </button>
                    <div className="my-1 h-px bg-slate-200" />
                    <button
                      onClick={() => { setMenuOpen(false); onLogout?.(); }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      role="menuitem"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Burger (mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
            >
              {!mobileOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile (pills simplifiés) */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/90 backdrop-blur">
          <nav className="px-4 py-3 grid gap-2">
            {nav.map((item) => {
              const active = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => go(item.page)}
                  className={[
                    'relative px-3 py-2 rounded-xl text-sm transition-all ring-1',
                    active
                      ? 'text-white ring-transparent'
                      : 'text-slate-700 hover:bg-slate-100 ring-transparent'
                  ].join(' ')}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600 to-sky-600" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}

            {!user ? (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={onLogin} className="px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100">
                  Se connecter
                </button>
                <button onClick={onRegister} className="px-3 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700">
                  Créer un compte
                </button>
              </div>
            ) : (
              <div className="mt-2">
                <button
                  onClick={() => go('Tableau de bord')}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100"
                >
                  Tableau de bord
                </button>
                <button
                  onClick={() => go('Éditeur CV')}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100"
                >
                  Éditeur CV
                </button>
                <button
                  onClick={() => onLogout?.()}
                  className="mt-1 w-full text-left px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
