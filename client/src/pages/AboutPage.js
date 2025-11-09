import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';

export function AboutPage() {
  return (
    <div className="space-y-8 py-8">
      <SectionTitle title="À propos" hint="Qui nous sommes" />
      <PageHero
        title="Des CV & lettres qui décrochent des entretiens"
        subtitle="Africacvpro conçoit des documents clairs, modernes et compatibles ATS. Ce MVP valide l’expérience : sélection → brouillon → édition → commande → paiement guidé WhatsApp."
      />
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Simplicité</div>
          <p className="mt-2 text-slate-600">
            Une interface fluide pour créer un brouillon et l’améliorer rapidement.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Qualité</div>
          <p className="mt-2 text-slate-600">
            Modèles soignés (bientôt “vrais modèles”) et rédaction orientée résultats.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-lg font-semibold text-slate-900">Accompagnement</div>
          <p className="mt-2 text-slate-600">
            Paiement simple via WhatsApp et suivi humain jusqu’à la livraison.
          </p>
        </Card>
      </div>
    </div>
  );
}
