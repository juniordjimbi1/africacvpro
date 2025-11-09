import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';

export function TermsPage() {
  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="Mentions légales / CGU" hint="Cadre d’utilisation" />
      <PageHero
        title="MVP en cours de test"
        subtitle="Utilisation : sélection d’un service ou modèle → création de brouillon → édition → commande → paiement guidé via WhatsApp."
      />
      <Card className="p-6 space-y-3">
        <p className="text-slate-700">
          Les contenus fournis par l’utilisateur doivent être exacts et licites. Africacvpro n’est pas responsable des décisions de recrutement des tiers.
        </p>
      </Card>
    </div>
  );
}
