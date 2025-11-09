import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';

export function LetterPage({ onStartLetter }) {
  const go = (page) => window.dispatchEvent(new CustomEvent('app:navigate', { detail: { page } }));

  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="Lettre de motivation" hint="MVP" />
      <PageHero
        title="Lettre claire, concise et orientée résultat"
        subtitle="La génération avancée de lettre arrive en Phase B. Pour l’instant, concentrez-vous sur le CV ; une lettre simple peut être fournie via le support."
      >
        <div className="flex gap-3">
          <button onClick={() => go('Modèles')} className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white">
            Commencer par un CV
          </button>
          <button onClick={() => go('Contact')} className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300">
            Demander une lettre (support)
          </button>
        </div>
      </PageHero>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Structure</div>
          <p className="mt-2 text-slate-700">
            Accroche, adéquation au poste, valeur ajoutée, appel à entretien.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Compatibilité</div>
          <p className="mt-2 text-slate-700">
            Style lisible, mots-clés, cohérence avec le CV.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">À venir</div>
          <p className="mt-2 text-slate-700">
            Génération guidée et modèles dédiés avec personnalisation IA.
          </p>
        </Card>
      </div>
    </div>
  );
}
