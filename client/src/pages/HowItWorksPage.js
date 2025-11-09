import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';

export function HowItWorksPage({ onStart }) {
  const go = (page) => window.dispatchEvent(new CustomEvent('app:navigate', { detail: { page } }));

  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="Comment ça marche" hint="Parcours MVP" />
      <PageHero
        title="Du choix du service au CV prêt"
        subtitle="Un parcours simple : sélection → brouillon → édition → commande → paiement guidé WhatsApp → livraison."
      >
        <div className="flex gap-3">
          <button onClick={() => go('Modèles')} className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white">
            Voir les modèles
          </button>
          <button onClick={() => go('Tarifs')} className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300">
            Voir les tarifs
          </button>
          <button onClick={onStart} className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white">
            Commencer maintenant
          </button>
        </div>
      </PageHero>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { step: '1', title: 'Choisissez', text: 'Sélectionnez un modèle ou un service (Template, IA, Humain).'},
          { step: '2', title: 'Brouillon', text: 'Nous créons un brouillon rattaché à votre compte.'},
          { step: '3', title: 'Éditez', text: 'Modifiez vos informations, prévisualisez en direct.'},
          { step: '4', title: 'Commandez', text: 'Validez votre demande et suivez les indications de paiement WhatsApp.'},
          { step: '5', title: 'Livraison', text: 'Nous livrons le CV final selon votre offre (PDF/Word selon pack).'},
          { step: '6', title: 'Évolutions', text: 'Bientôt : import PDF/Word + extraction LLM/OCR, vrais modèles.'},
        ].map((s) => (
          <Card key={s.step} className="p-6">
            <div className="text-xs font-semibold text-primary-600">Étape {s.step}</div>
            <div className="text-lg font-semibold text-slate-900 mt-1">{s.title}</div>
            <p className="text-slate-600 mt-2">{s.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
