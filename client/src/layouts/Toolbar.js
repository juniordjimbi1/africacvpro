import React from 'react';

const PAGES = [
  "Accueil",
  "Modèles", 
  "Tarifs",
  "Comment ça marche",
  "Éditeur CV",
  "Lettre",
  "Paiement & Livraison",
  "Tableau de bord",
  "Aide / FAQ",
  "À propos",
  "Juridique",
];

export function Toolbar({ currentPage, onPageChange }) {
  return (
    <div className="border-b bg-slate-50/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {PAGES.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}