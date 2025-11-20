import React from 'react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { go } from '../utils/nav';
import { buildWhatsappUrl } from '../utils/whatsapp';

export function OffersPage() {
  const startFromOffer = (offerUi) => {
    // LOGIQUE DEMANDÉE :
    // - On ne force pas l'ouverture du panneau sur Templates
    // - On pré-sélectionne l'offre et on met un flag pour indiquer que ça vient d'Offres
    localStorage.removeItem('africacv_template_id');
    localStorage.setItem('africacv_offer', offerUi); // 'auto' | 'ai' | 'pro'
    sessionStorage.removeItem('africacv_open_offer_on_templates');
    sessionStorage.setItem('africacv_offer_preselected', '1');
    go('Modèles');
  };

  return (
    <div className="space-y-8 py-8">
      <SectionTitle
        title="Choisissez votre offre"
        subtitle="Transparente, rapide et adaptée à vos besoins — vous payez uniquement après validation sur WhatsApp."
      />

      {/* Bandeau d'accroche */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-slate-700 leading-relaxed">
          Que vous ayez déjà un ancien CV ou que vous repartiez de zéro, AfricaCVpro vous aide à créer
          un document professionnel, clair et attractif, en quelques minutes seulement. <br />
          Toutes les offres incluent un aperçu en direct, la possibilité de modifier chaque section,
          et la livraison finale sur WhatsApp.
        </p>
      </div>

      {/* Grille des offres */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* AUTOMATIQUE */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-slate-900">💨 Offre Automatique</h3>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-slate-900">2 000 F CFA</div>
              <div className="text-xs text-slate-500">Paiement après validation</div>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>
              • <strong>Importez votre ancien CV</strong> (PDF, Word, image, etc.) : le système
              extrait automatiquement vos informations et les met en page dans un modèle professionnel.
            </li>
            <li>
              • Si vous n’avez pas d’ancien fichier, <strong>remplissez simplement un formulaire clair
              et rapide</strong>. En quelques minutes, votre CV prend forme avec un <strong>aperçu en direct</strong>.
            </li>
            <li>
              • Vous pouvez <strong>ajouter, modifier ou supprimer</strong> des sections (profil, expériences,
              formations, compétences, etc.) à tout moment.
            </li>
            <li>
              • Choisissez la <strong>couleur du modèle</strong> qui vous correspond et ajustez facilement
              les textes avant de valider.
            </li>
            <li>
              • Votre CV est généré en PDF et <strong>livré directement sur WhatsApp</strong> après validation finale.
            </li>
          </ul>

          <button
            onClick={() => startFromOffer('auto')}
            className="w-full mt-5 py-2.5 rounded-lg font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Choisir Automatique — 2 000 F
          </button>
        </Card>

        {/* AUTOMATIQUE OPTIMISÉE IA */}
        <Card className="p-5 ring-2 ring-primary-500 shadow">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-slate-900">🤖 Offre Automatique optimisée IA</h3>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-primary-700">3 000 F CFA</div>
              <div className="text-xs text-slate-500">Paiement après validation</div>
            </div>
          </div>
          <div className="mt-1">
            <span className="inline-block text-xs font-semibold bg-primary-500 text-white px-2 py-1 rounded-full">
              Recommandée
            </span>
          </div>

          <ul className="mt-4 space-y-2 text-sm text-slate-700 leading-relaxed">
            <li>
              • Commencez par <strong>importer votre ancien CV</strong> (ou remplissez un petit formulaire si vous n’en avez pas).
              L’IA vous posera ensuite <strong>quelques questions simples</strong> pour mieux comprendre votre profil.
            </li>
            <li>
              • Elle <strong>analyse vos expériences et vos compétences</strong>, puis reformule vos textes pour un rendu plus professionnel et impactant.
            </li>
            <li>
              • L’IA <strong>adapte automatiquement le contenu à votre métier</strong> ou au poste que vous visez :
              titres, mots-clés, et structure optimisée pour les recruteurs.
            </li>
            <li>
              • Résultat : un CV clair, moderne et <strong>optimisé pour les logiciels de tri (ATS)</strong>.
            </li>
            <li>
              • Vous pouvez toujours <strong>modifier les textes, ajuster les couleurs ou retirer une section</strong> avant validation.
            </li>
            <li>
              • Votre CV final est prêt en quelques minutes et <strong>envoyé sur WhatsApp</strong> pour validation.
            </li>
          </ul>

          <button
            onClick={() => startFromOffer('ai')}
            className="w-full mt-5 py-2.5 rounded-lg font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Choisir Optimisée IA — 3 000 F
          </button>
        </Card>

        {/* PROFESSIONNEL */}
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-slate-900">🧠 Offre Professionnelle</h3>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-emerald-700">5 000 F CFA</div>
              <div className="text-xs text-slate-500">Paiement après validation</div>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-sm text-slate-700 leading-relaxed">
            <li>
              • Votre dossier est confié à un <strong>rédacteur professionnel</strong> expérimenté, spécialisé
              dans la rédaction et l’optimisation de CV.
            </li>
            <li>
              • Il prend le temps d’<strong>analyser votre profil</strong> pour reformuler vos phrases,
              hiérarchiser vos expériences et mettre en avant vos points forts.
            </li>
            <li>
              • Le rédacteur choisit les <strong>bons mots-clés et tournures</strong> pour rendre votre CV clair,
              fluide et adapté à votre métier ou secteur.
            </li>
            <li>
              • Vous échangez directement avec lui sur WhatsApp pour toute précision ou modification.
            </li>
            <li>
              • <strong>Livraison garantie en moins de 24 heures</strong> après validation de votre commande.
            </li>
          </ul>

          {/* Un seul bouton (plus de doublon) */}
          <button
            onClick={() => startFromOffer('pro')}
            className="w-full mt-5 py-2.5 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Choisir l’offre Professionnelle — 5 000 F
          </button>
        </Card>
      </div>

      {/* Mention bas de page */}
      <div className="text-sm text-slate-500">
        💬 Aucun paiement à l’avance — vous payez uniquement après validation de votre CV final sur WhatsApp.
      </div>
    </div>
  );
}
