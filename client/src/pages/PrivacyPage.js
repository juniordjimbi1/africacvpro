import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';

export function PrivacyPage() {
  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="Confidentialité" hint="Données personnelles" />
      <PageHero
        title="Votre vie privée compte"
        subtitle="Nous collectons uniquement les informations nécessaires à la conception de votre CV/lettre. Vos données ne sont jamais revendues."
      />
      <Card className="p-6 space-y-3">
        <p className="text-slate-700">
          Dans ce MVP, aucune passerelle de paiement n’est intégrée. Vous pouvez demander la suppression de vos données à tout moment (voir Contact).
        </p>
        <p className="text-slate-700">
          Les fichiers fournis sont utilisés exclusivement pour votre commande.
        </p>
      </Card>
    </div>
  );
}
