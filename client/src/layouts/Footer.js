import React from 'react';

export function Footer() {
  const go = (page) => {
    window.dispatchEvent(new CustomEvent('app:navigate', { detail: { page } }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pill = "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm transition-all ring-1";
  const idle = "text-slate-300 bg-white/5 ring-white/10 hover:text-white hover:bg-gradient-to-br hover:from-primary-600/80 hover:to-sky-600/80";

  return (
    <footer className="mt-10 relative overflow-hidden bg-slate-950 text-slate-200">
      {/* halos discrets */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-primary-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl" />

      {/* liseré haut */}
      <div className="relative h-0.5 w-full bg-gradient-to-r from-primary-500 via-sky-500 to-indigo-500" />

      {/* corps compact */}
      <div className="relative mx-auto max-w-7xl px-4 py-6 md:py-7">
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 md:p-5">
          <div className="grid gap-6 md:grid-cols-4">
            <div>
              <div className="text-lg md:text-xl font-extrabold tracking-tight text-white">Africacvpro</div>
              <p className="mt-1.5 text-slate-300 leading-relaxed text-sm">
                CV & Lettres pro. MVP marché — paiement guidé WhatsApp.
              </p>
            </div>

            {/* Découvrir */}
            <div>
              <div className="font-semibold text-white mb-2 text-sm">Découvrir</div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => go('Comment ça marche')} className={`${pill} ${idle}`}>Comment ça marche</button>
                <button onClick={() => go('Paiement & Livraison')} className={`${pill} ${idle}`}>Paiement & Livraison</button>
                <button onClick={() => go('Aide / FAQ')} className={`${pill} ${idle}`}>Aide / FAQ</button>
              </div>
            </div>

            {/* Support */}
            <div>
              <div className="font-semibold text-white mb-2 text-sm">Support</div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => go('Contact')} className={`${pill} ${idle}`}>Contact</button>
                <button onClick={() => go('À propos')} className={`${pill} ${idle}`}>À propos</button>
              </div>
            </div>

            {/* Légal */}
            <div>
              <div className="font-semibold text-white mb-2 text-sm">Légal</div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => go('Juridique')} className={`${pill} ${idle}`}>Mentions légales / CGU</button>
                <button onClick={() => go('Confidentialité')} className={`${pill} ${idle}`}>Confidentialité</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bas de page */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Africacvpro — Tous droits réservés</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary-500 to-sky-500" />
            MVP marché (paiement via WhatsApp)
          </span>
        </div>
      </div>
    </footer>
  );
}
