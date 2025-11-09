import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';

export function PaymentPage() {
  const go = (page) => window.dispatchEvent(new CustomEvent('app:navigate', { detail: { page } }));

  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="Paiement & Livraison" hint="MVP — via WhatsApp" />
      <PageHero
        title="Paiement simplifié via WhatsApp"
        subtitle="Pas de passerelle intégrée dans le MVP. Après commande, un conseiller vous guide sur WhatsApp (moyens : Orange Money, Wave, MTN, Moov, etc.)."
      >
        <div className="flex gap-3">
          <button onClick={() => go('Contact')} className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white">
            Contacter le support
          </button>
          <button onClick={() => go('Tarifs')} className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300">
            Voir les offres
          </button>
        </div>
      </PageHero>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Procédure</div>
          <ol className="list-decimal ml-5 mt-2 space-y-1 text-slate-700">
            <li>Créez votre brouillon et finalisez l’édition.</li>
            <li>Ouvrez le panneau “Commande”.</li>
            <li>Vous recevez l’instruction de paiement sur WhatsApp.</li>
            <li>Après confirmation, l’admin valide et lance la livraison.</li>
          </ol>
        </Card>

        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Moyens de paiement</div>
          <p className="mt-2 text-slate-700">
            Selon votre pays : Orange Money, Wave, MTN, Moov, etc.  
            Le conseiller vous indiquera le canal recommandé.
          </p>
        </Card>

        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Livraison</div>
          <p className="mt-2 text-slate-700">
            Vous recevez vos fichiers (PDF/Word selon l’offre).  
            Modifications mineures incluses jusqu’à validation (selon pack).
          </p>
        </Card>
      </div>
    </div>
  );
}
