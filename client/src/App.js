import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête test */}
        <header className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-xl">ACV</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            AfricaCV <span className="text-primary-600">Pro</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Créez un CV professionnel qui vous représente vraiment. 
            Optimisé ATS, livraison via WhatsApp, et accompagnement IA.
          </p>
        </header>

        {/* Grille de test Tailwind */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Carte Automatique */}
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-semibold">A</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Automatique</h3>
            <p className="text-slate-600 mb-4 text-sm">
              CV professionnel généré automatiquement à partir de vos informations
            </p>
            <div className="text-2xl font-bold text-slate-900 mb-4">5 000 FCFA</div>
            <button className="btn-primary w-full">
              Commencer
            </button>
          </div>

          {/* Carte IA (Best-seller) */}
          <div className="card p-6 text-center relative border-2 border-primary-200 bg-gradient-to-b from-white to-primary-50">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                BEST-SELLER
              </span>
            </div>
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-semibold">IA</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Optimisé IA</h3>
            <p className="text-slate-600 mb-4 text-sm">
              Optimisation intelligente par IA pour chaque offre d'emploi
            </p>
            <div className="text-2xl font-bold text-slate-900 mb-4">12 000 FCFA</div>
            <button className="btn-primary w-full bg-primary-600 hover:bg-primary-700">
              Optimiser mon CV
            </button>
          </div>

          {/* Carte Expert */}
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-success-600 font-semibold">E</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Expert Humain</h3>
            <p className="text-slate-600 mb-4 text-sm">
              Accompagnement personnalisé par un expert en recrutement
            </p>
            <div className="text-2xl font-bold text-slate-900 mb-4">25 000 FCFA</div>
            <button className="btn-primary w-full bg-success-600 hover:bg-success-700">
              Expertiser
            </button>
          </div>
        </div>

        {/* Indicateurs de test */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              Compatible ATS
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              Paiement après validation
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              Livraison WhatsApp
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;