import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';

export function DashboardPage({ onGoModels, onGoPricing }) {
  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="Tableau de bord" hint="Aperçu (MVP)" />
      <PageHero
        title="Gérez vos brouillons et commandes"
        subtitle="Le tableau de bord avancé arrivera après le MVP. Pour l’instant, utilisez Modèles/Tarifs pour créer un nouveau brouillon."
      >
        <div className="flex gap-3">
          <button onClick={onGoModels} className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white">
            Créer un brouillon (Modèles)
          </button>
          <button onClick={onGoPricing} className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300">
            Voir les offres (Tarifs)
          </button>
        </div>
      </PageHero>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Brouillons récents</div>
          <p className="mt-2 text-slate-700">
            Cette zone affichera bientôt vos brouillons enregistrés, avec accès rapide à l’éditeur.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Statut des commandes</div>
          <p className="mt-2 text-slate-700">
            À venir : suivi (créée, en cours, en validation, livrée).
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Support</div>
          <p className="mt-2 text-slate-700">
            Besoin d’aide ? Passez par la page Contact. Le paiement reste guidé sur WhatsApp dans le MVP.
          </p>
        </Card>
      </div>
    </div>
  );
}
