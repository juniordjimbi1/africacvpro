import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';

const Q = ({ q, a }) => (
  <Card className="p-5">
    <div className="font-semibold text-slate-900">{q}</div>
    <div className="text-slate-700 mt-2">{a}</div>
  </Card>
);

export function FAQPage() {
  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="Aide / FAQ" hint="Questions fréquentes" />
      <PageHero
        title="Tout savoir en un coup d’œil"
        subtitle="Le MVP se concentre sur un parcours simple. Les fonctionnalités avancées arrivent ensuite."
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Q q="Comment ça marche ?" a="Choisissez un service ou un modèle → brouillon → édition → commande → paiement guidé WhatsApp → livraison." />
        <Q q="Paiement en ligne ?" a="Non, pas dans le MVP. Le paiement est guidé sur WhatsApp. L’admin valide ensuite la commande." />
        <Q q="Importer un ancien CV ?" a="Prévu en Phase B : import PDF/Word avec extraction (LLM + OCR)." />
        <Q q="Mes données ?" a="Utilisées uniquement pour votre commande. Voir Confidentialité." />
      </div>
    </div>
  );
}
